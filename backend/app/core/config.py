"""
NERALIS Core Configuration Module.
Supports environment loading (.env) and configuration for Supabase PostgreSQL, Groq AI, and GIS services.
"""

import os
from typing import List
from dotenv import load_dotenv

# Automatically load environment variables from backend/.env if present
load_dotenv(override=False)

class Settings:
    PROJECT_NAME: str = "NERALIS Intelligence Engine"
    VERSION: str = "2.2.0"
    API_V1_PREFIX: str = "/api"

    # Database Configuration (Supabase PostgreSQL / PostGIS in production, SQLite locally with WAL mode)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./neralis.db")

    # Supabase Specific Configuration (optional, for direct Supabase Auth or Storage)
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", os.getenv("SUPABASE_ANON_KEY", ""))
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

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

    # LLM & AI Engine (Groq Fast Inference)
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "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")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")

    # Real-Time Telemetry & Simulation Modes
    SIMULATION_MODE_ENABLED: bool = os.getenv("NERALIS_SIMULATION_MODE", "true").lower() == "true"
    DEFAULT_SLA_FRESHNESS_MINUTES: int = 15

settings = Settings()

