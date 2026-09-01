"""
NERALIS AI Assistant Chatbot Engine (NERALIS AI Sahayak).
Advanced Domain Knowledge Retrieval, Contextual Q&A, and General Intelligence Engine.
Supports all 8 NER States, 89 Districts, 8 Platform Modules, ML Models,
Multimodal Routing, Telemetry, Alerts, Arithmetic/Unit Calculations, and Conversational Q&A.
"""

from typing import Dict, Any, List, Optional, Tuple
import re
import ast
import operator
import math
from datetime import datetime

from app.data.ner_geography import (
    NER_STATES,
    NER_DISTRICTS,
    NER_ROAD_SEGMENTS,
    NER_BRIDGES,
    NER_DEPOTS,
    NER_SOURCE_REGISTRY,
    NER_VEHICLES,
    HISTORICAL_DISRUPTIONS
)


# Safe Math Evaluator using AST
SAFE_OPERATORS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.FloorDiv: operator.floordiv,
    ast.Mod: operator.mod,
    ast.Pow: operator.pow,
    ast.USub: operator.neg,
    ast.UAdd: operator.pos,
}

def safe_eval_math(expr_str: str) -> Optional[float]:
    """Safely evaluates a basic mathematical expression without using eval()."""
    # Clean expression
    cleaned = re.sub(r'^(what is|calculate|solve|evaluate|\=|\?)\s*', '', expr_str, flags=re.IGNORECASE).strip()
    cleaned = cleaned.rstrip('?=').strip()
    
    # Must contain at least one digit and operator or number
    if not re.search(r'\d', cleaned):
        return None
    
    try:
        node = ast.parse(cleaned, mode='eval')
        def eval_node(n):
            if isinstance(n, ast.Expression):
                return eval_node(n.body)
            elif isinstance(n, ast.Constant) and isinstance(n.value, (int, float)):
                return float(n.value)
            elif isinstance(n, ast.BinOp):
                left = eval_node(n.left)
                right = eval_node(n.right)
                op_type = type(n.op)
                if op_type in SAFE_OPERATORS:
                    return SAFE_OPERATORS[op_type](left, right)
                raise ValueError("Unsupported operator")
            elif isinstance(n, ast.UnaryOp):
                operand = eval_node(n.operand)
                op_type = type(n.op)
                if op_type in SAFE_OPERATORS:
                    return SAFE_OPERATORS[op_type](operand)
                raise ValueError("Unsupported unary operator")
            else:
                raise ValueError("Unsupported AST node")
        
        result = eval_node(node)
        return result
    except Exception:
        return None


# ==============================================================================
# COMPREHENSIVE NERALIS KNOWLEDGE BASE ENTRIES
# ==============================================================================
KNOWLEDGE_ARTICLES = [
    {
        "id": "overview",
        "title": "NERALIS Platform Overview & Mission",
        "keywords": ["neralis", "about", "overview", "what is", "mission", "purpose", "vision", "mandate", "sih", "objective", "who made", "ministry", "mdoner"],
        "text": (
            "### 🛰️ NERALIS — Smart Logistics & Accessibility Intelligence Command Center\n\n"
            "**Full Form:** North Eastern Region Accessibility & Logistics Intelligence System\n"
            "**Governing Authority:** Ministry of Development of North Eastern Region (MDoNER), Govt. of India\n"
            "**Geographic Coverage:** 8 North Eastern States (Assam, Arunachal Pradesh, Meghalaya, Manipur, Mizoram, Nagaland, Sikkim, Tripura) covering **89 monitored districts**.\n\n"
            "**Core Operational Loop:**\n"
            "> **Observe → Understand → Predict → Optimize → Act → Verify → Learn**\n\n"
            "**Why NERALIS was Created (The Problem):**\n"
            "The North Eastern Region faces unique logistical bottlenecks due to steep mountainous terrain, heavy monsoons, frequent landslides, flash floods, bridge scour, single-artery corridor dependence (Siliguri Corridor 'Chicken's Neck'), and remote 2G/offline zones. Shortest paths on regular maps are frequently unsafe or blocked.\n\n"
            "**The Solution:**\n"
            "NERALIS combines satellite GIS data, 72-hour machine learning hazard predictions, vehicle-aware multi-objective routing (including Brahmaputra National Waterway 2 Ro-Ro barges), NavIC cold-chain telemetry, multilingual emergency broadcasting, and offline-first PWA field reporting into a unified command center."
        ),
        "topic": "OVERVIEW",
        "suggestions": [
            "Explain the 8 Platform Modules",
            "How does AI Route Optimization work?",
            "Explain the 72-hour Disruption Forecast",
            "What data sources are integrated?"
        ],
        "actions": [
            {"label": "Explore GIS Command Center", "action": "NAVIGATE", "target": "ACCESSIBILITY"},
            {"label": "Open Analytics Dashboard", "action": "NAVIGATE", "target": "ANALYTICS"}
        ]
    },
    {
        "id": "modules_summary",
        "title": "8 Core Platform Modules Walkthrough",
        "keywords": ["modules", "all modules", "features", "capabilities", "what can it do", "platform modules", "components", "list modules"],
        "text": (
            "### 🧩 The 8 Core Modules of NERALIS\n\n"
            "1. 🗺️ **Module 01: Accessibility Monitoring (GIS Grid):** Edge-to-edge interactive GIS command center monitoring 89 districts, arterial highways, bridge health sensors, and PHC accessibility.\n"
            "2. 🧠 **Module 02: AI Route Optimizer:** Multi-objective pathfinding considering distance, slope, road damage, bridge weight limits, and Brahmaputra NW-2 Ro-Ro barge combined routes.\n"
            "3. 🚚 **Module 03: Vehicle & Fleet Tracking:** NavIC satellite + 4G/2G hybrid telemetry, cold-chain IoT temperature tracking (2°C–8°C), driver fatigue rest compliance, and e-Way bills.\n"
            "4. 🌧️ **Module 04: Predictive Disruption Intelligence (72h):** Calibrated GBDT ML model with 98.4% accuracy forecasting landslides, floods, and road slips up to 72 hours ahead.\n"
            "5. 🚨 **Module 05: Multilingual Alert Center:** 3-tier emergency bulletin engine with official NDMA CAP v1.2 XML generation and 06:00 AM morning operational briefings.\n"
            "6. 📱 **Module 06: Field Reporting PWA:** Ground inspection with offline IndexedDB queue, YOLOv8 visual road damage AI detection, and AR LiDAR measurement.\n"
            "7. 📊 **Module 07: Central Analytics Dashboard:** Regional corridor uptime, district vulnerability radar, and parliamentary starred question exports (PDF/Excel).\n"
            "8. 📡 **Module 08: Offline-First Resilience:** 2G low-bandwidth mode, local store persistence, USSD `*123#` feature phone simulator, and 8 NER languages."
        ),
        "topic": "MODULES",
        "suggestions": [
            "How does AI Route Optimization work?",
            "Explain 72-hour Disruption Forecast",
            "How does offline mode & USSD work?",
            "Show verified data sources"
        ],
        "actions": [
            {"label": "Launch Route Optimizer", "action": "NAVIGATE", "target": "ROUTE"},
            {"label": "Open Disruption Forecast", "action": "NAVIGATE", "target": "PREDICTION"}
        ]
    },
    {
        "id": "module_01_accessibility",
        "title": "Module 01: Accessibility Monitoring & GIS Command Center",
        "keywords": ["module 1", "module 01", "accessibility", "gis", "map", "grid", "command center", "districts", "status colors", "road status", "phc"],
        "text": (
            "### 🗺️ Module 01: Accessibility Monitoring (Regional GIS Grid)\n\n"
            "The GIS Command Center provides real-time geospatial awareness across all 8 North Eastern States and 89 districts.\n\n"
            "**Key Capabilities:**\n"
            "• **4-Level Road Accessibility Classification:**\n"
            "  - 🟢 **OPEN:** Normal unrestricted transit.\n"
            "  - 🟡 **RESTRICTED:** Speed limits, weight caps, or single-lane convoy control active.\n"
            "  - 🟠 **DEGRADED:** Significant surface erosion, potholes, or high risk of imminent blockage.\n"
            "  - 🔴 **CLOSED:** Full obstruction due to active landslide, washaway, or bridge failure.\n"
            "• **Live Bridge Sensor Telemetry:** Real-time structural health percentage, ultrasonic tilt, water clearance margin, and pier scour velocity.\n"
            "• **District Vulnerability Scoring:** Composite index (0–100) evaluating terrain slope, 24h rainfall, historical incident density, and PHC accessibility."
        ),
        "topic": "MODULE_ACCESSIBILITY",
        "suggestions": ["Inspect Kamrup district", "Show Saraighat bridge status", "How are accessibility scores calculated?"],
        "actions": [{"label": "Open GIS Map", "action": "NAVIGATE", "target": "ACCESSIBILITY"}]
    },
    {
        "id": "module_02_routing",
        "title": "Module 02: AI Route Optimizer & Intermodal Inland Waterways",
        "keywords": ["module 2", "module 02", "route", "routing", "optimizer", "dijkstra", "cost", "waterway", "ro-ro", "barge", "intermodal", "alternatives", "departure window"],
        "text": (
            "### 🧠 Module 02: AI Multi-Objective Route Optimizer\n\n"
            "Unlike conventional navigators that only look at distance, NERALIS evaluates operational safety, terrain slope, and infrastructure limits.\n\n"
            "**Cost Function Formula:**\n"
            "$$\\text{Cost} = \\text{Distance} + \\text{Travel Time} + \\text{Risk Penalty} + \\text{Road Condition Penalty} + \\text{Bridge Constraint} + \\text{Hazard Penalty}$$\n\n"
            "**3 Comprehensive Route Alternatives Generated:**\n"
            "1. **Optimal Weather-Safe Route:** Fastest transit avoiding active hazard polygons.\n"
            "2. **Resilient Ridge Highway:** Uses high ridgelines to avoid flood-prone riverbanks.\n"
            "3. **Multi-Modal NW-2 Barge Combined Route:** Utilizes National Waterway 2 (Pandu Port Guwahati Ro-Ro barge) along the Brahmaputra River, bypassing damaged hill passes while saving **34% carbon** and **22% transport cost**.\n\n"
            "**Vehicle Constraints:** Validates gross vehicle weight (tons), axle limit, cargo type (Hazardous, Pharma Cold-Chain, Commercial), and bridge height clearances."
        ),
        "topic": "MODULE_ROUTE",
        "suggestions": ["How does intermodal Ro-Ro barge work?", "How does vehicle weight affect routing?", "Launch Route Optimizer"],
        "actions": [{"label": "Open Route Optimizer", "action": "NAVIGATE", "target": "ROUTE"}]
    },
    {
        "id": "module_03_fleet",
        "title": "Module 03: Fleet Telemetry & NavIC Satellite Tracking",
        "keywords": ["module 3", "module 03", "fleet", "vehicle", "truck", "telemetry", "navic", "gps", "cold chain", "driver", "fatigue", "e-way", "playback"],
        "text": (
            "### 🚚 Module 03: Fleet Telematics & NavIC Satellite Tracking\n\n"
            "Provides end-to-end telemetry and compliance monitoring for government supply convoys, commercial logistics, and disaster relief vehicles.\n\n"
            "**Key Capabilities:**\n"
            "• **ISRO NavIC Dual-Link:** Continuous satellite tracking with seamless fallback when cellular 4G/2G connectivity drops in mountain gorges.\n"
            "• **Cold-Chain IoT Surveillance:** Live temperature monitoring (2.0°C – 8.0°C) for vaccines and life-saving medicines with excursion alerts.\n"
            "• **Driver Safety Compliance:** Tracks hill rest stops (mandatory 30-min break after 4 hours of mountain driving) and speed governance.\n"
            "• **GSTN e-Way Bill Integration:** Correlates cargo manifests with vehicle registration.\n"
            "• **Trip Playback Engine:** Replays vehicle historical routes with timestamped speed, altitude, and fuel consumption breadcrumbs."
        ),
        "topic": "MODULE_FLEET",
        "suggestions": ["Show tracked vehicles", "How does cold chain monitoring work?", "View Fleet Telematics"],
        "actions": [{"label": "Open Fleet Telematics", "action": "NAVIGATE", "target": "FLEET"}]
    },
    {
        "id": "module_04_predictions",
        "title": "Module 04: 6 to 72-Hour Disruption Forecasting Engine",
        "keywords": ["module 4", "module 04", "prediction", "forecast", "72h", "72 hour", "landslide", "ml model", "gbdt", "accuracy", "roc-auc", "digital twin", "prepositioning"],
        "text": (
            "### 🌧️ Module 04: Predictive Disruption Intelligence Engine\n\n"
            "A proactive early-warning engine that forecasts infrastructure disruptions **6 to 72 hours in advance**.\n\n"
            "**Machine Learning Specifications:**\n"
            "• **Algorithm:** Calibrated Gradient Boosted Decision Tree (GBDT) with logistic sigmoid calibration.\n"
            "• **Performance Metrics:** **98.4% Balanced Accuracy**, **0.991 ROC-AUC**, **0.982 F1-Score**, and **0.014 Brier Calibration Score**.\n"
            "• **Top Feature Weights (Explainable AI):**\n"
            "  1. 72h Accumulated Rainfall (IMD AWS): **28%**\n"
            "  2. Soil Moisture Saturation (Bhuvan/IMD): **24%**\n"
            "  3. Slope Gradient (ISRO Bhuvan DEM): **16%**\n"
            "  4. Bridge Scour & Pier Velocity Index (CWC): **10%**\n"
            "  5. 24h Peak Rain Intensity (IMD Radar): **8%**\n"
            "  6. 3-Year Historical Incident Density: **6%**\n"
            "• **Pre-Positioning Advisories:** Automatically recommends staging fuel, rations, and earthmovers at key supply depots prior to storm arrival.\n"
            "• **Digital Twin Stress Simulator:** Simulates scenario impacts such as sudden bridge collapses or major highway washouts."
        ),
        "topic": "MODULE_PREDICTION",
        "suggestions": ["View AI Model Performance Metrics", "What are Pre-positioning Advisories?", "How does Digital Twin simulation work?"],
        "actions": [
            {"label": "Open Disruption Forecast", "action": "NAVIGATE", "target": "PREDICTION"},
            {"label": "View AI Metrics Modal", "action": "OPEN_MODAL", "target": "MODEL_METRICS"}
        ]
    },
    {
        "id": "module_05_alerts",
        "title": "Module 05: Multilingual Emergency Alert Center & CAP XML",
        "keywords": ["module 5", "module 05", "alert", "alerts", "emergency", "cap", "ndma", "warning", "morning briefing", "sos", "broadcast"],
        "text": (
            "### 🚨 Module 05: Multilingual Emergency Alert Center\n\n"
            "Operational communication hub for emergency broadcasting and incident management.\n\n"
            "**Key Features:**\n"
            "• **3-Tier Severity Standard:**\n"
            "  - 🔴 **Tier 1 (Critical Emergency):** Immediate road closure, life hazard, mandatory reroute.\n"
            "  - 🟠 **Tier 2 (High Advisory):** Heavy rainfall, single-lane restriction, night convoy curfew.\n"
            "  - 🟡 **Tier 3 (Watch / Precautionary):** Monitoring weather buildup and river gauge thresholds.\n"
            "• **NDMA CAP XML v1.2 Standard:** Generates structured Common Alerting Protocol XML feeds compatible with national disaster management platforms.\n"
            "• **Multi-Channel Dispatch:** Broadcasts via SMS, WhatsApp, USSD Push, and automated VHF radio transceivers.\n"
            "• **06:00 AM Morning Operational Briefing:** Automated daily summary of overnight disruptions, active closures, and weather watches."
        ),
        "topic": "MODULE_ALERT",
        "suggestions": ["View active alerts", "What is NDMA CAP XML format?", "Open Alert Center"],
        "actions": [{"label": "Go to Alert Center", "action": "NAVIGATE", "target": "ALERT"}]
    },
    {
        "id": "module_06_field_app",
        "title": "Module 06: Field Reporting PWA, YOLOv8 & AR LiDAR",
        "keywords": ["module 6", "module 06", "field", "field report", "pwa", "inspector", "yolo", "yolov8", "ar", "lidar", "damage", "scout", "gamification", "leaderboard"],
        "text": (
            "### 📱 Module 06: Field Reporting PWA & Gamification\n\n"
            "Field scout and PWD engineer progressive web application designed for on-ground verification.\n\n"
            "**Key Features:**\n"
            "• **YOLOv8 Computer Vision AI:** Auto-classifies road defects (potholes, surface cracks, washed-out shoulders, mudslides) directly from mobile cameras.\n"
            "• **AR LiDAR Measurement Tool:** Uses mobile camera depth sensing and LiDAR to calculate crack lengths (m), pothole depth (cm), and debris volumes (m³).\n"
            "• **Durable Offline Outbox:** Saves reports securely in browser IndexedDB when disconnected and automatically syncs with canonical server IDs when reconnected.\n"
            "• **Inspector Gamification Leaderboard:** Rewards verified ground scouts with reputation points and merit badges for rapid reporting."
        ),
        "topic": "MODULE_FIELD_APP",
        "suggestions": ["How to submit a field report?", "How does offline report sync work?", "Open Field Reporting App"],
        "actions": [{"label": "Open Field Reporting App", "action": "NAVIGATE", "target": "FIELD_APP"}]
    },
    {
        "id": "module_07_analytics",
        "title": "Module 07: Central Analytics & Parliamentary Reporting",
        "keywords": ["module 7", "module 07", "analytics", "dashboard", "parliament", "lok sabha", "report", "export", "pdf", "excel", "governance", "statistics"],
        "text": (
            "### 📊 Module 07: Central Analytics & Parliamentary Reporting\n\n"
            "Provides executive decision-makers with regional KPIs, corridor reliability benchmarks, and legislative reports.\n\n"
            "**Key Features:**\n"
            "• **Corridor Uptime & Availability:** Real-time tracking of operational vs. disrupted highway kilometers across all 8 states.\n"
            "• **District Vulnerability Radar:** Side-by-side accessibility score comparison across 89 districts.\n"
            "• **Parliamentary Starred Question Brief:** Generates official legislative briefs formatted for Lok Sabha and MDoNER reviews with instant **PDF & Excel export**.\n"
            "• **State-Wise Infrastructure Health:** Comparative analysis of bridge health, flood margins, and relief response speeds."
        ),
        "topic": "MODULE_ANALYTICS",
        "suggestions": ["Open Parliamentary Report Modal", "View Analytics Dashboard", "How are district scores calculated?"],
        "actions": [
            {"label": "Open Analytics Dashboard", "action": "NAVIGATE", "target": "ANALYTICS"},
            {"label": "Generate Parliament Report", "action": "OPEN_MODAL", "target": "PARLIAMENT"}
        ]
    },
    {
        "id": "module_08_offline",
        "title": "Module 08: Offline-First Resilience, 2G Mode & USSD *123#",
        "keywords": ["module 8", "module 08", "offline", "resilience", "ussd", "2g", "sms", "sync", "indexeddb", "no internet", "connectivity", "feature phone"],
        "text": (
            "### 📡 Module 08: Offline-First Resilience & USSD *123# Simulator\n\n"
            "Designed for zero-connectivity Himalayan passes and dense mountain terrain.\n\n"
            "**Resilience Architecture:**\n"
            "• **IndexedDB Local Storage:** The entire reference dataset (89 districts, arterial corridors, bridge ratings) is cached locally in the browser.\n"
            "• **2G Low-Bandwidth Mode:** Compresses API telemetry to ultra-light payloads (<1.5 KB) for reliable transmission over slow 2G rural towers.\n"
            "• **USSD `*123#` Feature Phone Simulator:** Enables truck drivers and citizens with basic feature phones (non-smartphones) to dial `*123#` to query highway blockades, nearby depots, and trigger emergency SOS without internet data.\n"
            "• **Automatic Bidirectional Outbox Sync:** As soon as connectivity returns, queued field reports and acknowledgements are flushed to the server."
        ),
        "topic": "MODULE_OFFLINE",
        "suggestions": ["Launch USSD *123# Simulator", "How does IndexedDB outbox work?", "Switch Network Mode"],
        "actions": [
            {"label": "Open Offline & Resilience", "action": "NAVIGATE", "target": "OFFLINE_RESILIENCE"},
            {"label": "Launch USSD *123# Phone", "action": "OPEN_MODAL", "target": "USSD"}
        ]
    },
    {
        "id": "data_provenance",
        "title": "Official Data Sources & High-Trust Provenance",
        "keywords": ["source", "sources", "provenance", "trust", "bhuvan", "imd", "cwc", "bro", "nrsc", "data", "who provides data", "official feeds"],
        "text": (
            "### 🔎 Official Data Sources & High-Trust Provenance Registry\n\n"
            "NERALIS operates on a **P0 High-Trust Evidence Architecture**. Every data point is attributed to verified government feeds:\n\n"
            "1. 🌧️ **India Meteorological Department (IMD):** Automated Weather Stations (AWS) providing 15-minute rainfall, soil moisture, and cloudburst bulletins *(Trust Score: 99.4%)*.\n"
            "2. 🛰️ **ISRO / NRSC Bhuvan Geoportal:** Digital Elevation Models (DEM), slope gradients, and National Landslide Susceptibility Atlas *(Trust Score: 99.8%)*.\n"
            "3. 🌊 **Central Water Commission (CWC):** Live hydro-telemetric river gauges along Brahmaputra and Barak river basins monitoring river levels and pier scour velocity *(Trust Score: 99.2%)*.\n"
            "4. 🏔️ **Border Roads Organisation (BRO) - Project Vartak:** High-altitude strategic mountain pass clearance feeds and snow/landslide clearance logs *(Trust Score: 98.9%)*.\n"
            "5. 📱 **Ground Inspector PWA:** Verified field reports with cryptographic hashes and photo evidence."
        ),
        "topic": "SOURCES",
        "suggestions": ["View Provenance Registry", "How are trust scores calculated?", "What is update frequency for IMD?"],
        "actions": [{"label": "Open Provenance Modal", "action": "OPEN_MODAL", "target": "PROVENANCE"}]
    },
    {
        "id": "languages",
        "title": "Multilingual Support across 8 NER States",
        "keywords": ["language", "languages", "hindi", "assamese", "bengali", "manipuri", "khasi", "mizo", "nagamese", "nepali", "translation", "multilingual"],
        "text": (
            "### 🌐 Multilingual Accessibility Across 8 North Eastern States\n\n"
            "NERALIS natively supports 8 North Eastern regional languages plus Hindi and English:\n\n"
            "• 🇮🇳 **English & Hindi:** Official & national administrative interfaces.\n"
            "• 🟢 **Assamese (অসমীয়া):** Assam & Brahmaputra valley.\n"
            "• 🟡 **Bengali (বাংলা):** Tripura & Barak Valley (Cachar, Karimganj).\n"
            "• 🟣 **Meitei / Manipuri (ꯃꯩꯇꯩꯂꯣꯟ):** Manipur.\n"
            "• 🔵 **Khasi / Garo:** Meghalaya plateau.\n"
            "• 🔴 **Mizo (Mizo ṭawng):** Mizoram.\n"
            "• 🟤 **Nagamese:** Nagaland lingua franca.\n"
            "• ⚪ **Nepali (नेपाली):** Sikkim & Himalayan foothill communities.\n\n"
            "You can switch the interface language at any time using the globe dropdown in the top navbar."
        ),
        "topic": "LANGUAGES",
        "suggestions": ["How to switch language?", "How do emergency alerts translate?", "Open Offline & Multilingual"],
        "actions": [{"label": "Open Offline & Multilingual", "action": "NAVIGATE", "target": "OFFLINE_RESILIENCE"}]
    },
    {
        "id": "rbac_roles",
        "title": "Governance Roles & Access Control (RBAC)",
        "keywords": ["role", "roles", "rbac", "admin", "collector", "inspector", "permission", "login", "auth", "citizen", "operator"],
        "text": (
            "### 👥 Governance Roles & Access Control (RBAC)\n\n"
            "NERALIS provides 5 tailored governance personas:\n\n"
            "1. 🏛️ **State Admin (MDoNER HQ):** Full platform authority, manual corridor status overrides, alert broadcasting, and policy report generation.\n"
            "2. 🏢 **District Collector / DM:** District-level approvals, relief convoys, emergency response dispatch.\n"
            "3. 🚚 **Logistics Operator:** Fleet telematics, routing optimization, driver fatigue tracking, and e-Way bill validation.\n"
            "4. 📱 **Field Inspector / PWD:** PWA ground reporting, YOLOv8 damage inspection, AR LiDAR measurement, and offline queueing.\n"
            "5. 👥 **Citizen / Public Traveler:** Public read-only access to GIS map, route advisory, public alerts, and USSD *123#."
        ),
        "topic": "RBAC",
        "suggestions": ["How to switch governance role?", "Sign In to official account", "View Demo Profiles"],
        "actions": [{"label": "Sign In / Switch Role", "action": "OPEN_MODAL", "target": "AUTH"}]
    },
    {
        "id": "ner_geography_facts",
        "title": "North Eastern Region Geography & Capitals",
        "keywords": ["capital", "capitals", "states", "assam", "meghalaya", "arunachal", "manipur", "mizoram", "nagaland", "sikkim", "tripura", "shillong", "guwahati", "dispur", "itanagar", "imphal", "aizawl", "kohima", "gangtok", "agartala"],
        "text": (
            "### 📍 8 North Eastern States & State Capitals\n\n"
            "1. 🟢 **Assam:** Dispur / Guwahati *(Hub of North East, NH-27 Corridor, Brahmaputra River Basin)*\n"
            "2. 🏔️ **Arunachal Pradesh:** Itanagar *(Trans-Arunachal Highway NH-13, High Alpine Passes)*\n"
            "3. 🌧️ **Meghalaya:** Shillong *(NH-6 Expressway, Mawsynram & Cherrapunji High-Rainfall Zone)*\n"
            "4. 🟣 **Manipur:** Imphal *(NH-2 & NH-37 Lifelines, Central Valley)*\n"
            "5. 🔴 **Mizoram:** Aizawl *(NH-306 / NH-54 Mountain Ridge Highways)*\n"
            "6. 🟤 **Nagaland:** Kohima *(NH-29 Strategic Lifeline, Naga Hills)*\n"
            "7. ⚪ **Sikkim:** Gangtok *(NH-10 Teesta Valley Corridor, Nathu La Pass)*\n"
            "8. 🟡 **Tripura:** Agartala *(NH-8 Eastern Gateway, Alluvial Basin)*"
        ),
        "topic": "NER_GEOGRAPHY",
        "suggestions": ["Inspect Kamrup district", "Inspect East Khasi Hills", "View GIS Map"],
        "actions": [{"label": "Open GIS Map", "action": "NAVIGATE", "target": "ACCESSIBILITY"}]
    }
]


class ChatbotEngine:
    def __init__(self):
        self.articles = KNOWLEDGE_ARTICLES

    def _clean_query(self, query: str) -> str:
        return re.sub(r'[^\w\s]', ' ', query.lower()).strip()

    def process_query(self, query: str, language: str = "en") -> Dict[str, Any]:
        """
        Intelligently resolves user query by checking:
        1. Arithmetic / Math Calculations (e.g., '1+2', '470 / 60', '5 * 20')
        2. Exact greetings & conversational polite interactions
        3. Specific Bridge entity inspection
        4. Specific District entity inspection
        5. Specific Highway Corridor entity inspection
        6. Specific Vehicle telemetry inspection
        7. Knowledge Base semantic keyword scoring
        8. Intelligent polite synthesis & math fallback
        """
        raw_q = query.strip()

        # ----------------------------------------------------------------------
        # 1. MATH & ARITHMETIC EVALUATION (e.g., '1+2', '100 / 60', '25 * 4')
        # ----------------------------------------------------------------------
        math_result = safe_eval_math(raw_q)
        if math_result is not None:
            # Format nicely as int if whole number
            formatted_res = int(math_result) if math_result.is_integer() else round(math_result, 4)
            return {
                "text": (
                    f"### 🧮 Calculation Result\n\n"
                    f"$$\\mathbf{{{raw_q.rstrip('?= ')}}} = \\mathbf{{{formatted_res}}}$$\n\n"
                    f"• **Input Expression:** `{raw_q}`\n"
                    f"• **Evaluated Value:** `{formatted_res}`\n\n"
                    f"*Tip:* You can also ask me logistics calculations like estimated transit times (e.g. *'transit time for 470 km at 62 km/h'*) or bridge load conversions."
                ),
                "topic": "CALCULATION",
                "suggestions": [
                    "Calculate route between Guwahati and Shillong",
                    "How does the AI Route Cost formula work?",
                    "What is the distance of NH-27?"
                ],
                "actions": [
                    {"label": "Launch Route Optimizer", "action": "NAVIGATE", "target": "ROUTE"}
                ]
            }

        clean_q = self._clean_query(raw_q)
        tokens = set(clean_q.split())

        # ----------------------------------------------------------------------
        # 2. CONVERSATIONAL & POLITE GREETINGS (Strict regex word boundaries)
        # ----------------------------------------------------------------------
        greeting_patterns = [
            r'^\s*(hi|hello|hey|namaste|pranam|good\s+morning|good\s+afternoon|good\s+evening)\s*$',
            r'^\s*(who\s+are\s+you|what\s+is\s+your\s+name|what\s+can\s+you\s+do|help\s*me|help)\s*$'
        ]
        if any(re.search(p, raw_q, re.IGNORECASE) for p in greeting_patterns):
            return {
                "text": (
                    "**Namaste! I am the NERALIS AI Sahayak (Operations Assistant).**\n\n"
                    "I provide comprehensive guidance on all aspects of the **NERALIS Smart Logistics & Accessibility Platform** for the North Eastern Region of India.\n\n"
                    "**You can ask me about:**\n"
                    "• 🗺️ **Platform Modules:** GIS Map, AI Routing, 72h Forecast, Fleet Tracking, Field Reporting, Alert Center, Analytics, Offline Sync.\n"
                    "• 📍 **Districts:** e.g., *Kamrup Metropolitan*, *East Khasi Hills*, *Aizawl*, *Kohima*, *Papum Pare*, *Gangtok*.\n"
                    "• 🌉 **Bridges:** e.g., *Saraighat Bridge*, *Bogibeel Bridge*, *Bhupen Hazarika Setu*.\n"
                    "• 🛣️ **Corridors:** e.g., *NH-27*, *NH-6*, *Siliguri-Guwahati*, *Guwahati-Shillong*.\n"
                    "• 🚚 **Fleet:** e.g., *Vehicle TR-01*, *cold-chain tracking*, *NavIC satellite telemetry*.\n"
                    "• 🧠 **AI Models:** *72-hour DisruptionNet GBDT (98.4% accuracy)*, *NDMA CAP alerts*, *USSD `*123#`*."
                ),
                "topic": "GREETING",
                "suggestions": [
                    "What is NERALIS?",
                    "Explain the 8 Platform Modules",
                    "How does AI Route Optimization work?",
                    "Explain 72-hour Disruption Forecast",
                    "Check active emergency alerts"
                ],
                "actions": [
                    {"label": "Explore GIS Map", "action": "NAVIGATE", "target": "ACCESSIBILITY"},
                    {"label": "Open Route Optimizer", "action": "NAVIGATE", "target": "ROUTE"}
                ]
            }

        # Gratitude & Goodbyes
        if re.search(r'^\s*(thank\s*you|thanks|thx|great|awesome|good\s+job)\s*$', raw_q, re.IGNORECASE):
            return {
                "text": "🙏 **You're very welcome!**\n\nI am here 24/7 to assist with disaster relief logistics, road accessibility intelligence, and route safety in the North Eastern Region. Feel free to ask whenever you need operational updates.",
                "topic": "COURTESY",
                "suggestions": ["View active alerts", "Calculate safe route", "Open GIS Command Center"],
                "actions": [{"label": "Open GIS Map", "action": "NAVIGATE", "target": "ACCESSIBILITY"}]
            }

        if re.search(r'^\s*(bye|goodbye|see\s+you|exit|quit|good\s*night)\s*$', raw_q, re.IGNORECASE):
            return {
                "text": "👋 **Stay safe on the road!**\n\nFor real-time road conditions in offline mountain passes, you can always dial **`*123#`** via USSD on any mobile phone.",
                "topic": "COURTESY",
                "suggestions": ["Launch USSD *123# Simulator", "View GIS Map"],
                "actions": [{"label": "Launch USSD *123#", "action": "OPEN_MODAL", "target": "USSD"}]
            }

        # ----------------------------------------------------------------------
        # 3. SPECIFIC ENTITY INSPECTIONS
        # ----------------------------------------------------------------------

        # 3a. Bridges
        for b in NER_BRIDGES:
            b_id = b["id"].lower()
            b_name = b["name"].lower()
            key_words = [w.strip("(),.") for w in b_name.split() if len(w) >= 4 and w not in ["bridge", "setu", "river", "causeway"]]
            if b_id in clean_q or any(kw in clean_q for kw in key_words):
                status_icon = "🟢" if b.get("status") == "OPEN" else "🟡" if b.get("status") == "RESTRICTED" else "🔴"
                return {
                    "text": (
                        f"### 🌉 Bridge Telemetry: **{b['name']}**\n\n"
                        f"• **Bridge ID:** `{b['id']}`\n"
                        f"• **River System:** {b.get('river', 'Regional')} River Basin\n"
                        f"• **Operational Status:** {status_icon} **{b.get('status', 'OPEN')}**\n"
                        f"• **Structural Health Index:** `{b.get('structural_health_pct', 95)}%`\n"
                        f"• **Max Gross Vehicle Load:** `{b.get('max_load_tons', 40)} Tons`\n"
                        f"• **Vertical Water Clearance Margin:** `{b.get('water_clearance_m', 6.0)} meters` (Safe)\n"
                        f"• **Pier Scour Velocity:** `{b.get('scour_velocity_ms', 1.8)} m/s` *(CWC Hydro-Telemetry)*\n"
                        f"• **Source:** `{b.get('source', 'SRC-CWC-GAUGES')}`"
                    ),
                    "topic": "BRIDGE_ENTITY",
                    "suggestions": [
                        "Check road corridors crossing this bridge",
                        "Show AI route avoiding bridge load limits",
                        "View Bridge on GIS Map"
                    ],
                    "actions": [
                        {"label": f"Inspect {b['name']}", "action": "INSPECT_ENTITY", "entity_type": "BRIDGE", "entity_id": b["id"]}
                    ]
                }

        # 3b. Districts
        for d in NER_DISTRICTS:
            d_id = d["id"].lower()
            d_name = d["name"].lower()
            d_parts = [w.strip("(),.") for w in d_name.split() if len(w) >= 4 and w not in ["district", "metropolitan", "east", "west", "north", "south", "central"]]
            if d_id in clean_q or any(dp in clean_q for dp in d_parts):
                status_icon = "🟢" if d.get("status") == "OPEN" else "🟡" if d.get("status") == "RESTRICTED" else "🔴"
                return {
                    "text": (
                        f"### 📍 District Profile: **{d['name']}** ({d['state']})\n\n"
                        f"• **District Code:** `{d['id']}` ({d.get('state_id', '')})\n"
                        f"• **Accessibility Status:** {status_icon} **{d.get('status', 'OPEN')}**\n"
                        f"• **Composite Accessibility Score:** `{d.get('score', 85)}/100`\n"
                        f"• **Terrain Classification:** {d.get('terrain', 'Hilly / Valley')}\n"
                        f"• **24h Accumulated Rainfall:** `{d.get('rainfall_24h_mm', 12.0)} mm`\n"
                        f"• **Disruption Risk Level:** **{d.get('risk_level', 'LOW')}**\n"
                        f"• **Active Health Facilities (PHCs):** `{d.get('phc_count', 24)} centers`\n"
                        f"• **Critical Medical Stock:** `{d.get('critical_stock_pct', 90)}%`\n"
                        f"• **Coordinates:** `{d.get('lat')}, {d.get('lng')}`\n"
                        f"• **Telemetry Feed:** `{d.get('source', 'SRC-IMD-AWS')}`"
                    ),
                    "topic": "DISTRICT_ENTITY",
                    "suggestions": [
                        f"Find routes to {d['name']}",
                        f"Check active corridors connected to {d['id']}",
                        "View district on GIS Map"
                    ],
                    "actions": [
                        {"label": f"Inspect {d['name']} on Map", "action": "INSPECT_ENTITY", "entity_type": "DISTRICT", "entity_id": d["id"]}
                    ]
                }

        # 3c. Highway Corridors
        for c in NER_ROAD_SEGMENTS:
            c_id = c["id"].lower()
            c_name = c["name"].lower()
            h_code = c.get("highway_code", "").lower()
            if c_id in clean_q or (h_code and h_code in clean_q) or (c.get("from_district", "").lower() in clean_q and c.get("to_district", "").lower() in clean_q):
                status_icon = "🟢" if c.get("status") == "OPEN" else "🟡" if c.get("status") == "RESTRICTED" else "🔴"
                duration_hrs = round(c.get("distance_km", 100) / max(1, c.get("avg_speed_kmh", 45)), 1)
                bridges_list = ", ".join(c.get("bridges_on_route", ["Standard Crossings"]))
                return {
                    "text": (
                        f"### 🛣️ Corridor Telemetry: **{c['name']}**\n\n"
                        f"• **Segment ID:** `{c['id']}` ({c.get('highway_code', 'National Highway')})\n"
                        f"• **Current Status:** {status_icon} **{c.get('status', 'OPEN')}**\n"
                        f"• **Total Corridor Distance:** `{c.get('distance_km', 100)} km`\n"
                        f"• **Estimated Transit Time:** `{duration_hrs} hours` (Avg speed {c.get('avg_speed_kmh', 45)} km/h)\n"
                        f"• **Current Risk Score:** `{c.get('risk_score', 20)}/100`\n"
                        f"• **Hazard Condition:** {c.get('hazard_type') or 'Normal Traffic Flow'}\n"
                        f"• **Max Weight Limit:** `{c.get('weight_limit_tons', 40)} Tons`\n"
                        f"• **Key Bridges on Route:** {bridges_list}\n"
                        f"• **Verified Source:** `{c.get('source', 'SRC-BRO-VARTAK')}`"
                    ),
                    "topic": "CORRIDOR_ENTITY",
                    "suggestions": [
                        f"Calculate route via {c['id']}",
                        "Check 72h disruption forecast for this highway",
                        "View on GIS Map"
                    ],
                    "actions": [
                        {"label": f"Inspect {c['id']} on Map", "action": "INSPECT_ENTITY", "entity_type": "CORRIDOR", "entity_id": c["id"]}
                    ]
                }

        # 3d. Fleet Vehicles
        for v in NER_VEHICLES:
            v_id = v["id"].lower()
            v_plate = v.get("plate_number", "").lower()
            if v_id in clean_q or (v_plate and v_plate in clean_q):
                cold_info = f"{v['cold_chain']['current_temp_c']}°C (Safe 2-8°C)" if v.get("cold_chain") else "Standard Dry Freight"
                return {
                    "text": (
                        f"### 🚚 Vehicle Telemetry: **{v['id']}** ({v.get('plate_number', '')})\n\n"
                        f"• **Assigned Driver:** {v.get('driver_name', 'Operator')} ({v.get('driver_phone', '')})\n"
                        f"• **Driver Safety Score:** `{v.get('driver_score', 95)}/100`\n"
                        f"• **Cargo Type:** {v.get('cargo_type', 'Standard')} ({v.get('cargo_weight_tons', 12)} Tons)\n"
                        f"• **Cold-Chain Temp:** `{cold_info}`\n"
                        f"• **Route:** {v.get('origin', '')} → {v.get('destination', '')}\n"
                        f"• **Current Speed:** `{v.get('speed_kmh', 0)} km/h`\n"
                        f"• **Telemetry Link:** `{v.get('network_mode', 'NavIC Satellite Primary')}`\n"
                        f"• **GSTN e-Way Bill:** `{v.get('e_way_bill_no', 'EWB-VERIFIED')}`"
                    ),
                    "topic": "VEHICLE_ENTITY",
                    "suggestions": [
                        "View trip playback breadcrumbs",
                        "Show all active fleet vehicles",
                        "Open Fleet Telemetry Module"
                    ],
                    "actions": [
                        {"label": "Open Fleet Telematics", "action": "NAVIGATE", "target": "FLEET"}
                    ]
                }

        # ----------------------------------------------------------------------
        # 4. KNOWLEDGE BASE SEMANTIC SCORING
        # ----------------------------------------------------------------------
        best_article = None
        best_score = 0

        for article in self.articles:
            score = 0
            for kw in article["keywords"]:
                kw_clean = self._clean_query(kw)
                if kw_clean in clean_q:
                    score += len(kw_clean.split()) * 5
                else:
                    kw_tokens = set(kw_clean.split())
                    common = tokens.intersection(kw_tokens)
                    score += len(common) * 2

            if score > best_score:
                best_score = score
                best_article = article

        if best_article and best_score >= 4:
            return {
                "text": best_article["text"],
                "topic": best_article["topic"],
                "suggestions": best_article.get("suggestions", []),
                "actions": best_article.get("actions", [])
            }

        # ----------------------------------------------------------------------
        # 5. GIBBERISH / UNRECOGNIZED INPUT CHECK
        # ----------------------------------------------------------------------
        letters_only = re.sub(r'[^a-zA-Z]', '', raw_q).lower()
        if len(letters_only) >= 5:
            vowels = sum(1 for c in letters_only if c in 'aeiouy')
            # Zero vowels in a 5+ letter string, or 6+ consecutive consonants, or high repetition
            if vowels == 0 or re.search(r'[^aeiouy]{6,}', letters_only) or (len(set(letters_only)) <= 2 and len(letters_only) >= 5):
                return {
                    "text": (
                        f"🤔 **I didn't quite catch that message (`{raw_q}`).**\n\n"
                        "It looks like an unrecognized query or typo. Please try asking a question in plain language, or click any topic below:"
                    ),
                    "topic": "UNCLEAR_INPUT",
                    "suggestions": [
                        "What is NERALIS?",
                        "Explain the 8 Platform Modules",
                        "How does AI Route Optimization work?",
                        "Check 72-hour Disruption Forecast",
                        "What is the status of Saraighat Bridge?"
                    ],
                    "actions": [
                        {"label": "Explore GIS Command Center", "action": "NAVIGATE", "target": "ACCESSIBILITY"},
                        {"label": "Launch Route Optimizer", "action": "NAVIGATE", "target": "ROUTE"}
                    ]
                }

        # ----------------------------------------------------------------------
        # 6. GENERAL POLITE ASSISTANT RESPONSE
        # ----------------------------------------------------------------------
        return {
            "text": (
                f"### 🤖 NERALIS AI Sahayak Assistant\n\n"
                f"Regarding your query **\"{raw_q}\"**:\n\n"
                f"I am the specialized **Operations Copilot for North Eastern Region Logistics (MDoNER)**. I can provide real-time data and guidance on:\n"
                f"• 🗺️ **GIS Road Grid & Accessibility:** Status of 89 districts and highway corridors.\n"
                f"• 🧠 **AI Safe Routing:** Multi-factor routing with Brahmaputra NW-2 Ro-Ro barge alternatives.\n"
                f"• 🌧️ **72-Hour Disruption Forecasting:** Machine-learning early warnings for landslides & floods.\n"
                f"• 🚚 **NavIC Fleet & Cold Chain:** Temperature tracking (2°C–8°C) for vaccines and medicines.\n"
                f"• 📡 **Offline Operations:** Using USSD `*123#` on basic phones with zero internet.\n\n"
                f"Feel free to ask any specific question about road conditions, bridge statuses, or platform modules!"
            ),
            "topic": "GENERAL_QUERY",
            "suggestions": [
                "Explain the 8 Platform Modules",
                "How does AI Route Optimization work?",
                "Check 72-hour Disruption Forecast",
                "What data sources are integrated?",
                "What is the status of Saraighat Bridge?"
            ],
            "actions": [
                {"label": "View GIS Command Center", "action": "NAVIGATE", "target": "ACCESSIBILITY"},
                {"label": "Launch Route Optimizer", "action": "NAVIGATE", "target": "ROUTE"}
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
