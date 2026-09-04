"""
North Eastern Region (NER) Fleet Tracking & Telematics Master Dataset.
Includes 5+ Diverse Fleet Vehicles with NavIC/GPS Telemetry, Multi-Range Cold Chain Envelopes,
and Vehicle-Specific Journey Waypoint Logs.
"""
from typing import Dict, List, Any

NER_VEHICLES: List[Dict[str, Any]] = [
    {
        "id": "VEH-01",
        "plate_number": "AS-01-GC-4921",
        "vehicle_type": "16-Ton Insulated Cold-Chain Truck",
        "driver_name": "Birinchi Borgohain",
        "driver_phone": "+91 94350 12890",
        "driver_score": 92,
        "current_lat": 26.35,
        "current_lng": 92.15,
        "heading_deg": 65,
        "speed_kmh": 48,
        "origin": "Guwahati Central Depot",
        "destination": "Imphal Central Medical Store",
        "cargo_type": "CRITICAL_MEDICINES",
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
            "temp_history": [4.1, 4.2, 4.3, 4.1, 4.2, 4.2, 4.4, 4.2],
            "profile": "STANDARD_VACCINES (2°C - 8°C)"
        },
        "fuel_monitor": {
            "tank_level_pct": 74,
            "consumption_rate_lph": 11.2,
            "anomaly_flag": False
        },
        "eta_destination": "Today, 19:30 IST",
        "status": "IN_TRANSIT",
        "source": "SRC-FIELD-PWA",
        "observed_at": "2026-08-26T18:45:00+05:30",
        "verification_status": "OBSERVED",
        "confidence": 99.4,
        "cold_chain_profile": "STANDARD_VACCINES",
        "trip_waypoints": [
            {"time": "06:00 IST", "location": "Guwahati Central Logistics Hub", "speed": 0, "temp": 4.1, "event": "Dispatched with Verified E-Way Bill"},
            {"time": "07:30 IST", "location": "Jagiroad Checkpoint (NH-27)", "speed": 56, "temp": 4.2, "event": "QR Scan Check-in Passed"},
            {"time": "09:15 IST", "location": "Nagaon Bypass Four-Lane", "speed": 62, "temp": 4.1, "event": "NavIC Satellite Ping Normal"},
            {"time": "11:00 IST", "location": "Swagat Safe Rest Area (Jorhat)", "speed": 0, "temp": 4.2, "event": "Mandatory Driver Fatigue Break"},
            {"time": "12:45 IST", "location": "Numaligarh Foothills Transition", "speed": 38, "temp": 4.3, "event": "Entering Mountainous Sector"},
            {"time": "14:30 IST", "location": "Dimapur Border Checkpoint", "speed": 44, "temp": 4.2, "event": "Current Position Verified"}
        ]
    },
    {
        "id": "VEH-02",
        "plate_number": "MN-01-BA-7718",
        "vehicle_type": "24-Ton Heavy Multi-Axle Carrier",
        "driver_name": "Luwang Meitei",
        "driver_phone": "+91 98620 44321",
        "driver_score": 84,
        "current_lat": 25.105,
        "current_lng": 92.388,
        "heading_deg": 135,
        "speed_kmh": 22,
        "origin": "Silchar Logistics Hub",
        "destination": "Churachandpur District Depot",
        "cargo_type": "FOOD_PDS",
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
        "status": "SLOW_TERRAIN",
        "source": "SRC-FIELD-PWA",
        "observed_at": "2026-08-26T18:45:00+05:30",
        "verification_status": "OBSERVED",
        "confidence": 97.8,
        "trip_waypoints": [
            {"time": "05:30 IST", "location": "Silchar FCI Food Grain Depot", "speed": 0, "temp": 28.0, "event": "Gross Tare Weight Confirmed (21 MT)"},
            {"time": "08:00 IST", "location": "Sonapur Tunnel Ingress Sector", "speed": 18, "temp": 26.5, "event": "Navigating Mud Slurry Speed Reduction"},
            {"time": "11:15 IST", "location": "Jiribam Checkpost Entry", "speed": 24, "temp": 27.2, "event": "State Border Inward Manifest Logged"},
            {"time": "13:30 IST", "location": "Makru River Bailey Bridge Passage", "speed": 10, "temp": 26.0, "event": "Axle Weight Load Sensor Certified"},
            {"time": "15:45 IST", "location": "Nungba Valley Midpoint", "speed": 22, "temp": 25.0, "event": "Satellite Telemetry Active"}
        ]
    },
    {
        "id": "VEH-03",
        "plate_number": "AR-01-K-1092",
        "vehicle_type": "4WD Medium Mountain Tanker",
        "driver_name": "Tsering Norbu",
        "driver_phone": "+91 94022 89110",
        "driver_score": 88,
        "current_lat": 27.31,
        "current_lng": 92.38,
        "heading_deg": 310,
        "speed_kmh": 28,
        "origin": "Tezpur POL Depot",
        "destination": "Tawang Forward Stockpile",
        "cargo_type": "FUEL_HAZMAT",
        "cargo_weight_tons": 12.0,
        "e_way_bill_no": "EWB-NER-2026-66291",
        "network_mode": "NavIC Satellite Active",
        "cold_chain": None,
        "fuel_monitor": {
            "tank_level_pct": 65,
            "consumption_rate_lph": 14.5,
            "anomaly_flag": False
        },
        "eta_destination": "Today, 22:15 IST",
        "status": "IN_TRANSIT",
        "source": "SRC-FIELD-PWA",
        "observed_at": "2026-08-26T18:45:00+05:30",
        "verification_status": "OBSERVED",
        "confidence": 98.9,
        "trip_waypoints": [
            {"time": "06:15 IST", "location": "Tezpur Military POL Terminal", "speed": 0, "temp": 24.0, "event": "Hazmat Safety Seal Engaged"},
            {"time": "08:45 IST", "location": "Bhalukpong Gate (Arunachal Border)", "speed": 35, "temp": 22.0, "event": "Inner Line Permit QR Verified"},
            {"time": "11:30 IST", "location": "Tenga Valley Armed Escort Join", "speed": 25, "temp": 18.0, "event": "Mountain Convoy Grouping"},
            {"time": "14:15 IST", "location": "Bomdila Pass (Elevation 2,530m)", "speed": 22, "temp": 14.5, "event": "Brake Temperature Checked Normal"},
            {"time": "16:00 IST", "location": "Dirang High-Altitude Transition", "speed": 28, "temp": 12.0, "event": "NavIC Ping Frequency: 15s"}
        ]
    },
    {
        "id": "VEH-04",
        "plate_number": "SK-01-D-5503",
        "vehicle_type": "BRO Heavy Excavator Carrier (70R)",
        "driver_name": "Subedar K. Sharma",
        "driver_phone": "+91 94360 88210",
        "driver_score": 96,
        "current_lat": 27.15,
        "current_lng": 88.52,
        "heading_deg": 15,
        "speed_kmh": 18,
        "origin": "Sevoke BRO Base",
        "destination": "Dikchu km 29 Landslide Site",
        "cargo_type": "CONSTRUCTION_HEAVY",
        "cargo_weight_tons": 38.0,
        "e_way_bill_no": "BRO-DISASTER-2026-04",
        "network_mode": "NavIC + VHF Radio",
        "cold_chain": None,
        "fuel_monitor": {
            "tank_level_pct": 82,
            "consumption_rate_lph": 24.0,
            "anomaly_flag": False
        },
        "eta_destination": "Today, 21:00 IST",
        "status": "EMERGENCY_DISPATCH",
        "source": "SRC-BRO-VARTAK",
        "observed_at": "2026-08-26T18:45:00+05:30",
        "verification_status": "VERIFIED",
        "confidence": 99.6,
        "trip_waypoints": [
            {"time": "12:00 IST", "location": "Sevoke Base Project Swastik", "speed": 0, "temp": 28.0, "event": "Mobilized for Emergency Debris Clearing"},
            {"time": "13:30 IST", "location": "Coronation Bridge Approach", "speed": 15, "temp": 27.0, "event": "Single-Vehicle Structural Passage"},
            {"time": "15:00 IST", "location": "Rongpo Sikkim Border Barrier", "speed": 20, "temp": 24.0, "event": "Emergency Priority Clearance"},
            {"time": "16:45 IST", "location": "Singtam Teesta Valley Highway", "speed": 18, "temp": 22.0, "event": "Heavy Earthmover En Route km 29"}
        ]
    },
    {
        "id": "VEH-05",
        "plate_number": "AS-01-HC-8812",
        "vehicle_type": "12-Ton Ultra-Cold Biological Transport",
        "driver_name": "Dipankar Saikia",
        "driver_phone": "+91 94351 99012",
        "driver_score": 95,
        "current_lat": 26.1445,
        "current_lng": 91.7362,
        "heading_deg": 45,
        "speed_kmh": 52,
        "origin": "Guwahati Apex Biotech Hub",
        "destination": "Gangtok State Vaccine Vault",
        "cargo_type": "CRITICAL_MEDICINES",
        "cargo_weight_tons": 6.0,
        "e_way_bill_no": "EWB-NER-2026-90412",
        "network_mode": "NavIC + 4G LTE",
        "cold_chain_profile": "ULTRA_COLD_BIOLOGICS",
        "cold_chain": {
            "sensor_id": "TEMP-ULTRA-01",
            "profile": "ULTRA_COLD_BIOLOGICS (-20°C to -15°C)",
            "current_temp_c": -18.2,
            "target_min_c": -20.0,
            "target_max_c": -15.0,
            "status": "NORMAL (Safe -18.2°C)",
            "door_locked": True,
            "temp_history": [-18.0, -18.2, -18.1, -18.3, -18.2, -18.4, -18.2, -18.1]
        },
        "fuel_monitor": {
            "tank_level_pct": 88,
            "consumption_rate_lph": 12.0,
            "anomaly_flag": False
        },
        "eta_destination": "Tomorrow, 07:30 IST",
        "status": "IN_TRANSIT",
        "source": "SRC-FIELD-PWA",
        "observed_at": "2026-08-28T21:15:00+05:30",
        "verification_status": "OBSERVED",
        "confidence": 99.6,
        "trip_waypoints": [
            {"time": "08:00 IST", "location": "Guwahati Biotech Park Cold Room", "speed": 0, "temp": -18.0, "event": "Nitrogen Compressor Activated (-18°C)"},
            {"time": "10:15 IST", "location": "Rangia Highway Bypass (NH-27)", "speed": 58, "temp": -18.2, "event": "Telemetry Ping: Temperature Stable"},
            {"time": "12:30 IST", "location": "Bongaigaon Medical Buffer Station", "speed": 48, "temp": -18.1, "event": "Secondary Generator Health Check OK"},
            {"time": "14:45 IST", "location": "Alipurduar Gateway Transition", "speed": 52, "temp": -18.3, "event": "Approaching North Bengal - Sikkim Corridor"}
        ]
    }
]
