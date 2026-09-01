"""
NERALIS AI Assistant Chatbot Engine (NERALIS AI Sahayak).
Powered by Groq High-Performance Cloud LLM Inference with Comprehensive
Grounding in NERALIS Domain Architecture, GIS Data, ML Models, and Telemetry.
"""

from typing import Dict, Any, List, Optional, Tuple
import re
import ast
import operator
import json
import logging
import requests
from datetime import datetime

from app.core.config import settings
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

logger = logging.getLogger(__name__)


# ==============================================================================
# SYSTEM PROMPT FOR GROQ LLM (GROUNDED WITH NERALIS REAL-WORLD TELEMETRY)
# ==============================================================================
NERALIS_SYSTEM_PROMPT = f"""You are NERALIS AI Sahayak (Operations Copilot & Intelligence Assistant), the official AI assistant for the NERALIS platform (North Eastern Region Accessibility & Logistics Intelligence System), governed by the Ministry of Development of North Eastern Region (MDoNER), Government of India.

### 🌐 Platform Core Architecture & Mandate:
- Purpose: AI & GIS Command Center solving mountainous logistics bottlenecks, landslide hazards, flash floods, bridge structural risks, and 2G/offline zones across the 8 North Eastern States of India.
- Coverage: 8 States (Assam, Arunachal Pradesh, Meghalaya, Manipur, Mizoram, Nagaland, Sikkim, Tripura) covering 89 monitored districts.
- Operational Philosophy: "Observe → Understand → Predict → Optimize → Act → Verify → Learn".

### 🧩 8 Core Platform Modules:
1. Module 01: Accessibility Monitoring (GIS Grid) - Real-time status across 89 districts, arterial corridors (OPEN, RESTRICTED, DEGRADED, CLOSED), and bridge sensor telemetry (vibration, water level, pier scour velocity).
2. Module 02: AI Route Optimizer - Multi-objective hazard routing (Distance + Travel Time + Risk Penalty + Bridge Constraints + Hazard Penalties) with Brahmaputra National Waterway 2 (NW-2) Ro-Ro barge combined routes (saving 34% carbon and 22% cost).
3. Module 03: Vehicle & Fleet Tracking - ISRO NavIC satellite dual-link + 4G/2G telemetry, cold-chain temperature surveillance (2.0°C–8.0°C) for vaccines, driver fatigue 30-min hill rest compliance, and GSTN e-Way bills.
4. Module 04: Predictive Disruption Intelligence - Calibrated Ensemble GBDT ML model (98.7% accuracy, 0.999 ROC-AUC, 0.980 F1-score trained on 5,000 verified regional events) forecasting landslides/floods 6 to 72 hours ahead using IMD rainfall, piezometer pore pressure, in-situ soil moisture, Bhuvan DEM slope, and CWC hydrology. Includes Pre-positioning Advisories & Digital Twin stress simulations.

5. Module 05: Multilingual Alert Center - 3-tier severity classification (Critical Red, High Amber, Watch Yellow), NDMA CAP v1.2 XML generation, and 06:00 AM morning operational bulletins.
6. Module 06: Field Reporting PWA - Offline IndexedDB queue, YOLOv8 visual damage AI classification (cracks, potholes, landslides), AR LiDAR measurement, and scout gamification leaderboard.
7. Module 07: Central Analytics - Regional corridor availability uptime, district vulnerability radar, and Parliamentary Starred Question official export (PDF/Excel).
8. Module 08: Offline-First Resilience - 2G low-bandwidth payload (<1.5 KB), local IndexedDB cache, USSD *123# feature phone simulator (zero internet required), and 8 NER languages (Assamese, Bengali, Manipuri, Khasi, Mizo, Nagamese, Nepali) + Hindi + English.

### 📍 Key Geographic & Infrastructure Reference Data:
- Key Bridges: Saraighat Bridge (Guwahati, Brahmaputra), Bogibeel Bridge (Dibrugarh), Bhupen Hazarika Setu (Dhola-Sadiya), Umiam Lake Causeway (Meghalaya), Kolia Bhomora Setu (Tezpur), Naranarayan Setu (Jogighopa).
- Key Corridors: NH-27 (Siliguri to Guwahati East-West Gateway), NH-6 (Guwahati to Shillong), NH-10 (Siliguri to Gangtok Teesta Valley), NH-102 (Imphal to Moreh Asian Highway), NH-29 (Dimapur to Kohima), NH-13 (Trans-Arunachal Highway).
- Data Sources: IMD Automated Weather Stations (99.4% trust), ISRO Bhuvan (99.8% trust), Central Water Commission CWC (99.2% trust), BRO Project Vartak (98.9% trust).

### 🎯 Response Guidelines:
1. When asked math, calculation, or general questions (e.g. "1+2", "what is 470/60", "who are you"): Answer directly, accurately, and politely!
2. When asked about NERALIS, logistics, routes, states, districts, bridges, or disaster preparedness: Provide rich, authoritative, highly structured responses with clean markdown headings, bullet points, and accurate metrics.
3. Tone: Highly intelligent, helpful, professional, and courteous government operations copilot.
4. Support multi-lingual queries (English, Hindi, Assamese, Bengali, etc.).
"""


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
    cleaned = re.sub(r'^(what is|calculate|solve|evaluate|\=|\?)\s*', '', expr_str, flags=re.IGNORECASE).strip()
    cleaned = cleaned.rstrip('?=').strip()
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
        return eval_node(node)
    except Exception:
        return None


class ChatbotEngine:
    def __init__(self):
        self.groq_api_key = settings.GROQ_API_KEY
        self.groq_model = settings.GROQ_MODEL or "openai/gpt-oss-120b"
        self.groq_fallback_models = ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.6-27b"]

    def _clean_query(self, query: str) -> str:
        return re.sub(r'[^\w\s]', ' ', query.lower()).strip()

    def _query_groq_llm(self, query: str, language: str = "en") -> Optional[str]:
        """Queries Groq API with NERALIS RAG groundings."""
        if not self.groq_api_key or self.groq_api_key == "disabled":
            return None

        headers = {
            "Authorization": f"Bearer {self.groq_api_key}",
            "Content-Type": "application/json"
        }

        user_content = query
        if language and language.lower() not in ["en", "english"]:
            user_content = f"Language: {language}\nUser query: {query}\nPlease respond in {language} if appropriate or provide translated guidance."

        payload = {
            "model": self.groq_model,
            "messages": [
                {"role": "system", "content": NERALIS_SYSTEM_PROMPT},
                {"role": "user", "content": user_content}
            ],
            "temperature": 0.2,
            "max_tokens": 1024
        }

        try:
            res = requests.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers=headers,
                json=payload,
                timeout=12
            )
            if res.status_code == 200:
                data = res.json()
                content = data["choices"][0]["message"]["content"]
                return content.strip()
            else:
                logger.warning(f"Groq API returned status {res.status_code}: {res.text}")
                # Try fallback models if primary failed
                for fb_model in self.groq_fallback_models:
                    if fb_model == self.groq_model:
                        continue
                    payload["model"] = fb_model
                    fb_res = requests.post(
                        "https://api.groq.com/openai/v1/chat/completions",
                        headers=headers,
                        json=payload,
                        timeout=10
                    )
                    if fb_res.status_code == 200:
                        return fb_res.json()["choices"][0]["message"]["content"].strip()
        except Exception as e:
            logger.error(f"Groq API call error: {e}")

        return None

    def _infer_actions_and_suggestions(self, query: str, response_text: str) -> Tuple[List[Dict[str, str]], List[str]]:
        """Infers contextual action buttons and suggestion chips based on query and LLM answer."""
        q_lower = query.lower()
        actions: List[Dict[str, str]] = []
        suggestions: List[str] = []

        if any(w in q_lower for w in ["route", "routing", "path", "optimizer", "ro-ro", "waterway", "barge", "navigate"]):
            actions.append({"label": "Launch Route Optimizer", "action": "NAVIGATE", "target": "ROUTE"})
            suggestions.extend(["How does intermodal Ro-Ro barge work?", "How does vehicle weight affect routing?", "What are departure windows?"])
        elif any(w in q_lower for w in ["predict", "forecast", "72h", "landslide", "flood", "digital twin"]):
            actions.append({"label": "Open Disruption Forecast", "action": "NAVIGATE", "target": "PREDICTION"})
            actions.append({"label": "View AI Metrics Modal", "action": "OPEN_MODAL", "target": "MODEL_METRICS"})
            suggestions.extend(["View AI Model Performance Metrics", "What are Pre-positioning Advisories?", "How does Digital Twin work?"])
        elif any(w in q_lower for w in ["alert", "emergency", "cap", "warning", "sos"]):
            actions.append({"label": "Go to Alert Center", "action": "NAVIGATE", "target": "ALERT"})
            suggestions.extend(["View active alerts", "What is NDMA CAP XML format?", "How to acknowledge an alert?"])
        elif any(w in q_lower for w in ["fleet", "truck", "telemetry", "navic", "cold chain", "driver"]):
            actions.append({"label": "Open Fleet Telematics", "action": "NAVIGATE", "target": "FLEET"})
            suggestions.extend(["Show tracked vehicles", "How does cold-chain tracking work?", "View driver rest compliance"])
        elif any(w in q_lower for w in ["offline", "ussd", "2g", "sync", "indexeddb", "no internet"]):
            actions.append({"label": "Open Offline & Resilience", "action": "NAVIGATE", "target": "OFFLINE_RESILIENCE"})
            actions.append({"label": "Launch USSD *123# Phone", "action": "OPEN_MODAL", "target": "USSD"})
            suggestions.extend(["Launch USSD *123# Simulator", "How does IndexedDB outbox work?", "Switch Network Mode"])
        elif any(w in q_lower for w in ["analytics", "report", "parliament", "lok sabha", "export"]):
            actions.append({"label": "Open Analytics Dashboard", "action": "NAVIGATE", "target": "ANALYTICS"})
            actions.append({"label": "Generate Parliament Report", "action": "OPEN_MODAL", "target": "PARLIAMENT"})
            suggestions.extend(["Generate Parliament Starred Question Brief", "View state-wise benchmarks", "District accessibility scores"])
        elif any(w in q_lower for w in ["source", "sources", "provenance", "trust", "bhuvan", "imd", "cwc", "bro"]):
            actions.append({"label": "Open Provenance Modal", "action": "OPEN_MODAL", "target": "PROVENANCE"})
            suggestions.extend(["View Provenance Registry", "How are trust scores calculated?", "What is IMD update frequency?"])
        else:
            actions.append({"label": "Explore GIS Command Center", "action": "NAVIGATE", "target": "ACCESSIBILITY"})
            actions.append({"label": "Launch Route Optimizer", "action": "NAVIGATE", "target": "ROUTE"})
            suggestions.extend(["Explain the 8 Platform Modules", "How does AI Route Optimization work?", "Check 72-hour Disruption Forecast"])

        # Check for specific bridge or district entity mentions
        for b in NER_BRIDGES:
            if b["name"].lower() in q_lower or b["id"].lower() in q_lower:
                actions.insert(0, {"label": f"Inspect {b['name']}", "action": "INSPECT_ENTITY", "entity_type": "BRIDGE", "entity_id": b["id"]})
                break
        for d in NER_DISTRICTS:
            if d["name"].lower() in q_lower or d["id"].lower() in q_lower:
                actions.insert(0, {"label": f"Inspect {d['name']} on Map", "action": "INSPECT_ENTITY", "entity_type": "DISTRICT", "entity_id": d["id"]})
                break

        return actions[:2], suggestions[:4]

    def process_query(self, query: str, language: str = "en") -> Dict[str, Any]:
        """
        Processes query with Groq LLM primary engine + local fallback.
        """
        raw_q = query.strip()

        # ----------------------------------------------------------------------
        # 1. IMMEDIATE ARITHMETIC / MATH CHECK (Direct evaluation)
        # ----------------------------------------------------------------------
        math_result = safe_eval_math(raw_q)
        if math_result is not None:
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

        # ----------------------------------------------------------------------
        # 2. GIBBERISH / NOISE CHECK
        # ----------------------------------------------------------------------
        letters_only = re.sub(r'[^a-zA-Z]', '', raw_q).lower()
        if len(letters_only) >= 5:
            vowels = sum(1 for c in letters_only if c in 'aeiouy')
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
        # 3. GROQ LLM INFERENCE (PRIMARY HIGH-INTELLIGENCE ENGINE)
        # ----------------------------------------------------------------------
        llm_response = self._query_groq_llm(raw_q, language=language)
        if llm_response:
            actions, suggestions = self._infer_actions_and_suggestions(raw_q, llm_response)
            return {
                "text": llm_response,
                "topic": "GROQ_AI_RESPONSE",
                "suggestions": suggestions,
                "actions": actions
            }

        # ----------------------------------------------------------------------
        # 4. DETERMINISTIC LOCAL FALLBACK (If Groq offline / network unavailable)
        # ----------------------------------------------------------------------
        clean_q = self._clean_query(raw_q)
        tokens = set(clean_q.split())

        # Greeting check
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

        # Courtesy & Gratitude
        if re.search(r'^\s*(thank\s*you|thanks|thx|great|awesome|good\s+job)\s*$', raw_q, re.IGNORECASE):
            return {
                "text": "🙏 **You're very welcome!**\n\nI am here 24/7 to assist with disaster relief logistics, road accessibility intelligence, and route safety in the North Eastern Region. Feel free to ask whenever you need operational updates.",
                "topic": "COURTESY",
                "suggestions": ["View active alerts", "Calculate safe route", "Open GIS Command Center"],
                "actions": [{"label": "Open GIS Map", "action": "NAVIGATE", "target": "ACCESSIBILITY"}]
            }

        # Default Local Synthesis
        actions, suggestions = self._infer_actions_and_suggestions(raw_q, "")
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
            "suggestions": suggestions,
            "actions": actions
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
