"""
NERALIS Core Configuration Module.
Supports Supabase Cloud (PostgreSQL) + SQLite Local Cache Hybrid Architecture.
"""

import os
from typing import List
from dotenv import load_dotenv

# Automatically load environment variables from .env file
load_dotenv()

class Settings:
    PROJECT_NAME: str = "NERALIS Intelligence Engine"
    VERSION: str = "2.3.0"
    API_V1_PREFIX: str = "/api"

    # Supabase Cloud Configuration
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    
    # Primary Database URL (Supabase PostgreSQL / Cloud URI)
    DATABASE_URL: str = os.getenv("DATABASE_URL", os.getenv("SUPABASE_DB_URL", "sqlite:///./neralis.db"))
    
    # Local SQLite Operational Cache Path
    SQLITE_CACHE_URL: str = os.getenv("SQLITE_CACHE_URL", "sqlite:///./neralis_cache.db")

    # Offline Demonstration & Liveness Simulation
    OFFLINE_SIMULATION_MODE: bool = os.getenv("NERALIS_OFFLINE_SIMULATION", "false").lower() == "true"
    CONNECTIVITY_TIMEOUT_SECONDS: float = float(os.getenv("CONNECTIVITY_TIMEOUT_SECONDS", "3.0"))

    # CORS Origins (Allow local dev and production Render domains)
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:3000",
        "https://neralis-frontend.onrender.com",
        "https://neralis.gov.in"
    ]

    # Security & Role Authorization
    SECRET_KEY: str = os.getenv("SECRET_KEY", "neralis-super-secure-secret-key-2026")
    API_KEY_HEADER: str = "X-API-Key"
    ROLE_HEADER: str = "X-Role"
    DEFAULT_API_KEY: str = os.getenv("NERALIS_API_KEY", "neralis-sec-key-2026-auth")
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")

    # Real-Time Telemetry & Simulation Modes
    SIMULATION_MODE_ENABLED: bool = os.getenv("NERALIS_SIMULATION_MODE", "true").lower() == "true"
    DEFAULT_SLA_FRESHNESS_MINUTES: int = 15

settings = Settings()
