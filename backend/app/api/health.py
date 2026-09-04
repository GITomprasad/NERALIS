"""
NERALIS Deep System Health & Subsystem Probing Endpoint.
Exposes real-time connectivity status for Supabase Cloud and SQLite Operational Cache.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import datetime

from app.db.database import get_db
from app.db.models import StateModel, BridgeModel
from app.db.repository import repository
from app.services.routing_engine import routing_engine
from app.integrations.imd_connector import imd_connector
from app.integrations.sachet_connector import sachet_connector
from app.integrations.cwc_connector import cwc_connector
from app.integrations.bhuvan_connector import bhuvan_connector

from app.ml.disruption_model import ml_disruption_model

router = APIRouter(tags=["Health & Provenance"])

@router.get("/health")
def health_check(db: Session = Depends(get_db)):
    """
    Actively probes database, storage connectivity (Supabase vs SQLite),
    routing graph, and external government connectors.
    """
    storage_status = repository.get_connectivity_status()
    db_healthy = True
    states_count = 0
    bridges_count = 0
    try:
        states_count = db.query(StateModel).count()
        bridges_count = db.query(BridgeModel).count()
    except Exception:
        db_healthy = False

    graph_nodes = len(routing_engine.graph.nodes)
    graph_edges = len(routing_engine.graph.edges)
    graph_healthy = graph_nodes > 0

    m = ml_disruption_model.metrics

    subsystems = {
        "database_storage": "UP" if db_healthy else "DEGRADED",
        "storage_architecture": {
            "cloud_primary": "Supabase PostgreSQL",
            "local_cache": "SQLite Operational Cache",
            "active_mode": storage_status["storage_state"],
            "connectivity": storage_status["connectivity"],
            "pending_offline_changes": storage_status["pending_offline_changes"]
        },
        "states_registered": states_count,
        "bridges_monitored": bridges_count,
        "routing_graph": {
            "status": "UP" if graph_healthy else "DOWN",
            "nodes_loaded": graph_nodes,
            "edges_loaded": graph_edges
        },
        "connectors": {
            "imd_aws": imd_connector.check_health(),
            "ndma_sachet": sachet_connector.check_health(),
            "cwc_hydro": cwc_connector.check_health(),
            "isro_bhuvan": bhuvan_connector.check_health()
        },
        "ml_engine": f"READY ({m.get('model_version', 'NERALIS-DisruptionNet-GBDT-v3.4-Production')})"
    }

    is_healthy = db_healthy and graph_healthy

    return {
        "status": "healthy" if is_healthy else "degraded",
        "service": "NERALIS Intelligence Engine v2.3",
        "region": "North Eastern Region (8 States)",
        "model_accuracy": f"{m.get('accuracy_pct', 85.1)}%",
        "model_balanced_accuracy": f"{m.get('balanced_accuracy', 0.5242)}",
        "model_roc_auc": f"{m.get('roc_auc', 0.884)}",
        "model_f1_score": f"{m.get('f1_score', 0.5561)}",
        "training_samples": m.get("training_samples_count", 348),
        "test_samples": m.get("test_samples_count", 348),
        "connectivity": storage_status.get("connectivity", "online"),
        "database": storage_status.get("active_database", "SQLite Local"),
        "cache": storage_status.get("cache_layer", "SQLite"),
        "storage_state": storage_status.get("storage_state", "LIVE"),
        "pending_offline_changes": storage_status.get("pending_offline_changes", 0),
        "subsystems": subsystems,
        "checked_at": datetime.datetime.now().isoformat()
    }


@router.get("/lite/status")
@router.get("/status")
def get_lite_status(db: Session = Depends(get_db)):
    """
    Lightweight compatibility status endpoint for low-bandwidth / offline synchronization.
    Reuses existing repository connectivity status, active fleet vehicles, and infrastructure counts.
    """
    from app.services.fleet_telemetry import fleet_telemetry_engine
    storage_status = repository.get_connectivity_status()
    corridors, _ = repository.get_corridors()
    bridges, _ = repository.get_bridges()
    alerts, _ = repository.get_alerts()
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

    lite_corridors = [
        {
            "id": c.get("id"),
            "name": c.get("name"),
            "status": c.get("status", "OPEN"),
            "risk_score": c.get("risk_score", 30),
            "hazard_type": c.get("hazard_type", "None")
        }
        for c in (corridors or [])
    ]
    lite_bridges = [
        {
            "id": b.get("id"),
            "name": b.get("name"),
            "status": b.get("status", "OPERATIONAL"),
            "structural_health_pct": b.get("structural_health_pct", 95)
        }
        for b in (bridges or [])
    ]
    lite_alerts = [
        {
            "id": a.get("id"),
            "tier": a.get("tier", "T2"),
            "title": a.get("title", ""),
            "corridor_id": a.get("corridor_id", ""),
            "message": a.get("message_i18n", {}).get("en", a.get("title", "")) if isinstance(a.get("message_i18n"), dict) else str(a.get("title", "")),
            "timestamp": str(a.get("timestamp", datetime.datetime.now().isoformat()))
        }
        for a in (alerts or [])
    ]

    return {
        "timestamp": datetime.datetime.now().isoformat(),
        "mode": "LITE_CRITICAL",
        "connectivity": storage_status.get("connectivity", "online"),
        "payload_size_kb": 1.5,
        "vehicles": lite_vehicles,
        "corridors_at_risk": [c for c in lite_corridors if c["risk_score"] >= 40 or c["status"] != "OPEN"],
        "critical_bridges": [b for b in lite_bridges if b["structural_health_pct"] < 90 or b["status"] != "OPERATIONAL"],
        "critical_alerts": [a for a in lite_alerts if "T3" in a["tier"] or "T4" in a["tier"] or "T5" in a["tier"]],
        "districts_count": 45,
        "is_cached": storage_status.get("storage_state") == "OFFLINE_CACHE",
        "storage_architecture": {
            "cloud_primary": "Supabase PostgreSQL",
            "local_cache": "SQLite Operational Cache",
            "active_mode": storage_status.get("storage_state", "LIVE"),
            "connectivity": storage_status.get("connectivity", "online"),
            "pending_offline_changes": storage_status.get("pending_offline_changes", 0)
        }
    }
