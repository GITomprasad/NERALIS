"""
NERALIS Local Operational SQLite Cache Engine.
Ensures continuous offline capability for critical operational entities:
Vehicles, Corridors, Bridges, Alerts, Districts, Predictions Cache, and Sync Queue.
"""

import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings
from app.db.models import (
    Base,
    StateModel,
    DistrictModel,
    RoadSegmentModel,
    BridgeModel,
    SupplyDepotModel,
    VehicleModel,
    DisasterAlertModel,
    FieldReportModel,
    SourceRegistryModel,
    UserModel,
    SyncQueueModel,
    PredictionCacheModel,
    SystemMetadataModel
)
from app.data.states import NER_STATES, NER_DISTRICTS
from app.data.infrastructure import NER_ROAD_SEGMENTS, NER_BRIDGES, NER_DEPOTS
from app.data.fleet import NER_VEHICLES
from app.data.sources import NER_SOURCE_REGISTRY
from app.core.security import hash_password

logger = logging.getLogger("neralis.sqlite_cache")

class SQLiteCacheManager:
    def __init__(self):
        self.db_url = settings.SQLITE_CACHE_URL
        self.engine = create_engine(
            self.db_url,
            connect_args={"check_same_thread": False},
            echo=False
        )
        self.session_factory = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
        self._ensure_cache_initialized()

    def _ensure_cache_initialized(self):
        """Creates tables and populates local operational baseline if empty."""
        try:
            Base.metadata.create_all(bind=self.engine)
            db: Session = self.session_factory()
            try:
                # Seed states if empty
                if db.query(StateModel).count() == 0:
                    for s in NER_STATES:
                        db.add(StateModel(**s))
                    db.commit()

                # Seed districts if empty
                if db.query(DistrictModel).count() == 0:
                    for d in NER_DISTRICTS:
                        db.add(DistrictModel(**d))
                    db.commit()

                # Seed corridors if empty
                if db.query(RoadSegmentModel).count() == 0:
                    for r in NER_ROAD_SEGMENTS:
                        db.add(RoadSegmentModel(**r))
                    db.commit()

                # Seed bridges if empty
                if db.query(BridgeModel).count() == 0:
                    for b in NER_BRIDGES:
                        db.add(BridgeModel(**b))
                    db.commit()

                # Seed depots if empty
                if db.query(SupplyDepotModel).count() == 0:
                    for dep in NER_DEPOTS:
                        db.add(SupplyDepotModel(**dep))
                    db.commit()

                # Seed vehicles if empty
                if db.query(VehicleModel).count() == 0:
                    for v in NER_VEHICLES:
                        db.add(VehicleModel(**v))
                    db.commit()

                # Seed sources if empty
                if db.query(SourceRegistryModel).count() == 0:
                    for src in NER_SOURCE_REGISTRY:
                        src_copy = dict(src)
                        src_copy["last_heartbeat"] = "2026-08-28T21:15:00+05:30"
                        src_copy["is_live_connector"] = True
                        db.add(SourceRegistryModel(**src_copy))
                    db.commit()

                # Seed demo users if empty
                if db.query(UserModel).count() == 0:
                    default_users = [
                        {
                            "id": "USR-CITIZEN-001",
                            "name": "Dr. Ramesh Sarma",
                            "email": "citizen@neralis.gov.in",
                            "hashed_password": hash_password("citizen123", salt="salt_ner_citizen"),
                            "role": "PUBLIC_VIEWER",
                            "state": "Assam",
                            "district": "Kamrup Metropolitan",
                            "organization": "Gauhati Medical College",
                            "phone": "+91 94350 11223"
                        },
                        {
                            "id": "USR-ADMIN-001",
                            "name": "Shri J. K. Lyngdoh (IAS)",
                            "email": "admin@mdoner.gov.in",
                            "hashed_password": hash_password("admin123", salt="salt_ner_admin"),
                            "role": "STATE_ADMIN",
                            "state": "Assam",
                            "district": "Kamrup Metropolitan",
                            "organization": "Ministry of Development of North Eastern Region (MDoNER)",
                            "phone": "+91 94350 99887"
                        },
                        {
                            "id": "USR-COLLECTOR-001",
                            "name": "Ms. Ananya Barman (IAS)",
                            "email": "collector.kamrup@assam.gov.in",
                            "hashed_password": hash_password("collector123", salt="salt_ner_collector"),
                            "role": "DISTRICT_COLLECTOR",
                            "state": "Assam",
                            "district": "Kamrup Metropolitan",
                            "organization": "Office of the District Magistrate, Kamrup Metro",
                            "phone": "+91 94351 22334"
                        },
                        {
                            "id": "USR-LOGISTICS-001",
                            "name": "Vikram Sonowal",
                            "email": "fleet.lead@nerlogistics.in",
                            "hashed_password": hash_password("fleet123", salt="salt_ner_logistics"),
                            "role": "LOGISTICS_OPERATOR",
                            "state": "Assam",
                            "district": "Kamrup Metropolitan",
                            "organization": "North East Multimodal Logistics Consortium",
                            "phone": "+91 94352 33445"
                        },
                        {
                            "id": "USR-INSPECTOR-001",
                            "name": "Er. Tashi Wangchuk",
                            "email": "inspector.pwd@meghalaya.gov.in",
                            "hashed_password": hash_password("field123", salt="salt_ner_inspector"),
                            "role": "FIELD_INSPECTOR",
                            "state": "Meghalaya",
                            "district": "East Khasi Hills",
                            "organization": "Meghalaya State PWD (Roads & Bridges)",
                            "phone": "+91 94353 44556"
                        }
                    ]
                    for u in default_users:
                        db.add(UserModel(**u))
                    db.commit()

                logger.info("SQLite operational cache verified and initialized.")
            finally:
                db.close()
        except Exception as e:
            logger.error(f"Error initializing SQLite operational cache: {e}")

    def get_session(self) -> Session:
        """Returns a database session connected to the local SQLite operational cache."""
        return self.session_factory()

sqlite_cache_manager = SQLiteCacheManager()
