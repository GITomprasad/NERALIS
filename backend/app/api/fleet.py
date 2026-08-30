"""
NERALIS Fleet Telemetry & Vehicle Tracking Endpoints.
"""

from fastapi import APIRouter, Query, Depends
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
import time

from app.services.fleet_telemetry import fleet_telemetry_engine
from app.db.database import get_db
from app.db.models import VehiclePositionModel
from app.core.logging_config import log_event

router = APIRouter(tags=["Fleet Telemetry"])

class TelemetryIngestRequest(BaseModel):
    vehicle_id: str
    lat: float
    lng: float
    speed_kmh: float
    heading_deg: Optional[float] = 0.0
    network_mode: Optional[str] = "NavIC"

@router.get("/fleet/vehicles")
def get_fleet_vehicles(
    is_demo: bool = Query(True),
    bbox: Optional[str] = Query(None, description="Bounding box filter: min_lat,min_lng,max_lat,max_lng"),
    state: Optional[str] = Query(None, description="Filter by state code e.g. AS, AR, MN")
):
    vehicles = fleet_telemetry_engine.get_all_vehicles(is_demo_mode=is_demo, bbox=bbox, state=state)
    return {"vehicles": vehicles}

@router.get("/fleet/playback/{vehicle_id}")
def get_vehicle_playback(vehicle_id: str):
    return fleet_telemetry_engine.get_trip_playback(vehicle_id)

@router.post("/telemetry/ingest")
def ingest_telemetry(req: TelemetryIngestRequest, db: Session = Depends(get_db)):
    t0 = time.time()
    res = fleet_telemetry_engine.ingest_telemetry(req.model_dump())
    
    # Store position point in database
    try:
        pos_entry = VehiclePositionModel(
            vehicle_id=req.vehicle_id,
            lat=req.lat,
            lng=req.lng,
            speed_kmh=req.speed_kmh,
            heading_deg=req.heading_deg,
            network_mode=req.network_mode,
            is_simulated=False
        )
        db.add(pos_entry)
        db.commit()
    except Exception:
        db.rollback()

    latency = (time.time() - t0) * 1000.0
    log_event(
        event_type="TELEMETRY_INGEST",
        action="ingest_telemetry",
        latency_ms=latency,
        details={"vehicle_id": req.vehicle_id, "speed": req.speed_kmh}
    )
    return res
