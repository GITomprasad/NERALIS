"""
Tests for NERALIS FastAPI REST API Endpoints.
"""

import unittest
from fastapi.testclient import TestClient
from app.main import app

class TestApiEndpoints(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_health_check_dynamic_subsystems(self):
        """Verifies health check actively probes graph nodes and subsystems."""
        res = self.client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "healthy")
        self.assertIn("subsystems", data)
        self.assertEqual(data["subsystems"]["routing_graph"]["status"], "UP")

    def test_sources_endpoint(self):
        res = self.client.get("/api/sources")
        self.assertEqual(res.status_code, 200)
        self.assertGreaterEqual(len(res.json()["sources"]), 5)

    def test_geography_endpoints(self):
        self.assertEqual(self.client.get("/api/states").status_code, 200)
        self.assertEqual(self.client.get("/api/districts").status_code, 200)
        self.assertEqual(self.client.get("/api/corridors").status_code, 200)
        self.assertEqual(self.client.get("/api/bridges").status_code, 200)
        self.assertEqual(self.client.get("/api/depots").status_code, 200)

    def test_predictions_forecast_and_alias(self):
        """Verifies both /api/predictions/forecast and legacy /api/predictions/72h work."""
        res_primary = self.client.get("/api/predictions/forecast?hours=48")
        self.assertEqual(res_primary.status_code, 200)
        self.assertEqual(res_primary.json()["forecast_horizon_hours"], 48)

        res_legacy = self.client.get("/api/predictions/72h?hours=24")
        self.assertEqual(res_legacy.status_code, 200)
        self.assertEqual(res_legacy.json()["forecast_horizon_hours"], 24)

    def test_route_optimize_post(self):
        res = self.client.post("/api/routes/optimize", json={
            "origin": "AS-KAM",
            "destination": "AR-TAW",
            "cargo_type": "CRITICAL_MEDICINES",
            "vehicle_weight_tons": 16.0
        })
        self.assertEqual(res.status_code, 200)
        self.assertIn("primary_route", res.json())

    def test_fleet_vehicles_with_filters(self):
        res_all = self.client.get("/api/fleet/vehicles")
        self.assertEqual(res_all.status_code, 200)

        res_bbox = self.client.get("/api/fleet/vehicles?bbox=25.0,90.0,28.0,95.0")
        self.assertEqual(res_bbox.status_code, 200)

        res_state = self.client.get("/api/fleet/vehicles?state=AS")
        self.assertEqual(res_state.status_code, 200)

    def test_alert_lifecycle_and_dispatch(self):
        # Create alert
        create_res = self.client.post("/api/alerts", json={
            "tier": "T3 - WARNING",
            "tier_level": 3,
            "title": "API Test Alert",
            "corridor_id": "SEG-01",
            "affected_districts": ["AS-KAM"],
            "trigger_condition": "Test Trigger",
            "channels": ["SMS"],
            "message_en": "Test Emergency"
        })
        self.assertEqual(create_res.status_code, 200)
        alert_id = create_res.json()["id"]

        # Dispatch alert
        dispatch_res = self.client.post(f"/api/alerts/{alert_id}/dispatch", json={
            "channels": ["SMS", "WhatsApp"]
        })
        self.assertEqual(dispatch_res.status_code, 200)
        self.assertEqual(dispatch_res.json()["status"], "SUCCESS")

        # CAP XML
        cap_res = self.client.get(f"/api/alerts/{alert_id}/cap-xml")
        self.assertEqual(cap_res.status_code, 200)
        self.assertIn("xml", cap_res.headers.get("content-type", ""))

    def test_field_reports_and_leaderboard(self):
        get_res = self.client.get("/api/reports/field")
        self.assertEqual(get_res.status_code, 200)

        post_res = self.client.post("/api/reports/field", json={
            "reporter_name": "Dr. Surveyor",
            "reporter_role": "PWD Engineer",
            "state": "Assam",
            "district": "AS-KAM",
            "location_name": "NH-27 Km 18",
            "lat": 26.20,
            "lng": 91.70,
            "incident_type": "Pothole Subsidence",
            "pothole_depth_cm": 15.0
        })
        self.assertEqual(post_res.status_code, 200)
        self.assertIn("ai_severity_predicted", post_res.json())

        lead_res = self.client.get("/api/reports/leaderboard")
        self.assertEqual(lead_res.status_code, 200)

    def test_executive_and_parliament_reports(self):
        parl_res = self.client.get("/api/reports/parliament")
        self.assertEqual(parl_res.status_code, 200)

        comp_res = self.client.get("/api/reports/state-comparative")
        self.assertEqual(comp_res.status_code, 200)

if __name__ == "__main__":
    unittest.main()
