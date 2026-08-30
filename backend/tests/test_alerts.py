"""
Tests for NERALIS Alert Dispatcher & NDMA CAP XML Generator.
"""

import unittest
from app.services.alert_dispatcher import alert_dispatcher

class TestAlerts(unittest.TestCase):

    def test_get_alerts_list(self):
        """Verifies retrieving active emergency alerts."""
        alerts = alert_dispatcher.get_alerts()
        self.assertGreaterEqual(len(alerts), 2)
        for a in alerts:
            self.assertIn("tier", a)
            self.assertIn("title", a)
            self.assertIn("affected_districts", a)

    def test_create_and_dispatch_alert(self):
        """Verifies creating an alert and separately dispatching to channels."""
        new_alert = alert_dispatcher.create_alert({
            "tier": "T3 - WARNING",
            "tier_level": 3,
            "title": "Severe Flash Flood Advisory",
            "corridor_id": "SEG-02",
            "affected_districts": ["AS-KAM", "ML-EKH"],
            "trigger_condition": "Monsoon runoff spike",
            "channels": ["SMS", "Push"],
            "message_en": "Flood warning active"
        })
        self.assertIn("id", new_alert)
        self.assertEqual(new_alert["dispatch_status"], "QUEUED")

        # Test dispatching
        dispatch_res = alert_dispatcher.dispatch_alert(new_alert["id"], channels=["SMS", "WhatsApp"])
        self.assertEqual(dispatch_res["status"], "SUCCESS")
        self.assertEqual(dispatch_res["channels_dispatched"], ["SMS", "WhatsApp"])

    def test_ndma_cap_xml_format(self):
        """Verifies NDMA / ITU-T CAP XML v1.2 compliance."""
        xml = alert_dispatcher.generate_cap_xml("ALT-2026-0891")
        self.assertTrue(xml.startswith("<?xml"))
        self.assertIn('xmlns="urn:oasis:names:tc:emergency:cap:1.2"', xml)
        self.assertIn("<identifier>NERALIS-NDMA-", xml)
        self.assertIn("<sender>neralis.disaster.ops@gov.in</sender>", xml)

    def test_morning_briefing(self):
        """Verifies 6 AM morning briefing output."""
        briefing = alert_dispatcher.get_morning_briefing()
        self.assertIn("briefing_id", briefing)
        self.assertIn("recommended_district_actions", briefing)

if __name__ == "__main__":
    unittest.main()
