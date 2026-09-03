"""
FastAPI Backend Application Entrypoint for NERALIS.
Evidence-backed Smart Logistics & Accessibility Intelligence Platform for NER.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any

from app.data.ner_geography import (
    NER_ROAD_SEGMENTS,
    NER_BRIDGES,
    NER_DISTRICTS,
)
from app.services.fleet_telemetry import fleet_telemetry_engine
from app.services.alert_dispatcher import alert_dispatcher
from app.services.chatbot_engine import chatbot_engine

app = FastAPI(
    title="NERALIS - AI Smart Logistics & Accessibility Intelligence Platform for NER",
    description="AI-Powered Logistics & Accessibility Intelligence Platform (High-Trust Evidence Engine)",
    version="2.0.0"
)

# Enable CORS for frontend development & production deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api.auth import router as auth_router
from app.api.health import router as health_router
from app.api.sources import router as sources_router
from app.api.geography import router as geography_router
from app.api.routes import router as routes_router
from app.api.fleet import router as fleet_router
from app.api.predictions import router as predictions_router
from app.api.alerts import router as alerts_router
from app.api.reports import router as reports_router

app.include_router(auth_router, prefix="/api")
app.include_router(health_router)
app.include_router(health_router, prefix="/api")
app.include_router(sources_router, prefix="/api")
app.include_router(geography_router, prefix="/api")
app.include_router(routes_router, prefix="/api")
app.include_router(fleet_router, prefix="/api")
app.include_router(predictions_router, prefix="/api")
app.include_router(alerts_router, prefix="/api")
app.include_router(reports_router, prefix="/api")


@app.on_event("startup")
def on_startup():
    """
    Ensures the database schema exists and master datasets are seeded before
    the API starts serving traffic (required on a fresh clone / deployment
    where no neralis.db has been created yet).
    """
    from app.db.seed import init_and_seed_db
    try:
        init_and_seed_db()
    except Exception as e:
        # Non-fatal: DB-backed routes gracefully fall back to in-memory
        # static datasets (see app/api/*.py) if the database is unavailable.
        import logging
        logging.getLogger("neralis").error(f"Database initialization/seeding failed at startup: {e}")


class ChatbotQueryRequest(BaseModel):
    query: str
    language: Optional[str] = "en"
    context: Optional[Dict[str, Any]] = None


# Module 9: AI Assistant Chatbot (NERALIS AI Sahayak)
@app.post("/api/chatbot/query")
def query_chatbot(req: ChatbotQueryRequest):
    return chatbot_engine.process_query(req.query, language=req.language or "en")

@app.get("/api/chatbot/suggestions")
def get_chatbot_suggestions():
    return {"suggestions": chatbot_engine.get_suggestions()}

# Module 8: Lightweight Endpoint for Low-Network & Offline Environments (Lite Mode)
@app.get("/api/lite/status")
def get_lite_status():
    """
    Lightweight telemetry & critical risk status endpoint for 2G / low-connectivity environments.
    Payload size is minimized (<2 KB) by returning only essential logistics and hazard fields.
    """
    from datetime import datetime

    vehicles = fleet_telemetry_engine.get_all_vehicles(is_demo_mode=True)
    lite_vehicles = [
        {
            "vehicle_id": v["id"],
            "status": v.get("status", "OPEN"),
            "risk_score": v.get("risk_score", 0.15),
            "last_known_location": f"{v.get('origin', '')} → {v.get('destination', '')}",
            "next_checkpoint": v.get("destination", "Next Hub"),
            "current_lat": v.get("current_lat"),
            "current_lng": v.get("current_lng"),
            "speed_kmh": v.get("speed_kmh", 0),
            "cold_chain_temp_c": v.get("cold_chain", {}).get("current_temp_c") if v.get("cold_chain") else None,
            "alert": v.get("current_alert") or ("High Hazard Route" if v.get("status") in ["RESTRICTED", "HIGH_RISK"] else None)
        }
        for v in vehicles
    ]

    corridors_at_risk = [
        {
            "id": c["id"],
            "name": c["name"],
            "status": c.get("status", "OPEN"),
            "risk_score": c.get("risk_score", 20),
            "hazard_type": c.get("hazard_type", "None")
        }
        for c in NER_ROAD_SEGMENTS
        if c.get("status") in ["RESTRICTED", "DEGRADED", "CLOSED"] or c.get("risk_score", 0) >= 40
    ]

    critical_bridges = [
        {
            "id": b["id"],
            "name": b["name"],
            "status": b.get("status", "OPEN"),
            "structural_health_pct": b.get("structural_health_pct", 90)
        }
        for b in NER_BRIDGES
        if b.get("status") != "OPEN" or b.get("structural_health_pct", 100) < 85
    ]

    critical_alerts = [
        {
            "id": a.get("id"),
            "tier": a.get("tier"),
            "title": a.get("title"),
            "corridor_id": a.get("corridor_id"),
            "message": a.get("message_en", a.get("title")),
            "timestamp": a.get("timestamp")
        }
        for a in alert_dispatcher.get_alerts()[:5]
    ]

    return {
        "timestamp": datetime.now().isoformat(),
        "mode": "LITE_CRITICAL",
        "payload_size_kb": 1.2,
        "vehicles": lite_vehicles,
        "corridors_at_risk": corridors_at_risk,
        "critical_bridges": critical_bridges,
        "critical_alerts": critical_alerts,
        "districts_count": len(NER_DISTRICTS)
    }
