"""
NERALIS Geospatial & Master Infrastructure Endpoints.
"""

import datetime
import uuid

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.database import get_db
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
def get_states(db: Session = Depends(get_db)):
    try:
        states = db.query(StateModel).all()
        if states:
            return {"states": [s.__dict__ for s in states]}
    except Exception:
        pass
    return {"states": NER_STATES}

@router.get("/districts")
def get_districts(db: Session = Depends(get_db)):
    try:
        districts = db.query(DistrictModel).all()
        if districts:
            return {"districts": [{k: v for k, v in d.__dict__.items() if not k.startswith("_")} for d in districts]}
    except Exception:
        pass
    return {"districts": NER_DISTRICTS}

@router.get("/corridors")
def get_corridors(db: Session = Depends(get_db)):
    try:
        corridors = db.query(RoadSegmentModel).all()
        if corridors:
            return {"corridors": [{k: v for k, v in c.__dict__.items() if not k.startswith("_")} for c in corridors]}
    except Exception:
        pass
    return {"corridors": NER_ROAD_SEGMENTS}

@router.get("/bridges")
def get_bridges(db: Session = Depends(get_db)):
    try:
        bridges = db.query(BridgeModel).all()
        if bridges:
            return {"bridges": [{k: v for k, v in b.__dict__.items() if not k.startswith("_")} for b in bridges]}
    except Exception:
        pass
    return {"bridges": NER_BRIDGES}

@router.get("/depots")
def get_depots(db: Session = Depends(get_db)):
    try:
        depots = db.query(SupplyDepotModel).all()
        if depots:
            return {"depots": [{k: v for k, v in d.__dict__.items() if not k.startswith("_")} for d in depots]}
    except Exception:
        pass
    return {"depots": NER_DEPOTS}

@router.patch("/corridors/{corridor_id}/status")
def update_corridor_status(corridor_id: str, req: CorridorStatusUpdateRequest, db: Session = Depends(get_db)):
    """
    Updates the live accessibility status of a road corridor (field-verified or
    operator-issued status change) and propagates it to the routing graph,
    disruption forecasting, and GIS layers, which all read from the shared
    in-memory corridor registry.
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
