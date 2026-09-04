"""
NERALIS Multilingual Alerts & NDMA CAP XML Endpoints.
Integrated with Hybrid Repository (Supabase Cloud + local SQLite cache).
"""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import Response
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from app.services.alert_dispatcher import alert_dispatcher
from app.db.repository import repository
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

@router.get("/alerts")
def get_alerts():
    alerts, mode = repository.get_alerts()
    if alerts:
        return {"alerts": alerts, "storage_mode": mode}
    return {"alerts": alert_dispatcher.get_alerts(), "storage_mode": mode}

@router.post("/alerts")
def create_alert(req: AlertCreateRequest):
    alert_obj = alert_dispatcher.create_alert(req.model_dump())
    res = repository.create_alert(alert_obj)
    alert_obj["storage_mode"] = res.get("storage_mode")

    log_event(
        event_type="DISASTER_ALERT_CREATED",
        action="create_alert",
        details={"alert_id": alert_obj["id"], "tier": alert_obj["tier"]}
    )
    return alert_obj

@router.post("/alerts/{alert_id}/dispatch")
def dispatch_alert(alert_id: str, req: Optional[AlertDispatchRequest] = None):
    channels = req.channels if req else None
    result = alert_dispatcher.dispatch_alert(alert_id, channels)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result

@router.get("/alerts/{alert_id}/cap-xml")
def export_cap_xml(alert_id: str):
    xml_data = alert_dispatcher.generate_cap_xml(alert_id)
    if not xml_data:
        raise HTTPException(status_code=404, detail=f"Alert {alert_id} not found")
    return Response(content=xml_data, media_type="application/xml")

@router.get("/alerts/morning-briefing")
def get_morning_briefing():
    return alert_dispatcher.get_morning_briefing()
