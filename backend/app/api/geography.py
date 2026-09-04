"""
NERALIS Geospatial & Master Infrastructure Endpoints.
Uses Repository Layer (Supabase Cloud with local SQLite operational cache fallback).
"""

import datetime
import uuid

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.repository import repository
from app.db.models import (
    StateModel,
    DistrictModel,
    RoadSegmentModel,
    BridgeModel,
    SupplyDepotModel,
    CorridorStatusEventModel,
)
from app.data.states import NER_STATES, NER_DISTRICTS
from app.data.infrastructure import NER_ROAD_SEGMENTS, NER_BRIDGES, NER_DEPOTS
from app.core.logging_config import log_event

router = APIRouter(tags=["Geospatial & Infrastructure"])

VALID_CORRIDOR_STATUSES = {"OPEN", "RESTRICTED", "DEGRADED", "SEASONAL", "CLOSED"}

class CorridorStatusUpdateRequest(BaseModel):
    status: str
    reason: str | None = None
    reported_by: str | None = "Operator"

@router.get("/states")
def get_states():
    states, mode = repository.get_states()
    return {
        "states": states if states else NER_STATES,
        "storage_mode": mode
    }

@router.get("/districts")
def get_districts():
    districts, mode = repository.get_districts()
    return {
        "districts": districts if districts else NER_DISTRICTS,
        "storage_mode": mode
    }

@router.get("/corridors")
def get_corridors():
    corridors, mode = repository.get_corridors()
    return {
        "corridors": corridors if corridors else NER_ROAD_SEGMENTS,
        "storage_mode": mode
    }

@router.get("/bridges")
def get_bridges():
    bridges, mode = repository.get_bridges()
    return {
        "bridges": bridges if bridges else NER_BRIDGES,
        "storage_mode": mode
    }

@router.get("/depots")
def get_depots():
    depots, mode = repository.get_depots()
    return {
        "depots": depots if depots else NER_DEPOTS,
        "storage_mode": mode
    }

@router.put("/corridors/{corridor_id}/status")
@router.patch("/corridors/{corridor_id}/status")
def update_corridor_status(corridor_id: str, req: CorridorStatusUpdateRequest, db: Session = Depends(get_db)):
    """
    Updates the live accessibility status of a road corridor (field-verified or
    operator-issued status change) and propagates it to the routing graph,
    disruption forecasting, and GIS layers.
    """
    new_status = req.status.strip().upper()
    if new_status not in VALID_CORRIDOR_STATUSES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status '{req.status}'. Must be one of: {sorted(VALID_CORRIDOR_STATUSES)}"
        )

    segment = next((s for s in NER_ROAD_SEGMENTS if s["id"] == corridor_id), None)
    if not segment:
        raise HTTPException(status_code=404, detail=f"Corridor {corridor_id} not found")

    previous_status = segment.get("status")
    segment["status"] = new_status

    now_iso = datetime.datetime.now().isoformat()

    # Keep the DB-backed corridor record in sync, if present
    try:
        db_segment = db.query(RoadSegmentModel).filter(RoadSegmentModel.id == corridor_id).first()
        if db_segment:
            db_segment.status = new_status

        event = CorridorStatusEventModel(
            id=f"CSE-{uuid.uuid4().hex[:10].upper()}",
            corridor_id=corridor_id,
            status=new_status,
            onset_time=now_iso,
            reason=req.reason,
            reported_by=req.reported_by,
            event_data={"previous_status": previous_status}
        )
        db.add(event)
        db.commit()
    except Exception:
        db.rollback()

    log_event(
        event_type="CORRIDOR_STATUS_UPDATED",
        action="update_corridor_status",
        details={"corridor_id": corridor_id, "previous_status": previous_status, "new_status": new_status}
    )

    return {
        "status": "SUCCESS",
        "corridor_id": corridor_id,
        "previous_status": previous_status,
        "new_status": new_status,
        "updated_at": now_iso
    }

