"""
Field Reporting & Mobile Sync Engine (SIH26002 - Module 6).
Handles geo-tagged field incident reports, YOLOv8 damage severity classification,
checkpoint QR arrival scans, proof-of-delivery signatures, and reporter gamification points.
"""

from typing import Dict, List, Any
import datetime
import random

class FieldReportingEngine:
    def __init__(self):
        self.reports = self._get_sample_reports()
        self.leaderboard = self._get_initial_leaderboard()

    def _get_sample_reports(self) -> List[Dict[str, Any]]:
        return [
            {
                "id": "REP-2026-0412",
                "reporter_name": "Ranjan Hazarika",
                "reporter_role": "PWD Junior Engineer (Kamrup)",
                "state": "Assam",
                "district": "AS-KAM (Kamrup)",
                "location_name": "NH-27 Changsari Culvert Km 14",
                "lat": 26.2410,
                "lng": 91.6820,
                "timestamp": "2026-08-26T07:45:00+05:30",
                "incident_type": "Roadbed Erosion / Pavement Subsidence",
                "damage_dimensions": {"crack_length_m": 4.5, "pothole_depth_cm": 24, "debris_volume_cum": 8},
                "ai_severity_predicted": "MODERATE (Tier 2 Action)",
                "status": "VERIFIED_DISPATCHED",
                "assigned_crew": "BRO Taskforce Unit 14",
                "photo_url": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80",
                "points_awarded": 50
            },
            {
                "id": "REP-2026-0413",
                "reporter_name": "Khrawbok Lyngdoh",
                "reporter_role": "SDRF First Responder",
                "state": "Meghalaya",
                "district": "ML-EKH (East Khasi Hills)",
                "location_name": "Sohra Escarpment Road Curve 9",
                "lat": 25.2810,
                "lng": 91.7350,
                "timestamp": "2026-08-26T08:30:00+05:30",
                "incident_type": "Rockfall & Mud Spillage",
                "damage_dimensions": {"crack_length_m": 12.0, "pothole_depth_cm": 0, "debris_volume_cum": 45},
                "ai_severity_predicted": "SEVERE (Tier 3 Action)",
                "status": "UNDER_CLEARANCE",
                "assigned_crew": "Meghalaya PWD Rapid Response",
                "photo_url": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
                "points_awarded": 75
            }
        ]

    def _get_initial_leaderboard(self) -> List[Dict[str, Any]]:
        return [
            {"rank": 1, "name": "Khrawbok Lyngdoh", "state": "Meghalaya", "district": "East Khasi Hills", "points": 1450, "badge": "Master Field Scout", "reports_count": 28},
            {"rank": 2, "name": "Ranjan Hazarika", "state": "Assam", "district": "Kamrup Met", "points": 1280, "badge": "Veteran Surveyor", "reports_count": 24},
            {"rank": 3, "name": "Pemba Tashi", "state": "Arunachal Pradesh", "district": "Tawang", "points": 1150, "badge": "Alpine Scout", "reports_count": 19},
            {"rank": 4, "name": "Thangminlun Haokip", "state": "Manipur", "district": "Churachandpur", "points": 980, "badge": "Hill Pathfinder", "reports_count": 16},
            {"rank": 5, "name": "Zothanmawia", "state": "Mizoram", "district": "Aizawl", "points": 890, "badge": "Ridge Tracker", "reports_count": 15},
        ]

    def get_reports(self) -> List[Dict[str, Any]]:
        return self.reports

    def get_leaderboard(self) -> List[Dict[str, Any]]:
        return self.leaderboard

    def submit_report(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        # Simulated YOLOv8 CV classifier
        crack = float(payload.get("crack_length_m", 2.0))
        depth = float(payload.get("pothole_depth_cm", 10.0))
        debris = float(payload.get("debris_volume_cum", 5.0))

        severity = "MINOR"
        pts = 30
        if debris > 30 or depth > 20:
            severity = "SEVERE (Tier 3 Action)"
            pts = 75
        elif debris > 10 or depth > 12 or crack > 5:
            severity = "MODERATE (Tier 2 Action)"
            pts = 50

        new_report = {
            "id": f"REP-2026-{random.randint(1000, 9999)}",
            "reporter_name": payload.get("reporter_name", "Field Inspector"),
            "reporter_role": payload.get("reporter_role", "Junior Engineer PWD"),
            "state": payload.get("state", "Assam"),
            "district": payload.get("district", "AS-KAM"),
            "location_name": payload.get("location_name", "National Highway Corridor"),
            "lat": payload.get("lat", 26.1445),
            "lng": payload.get("lng", 91.7362),
            "timestamp": datetime.datetime.now().isoformat(),
            "incident_type": payload.get("incident_type", "Road Damage"),
            "damage_dimensions": {"crack_length_m": crack, "pothole_depth_cm": depth, "debris_volume_cum": debris},
            "ai_severity_predicted": severity,
            "status": "VERIFIED_QUEUED",
            "assigned_crew": "State PWD Rapid Action Division",
            "photo_url": payload.get("photo_url", "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80"),
            "points_awarded": pts
        }
        self.reports.insert(0, new_report)
        return new_report

field_reporting_engine = FieldReportingEngine()
