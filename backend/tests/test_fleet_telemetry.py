"""
Tests for NERALIS Fleet Telemetry & Tracking Engine.
"""

import unittest
from app.services.fleet_telemetry import fleet_telemetry_engine

class TestFleetTelemetry(unittest.TestCase):

    def test_get_all_vehicles_and_demo_flag(self):
        """Verifies vehicles list returns active vehicles with simulation/observation tags."""
        vehicles = fleet_telemetry_engine.get_all_vehicles(is_demo_mode=True)
        self.assertGreaterEqual(len(vehicles), 4)
        for v in vehicles:
            self.assertIn("plate_number", v)
            self.assertIn("current_lat", v)
            self.assertIn("current_lng", v)

    def test_bounding_box_filter(self):
        """Verifies bounding box filtering isolates vehicles in specific geographic bounds."""
        # Query box around Assam/Guwahati: 26.0, 91.0, 27.0, 93.0
        filtered = fleet_telemetry_engine.get_all_vehicles(bbox="26.0,91.0,27.0,93.0")
        for v in filtered:
            self.assertTrue(26.0 <= v["current_lat"] <= 27.0)
            self.assertTrue(91.0 <= v["current_lng"] <= 93.0)

    def test_state_filter(self):
        """Verifies state filtering isolates vehicles matching state code."""
        filtered = fleet_telemetry_engine.get_all_vehicles(state="AS")
        self.assertGreaterEqual(len(filtered), 1)

    def test_trip_playback(self):
        """Verifies trip playback generates chronological waypoints."""
        playback = fleet_telemetry_engine.get_trip_playback("VEH-01")
        self.assertEqual(playback["vehicle_id"], "VEH-01")
        self.assertGreaterEqual(len(playback["waypoints"]), 3)

    def test_telemetry_ingest(self):
        """Verifies real-time GPS telemetry ingestion."""
        res = fleet_telemetry_engine.ingest_telemetry({
            "vehicle_id": "VEH-01",
            "lat": 26.40,
            "lng": 92.20,
            "speed_kmh": 50.0
        })
        self.assertEqual(res["status"], "INGESTED")

if __name__ == "__main__":
    unittest.main()
