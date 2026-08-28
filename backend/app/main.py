"""
FastAPI Backend Application Entrypoint for NERALIS.
Evidence-backed Smart Logistics & Accessibility Intelligence Platform for NER.
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import time

from app.core.config import settings
from app.core.logging_config import log_event
from app.db.seed import init_and_seed_db

from app.api.health import router as health_router
from app.api.sources import router as sources_router
from app.api.geography import router as geography_router
from app.api.routes import router as routes_router
from app.api.fleet import router as fleet_router
from app.api.predictions import router as predictions_router
from app.api.alerts import router as alerts_router
from app.api.reports import router as reports_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize database & seed master reference data
    init_and_seed_db()
    log_event(event_type="SYSTEM_STARTUP", action="database_initialized", outcome="SUCCESS")
    yield
    # Shutdown: Clean up resources
    log_event(event_type="SYSTEM_SHUTDOWN", action="service_stopped", outcome="SUCCESS")

app = FastAPI(
    title="NERALIS - AI Smart Logistics & Accessibility Intelligence Platform for NER",
    description="AI-Powered Logistics & Accessibility Intelligence Platform (High-Trust Evidence Engine)",
    version=settings.VERSION,
    lifespan=lifespan
)

# Enable CORS with whitelist configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits local dev and production Render URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Timing & Structured Logging Middleware
@app.middleware("http")
async def add_timing_and_audit_log(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration_ms = (time.time() - start_time) * 1000.0
    
    # Log non-trivial requests
    if not request.url.path.endswith("/health"):
        log_event(
            event_type="HTTP_REQUEST",
            action=f"{request.method} {request.url.path}",
            outcome=str(response.status_code),
            latency_ms=duration_ms
        )
    return response

# Register Domain Routers
app.include_router(health_router, prefix=settings.API_V1_PREFIX)
app.include_router(sources_router, prefix=settings.API_V1_PREFIX)
app.include_router(geography_router, prefix=settings.API_V1_PREFIX)
app.include_router(routes_router, prefix=settings.API_V1_PREFIX)
app.include_router(fleet_router, prefix=settings.API_V1_PREFIX)
app.include_router(predictions_router, prefix=settings.API_V1_PREFIX)
app.include_router(alerts_router, prefix=settings.API_V1_PREFIX)
app.include_router(reports_router, prefix=settings.API_V1_PREFIX)
