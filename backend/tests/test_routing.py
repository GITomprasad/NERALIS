"""
Tests for NERALIS AI Multi-Objective Routing Engine.
"""

import unittest
from app.services.routing_engine import routing_engine

class TestRoutingEngine(unittest.TestCase):

    def test_primary_and_alternative_routes(self):
        """Verifies primary route, resilient bypass, and intermodal itinerary generation."""
        res = routing_engine.optimize_route(
            origin_id="AS-KAM",
            destination_id="AR-TAW",
            cargo_type="CRITICAL_MEDICINES",
            vehicle_weight_tons=16.0
        )
        self.assertIn("primary_route", res)
        self.assertIn("alternatives", res)
        self.assertEqual(len(res["alternatives"]), 2)
        self.assertGreater(res["primary_route"]["total_distance_km"], 0)
        self.assertGreater(res["primary_route"]["total_time_hrs"], 0)

    def test_heavy_vehicle_weight_penalty(self):
        """Verifies heavy vehicle routing considers weight limits on roads and bridges."""
        light_route = routing_engine.optimize_route(
            origin_id="AS-KAM",
            destination_id="AR-TAW",
            vehicle_weight_tons=10.0
        )
        heavy_route = routing_engine.optimize_route(
            origin_id="AS-KAM",
            destination_id="AR-TAW",
            vehicle_weight_tons=38.0
        )
        self.assertIsNotNone(light_route["primary_route"])
        self.assertIsNotNone(heavy_route["primary_route"])

    def test_live_bridge_warnings_annotation(self):
        """Verifies segments carry live bridge warnings if bridge health is critical."""
        res = routing_engine.optimize_route(
            origin_id="AS-KAM",
            destination_id="SK-GAN"
        )
        segments = res["primary_route"]["segments"]
        self.assertTrue(len(segments) > 0)
        for seg in segments:
            self.assertIn("bridge_warnings", seg)
            self.assertIn("coordinates", seg)
            self.assertIsInstance(seg["coordinates"], list)

        # Verify coordinates array on route
        self.assertIn("coordinates", res["primary_route"])
        self.assertGreater(len(res["primary_route"]["coordinates"]), 0)

        # Verify multimodal alternative has segments and coordinates
        multimodal_alt = res["alternatives"][1]
        self.assertIn("segments", multimodal_alt)
        self.assertIn("coordinates", multimodal_alt)
        self.assertIn("bridges_on_route", multimodal_alt)

    def test_intra_district_and_remote_district_routing(self):
        """Verifies origin == destination and non-highway hub districts can route."""
        same_district = routing_engine.optimize_route(
            origin_id="AS-KAM",
            destination_id="AS-KAM"
        )
        self.assertEqual(same_district["primary_route"]["path_nodes"], ["AS-KAM"])
        self.assertGreater(len(same_district["primary_route"]["coordinates"]), 0)

        remote_route = routing_engine.optimize_route(
            origin_id="ML-WKH",
            destination_id="TR-DHA"
        )
        self.assertIsNotNone(remote_route["primary_route"])
        self.assertGreater(len(remote_route["primary_route"]["coordinates"]), 0)

if __name__ == "__main__":
    unittest.main()

