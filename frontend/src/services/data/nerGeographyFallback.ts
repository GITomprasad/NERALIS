/**
 * Fallback Master Geospatial & Operational Data for NERALIS Frontend.
 * Ensures the Map, Fleet Tracker, Bridge Monitors, and Route Optimizer are 100% functional
 * even before the backend connection is established or in offline PWA mode.
 */

import type {
  District,
  RoadSegment,
  Bridge,
  SupplyDepot,
  Vehicle,
  Alert,
  FieldReport,
  SourceRegistryItem
} from '../../types';

export const FALLBACK_SOURCES: SourceRegistryItem[] = [
  {
    "id": "SRC-IMD-AWS",
    "name": "India Meteorological Department (IMD)",
    "department": "Ministry of Earth Sciences, Govt. of India",
    "service": "Automated Weather Stations (AWS) & 72h Rainfall Forecast API",
    "update_frequency": "Every 15 minutes",
    "status": "ONLINE",
    "trust_score": 99.4,
    "endpoint_pattern": "https://api.imd.gov.in/public/v2/weather/ner/{district_code}",
    "data_types": [
      "Rainfall (mm)",
      "Soil Moisture (%)",
      "Cloudburst Alerts",
      "Warning Bulletins"
    ]
  },
  {
    "id": "SRC-ISRO-BHUVAN",
    "name": "ISRO / NRSC Bhuvan Geoportal",
    "department": "Department of Space, Govt. of India",
    "service": "Bhuvan Thematic Disaster & Terrain Elevation (DEM) API",
    "update_frequency": "Hourly / Satellite Pass",
    "status": "ONLINE",
    "trust_score": 99.8,
    "endpoint_pattern": "https://bhuvan-app1.nrsc.gov.in/api/thematic/ner/slopes",
    "data_types": [
      "Slope Gradient",
      "Terrain Ruggedness (TRI)",
      "Landslide Susceptibility Atlas"
    ]
  },
  {
    "id": "SRC-CWC-GAUGES",
    "name": "Central Water Commission (CWC)",
    "department": "Ministry of Jal Shakti, Govt. of India",
    "service": "Live Brahmaputra & Barak Basin Hydro-Telemetric River Gauges",
    "update_frequency": "Every 30 minutes",
    "status": "ONLINE",
    "trust_score": 99.2,
    "endpoint_pattern": "https://cwc.gov.in/telemetry/gauges/ner",
    "data_types": [
      "River Water Level (m)",
      "Danger Level Margin",
      "Bridge Pier Scour Velocity"
    ]
  },
  {
    "id": "SRC-BRO-VARTAK",
    "name": "Border Roads Organisation (BRO) - Project Vartak & Project Dantak",
    "department": "Ministry of Defence, Govt. of India",
    "service": "High-Altitude Pass & Strategic Highway Clearance Status Feed",
    "update_frequency": "Continuous / Event Driven",
    "status": "ONLINE",
    "trust_score": 98.9,
    "endpoint_pattern": "https://bro.gov.in/api/v1/corridor-status/ner",
    "data_types": [
      "Pass Blockades",
      "Avalanche / Landslide Clearances",
      "Weight / Dimension Restrictions"
    ]
  },
  {
    "id": "SRC-NDMA-CAP",
    "name": "National Disaster Management Authority (NDMA) & Sachet",
    "department": "Ministry of Home Affairs, Govt. of India",
    "service": "Common Alerting Protocol (CAP XML v1.2) Multi-Hazard Feed",
    "update_frequency": "Real-time Push",
    "status": "ONLINE",
    "trust_score": 99.6,
    "endpoint_pattern": "https://sachet.ndma.gov.in/cap/v1.2/feed/ner",
    "data_types": [
      "Multi-Tier Disaster Alerts",
      "Evacuation Orders",
      "Red / Orange Weather Warnings"
    ]
  },
  {
    "id": "SRC-STATE-PWD",
    "name": "North East State PWD Road Safety Divisions",
    "department": "Governments of AS, AR, MN, ML, MZ, NL, SK, TR",
    "service": "State Highway Damage Audits & Maintenance Crew Dispatches",
    "update_frequency": "Hourly",
    "status": "ONLINE",
    "trust_score": 97.5,
    "endpoint_pattern": "https://pwd.ner.gov.in/api/incidents/active",
    "data_types": [
      "Potholes / Culvert Failures",
      "Pavement Subsidence",
      "Single-Lane Convoy Advisories"
    ]
  },
  {
    "id": "SRC-FIELD-PWA",
    "name": "NERALIS PWA Field Inspector Network & NavIC Telemetry",
    "department": "Verified First Responders, PWD Junior Engineers, Transport Drivers",
    "service": "Geo-Tagged Incident Ground Truth & On-Device Vision Classification",
    "update_frequency": "Real-time / Outbox Synced",
    "status": "ONLINE",
    "trust_score": 96.8,
    "endpoint_pattern": "https://neralis.gov.in/api/reports/field",
    "data_types": [
      "Damage Photos",
      "Visual Crack / Debris Dimensions",
      "On-Scene GPS Telemetry"
    ]
  }
];

export const FALLBACK_DISTRICTS: District[] = [
  {
    "id": "AS-KAM",
    "name": "Kamrup Metropolitan (Guwahati)",
    "state": "Assam",
    "state_id": "AS",
    "lat": 26.1445,
    "lng": 91.7362,
    "elevation": 55,
    "terrain": "Plain / River Basin",
    "score": 94,
    "status": "OPEN",
    "risk_level": "LOW",
    "phc_count": 48,
    "critical_stock_pct": 94,
    "rainfall_24h_mm": 18.5,
    "soil_moisture_pct": 52,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 99.2
  },
  {
    "id": "AS-DIB",
    "name": "Dibrugarh",
    "state": "Assam",
    "state_id": "AS",
    "lat": 27.4728,
    "lng": 94.912,
    "elevation": 108,
    "terrain": "Brahmaputra Floodplain",
    "score": 86,
    "status": "OPEN",
    "risk_level": "MODERATE",
    "phc_count": 36,
    "critical_stock_pct": 88,
    "rainfall_24h_mm": 42.0,
    "soil_moisture_pct": 68,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 98.8
  },
  {
    "id": "AS-SIL",
    "name": "Cachar (Silchar)",
    "state": "Assam",
    "state_id": "AS",
    "lat": 24.8333,
    "lng": 92.7789,
    "elevation": 35,
    "terrain": "Barak Valley Floodplain",
    "score": 71,
    "status": "RESTRICTED",
    "risk_level": "HIGH",
    "phc_count": 42,
    "critical_stock_pct": 74,
    "rainfall_24h_mm": 115.0,
    "soil_moisture_pct": 89,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 98.4
  },
  {
    "id": "AS-JOH",
    "name": "Jorhat",
    "state": "Assam",
    "state_id": "AS",
    "lat": 26.7509,
    "lng": 94.2037,
    "elevation": 116,
    "terrain": "Plain / Tea Plateau",
    "score": 88,
    "status": "OPEN",
    "risk_level": "LOW",
    "phc_count": 31,
    "critical_stock_pct": 91,
    "rainfall_24h_mm": 22.0,
    "soil_moisture_pct": 58,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 99.0
  },
  {
    "id": "AS-TEZ",
    "name": "Sonitpur (Tezpur)",
    "state": "Assam",
    "state_id": "AS",
    "lat": 26.6528,
    "lng": 92.7926,
    "elevation": 48,
    "terrain": "Riverbank / Foothills",
    "score": 85,
    "status": "OPEN",
    "risk_level": "LOW",
    "phc_count": 29,
    "critical_stock_pct": 86,
    "rainfall_24h_mm": 28.0,
    "soil_moisture_pct": 61,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 98.9
  },
  {
    "id": "AS-BON",
    "name": "Bongaigaon",
    "state": "Assam",
    "state_id": "AS",
    "lat": 26.48,
    "lng": 90.56,
    "elevation": 54,
    "terrain": "Western Gateway Plain",
    "score": 90,
    "status": "OPEN",
    "risk_level": "LOW",
    "phc_count": 24,
    "critical_stock_pct": 90,
    "rainfall_24h_mm": 14.0,
    "soil_moisture_pct": 49,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 99.1
  },
  {
    "id": "AS-DHU",
    "name": "Dhubri",
    "state": "Assam",
    "state_id": "AS",
    "lat": 26.02,
    "lng": 89.97,
    "elevation": 34,
    "terrain": "River Island / Floodplain",
    "score": 68,
    "status": "RESTRICTED",
    "risk_level": "HIGH",
    "phc_count": 32,
    "critical_stock_pct": 69,
    "rainfall_24h_mm": 88.0,
    "soil_moisture_pct": 84,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 97.9
  },
  {
    "id": "AS-KAR",
    "name": "Karbi Anglong",
    "state": "Assam",
    "state_id": "AS",
    "lat": 25.84,
    "lng": 93.43,
    "elevation": 240,
    "terrain": "Hilly Ridge & Forest",
    "score": 72,
    "status": "DEGRADED",
    "risk_level": "HIGH",
    "phc_count": 38,
    "critical_stock_pct": 65,
    "rainfall_24h_mm": 94.0,
    "soil_moisture_pct": 82,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 98.1
  },
  {
    "id": "AS-NC",
    "name": "Dima Hasao (Haflong)",
    "state": "Assam",
    "state_id": "AS",
    "lat": 25.17,
    "lng": 93.02,
    "elevation": 680,
    "terrain": "Steep Hills / Landslide Prone",
    "score": 54,
    "status": "DEGRADED",
    "risk_level": "CRITICAL",
    "phc_count": 21,
    "critical_stock_pct": 58,
    "rainfall_24h_mm": 178.0,
    "soil_moisture_pct": 95,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 98.7
  },
  {
    "id": "AS-TIN",
    "name": "Tinsukia",
    "state": "Assam",
    "state_id": "AS",
    "lat": 27.5,
    "lng": 95.36,
    "elevation": 116,
    "terrain": "Upper Assam Floodplain",
    "score": 83,
    "status": "OPEN",
    "risk_level": "MODERATE",
    "phc_count": 28,
    "critical_stock_pct": 84,
    "rainfall_24h_mm": 54.0,
    "soil_moisture_pct": 71,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 98.6
  },
  {
    "id": "AR-ITA",
    "name": "Papum Pare (Itanagar)",
    "state": "Arunachal Pradesh",
    "state_id": "AR",
    "lat": 27.0844,
    "lng": 93.6053,
    "elevation": 320,
    "terrain": "Foothills & River Valleys",
    "score": 78,
    "status": "OPEN",
    "risk_level": "MODERATE",
    "phc_count": 26,
    "critical_stock_pct": 82,
    "rainfall_24h_mm": 68.0,
    "soil_moisture_pct": 76,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 98.5
  },
  {
    "id": "AR-TAW",
    "name": "Tawang",
    "state": "Arunachal Pradesh",
    "state_id": "AR",
    "lat": 27.5861,
    "lng": 91.8594,
    "elevation": 3048,
    "terrain": "High Altitude Alpine Pass",
    "score": 49,
    "status": "RESTRICTED",
    "risk_level": "CRITICAL",
    "phc_count": 16,
    "critical_stock_pct": 52,
    "rainfall_24h_mm": 142.0,
    "soil_moisture_pct": 94,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 99.1
  },
  {
    "id": "AR-BOM",
    "name": "West Kameng (Bomdila)",
    "state": "Arunachal Pradesh",
    "state_id": "AR",
    "lat": 27.2645,
    "lng": 92.4159,
    "elevation": 2217,
    "terrain": "Steep Mountain Pass",
    "score": 58,
    "status": "DEGRADED",
    "risk_level": "HIGH",
    "phc_count": 19,
    "critical_stock_pct": 61,
    "rainfall_24h_mm": 120.0,
    "soil_moisture_pct": 89,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 98.8
  },
  {
    "id": "AR-PAS",
    "name": "East Siang (Pasighat)",
    "state": "Arunachal Pradesh",
    "state_id": "AR",
    "lat": 28.0667,
    "lng": 95.3333,
    "elevation": 155,
    "terrain": "Siang River Valley",
    "score": 74,
    "status": "OPEN",
    "risk_level": "MODERATE",
    "phc_count": 18,
    "critical_stock_pct": 77,
    "rainfall_24h_mm": 74.0,
    "soil_moisture_pct": 78,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 98.7
  },
  {
    "id": "AR-ZIRO",
    "name": "Lower Subansiri (Ziro)",
    "state": "Arunachal Pradesh",
    "state_id": "AR",
    "lat": 27.545,
    "lng": 93.83,
    "elevation": 1572,
    "terrain": "High Plateau Valley",
    "score": 63,
    "status": "RESTRICTED",
    "risk_level": "HIGH",
    "phc_count": 16,
    "critical_stock_pct": 68,
    "rainfall_24h_mm": 98.0,
    "soil_moisture_pct": 85,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 98.3
  },
  {
    "id": "AR-TEZU",
    "name": "Lohit (Tezu)",
    "state": "Arunachal Pradesh",
    "state_id": "AR",
    "lat": 27.92,
    "lng": 96.16,
    "elevation": 185,
    "terrain": "Lohit River Basin & Forest",
    "score": 69,
    "status": "OPEN",
    "risk_level": "MODERATE",
    "phc_count": 17,
    "critical_stock_pct": 73,
    "rainfall_24h_mm": 82.0,
    "soil_moisture_pct": 80,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 98.6
  },
  {
    "id": "AR-CHAN",
    "name": "Changlang",
    "state": "Arunachal Pradesh",
    "state_id": "AR",
    "lat": 27.12,
    "lng": 95.73,
    "elevation": 580,
    "terrain": "Dense Mountain Jungle",
    "score": 55,
    "status": "DEGRADED",
    "risk_level": "HIGH",
    "phc_count": 22,
    "critical_stock_pct": 60,
    "rainfall_24h_mm": 110.0,
    "soil_moisture_pct": 88,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 98.2
  },
  {
    "id": "MN-IMP-W",
    "name": "Imphal West",
    "state": "Manipur",
    "state_id": "MN",
    "lat": 24.817,
    "lng": 93.9368,
    "elevation": 786,
    "terrain": "Central Manipur Valley",
    "score": 82,
    "status": "OPEN",
    "risk_level": "LOW",
    "phc_count": 30,
    "critical_stock_pct": 84,
    "rainfall_24h_mm": 35.0,
    "soil_moisture_pct": 62,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 99.0
  },
  {
    "id": "MN-IMP-E",
    "name": "Imphal East",
    "state": "Manipur",
    "state_id": "MN",
    "lat": 24.8,
    "lng": 94.0,
    "elevation": 790,
    "terrain": "Central Manipur Valley",
    "score": 80,
    "status": "OPEN",
    "risk_level": "LOW",
    "phc_count": 25,
    "critical_stock_pct": 81,
    "rainfall_24h_mm": 38.0,
    "soil_moisture_pct": 64,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 98.9
  },
  {
    "id": "MN-CHU",
    "name": "Churachandpur",
    "state": "Manipur",
    "state_id": "MN",
    "lat": 24.3333,
    "lng": 93.6667,
    "elevation": 914,
    "terrain": "Southern Hill Range",
    "score": 59,
    "status": "RESTRICTED",
    "risk_level": "HIGH",
    "phc_count": 24,
    "critical_stock_pct": 62,
    "rainfall_24h_mm": 92.0,
    "soil_moisture_pct": 86,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 98.4
  },
  {
    "id": "MN-SEN",
    "name": "Senapati",
    "state": "Manipur",
    "state_id": "MN",
    "lat": 25.26,
    "lng": 94.02,
    "elevation": 1120,
    "terrain": "Mountain Lifeline (NH-2)",
    "score": 62,
    "status": "DEGRADED",
    "risk_level": "HIGH",
    "phc_count": 20,
    "critical_stock_pct": 67,
    "rainfall_24h_mm": 105.0,
    "soil_moisture_pct": 88,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 98.6
  },
  {
    "id": "MN-UKH",
    "name": "Ukhrul",
    "state": "Manipur",
    "state_id": "MN",
    "lat": 25.1167,
    "lng": 94.3667,
    "elevation": 1662,
    "terrain": "High Eastern Ridge",
    "score": 51,
    "status": "DEGRADED",
    "risk_level": "CRITICAL",
    "phc_count": 18,
    "critical_stock_pct": 54,
    "rainfall_24h_mm": 134.0,
    "soil_moisture_pct": 92,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 98.3
  },
  {
    "id": "MN-TEN",
    "name": "Tengnoupal (Moreh)",
    "state": "Manipur",
    "state_id": "MN",
    "lat": 24.25,
    "lng": 94.3,
    "elevation": 850,
    "terrain": "Border Hills / Trade Route",
    "score": 66,
    "status": "RESTRICTED",
    "risk_level": "MODERATE",
    "phc_count": 16,
    "critical_stock_pct": 70,
    "rainfall_24h_mm": 72.0,
    "soil_moisture_pct": 77,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 98.5
  },
  {
    "id": "ML-EKH",
    "name": "East Khasi Hills (Shillong)",
    "state": "Meghalaya",
    "state_id": "ML",
    "lat": 25.5788,
    "lng": 91.8933,
    "elevation": 1496,
    "terrain": "Highland Plateau",
    "score": 85,
    "status": "OPEN",
    "risk_level": "LOW",
    "phc_count": 33,
    "critical_stock_pct": 89,
    "rainfall_24h_mm": 48.0,
    "soil_moisture_pct": 69,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 99.2
  },
  {
    "id": "ML-WKH",
    "name": "West Khasi Hills (Nongstoin)",
    "state": "Meghalaya",
    "state_id": "ML",
    "lat": 25.52,
    "lng": 91.27,
    "elevation": 1409,
    "terrain": "Rolling Hills & Gorges",
    "score": 64,
    "status": "RESTRICTED",
    "risk_level": "HIGH",
    "phc_count": 21,
    "critical_stock_pct": 66,
    "rainfall_24h_mm": 145.0,
    "soil_moisture_pct": 91,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 98.6
  },
  {
    "id": "ML-EJH",
    "name": "East Jaintia Hills (Khliehriat)",
    "state": "Meghalaya",
    "state_id": "ML",
    "lat": 25.35,
    "lng": 92.36,
    "elevation": 1250,
    "terrain": "High Rainfall Mining Belt (NH-6)",
    "score": 57,
    "status": "RESTRICTED",
    "risk_level": "CRITICAL",
    "phc_count": 18,
    "critical_stock_pct": 63,
    "rainfall_24h_mm": 210.0,
    "soil_moisture_pct": 96,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 99.3
  },
  {
    "id": "ML-WGH",
    "name": "West Garo Hills (Tura)",
    "state": "Meghalaya",
    "state_id": "ML",
    "lat": 25.5144,
    "lng": 90.2036,
    "elevation": 355,
    "terrain": "Garo Foothills & Valleys",
    "score": 73,
    "status": "OPEN",
    "risk_level": "MODERATE",
    "phc_count": 27,
    "critical_stock_pct": 78,
    "rainfall_24h_mm": 65.0,
    "soil_moisture_pct": 74,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 98.7
  },
  {
    "id": "ML-CHE",
    "name": "Sohra (Cherrapunji Sub-Div)",
    "state": "Meghalaya",
    "state_id": "ML",
    "lat": 25.27,
    "lng": 91.73,
    "elevation": 1430,
    "terrain": "Extreme Rainfall Escarpment",
    "score": 58,
    "status": "RESTRICTED",
    "risk_level": "CRITICAL",
    "phc_count": 14,
    "critical_stock_pct": 59,
    "rainfall_24h_mm": 340.0,
    "soil_moisture_pct": 98,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 99.5
  },
  {
    "id": "MZ-AIZ",
    "name": "Aizawl",
    "state": "Mizoram",
    "state_id": "MZ",
    "lat": 23.7271,
    "lng": 92.7176,
    "elevation": 1132,
    "terrain": "Steep Mountain Ridge",
    "score": 77,
    "status": "OPEN",
    "risk_level": "MODERATE",
    "phc_count": 31,
    "critical_stock_pct": 80,
    "rainfall_24h_mm": 52.0,
    "soil_moisture_pct": 72,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 98.9
  },
  {
    "id": "MZ-LUN",
    "name": "Lunglei",
    "state": "Mizoram",
    "state_id": "MZ",
    "lat": 22.8833,
    "lng": 92.7333,
    "elevation": 722,
    "terrain": "Isolated Mountain Gorges",
    "score": 56,
    "status": "DEGRADED",
    "risk_level": "HIGH",
    "phc_count": 22,
    "critical_stock_pct": 62,
    "rainfall_24h_mm": 118.0,
    "soil_moisture_pct": 89,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 98.5
  },
  {
    "id": "MZ-CHA",
    "name": "Champhai",
    "state": "Mizoram",
    "state_id": "MZ",
    "lat": 23.475,
    "lng": 93.328,
    "elevation": 1678,
    "terrain": "Eastern Border Plateau",
    "score": 60,
    "status": "RESTRICTED",
    "risk_level": "HIGH",
    "phc_count": 18,
    "critical_stock_pct": 65,
    "rainfall_24h_mm": 86.0,
    "soil_moisture_pct": 82,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 98.4
  },
  {
    "id": "MZ-KOL",
    "name": "Kolasib",
    "state": "Mizoram",
    "state_id": "MZ",
    "lat": 24.2247,
    "lng": 92.6775,
    "elevation": 610,
    "terrain": "Gateway Ridge (NH-306)",
    "score": 79,
    "status": "OPEN",
    "risk_level": "LOW",
    "phc_count": 17,
    "critical_stock_pct": 83,
    "rainfall_24h_mm": 45.0,
    "soil_moisture_pct": 68,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 98.8
  },
  {
    "id": "NL-KOH",
    "name": "Kohima",
    "state": "Nagaland",
    "state_id": "NL",
    "lat": 25.6701,
    "lng": 94.1077,
    "elevation": 1444,
    "terrain": "Rugged Ridge Terrain",
    "score": 76,
    "status": "OPEN",
    "risk_level": "MODERATE",
    "phc_count": 25,
    "critical_stock_pct": 79,
    "rainfall_24h_mm": 62.0,
    "soil_moisture_pct": 75,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 99.0
  },
  {
    "id": "NL-DIM",
    "name": "Dimapur",
    "state": "Nagaland",
    "state_id": "NL",
    "lat": 25.9068,
    "lng": 93.7273,
    "elevation": 145,
    "terrain": "Gateway Plain / Railhead",
    "score": 91,
    "status": "OPEN",
    "risk_level": "LOW",
    "phc_count": 28,
    "critical_stock_pct": 93,
    "rainfall_24h_mm": 24.0,
    "soil_moisture_pct": 55,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 99.3
  },
  {
    "id": "NL-MOK",
    "name": "Mokokchung",
    "state": "Nagaland",
    "state_id": "NL",
    "lat": 26.3249,
    "lng": 94.5152,
    "elevation": 1325,
    "terrain": "Hill Ridge & Valleys",
    "score": 65,
    "status": "RESTRICTED",
    "risk_level": "HIGH",
    "phc_count": 20,
    "critical_stock_pct": 70,
    "rainfall_24h_mm": 88.0,
    "soil_moisture_pct": 84,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 98.4
  },
  {
    "id": "NL-MON",
    "name": "Mon",
    "state": "Nagaland",
    "state_id": "NL",
    "lat": 26.745,
    "lng": 95.06,
    "elevation": 898,
    "terrain": "Remote Eastern Border Slopes",
    "score": 48,
    "status": "CLOSED",
    "risk_level": "CRITICAL",
    "phc_count": 22,
    "critical_stock_pct": 49,
    "rainfall_24h_mm": 165.0,
    "soil_moisture_pct": 96,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 98.7
  },
  {
    "id": "NL-TUE",
    "name": "Tuensang",
    "state": "Nagaland",
    "state_id": "NL",
    "lat": 26.28,
    "lng": 94.83,
    "elevation": 1371,
    "terrain": "Steep Mountain Valleys",
    "score": 52,
    "status": "DEGRADED",
    "risk_level": "CRITICAL",
    "phc_count": 23,
    "critical_stock_pct": 53,
    "rainfall_24h_mm": 140.0,
    "soil_moisture_pct": 93,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 98.5
  },
  {
    "id": "SK-GAN",
    "name": "Gangtok (East Sikkim)",
    "state": "Sikkim",
    "state_id": "SK",
    "lat": 27.3389,
    "lng": 88.6065,
    "elevation": 1650,
    "terrain": "Himalayan Ridge / NH-10",
    "score": 73,
    "status": "RESTRICTED",
    "risk_level": "HIGH",
    "phc_count": 20,
    "critical_stock_pct": 76,
    "rainfall_24h_mm": 128.0,
    "soil_moisture_pct": 91,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 99.1
  },
  {
    "id": "SK-NAM",
    "name": "Namchi (South Sikkim)",
    "state": "Sikkim",
    "state_id": "SK",
    "lat": 27.1667,
    "lng": 88.35,
    "elevation": 1315,
    "terrain": "Mid-Himalayan Slopes",
    "score": 78,
    "status": "OPEN",
    "risk_level": "MODERATE",
    "phc_count": 17,
    "critical_stock_pct": 82,
    "rainfall_24h_mm": 72.0,
    "soil_moisture_pct": 78,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 98.7
  },
  {
    "id": "SK-MANG",
    "name": "Mangan (North Sikkim)",
    "state": "Sikkim",
    "state_id": "SK",
    "lat": 27.5,
    "lng": 88.53,
    "elevation": 2000,
    "terrain": "Fragile Alpine Gorges / Teesta",
    "score": 38,
    "status": "CLOSED",
    "risk_level": "CRITICAL",
    "phc_count": 13,
    "critical_stock_pct": 41,
    "rainfall_24h_mm": 245.0,
    "soil_moisture_pct": 99,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 99.6
  },
  {
    "id": "SK-GYA",
    "name": "Gyalshing (West Sikkim)",
    "state": "Sikkim",
    "state_id": "SK",
    "lat": 27.28,
    "lng": 88.23,
    "elevation": 1800,
    "terrain": "Steep Alpine Ridges",
    "score": 67,
    "status": "RESTRICTED",
    "risk_level": "MODERATE",
    "phc_count": 16,
    "critical_stock_pct": 71,
    "rainfall_24h_mm": 89.0,
    "soil_moisture_pct": 83,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 98.6
  },
  {
    "id": "TR-AGA",
    "name": "West Tripura (Agartala)",
    "state": "Tripura",
    "state_id": "TR",
    "lat": 23.8315,
    "lng": 91.2868,
    "elevation": 15,
    "terrain": "Alluvial River Plain",
    "score": 92,
    "status": "OPEN",
    "risk_level": "LOW",
    "phc_count": 31,
    "critical_stock_pct": 91,
    "rainfall_24h_mm": 22.0,
    "soil_moisture_pct": 54,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 99.2
  },
  {
    "id": "TR-GOM",
    "name": "Gomati (Udaipur)",
    "state": "Tripura",
    "state_id": "TR",
    "lat": 23.5333,
    "lng": 91.4833,
    "elevation": 22,
    "terrain": "Undulating Plains & Rivers",
    "score": 88,
    "status": "OPEN",
    "risk_level": "LOW",
    "phc_count": 20,
    "critical_stock_pct": 87,
    "rainfall_24h_mm": 31.0,
    "soil_moisture_pct": 59,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 98.9
  },
  {
    "id": "TR-DHA",
    "name": "North Tripura (Dharmanagar)",
    "state": "Tripura",
    "state_id": "TR",
    "lat": 24.38,
    "lng": 92.17,
    "elevation": 32,
    "terrain": "Gateway Corridor (NH-8)",
    "score": 84,
    "status": "OPEN",
    "risk_level": "LOW",
    "phc_count": 19,
    "critical_stock_pct": 86,
    "rainfall_24h_mm": 40.0,
    "soil_moisture_pct": 65,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 98.8
  },
  {
    "id": "TR-DHAL",
    "name": "Dhalai (Ambassa)",
    "state": "Tripura",
    "state_id": "TR",
    "lat": 23.92,
    "lng": 91.85,
    "elevation": 60,
    "terrain": "Hilly Ridges & Valleys",
    "score": 75,
    "status": "OPEN",
    "risk_level": "MODERATE",
    "phc_count": 23,
    "critical_stock_pct": 79,
    "rainfall_24h_mm": 60.0,
    "soil_moisture_pct": 73,
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 98.6
  }
];

export const FALLBACK_CORRIDORS: RoadSegment[] = [
  {
    "id": "SEG-01",
    "name": "Siliguri to Guwahati (NH-27 East-West Gateway)",
    "from_district": "Siliguri Gateway",
    "to_district": "AS-KAM",
    "distance_km": 470,
    "avg_speed_kmh": 62,
    "status": "OPEN",
    "hazard_type": "None / Low Flood Watch",
    "risk_score": 18,
    "bridges_on_route": [
      "BR-01 (Saraighat)",
      "BR-07 (Manas River Setu)"
    ],
    "clearance_height_m": 4.8,
    "weight_limit_tons": 45,
    "coordinates": [
      [
        26.7271,
        88.3953
      ],
      [
        26.48,
        90.56
      ],
      [
        26.1445,
        91.7362
      ]
    ],
    "source": "SRC-BRO-VARTAK",
    "observed_at": "2026-08-26T18:30:00+05:30",
    "confidence": 99.4,
    "verification_status": "VERIFIED"
  },
  {
    "id": "SEG-02",
    "name": "Guwahati to Shillong (NH-6 Highland Expressway)",
    "from_district": "AS-KAM",
    "to_district": "ML-EKH",
    "distance_km": 100,
    "avg_speed_kmh": 50,
    "status": "OPEN",
    "hazard_type": "Dense Fog / Occasional Slips at Byrnihat",
    "risk_score": 25,
    "bridges_on_route": [
      "BR-14 (Umiam Lake Causeway)"
    ],
    "clearance_height_m": 4.5,
    "weight_limit_tons": 35,
    "coordinates": [
      [
        26.1445,
        91.7362
      ],
      [
        25.75,
        91.85
      ],
      [
        25.5788,
        91.8933
      ]
    ],
    "source": "SRC-STATE-PWD",
    "observed_at": "2026-08-26T18:30:00+05:30",
    "confidence": 99.0,
    "verification_status": "VERIFIED"
  },
  {
    "id": "SEG-03",
    "name": "Shillong to Silchar (NH-6 East Jaintia Hills / Sonapur Sector)",
    "from_district": "ML-EKH",
    "to_district": "AS-SIL",
    "distance_km": 215,
    "avg_speed_kmh": 28,
    "status": "RESTRICTED",
    "hazard_type": "Sonapur Tunnel Mudflow & Silt Ingress",
    "risk_score": 68,
    "bridges_on_route": [
      "BR-04 (Lubha River Suspension)"
    ],
    "clearance_height_m": 4.2,
    "weight_limit_tons": 25,
    "coordinates": [
      [
        25.5788,
        91.8933
      ],
      [
        25.35,
        92.36
      ],
      [
        25.105,
        92.388
      ],
      [
        24.8333,
        92.7789
      ]
    ],
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:30:00+05:30",
    "confidence": 98.6,
    "verification_status": "OBSERVED"
  },
  {
    "id": "SEG-04",
    "name": "Guwahati to Tezpur to Itanagar (NH-15 / NH-415)",
    "from_district": "AS-KAM",
    "to_district": "AR-ITA",
    "distance_km": 320,
    "avg_speed_kmh": 55,
    "status": "OPEN",
    "hazard_type": "Foothill Flash Flood Watch",
    "risk_score": 32,
    "bridges_on_route": [
      "BR-08 (Kolia Bhomora Setu)",
      "BR-09 (Dikrong River Setu)"
    ],
    "clearance_height_m": 4.5,
    "weight_limit_tons": 40,
    "coordinates": [
      [
        26.1445,
        91.7362
      ],
      [
        26.6528,
        92.7926
      ],
      [
        27.0844,
        93.6053
      ]
    ],
    "source": "SRC-STATE-PWD",
    "observed_at": "2026-08-26T18:30:00+05:30",
    "confidence": 99.1,
    "verification_status": "VERIFIED"
  },
  {
    "id": "SEG-05",
    "name": "Tezpur to Bhalukpong to Bomdila to Tawang (NH-13 B-T-O Sector)",
    "from_district": "AS-TEZ",
    "to_district": "AR-TAW",
    "distance_km": 340,
    "avg_speed_kmh": 22,
    "status": "DEGRADED",
    "hazard_type": "Sela Pass Slips & Rockfall Warning km 184",
    "risk_score": 79,
    "bridges_on_route": [
      "BR-10 (Tenga River Bailey)",
      "BR-11 (Sela Tunnel Portal Bridge)"
    ],
    "clearance_height_m": 3.8,
    "weight_limit_tons": 18,
    "coordinates": [
      [
        26.6528,
        92.7926
      ],
      [
        27.01,
        92.56
      ],
      [
        27.2645,
        92.4159
      ],
      [
        27.5861,
        91.8594
      ]
    ],
    "source": "SRC-BRO-VARTAK",
    "observed_at": "2026-08-26T18:30:00+05:30",
    "confidence": 98.8,
    "verification_status": "VERIFIED"
  },
  {
    "id": "SEG-06",
    "name": "Guwahati to Jorhat to Dibrugarh (NH-715 / NH-37)",
    "from_district": "AS-KAM",
    "to_district": "AS-DIB",
    "distance_km": 440,
    "avg_speed_kmh": 56,
    "status": "OPEN",
    "hazard_type": "Kaziranga Wildlife Corridor Speed Restrictions (40km/h)",
    "risk_score": 28,
    "bridges_on_route": [
      "BR-12 (Dhansiri River Setu)",
      "BR-02 (Bogibeel Combined Bridge)"
    ],
    "clearance_height_m": 4.8,
    "weight_limit_tons": 40,
    "coordinates": [
      [
        26.1445,
        91.7362
      ],
      [
        26.58,
        93.17
      ],
      [
        26.7509,
        94.2037
      ],
      [
        27.4728,
        94.912
      ]
    ],
    "source": "SRC-STATE-PWD",
    "observed_at": "2026-08-26T18:30:00+05:30",
    "confidence": 99.3,
    "verification_status": "VERIFIED"
  },
  {
    "id": "SEG-07",
    "name": "Dibrugarh to Pasighat (via Bogibeel Bridge / NH-515)",
    "from_district": "AS-DIB",
    "to_district": "AR-PAS",
    "distance_km": 150,
    "avg_speed_kmh": 50,
    "status": "OPEN",
    "hazard_type": "Siang River Flood Watch",
    "risk_score": 30,
    "bridges_on_route": [
      "BR-02 (Bogibeel Combined Rail-Road Bridge)"
    ],
    "clearance_height_m": 5.0,
    "weight_limit_tons": 50,
    "coordinates": [
      [
        27.4728,
        94.912
      ],
      [
        27.8,
        95.1
      ],
      [
        28.0667,
        95.3333
      ]
    ],
    "source": "SRC-CWC-GAUGES",
    "observed_at": "2026-08-26T18:30:00+05:30",
    "confidence": 98.9,
    "verification_status": "VERIFIED"
  },
  {
    "id": "SEG-08",
    "name": "Dimapur to Kohima to Imphal (NH-2 / NH-29 Lifeline)",
    "from_district": "NL-DIM",
    "to_district": "MN-IMP-W",
    "distance_km": 205,
    "avg_speed_kmh": 32,
    "status": "RESTRICTED",
    "hazard_type": "Pagla Pahar Subsidence & Sinking Zone",
    "risk_score": 64,
    "bridges_on_route": [
      "BR-15 (Zubza River Bridge)",
      "BR-13 (Barak River Bridge Senapati)"
    ],
    "clearance_height_m": 4.2,
    "weight_limit_tons": 25,
    "coordinates": [
      [
        25.9068,
        93.7273
      ],
      [
        25.6701,
        94.1077
      ],
      [
        25.26,
        94.02
      ],
      [
        24.817,
        93.9368
      ]
    ],
    "source": "SRC-BRO-VARTAK",
    "observed_at": "2026-08-26T18:30:00+05:30",
    "confidence": 98.7,
    "verification_status": "VERIFIED"
  },
  {
    "id": "SEG-09",
    "name": "Silchar to Jiribam to Imphal (NH-37 Western Access)",
    "from_district": "AS-SIL",
    "to_district": "MN-IMP-W",
    "distance_km": 220,
    "avg_speed_kmh": 26,
    "status": "DEGRADED",
    "hazard_type": "Makru & Irang River Valley Slopes",
    "risk_score": 75,
    "bridges_on_route": [
      "BR-05 (Irang Bailey Bridge)",
      "BR-16 (Makru RCC Bridge)"
    ],
    "clearance_height_m": 4.0,
    "weight_limit_tons": 20,
    "coordinates": [
      [
        24.8333,
        92.7789
      ],
      [
        24.8,
        93.12
      ],
      [
        24.81,
        93.52
      ],
      [
        24.817,
        93.9368
      ]
    ],
    "source": "SRC-STATE-PWD",
    "observed_at": "2026-08-26T18:30:00+05:30",
    "confidence": 98.4,
    "verification_status": "OBSERVED"
  },
  {
    "id": "SEG-10",
    "name": "Silchar to Kolasib to Aizawl (NH-306 Mizoram Spine)",
    "from_district": "AS-SIL",
    "to_district": "MZ-AIZ",
    "distance_km": 170,
    "avg_speed_kmh": 30,
    "status": "OPEN",
    "hazard_type": "Vairengte Hill Slips (Monitored)",
    "risk_score": 42,
    "bridges_on_route": [
      "BR-17 (Dhaleswari River Bridge)"
    ],
    "clearance_height_m": 4.2,
    "weight_limit_tons": 22,
    "coordinates": [
      [
        24.8333,
        92.7789
      ],
      [
        24.2247,
        92.6775
      ],
      [
        23.7271,
        92.7176
      ]
    ],
    "source": "SRC-STATE-PWD",
    "observed_at": "2026-08-26T18:30:00+05:30",
    "confidence": 98.8,
    "verification_status": "VERIFIED"
  },
  {
    "id": "SEG-11",
    "name": "Aizawl to Lunglei (NH-54 South Spine)",
    "from_district": "MZ-AIZ",
    "to_district": "MZ-LUN",
    "distance_km": 165,
    "avg_speed_kmh": 24,
    "status": "DEGRADED",
    "hazard_type": "Hmuifang Ridge Mudslides",
    "risk_score": 72,
    "bridges_on_route": [
      "BR-18 (Mat River Bridge)"
    ],
    "clearance_height_m": 3.8,
    "weight_limit_tons": 16,
    "coordinates": [
      [
        23.7271,
        92.7176
      ],
      [
        23.25,
        92.75
      ],
      [
        22.8833,
        92.7333
      ]
    ],
    "source": "SRC-IMD-AWS",
    "observed_at": "2026-08-26T18:30:00+05:30",
    "confidence": 98.5,
    "verification_status": "OBSERVED"
  },
  {
    "id": "SEG-12",
    "name": "Siliguri to Gangtok (NH-10 Teesta Valley Lifeline)",
    "from_district": "Siliguri Gateway",
    "to_district": "SK-GAN",
    "distance_km": 115,
    "avg_speed_kmh": 28,
    "status": "RESTRICTED",
    "hazard_type": "Teesta River Scour & 29th Mile Sinking Zone",
    "risk_score": 82,
    "bridges_on_route": [
      "BR-06 (Coronation Bridge Sevoke)",
      "BR-19 (Singtam Suspension Bridge)"
    ],
    "clearance_height_m": 4.0,
    "weight_limit_tons": 20,
    "coordinates": [
      [
        26.7271,
        88.3953
      ],
      [
        26.8839,
        88.472
      ],
      [
        27.15,
        88.52
      ],
      [
        27.3389,
        88.6065
      ]
    ],
    "source": "SRC-BRO-VARTAK",
    "observed_at": "2026-08-26T18:30:00+05:30",
    "confidence": 99.2,
    "verification_status": "VERIFIED"
  },
  {
    "id": "SEG-13",
    "name": "Gangtok to Mangan to Chungthang (North Sikkim Highway)",
    "from_district": "SK-GAN",
    "to_district": "SK-MANG",
    "distance_km": 68,
    "avg_speed_kmh": 18,
    "status": "CLOSED",
    "hazard_type": "Glacial Outflow Washout & Roadbed Sinking at Dikchu",
    "risk_score": 96,
    "bridges_on_route": [
      "BR-20 (Dikchu Bridge Damaged)",
      "BR-21 (Sankalang Bailey Temporary)"
    ],
    "clearance_height_m": 3.5,
    "weight_limit_tons": 10,
    "coordinates": [
      [
        27.3389,
        88.6065
      ],
      [
        27.42,
        88.58
      ],
      [
        27.5,
        88.53
      ]
    ],
    "source": "SRC-NDMA-CAP",
    "observed_at": "2026-08-26T18:30:00+05:30",
    "confidence": 99.7,
    "verification_status": "VERIFIED"
  },
  {
    "id": "SEG-14",
    "name": "Silchar to Dharmanagar to Agartala (NH-8 Tripura Lifeline)",
    "from_district": "AS-SIL",
    "to_district": "TR-AGA",
    "distance_km": 250,
    "avg_speed_kmh": 48,
    "status": "OPEN",
    "hazard_type": "Low Flood Watch in Manu River Valley",
    "risk_score": 29,
    "bridges_on_route": [
      "BR-22 (Manu River Setu)",
      "BR-23 (Howrah River Bridge)"
    ],
    "clearance_height_m": 4.5,
    "weight_limit_tons": 35,
    "coordinates": [
      [
        24.8333,
        92.7789
      ],
      [
        24.38,
        92.17
      ],
      [
        23.92,
        91.85
      ],
      [
        23.8315,
        91.2868
      ]
    ],
    "source": "SRC-STATE-PWD",
    "observed_at": "2026-08-26T18:30:00+05:30",
    "confidence": 99.0,
    "verification_status": "VERIFIED"
  },
  {
    "id": "SEG-15",
    "name": "Mokokchung to Tuensang to Mon (Nagaland Interior Highway)",
    "from_district": "NL-MOK",
    "to_district": "NL-MON",
    "distance_km": 140,
    "avg_speed_kmh": 20,
    "status": "CLOSED",
    "hazard_type": "Active Debris Avalanche km 42",
    "risk_score": 91,
    "bridges_on_route": [
      "BR-24 (Dikhu River Bailey Bridge)"
    ],
    "clearance_height_m": 3.6,
    "weight_limit_tons": 12,
    "coordinates": [
      [
        26.3249,
        94.5152
      ],
      [
        26.28,
        94.83
      ],
      [
        26.745,
        95.06
      ]
    ],
    "source": "SRC-BRO-VARTAK",
    "observed_at": "2026-08-26T18:30:00+05:30",
    "confidence": 98.9,
    "verification_status": "VERIFIED"
  },
  {
    "id": "SEG-16",
    "name": "Guwahati to Haflong (via Lumding-Haflong Ridge)",
    "from_district": "AS-KAM",
    "to_district": "AS-NC",
    "distance_km": 290,
    "avg_speed_kmh": 36,
    "status": "DEGRADED",
    "hazard_type": "Lumding-Haflong Hill Section Slip Risk",
    "risk_score": 70,
    "bridges_on_route": [
      "BR-25 (Diyung River Bridge)"
    ],
    "clearance_height_m": 4.0,
    "weight_limit_tons": 22,
    "coordinates": [
      [
        26.1445,
        91.7362
      ],
      [
        25.75,
        93.15
      ],
      [
        25.17,
        93.02
      ]
    ],
    "source": "SRC-STATE-PWD",
    "observed_at": "2026-08-26T18:30:00+05:30",
    "confidence": 98.4,
    "verification_status": "OBSERVED"
  },
  {
    "id": "SEG-17",
    "name": "Imphal to Moreh (NH-102 Asian Highway 1)",
    "from_district": "MN-IMP-W",
    "to_district": "MN-TEN",
    "distance_km": 110,
    "avg_speed_kmh": 42,
    "status": "RESTRICTED",
    "hazard_type": "Pallel Escarpment Landslide Vulnerability",
    "risk_score": 58,
    "bridges_on_route": [
      "BR-26 (Lokchao Bridge)"
    ],
    "clearance_height_m": 4.5,
    "weight_limit_tons": 30,
    "coordinates": [
      [
        24.817,
        93.9368
      ],
      [
        24.52,
        94.02
      ],
      [
        24.25,
        94.3
      ]
    ],
    "source": "SRC-STATE-PWD",
    "observed_at": "2026-08-26T18:30:00+05:30",
    "confidence": 98.7,
    "verification_status": "VERIFIED"
  },
  {
    "id": "SEG-18",
    "name": "Tinsukia to Tezu (via Dhola-Sadiya Bridge / NH-115)",
    "from_district": "AS-TIN",
    "to_district": "AR-TEZU",
    "distance_km": 95,
    "avg_speed_kmh": 58,
    "status": "OPEN",
    "hazard_type": "None / Lohit River Scour Monitor",
    "risk_score": 22,
    "bridges_on_route": [
      "BR-03 (Dhola-Sadiya Bhupen Hazarika Setu)"
    ],
    "clearance_height_m": 5.0,
    "weight_limit_tons": 60,
    "coordinates": [
      [
        27.5,
        95.36
      ],
      [
        27.7972,
        95.6631
      ],
      [
        27.92,
        96.16
      ]
    ],
    "source": "SRC-CWC-GAUGES",
    "observed_at": "2026-08-26T18:30:00+05:30",
    "confidence": 99.3,
    "verification_status": "VERIFIED"
  }
];

export const FALLBACK_BRIDGES: Bridge[] = [
  {
    "id": "BR-01",
    "name": "Saraighat Double-Deck Rail-Road Bridge",
    "location": "Guwahati (Kamrup), Assam",
    "river": "Brahmaputra",
    "lat": 26.1772,
    "lng": 91.6811,
    "structural_health_pct": 94,
    "strain_microstrain": 142,
    "vibration_hz": 2.4,
    "water_clearance_m": 6.8,
    "flood_danger_level_m": 49.68,
    "current_water_level_m": 44.1,
    "cctv_status": "ONLINE (Cam 1-4 Normal)",
    "status": "HEALTHY",
    "load_capacity_tons": 45,
    "source": "SRC-CWC-GAUGES",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "sensor_last_ping": "2026-08-28T21:15:00+05:30",
    "sensor_status": "LIVE",
    "scour_depth_m": 2.94
  },
  {
    "id": "BR-02",
    "name": "Bogibeel Combined Bridge",
    "location": "Dibrugarh - Dhemaji, Assam",
    "river": "Brahmaputra",
    "lat": 27.398,
    "lng": 94.764,
    "structural_health_pct": 98,
    "strain_microstrain": 98,
    "vibration_hz": 1.8,
    "water_clearance_m": 8.2,
    "flood_danger_level_m": 105.7,
    "current_water_level_m": 99.4,
    "cctv_status": "ONLINE (Cam 1-8 Normal)",
    "status": "HEALTHY",
    "load_capacity_tons": 60,
    "source": "SRC-CWC-GAUGES",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "sensor_last_ping": "2026-08-28T21:15:00+05:30",
    "sensor_status": "LIVE",
    "scour_depth_m": 5.67
  },
  {
    "id": "BR-03",
    "name": "Dhola-Sadiya Bridge (Bhupen Hazarika Setu)",
    "location": "Tinsukia - Sadiya, Assam/Arunachal Border",
    "river": "Lohit",
    "lat": 27.7972,
    "lng": 95.6631,
    "structural_health_pct": 91,
    "strain_microstrain": 165,
    "vibration_hz": 2.1,
    "water_clearance_m": 5.4,
    "flood_danger_level_m": 132.0,
    "current_water_level_m": 128.3,
    "cctv_status": "ONLINE (Cam 1-6 Normal)",
    "status": "HEALTHY",
    "load_capacity_tons": 60,
    "source": "SRC-CWC-GAUGES",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "sensor_last_ping": "2026-08-28T21:15:00+05:30",
    "sensor_status": "LIVE",
    "scour_depth_m": 7.13
  },
  {
    "id": "BR-04",
    "name": "Lubha River Suspension Bridge",
    "location": "East Jaintia Hills, Meghalaya (NH-6)",
    "river": "Lubha",
    "lat": 25.105,
    "lng": 92.388,
    "structural_health_pct": 68,
    "strain_microstrain": 410,
    "vibration_hz": 4.9,
    "water_clearance_m": 3.1,
    "flood_danger_level_m": 38.0,
    "current_water_level_m": 35.8,
    "cctv_status": "CAUTION: Heavy truck overload sensor triggered",
    "status": "RESTRICTED (Single-lane convoy only)",
    "load_capacity_tons": 25,
    "source": "SRC-STATE-PWD",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "VERIFIED",
    "sensor_last_ping": "2026-08-28T21:15:00+05:30",
    "sensor_status": "WARNING",
    "scour_depth_m": 2.54
  },
  {
    "id": "BR-05",
    "name": "Irang Bailey Bridge",
    "location": "Noney - Tamenglong, Manipur (NH-37)",
    "river": "Irang",
    "lat": 24.81,
    "lng": 93.52,
    "structural_health_pct": 62,
    "strain_microstrain": 480,
    "vibration_hz": 5.6,
    "water_clearance_m": 2.4,
    "flood_danger_level_m": 310.0,
    "current_water_level_m": 308.2,
    "cctv_status": "ONLINE (Pier 2 scour alert)",
    "status": "DEGRADED (Speed limit 10 km/h)",
    "load_capacity_tons": 18,
    "source": "SRC-BRO-VARTAK",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "sensor_last_ping": "2026-08-28T21:15:00+05:30",
    "sensor_status": "WARNING",
    "scour_depth_m": 16.18
  },
  {
    "id": "BR-06",
    "name": "Coronation Bridge (Sevoke)",
    "location": "Darjeeling / Sikkim Gateway (NH-10)",
    "river": "Teesta",
    "lat": 26.8839,
    "lng": 88.472,
    "structural_health_pct": 54,
    "strain_microstrain": 590,
    "vibration_hz": 6.8,
    "water_clearance_m": 1.9,
    "flood_danger_level_m": 140.0,
    "current_water_level_m": 139.1,
    "cctv_status": "WARNING: High turbulence impact at abutment",
    "status": "CRITICAL (Light vehicles only)",
    "load_capacity_tons": 12,
    "source": "SRC-BRO-VARTAK",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "VERIFIED",
    "sensor_last_ping": "2026-08-28T21:15:00+05:30",
    "sensor_status": "CRITICAL_ALERT",
    "scour_depth_m": 7.71
  },
  {
    "id": "BR-07",
    "name": "Manas River Setu",
    "location": "Barpeta - Bongaigaon, Assam (NH-27)",
    "river": "Manas",
    "lat": 26.42,
    "lng": 90.95,
    "structural_health_pct": 92,
    "strain_microstrain": 135,
    "vibration_hz": 2.2,
    "water_clearance_m": 5.8,
    "flood_danger_level_m": 45.0,
    "current_water_level_m": 41.2,
    "cctv_status": "ONLINE (Normal)",
    "status": "HEALTHY",
    "load_capacity_tons": 45,
    "source": "SRC-CWC-GAUGES",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "sensor_last_ping": "2026-08-28T21:15:00+05:30",
    "sensor_status": "LIVE",
    "scour_depth_m": 2.76
  },
  {
    "id": "BR-08",
    "name": "Kolia Bhomora Setu",
    "location": "Tezpur - Nagaon, Assam (NH-715)",
    "river": "Brahmaputra",
    "lat": 26.602,
    "lng": 92.855,
    "structural_health_pct": 95,
    "strain_microstrain": 110,
    "vibration_hz": 1.9,
    "water_clearance_m": 7.1,
    "flood_danger_level_m": 68.0,
    "current_water_level_m": 63.4,
    "cctv_status": "ONLINE (Normal)",
    "status": "HEALTHY",
    "load_capacity_tons": 50,
    "source": "SRC-CWC-GAUGES",
    "observed_at": "2026-08-26T18:45:00+05:30",
    "verification_status": "OBSERVED",
    "sensor_last_ping": "2026-08-28T21:15:00+05:30",
    "sensor_status": "LIVE",
    "scour_depth_m": 3.84
  }
];

export const FALLBACK_DEPOTS: SupplyDepot[] = [
  {
    "id": "DEP-01",
    "name": "Guwahati Central Strategic Logistics Hub",
    "location": "Amingaon / Changsari, Assam",
    "lat": 26.24,
    "lng": 91.67,
    "type": "Primary Multi-Modal Apex Hub",
    "capacity_metric_tons": 45000,
    "current_stock_tons": 39200,
    "critical_vaccine_units": 150000,
    "pds_grain_tons": 24000,
    "fuel_reserve_kl": 8000,
    "waterway_berth": "Pandu Port (NW-2 Brahmaputra)",
    "servicing_states": [
      "Assam",
      "Meghalaya",
      "Arunachal Pradesh",
      "Nagaland",
      "Manipur",
      "Mizoram",
      "Tripura",
      "Sikkim"
    ],
    "source": "SRC-STATE-PWD",
    "verification_status": "VERIFIED"
  },
  {
    "id": "DEP-02",
    "name": "Dimapur Railhead Forward Depot",
    "location": "Dimapur, Nagaland",
    "lat": 25.91,
    "lng": 93.73,
    "type": "Rail-to-Road Transshipment Hub",
    "capacity_metric_tons": 18000,
    "current_stock_tons": 14500,
    "critical_vaccine_units": 45000,
    "pds_grain_tons": 9800,
    "fuel_reserve_kl": 3200,
    "waterway_berth": "None",
    "servicing_states": [
      "Nagaland",
      "Manipur"
    ],
    "source": "SRC-STATE-PWD",
    "verification_status": "VERIFIED"
  },
  {
    "id": "DEP-03",
    "name": "Silchar Barak Valley Logistics Node",
    "location": "Cachar, Assam",
    "lat": 24.84,
    "lng": 92.79,
    "type": "Southern NER Gateway Depot",
    "capacity_metric_tons": 22000,
    "current_stock_tons": 17800,
    "critical_vaccine_units": 60000,
    "pds_grain_tons": 11200,
    "fuel_reserve_kl": 4100,
    "waterway_berth": "Silchar Barak River Jetty (NW-16)",
    "servicing_states": [
      "Assam (Barak)",
      "Mizoram",
      "Tripura",
      "Manipur (West)"
    ],
    "source": "SRC-STATE-PWD",
    "verification_status": "VERIFIED"
  },
  {
    "id": "DEP-04",
    "name": "Tawang High-Altitude Forward Stockpile",
    "location": "Tawang, Arunachal Pradesh",
    "lat": 27.59,
    "lng": 91.87,
    "type": "Extreme Weather Forward Buffer",
    "capacity_metric_tons": 5000,
    "current_stock_tons": 2600,
    "critical_vaccine_units": 12000,
    "pds_grain_tons": 3200,
    "fuel_reserve_kl": 950,
    "waterway_berth": "None",
    "servicing_states": [
      "Arunachal Pradesh (West Kameng, Tawang)"
    ],
    "source": "SRC-BRO-VARTAK",
    "verification_status": "VERIFIED"
  },
  {
    "id": "DEP-05",
    "name": "Imphal Central Medical & Food Depot",
    "location": "Imphal West, Manipur",
    "lat": 24.81,
    "lng": 93.94,
    "type": "Valley Strategic Reserve",
    "capacity_metric_tons": 12000,
    "current_stock_tons": 8400,
    "critical_vaccine_units": 35000,
    "pds_grain_tons": 5800,
    "fuel_reserve_kl": 2100,
    "waterway_berth": "None",
    "servicing_states": [
      "Manipur"
    ],
    "source": "SRC-STATE-PWD",
    "verification_status": "VERIFIED"
  },
  {
    "id": "DEP-06",
    "name": "Agartala Food & Essential Supplies Depot",
    "location": "West Tripura",
    "lat": 23.84,
    "lng": 91.29,
    "type": "Statewide Buffer Depot",
    "capacity_metric_tons": 16000,
    "current_stock_tons": 13900,
    "critical_vaccine_units": 50000,
    "pds_grain_tons": 8900,
    "fuel_reserve_kl": 2800,
    "waterway_berth": "None",
    "servicing_states": [
      "Tripura"
    ],
    "source": "SRC-STATE-PWD",
    "verification_status": "VERIFIED"
  },
  {
    "id": "DEP-07",
    "name": "Gangtok High Himalayan Buffer Depot",
    "location": "Ranipool, East Sikkim",
    "lat": 27.29,
    "lng": 88.58,
    "type": "Alpine Emergency Forward Buffer",
    "capacity_metric_tons": 6500,
    "current_stock_tons": 4100,
    "critical_vaccine_units": 18000,
    "pds_grain_tons": 3900,
    "fuel_reserve_kl": 1200,
    "waterway_berth": "None",
    "servicing_states": [
      "Sikkim"
    ],
    "source": "SRC-BRO-VARTAK",
    "verification_status": "VERIFIED"
  },
  {
    "id": "DEP-08",
    "name": "Shillong Highland Cold-Chain Reserve",
    "location": "Mawlai, East Khasi Hills",
    "lat": 25.59,
    "lng": 91.87,
    "type": "State Emergency Medical Depot",
    "capacity_metric_tons": 8000,
    "current_stock_tons": 6800,
    "critical_vaccine_units": 75000,
    "pds_grain_tons": 4200,
    "fuel_reserve_kl": 1600,
    "waterway_berth": "None",
    "servicing_states": [
      "Meghalaya"
    ],
    "source": "SRC-STATE-PWD",
    "verification_status": "VERIFIED"
  }
];

export const FALLBACK_VEHICLES: Vehicle[] = [
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
      "door_locked": true,
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
      "anomaly_flag": false
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
    "cold_chain": null,
    "fuel_monitor": {
      "tank_level_pct": 58,
      "consumption_rate_lph": 16.8,
      "anomaly_flag": false
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
    "cold_chain": null,
    "fuel_monitor": {
      "tank_level_pct": 65,
      "consumption_rate_lph": 14.5,
      "anomaly_flag": false
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
    "cold_chain": null,
    "fuel_monitor": {
      "tank_level_pct": 82,
      "consumption_rate_lph": 24.0,
      "anomaly_flag": false
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
      "door_locked": true,
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
      "anomaly_flag": false
    },
    "eta_destination": "Tomorrow, 07:30 IST",
    "status": "IN_TRANSIT",
    "source": "SRC-FIELD-PWA",
    "observed_at": "2026-08-28T21:15:00+05:30",
    "verification_status": "OBSERVED",
    "confidence": 99.6
  }
];

export const FALLBACK_ALERTS: Alert[] = [
  {
    "id": "ALT-2026-0891",
    "tier": "T4 - CRITICAL",
    "tier_level": 4,
    "title": "Coronation Bridge / NH-10 Teesta Corridor Blockade",
    "corridor_id": "SEG-12",
    "affected_districts": [
      "SK-GAN (Gangtok)",
      "SK-MANG (Mangan)"
    ],
    "trigger_condition": "Live river gauge + acoustic sensor trigger at 29th Mile",
    "timestamp": "2026-08-26T08:15:00+05:30",
    "acknowledged": true,
    "acknowledged_by": "District Magistrate Gangtok (Dr. T. Bhutia)",
    "escalation_sla_mins": 20,
    "dispatched_channels": [
      "SMS",
      "WhatsApp",
      "App Push",
      "IVR Voice",
      "NDMA CAP Feed"
    ],
    "target_recipients_count": 482,
    "dispatch_status": "DISPATCHED",
    "message_i18n": {
      "en": "CRITICAL (T4): NH-10 Teesta Valley corridor closed due to debris surge at km 29. Mandatory diversion active.",
      "hi": "\u0917\u0902\u092d\u0940\u0930 (T4): 29 \u0915\u093f\u092e\u0940 \u092a\u0930 \u092e\u0932\u092c\u093e \u0906\u0928\u0947 \u0915\u0947 \u0915\u093e\u0930\u0923 NH-10 \u0924\u0940\u0938\u094d\u0924\u093e \u0918\u093e\u091f\u0940 \u092e\u093e\u0930\u094d\u0917 \u092c\u0902\u0926\u0964 \u0905\u0928\u093f\u0935\u093e\u0930\u094d\u092f \u0921\u093e\u092f\u0935\u0930\u094d\u091c\u0928 \u0938\u0915\u094d\u0930\u093f\u092f\u0964",
      "as": "\u099c\u09f0\u09c1\u09f0\u09c0 (T4): \u0995\u09bf\u09ae\u09bf \u09e8\u09ef\u09a4 \u09a7\u09cd\u09ac\u0982\u09b8\u09be\u09f1\u09b6\u09c7\u09b7 \u09ac\u09c3\u09a6\u09cd\u09a7\u09bf\u09f0 \u09ac\u09be\u09ac\u09c7 NH-10 \u09a4\u09bf\u09b8\u09cd\u09a4\u09be \u0989\u09aa\u09a4\u09cd\u09af\u0995\u09be \u0995\u09f0\u09bf\u09a1'\u09f0 \u09ac\u09a8\u09cd\u09a7\u0964 \u09ac\u09be\u09a7\u09cd\u09af\u09a4\u09be\u09ae\u09c2\u09b2\u0995 \u09ac\u09bf\u0995\u09b2\u09cd\u09aa \u09aa\u09a5 \u09b8\u0995\u09cd\u09f0\u09bf\u09af\u09bc\u0964",
      "bn": "\u099c\u09b0\u09c1\u09b0\u09bf (T4): \u0995\u09bf\u09ae\u09bf \u09e8\u09ef-\u098f \u09a7\u09cd\u09ac\u0982\u09b8\u09b8\u09cd\u09a4\u09c2\u09aa \u09ac\u09c3\u09a6\u09cd\u09a7\u09bf\u09b0 \u0995\u09be\u09b0\u09a3\u09c7 NH-10 \u09a4\u09bf\u09b8\u09cd\u09a4\u09be \u09ad\u09cd\u09af\u09be\u09b2\u09bf \u0995\u09b0\u09bf\u09a1\u09cb\u09b0 \u09ac\u09a8\u09cd\u09a7\u0964 \u09ac\u09be\u09a7\u09cd\u09af\u09a4\u09be\u09ae\u09c2\u09b2\u0995 \u09ac\u09bf\u0995\u09b2\u09cd\u09aa \u09aa\u09a5 \u09b8\u0995\u09cd\u09b0\u09bf\u09af\u09bc\u0964",
      "mni": "\uabc0\uabed\uabd4\uabe4\uabc7\uabe4\uabc0\uabe6\uabdc (T4): NH-10 \uabc7\uabe4\uabc1\uabed\uabc7\uabe5 \uabda\uabe6\uabc2\uabe4 \uabc2\uabdd\uabd5\uabe4 \uabc0\uabe4:\uabc3\uabe4: \uabf2\uabf9\uabd7 \uabc2\uabe9 \uabc7\uabe8\uabc8\uabe4\uabd5\uabc5 \uabc3\uabd4\uabdd \uabd1\uabe3\uabcf\uabd7\uabe8\uabc5 \uabca\uabe4\uabe1\uabd6\uabe4\uabdf\uabc8\uabed\uabd4\uabe6\uabeb",
      "khasi": "JINGEH BA KHRAW (T4): Ka surok NH-10 Teesta Valley la khang namar ka jingshlei ha km 29.",
      "mizo": "HLUAHLO (T4): NH-10 Teesta Valley kawng chu km 29-ah leimin avangin khar a ni. Kawng dang zawh tur.",
      "nagamese": "BISI DANGER (T4): NH-10 rasta Teesta Valley bondho korishey landslide karoney. Dosra rasta jabi.",
      "ne": "\u0905\u0924\u093f \u0917\u092e\u094d\u092d\u0940\u0930 (T4): \u0968\u096f \u0915\u093f\u0932\u094b\u092e\u093f\u091f\u0930\u092e\u093e \u092a\u0939\u093f\u0930\u094b \u0916\u0938\u0947\u0915\u093e \u0915\u093e\u0930\u0923 NH-10 \u091f\u093f\u0938\u094d\u091f\u093e \u0909\u092a\u0924\u094d\u092f\u0915\u093e \u0938\u0921\u0915 \u092c\u0928\u094d\u0926\u0964 \u0905\u0928\u093f\u0935\u093e\u0930\u094d\u092f \u0921\u093e\u0907\u092d\u0930\u094d\u0938\u0928\u0964"
    },
    "source": "SRC-NDMA-CAP",
    "verification_status": "VERIFIED"
  },
  {
    "id": "ALT-2026-0892",
    "tier": "T3 - WARNING",
    "tier_level": 3,
    "title": "NH-13 Sela Pass Incipient Landslide Advisory",
    "corridor_id": "SEG-05",
    "affected_districts": [
      "AR-TAW (Tawang)",
      "AR-BOM (Bomdila)"
    ],
    "trigger_condition": "72h Rainfall forecast exceeded 220mm; Soil moisture 94%",
    "timestamp": "2026-08-26T09:30:00+05:30",
    "acknowledged": false,
    "acknowledged_by": "Pending DC Tawang Acknowledgement (9 mins remaining)",
    "escalation_sla_mins": 20,
    "dispatched_channels": [
      "SMS",
      "WhatsApp",
      "App Push"
    ],
    "target_recipients_count": 215,
    "dispatch_status": "DISPATCHED",
    "message_i18n": {
      "en": "WARNING (T3): Landslide risk elevated on NH-13 (Bomdila-Tawang). Heavy vehicles rerouted via Balipara.",
      "hi": "\u091a\u0947\u0924\u093e\u0935\u0928\u0940 (T3): NH-13 (\u092c\u094b\u092e\u0921\u093f\u0932\u093e-\u0924\u0935\u093e\u0902\u0917) \u092a\u0930 \u092d\u0942\u0938\u094d\u0916\u0932\u0928 \u0915\u093e \u0916\u0924\u0930\u093e \u092c\u0922\u093c\u093e\u0964 \u092d\u093e\u0930\u0940 \u0935\u093e\u0939\u0928\u094b\u0902 \u0915\u094b \u092c\u093e\u0932\u0940\u092a\u093e\u0930\u093e \u0938\u0947 \u0921\u093e\u092f\u0935\u0930\u094d\u091f \u0915\u093f\u092f\u093e \u0917\u092f\u093e\u0964",
      "as": "\u09b8\u09a4\u09b0\u09cd\u0995\u09ac\u09be\u09a3\u09c0 (T3): NH-13 (\u09ac\u09ae\u09a1\u09bf\u09b2\u09be-\u099f\u09be\u09f1\u09be\u0982)\u09a4 \u09ad\u09c2\u09ae\u09bf\u09b8\u09cd\u0996\u09b2\u09a8\u09f0 \u0986\u09b6\u0982\u0995\u09be \u09ac\u09c3\u09a6\u09cd\u09a7\u09bf \u09aa\u09be\u0987\u099b\u09c7\u0964 \u0997\u09a7\u09c1\u09f0 \u09af\u09be\u09a8-\u09ac\u09be\u09b9\u09a8 \u09ac\u09be\u09b2\u09bf\u09aa\u09be\u09f0\u09be \u09b9\u09c8 \u09a1\u09be\u0987\u09ad\u09be\u09f0\u09cd\u099f \u0995\u09f0\u09be \u09b9\u09c8\u099b\u09c7\u0964",
      "bn": "\u09b8\u09a4\u09b0\u09cd\u0995\u09ac\u09be\u09b0\u09cd\u09a4\u09be (T3): NH-13 (\u09ac\u09cb\u09ae\u09a1\u09bf\u09b2\u09be-\u09a4\u09be\u0993\u09af\u09bc\u09be\u0982) \u098f \u09ad\u09c2\u09ae\u09bf\u09a7\u09b8\u09c7\u09b0 \u099d\u09c1\u0981\u0995\u09bf \u09ac\u09c7\u09a1\u09bc\u09c7\u099b\u09c7\u0964 \u09ad\u09be\u09b0\u09c0 \u09af\u09be\u09a8\u09ac\u09be\u09b9\u09a8 \u09ac\u09be\u09b2\u09bf\u09aa\u09be\u09a1\u09bc\u09be \u09a6\u09bf\u09af\u09bc\u09c7 \u0998\u09c1\u09b0\u09bf\u09af\u09bc\u09c7 \u09a6\u09c7\u0993\u09af\u09bc\u09be \u09b9\u09af\u09bc\u09c7\u099b\u09c7\u0964",
      "mni": "\uabc6\uabe6\uabc0\uabc1\uabe4\uabdf\uabcb\uabe5 (T3): NH-13 (\uabd5\uabe3\uabc3\uabd7\uabe4\uabc2\uabe5-\uabc7\uabcb\uabe5\uabe1)\uabd7 \uabc2\uabe9\uabc3\uabe5\uabe1\uabd5\uabd2\uabe4 \uabd1\uabc0\uabe4\uabd5 \uabcd\uabe6\uabdf\uabd2\uabe0\uabc2\uabe6\uabeb \uabd1\uabd4\uabe8\uabdd\uabd5 \uabd2\uabe5\uabd4\uabe4\uabc1\uabe4\uabe1 \uabd5\uabe5\uabc2\uabe4\uabc4\uabe5\uabd4\uabe5 \uabc2\uabdd\uabd5\uabe4\uabd7 \uabcd\uabe3\uabe1\uabd7\uabe3\uabdb\uabc8\uabed\uabd4\uabe6\uabeb",
      "khasi": "MAHAM (T3): Ka jingeh landslide ha NH-13 (Bomdila-Tawang). Ki kali heh la phah lyngba ka Balipara.",
      "mizo": "VAU KHANNA (T3): NH-13 (Bomdila-Tawang) ah leimin hlauhawm a sang. Motor lian chu Balipara lamah thawn kual an ni.",
      "nagamese": "HOOSHIYAR (T3): NH-13 rasta (Bomdila-Tawang) te landslide laga dukh asey. Bisi dangar gaari khan Balipara rasta luvikena jabole koishey.",
      "ne": "\u091a\u0947\u0924\u093e\u0935\u0928\u0940 (T3): NH-13 (\u092c\u094b\u092e\u0921\u093f\u0932\u093e-\u0924\u0935\u093e\u0919) \u092e\u093e \u092a\u0939\u093f\u0930\u094b\u0915\u094b \u091c\u094b\u0916\u093f\u092e \u092c\u0922\u0947\u0915\u094b \u091b\u0964 \u092d\u093e\u0930\u0940 \u0938\u0935\u093e\u0930\u0940 \u0938\u093e\u0927\u0928\u0939\u0930\u0942 \u092c\u093e\u0932\u0940\u092a\u093e\u0930\u093e \u0939\u0941\u0901\u0926\u0948 \u0921\u093e\u0907\u092d\u0930\u094d\u091f \u0917\u0930\u093f\u090f\u0915\u094b \u091b\u0964"
    },
    "source": "SRC-IMD-AWS",
    "verification_status": "OBSERVED"
  },
  {
    "id": "ALT-2026-0893",
    "tier": "T2 - ADVISORY",
    "tier_level": 2,
    "title": "Sonapur Tunnel Waterlogging & Slow Moving Traffic",
    "corridor_id": "SEG-03",
    "affected_districts": [
      "ML-EKH (East Khasi Hills)",
      "AS-SIL (Silchar)"
    ],
    "trigger_condition": "Continuous monsoon runoff in East Jaintia Hills",
    "timestamp": "2026-08-26T10:00:00+05:30",
    "acknowledged": true,
    "acknowledged_by": "SP Traffic Jowai",
    "escalation_sla_mins": 60,
    "dispatched_channels": [
      "SMS",
      "App Push"
    ],
    "target_recipients_count": 640,
    "dispatch_status": "DISPATCHED",
    "message_i18n": {
      "en": "ADVISORY (T2): NH-6 Sonapur tunnel experiencing 1.5-hour delay due to mud silt. Single lane open.",
      "hi": "\u0938\u0932\u093e\u0939 (T2): \u0915\u0940\u091a\u0921\u093c \u091c\u092e\u093e \u0939\u094b\u0928\u0947 \u0915\u0947 \u0915\u093e\u0930\u0923 NH-6 \u0938\u094b\u0928\u093e\u092a\u0941\u0930 \u0938\u0941\u0930\u0902\u0917 \u092e\u0947\u0902 1.5 \u0918\u0902\u091f\u0947 \u0915\u0940 \u0926\u0947\u0930\u0940\u0964 \u090f\u0915 \u0932\u0947\u0928 \u091a\u093e\u0932\u0942\u0964"
    },
    "source": "SRC-STATE-PWD",
    "verification_status": "VERIFIED"
  }
];

export const FALLBACK_FIELD_REPORTS: FieldReport[] = [
  {
    "id": "REP-2026-0412",
    "client_event_id": "CLIENT-SYNC-9901-AS",
    "reporter_name": "Ranjan Hazarika",
    "reporter_role": "PWD Junior Engineer (Kamrup)",
    "state": "Assam",
    "district": "AS-KAM (Kamrup)",
    "location_name": "NH-27 Changsari Culvert Km 14",
    "lat": 26.241,
    "lng": 91.682,
    "timestamp": "2026-08-26T07:45:00+05:30",
    "incident_type": "Roadbed Erosion / Pavement Subsidence",
    "damage_dimensions": {
      "crack_length_m": 4.5,
      "pothole_depth_cm": 24,
      "debris_volume_cum": 8
    },
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
    "lat": 25.281,
    "lng": 91.735,
    "timestamp": "2026-08-26T08:30:00+05:30",
    "incident_type": "Debris / Rockfall Deposit",
    "damage_dimensions": {
      "crack_length_m": 12.0,
      "pothole_depth_cm": 0,
      "debris_volume_cum": 45
    },
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
];

export const FALLBACK_ADVISORIES = [
  {
    "id": "PRE-POS-01",
    "target_district": "AR-TAW (Tawang, Arunachal Pradesh)",
    "source_depot": "DEP-01 (Guwahati Central Logistics Hub)",
    "reason": "Sela Pass sector (NH-13) predicted 79% landslide probability within next 48h (Soil Moisture: 94%).",
    "recommended_transfer": {
      "critical_vaccines_units": 4000,
      "blood_units": 150,
      "food_grains_quintals": 1200,
      "diesel_reserve_kl": 250
    },
    "recommended_convoy_window": "Departure by 05:00 AM Tomorrow (Convoy of 6 Light 4WD Trucks)",
    "urgency": "CRITICAL" as const,
    "days_of_autonomy_gained": 18,
    "provenance": {
      "source": "SRC-IMD-AWS + NERALIS-DisruptionNet-GBDT-v3.4",
      "observed_at": new Date().toISOString(),
      "confidence": 98.4
    }
  },
  {
    "id": "PRE-POS-02",
    "target_district": "SK-MANG (Mangan, North Sikkim)",
    "source_depot": "DEP-07 (Gangtok / Ranipool Reserve)",
    "reason": "Teesta basin hydro-gauge exceeding danger level; NH-10 / Dikchu segment closed (96% Risk).",
    "recommended_transfer": {
      "critical_vaccines_units": 2500,
      "blood_units": 80,
      "food_grains_quintals": 850,
      "water_purification_tablets_packs": 5000
    },
    "recommended_convoy_window": "Immediate Helicopter Air-Bridge via Bagdogra/Gangtok Heliport",
    "urgency": "EMERGENCY" as const,
    "days_of_autonomy_gained": 14,
    "provenance": {
      "source": "SRC-CWC-GAUGES + NERALIS-DisruptionNet-GBDT-v3.4",
      "observed_at": new Date().toISOString(),
      "confidence": 99.6
    }
  },
  {
    "id": "PRE-POS-03",
    "target_district": "AS-NC (Dima Hasao - Haflong, Assam)",
    "source_depot": "DEP-03 (Silchar Barak Valley Node)",
    "reason": "Barak-Haflong hill track mudflow risk elevated to 75% following 178mm rainfall.",
    "recommended_transfer": {
      "critical_vaccines_units": 3000,
      "blood_units": 100,
      "food_grains_quintals": 900,
      "water_purification_tablets_packs": 400
    },
    "recommended_convoy_window": "Dispatch via Lumding-Haflong Ridge Road within 12 Hours",
    "urgency": "HIGH" as const,
    "days_of_autonomy_gained": 21,
    "provenance": {
      "source": "SRC-IMD-AWS + NERALIS-DisruptionNet-GBDT-v3.4",
      "observed_at": new Date().toISOString(),
      "confidence": 98.7
    }
  }
];

export const FALLBACK_DIGITAL_TWIN_SCENARIOS: Record<string, any> = {
  "BRIDGE_COLLAPSE_BR-04": {
    "scenario": "Simulated Catastrophic Structural Failure: Kolia Bhomora / Lubha River Bridge",
    "affected_river_crossing": "Brahmaputra / Lubha River Crossing (NH-6)",
    "immediate_impact": {
      "cut_off_districts": ["AS-SIL (Silchar)", "MZ-AIZ (Aizawl)", "TR-AGA (Agartala)", "ML-EJH (East Jaintia)"],
      "isolated_population": "4.2 Million Citizens",
      "daily_freight_disrupted_tons": 3800,
      "delay_increase_hrs": 34.5
    },
    "recommended_mitigation": [
      "Activate National Waterway 2 (NW-2) Ro-Ro barge service from Pandu/Dhubri to Silchar/Karimganj.",
      "Divert light essential medical traffic via Badarpur-Jowai old hill bypass with 15T axle load limit.",
      "Mobilize Border Roads Organisation (BRO) 70R Bailey bridge emergency engineering crew (ETA 48h)."
    ],
    "ndma_severity_rating": "LEVEL 4 STATE DISASTER ALERT",
    "simulation_engine": "NERALIS Multi-Layer GIS Digital Twin v2.1"
  },
  "BRIDGE_COLLAPSE_DEFAULT": {
    "scenario": "Simulated Catastrophic Structural Failure: Lubha River Bridge (NH-6)",
    "affected_river_crossing": "Lubha River Gorge (NH-6 Lifeline)",
    "immediate_impact": {
      "cut_off_districts": ["AS-SIL (Silchar)", "MZ-AIZ (Aizawl)", "TR-AGA (Agartala)"],
      "isolated_population": "3.8 Million Citizens",
      "daily_freight_disrupted_tons": 3400,
      "delay_increase_hrs": 32.0
    },
    "recommended_mitigation": [
      "Activate National Waterway 2 (NW-2) Ro-Ro barge service from Pandu to Silchar.",
      "Divert light essential traffic via Badarpur-Jowai old hill bypass (15T axle limit).",
      "Deploy BRO Project Pushpak Bailey Bridge emergency unit from Silchar Base (ETA 36h)."
    ],
    "ndma_severity_rating": "LEVEL 4 STATE DISASTER ALERT",
    "simulation_engine": "NERALIS Multi-Layer GIS Digital Twin v2.1"
  },
  "HIGHWAY_BLOCKADE_SEG-05": {
    "scenario": "Simulated Total Highway Blockade: NH-13 Bomdila-Sela Pass-Tawang",
    "cause": "Massive Rock Avalanche & Roadbed Slip (>8,000 cu.m debris)",
    "immediate_impact": {
      "cut_off_districts": ["AR-TAW (Tawang District)", "AR-WKA (West Kameng Interior)", "Jang Sub-Division"],
      "stranded_vehicles_estimate": 165,
      "critical_medicine_stock_depletion_days": 4.5,
      "daily_freight_disrupted_tons": 1200,
      "delay_increase_hrs": 42.0,
      "isolated_population": "120,000 Citizens & Border Posts"
    },
    "recommended_mitigation": [
      "Deploy BRO Project Vartak heavy snow-cutters and rock-breakers from Bomdila Base.",
      "Establish Emergency Helicopter Air-Bridge via Tezpur/Guwahati Heliport for neonatal vaccines and insulin.",
      "Enforce commercial freight hold at Bhalukpong Gate and activate Sela Tunnel secondary bypass."
    ],
    "ndma_severity_rating": "LEVEL 3 REGIONAL HIGHWAY BLOCKADE",
    "simulation_engine": "NERALIS Multi-Layer GIS Digital Twin v2.1"
  },
  "HIGHWAY_BLOCKADE_DEFAULT": {
    "scenario": "Simulated Total Highway Blockade: Sela Pass Sector (NH-13)",
    "cause": "Massive Rockslide / Roadbed Slip (>5,000 cu.m debris)",
    "immediate_impact": {
      "cut_off_districts": ["AR-TAW (Tawang)", "AR-WKA (West Kameng)"],
      "stranded_vehicles_estimate": 140,
      "critical_medicine_stock_depletion_days": 4.5,
      "daily_freight_disrupted_tons": 1100,
      "delay_increase_hrs": 38.0,
      "isolated_population": "95,000 Citizens"
    },
    "recommended_mitigation": [
      "Deploy BRO Project Vartak heavy excavators from Bomdila Base.",
      "Establish Emergency Helicopter Air-Bridge for critical medical supplies.",
      "Enforce commercial freight hold at Bhalukpong Gate."
    ],
    "ndma_severity_rating": "LEVEL 3 REGIONAL HIGHWAY BLOCKADE",
    "simulation_engine": "NERALIS Multi-Layer GIS Digital Twin v2.1"
  }
};

