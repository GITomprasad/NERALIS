"""
NERALIS Comprehensive Backend & ML Evaluation Test Suite.
Verifies:
1. Disruption ML Model achieves >80% accuracy baseline with transparent evaluation metrics.
2. Route Optimization engine computes multi-objective penalties & alternative routes.
3. NDMA CAP XML v1.2 generation compliance.
4. Geography, bridge, and source registry data integrity.
"""

import unittest
from app.data.ner_geography import (
    NER_STATES,
    NER_DISTRICTS,
    NER_ROAD_SEGMENTS,
    NER_BRIDGES,
    NER_DEPOTS,
    NER_SOURCE_REGISTRY,
    HISTORICAL_DISRUPTIONS
)
from app.ml.disruption_model import ml_disruption_model
from app.ml.damage_classifier import damage_vision_classifier
from app.services.routing_engine import routing_engine
from app.services.alert_dispatcher import alert_dispatcher
from app.services.disruption_forecasting import disruption_engine

class TestNeralisEngine(unittest.TestCase):

    def test_ner_dataset_completeness(self):
        """Verifies expanded coverage of all 8 NER states and infrastructure."""
        self.assertEqual(len(NER_STATES), 8)
        self.assertGreaterEqual(len(NER_DISTRICTS), 30)
        self.assertGreaterEqual(len(NER_ROAD_SEGMENTS), 15)
        self.assertGreaterEqual(len(NER_BRIDGES), 8)
        self.assertGreaterEqual(len(NER_DEPOTS), 8)
        self.assertGreaterEqual(len(NER_SOURCE_REGISTRY), 6)
        self.assertGreaterEqual(len(HISTORICAL_DISRUPTIONS), 1000)

    def test_ml_disruption_model_accuracy(self):
        """Verifies ML baseline model achieves authentic evaluation metrics."""
        metrics = ml_disruption_model.metrics
        self.assertGreaterEqual(metrics["accuracy_pct"], 80.0)
        if "balanced_accuracy" in metrics:
            self.assertGreaterEqual(metrics["balanced_accuracy"], 0.50)
        if "roc_auc" in metrics:
            self.assertGreaterEqual(metrics["roc_auc"], 0.65)
        if "f1_score" in metrics:
            self.assertGreaterEqual(metrics["f1_score"], 0.50)
        if "macro_f1" in metrics:
            self.assertGreaterEqual(metrics["macro_f1"], 0.50)
        self.assertIn("confusion_matrix", metrics)
        self.assertIn("feature_importance", metrics)

    def test_ml_corridor_prediction_and_explainability(self):
        """Verifies explainable AI top-3 factors on corridor predictions."""
        pred = ml_disruption_model.predict_corridor_disruption("SEG-05", forecast_hours=48)
        self.assertIn("predicted_risk_pct", pred)
        self.assertIn("ai_confidence_pct", pred)
        self.assertTrue(0 <= pred["ai_confidence_pct"] <= 100)
        self.assertGreaterEqual(pred["ai_confidence_pct"], 50.0)
        self.assertIn("top_contributing_factors", pred)
        self.assertTrue(len(pred["top_contributing_factors"]) >= 1)

    def test_road_damage_vision_classifier(self):
        """Verifies multi-class road damage evaluation."""
        res = damage_vision_classifier.evaluate_damage_photo(
            incident_type="Rockfall & Mud Spillage",
            crack_length_m=12.0,
            debris_volume_cum=45.0
        )
        self.assertIn("primary_damage_class", res)
        self.assertGreaterEqual(res["confidence_pct"], 80.0)
        self.assertTrue(res["requires_human_verification"])

    def test_route_optimization_multi_alternatives(self):
        """Verifies multi-objective routing with 3 distinct alternatives."""
        route = routing_engine.optimize_route(
            origin_id="AS-KAM",
            destination_id="AR-TAW",
            cargo_type="CRITICAL_MEDICINES",
            vehicle_weight_tons=16.0
        )
        self.assertIn("primary_route", route)
        self.assertIn("alternatives", route)
        self.assertEqual(len(route["alternatives"]), 2)
        self.assertGreater(route["primary_route"]["total_distance_km"], 0)

    def test_ndma_cap_xml_generation(self):
        """Verifies CAP XML v1.2 format and tags."""
        xml = alert_dispatcher.generate_cap_xml("ALT-2026-0891")
        self.assertTrue(xml.startswith("<?xml"))
        self.assertIn("urn:oasis:names:tc:emergency:cap:1.2", xml)
        self.assertIn("<identifier>NERALIS-NDMA-", xml)
        self.assertIn("<headline>", xml)

if __name__ == "__main__":
    unittest.main()
