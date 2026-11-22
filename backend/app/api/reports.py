"""
NERALIS Field Reporting, Leaderboard & Executive Reporting Endpoints.
Uses Repository for seamless Supabase + offline SQLite queueing.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from app.services.field_reporting import field_reporting_engine
from app.services.report_generator import report_generator
from app.db.repository import repository
from app.core.logging_config import log_event

router = APIRouter(tags=["Field & Executive Reporting"])

class FieldReportCreateRequest(BaseModel):
    client_event_id: Optional[str] = None
    reporter_name: str
    reporter_role: str
    state: str
    district: str
    location_name: str
    lat: float
    lng: float
    incident_type: str
    crack_length_m: Optional[float] = 0.0
    pothole_depth_cm: Optional[float] = 0.0
    debris_volume_cum: Optional[float] = 0.0
    photo_url: Optional[str] = None

@router.get("/reports/field")
def get_field_reports():
    reports, mode = repository.get_field_reports()
    if reports:
        return {"reports": reports, "storage_mode": mode}
    return {"reports": field_reporting_engine.get_reports(), "storage_mode": mode}

@router.post("/reports/field")
def submit_field_report(req: FieldReportCreateRequest):
    res = field_reporting_engine.submit_report(req.model_dump())
    db_res = repository.submit_field_report(res)
    res["storage_mode"] = db_res.get("storage_mode")

    log_event(
        event_type="FIELD_REPORT",
        action="submit_report",
        details={"report_id": res["id"], "client_id": req.client_event_id, "incident": req.incident_type}
    )
    return res

@router.get("/reports/leaderboard")
def get_leaderboard():
    return {"leaderboard": field_reporting_engine.get_leaderboard()}

@router.get("/reports/parliament")
def get_parliament_brief():
    return report_generator.get_parliament_brief()

@router.get("/reports/state-comparative")
def get_state_comparative():
    return {"comparative_stats": report_generator.get_comparative_state_analytics()}
