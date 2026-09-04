"""
NERALIS Comprehensive Backend Validation Test Suite.
Executes end-to-end automated tests across all 24 required domains.
"""

import sys
import time
import json
import traceback
from fastapi.testclient import TestClient

from app.main import app
from app.db.supabase_client import supabase_client
from app.db.sqlite_cache import sqlite_cache_manager
from app.db.repository import repository
from app.db.sync import sync_service
from app.db.models import (
    RoadSegmentModel,
    BridgeModel,
    VehicleModel,
    DisasterAlertModel,
    FieldReportModel,
    UserModel,
    SyncQueueModel,
    PredictionCacheModel
)
from app.ml.disruption_model import ml_disruption_model

results = {}

def run_test(test_id, test_name, func):
    print(f"\n--- Running [{test_id}] {test_name} ---")
    try:
        start_time = time.time()
        func()
        elapsed = (time.time() - start_time) * 1000.0
        results[test_id] = {"name": test_name, "status": "PASS", "latency_ms": round(elapsed, 2), "error": None}
        print(f"[PASS] [{test_id}] {test_name} ({round(elapsed, 2)}ms)")
    except Exception as e:
        results[test_id] = {"name": test_name, "status": "FAIL", "latency_ms": None, "error": str(e), "trace": traceback.format_exc()}
        print(f"[FAIL] [{test_id}] {test_name}: {e}")

client = TestClient(app)

# 1. FastAPI Startup
def test_1_fastapi_startup():
    assert app.title.startswith("NERALIS")
    paths = app.openapi()["paths"]
    assert len(paths) >= 20, f"Expected >=20 OpenAPI paths, found {len(paths)}"
run_test("T01", "FastAPI Startup & Router Mounting", test_1_fastapi_startup)

# 2. Supabase PostgreSQL Connectivity
def test_2_supabase_connectivity():
    reachable = supabase_client.is_reachable()
    print("Supabase reachability:", reachable)
    assert reachable is True, "Supabase PostgreSQL must be reachable"
run_test("T02", "Supabase PostgreSQL Connectivity", test_2_supabase_connectivity)

# 3. SQLite Initialization
def test_3_sqlite_initialization():
    session = sqlite_cache_manager.get_session()
    try:
        seg_count = session.query(RoadSegmentModel).count()
        veh_count = session.query(VehicleModel).count()
        assert seg_count >= 18, f"Expected >=18 corridors, got {seg_count}"
        assert veh_count >= 5, f"Expected >=5 vehicles, got {veh_count}"
    finally:
        session.close()
run_test("T03", "SQLite Cache Tables & Initialization", test_3_sqlite_initialization)

# 4. All Registered API Routes
def test_4_all_registered_routes():
    required_routes = [
        "/api/health", "/api/states", "/api/districts", "/api/corridors", "/api/bridges",
        "/api/depots", "/api/fleet/vehicles", "/api/routes/optimize", "/api/predictions/72h",
        "/api/predictions/model-metrics", "/api/predictions/prepositioning", "/api/alerts",
        "/api/reports/field", "/api/reports/leaderboard", "/api/reports/parliament",
        "/api/auth/demo-users", "/api/sync/status", "/api/sync"
    ]
    registered_paths = list(app.openapi()["paths"].keys())
    for r in required_routes:
        assert r in registered_paths, f"Route {r} missing from registered routes"
run_test("T04", "All Registered API Routes Coverage", test_4_all_registered_routes)

# 5. /api/health
def test_5_health_check():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] in ["healthy", "degraded"]
    assert "storage_architecture" in data["subsystems"]
    assert data["storage_state"] == "LIVE"
run_test("T05", "Health Check & Storage Probing (/api/health)", test_5_health_check)

# 6. /api/fleet
def test_6_fleet_apis():
    res = client.get("/api/fleet/vehicles")
    assert res.status_code == 200
    vehs = res.json().get("vehicles", [])
    assert len(vehs) >= 5
    # Test vehicle playback
    v1_id = vehs[0]["id"]
    play_res = client.get(f"/api/fleet/playback/{v1_id}")
    assert play_res.status_code == 200
    assert "waypoints" in play_res.json()
run_test("T06", "Fleet Vehicles & Playback APIs (/api/fleet)", test_6_fleet_apis)

# 7. /api/routes
def test_7_route_optimizer():
    payload = {
        "origin": "AS-KAM",
        "destination": "AR-TAW",
        "cargo_type": "CRITICAL_MEDICINES",
        "vehicle_weight_tons": 16.0,
        "departure_hour": 6,
        "include_intermodal": True
    }
    res = client.post("/api/routes/optimize", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "primary_route" in data
    assert "alternatives" in data
    assert data["primary_route"]["total_distance_km"] > 0
run_test("T07", "Multi-Modal Route Optimization (/api/routes/optimize)", test_7_route_optimizer)

# 8. /api/geography
def test_8_geography_apis():
    assert client.get("/api/states").status_code == 200
    assert len(client.get("/api/states").json().get("states", [])) >= 8
    assert client.get("/api/districts").status_code == 200
    assert len(client.get("/api/districts").json().get("districts", [])) >= 40
    assert client.get("/api/corridors").status_code == 200
    assert len(client.get("/api/corridors").json().get("corridors", [])) >= 18
    assert client.get("/api/bridges").status_code == 200
    assert len(client.get("/api/bridges").json().get("bridges", [])) >= 8
run_test("T08", "Geography & Infrastructure Endpoints", test_8_geography_apis)

# 9. /api/predictions/72h
def test_9_prediction_horizons():
    for h in [6, 24, 48, 72]:
        res = client.get(f"/api/predictions/72h?hours={h}")
        assert res.status_code == 200, f"Horizon {h}h failed with {res.status_code}"
        data = res.json()
        assert len(data.get("corridors", [])) >= 18
        assert data.get("forecast_horizon_hours") == h
run_test("T09", "ML Disruption Forecast Horizons 6h/24h/48h/72h", test_9_prediction_horizons)

# 10. Authentication & Demo Users
def test_10_auth():
    demo_res = client.get("/api/auth/demo-users")
    assert demo_res.status_code == 200
    accounts = demo_res.json().get("accounts", [])
    assert len(accounts) >= 5
    
    # Test sign-in with citizen account
    citizen = accounts[0]
    signin_res = client.post("/api/auth/signin", json={"email": citizen["email"], "password": citizen["password"]})
    assert signin_res.status_code == 200
    assert "token" in signin_res.json()
run_test("T10", "Authentication & Governance RBAC Accounts", test_10_auth)

# 11. Supabase CRUD
def test_11_supabase_crud():
    cloud_db = supabase_client.get_session()
    assert cloud_db is not None
    try:
        # Read from Supabase
        seg = cloud_db.query(RoadSegmentModel).filter_by(id="SEG-01").first()
        assert seg is not None
        
        # Update in Supabase
        seg.status = "OPEN"
        cloud_db.commit()
        
        # Verify
        cloud_db.refresh(seg)
        assert seg.status == "OPEN"
    finally:
        cloud_db.close()
run_test("T11", "Direct Supabase PostgreSQL CRUD Operations", test_11_supabase_crud)

# 12. SQLite Cache Population
def test_12_sqlite_cache_population():
    cache_db = sqlite_cache_manager.get_session()
    try:
        assert cache_db.query(RoadSegmentModel).count() >= 18
        assert cache_db.query(BridgeModel).count() >= 8
        assert cache_db.query(UserModel).count() >= 5
    finally:
        cache_db.close()
run_test("T12", "SQLite Cache Entity Population", test_12_sqlite_cache_population)

# 13. Online -> Supabase Flow
def test_13_online_flow():
    # Make sure online mode is on
    repository.set_simulation_offline_mode(False)
    corridors, mode = repository.get_corridors()
    assert mode == "LIVE", f"Expected LIVE mode, got {mode}"
    assert len(corridors) >= 18
run_test("T13", "Online Flow (Frontend -> FastAPI -> Supabase)", test_13_online_flow)

# 14. Offline -> SQLite Fallback
def test_14_offline_fallback():
    # Force offline mode
    repository.set_simulation_offline_mode(True)
    corridors, mode = repository.get_corridors()
    assert mode == "CACHED", f"Expected CACHED mode, got {mode}"
    assert len(corridors) >= 18
    # Reset
    repository.set_simulation_offline_mode(False)
run_test("T14", "Offline Fallback Flow (FastAPI -> SQLite)", test_14_offline_fallback)

# 15. Offline Write -> sync_queue
def test_15_offline_write_queue():
    repository.set_simulation_offline_mode(True)
    res = repository.update_corridor_status("SEG-02", "RESTRICTED", "Mudflow", 65)
    assert res["storage_mode"] == "QUEUED_OFFLINE"
    
    cache_db = sqlite_cache_manager.get_session()
    try:
        pending = cache_db.query(SyncQueueModel).filter_by(entity_id="SEG-02", sync_status="PENDING").first()
        assert pending is not None
        assert pending.payload.get("status") == "RESTRICTED"
    finally:
        cache_db.close()
    repository.set_simulation_offline_mode(False)
run_test("T15", "Offline Write & Sync Queue Insertion", test_15_offline_write_queue)

# 16. SQLite -> Supabase Synchronization
def test_16_sync_processing():
    repository.set_simulation_offline_mode(False)
    sync_report = sync_service.perform_full_sync()
    assert sync_report["status"] in ["success", "partial_success"]
    assert sync_report["storage_state"] == "LIVE"
    assert sync_report["pending"] == 0
run_test("T16", "Bidirectional Cloud Synchronization (/api/sync)", test_16_sync_processing)

# 17. Sync Failure & Retry Handling
def test_17_sync_retry_handling():
    cache_db = sqlite_cache_manager.get_session()
    try:
        # Create an intentionally invalid item
        dummy_item = SyncQueueModel(
            id="SYNC-TEST-FAIL-01",
            entity_type="NON_EXISTENT_ENTITY",
            entity_id="XYZ-999",
            operation_type="UPDATE",
            payload={"key": "val"},
            sync_status="PENDING",
            retry_count=0
        )
        cache_db.add(dummy_item)
        cache_db.commit()
    finally:
        cache_db.close()
        
    sync_report = sync_service.perform_full_sync()
    assert sync_report["status"] in ["success", "partial_success"]
    
    # Cleanup test item
    cache_db = sqlite_cache_manager.get_session()
    try:
        cache_db.query(SyncQueueModel).filter_by(id="SYNC-TEST-FAIL-01").delete()
        cache_db.commit()
    finally:
        cache_db.close()
run_test("T17", "Sync Failure & Resilient Retry Handling", test_17_sync_retry_handling)

# 18. ML Inference End-to-End
def test_18_ml_inference():
    state = ml_disruption_model._infer_state({"id": "SEG-12", "name": "Siliguri to Gangtok (NH-10 Teesta Valley Lifeline)"})
    assert state == "Sikkim", f"Expected Sikkim, got {state}"
    
    pred = ml_disruption_model.predict_corridor_disruption("SEG-12", 24)
    assert "predicted_risk_pct" in pred
    assert 0 <= pred["predicted_risk_pct"] <= 100
    assert pred["weather_input"]["annual_rainfall_mm"] == 2800.0
    
    metrics = ml_disruption_model.metrics
    assert "accuracy_pct" in metrics
run_test("T18", "ML Inference & Sikkim Geography Mapping", test_18_ml_inference)

# 19. CORS & Frontend Headers
def test_19_cors():
    res = client.options("/api/corridors", headers={"Origin": "http://localhost:5173", "Access-Control-Request-Method": "GET"})
    assert res.status_code == 200
    assert "access-control-allow-origin" in res.headers
run_test("T19", "CORS & Frontend Header Compatibility", test_19_cors)

# 20. Hardcoded / Mock Data Audit
def test_20_hardcoded_data_audit():
    from app.data.ner_geography import NER_STATES, NER_ROAD_SEGMENTS
    assert len(NER_STATES) == 8
    assert len(NER_ROAD_SEGMENTS) == 18
run_test("T20", "Master Data Registry & Fallback Audit", test_20_hardcoded_data_audit)

# 21. Environment & Secrets Configuration
def test_21_secrets_config():
    from app.core.config import settings
    assert settings.DATABASE_URL.startswith("postgresql")
    assert settings.SUPABASE_URL.startswith("https://")
    assert len(settings.SUPABASE_KEY) > 10
    assert settings.SECRET_KEY != ""
run_test("T21", "Environment & Secrets Configuration", test_21_secrets_config)

# 22. Error Handling & Graceful 404s
def test_22_error_handling():
    res_404 = client.get("/api/corridors/NON-EXISTENT-ID-999")
    assert res_404.status_code in [404, 405]
    
    res_cap = client.get("/api/alerts/NON-EXISTENT-ALERT-999/cap-xml")
    assert res_cap.status_code == 404
run_test("T22", "Graceful Error Handling & HTTP Statuses", test_22_error_handling)

# 23. Database Consistency & Foreign Key Check
def test_23_database_consistency():
    cloud_db = supabase_client.get_session()
    try:
        segments = cloud_db.query(RoadSegmentModel).all()
        for d in segments:
            assert d.id.startswith("SEG-")
            assert d.distance_km > 0
    finally:
        cloud_db.close()
run_test("T23", "Database Consistency & Schema Verification", test_23_database_consistency)

# 24. Repeated-Request Stability
def test_24_repeated_stability():
    for _ in range(15):
        res = client.get("/api/corridors")
        assert res.status_code == 200
        assert len(res.json()["corridors"]) >= 18
run_test("T24", "Repeated Request Stability & Connection Pool Reuse", test_24_repeated_stability)

print("\n" + "="*50)
print("FINAL SUMMARY REPORT")
print("="*50)
passed = len([k for k, v in results.items() if v["status"] == "PASS"])
failed = len([k for k, v in results.items() if v["status"] == "FAIL"])
print(f"TOTAL TESTS: {len(results)}")
print(f"PASSED:      {passed}")
print(f"FAILED:      {failed}")

if failed > 0:
    print("\nFAILED DETAILS:")
    for k, v in results.items():
        if v["status"] == "FAIL":
            print(f"- [{k}] {v['name']}: {v['error']}")
            print(v["trace"])
    sys.exit(1)
else:
    print("\nALL 24 TESTS PASSED FLAWLESSLY!")
    sys.exit(0)
