"""
NERALIS Database Session Management.
Supports SQLite locally with WAL mode and Supabase PostgreSQL / PostGIS in cloud mode.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

# Create engine with resilient connection handling
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
    engine = create_engine(settings.DATABASE_URL, connect_args=connect_args, echo=False)
else:
    connect_args = {"connect_timeout": 5}
    engine = create_engine(
        settings.DATABASE_URL,
        connect_args=connect_args,
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=10,
        echo=False
    )

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
