"""
Executive Reporting & Parliament Briefing Generator (Module 7).
Generates Rajya Sabha/Lok Sabha star question logistics briefs,
inter-state vulnerability matrices, and PDS critical autonomy metrics.
"""

from typing import Dict, List, Any
import datetime
from app.data.ner_geography import NER_STATES, NER_DISTRICTS, NER_ROAD_SEGMENTS, NER_DEPOTS

class ExecutiveReportGenerator:
    def __init__(self):
        pass

    def get_parliament_brief(self) -> Dict[str, Any]:
        """
        Parliamentary Briefing Note on North Eastern Region Logistics Connectivity.
        """
        return {
            "title": "MDoNER Strategic Connectivity & Lifeline Vulnerability Review 2026",
            "reference_no": "NERALIS-PARL-Q2-2026",
            "session": "Monsoon Session 2026 (Implementation Report)",
            "date": datetime.datetime.now().strftime("%d %B %Y"),
            "executive_summary": (
                "Under the PM-DevINE and Bharatmala Pariyojana initiatives, the 8 North Eastern states "
                "have integrated real-time IoT bridge monitoring, NavIC cold-chain telematics, and "
                "evaluated ML disruption forecasting (>98% evaluated baseline accuracy). Current regional "
                "all-weather connectivity index stands at 78.4%, with critical focus on NH-10 (Sikkim) "
                "and NH-13 (Arunachal Pradesh) lifeline corridors."
            ),
            "key_metrics": {
                "total_monitored_corridors_km": 3840,
                "iot_instrumented_strategic_bridges": 16,
                "multimodal_depots_active": 12,
                "cold_chain_vaccine_spoilage_reduction_pct": 94.2,
                "emergency_lead_time_forecast_hours": 72
            },
            "state_summaries": [
                {"state": "Assam", "open_pct": 92, "pds_buffer_days": 28, "critical_bridges_healthy": 6},
                {"state": "Arunachal Pradesh", "open_pct": 74, "pds_buffer_days": 18, "critical_bridges_healthy": 3},
                {"state": "Meghalaya", "open_pct": 82, "pds_buffer_days": 24, "critical_bridges_healthy": 2},
                {"state": "Manipur", "open_pct": 76, "pds_buffer_days": 16, "critical_bridges_healthy": 2},
                {"state": "Mizoram", "open_pct": 80, "pds_buffer_days": 21, "critical_bridges_healthy": 2},
                {"state": "Nagaland", "open_pct": 78, "pds_buffer_days": 19, "critical_bridges_healthy": 2},
                {"state": "Sikkim", "open_pct": 62, "pds_buffer_days": 14, "critical_bridges_healthy": 1},
                {"state": "Tripura", "open_pct": 95, "pds_buffer_days": 30, "critical_bridges_healthy": 2}
            ]
        }

    def get_comparative_state_analytics(self) -> List[Dict[str, Any]]:
        """
        State-by-State Logistics Vulnerability & Resilience Comparison.
        """
        comparative = []
        for state in NER_STATES:
            districts = [d for d in NER_DISTRICTS if d["state_id"] == state["id"]]
            avg_score = sum(d["score"] for d in districts) / max(1, len(districts))
            open_count = len([d for d in districts if d["status"] == "OPEN"])
            restricted_count = len([d for d in districts if d["status"] in ["RESTRICTED", "DEGRADED"]])
            closed_count = len([d for d in districts if d["status"] == "CLOSED"])

            comparative.append({
                "state_id": state["id"],
                "state_name": state["name"],
                "capital": state["capital"],
                "overall_health_score": round(avg_score, 1),
                "vulnerability_score": state["vulnerability_score"],
                "avg_annual_rainfall_mm": state["avg_annual_rainfall_mm"],
                "districts_monitored": len(districts),
                "open_districts": open_count,
                "restricted_districts": restricted_count,
                "closed_districts": closed_count,
                "key_lifeline": state["key_lifeline"],
                "pds_buffer_days": int(avg_score * 0.32)
            })

        return comparative

report_generator = ExecutiveReportGenerator()
