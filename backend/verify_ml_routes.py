from fastapi.testclient import TestClient
from app.main import app

c = TestClient(app)

endpoints = [
    ('GET', '/api/predictions/forecast?hours=24'),
    ('GET', '/api/predictions/72h?hours=48'),
    ('GET', '/api/predictions/model-metrics'),
    ('GET', '/api/predictions/feature-importance'),
    ('GET', '/api/predictions/corridor/SEG-01?hours=24'),
    ('POST', '/api/predictions/corridor', {'corridor_id': 'SEG-03', 'forecast_hours': 48}),
    ('GET', '/api/predictions/prepositioning'),
    ('POST', '/api/predictions/digital-twin', {'incident_type': 'BRIDGE_COLLAPSE', 'target_id': 'BR-01'}),
    ('POST', '/api/reports/field', {
        'client_event_id': 'VERIF-001',
        'reporter_name': 'Test Inspector',
        'reporter_role': 'PWD Engineer',
        'state': 'Assam',
        'district': 'AS-KAM',
        'location_name': 'NH-27 Km 42',
        'lat': 26.15,
        'lng': 91.75,
        'incident_type': 'Rockfall Blockade',
        'crack_length_m': 0.0,
        'pothole_depth_cm': 0.0,
        'debris_volume_cum': 35.0
    }),
    ('GET', '/health'),
    ('GET', '/api/health')
]

print("=== FINAL LIVE ML & HEALTH ENDPOINTS AUDIT ===")
all_pass = True
for method, path, *rest in endpoints:
    payload = rest[0] if rest else None
    if method == 'GET':
        resp = c.get(path)
    else:
        resp = c.post(path, json=payload)
    ok = resp.status_code == 200
    if not ok:
        all_pass = False
    status_str = "SUCCESS (200)" if ok else f"FAILED ({resp.status_code})"
    print(f"[{method}] {path:<45} -> {status_str}")

print("--------------------------------------------------")
if all_pass:
    print("ALL 11 ML & SYSTEM HEALTH ENDPOINTS ARE 100% OPERATIONAL!")
else:
    print("SOME ENDPOINTS FAILED")
