"""
NERALIS Evaluated ML Disruption Forecasting & Digital Twin Endpoints.
Caches predictions in local SQLite cache for offline availability.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

from app.services.disruption_forecasting import disruption_engine
from app.db.repository import repository
from app.ml.disruption_model import ml_disruption_model
from app.core.logging_config import log_event

router = APIRouter(tags=["Predictive Intelligence"])

class DigitalTwinRequest(BaseModel):
    incident_type: str  # "BRIDGE_COLLAPSE" or "HIGHWAY_BLOCKADE"
    target_id: str

class CorridorPredictionRequest(BaseModel):
    corridor_id: str
    forecast_hours: Optional[int] = 24
    custom_rain_mm: Optional[float] = None
    custom_soil_pct: Optional[float] = None

@router.get("/predictions/forecast")
@router.get("/predictions/72h")
def get_predictions_forecast(hours: int = 24):
    try:
        data = disruption_engine.get_forecast(forecast_hours_ahead=hours)
        # Cache for offline resilience
        repository.cache_prediction(hours, data)
        return data
    except Exception:
        cached = repository.get_cached_prediction(hours)
        if cached:
            return cached
        raise

@router.get("/predictions/model-metrics")
def get_model_metrics():
    return disruption_engine.get_model_evaluation_metrics()

@router.get("/predictions/feature-importance")
def get_feature_importance():
    metrics = disruption_engine.get_model_evaluation_metrics()
    return {"feature_importance": metrics.get("feature_importance", [])}

@router.get("/predictions/corridor/{corridor_id}")
def get_corridor_prediction(corridor_id: str, hours: int = 24, rain_mm: Optional[float] = None):
    return ml_disruption_model.predict_corridor_disruption(
        corridor_id=corridor_id,
        forecast_hours=hours,
        custom_rain_mm=rain_mm
    )

@router.post("/predictions/corridor")
def predict_corridor(req: CorridorPredictionRequest):
    return ml_disruption_model.predict_corridor_disruption(
        corridor_id=req.corridor_id,
        forecast_hours=req.forecast_hours or 24,
        custom_rain_mm=req.custom_rain_mm,
        custom_soil_pct=req.custom_soil_pct
    )

@router.get("/predictions/history")
def get_historical_disruptions(limit: int = 50, year: Optional[int] = None):
    return {"history": disruption_engine.get_historical_events(limit=limit, year=year)}

@router.get("/predictions/prepositioning")
def get_prepositioning():
    advisories = disruption_engine.get_prepositioning_advisories()
    return {"advisories": advisories}

@router.post("/predictions/digital-twin")
def run_digital_twin_simulation(req: DigitalTwinRequest):
    res = disruption_engine.simulate_digital_twin_scenario(req.incident_type, req.target_id)
    log_event(
        event_type="DIGITAL_TWIN_SIMULATION",
        action="simulate_scenario",
        details={"incident_type": req.incident_type, "target_id": req.target_id}
    )
    return res

