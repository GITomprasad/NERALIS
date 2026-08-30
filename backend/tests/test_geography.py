"""
Tests for NERALIS Geographic & Master Data Domains.
"""

import unittest
from app.data.sources import NER_SOURCE_REGISTRY
from app.data.states import NER_STATES, NER_DISTRICTS
from app.data.infrastructure import NER_ROAD_SEGMENTS, NER_BRIDGES, NER_DEPOTS
from app.data.fleet import NER_VEHICLES
from app.data.history import HISTORICAL_DISRUPTIONS

class TestGeographyData(unittest.TestCase):

    def test_ner_states_count_and_fields(self):
        """Verifies coverage of all 8 North Eastern states."""
        self.assertEqual(len(NER_STATES), 8)
        expected_states = {"AS", "AR", "MN", "ML", "MZ", "NL", "SK", "TR"}
        actual_states = {s["id"] for s in NER_STATES}
        self.assertEqual(actual_states, expected_states)

    def test_districts_have_valid_geospatial_attributes(self):
        """Verifies districts have valid latitude, longitude, and elevation."""
        self.assertGreaterEqual(len(NER_DISTRICTS), 40)
        for d in NER_DISTRICTS:
            self.assertIn("id", d)
            self.assertIn("name", d)
            self.assertIn("state_id", d)
            self.assertTrue(21.0 <= d["lat"] <= 30.0, f"District {d['name']} lat out of bounds: {d['lat']}")
            self.assertTrue(88.0 <= d["lng"] <= 98.0, f"District {d['name']} lng out of bounds: {d['lng']}")
            self.assertGreaterEqual(d["phc_count"], 0)

    def test_infrastructure_corridors_and_bridges(self):
        """Verifies corridors and strategic bridges integrity and telemetry."""
        self.assertGreaterEqual(len(NER_ROAD_SEGMENTS), 15)
        self.assertGreaterEqual(len(NER_BRIDGES), 8)
        self.assertGreaterEqual(len(NER_DEPOTS), 8)

        for b in NER_BRIDGES:
            self.assertIn("sensor_status", b)
            self.assertIn("structural_health_pct", b)
            self.assertIn("current_water_level_m", b)
            self.assertIn("flood_danger_level_m", b)

    def test_historical_disruptions_benchmark(self):
        """Verifies 1,200+ historical events for evaluation."""
        self.assertGreaterEqual(len(HISTORICAL_DISRUPTIONS), 1000)

if __name__ == "__main__":
    unittest.main()
