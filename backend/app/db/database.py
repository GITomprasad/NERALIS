"""
NERALIS Database Session Management.
Supports SQLite locally with WAL mode and PostgreSQL / PostGIS in production.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

# Create engine with thread safety for SQLite
connect_args = {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(settings.DATABASE_URL, connect_args=connect_args, echo=False)

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
