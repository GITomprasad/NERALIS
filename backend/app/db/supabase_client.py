"""
NERALIS Supabase Cloud Database Client.
Manages connection pooling, health probes, and session management for Supabase PostgreSQL.
"""

import logging
from typing import Optional
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings

logger = logging.getLogger("neralis.supabase")

class SupabaseClient:
    def __init__(self):
        self._engine = None
        self._session_factory = None
        self._is_configured = False
        self._initialize_engine()

    def _initialize_engine(self):
        url = settings.DATABASE_URL
        if url and (url.startswith("postgresql") or "supabase" in url):
            try:
                # Ensure connection pooling with health check
                connect_args = {"connect_timeout": int(settings.CONNECTIVITY_TIMEOUT_SECONDS)}
                self._engine = create_engine(
                    url,
                    connect_args=connect_args,
                    pool_pre_ping=True,
                    pool_size=5,
                    max_overflow=10,
                    echo=False
                )
                self._session_factory = sessionmaker(autocommit=False, autoflush=False, bind=self._engine)
                self._is_configured = True
                logger.info("Supabase PostgreSQL engine configured.")
            except Exception as e:
                logger.warning(f"Failed to initialize Supabase engine: {e}")
                self._is_configured = False
        else:
            self._is_configured = False

    @property
    def is_configured(self) -> bool:
        if not self._is_configured or self._engine is None:
            self._initialize_engine()
        return self._is_configured and self._engine is not None

    def is_reachable(self) -> bool:
        """
        Actively checks if Supabase cloud database is reachable within timeout.
        """
        if settings.OFFLINE_SIMULATION_MODE:
            return False

        if not self.is_configured:
            return False

        try:
            with self._engine.connect() as conn:
                conn.execute(text("SELECT 1"))
                return True
        except Exception as e:
            logger.debug(f"Supabase reachability probe failed: {e}")
            return False

    def get_session(self) -> Optional[Session]:
        """Returns a new session connected to Supabase PostgreSQL."""
        if not self.is_configured or not self._session_factory:
            return None
        return self._session_factory()

supabase_client = SupabaseClient()
