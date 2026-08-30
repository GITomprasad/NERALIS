"""
Tests for NERALIS Evaluated ML Disruption Forecasting Engine.
"""

import unittest
from app.ml.disruption_model import ml_disruption_model
from app.ml.damage_classifier import damage_vision_classifier
from app.services.disruption_forecasting import disruption_engine

class TestDisruptionForecast(unittest.TestCase):

    def test_ml_baseline_evaluation_metrics(self):
        """Verifies ML baseline model achieves >98% accuracy and is marked as evaluated simulation."""
        metrics = ml_disruption_model.metrics
        self.assertGreaterEqual(metrics["accuracy_pct"], 98.0)
        self.assertGreaterEqual(metrics["roc_auc"], 0.98)
        self.assertGreaterEqual(metrics["f1_score"], 0.97)
        self.assertEqual(metrics["model_status"], "evaluated_baseline_simulation")
        self.assertTrue(metrics["is_simulation"])

    def test_corridor_prediction_with_explainability(self):
        """Verifies prediction output and Explainable AI (XAI) factors."""
        pred = ml_disruption_model.predict_corridor_disruption("SEG-05", forecast_hours=48)
        self.assertIn("predicted_risk_pct", pred)
        self.assertIn("top_contributing_factors", pred)
        self.assertGreaterEqual(len(pred["top_contributing_factors"]), 1)
        self.assertEqual(pred["model_status"], "evaluated_baseline_simulation")

    def test_prepositioning_advisories(self):
        """Verifies pre-positioning supplies advisories generation."""
        advisories = disruption_engine.get_prepositioning_advisories()
        self.assertGreaterEqual(len(advisories), 1)
        self.assertIn("target_district", advisories[0])
        self.assertIn("recommended_transfer", advisories[0])

    def test_digital_twin_bridge_collapse_simulation(self):
        """Verifies digital twin what-if scenario for bridge collapse."""
        sim = disruption_engine.simulate_digital_twin_scenario("BRIDGE_COLLAPSE", "BR-01")
        self.assertIn("cut_off_districts", sim["immediate_impact"])
        self.assertIn("recommended_mitigation", sim)

    def test_damage_classifier_simulation_mode(self):
        """Verifies computer vision damage classifier."""
        res = damage_vision_classifier.evaluate_damage_photo(
            incident_type="Rockfall & Road Collapse",
            debris_volume_cum=40.0
        )
        self.assertEqual(res["inference_mode"], "transfer_simulation")
        self.assertTrue(res["requires_human_verification"])

if __name__ == "__main__":
    unittest.main()
