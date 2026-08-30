"""
NERALIS AI Multi-Objective Route Optimizer Endpoint.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import time

from app.services.routing_engine import routing_engine
from app.core.logging_config import log_event

router = APIRouter(tags=["Route Optimization"])

class RouteOptimizeRequest(BaseModel):
    origin: str
    destination: str
    cargo_type: Optional[str] = "STANDARD_COMMERCIAL"
    vehicle_weight_tons: Optional[float] = 16.0
    departure_hour: Optional[int] = 8
    include_intermodal: Optional[bool] = True

@router.post("/routes/optimize")
def optimize_route(req: RouteOptimizeRequest):
    t0 = time.time()
    result = routing_engine.optimize_route(
        origin_id=req.origin,
        destination_id=req.destination,
        cargo_type=req.cargo_type,
        vehicle_weight_tons=req.vehicle_weight_tons,
        departure_hour=req.departure_hour,
        include_intermodal=req.include_intermodal
    )
    latency = (time.time() - t0) * 1000.0
    log_event(
        event_type="ROUTE_OPTIMIZATION",
        action="optimize_route",
        latency_ms=latency,
        details={"origin": req.origin, "destination": req.destination, "cargo": req.cargo_type}
    )
    return result
