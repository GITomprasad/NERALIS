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

        # 10. Seed Default Governance Accounts for all 5 Roles
        from app.db.models import UserModel
        from app.core.security import hash_password
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
                    "organization": "Public Logistics Observer / Citizen",
                    "phone": "+91 94350 12345"
                },
                {
                    "id": "USR-ADMIN-001",
                    "name": "Shri J. K. Lyngdoh (IAS)",
                    "email": "admin@mdoner.gov.in",
                    "hashed_password": hash_password("admin123", salt="salt_ner_admin"),
                    "role": "ADMIN",
                    "state": "Delhi / NER HQ",
                    "district": "MDoNER Central Command",
                    "organization": "Ministry of Development of North Eastern Region (MDoNER)",
                    "phone": "+91 11 2306 1234"
                },
                {
                    "id": "USR-COLLECTOR-001",
                    "name": "Ms. Ananya Barman (IAS)",
                    "email": "collector.kamrup@assam.gov.in",
                    "hashed_password": hash_password("collector123", salt="salt_ner_collector"),
                    "role": "DISTRICT_COLLECTOR",
                    "state": "Assam",
                    "district": "Kamrup Metropolitan",
                    "organization": "District Disaster Management Authority (DDMA)",
                    "phone": "+91 98640 23456"
                },
                {
                    "id": "USR-FLEET-001",
                    "name": "Vikram Sonowal",
                    "email": "fleet.lead@nerlogistics.in",
                    "hashed_password": hash_password("fleet123", salt="salt_ner_fleet"),
                    "role": "TRANSPORT_OPERATOR",
                    "state": "Assam",
                    "district": "Guwahati Hub",
                    "organization": "NER State Transport & Food Logistics Grid",
                    "phone": "+91 97060 34567"
                },
                {
                    "id": "USR-FIELD-001",
                    "name": "Er. Tashi Wangchuk",
                    "email": "inspector.pwd@meghalaya.gov.in",
                    "hashed_password": hash_password("field123", salt="salt_ner_field"),
                    "role": "PWD_ENGINEER",
                    "state": "Arunachal Pradesh",
                    "district": "Tawang",
                    "organization": "Public Works Department (PWD) / SDRF Field Inspector",
                    "phone": "+91 94360 45678"
                }
            ]
            for u in default_users:
                db.add(UserModel(**u))
            db.commit()

    finally:
        db.close()

if __name__ == "__main__":
    init_and_seed_db()
    print("Database initialized and seeded successfully!")

