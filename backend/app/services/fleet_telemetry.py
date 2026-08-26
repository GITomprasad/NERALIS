"""
GPS & NavIC Vehicle Tracking & Fleet Telemetry Engine (SIH26002 - Module 3).
Simulates real-time tracking, satellite failover (NavIC / 4G / Iridium),
cold chain temperature logging, fuel theft IQR anomaly detector,
driver safety scoring, and trip playback waypoints.
"""

from typing import Dict, List, Any
import time
import random

class FleetTelemetryEngine:
    def __init__(self):
        self.vehicles = self._initialize_fleet()

    def _initialize_fleet(self) -> List[Dict[str, Any]]:
        return [
            {
                "id": "VEH-01",
                "plate_number": "AS-01-GC-4921",
                "vehicle_type": "16-Ton Insulated Cold-Chain Truck",
                "driver_name": "Birinchi Borgohain",
                "driver_phone": "+91 94350 12890",
                "driver_score": 92,
                "current_lat": 26.3500,
                "current_lng": 92.1500,
                "heading_deg": 65,
                "speed_kmh": 48,
                "origin": "Guwahati Central Depot",
                "destination": "Imphal Central Medical Store",
                "cargo_type": "Life-Saving Vaccines & Insulin (Cold-Chain)",
                "cargo_weight_tons": 8.5,
                "e_way_bill_no": "EWB-NER-2026-89104",
                "network_mode": "NavIC + 4G LTE",
                "cold_chain": {
                    "sensor_id": "TEMP-CC-9901",
                    "current_temp_c": 4.2,
                    "target_min_c": 2.0,
                    "target_max_c": 8.0,
                    "status": "NORMAL (Safe 4.2°C)",
                    "door_locked": True,
                    "temp_history": [4.1, 4.2, 4.3, 4.1, 4.2, 4.2, 4.4, 4.2]
                },
                "fuel_monitor": {
                    "tank_level_pct": 74,
                    "consumption_rate_lph": 11.2,
                    "anomaly_flag": False
                },
                "eta_destination": "Today, 19:30 IST",
                "status": "IN_TRANSIT"
            },
            {
                "id": "VEH-02",
                "plate_number": "MN-01-BA-7718",
                "vehicle_type": "24-Ton Heavy Multi-Axle Carrier",
                "driver_name": "Luwang Meitei",
                "driver_phone": "+91 98620 44321",
                "driver_score": 84,
                "current_lat": 25.1050,
                "current_lng": 92.3880,
                "heading_deg": 135,
                "speed_kmh": 22,
                "origin": "Silchar Logistics Hub",
                "destination": "Churachandpur District Depot",
                "cargo_type": "PDS Fortified Food Grains",
                "cargo_weight_tons": 21.0,
                "e_way_bill_no": "EWB-NER-2026-33918",
                "network_mode": "Satellite Iridium Failover (Low 2G)",
                "cold_chain": None,
                "fuel_monitor": {
                    "tank_level_pct": 58,
                    "consumption_rate_lph": 16.8,
                    "anomaly_flag": False
                },
                "eta_destination": "Tomorrow, 08:00 IST",
                "status": "SLOW_TERRAIN"
            },
            {
                "id": "VEH-03",
                "plate_number": "AR-01-K-1092",
                "vehicle_type": "4WD Medium Mountain Tanker",
                "driver_name": "Tsering Norbu",
                "driver_phone": "+91 94022 89110",
                "driver_score": 88,
                "current_lat": 27.3100,
                "current_lng": 92.3800,
                "heading_deg": 310,
                "speed_kmh": 28,
                "origin": "Tezpur Depot",
                "destination": "Tawang Forward Stockpile",
                "cargo_type": "High-Altitude Winter Diesel (Hazmat)",
                "cargo_weight_tons": 12.0,
                "e_way_bill_no": "EWB-NER-2026-66291",
                "network_mode": "NavIC Satellite Active",
                "cold_chain": None,
                "fuel_monitor": {
                    "tank_level_pct": 65,
                    "consumption_rate_lph": 14.5,
                    "anomaly_flag": False
                },
                "eta_destination": "Today, 17:45 IST",
                "status": "CONVOY_ESCORT"
            },
            {
                "id": "VEH-04",
                "plate_number": "ML-05-D-8824",
                "vehicle_type": "Refrigerated Emergency Blood Van",
                "driver_name": "Pynshailang Kharbhih",
                "driver_phone": "+91 97740 66523",
                "driver_score": 96,
                "current_lat": 25.4800,
                "current_lng": 91.7500,
                "heading_deg": 180,
                "speed_kmh": 52,
                "origin": "Guwahati Apex Medical",
                "destination": "Nongstoin Civil Hospital",
                "cargo_type": "Emergency Blood Units & Plasma",
                "cargo_weight_tons": 3.2,
                "e_way_bill_no": "EWB-NER-2026-11842",
                "network_mode": "4G LTE",
                "cold_chain": {
                    "sensor_id": "TEMP-BL-402",
                    "current_temp_c": 3.8,
                    "target_min_c": 2.0,
                    "target_max_c": 6.0,
                    "status": "NORMAL (Safe 3.8°C)",
                    "door_locked": True,
                    "temp_history": [3.6, 3.7, 3.8, 3.8, 3.9, 3.8]
                },
                "fuel_monitor": {
                    "tank_level_pct": 82,
                    "consumption_rate_lph": 7.5,
                    "anomaly_flag": False
                },
                "eta_destination": "Today, 14:15 IST",
                "status": "CRITICAL_FAST_TRACK"
            },
            {
                "id": "VEH-05",
                "plate_number": "SK-01-A-5590",
                "vehicle_type": "12-Ton PWD Emergency Spares Carrier",
                "driver_name": "Karma Lepcha",
                "driver_phone": "+91 98320 11982",
                "driver_score": 79,
                "current_lat": 27.2800,
                "current_lng": 88.5100,
                "heading_deg": 15,
                "speed_kmh": 0,
                "origin": "Siliguri Transit Hub",
                "destination": "Mangan Bridge Repair Site",
                "cargo_type": "Bailey Bridge Pre-Fab Components",
                "cargo_weight_tons": 11.4,
                "e_way_bill_no": "EWB-NER-2026-77210",
                "network_mode": "Satellite Iridium",
                "cold_chain": None,
                "fuel_monitor": {
                    "tank_level_pct": 42,
                    "consumption_rate_lph": 0.0,
                    "anomaly_flag": False
                },
                "eta_destination": "DELAYED (Awaiting Landslide Clearance)",
                "status": "STOPPED_CHECKPOINT"
            }
        ]

    def get_all_vehicles(self) -> List[Dict[str, Any]]:
        # Simulate slight jitter in GPS movement
        for v in self.vehicles:
            if v["status"] != "STOPPED_CHECKPOINT":
                v["current_lat"] += (random.random() - 0.5) * 0.002
                v["current_lng"] += (random.random() - 0.5) * 0.002
        return self.vehicles

    def get_trip_playback(self, vehicle_id: str) -> Dict[str, Any]:
        """
        Historical Trip Playback with speed profile, stops, and alerts.
        """
        waypoints = [
            {"time": "06:00 IST", "lat": 26.1445, "lng": 91.7362, "speed": 0, "event": "Departed Guwahati Central Depot", "temp_c": 3.9},
            {"time": "07:30 IST", "lat": 26.3100, "lng": 92.0500, "speed": 54, "event": "Passed Jagiroad Checkpoint (QR Scanned)", "temp_c": 4.0},
            {"time": "09:15 IST", "lat": 26.4800, "lng": 92.5200, "speed": 48, "event": "Cruising on NH-27 4-Lane Sector", "temp_c": 4.1},
            {"time": "11:00 IST", "lat": 26.7509, "lng": 94.2037, "speed": 0, "event": "Mandatory 45-min Driver Rest Stop at Swagat Center", "temp_c": 4.2},
            {"time": "12:30 IST", "lat": 26.3500, "lng": 93.9000, "speed": 35, "event": "Entering Hilly Sector - Speed throttled for safety", "temp_c": 4.3},
            {"time": "14:00 IST", "lat": 25.9068, "lng": 93.7273, "speed": 42, "event": "Current Position: Passing Dimapur Gateway", "temp_c": 4.2},
        ]
        return {
            "vehicle_id": vehicle_id,
            "total_waypoints": len(waypoints),
            "waypoints": waypoints,
            "harsh_braking_events": 1,
            "overspeed_events": 0,
            "cold_chain_excursions": 0,
            "total_distance_covered_km": 284.0
        }

fleet_telemetry_engine = FleetTelemetryEngine()
