"""
NERALIS Multilingual Alerts & NDMA CAP XML Endpoints.
"""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import Response
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session

from app.services.alert_dispatcher import alert_dispatcher
from app.db.database import get_db
from app.db.models import DisasterAlertModel, AuditLogModel
from app.core.logging_config import log_event

router = APIRouter(tags=["Alert Center"])

class AlertCreateRequest(BaseModel):
    tier: str
    tier_level: int
    title: str
    corridor_id: str
    affected_districts: List[str]
    trigger_condition: str
    channels: List[str]
    message_en: str
    message_hi: Optional[str] = None
    recipients_count: Optional[int] = 150

class AlertDispatchRequest(BaseModel):
    channels: Optional[List[str]] = None

class AlertAckRequest(BaseModel):
    acknowledged_by: Optional[str] = "Operator"

@router.get("/alerts")
def get_alerts(db: Session = Depends(get_db)):
    try:
        alerts_db = db.query(DisasterAlertModel).all()
        if alerts_db:
            return {"alerts": [{k: v for k, v in a.__dict__.items() if not k.startswith("_")} for a in alerts_db]}
    except Exception:
        pass
    return {"alerts": alert_dispatcher.get_alerts()}

@router.post("/alerts")
def create_alert(req: AlertCreateRequest, db: Session = Depends(get_db)):
    alert_obj = alert_dispatcher.create_alert(req.model_dump())
    
    # Store in database
    try:
        db_alert = DisasterAlertModel(**alert_obj)
        db.add(db_alert)
        
        # Log to audit log
        audit = AuditLogModel(
            event_type="ALERT_CREATED",
            actor="SYSTEM_OR_OPERATOR",
            role="DISASTER_OPS",
            endpoint="/api/alerts",
            payload_summary={"alert_id": alert_obj["id"], "tier": alert_obj["tier"], "title": alert_obj["title"]},
            outcome="CREATED"
        )
        db.add(audit)
        db.commit()
    except Exception:
        db.rollback()

    log_event(
        event_type="DISASTER_ALERT_CREATED",
        action="create_alert",
        details={"alert_id": alert_obj["id"], "tier": alert_obj["tier"]}
    )
    return alert_obj

@router.post("/alerts/{alert_id}/dispatch")
def dispatch_alert(alert_id: str, req: Optional[AlertDispatchRequest] = None, db: Session = Depends(get_db)):
    channels = req.channels if req else None
    res = alert_dispatcher.dispatch_alert(alert_id, channels=channels)
    if res.get("status") == "NOT_FOUND":
        raise HTTPException(status_code=404, detail=f"Alert {alert_id} not found")
    
    # Record audit log
    try:
        audit = AuditLogModel(
            event_type="ALERT_DISPATCHED",
            actor="OPERATOR",
            role="DISASTER_OPS",
            endpoint=f"/api/alerts/{alert_id}/dispatch",
            payload_summary=res,
            outcome="SUCCESS"
        )
        db.add(audit)
        db.commit()
    except Exception:
        db.rollback()

    log_event(
        event_type="ALERT_DISPATCHED",
        action="dispatch_alert",
        details=res
    )
    return res

@router.post("/alerts/{alert_id}/ack")
def acknowledge_alert(alert_id: str, req: Optional[AlertAckRequest] = None, db: Session = Depends(get_db)):
    acknowledged_by = req.acknowledged_by if req and req.acknowledged_by else "Operator"
    res = alert_dispatcher.acknowledge_alert(alert_id, acknowledged_by=acknowledged_by)
    if res.get("status") == "NOT_FOUND":
        raise HTTPException(status_code=404, detail=f"Alert {alert_id} not found")

    # Reflect acknowledgement in the persisted record, if present
    try:
        db_alert = db.query(DisasterAlertModel).filter(DisasterAlertModel.id == alert_id).first()
        if db_alert:
            db_alert.acknowledged = True
            db_alert.acknowledged_by = acknowledged_by

        audit = AuditLogModel(
            event_type="ALERT_ACKNOWLEDGED",
            actor=acknowledged_by,
            role="DISASTER_OPS",
            endpoint=f"/api/alerts/{alert_id}/ack",
            payload_summary=res,
            outcome="SUCCESS"
        )
        db.add(audit)
        db.commit()
    except Exception:
        db.rollback()

    log_event(
        event_type="ALERT_ACKNOWLEDGED",
        action="acknowledge_alert",
        details=res
    )
    return res

@router.get("/alerts/{alert_id}/cap-xml")
def get_cap_xml(alert_id: str):
    xml_content = alert_dispatcher.generate_cap_xml(alert_id)
    return Response(content=xml_content, media_type="application/xml")

@router.get("/alerts/morning-briefing")
def get_morning_briefing():
    return alert_dispatcher.get_morning_briefing()
