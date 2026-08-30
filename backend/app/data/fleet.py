"""
North Eastern Region (NER) Fleet Tracking & Telematics Master Dataset.
Includes 16+ Diverse Fleet Vehicles with NavIC/GPS Telemetry and Multi-Range Cold Chain Envelopes.
"""
from typing import Dict, List, Any
import datetime

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
            "status": "NORMAL (Safe 4.2\u00b0C)",
            "door_locked": True,
            "temp_history": [
                4.1,
                4.2,
                4.3,
                4.1,
                4.2,
                4.2,
                4.4,
                4.2
            ],
            "profile": "STANDARD_VACCINES (2\u00b0C - 8\u00b0C)"
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
        "cold_chain_profile": "STANDARD_VACCINES"
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
        "confidence": 97.8
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
        "origin": "Tezpur Depot",
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
        "confidence": 98.9
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
        "confidence": 99.6
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
            "profile": "ULTRA_COLD_BIOLOGICS (-20\u00b0C to -15\u00b0C)",
            "current_temp_c": -18.2,
            "target_min_c": -20.0,
            "target_max_c": -15.0,
            "status": "NORMAL (Safe -18.2\u00b0C)",
            "door_locked": True,
            "temp_history": [
                -18.0,
                -18.2,
                -18.1,
                -18.3,
                -18.2
            ]
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
        "confidence": 99.6
    }
]
