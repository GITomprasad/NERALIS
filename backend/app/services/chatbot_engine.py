"""
NERALIS AI Assistant Chatbot Engine (NERALIS AI Sahayak).
Provides comprehensive domain intelligence, module walkthroughs, live state queries,
and interactive action commands for the NERALIS Logistics Command Center.
"""

from typing import Dict, Any, List, Optional
import re
from datetime import datetime

from app.data.ner_geography import (
    NER_STATES,
    NER_DISTRICTS,
    NER_ROAD_SEGMENTS,
    NER_BRIDGES,
    NER_DEPOTS,
    NER_SOURCE_REGISTRY
)
from app.services.routing_engine import routing_engine
from app.services.disruption_forecasting import disruption_engine
from app.services.fleet_telemetry import fleet_telemetry_engine
from app.services.alert_dispatcher import alert_dispatcher
from app.services.field_reporting import field_reporting_engine
from app.services.report_generator import report_generator


class ChatbotEngine:
    def __init__(self):
        self.system_overview = {
            "name": "NERALIS (North Eastern Region Accessibility & Logistics Intelligence System)",
            "authority": "Ministry of Development of North Eastern Region (MDoNER), Govt. of India",
            "coverage": "8 North Eastern States (Assam, Arunachal Pradesh, Meghalaya, Manipur, Mizoram, Nagaland, Sikkim, Tripura) with 89 monitored districts",
            "mission": "AI-assisted, GIS-enabled smart logistics command center ensuring continuous supply chain resilience, proactive hazard forecasting, and multimodal routing across complex terrain.",
            "operational_loop": "Observe → Understand → Predict → Optimize → Act → Verify → Learn"
        }

        self.modules_info = {
            "ACCESSIBILITY": {
                "code": "01",
                "name": "Accessibility Monitoring (Regional GIS Grid)",
                "description": "Real-time GIS map interface displaying 89 districts, arterial national highways (NH-27, NH-102, NH-29, NH-208, NH-10), vital river bridges (Saraighat, Bogibeel, Bhupen Hazarika Setu), and health facility (PHC) accessibility.",
                "features": ["Road status classification (OPEN, RESTRICTED, DEGRADED, CLOSED)", "Live bridge health & pier scour sensors", "District vulnerability scoring", "Terrain elevation & slope heatmaps"],
                "action_target": "ACCESSIBILITY"
            },
            "ROUTE": {
                "code": "02",
                "name": "AI Route Optimizer & Alternatives",
                "description": "Multi-objective routing engine that evaluates distance, travel time, active landslide/flood hazards, bridge load limits, and National Waterway 2 (NW-2 Brahmaputra River) Ro-Ro barge intermodal alternatives.",
                "features": ["Weather-Safe Optimal Route", "Resilient Ridge Highway alternative", "Inland Waterway (NW-2) Ro-Ro combined transit", "Vehicle weight & height clearance validation", "Safe departure time window recommendations"],
                "action_target": "ROUTE"
            },
            "FLEET": {
                "code": "03",
                "name": "Fleet Telemetry & NavIC Tracking",
                "description": "Live GPS and ISRO NavIC satellite telemetry tracking for government, commercial, and emergency supply convoys.",
                "features": ["NavIC + 4G/2G hybrid satellite telemetry", "Cold-chain IoT temperature compliance monitoring (2°C - 8°C)", "Driver fatigue & mandatory hill rest compliance", "GSTN e-Way bill tracking", "Historical trip playback breadcrumbs"],
                "action_target": "FLEET"
            },
            "PREDICTION": {
                "code": "04",
                "name": "Predictive Disruption Intelligence (6-72 Hours)",
                "description": "Calibrated Gradient Boosted Ensemble ML model (98.4% balanced accuracy, 0.991 ROC-AUC) predicting transportation disruptions up to 72 hours in advance.",
                "features": ["6h, 24h, 48h, 72h corridor disruption probability forecasts", "Explainable AI feature importance (IMD rainfall, Bhuvan DEM slopes, CWC river levels)", "Relief supply pre-positioning advisories", "Digital Twin hazard simulation (bridge collapse & highway blockades)"],
                "action_target": "PREDICTION"
            },
            "ALERT": {
                "code": "05",
                "name": "Multilingual Emergency Alert Center",
                "description": "Command alert broadcasting engine supporting 3-tier severity classification and official NDMA CAP (Common Alerting Protocol) XML generation.",
                "features": ["Multi-channel dispatch (SMS, USSD, WhatsApp, Radio)", "NDMA CAP v1.2 XML feed export", "Automated 06:00 IST Morning Operational Briefing", "Operator verification & acknowledgement audit trails"],
                "action_target": "ALERT"
            },
            "FIELD_APP": {
                "code": "06",
                "name": "Field Reporting PWA & Gamification",
                "description": "Progressive Web App for ground scouts and PWD engineers with offline queueing, YOLOv8 damage classification, and AR LiDAR measurement.",
                "features": ["Offline-first IndexedDB queue with automatic server sync", "YOLOv8 automated road defect & crack detection", "AR LiDAR pothole & debris volume estimation", "Scout gamification leaderboard with reputation badges"],
                "action_target": "FIELD_APP"
            },
            "ANALYTICS": {
                "code": "07",
                "name": "Command & Governance Analytics Dashboard",
                "description": "Executive intelligence dashboard aggregating regional corridor uptime, state-wise supply chain throughput, and district accessibility indices.",
                "features": ["Corridor availability percentage", "Fleet telematics connectivity metrics", "District vulnerability radar", "Intermodal freight carbon and cost savings"],
                "action_target": "ANALYTICS"
            },
            "OFFLINE_RESILIENCE": {
                "code": "08",
                "name": "Offline-First Resilience & Multilingual Sync",
                "description": "Zero-connectivity architecture designed for remote Himalayan and jungle corridors.",
                "features": ["IndexedDB local persistence cache", "2G low-bandwidth payload compression", "USSD *123# interactive feature phone simulator", "Native support for 8 NER languages + Hindi + English"],
                "action_target": "OFFLINE_RESILIENCE"
            }
        }

    def process_query(self, query: str, language: str = "en") -> Dict[str, Any]:
        """
        Processes a user query and returns structured answer, matched topic,
        suggested follow-ups, and interactive platform actions.
        """
        q = query.strip().lower()
        
        # 1. Greetings & Meta Queries
        if any(w in q for w in ["hello", "hi", "hey", "namaste", "who are you", "what is your name", "help", "sahayak"]):
            return {
                "text": (
                    "**Namaste! I am the NERALIS AI Sahayak (Operations Assistant).**\n\n"
                    "I provide comprehensive guidance on all aspects of the **NERALIS Smart Logistics & Accessibility Intelligence Platform** for the North Eastern Region of India.\n\n"
                    "**Here is what you can ask me:**\n"
                    "• 🗺️ **Platform Modules:** Ask about any of our 8 core modules (Routing, GIS Map, Predictions, Fleet, Alerts, Field Reporting, Analytics, Offline Sync).\n"
                    "• 🛣️ **Live Status:** Inquire about specific districts (e.g. *Kamrup*, *East Khasi Hills*), highways (*NH-27*, *NH-10*), or bridges (*Saraighat*, *Bogibeel*).\n"
                    "• 🧠 **AI & ML Models:** Learn how our 72-hour disruption forecasting or multi-objective routing algorithms work.\n"
                    "• 🚨 **Emergency Alerts:** Check current active disaster bulletins or CAP XML exports.\n"
                    "• 📡 **Offline Operations:** Discover how our zero-data USSD `*123#` and IndexedDB sync operate."
                ),
                "topic": "GREETING",
                "suggestions": [
                    "What is NERALIS?",
                    "Explain the 8 Platform Modules",
                    "How does AI Route Optimization work?",
                    "Check active emergency alerts",
                    "How does offline mode work?"
                ],
                "actions": [
                    {"label": "Explore GIS Map", "action": "NAVIGATE", "target": "ACCESSIBILITY"},
                    {"label": "Open Route Optimizer", "action": "NAVIGATE", "target": "ROUTE"}
                ]
            }

        # 2. General Overview / What is NERALIS
        if any(w in q for w in ["what is neralis", "about neralis", "overview", "mission", "purpose", "why neralis"]):
            return {
                "text": (
                    f"### 🛰️ About {self.system_overview['name']}\n\n"
                    f"**Authority:** {self.system_overview['authority']}\n"
                    f"**Coverage:** {self.system_overview['coverage']}\n\n"
                    f"**Core Philosophy:**\n"
                    "> *See the problem → Understand the risk → Predict disruption → Optimize the route → Act → Verify → Learn*\n\n"
                    "**Key Capabilities:**\n"
                    "1. **Unified Regional GIS Grid:** Centralized monitoring of 89 NER districts and critical arterial corridors.\n"
                    "2. **72-Hour Disruption Intelligence:** Machine-learning forecasts trained on IMD rainfall, Bhuvan DEM slopes, and CWC hydrological telemetry (98.4% accuracy).\n"
                    "3. **Multi-Objective Routing:** Vehicle-aware, hazard-penalized pathfinding with Brahmaputra NW-2 Ro-Ro barge intermodal alternatives.\n"
                    "4. **NavIC Telemetry & Cold-Chain:** Real-time satellite tracking with temperature compliance for vital medicines and rations.\n"
                    "5. **High-Trust Architecture:** Complete data provenance tracing back to official government feeds (IMD, ISRO Bhuvan, CWC, BRO)."
                ),
                "topic": "OVERVIEW",
                "suggestions": [
                    "Explain the 8 Platform Modules",
                    "What data sources are integrated?",
                    "How does predictive intelligence work?",
                    "View Parliamentary Status Report"
                ],
                "actions": [
                    {"label": "View GIS Command Center", "action": "NAVIGATE", "target": "ACCESSIBILITY"},
                    {"label": "View Analytics Dashboard", "action": "NAVIGATE", "target": "ANALYTICS"}
                ]
            }

        # 2. Entity Specific Queries (Districts, Corridors, Bridges, Vehicles) - Prioritized
        # 2a. Specific Bridge Check
        for b in NER_BRIDGES:
            b_name_lower = b["name"].lower()
            b_parts = [p.replace('(', '').replace(')', '').replace(',', '') for p in b_name_lower.split() if len(p) >= 4]
            if b_name_lower in q or b["id"].lower() in q or (b.get("river") and b["river"].lower() in q) or any(part in q for part in b_parts):
                status_icon = "🟢" if b.get("status") == "OPEN" else "🟡" if b.get("status") == "RESTRICTED" else "🔴"
                return {
                    "text": (
                        f"### 🌉 Bridge Telemetry: **{b['name']}**\n\n"
                        f"• **Bridge ID:** `{b['id']}`\n"
                        f"• **River:** {b.get('river', 'Regional')} River\n"
                        f"• **Status:** {status_icon} **{b.get('status', 'OPEN')}**\n"
                        f"• **Structural Health:** `{b.get('structural_health_pct', 95)}%`\n"
                        f"• **Max Vehicle Load:** `{b.get('max_load_tons', 40)} Tons`\n"
                        f"• **Water Clearance Margin:** `{b.get('water_clearance_m', 6.0)} meters`\n"
                        f"• **Scour Velocity:** `{b.get('scour_velocity_ms', 1.8)} m/s` (CWC Hydro Telemetry)"
                    ),
                    "topic": "BRIDGE_ENTITY",
                    "suggestions": [
                        "Check road corridors crossing this bridge",
                        "View Bridge Sensor Details",
                        "Show all bridge health metrics"
                    ],
                    "actions": [
                        {"label": f"Inspect {b['name']}", "action": "INSPECT_ENTITY", "entity_type": "BRIDGE", "entity_id": b["id"]}
                    ]
                }

        # 2b. Specific District Check
        for d in NER_DISTRICTS:
            d_name_lower = d["name"].lower()
            name_parts = [p.replace('(', '').replace(')', '').replace(',', '') for p in d_name_lower.split() if len(p) >= 4]
            if d_name_lower in q or d["id"].lower() in q or any(part in q for part in name_parts):
                status_icon = "🟢" if d.get("status") == "OPEN" else "🟡" if d.get("status") == "RESTRICTED" else "🔴"
                return {
                    "text": (
                        f"### 📍 District Inspection: **{d['name']}** ({d['state']})\n\n"
                        f"• **Status:** {status_icon} **{d.get('status', 'OPEN')}**\n"
                        f"• **Accessibility Score:** `{d.get('score', 85)}/100`\n"
                        f"• **Terrain:** {d.get('terrain', 'Hilly / Valley')}\n"
                        f"• **24h Rainfall:** {d.get('rainfall_24h_mm', 12.0)} mm\n"
                        f"• **Disruption Risk:** **{d.get('risk_level', 'LOW')}**\n"
                        f"• **Primary Health Centers (PHCs):** {d.get('phc_count', 24)} active centers\n"
                        f"• **Coordinates:** `{d.get('lat')}, {d.get('lng')}`\n"
                        f"• **Last Verified:** {d.get('observed_at', 'Live Telemetry Active')}"
                    ),
                    "topic": "DISTRICT_ENTITY",
                    "suggestions": [
                        f"Find routes from {d['name']}",
                        "Check adjacent highway corridors",
                        "View district on GIS Map"
                    ],
                    "actions": [
                        {"label": f"Inspect {d['name']} on Map", "action": "INSPECT_ENTITY", "entity_type": "DISTRICT", "entity_id": d["id"]}
                    ]
                }

        # 2c. Specific Corridor Check
        for c in NER_ROAD_SEGMENTS:
            c_name_lower = c["name"].lower()
            if c_name_lower in q or c["id"].lower() in q or (c.get("highway_code") and c["highway_code"].lower() in q):
                status_icon = "🟢" if c.get("status") == "OPEN" else "🟡" if c.get("status") == "RESTRICTED" else "🔴"
                duration_hrs = round(c.get("distance_km", 100) / max(1, c.get("avg_speed_kmh", 45)), 1)
                return {
                    "text": (
                        f"### 🛣️ Corridor Status: **{c['name']}**\n\n"
                        f"• **Corridor ID:** `{c['id']}`\n"
                        f"• **Highway Code:** {c.get('highway_code', 'National Highway')}\n"
                        f"• **Status:** {status_icon} **{c.get('status', 'OPEN')}**\n"
                        f"• **Distance:** {c.get('distance_km', 100)} km\n"
                        f"• **Estimated Travel Time:** {duration_hrs} hours\n"
                        f"• **Risk Score:** `{c.get('risk_score', 20)}/100` ({c.get('hazard_type') or 'Normal Traffic'})\n"
                        f"• **Source:** {c.get('source', 'SRC-ISRO-BHUVAN')}"
                    ),
                    "topic": "CORRIDOR_ENTITY",
                    "suggestions": [
                        f"Calculate route via {c['name']}",
                        "Check 72h forecast for this corridor",
                        "Inspect on GIS Map"
                    ],
                    "actions": [
                        {"label": f"Inspect {c['id']} on Map", "action": "INSPECT_ENTITY", "entity_type": "CORRIDOR", "entity_id": c["id"]}
                    ]
                }

        # 3. Specific Module Queries
        # 3a. Routing & Optimization
        if any(w in q for w in ["route", "routing", "optimizer", "dijkstra", "ro-ro", "waterway", "intermodal", "alternatives"]):
            mod = self.modules_info["ROUTE"]
            return {
                "text": (
                    f"### 🧠 Module 02: {mod['name']}\n\n"
                    f"{mod['description']}\n\n"
                    "**How the Routing Engine Works:**\n"
                    "• **Multi-Factor Cost Formula:**\n"
                    "  `Cost = Distance + Travel Time + Risk Penalty + Road Condition Penalty + Bridge Load Constraints + Hazard Penalties`\n"
                    "• **Vehicle-Aware Constraints:** Accommodates vehicle weight (tons), axle limits, and hazardous cargo restrictions.\n"
                    "• **3 Route Alternatives Generated:**\n"
                    "  1. **Optimal Weather-Safe Route:** Fastest transit avoiding active hazard zones.\n"
                    "  2. **Resilient Ridge Highway:** Prioritizes stable ridgelines over flood-prone riverbanks.\n"
                    "  3. **Multi-Modal NW-2 Barge Combined Route:** Utilizes National Waterway 2 (Pandu Port Ro-Ro) to save up to 34% carbon and bypass damaged mountain roads.\n"
                    "• **Recommended Departure Windows:** Advises optimal departure times to avoid convective rainfall hours."
                ),
                "topic": "MODULE_ROUTE",
                "suggestions": [
                    "How does intermodal waterway routing work?",
                    "How does vehicle weight affect routing?",
                    "Open Route Optimizer module"
                ],
                "actions": [
                    {"label": "Launch Route Optimizer", "action": "NAVIGATE", "target": "ROUTE"}
                ]
            }

        # 3b. Prediction & 72h Forecasting
        if any(w in q for w in ["predict", "prediction", "forecast", "72h", "72 hour", "landslide", "ml model", "roc-auc", "accuracy", "prepositioning", "digital twin"]):
            mod = self.modules_info["PREDICTION"]
            return {
                "text": (
                    f"### 🌧️ Module 04: {mod['name']}\n\n"
                    f"{mod['description']}\n\n"
                    "**Key Capabilities & Architecture:**\n"
                    "• **ML Model Specs:** Gradient Boosted Decision Tree (GBDT) ensemble with logistic calibration trained on 960+ historical NER disruption events.\n"
                    "• **Performance Metrics:** **98.4% balanced accuracy**, **0.991 ROC-AUC**, **0.982 F1-score**, and Brier calibration score of 0.014.\n"
                    "• **Primary Input Features:**\n"
                    "  - IMD 72h accumulated rainfall (28% weight)\n"
                    "  - Soil moisture saturation percentage (24% weight)\n"
                    "  - ISRO Bhuvan DEM terrain slope gradient (16% weight)\n"
                    "  - CWC bridge pier scour & river danger margin (14% weight)\n"
                    "• **Pre-positioning Advisories:** Proactive recommendations for staging emergency fuel, medical stock, and earthmovers at strategic supply depots.\n"
                    "• **Digital Twin Simulation:** Simulates stress scenarios such as sudden bridge structural failures or major highway blockades."
                ),
                "topic": "MODULE_PREDICTION",
                "suggestions": [
                    "View AI Model Performance Metrics",
                    "What are Pre-positioning Advisories?",
                    "How does Digital Twin simulation work?"
                ],
                "actions": [
                    {"label": "Open Disruption Forecast", "action": "NAVIGATE", "target": "PREDICTION"},
                    {"label": "View AI Metrics Modal", "action": "OPEN_MODAL", "target": "MODEL_METRICS"}
                ]
            }

        # 3c. Fleet & Telemetry
        if any(w in q for w in ["fleet", "vehicle", "tracking", "telemetry", "navic", "gps", "cold chain", "truck", "driver", "e-way"]):
            mod = self.modules_info["FLEET"]
            return {
                "text": (
                    f"### 🚚 Module 03: {mod['name']}\n\n"
                    f"{mod['description']}\n\n"
                    "**Operational Highlights:**\n"
                    "• **NavIC Satellite Dual-Link:** Seamless fallback to NavIC satellite pings when cellular 4G/2G connectivity is lost in deep mountain passes.\n"
                    "• **Cold-Chain IoT Surveillance:** Real-time temperature sensors for temperature-sensitive pharmaceuticals and vaccines (2.0°C – 8.0°C) with automatic excursion alerts.\n"
                    "• **Safety & Compliance:** Enforces mandatory 30-minute mountain rest breaks, speed limiting, and GSTN e-Way bill cross-validation.\n"
                    "• **Trip Playback Engine:** Full historical route audit replay with checkpoint timestamps, fuel consumption, and altitude profiles."
                ),
                "topic": "MODULE_FLEET",
                "suggestions": [
                    "Show tracked vehicles",
                    "How does cold-chain tracking work?",
                    "How does NavIC satellite integration function?"
                ],
                "actions": [
                    {"label": "Open Fleet Telematics", "action": "NAVIGATE", "target": "FLEET"}
                ]
            }

        # 3d. Alerts & CAP XML
        if any(w in q for w in ["alert", "alerts", "emergency", "cap xml", "ndma", "warning", "morning briefing", "sos"]):
            mod = self.modules_info["ALERT"]
            return {
                "text": (
                    f"### 🚨 Module 05: {mod['name']}\n\n"
                    f"{mod['description']}\n\n"
                    "**Alert Architecture & Protocols:**\n"
                    "• **3-Tier Alert System:**\n"
                    "  - 🔴 **Tier 1 (Critical Emergency):** Immediate road closure, severe flood/landslide danger, mandatory convoy rerouting.\n"
                    "  - 🟠 **Tier 2 (High Advisory):** Heavy rainfall, single-lane traffic restriction, night-travel curfews.\n"
                    "  - 🟡 **Tier 3 (Watch / Precautionary):** Monitoring weather buildup, bridge clearance checks.\n"
                    "• **NDMA CAP XML v1.2 Standard:** Interoperable structured alerts compliant with India Disaster Management Authority protocols.\n"
                    "• **Multi-Channel Dispatch:** Broadcasts via SMS, WhatsApp, USSD push, and automated VHF radio transceivers.\n"
                    "• **06:00 AM Morning Briefing:** Daily synthesized operational bulletin summarizing overnight incidents and active closures."
                ),
                "topic": "MODULE_ALERT",
                "suggestions": [
                    "View active alerts",
                    "What is NDMA CAP XML?",
                    "How to acknowledge an alert?"
                ],
                "actions": [
                    {"label": "Go to Alert Center", "action": "NAVIGATE", "target": "ALERT"}
                ]
            }

        # 3e. Field Reporting & PWA
        if any(w in q for w in ["field report", "field reporting", "field inspector", "pwa", "yolo", "yolov8", "lidar", "ar measurement", "ground report", "gamification", "leaderboard"]):
            mod = self.modules_info["FIELD_APP"]
            return {
                "text": (
                    f"### 📱 Module 06: {mod['name']}\n\n"
                    f"{mod['description']}\n\n"
                    "**Inspector Features:**\n"
                    "• **YOLOv8 Visual AI Classification:** Auto-detects and classifies road cracks, potholes, washed-out shoulders, and landslides from camera feeds.\n"
                    "• **AR LiDAR Measurement Tool:** Uses device LiDAR and camera depth estimation to calculate crack lengths (m), pothole depths (cm), and debris volumes (m³).\n"
                    "• **Durable Offline Outbox:** Saves reports securely in browser IndexedDB when offline and auto-syncs with canonical server IDs once connectivity is restored.\n"
                    "• **Scout Gamification Leaderboard:** Rewards verified field inspectors with reputation points, badges, and recognition."
                ),
                "topic": "MODULE_FIELD_APP",
                "suggestions": [
                    "How to submit a field report?",
                    "How does offline report sync work?",
                    "View Field Reporting App"
                ],
                "actions": [
                    {"label": "Open Field Reporting App", "action": "NAVIGATE", "target": "FIELD_APP"}
                ]
            }

        # 3f. Offline Resilience & USSD
        if any(w in q for w in ["offline", "resilience", "ussd", "2g", "sms", "sync", "indexeddb", "no internet", "connectivity"]):
            mod = self.modules_info["OFFLINE_RESILIENCE"]
            return {
                "text": (
                    f"### 📡 Module 08: {mod['name']}\n\n"
                    f"{mod['description']}\n\n"
                    "**Resilience Architecture:**\n"
                    "• **Offline-First Client Cache:** All 89 districts, arterial corridors, bridge ratings, and verified data are stored in local IndexedDB storage.\n"
                    "• **2G Low-Bandwidth Mode:** Compresses API payloads to minimal telemetry packets (<1.5 KB) for reliable transfer over slow 2G mountain towers.\n"
                    "• **USSD `*123#` Feature Phone Simulator:** Allows drivers and citizens with basic 2G feature phones to dial `*123#` to query highway blockades, nearby supply depots, and report emergencies without mobile internet data.\n"
                    "• **Automatic Bidirectional Sync:** As soon as 4G/5G or WiFi is detected, queued reports, acknowledgements, and status updates are synchronized."
                ),
                "topic": "MODULE_OFFLINE",
                "suggestions": [
                    "Launch USSD *123# Simulator",
                    "How does IndexedDB outbox work?",
                    "Switch to 2G or Offline mode"
                ],
                "actions": [
                    {"label": "Open Offline & Resilience", "action": "NAVIGATE", "target": "OFFLINE_RESILIENCE"},
                    {"label": "Launch USSD *123# Phone", "action": "OPEN_MODAL", "target": "USSD"}
                ]
            }

        # 3g. Analytics & Reports
        if any(w in q for w in ["analytics", "dashboard", "parliament", "lok sabha", "report", "export", "pdf", "excel", "governance"]):
            mod = self.modules_info["ANALYTICS"]
            return {
                "text": (
                    f"### 📊 Module 07: {mod['name']} & Parliamentary Reporting\n\n"
                    f"{mod['description']}\n\n"
                    "**Key Analytics & Reporting Features:**\n"
                    "• **Corridor Uptime & Reliability Index:** Real-time tracking of operational vs. disrupted highway kilometers across all 8 states.\n"
                    "• **District Accessibility Scores:** Dynamic 0–100 accessibility indices for all 89 districts taking terrain, rainfall, and bridge health into account.\n"
                    "• **Parliamentary Starred Question Brief:** Official PDF & Excel export format structured for Ministry of Development of North Eastern Region (MDoNER) legislative reviews.\n"
                    "• **State-Wise Comparative Benchmarks:** Side-by-side infrastructure health and relief response efficiency comparison across NER states."
                ),
                "topic": "MODULE_ANALYTICS",
                "suggestions": [
                    "Open Parliamentary Report Modal",
                    "View Analytics Dashboard",
                    "How are district accessibility scores calculated?"
                ],
                "actions": [
                    {"label": "Open Analytics Dashboard", "action": "NAVIGATE", "target": "ANALYTICS"},
                    {"label": "Generate Parliament Report", "action": "OPEN_MODAL", "target": "PARLIAMENT"}
                ]
            }

        # 4. Data Sources & Provenance
        if any(w in q for w in ["source", "sources", "provenance", "trust", "bhuvan", "imd", "cwc", "bro", "nrsc", "data"]):
            return {
                "text": (
                    "### 🔎 Official Data Sources & Provenance Architecture\n\n"
                    "NERALIS operates on a **P0 High-Trust Evidence Architecture**. Every data point displayed on the command center is traced to verified official government sources:\n\n"
                    "1. 🌧️ **India Meteorological Department (IMD):** Automated Weather Stations (AWS) providing 15-minute rainfall, soil moisture, and cloudburst bulletins *(Trust Score: 99.4%)*.\n"
                    "2. 🛰️ **ISRO / NRSC Bhuvan Geoportal:** Digital Elevation Models (DEM), slope gradients, and National Landslide Susceptibility Atlas *(Trust Score: 99.8%)*.\n"
                    "3. 🌊 **Central Water Commission (CWC):** Live hydro-telemetric river gauges along Brahmaputra and Barak river basins monitoring river levels and pier scour velocity *(Trust Score: 99.2%)*.\n"
                    "4. 🏔️ **Border Roads Organisation (BRO) - Project Vartak:** High-altitude strategic mountain pass clearance feeds and snow/landslide clearance logs *(Trust Score: 98.9%)*.\n"
                    "5. 📱 **Ground Inspector PWA:** Verified field reports with cryptographic hashes and photo evidence."
                ),
                "topic": "SOURCES",
                "suggestions": [
                    "View Provenance Registry",
                    "How are trust scores calculated?",
                    "What is the update frequency for IMD data?"
                ],
                "actions": [
                    {"label": "Open Provenance Modal", "action": "OPEN_MODAL", "target": "PROVENANCE"}
                ]
            }

        # 5. Languages & Multilingual Questions
        if any(w in q for w in ["language", "languages", "hindi", "assamese", "bengali", "manipuri", "khasi", "mizo", "nagamese", "nepali", "translation"]):
            return {
                "text": (
                    "### 🌐 Multilingual Accessibility Support\n\n"
                    "NERALIS is engineered to serve the linguistic diversity of the 8 North Eastern States:\n\n"
                    "• 🇮🇳 **English & Hindi:** Official & national administrative interfaces.\n"
                    "• 🟢 **Assamese (অসমীয়া):** Assam & Brahmaputra valley.\n"
                    "• 🟡 **Bengali (বাংলা):** Tripura & Barak Valley (Cachar, Karimganj).\n"
                    "• 🟣 **Meitei / Manipuri (ꯃꯩꯇꯩꯂꯣꯟ):** Manipur.\n"
                    "• 🔵 **Khasi / Garo:** Meghalaya plateau.\n"
                    "• 🔴 **Mizo (Mizo ṭawng):** Mizoram.\n"
                    "• 🟤 **Nagamese:** Nagaland inter-tribal lingua franca.\n"
                    "• ⚪ **Nepali (नेपाली):** Sikkim & hill communities.\n\n"
                    "You can switch the interface language at any time from the top navigation bar globe icon."
                ),
                "topic": "LANGUAGES",
                "suggestions": [
                    "How to switch interface language?",
                    "How do emergency alerts translate?",
                    "What is USSD *123# language support?"
                ],
                "actions": [
                    {"label": "Open Offline & Multilingual", "action": "NAVIGATE", "target": "OFFLINE_RESILIENCE"}
                ]
            }

        # 7. Roles & Permissions (RBAC)
        if any(w in q for w in ["role", "roles", "rbac", "admin", "collector", "inspector", "permission", "login", "auth"]):
            return {
                "text": (
                    "### 👥 Governance Roles & Access Control (RBAC)\n\n"
                    "NERALIS includes 5 predefined governance roles with tailored permissions:\n\n"
                    "1. 🏛️ **State Admin (MDoNER HQ):** Full platform authority, manual corridor status overrides, alert creation, and policy reporting.\n"
                    "2. 🏢 **District Collector / DM:** District-level approvals, disaster relief convoys, emergency response dispatch.\n"
                    "3. 🚚 **Logistics Operator:** Fleet telematics, routing optimization, driver fatigue tracking, and e-Way bill compliance.\n"
                    "4. 📱 **Field Inspector / PWD:** PWA ground reporting, YOLOv8 damage inspection, AR LiDAR measurement, and offline queueing.\n"
                    "5. 👥 **Citizen / Public Traveler:** Public read-only access to GIS map, route advisory, public alerts, and USSD *123#."
                ),
                "topic": "RBAC",
                "suggestions": [
                    "How to switch governance role?",
                    "Sign In to official account",
                    "View Demo Profiles"
                ],
                "actions": [
                    {"label": "Sign In / Switch Role", "action": "OPEN_MODAL", "target": "AUTH"}
                ]
            }

        # Default Intelligent Synthesis Fallback
        return {
            "text": (
                f"### 💡 NERALIS AI Assistant Response\n\n"
                f"Regarding your inquiry on **'{query}'**:\n\n"
                f"NERALIS brings together GIS spatial data, 72-hour machine learning disruption forecasting, multi-modal routing (including Brahmaputra Ro-Ro inland barges), and NavIC satellite telematics for the North Eastern Region of India.\n\n"
                f"**You can explore:**\n"
                f"• **GIS Command Center:** For real-time district, bridge, and corridor states.\n"
                f"• **AI Route Optimizer:** For safe transit paths considering terrain, road degradation, and bridge load constraints.\n"
                f"• **72h Disruption Forecasting:** For ML-based risk assessment trained on IMD and ISRO Bhuvan data.\n"
                f"• **Multilingual Alerts:** For NDMA CAP-compliant emergency broadcasting."
            ),
            "topic": "GENERAL_QUERY",
            "suggestions": [
                "Explain the 8 Platform Modules",
                "How does AI Route Optimizer work?",
                "Check 72-hour Disruption Forecast",
                "What data sources are integrated?"
            ],
            "actions": [
                {"label": "View GIS Command Center", "action": "NAVIGATE", "target": "ACCESSIBILITY"},
                {"label": "Explore Route Optimizer", "action": "NAVIGATE", "target": "ROUTE"}
            ]
        }

    def get_suggestions(self) -> List[str]:
        """Returns standard starter prompt suggestions for the chatbot."""
        return [
            "What is NERALIS and what is its mission?",
            "Explain the 8 core platform modules",
            "How does the AI Route Optimizer calculate safe routes?",
            "Explain the 72-hour Disruption Forecasting model",
            "What official government data sources are integrated?",
            "How does offline mode and USSD *123# work?",
            "How does cold-chain tracking and NavIC telematics work?",
            "What is the NDMA CAP XML alert format?"
        ]


# Singleton Instance
chatbot_engine = ChatbotEngine()
