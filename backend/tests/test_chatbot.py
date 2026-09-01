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
        self.assertTrue(len(res["text"]) > 10)

    def test_chatbot_engine_overview(self):
        res = chatbot_engine.process_query("what is neralis")
        self.assertTrue(len(res["text"]) > 20)

    def test_chatbot_engine_routing_query(self):
        res = chatbot_engine.process_query("which routes are optimized by AI?")
        self.assertTrue(len(res["text"]) > 20)

    def test_chatbot_engine_prediction_query(self):
        res = chatbot_engine.process_query("explain 72h disruption forecasting")
        self.assertTrue(len(res["text"]) > 20)

    def test_chatbot_engine_district_entity(self):
        res = chatbot_engine.process_query("what is the status of Kamrup district?")
        self.assertTrue("kamrup" in res["text"].lower())

    def test_chatbot_engine_bridge_entity(self):
        res = chatbot_engine.process_query("tell me about Saraighat Bridge")
        self.assertTrue("saraighat" in res["text"].lower())

    def test_chatbot_engine_fleet_query(self):
        res = chatbot_engine.process_query("how does vehicle tracking and cold chain work?")
        self.assertTrue(len(res["text"]) > 20)

    def test_chatbot_engine_offline_ussd_query(self):
        res = chatbot_engine.process_query("how does offline mode and USSD 123 work?")
        self.assertTrue(len(res["text"]) > 20)

    def test_chatbot_engine_provenance_sources_query(self):
        res = chatbot_engine.process_query("what data sources and IMD Bhuvan feeds are used?")
        self.assertTrue(len(res["text"]) > 20)

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

    def test_chatbot_engine_gibberish(self):
        res = chatbot_engine.process_query("hcfrgbtntjn")
        self.assertEqual(res["topic"], "UNCLEAR_INPUT")
        self.assertIn("didn't quite catch", res["text"])

    def test_chatbot_suggestions_endpoint(self):
        response = self.client.get("/api/chatbot/suggestions")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("suggestions", data)
        self.assertGreaterEqual(len(data["suggestions"]), 3)


if __name__ == "__main__":
    unittest.main()
