"""
FastAPI Backend Application Entrypoint for NERALIS.
Evidence-backed Smart Logistics & Accessibility Intelligence Platform for NER.
Hybrid Architecture: Supabase Cloud (PostgreSQL) + Local SQLite Operational Cache.
"""

from fastapi import FastAPI, HTTPException, Query, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.seed import init_and_seed_db
from app.db.repository import repository
from app.db.sync import sync_service

from app.data.ner_geography import (
    NER_STATES,
    NER_DISTRICTS,
    NER_ROAD_SEGMENTS,
    NER_BRIDGES,
    NER_DEPOTS,
    NER_SOURCE_REGISTRY,
    HISTORICAL_DISRUPTIONS
)
from app.services.routing_engine import routing_engine
from app.services.disruption_forecasting import disruption_engine
from app.services.fleet_telemetry import fleet_telemetry_engine
from app.services.alert_dispatcher import alert_dispatcher
from app.services.field_reporting import field_reporting_engine
from app.services.report_generator import report_generator

# Import modular API routers
from app.api.auth import router as auth_router
from app.api.alerts import router as alerts_router
from app.api.fleet import router as fleet_router
from app.api.geography import router as geography_router
from app.api.health import router as health_router
from app.api.predictions import router as predictions_router
from app.api.reports import router as reports_router
from app.api.routes import router as routes_router
from app.api.sources import router as sources_router
from app.api.sync import router as sync_router

app = FastAPI(
    title="NERALIS - AI Smart Logistics & Accessibility Intelligence Platform for NER",
    description="AI-Powered Logistics & Accessibility Intelligence Platform with Supabase + SQLite Hybrid Architecture",
    version="2.3.0"
)

# Enable CORS for frontend development & production deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Lifecycle Event: Database Initialization & Seeding ───────────────────────────
@app.on_event("startup")
def on_startup():
    """Initializes SQLite/PostgreSQL schema and seeds master datasets on startup."""
    try:
        init_and_seed_db()
    except Exception as e:
        print(f"[Warning] Database auto-seed encountered: {e}")

# ── Mount Modular API Routers ──────────────────────────────────────────────────
app.include_router(auth_router, prefix="/api")
app.include_router(health_router, prefix="/api")
app.include_router(sources_router, prefix="/api")
app.include_router(geography_router, prefix="/api")
app.include_router(routes_router, prefix="/api")
app.include_router(fleet_router, prefix="/api")
app.include_router(predictions_router, prefix="/api")
app.include_router(alerts_router, prefix="/api")
app.include_router(reports_router, prefix="/api")
app.include_router(sync_router, prefix="/api")


# ── Additional Mutators & Cross-Workflow Endpoints ─────────────────────────────

class CorridorStatusUpdateRequest(BaseModel):
    status: str
    hazard_type: Optional[str] = None
    risk_score: Optional[int] = None

class BridgeStatusUpdateRequest(BaseModel):
    status: str
    structural_health_pct: Optional[int] = None

class FleetDispatchRequest(BaseModel):
    route_tag: str
    origin: str
    destination: str
    cargo_type: str
    vehicle_weight_tons: float
    vehicle_id: Optional[str] = "AS-01-GC-4921"

@app.put("/api/corridors/{corridor_id}/status")
def update_corridor_status(corridor_id: str, req: CorridorStatusUpdateRequest):
    """Updates status for a road corridor via Repository (Cloud + Local Cache)."""
    corridor = next((c for c in NER_ROAD_SEGMENTS if c["id"] == corridor_id), None)
    if not corridor:
        raise HTTPException(status_code=404, detail=f"Corridor {corridor_id} not found")
    
    corridor["status"] = req.status
    if req.hazard_type:
        corridor["hazard_type"] = req.hazard_type
    if req.risk_score is not None:
        corridor["risk_score"] = req.risk_score

    # Persist via unified repository
    res = repository.update_corridor_status(
        corridor_id=corridor_id,
        status=req.status,
        hazard_type=req.hazard_type,
        risk_score=req.risk_score
    )
    return {"status": "SUCCESS", "corridor": corridor, "storage_mode": res.get("storage_mode")}

@app.put("/api/bridges/{bridge_id}/status")
def update_bridge_status(bridge_id: str, req: BridgeStatusUpdateRequest):
    """Updates status for a strategic bridge via Repository (Cloud + Local Cache)."""
    bridge = next((b for b in NER_BRIDGES if b["id"] == bridge_id), None)
    if not bridge:
        raise HTTPException(status_code=404, detail=f"Bridge {bridge_id} not found")
    
    bridge["status"] = req.status
    if req.structural_health_pct is not None:
        bridge["structural_health_pct"] = req.structural_health_pct

    res = repository.update_bridge_status(
        bridge_id=bridge_id,
        status=req.status,
        structural_health_pct=req.structural_health_pct
    )
    return {"status": "SUCCESS", "bridge": bridge, "storage_mode": res.get("storage_mode")}

@app.put("/api/alerts/{alert_id}/ack")
def acknowledge_alert(alert_id: str):
    """Acknowledges an emergency alert via Repository (Cloud + Local Cache)."""
    res = repository.acknowledge_alert(alert_id=alert_id, acknowledged_by="Operator")
    return {"status": "SUCCESS", "alert_id": alert_id, "storage_mode": res.get("storage_mode")}

@app.post("/api/fleet/dispatch")
def dispatch_fleet_convoy(req: FleetDispatchRequest):
    """Locks a calculated route and assigns it to a fleet vehicle dispatch."""
    vehicle = next((v for v in fleet_telemetry_engine.vehicles if v["id"] == req.vehicle_id), None)
    if vehicle:
        vehicle["status"] = "IN_TRANSIT"
        vehicle["origin"] = req.origin
        vehicle["destination"] = req.destination
        vehicle["cargo_type"] = req.cargo_type
        vehicle["cargo_weight_tons"] = req.vehicle_weight_tons
        vehicle["assigned_route_tag"] = req.route_tag
    
    res = repository.dispatch_vehicle(
        vehicle_id=req.vehicle_id or "VEH-01",
        dispatch_payload={
            "route_tag": req.route_tag,
            "origin": req.origin,
            "destination": req.destination,
            "cargo_type": req.cargo_type,
            "vehicle_weight_tons": req.vehicle_weight_tons
        }
    )
    return {
        "status": "DISPATCHED",
        "dispatch_id": f"DSP-{req.vehicle_id}-{req.route_tag}",
        "vehicle_id": req.vehicle_id,
        "origin": req.origin,
        "destination": req.destination,
        "cargo_type": req.cargo_type,
        "assigned_route": req.route_tag,
        "storage_mode": res.get("storage_mode")
    }
