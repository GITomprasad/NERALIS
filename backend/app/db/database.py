"""
NERALIS Database Session Management.
Supports SQLite locally with WAL mode and Supabase PostgreSQL / PostGIS in production.
"""

import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

logger = logging.getLogger("neralis.database")

def get_engine():
    raw_url = settings.DATABASE_URL.strip() if settings.DATABASE_URL else "sqlite:///./neralis.db"
    
    # Normalize Postgres protocol strings for SQLAlchemy 2.0
    if raw_url.startswith("postgres://"):
        db_url = raw_url.replace("postgres://", "postgresql+psycopg2://", 1)
    elif raw_url.startswith("postgresql://") and not raw_url.startswith("postgresql+"):
        db_url = raw_url.replace("postgresql://", "postgresql+psycopg2://", 1)
    else:
        db_url = raw_url

    if db_url.startswith("sqlite"):
        return create_engine(
            db_url,
            connect_args={"check_same_thread": False},
            echo=False
        )
    else:
        # Supabase PostgreSQL connection pooler & keepalive settings
        logger.info("Initializing connection engine for PostgreSQL/Supabase database.")
        return create_engine(
            db_url,
            pool_pre_ping=True,      # Tests connection validity before use (prevents idle timeout drops)
            pool_recycle=300,        # Recycles connections every 5 minutes
            pool_size=10,            # Maintained connection pool size
            max_overflow=20,         # Max overflow connections for concurrent spikes
            echo=False
        )

engine = get_engine()

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarative Base
Base = declarative_base()

def get_db():
    """
    FastAPI Dependency for database sessions.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

