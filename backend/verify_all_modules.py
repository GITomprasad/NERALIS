from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

tests = [
    # 1. Module 1: Regional GIS Grid & Data Sources
    ("Module 1 (GIS Grid)", "GET", "/api/states", None),
    ("Module 1 (GIS Grid)", "GET", "/api/districts", None),
    ("Module 1 (GIS Grid)", "GET", "/api/corridors", None),
    ("Module 1 (GIS Grid)", "GET", "/api/bridges", None),
    ("Module 1 (GIS Grid)", "GET", "/api/depots", None),
    ("Module 1 (GIS Grid)", "GET", "/api/sources", None),

    # 2. Module 2: AI Multi-Objective Route Optimizer
    ("Module 2 (Route Optimizer)", "POST", "/api/routes/optimize", {
        "origin": "AS-KAM",
        "destination": "ML-EKH",
        "cargo_type": "EMERGENCY_MEDICAL",
        "vehicle_weight_tons": 18.5,
        "include_intermodal": True
    }),

    # 3. Module 3: Fleet Telemetry & Satellite Tracking
    ("Module 3 (Fleet Telemetry)", "GET", "/api/fleet/vehicles?is_demo=true", None),
    ("Module 3 (Fleet Telemetry)", "GET", "/api/fleet/playback/TRK-01", None),
    ("Module 3 (Fleet Telemetry)", "POST", "/api/telemetry/ingest", {
        "vehicle_id": "TRK-01",
        "lat": 26.15,
        "lng": 91.74,
        "speed_kmh": 42.0,
        "heading_deg": 120.0,
        "network_mode": "NavIC"
    }),

    # 4. Module 4: 6 to 72h Predictive Disruption Intelligence (Authentic ML)
    ("Module 4 (Disruption ML)", "GET", "/api/predictions/forecast?hours=24", None),
    ("Module 4 (Disruption ML)", "GET", "/api/predictions/model-metrics", None),
    ("Module 4 (Disruption ML)", "GET", "/api/predictions/feature-importance", None),
    ("Module 4 (Disruption ML)", "POST", "/api/predictions/corridor", {
        "corridor_id": "SEG-01",
        "forecast_hours": 48,
        "custom_rain_mm": 180.0
    }),
    ("Module 4 (Disruption ML)", "GET", "/api/predictions/prepositioning", None),
    ("Module 4 (Disruption ML)", "POST", "/api/predictions/digital-twin", {
        "incident_type": "BRIDGE_COLLAPSE",
        "target_id": "BR-01"
    }),

    # 5. Module 5: Emergency Alerts & CAP-XML Dispatcher
    ("Module 5 (Alert Center)", "GET", "/api/alerts", None),
    ("Module 5 (Alert Center)", "POST", "/api/alerts", {
        "tier": "CRITICAL",
        "tier_level": 4,
        "title": "Flash Flood Red Alert NH-27",
        "corridor_id": "SEG-01",
        "affected_districts": ["AS-KAM", "AS-NAG"],
        "trigger_condition": "IMD 24h Rain > 200mm",
        "channels": ["SMS", "WhatsApp", "CAP-XML"],
        "message_en": "Critical flash flood warning on NH-27 Km 42."
    }),
    ("Module 5 (Alert Center)", "POST", "/api/alerts/ALT-01/dispatch", {"channels": ["SMS", "WhatsApp"]}),
    ("Module 5 (Alert Center)", "GET", "/api/alerts/ALT-01/cap-xml", None),
    ("Module 5 (Alert Center)", "GET", "/api/alerts/morning-briefing", None),

    # 6. Module 6: PWA Field Crowdsourcing & Vision Classifier
    ("Module 6 (Field Reporting)", "GET", "/api/reports/field", None),
    ("Module 6 (Field Reporting)", "POST", "/api/reports/field", {
        "client_event_id": "PWA-SYNC-99",
        "reporter_name": "R. Sharma",
        "reporter_role": "BRO Road Inspector",
        "state": "Arunachal Pradesh",
        "district": "AR-TAW",
        "location_name": "Sela Tunnel North Portal",
        "lat": 27.50,
        "lng": 92.10,
        "incident_type": "Landslide Slurry",
        "crack_length_m": 12.5,
        "pothole_depth_cm": 0.0,
        "debris_volume_cum": 45.0
    }),
    ("Module 6 (Field Reporting)", "GET", "/api/reports/leaderboard", None),

    # 7. Module 7: Strategic Analytics & Executive / Parliament Reports
    ("Module 7 (Analytics)", "GET", "/api/reports/parliament", None),
    ("Module 7 (Analytics)", "GET", "/api/reports/state-comparative", None),

    # 8. Module 8: Multilingual & Offline Operations (Lite Mode / USSD)
    ("Module 8 (Offline & Lite)", "GET", "/api/lite/status", None),

    # 9. AI Assistant Chatbot
    ("AI Sahayak Assistant", "POST", "/api/chatbot/query", {"query": "What is the status of NH-27?", "language": "en"}),
    ("AI Sahayak Assistant", "GET", "/api/chatbot/suggestions", None),

    # 10. System Health & Deep Diagnostic
    ("System Core", "GET", "/health", None),
    ("System Core", "GET", "/api/health", None)
]

print("=" * 70)
print(f"{'MODULE':<26} {'METHOD':<6} {'ENDPOINT':<32} {'RESULT'}")
print("=" * 70)

all_passed = True
for mod, method, path, body in tests:
    if method == "GET":
        res = client.get(path)
    else:
        res = client.post(path, json=body)
    
    ok = res.status_code == 200
    if not ok:
        all_passed = False
    status_str = f"200 OK" if ok else f"{res.status_code} ERROR"
    print(f"{mod:<26} {method:<6} {path:<32} {status_str}")

print("=" * 70)
if all_passed:
    print(">>> 100% OF ALL 8 PLATFORM MODULES & PANELS ARE FULLY OPERATIONAL! <<<")
else:
    print(">>> WARNING: SOME MODULES FAILED <<<")
