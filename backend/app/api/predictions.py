"""
NERALIS Evaluated ML Disruption Forecasting & Digital Twin Endpoints.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

from app.services.disruption_forecasting import disruption_engine
from app.core.logging_config import log_event

router = APIRouter(tags=["Predictive Intelligence"])

class DigitalTwinRequest(BaseModel):
    incident_type: str  # "BRIDGE_COLLAPSE" or "HIGHWAY_BLOCKADE"
    target_id: str

@router.get("/predictions/forecast")
def get_predictions_forecast(hours: int = 24):
    return disruption_engine.get_forecast(forecast_hours_ahead=hours)

# Legacy alias for backwards compatibility
@router.get("/predictions/72h")
def get_72h_predictions(hours: int = 24):
    return disruption_engine.get_forecast(forecast_hours_ahead=hours)

@router.get("/predictions/model-metrics")
def get_model_metrics():
    return disruption_engine.get_model_evaluation_metrics()

@router.get("/predictions/history")
def get_historical_disruptions(limit: int = 50, year: Optional[int] = None):
    return {"history": disruption_engine.get_historical_events(limit=limit, year=year)}

@router.get("/predictions/prepositioning")
def get_prepositioning():
    return {"advisories": disruption_engine.get_prepositioning_advisories()}

@router.post("/predictions/digital-twin")
def run_digital_twin_simulation(req: DigitalTwinRequest):
    res = disruption_engine.simulate_digital_twin_scenario(req.incident_type, req.target_id)
    log_event(
        event_type="DIGITAL_TWIN_SIMULATION",
        action="simulate_scenario",
        details={"incident_type": req.incident_type, "target_id": req.target_id}
    )
    return res
