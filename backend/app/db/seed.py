"""
NERALIS Database Seeding Engine.
Initializes tables and seeds master geospatial and domain datasets if empty.
Supports both Supabase PostgreSQL and local SQLite databases.
"""

import sys
from app.db.database import engine, Base, SessionLocal
from app.core.config import settings
from app.db.models import (
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
    AuditLogModel
)
from app.data.sources import NER_SOURCE_REGISTRY
from app.data.states import NER_STATES, NER_DISTRICTS
from app.data.infrastructure import NER_ROAD_SEGMENTS, NER_BRIDGES, NER_DEPOTS
from app.data.fleet import NER_VEHICLES
from app.core.security import hash_password

def init_and_seed_db():
    """
    Creates all database tables and seeds master data if tables are empty.
    """
    db_target = "SQLite" if settings.DATABASE_URL.startswith("sqlite") else "PostgreSQL / Supabase"
    print(f"Connecting to database target: {db_target}")
    
    # 1. Create all schemas/tables
    Base.metadata.create_all(bind=engine)
    print("[OK] Schema initialized (all tables verified or created).")
    
    db = SessionLocal()
    try:
        # 1. Seed States
        if db.query(StateModel).count() == 0:
            for s in NER_STATES:
                db.add(StateModel(**s))
            db.commit()
            print(f"[OK] Seeded {len(NER_STATES)} NER States.")
        else:
            print(f"[+] States table already populated ({db.query(StateModel).count()} records).")

        # 2. Seed Districts
        if db.query(DistrictModel).count() == 0:
            for d in NER_DISTRICTS:
                db.add(DistrictModel(**d))
            db.commit()
            print(f"[OK] Seeded {len(NER_DISTRICTS)} NER Districts.")
        else:
            print(f"[+] Districts table already populated ({db.query(DistrictModel).count()} records).")

        # 3. Seed Corridors
        if db.query(RoadSegmentModel).count() == 0:
            for r in NER_ROAD_SEGMENTS:
                db.add(RoadSegmentModel(**r))
            db.commit()
            print(f"[OK] Seeded {len(NER_ROAD_SEGMENTS)} Strategic Road Corridors.")
        else:
            print(f"[+] Road Segments table already populated ({db.query(RoadSegmentModel).count()} records).")

        # 4. Seed Bridges
        if db.query(BridgeModel).count() == 0:
            for b in NER_BRIDGES:
                db.add(BridgeModel(**b))
            db.commit()
            print(f"[OK] Seeded {len(NER_BRIDGES)} Monitored Bridges.")
        else:
            print(f"[+] Bridges table already populated ({db.query(BridgeModel).count()} records).")

        # 5. Seed Depots
        if db.query(SupplyDepotModel).count() == 0:
            for dep in NER_DEPOTS:
                db.add(SupplyDepotModel(**dep))
            db.commit()
            print(f"[OK] Seeded {len(NER_DEPOTS)} Supply Depots & Hubs.")
        else:
            print(f"[+] Supply Depots table already populated ({db.query(SupplyDepotModel).count()} records).")

        # 6. Seed Vehicles
        if db.query(VehicleModel).count() == 0:
            for v in NER_VEHICLES:
                db.add(VehicleModel(**v))
            db.commit()
            print(f"[OK] Seeded {len(NER_VEHICLES)} Fleet Telemetry Vehicles.")
        else:
            print(f"[+] Vehicles table already populated ({db.query(VehicleModel).count()} records).")

        # 7. Seed Source Registry
        if db.query(SourceRegistryModel).count() == 0:
            for src in NER_SOURCE_REGISTRY:
                src_copy = dict(src)
                src_copy["last_heartbeat"] = "2026-08-28T21:15:00+05:30"
                src_copy["is_live_connector"] = True
                db.add(SourceRegistryModel(**src_copy))
            db.commit()
            print(f"[OK] Seeded {len(NER_SOURCE_REGISTRY)} Official Source Registry connectors.")
        else:
            print(f"[+] Source Registry already populated ({db.query(SourceRegistryModel).count()} records).")

        # 8. Seed Initial Alerts
        if db.query(DisasterAlertModel).count() == 0:
            from app.services.alert_dispatcher import alert_dispatcher
            alerts = alert_dispatcher.get_alerts()
            for a in alerts:
                db.add(DisasterAlertModel(**a))
            db.commit()
            print(f"[OK] Seeded {len(alerts)} Active Disaster Alerts.")
        else:
            print(f"[+] Disaster Alerts table already populated ({db.query(DisasterAlertModel).count()} records).")

        # 9. Seed Initial Field Reports
        if db.query(FieldReportModel).count() == 0:
            from app.services.field_reporting import field_reporting_engine
            reports = field_reporting_engine.get_reports()
            for r in reports:
                db.add(FieldReportModel(**r))
            db.commit()
            print(f"[OK] Seeded {len(reports)} Field Inspection Reports.")
        else:
            print(f"[+] Field Reports table already populated ({db.query(FieldReportModel).count()} records).")

        # 10. Seed Default Governance Accounts for all 5 Roles
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
            print("[OK] Seeded 5 Official Governance Demo Accounts.")
        else:
            print(f"[+] User accounts table already populated ({db.query(UserModel).count()} records).")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Database seeding failed: {e}", file=sys.stderr)
        raise
    finally:
        db.close()

if __name__ == "__main__":
    init_and_seed_db()
    print("[SUCCESS] Database initialized and verified successfully!")



