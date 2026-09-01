"""
Unit tests for NERALIS AI Assistant Chatbot Engine & Endpoints.
"""

import unittest
from fastapi.testclient import TestClient
from app.main import app
from app.services.chatbot_engine import chatbot_engine


class TestChatbot(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_chatbot_engine_greeting(self):
        res = chatbot_engine.process_query("hello")
        self.assertEqual(res["topic"], "GREETING")
        self.assertIn("NERALIS", res["text"])

    def test_chatbot_engine_overview(self):
        res = chatbot_engine.process_query("what is neralis")
        self.assertEqual(res["topic"], "OVERVIEW")
        self.assertIn("MDoNER", res["text"])
        self.assertIn("8 North Eastern States", res["text"])

    def test_chatbot_engine_routing_query(self):
        # Queries with 'which', 'highway' shouldn't falsely trigger 'hi' greeting
        res = chatbot_engine.process_query("which routes are optimized by AI?")
        self.assertEqual(res["topic"], "MODULE_ROUTE")
        self.assertIn("Ro-Ro", res["text"])

    def test_chatbot_engine_prediction_query(self):
        res = chatbot_engine.process_query("explain 72h disruption forecasting")
        self.assertEqual(res["topic"], "MODULE_PREDICTION")
        self.assertIn("98.4%", res["text"])

    def test_chatbot_engine_district_entity(self):
        res = chatbot_engine.process_query("what is the status of Kamrup district?")
        self.assertEqual(res["topic"], "DISTRICT_ENTITY")
        self.assertIn("Kamrup", res["text"])

    def test_chatbot_engine_bridge_entity(self):
        res = chatbot_engine.process_query("tell me about Saraighat Bridge")
        self.assertEqual(res["topic"], "BRIDGE_ENTITY")
        self.assertIn("Saraighat", res["text"])

    def test_chatbot_engine_fleet_query(self):
        res = chatbot_engine.process_query("how does vehicle tracking and cold chain work?")
        self.assertEqual(res["topic"], "MODULE_FLEET")
        self.assertIn("NavIC", res["text"])

    def test_chatbot_engine_offline_ussd_query(self):
        res = chatbot_engine.process_query("how does offline mode and USSD 123 work?")
        self.assertEqual(res["topic"], "MODULE_OFFLINE")
        self.assertIn("USSD", res["text"])

    def test_chatbot_engine_provenance_sources_query(self):
        res = chatbot_engine.process_query("what data sources and IMD Bhuvan feeds are used?")
        self.assertEqual(res["topic"], "SOURCES")
        self.assertIn("ISRO", res["text"])

    def test_chatbot_api_endpoint(self):
        response = self.client.post("/api/chatbot/query", json={
            "query": "Tell me about NERALIS",
            "language": "en"
        })
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("text", data)
        self.assertIn("topic", data)
        self.assertIn("suggestions", data)

    def test_chatbot_engine_math_calculation(self):
        res = chatbot_engine.process_query("1+2")
        self.assertEqual(res["topic"], "CALCULATION")
        self.assertIn("3", res["text"])

        res2 = chatbot_engine.process_query("what is 470 / 62")
        self.assertEqual(res2["topic"], "CALCULATION")
        self.assertIn("7.58", res2["text"])

    def test_chatbot_engine_courtesy(self):
        res = chatbot_engine.process_query("thank you")
        self.assertEqual(res["topic"], "COURTESY")
        self.assertIn("welcome", res["text"].lower())

    def test_chatbot_suggestions_endpoint(self):
        response = self.client.get("/api/chatbot/suggestions")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("suggestions", data)
        self.assertGreaterEqual(len(data["suggestions"]), 3)


if __name__ == "__main__":
    unittest.main()
