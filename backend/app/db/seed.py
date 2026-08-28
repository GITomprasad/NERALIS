"""
NERALIS Database Seeding Engine.
Initializes tables and seeds master geospatial and domain datasets if empty.
"""

from app.db.database import engine, Base, SessionLocal
from app.db.models import (
    StateModel,
    DistrictModel,
    RoadSegmentModel,
    BridgeModel,
    SupplyDepotModel,
    VehicleModel,
    DisasterAlertModel,
    FieldReportModel,
    SourceRegistryModel
)
from app.data.sources import NER_SOURCE_REGISTRY
from app.data.states import NER_STATES, NER_DISTRICTS
from app.data.infrastructure import NER_ROAD_SEGMENTS, NER_BRIDGES, NER_DEPOTS
from app.data.fleet import NER_VEHICLES

def init_and_seed_db():
    """
    Creates all database tables and seeds master data if tables are empty.
    """
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # 1. Seed States
        if db.query(StateModel).count() == 0:
            for s in NER_STATES:
                db.add(StateModel(**s))
            db.commit()

        # 2. Seed Districts
        if db.query(DistrictModel).count() == 0:
            for d in NER_DISTRICTS:
                db.add(DistrictModel(**d))
            db.commit()

        # 3. Seed Corridors
        if db.query(RoadSegmentModel).count() == 0:
            for r in NER_ROAD_SEGMENTS:
                db.add(RoadSegmentModel(**r))
            db.commit()

        # 4. Seed Bridges
        if db.query(BridgeModel).count() == 0:
            for b in NER_BRIDGES:
                db.add(BridgeModel(**b))
            db.commit()

        # 5. Seed Depots
        if db.query(SupplyDepotModel).count() == 0:
            for dep in NER_DEPOTS:
                db.add(SupplyDepotModel(**dep))
            db.commit()

        # 6. Seed Vehicles
        if db.query(VehicleModel).count() == 0:
            for v in NER_VEHICLES:
                db.add(VehicleModel(**v))
            db.commit()

        # 7. Seed Source Registry
        if db.query(SourceRegistryModel).count() == 0:
            for src in NER_SOURCE_REGISTRY:
                src_copy = dict(src)
                src_copy["last_heartbeat"] = "2026-08-28T21:15:00+05:30"
                src_copy["is_live_connector"] = True
                db.add(SourceRegistryModel(**src_copy))
            db.commit()

        # 8. Seed Initial Alerts
        if db.query(DisasterAlertModel).count() == 0:
            from app.services.alert_dispatcher import alert_dispatcher
            for a in alert_dispatcher.get_alerts():
                db.add(DisasterAlertModel(**a))
            db.commit()

        # 9. Seed Initial Field Reports
        if db.query(FieldReportModel).count() == 0:
            from app.services.field_reporting import field_reporting_engine
            for r in field_reporting_engine.get_reports():
                db.add(FieldReportModel(**r))
            db.commit()

    finally:
        db.close()

if __name__ == "__main__":
    init_and_seed_db()
    print("Database initialized and seeded successfully!")
