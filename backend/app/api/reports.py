"""
NERALIS Field Reporting, Leaderboard & Executive Reporting Endpoints.
"""

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session

from app.services.field_reporting import field_reporting_engine
from app.services.report_generator import report_generator
from app.db.database import get_db
from app.db.models import FieldReportModel, AuditLogModel
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
def get_field_reports(db: Session = Depends(get_db)):
    try:
        reports_db = db.query(FieldReportModel).all()
        if reports_db:
            return {"reports": [{k: v for k, v in r.__dict__.items() if not k.startswith("_")} for r in reports_db]}
    except Exception:
        pass
    return {"reports": field_reporting_engine.get_reports()}

@router.post("/reports/field")
def submit_field_report(req: FieldReportCreateRequest, db: Session = Depends(get_db)):
    # Idempotency check with client_event_id
    if req.client_event_id:
        existing = db.query(FieldReportModel).filter(FieldReportModel.client_event_id == req.client_event_id).first()
        if existing:
            return {k: v for k, v in existing.__dict__.items() if not k.startswith("_")}

    res = field_reporting_engine.submit_report(req.model_dump())
    
    # Store in database
    try:
        db_report = FieldReportModel(**res)
        db.add(db_report)
        
        audit = AuditLogModel(
            event_type="FIELD_REPORT_SUBMITTED",
            actor=req.reporter_name,
            role=req.reporter_role,
            endpoint="/api/reports/field",
            payload_summary={"report_id": res["id"], "incident_type": req.incident_type, "severity": res["ai_severity_predicted"]},
            outcome="VERIFIED_QUEUED"
        )
        db.add(audit)
        db.commit()
    except Exception:
        db.rollback()

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

@router.get("/reports/audit")
def get_audit_logs(limit: int = 50, db: Session = Depends(get_db)):
    """
    Returns recent immutable audit logs for decision tracing and compliance auditing.
    """
    try:
        logs = db.query(AuditLogModel).order_by(AuditLogModel.id.desc()).limit(limit).all()
        return {"audit_logs": [{k: v for k, v in l.__dict__.items() if not k.startswith("_")} for l in logs]}
    except Exception:
        return {"audit_logs": []}
