"""
Field Reporting & Mobile Sync Engine (Module 6).
Handles geo-tagged field incident reports, YOLOv8 damage severity classification,
outbox sync status with client_event_id, and human engineer verification.
"""

from typing import Dict, List, Any
import datetime
import random
from app.ml.damage_classifier import damage_vision_classifier

class FieldReportingEngine:
    def __init__(self):
        self.reports = self._get_sample_reports()
        self.leaderboard = self._get_initial_leaderboard()

    def _get_sample_reports(self) -> List[Dict[str, Any]]:
        return [
            {
                "id": "REP-2026-0412",
                "client_event_id": "CLIENT-SYNC-9901-AS",
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
                "ai_severity_predicted": "MODERATE (Tier 2 PWD Repair)",
                "ai_confidence_pct": 94.2,
                "ai_model_version": "NER-YOLOv8-DamageVision-v2.4-transfer",
                "status": "VERIFIED_DISPATCHED",
                "assigned_crew": "BRO Taskforce Unit 14",
                "photo_url": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80",
                "points_awarded": 50,
                "sync_status": "SYNCED",
                "source": "SRC-FIELD-PWA",
                "verification_status": "VERIFIED"
            },
            {
                "id": "REP-2026-0413",
                "client_event_id": "CLIENT-SYNC-9902-ML",
                "reporter_name": "Khrawbok Lyngdoh",
                "reporter_role": "SDRF First Responder",
                "state": "Meghalaya",
                "district": "ML-EKH (East Khasi Hills)",
                "location_name": "Sohra Escarpment Road Curve 9",
                "lat": 25.2810,
                "lng": 91.7350,
                "timestamp": "2026-08-26T08:30:00+05:30",
                "incident_type": "Debris / Rockfall Deposit",
                "damage_dimensions": {"crack_length_m": 12.0, "pothole_depth_cm": 0, "debris_volume_cum": 45},
                "ai_severity_predicted": "SEVERE (Tier 3 Immediate Action)",
                "ai_confidence_pct": 96.8,
                "ai_model_version": "NER-YOLOv8-DamageVision-v2.4-transfer",
                "status": "UNDER_CLEARANCE",
                "assigned_crew": "Meghalaya PWD Rapid Response",
                "photo_url": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
                "points_awarded": 75,
                "sync_status": "SYNCED",
                "source": "SRC-FIELD-PWA",
                "verification_status": "VERIFIED"
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
        crack = float(payload.get("crack_length_m", 2.0))
        depth = float(payload.get("pothole_depth_cm", 10.0))
        debris = float(payload.get("debris_volume_cum", 5.0))
        inc_type = payload.get("incident_type", "Road Damage")

        # Run vision evaluator
        eval_result = damage_vision_classifier.evaluate_damage_photo(
            incident_type=inc_type,
            crack_length_m=crack,
            pothole_depth_cm=depth,
            debris_volume_cum=debris,
            photo_url=payload.get("photo_url")
        )

        canonical_id = f"REP-2026-{random.randint(1000, 9999)}"
        client_event_id = payload.get("client_event_id", f"OFFLINE-EVT-{random.randint(10000, 99999)}")

        new_report = {
            "id": canonical_id,
            "client_event_id": client_event_id,
            "reporter_name": payload.get("reporter_name", "Field Inspector"),
            "reporter_role": payload.get("reporter_role", "Junior Engineer PWD"),
            "state": payload.get("state", "Assam"),
            "district": payload.get("district", "AS-KAM"),
            "location_name": payload.get("location_name", "National Highway Corridor"),
            "lat": payload.get("lat", 26.1445),
            "lng": payload.get("lng", 91.7362),
            "timestamp": datetime.datetime.now().isoformat(),
            "incident_type": inc_type,
            "damage_dimensions": {"crack_length_m": crack, "pothole_depth_cm": depth, "debris_volume_cum": debris},
            "ai_severity_predicted": eval_result["ai_severity_predicted"],
            "ai_confidence_pct": eval_result["confidence_pct"],
            "ai_model_version": eval_result["model_version"],
            "status": "VERIFIED_QUEUED",
            "assigned_crew": "State PWD Rapid Action Division",
            "photo_url": payload.get("photo_url", "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80"),
            "points_awarded": eval_result["gamification_points_awarded"],
            "sync_status": "SYNCED",
            "source": "SRC-FIELD-PWA",
            "verification_status": "REPORTED"
        }

        self.reports.insert(0, new_report)
        return new_report

field_reporting_engine = FieldReportingEngine()
