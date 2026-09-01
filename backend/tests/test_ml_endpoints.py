"""
NERALIS ML and AI Subsystems Verification Test Suite.
Tests all machine learning and AI inference endpoints, models, algorithms, and integration paths.
"""

import unittest
import numpy as np
from fastapi.testclient import TestClient

from app.main import app
from app.ml.disruption_model import ml_disruption_model, RealDisruptionMLModel
from app.ml.damage_classifier import damage_vision_classifier, RoadDamageVisionClassifier
from app.services.disruption_forecasting import disruption_engine
from app.services.routing_engine import routing_engine
from app.services.field_reporting import field_reporting_engine
from app.services.chatbot_engine import chatbot_engine


class TestMLSubsystems(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)

    # --------------------------------------------------------------------------
    # 1. Real ML Disruption Model Unit Tests
    # --------------------------------------------------------------------------
    def test_disruption_model_inference_structure(self):
        """Verify ML disruption model outputs correct schema, class probabilities, and explainability factors."""
        res = ml_disruption_model.predict_corridor_disruption(
            corridor_id="SEG-01",
            forecast_hours=24,
            custom_rain_mm=45.0
        )
        self.assertIn("corridor_id", res)
        self.assertEqual(res["corridor_id"], "SEG-01")
        self.assertIn("predicted_risk_pct", res)
        self.assertTrue(0 <= res["predicted_risk_pct"] <= 100)
        self.assertIn("class_probabilities", res)
        self.assertIn("HIGH", res["class_probabilities"])
        self.assertIn("LOW", res["class_probabilities"])
        self.assertIn("MEDIUM", res["class_probabilities"])
        
        # Verify probability sum approximately equals 1.0
        prob_sum = sum(res["class_probabilities"].values())
        self.assertAlmostEqual(prob_sum, 1.0, places=1)
        
        # Verify explainability factors
        self.assertIn("top_contributing_factors", res)
        self.assertGreater(len(res["top_contributing_factors"]), 0)
        self.assertIn("weather_input", res)

    def test_disruption_model_horizons(self):
        """Verify inference across lookahead horizons (6h, 24h, 48h, 72h)."""
        for h in [6, 24, 48, 72]:
            res = ml_disruption_model.predict_corridor_disruption("SEG-02", forecast_hours=h)
            self.assertEqual(res["forecast_horizon_hours"], h)
            self.assertIsNotNone(res["predicted_event"])

    def test_disruption_metrics_evaluation(self):
        """Verify model evaluation metrics integrity."""
        metrics = disruption_engine.get_model_evaluation_metrics()
        self.assertIn("accuracy_pct", metrics)
        self.assertIn("roc_auc", metrics)
        self.assertIn("f1_score", metrics)
        self.assertIn("feature_importance", metrics)
        self.assertIn("confusion_matrix", metrics)
        self.assertGreater(len(metrics["feature_importance"]), 4)

    # --------------------------------------------------------------------------
    # 2. Computer Vision Road Damage Evaluator Tests
    # --------------------------------------------------------------------------
    def test_vision_damage_classifier(self):
        """Verify YOLOv8 / CV damage classifier handles different incident types and dimensions."""
        # Test Severe Debris / Rockfall
        res_severe = damage_vision_classifier.evaluate_damage_photo(
            incident_type="Rockfall Blockade",
            debris_volume_cum=40.0
        )
        self.assertEqual(res_severe["primary_damage_class"], "Debris / Rockfall Deposit")
        self.assertIn("SEVERE", res_severe["ai_severity_predicted"])
        self.assertTrue(res_severe["requires_human_verification"])
        self.assertGreater(res_severe["gamification_points_awarded"], 0)

        # Test Pothole Damage
        res_pothole = damage_vision_classifier.evaluate_damage_photo(
            incident_type="Pavement Distress",
            pothole_depth_cm=12.0
        )
        self.assertEqual(res_pothole["primary_damage_class"], "Pothole")

    # --------------------------------------------------------------------------
    # 3. Route Optimizer Constrained Graph Tests
    # --------------------------------------------------------------------------
    def test_routing_engine_optimization(self):
        """Verify AI multi-criteria route optimizer."""
        route = routing_engine.optimize_route(
            origin_id="AS-KAM",
            destination_id="ML-EKH",
            cargo_type="STANDARD_COMMERCIAL",
            vehicle_weight_tons=16.0,
            departure_hour=8
        )
        self.assertIn("primary_route", route)
        self.assertIn("alternatives", route)
        self.assertIn("total_distance_km", route["primary_route"])
        self.assertIn("total_time_hrs", route["primary_route"])
        self.assertGreater(route["primary_route"]["total_distance_km"], 0)

    # --------------------------------------------------------------------------
    # 4. Chatbot LLM Inference Tests
    # --------------------------------------------------------------------------
    def test_chatbot_engine_query(self):
        """Verify NERALIS AI Operations Assistant query processing and suggestions."""
        ans = chatbot_engine.process_query("What is the status of NH-27 corridor?", language="en")
        self.assertIn("text", ans)
        self.assertIn("suggestions", ans)
        self.assertGreater(len(ans["text"]), 10)

    # --------------------------------------------------------------------------
    # 5. FastAPI ML Route Integration Tests
    # --------------------------------------------------------------------------
    def test_api_predictions_forecast(self):
        response = self.client.get("/api/predictions/forecast?hours=24")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("corridors", data)
        self.assertGreater(len(data["corridors"]), 0)

    def test_api_predictions_72h(self):
        response = self.client.get("/api/predictions/72h?hours=48")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["forecast_horizon_hours"], 48)

    def test_api_predictions_model_metrics(self):
        response = self.client.get("/api/predictions/model-metrics")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("accuracy_pct", data)

    def test_api_predictions_feature_importance(self):
        response = self.client.get("/api/predictions/feature-importance")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("feature_importance", data)

    def test_api_predictions_corridor_get(self):
        response = self.client.get("/api/predictions/corridor/SEG-01?hours=24&rain_mm=50.0")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["corridor_id"], "SEG-01")

    def test_api_predictions_corridor_post(self):
        payload = {
            "corridor_id": "SEG-03",
            "forecast_hours": 48,
            "custom_rain_mm": 120.0,
            "custom_soil_pct": 85.0
        }
        response = self.client.post("/api/predictions/corridor", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["corridor_id"], "SEG-03")
        self.assertIn("predicted_risk_pct", data)

    def test_api_predictions_prepositioning(self):
        response = self.client.get("/api/predictions/prepositioning")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("advisories", data)
        self.assertGreater(len(data["advisories"]), 0)

    def test_api_predictions_digital_twin(self):
        payload = {
            "incident_type": "BRIDGE_COLLAPSE",
            "target_id": "BR-04"
        }
        response = self.client.post("/api/predictions/digital-twin", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("scenario", data)
        self.assertIn("immediate_impact", data)

    def test_api_routes_optimize(self):
        payload = {
            "origin": "AS-KAM",
            "destination": "AS-SIL",
            "cargo_type": "EMERGENCY_MEDICAL",
            "vehicle_weight_tons": 10.0,
            "departure_hour": 6
        }
        response = self.client.post("/api/routes/optimize", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("primary_route", data)

    def test_api_reports_field_ml_classification(self):
        payload = {
            "client_event_id": "TEST-EVT-ML-001",
            "reporter_name": "Er. Test Inspector",
            "reporter_role": "Junior Engineer PWD",
            "state": "Assam",
            "district": "AS-KAM",
            "location_name": "NH-27 Km 42",
            "lat": 26.15,
            "lng": 91.75,
            "incident_type": "Rockfall Blockade",
            "crack_length_m": 0.0,
            "pothole_depth_cm": 0.0,
            "debris_volume_cum": 35.0
        }
        response = self.client.post("/api/reports/field", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("ai_severity_predicted", data)
        self.assertIn("ai_confidence_pct", data)

    def test_api_chatbot_query(self):
        payload = {"query": "How does the route optimizer work?", "language": "en"}
        response = self.client.post("/api/chatbot/query", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("text", data)


if __name__ == "__main__":
    unittest.main()
