"""
NERALIS Core Configuration Module.
"""

import os
from typing import List

class Settings:
    PROJECT_NAME: str = "NERALIS Intelligence Engine"
    VERSION: str = "2.2.0"
    API_V1_PREFIX: str = "/api"

    # Database Configuration (PostgreSQL/PostGIS in production, SQLite locally with WAL mode)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./neralis.db")

    # CORS Origins (Allow local dev and production Render domains)
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "https://neralis-frontend.onrender.com",
        "https://neralis.gov.in"
    ]

    # Security & Role Authorization
    SECRET_KEY: str = os.getenv("SECRET_KEY", "neralis-super-secure-secret-key-2026")
    API_KEY_HEADER: str = "X-API-Key"
    ROLE_HEADER: str = "X-Role"
    DEFAULT_API_KEY: str = os.getenv("NERALIS_API_KEY", "neralis-sec-key-2026-auth")

    # Real-Time Telemetry & Simulation Modes
    SIMULATION_MODE_ENABLED: bool = os.getenv("NERALIS_SIMULATION_MODE", "true").lower() == "true"
    DEFAULT_SLA_FRESHNESS_MINUTES: int = 15

settings = Settings()
