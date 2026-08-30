"""
Official Source Registry (P0 Trust & Provenance Architecture) for NERALIS.
"""

from typing import Dict, List, Any

NER_SOURCE_REGISTRY: List[Dict[str, Any]] = [
    {
        "id": "SRC-IMD-AWS",
        "name": "India Meteorological Department (IMD)",
        "department": "Ministry of Earth Sciences, Govt. of India",
        "service": "Automated Weather Stations (AWS) & 72h Rainfall Forecast API",
        "update_frequency": "Every 15 minutes",
        "status": "ONLINE",
        "trust_score": 99.4,
        "endpoint_pattern": "https://api.imd.gov.in/public/v2/weather/ner/{district_code}",
        "data_types": ["Rainfall (mm)", "Soil Moisture (%)", "Cloudburst Alerts", "Warning Bulletins"]
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
        "data_types": ["Slope Gradient", "Terrain Ruggedness (TRI)", "Landslide Susceptibility Atlas"]
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
        "data_types": ["River Water Level (m)", "Danger Level Margin", "Bridge Pier Scour Velocity"]
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
        "data_types": ["Pass Blockades", "Avalanche / Landslide Clearances", "Weight / Dimension Restrictions"]
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
        "data_types": ["Multi-Tier Disaster Alerts", "Evacuation Orders", "Red / Orange Weather Warnings"]
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
        "data_types": ["Potholes / Culvert Failures", "Pavement Subsidence", "Single-Lane Convoy Advisories"]
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
        "data_types": ["Damage Photos", "Visual Crack / Debris Dimensions", "On-Scene GPS Telemetry"]
    }
]
