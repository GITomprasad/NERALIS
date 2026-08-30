# 🛰️ NERALIS

## AI & GIS Smart Logistics Command Center for the North Eastern Region of India

<p align="center">

![NERALIS](https://img.shields.io/badge/NERALIS-AI%20%26%20GIS%20Logistics-163A5F?style=for-the-badge)
![SIH 2026](https://img.shields.io/badge/SIH-2026-orange?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-GIS-199900?style=for-the-badge&logo=leaflet&logoColor=white)
![NetworkX](https://img.shields.io/badge/NetworkX-Routing-orange?style=for-the-badge)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

</p>

<p align="center">

### See the problem → Understand the risk → Predict disruption → Optimize the route → Act → Verify

</p>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Our Solution](#-our-solution)
- [Core Objective](#-core-objective)
- [Platform Modules](#-platform-modules)
- [System Architecture](#-system-architecture)
- [Data Flow](#-data-flow)
- [GIS Command Center](#-gis-command-center)
- [AI Route Optimizer](#-ai-route-optimizer)
- [Predictive Disruption Intelligence](#-predictive-disruption-intelligence)
- [Fleet Tracking](#-fleet--vehicle-tracking)
- [Multilingual Alerts](#-multilingual-emergency-alerts)
- [Field Reporting](#-field-reporting)
- [Offline Resilience](#-offline--resilience)
- [Analytics](#-central-analytics)
- [Reporting](#-executive--parliamentary-reporting)
- [Data Provenance](#-data-provenance)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [API Architecture](#-api-architecture)
- [Installation](#-installation)
- [Running Locally](#-running-locally)
- [Environment Configuration](#-environment-configuration)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Security](#-security)
- [Current Limitations](#-current-limitations)
- [Future Roadmap](#-future-roadmap)
- [Expected Impact](#-expected-impact)
- [Git Workflow](#-git-workflow)
- [Contributing](#-contributing)
- [Disclaimer](#-disclaimer)
- [Vision](#-vision)

---

# 🌐 Overview

**NERALIS** is an AI-assisted, GIS-enabled smart logistics and accessibility intelligence platform designed for the **North Eastern Region of India**.

The platform brings multiple operational capabilities into one command center:

- 🗺️ Regional GIS accessibility monitoring
- 🚚 Fleet and vehicle telemetry
- 🛣️ Multi-objective route optimization
- 🌧️ Disruption forecasting
- 🚨 Multilingual emergency alerts
- 📱 Field reporting
- 📡 Offline-first synchronization
- 📊 Logistics and governance analytics
- 🧾 Executive and parliamentary reporting
- 🔎 Data provenance and audit tracing

NERALIS is designed around a simple operational philosophy:

> **See the problem → Understand the risk → Predict disruption → Optimize the route → Act → Verify**

Instead of managing transportation, infrastructure, disaster intelligence, fleet information, alerts, and field reports through disconnected systems, NERALIS brings them together into a unified operational interface.

---

# 🎯 Problem Statement

The North Eastern Region of India has unique transportation and logistics challenges caused by:

- Mountainous terrain
- Heavy rainfall
- Landslides
- Flooding
- Road degradation
- Bridge vulnerabilities
- Remote locations
- Limited network connectivity
- Long transportation corridors
- Infrastructure disruptions

A route that is shortest in distance may not always be the safest or most reliable route.

For example:

```text
Heavy Rainfall
      ↓
Flood Risk
      ↓
Road Degradation
      ↓
Travel Delay
      ↓
Logistics Disruption
      ↓
Route Diversion
```

Similarly:

```text
Bridge Damage
      ↓
Corridor Restriction
      ↓
Vehicle Diversion
      ↓
Increased Travel Time
      ↓
Supply Delay
```

Operational teams therefore need more than a simple map.

They need to know:

> **What is happening? Where is it happening? What could happen next? Which route is safer? What action should be taken?**

NERALIS is designed to provide this decision-support capability.

---

# 💡 Our Solution

NERALIS combines multiple intelligence layers:

```text
🗺️ GIS
   +
🌧️ Weather Intelligence
   +
🌊 Hydrological Risk
   +
🛣️ Road & Infrastructure Status
   +
🚚 Fleet Telemetry
   +
🧠 Predictive Intelligence
   +
🛣️ Route Optimization
   +
🚨 Emergency Alerts
   +
📱 Field Reporting
   +
📡 Offline Resilience
   +
📊 Analytics
   +
🧾 Governance Reporting
```

These capabilities are connected through a common backend and frontend command center.

---

# 🎯 Core Objective

NERALIS follows an operational intelligence loop:

```text
OBSERVE
   ↓
UNDERSTAND
   ↓
PREDICT
   ↓
OPTIMIZE
   ↓
ACT
   ↓
VERIFY
   ↓
LEARN
```

### OBSERVE

Monitor:

- Roads
- Corridors
- Bridges
- Vehicles
- Districts
- Weather-related indicators
- Field reports
- Alerts

### UNDERSTAND

Combine operational information to determine the current condition of an area or corridor.

### PREDICT

Estimate possible disruptions and risk levels.

### OPTIMIZE

Find safer and more suitable routes.

### ACT

Dispatch alerts, reroute vehicles, and coordinate field operations.

### VERIFY

Use field reports and updated data to verify the real-world condition.

### LEARN

Store historical information and operational outcomes for future analysis.

---

# 🧩 Platform Modules

NERALIS contains several interconnected modules.

```text
┌───────────────────────────────────────────────────┐
│                  NERALIS                         │
│        AI & GIS LOGISTICS COMMAND CENTER         │
├───────────────────────────────────────────────────┤
│                                                   │
│ 🗺️ Accessibility Monitoring                      │
│ 🧠 AI Route Optimizer                            │
│ 🚚 Vehicle & Fleet Tracking                      │
│ 🌧️ Predictive Disruption Intelligence           │
│ 🚨 Multilingual Alert Center                     │
│ 📱 Field Reporting                               │
│ 📊 Central Analytics                             │
│ 📡 Offline & Resilience                          │
│ 🧾 Executive / Parliamentary Reporting           │
│                                                   │
└───────────────────────────────────────────────────┘
```

---

# 🗺️ GIS Command Center

The GIS Command Center is the primary operational interface.

It provides a map-based view of the North Eastern Region.

The map can display:

- States
- Districts
- Roads
- Corridors
- Bridges
- Infrastructure
- Disruption areas
- Fleet information
- Alerts
- Risk indicators

The map provides geographical context for operational decisions.

---

## 🛣️ Road Accessibility Status

NERALIS uses different accessibility states:

```text
🟢 OPEN
Normal movement is possible.

🟡 RESTRICTED
Movement is possible with restrictions.

🟠 DEGRADED
Road condition is significantly affected.

🔴 CLOSED
Movement is currently not possible.
```

---

# 🧠 AI Route Optimizer

The AI Route Optimizer evaluates routes using multiple operational factors.

A conventional shortest-path system may focus primarily on distance.

NERALIS can consider:

- Distance
- Travel time
- Road accessibility
- Road condition
- Risk
- Infrastructure condition
- Hazard penalties
- Vehicle characteristics

Conceptually:

```text
Route Cost =
Distance
+
Travel Time
+
Risk Penalty
+
Road Condition Penalty
+
Infrastructure Penalty
+
Hazard Penalty
```

The objective is:

> **Find an operationally suitable route considering current risk and accessibility.**

---

# 🛣️ Route Optimization Workflow

```text
Origin
   ↓
Destination
   ↓
Vehicle Information
   ↓
Cargo Information
   ↓
Departure Time
   ↓
Build Transportation Graph
   ↓
Evaluate Road Conditions
   ↓
Evaluate Risk
   ↓
Calculate Route Costs
   ↓
Generate Alternatives
   ↓
Recommend Route
```

---

# 🚚 Vehicle-Aware Routing

Different vehicles may require different routes.

For example:

```text
Heavy Vehicle
      ↓
Bridge Capacity
      ↓
Road Restriction
      ↓
Terrain
      ↓
Road Condition
      ↓
Route Suitability
```

This allows route planning to consider operational vehicle constraints.

---

# 🌧️ Predictive Disruption Intelligence

The predictive intelligence layer is designed to estimate potential transportation disruptions.

Possible contributing factors include:

```text
Rainfall
24-Hour Rainfall
72-Hour Rainfall
Soil Moisture
Slope
Terrain
Historical Incidents
Road Condition
Bridge Condition
Flood Risk
Traffic Slowdown
```

These factors can contribute to a disruption-risk assessment.

---

# 📈 72-Hour Disruption Forecast

NERALIS provides a 72-hour operational forecasting concept.

```text
CURRENT
   │
   ├── 0–24 HOURS
   │
   ├── 24–48 HOURS
   │
   └── 48–72 HOURS
```

This can support:

- Logistics planning
- Route preparation
- Resource pre-positioning
- Emergency preparedness
- Corridor monitoring
- Risk assessment

---

# 🧪 Explainable Risk

The system is designed to provide more context than simply displaying:

```text
HIGH RISK
```

An operational explanation can include:

```text
Risk Level: HIGH

Contributing Factors:

🌧️ Heavy rainfall
🌊 Elevated flood risk
⛰️ High slope
🛣️ Degraded road
🌉 Infrastructure vulnerability
📊 Historical incident concentration
```

This helps operators understand why a corridor may be considered risky.

---

# 🚚 Fleet & Vehicle Tracking

The Fleet module provides operational visibility of vehicles.

Possible vehicle information includes:

- Vehicle ID
- Vehicle type
- Location
- Speed
- Heading
- Network status
- Current route
- Operational status
- Historical movement

---

# 📡 Fleet Data Flow

```text
GPS / Vehicle Telemetry
          ↓
Telemetry API
          ↓
Backend Processing
          ↓
Database
          ↓
Fleet Dashboard
          ↓
Operator
```

Example API endpoints:

```http
GET /api/v1/fleet/vehicles
GET /api/v1/fleet/playback/{vehicle_id}
POST /api/v1/telemetry/ingest
```

---

# 🚨 Multilingual Emergency Alerts

The Alert Center is designed for emergency and operational communication.

Features include:

- Alert creation
- Severity classification
- Affected areas
- Alert verification
- Dispatch workflow
- Alert acknowledgement
- Alert history
- CAP-style structured alert generation
- Morning briefing

---

# 📢 Alert Workflow

```text
Hazard Detection
       ↓
Risk Assessment
       ↓
Affected Area Identification
       ↓
Alert Creation
       ↓
Operator Verification
       ↓
Alert Dispatch
       ↓
Acknowledgement
       ↓
Audit Trail
```

---

# 📡 CAP Support

The platform contains an alert workflow capable of producing structured CAP-style information.

Example:

```http
GET /api/v1/alerts/{alert_id}/cap-xml
```

This can support future integration with standardized emergency communication systems.

---

# 📱 Field Reporting

The Field Reporting module allows field personnel to report infrastructure and operational incidents.

A report can contain:

```text
Reporter
Role
State
District
Location
GPS Coordinates
Incident Type
Severity
Damage Information
Evidence
Timestamp
Client Event ID
```

---

# 📲 Field Reporting Workflow

```text
Field Officer
      ↓
Incident Detected
      ↓
Location Captured
      ↓
Damage Recorded
      ↓
Evidence Added
      ↓
Report Created
      ↓
Offline Queue / API
      ↓
Backend
      ↓
Command Center
```

---

# 📡 Offline & Resilience

Connectivity is a major challenge in remote areas.

NERALIS follows an offline-first architecture.

When connectivity is unavailable:

```text
User Action
     ↓
Local Storage
     ↓
Offline Outbox
     ↓
Network Restored
     ↓
Synchronization
     ↓
Backend
```

The frontend includes an offline service architecture for handling local data and synchronization.

---

# 🔄 Offline Synchronization

```text
                 USER ACTION
                      │
                      ▼
             Network Available?
                /          \
              YES           NO
               │             │
               ▼             ▼
           Backend       IndexedDB
               │             │
               │        Outbox Queue
               │             │
               │             ▼
               │      Network Restored
               │             │
               └──────┬──────┘
                      ▼
                Synchronization
                      │
                      ▼
                   Backend
```

---

# 🌐 Network State

The interface can represent different connectivity states:

```text
🟢 5G
🟢 4G
🟡 2G
⚫ Offline
```

---

# 📊 Central Analytics

The analytics layer combines operational information.

It can bring together:

```text
Fleet
+
Infrastructure
+
Disruptions
+
Alerts
+
Field Reports
+
Accessibility
```

Possible dashboard indicators include:

- Active alerts
- Open corridors
- Restricted corridors
- Degraded corridors
- Closed corridors
- Tracked vehicles
- Fleet connectivity
- Pending field reports
- Risk levels
- District coverage

---

# 🧾 Executive & Parliamentary Reporting

NERALIS includes reporting capabilities intended for higher-level decision making.

Reports can contain:

- Operational indicators
- Infrastructure information
- Logistics information
- Disaster-response information
- State-level comparisons
- Impact summaries
- Audit information

The frontend supports report-generation workflows such as:

```text
PDF
Excel
```

---

# 🔎 Data Provenance

Operational data should be traceable.

NERALIS therefore includes a data-provenance concept.

Records can contain information such as:

```text
Source
Observed At
Verification Status
Confidence
Data Type
Processing Information
```

Example:

```json
{
  "source": "SRC-IMD-AWS",
  "verification_status": "OBSERVED",
  "confidence": 99.2
}
```

This helps operators understand the origin and reliability context of information.

---

# 🧾 Audit Trail

Important operational events can be recorded.

Examples:

```text
Alert Created
Alert Dispatched
Field Report Submitted
Telemetry Ingested
Route Optimized
Infrastructure Updated
Status Changed
```

The objective is to provide traceability for important operational actions.

---

# 🛰️ Data Source Architecture

NERALIS is structured to support multiple data sources.

Conceptually:

```text
                  ┌──────────────┐
                  │     IMD      │
                  └──────┬───────┘
                         │
                  ┌──────▼───────┐
                  │     CWC      │
                  └──────┬───────┘
                         │
                  ┌──────▼───────┐
                  │ ISRO / Bhuvan│
                  └──────┬───────┘
                         │
                  ┌──────▼───────┐
                  │     BRO      │
                  └──────┬───────┘
                         │
                  ┌──────▼───────┐
                  │   State PWD   │
                  └──────┬───────┘
                         │
                  ┌──────▼───────┐
                  │ Field Teams  │
                  └──────┬───────┘
                         │
                         ▼
                ┌──────────────────┐
                │ NERALIS Backend  │
                └──────────────────┘
```

---

# 🏗️ System Architecture

```text
                         NERALIS
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
       ┌──────────────┐            ┌──────────────┐
       │   FRONTEND   │            │   BACKEND    │
       │              │            │              │
       │ React        │            │ FastAPI      │
       │ TypeScript   │◄──────────►│ Python       │
       │ Vite         │   REST     │ SQLAlchemy   │
       │ Leaflet      │   API      │ NetworkX     │
       └──────┬───────┘            └──────┬───────┘
              │                           │
              ▼                           ▼
       ┌──────────────┐            ┌──────────────┐
       │ IndexedDB    │            │   Database   │
       │ Offline Data │            │   SQLite     │
       └──────────────┘            └──────┬───────┘
                                          │
                                          ▼
                                ┌──────────────────┐
                                │ External Sources │
                                └──────────────────┘
```

---

# 🔄 End-to-End Data Flow

```text
External Sources
       ↓
Data Connectors
       ↓
Validation
       ↓
Processing
       ↓
Backend Services
       │
       ├── GIS Services
       ├── Routing Engine
       ├── Prediction Engine
       ├── Fleet Engine
       ├── Alert Engine
       ├── Field Reporting
       └── Reporting
       │
       ↓
Database
       ↓
REST API
       ↓
React Frontend
       ↓
Operator
```

---

# ⚛️ Frontend Architecture

The frontend is built with:

- React
- TypeScript
- Vite
- Tailwind CSS
- Leaflet
- React Leaflet
- Recharts
- IndexedDB

The frontend separates:

```text
UI Components
      ↓
Application Context
      ↓
Services
      ↓
API Client
      ↓
Backend
```

---

# 🐍 Backend Architecture

The backend is built with Python and FastAPI.

Major layers include:

```text
app/
├── api/
├── core/
├── data/
├── db/
├── gis/
├── integrations/
├── ml/
└── services/
```

### API

Handles REST API requests.

### Core

Contains:

- Configuration
- Logging
- Security

### Data

Contains structured operational datasets.

### DB

Contains:

- Database configuration
- SQLAlchemy models
- Seed data

### GIS

Contains geospatial utilities.

### Integrations

Contains external source connectors.

### ML

Contains prediction and classification logic.

### Services

Contains business logic including:

- Routing
- Fleet telemetry
- Alert dispatch
- Disruption forecasting
- Field reporting
- Reporting

---

# 🛠️ Technology Stack

## Frontend

| Technology | Purpose |
|---|---|
| React | User Interface |
| TypeScript | Type Safety |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| Leaflet | GIS Mapping |
| React Leaflet | React GIS Integration |
| Recharts | Data Visualization |
| IndexedDB | Offline Storage |
| jsPDF | PDF Generation |
| XLSX | Excel Generation |
| Lucide React | UI Icons |

## Backend

| Technology | Purpose |
|---|---|
| Python | Backend Language |
| FastAPI | REST API |
| Uvicorn | ASGI Server |
| Pydantic | Data Validation |
| SQLAlchemy | ORM |
| SQLite | Current Database |
| NetworkX | Graph Routing |
| Requests | External API Communication |

---

# 🗂️ Project Structure

```text
NERALIS/
│
├── backend/
│   │
│   ├── app/
│   │   │
│   │   ├── api/
│   │   │   ├── alerts.py
│   │   │   ├── fleet.py
│   │   │   ├── geography.py
│   │   │   ├── health.py
│   │   │   ├── predictions.py
│   │   │   ├── reports.py
│   │   │   ├── routes.py
│   │   │   └── sources.py
│   │   │
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── logging_config.py
│   │   │   └── security.py
│   │   │
│   │   ├── data/
│   │   │   ├── fleet.py
│   │   │   ├── history.py
│   │   │   ├── infrastructure.py
│   │   │   ├── sources.py
│   │   │   └── states.py
│   │   │
│   │   ├── db/
│   │   │   ├── database.py
│   │   │   ├── models.py
│   │   │   └── seed.py
│   │   │
│   │   ├── gis/
│   │   │   └── spatial_utils.py
│   │   │
│   │   ├── integrations/
│   │   │   ├── bhuvan_connector.py
│   │   │   ├── cwc_connector.py
│   │   │   ├── imd_connector.py
│   │   │   └── sachet_connector.py
│   │   │
│   │   ├── ml/
│   │   │   ├── damage_classifier.py
│   │   │   └── disruption_model.py
│   │   │
│   │   ├── services/
│   │   │   ├── alert_dispatcher.py
│   │   │   ├── disruption_forecasting.py
│   │   │   ├── field_reporting.py
│   │   │   ├── fleet_telemetry.py
│   │   │   ├── report_generator.py
│   │   │   └── routing_engine.py
│   │   │
│   │   └── main.py
│   │
│   ├── tests/
│   │   ├── test_alerts.py
│   │   ├── test_api_endpoints.py
│   │   ├── test_disruption_forecast.py
│   │   ├── test_fleet_telemetry.py
│   │   ├── test_geography.py
│   │   └── test_routing.py
│   │
│   ├── requirements.txt
│   └── run.py
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── layout/
│   │   │   ├── map/
│   │   │   ├── modules/
│   │   │   └── reports/
│   │   │
│   │   ├── context/
│   │   ├── services/
│   │   │   ├── api/
│   │   │   ├── data/
│   │   │   └── offline/
│   │   │
│   │   ├── types/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.tsx
│   │
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── .gitignore
└── README.md
```

---

# 🔌 API Architecture

The backend uses a versioned REST API.

Base path:

```text
/api/v1/
```

## ❤️ Health API

```http
GET /api/v1/health
```

## 🗺️ Geography APIs

```http
GET /api/v1/states
GET /api/v1/districts
GET /api/v1/corridors
GET /api/v1/bridges
GET /api/v1/depots
```

## 🔎 Source API

```http
GET /api/v1/sources
```

## 🛣️ Routing API

```http
POST /api/v1/routes/optimize
```

## 🚚 Fleet APIs

```http
GET /api/v1/fleet/vehicles
GET /api/v1/fleet/playback/{vehicle_id}
POST /api/v1/telemetry/ingest
```

## 🌧️ Prediction APIs

```http
GET /api/v1/predictions/forecast
GET /api/v1/predictions/72h
GET /api/v1/predictions/history
GET /api/v1/predictions/model-metrics
GET /api/v1/predictions/prepositioning
POST /api/v1/predictions/digital-twin
```

## 🚨 Alert APIs

```http
GET /api/v1/alerts
POST /api/v1/alerts
POST /api/v1/alerts/{alert_id}/dispatch
GET /api/v1/alerts/{alert_id}/cap-xml
GET /api/v1/alerts/morning-briefing
```

## 📱 Report APIs

```http
GET /api/v1/reports/field
POST /api/v1/reports/field
GET /api/v1/reports/leaderboard
GET /api/v1/reports/parliament
GET /api/v1/reports/state-comparative
GET /api/v1/reports/audit
```

---

# 🚀 Installation

## 1. Clone Repository

```bash
git clone https://github.com/GITomprasad/NERALIS.git
cd NERALIS
```

---

# 🐍 Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

### Windows

```powershell
python -m venv venv
venv\Scripts\activate
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

---

# 🍃 Linux / macOS

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

---

# ▶️ Running Backend

From the backend directory:

```bash
python run.py
```

The backend normally runs at:

```text
http://127.0.0.1:8000
```

FastAPI Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

ReDoc:

```text
http://127.0.0.1:8000/redoc
```

---

# ⚛️ Frontend Setup

Open a second terminal.

From the project root:

```bash
cd frontend
npm install
npm run dev
```

Vite will display the local frontend URL in the terminal.

---

# 🏗️ Frontend Production Build

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

Run linting:

```bash
npm run lint
```

---

# 🔗 Frontend ↔ Backend

The frontend communicates with the FastAPI backend through a centralized API client.

Typical architecture:

```text
React Components
      ↓
Application Context
      ↓
API Services
      ↓
API Client
      ↓
FastAPI
      ↓
Backend Services
      ↓
Database
```

---

# ⚙️ Environment Configuration

Environment variables should be configured separately for local development and deployment.

Typical configuration can include:

```text
API_BASE_URL
DATABASE_URL
SECRET_KEY
CORS_ORIGINS
EXTERNAL_API_KEYS
```

Example:

```env
API_BASE_URL=http://localhost:8000
```

Do not commit secrets or API keys to GitHub.

Use `.env` locally and configure production secrets through the hosting platform.

---

# 💾 Database

The current backend uses:

```text
SQLAlchemy
      ↓
SQLite
      ↓
neralis.db
```

Database-related code is located under:

```text
backend/app/db/
```

Main files:

```text
database.py
models.py
seed.py
```

The database can represent operational entities such as:

- States
- Districts
- Corridors
- Bridges
- Depots
- Vehicles
- Alerts
- Field Reports
- Telemetry
- Historical Events
- Audit Records

---

# 🧪 Testing

NERALIS contains backend test modules for:

```text
Alerts
API Endpoints
Disruption Forecasting
Fleet Telemetry
Geography
Routing
```

Run tests:

```bash
pytest
```

---

# ☁️ Deployment

NERALIS is structured as two independently deployable applications.

```text
                 NERALIS
                    │
          ┌─────────┴─────────┐
          │                   │
          ▼                   ▼
      FRONTEND             BACKEND
     Static Site          Web Service
     React/Vite           FastAPI
```

The frontend can be deployed as a static website.

The backend can be deployed as a Python web service.

---

# 🌍 Deployment Architecture

```text
User Browser
     │
     ▼
NERALIS Frontend
     │
     │ REST API
     ▼
NERALIS Backend
     │
     ├── Routing
     ├── Predictions
     ├── Fleet
     ├── Alerts
     ├── Reports
     └── GIS
     │
     ▼
Database
```

---

# 🏭 Future Production Architecture

For larger-scale production deployment:

```text
                       USERS
                         │
                         ▼
                  ┌──────────────┐
                  │ Load Balancer│
                  └──────┬───────┘
                         │
             ┌───────────┴───────────┐
             │                       │
             ▼                       ▼
       Frontend CDN             API Gateway
                                     │
                                     ▼
                              FastAPI Services
                                     │
              ┌──────────────────────┼─────────────────────┐
              │                      │                     │
              ▼                      ▼                     ▼
        Route Engine            Prediction Engine      Alert Engine
              │                      │                     │
              └──────────────────────┼─────────────────────┘
                                     ▼
                                PostgreSQL
                                  + PostGIS
```

---

# 🔐 Security

Production deployment should include:

- HTTPS
- Authentication
- Role-based access control
- Secure API keys
- CORS configuration
- Input validation
- Rate limiting
- Secret management
- Database credential protection
- Audit logging
- Error monitoring
- Backup strategy

The current project contains a security/configuration layer, while production deployment would require additional security hardening.

---

# 📈 Operational Intelligence Pipeline

```text
Raw Data
   ↓
Data Validation
   ↓
Feature Extraction
   ↓
Risk Analysis
   ↓
Prediction
   ↓
Route Optimization
   ↓
Operator Decision
   ↓
Alert / Action
   ↓
Field Verification
   ↓
Audit / Historical Learning
```

---

# 🔄 Complete Operational Scenario

Example:

```text
Vehicle starts journey
        ↓
Weather conditions deteriorate
        ↓
Rainfall increases
        ↓
Flood risk increases
        ↓
Road condition deteriorates
        ↓
NERALIS detects increased corridor risk
        ↓
Route Optimizer evaluates alternatives
        ↓
Safer alternative identified
        ↓
Operator reviews recommendation
        ↓
Vehicle is redirected
        ↓
Alert issued if required
        ↓
Field team verifies road condition
        ↓
GIS status updated
        ↓
Event recorded in audit trail
```

This represents the central NERALIS workflow:

> **Detect → Understand → Predict → Optimize → Act → Verify**

---

# 🏆 Key Differentiators

## 1. Unified Command Center

NERALIS combines:

```text
GIS
Fleet
Routing
Predictions
Alerts
Reports
Field Operations
Offline Data
```

into one platform.

## 2. Risk-Aware Routing

The platform goes beyond simple shortest-path routing by considering operational risk.

## 3. Predictive + Operational

NERALIS connects prediction directly to action:

```text
Prediction
    ↓
Risk
    ↓
Route
    ↓
Alert
    ↓
Field Verification
```

## 4. Offline-First

The platform is designed to support field operations in areas with unreliable connectivity.

## 5. Data Provenance

Data source and verification information can be retained alongside operational records.

## 6. Governance Support

Operational information can be transformed into structured executive and parliamentary reports.

---

# ⚠️ Current Limitations

NERALIS is an evolving project and prototype.

### Data Availability

Not every external government source necessarily provides a publicly accessible real-time API.

### Model Validation

Prediction models require real-world historical datasets and domain validation before production use.

### Infrastructure Scale

The current SQLite architecture is suitable for development and prototype workloads.

Production scale would benefit from PostgreSQL/PostGIS and distributed infrastructure.

### External Integrations

Some connectors may operate through structured interfaces, fallback data, or simulated responses depending on data availability.

### Operational Certification

NERALIS should not be considered a certified emergency-response system without appropriate government validation, testing, and authorization.

---

# 🚀 Future Roadmap

## Phase 1 — Current Platform

- [x] GIS Command Center
- [x] Regional Map
- [x] District Monitoring
- [x] Corridor Monitoring
- [x] Bridge Monitoring
- [x] Fleet Interface
- [x] Route Optimization
- [x] Disruption Prediction Layer
- [x] Alert Center
- [x] Field Reporting
- [x] Offline Workflow
- [x] Data Provenance
- [x] Audit Logging
- [x] Analytics
- [x] Executive Reporting
- [x] PDF Export
- [x] Excel Export

## Phase 2 — Real Data Integration

- [ ] Real-time government data APIs
- [ ] Weather API integration
- [ ] Hydrological data integration
- [ ] Satellite imagery ingestion
- [ ] Real-time road condition updates
- [ ] Live fleet telemetry
- [ ] Automated data validation
- [ ] Source reliability scoring

## Phase 3 — Advanced AI

- [ ] Real historical disruption dataset
- [ ] Advanced landslide prediction
- [ ] Flood prediction
- [ ] Computer vision road damage detection
- [ ] Bridge damage detection
- [ ] ETA prediction
- [ ] Logistics demand forecasting
- [ ] AI-assisted resource pre-positioning

## Phase 4 — Production Infrastructure

- [ ] PostgreSQL
- [ ] PostGIS
- [ ] Redis
- [ ] Message Queue
- [ ] Real-time telemetry streaming
- [ ] Containerized deployment
- [ ] Kubernetes
- [ ] Role-Based Authentication
- [ ] Centralized Monitoring
- [ ] Automated Backups

## Phase 5 — Field Ecosystem

- [ ] Dedicated Mobile Application
- [ ] Advanced Offline Maps
- [ ] Background GPS Tracking
- [ ] Camera-Based Damage Assessment
- [ ] Voice-Based Reporting
- [ ] Regional-Language Voice Interface
- [ ] Automated Field Synchronization

---

# 🌟 Expected Impact

NERALIS is designed to support improvements in:

```text
🚚 Logistics Visibility
        ↓
🛣️ Route Reliability
        ↓
🚨 Emergency Response
        ↓
🌧️ Disaster Preparedness
        ↓
📡 Field Resilience
        ↓
📊 Decision Making
```

Potential benefits include:

- Faster identification of disruptions
- Better route selection
- Improved fleet visibility
- Earlier risk awareness
- Faster alert generation
- Better field-to-command communication
- Improved data traceability
- More structured governance reporting

Actual impact should be evaluated using real operational data and controlled deployment studies.

---

# 🧪 Example Use Case

### Scenario: Heavy Rainfall Affecting a Logistics Corridor

```text
1. Rainfall increases
          ↓
2. Prediction engine detects increased risk
          ↓
3. GIS identifies affected corridor
          ↓
4. Route engine evaluates alternatives
          ↓
5. Safer route is recommended
          ↓
6. Operator reviews recommendation
          ↓
7. Emergency alert can be dispatched
          ↓
8. Field officer verifies road condition
          ↓
9. Road status is updated
          ↓
10. Event is stored for future analysis
```

---

# 🎨 UI Design Philosophy

NERALIS uses a command-center style interface focused on operational visibility.

The interface emphasizes:

- Map-first visualization
- High information density
- Clear status indicators
- Critical alerts
- Module-based navigation
- Quick access to operational information
- Responsive controls
- Dark command-center aesthetics

The main dashboard is organized around:

```text
Top Navigation
      ↓
Operational KPI Bar
      ↓
Module Navigation
      ↓
GIS Command Center
      ↓
Alerts / Diagnostics
      ↓
Reports / Status
```

---

# 🧭 Design Principles

### 🗺️ Map First

Geospatial context is essential for transportation and disaster response.

### ⚡ Action Oriented

Information should help operators make decisions.

### 🧠 Explainable

Predictions should expose meaningful contributing factors.

### 📡 Resilient

Field operations should continue even with unstable connectivity.

### 🔎 Traceable

Important information should retain source and verification context.

### 📊 Decision Ready

Complex data should be converted into understandable operational information.

---

# 🔄 Git Workflow

After making changes to NERALIS locally:

Check the current status:

```bash
git status
```

Review changes:

```bash
git diff
```

Stage changes:

```bash
git add .
```

Commit:

```bash
git commit -m "Update NERALIS platform"
```

Push:

```bash
git push origin main
```

If GitHub contains changes that are not present locally:

```bash
git pull --rebase origin main
```

Then:

```bash
git push origin main
```

---

# 🤝 Contributing

Contributions are welcome.

Create a feature branch:

```bash
git checkout -b feature/your-feature
```

Make your changes:

```bash
git add .
git commit -m "feat: add your feature"
git push origin feature/your-feature
```

Then open a Pull Request.

---

# 📝 Recommended Commit Convention

```text
feat: add route optimization
feat: add fleet telemetry
feat: add offline synchronization

fix: resolve map rendering issue
fix: correct API integration

docs: improve README
docs: update deployment instructions

refactor: reorganize backend services

test: add routing tests

chore: update dependencies
```

---

# 📚 API Documentation

When the backend is running:

### Swagger UI

```text
http://127.0.0.1:8000/docs
```

### ReDoc

```text
http://127.0.0.1:8000/redoc
```

These interfaces allow developers to inspect and test backend endpoints.

---

# 📊 Project Status

```text
Frontend       ████████████████████░   Active
Backend        ████████████████████░   Active
GIS            ████████████████████░   Active
Routing        ██████████████████░░░   Active
Fleet          ██████████████████░░░   Active
Prediction     ███████████████░░░░░░   Prototype
Alerts         ██████████████████░░░   Active
Field Reports  █████████████████░░░░   Active
Offline Mode   ████████████████░░░░░   Active
Analytics      █████████████████░░░░   Active
Deployment     █████████████████░░░░   Active
```

> Progress indicators are descriptive project-status markers and are not formal completion percentages.

---

# 🔐 Responsible Use

NERALIS is intended as a decision-support platform.

It should not replace:

- Government emergency authorities
- Professional disaster management teams
- Certified engineering inspections
- Official weather warnings
- Official road closure notifications
- Human operational judgment

AI-generated and model-derived information should be verified before high-impact operational decisions.

---

# ⚠️ Disclaimer

NERALIS is an academic/project implementation and an evolving prototype.

Some datasets, scenarios, model outputs, connector responses, metrics, and operational values may be:

- Simulated
- Demonstration data
- Baseline data
- Fallback data
- Prototype outputs

They should not be interpreted as official government information or certified disaster predictions unless independently verified.

Production deployment would require:

- Government data agreements
- Validated datasets
- Real-world model evaluation
- Security audits
- Domain-expert validation
- Disaster-response testing
- Infrastructure scaling
- Operational approval

---

# 🌏 Vision

NERALIS aims to evolve into a regional intelligence platform capable of connecting:

```text
SATELLITE
    +
WEATHER
    +
HYDROLOGY
    +
ROADS
    +
BRIDGES
    +
FLEET
    +
FIELD TEAMS
    +
AI
    +
GIS
    +
EMERGENCY RESPONSE
```

into one operational ecosystem.

The long-term vision is to move from:

> **Reactive logistics**

towards:

> **Predictive, resilient and intelligent logistics.**

---

# 🛰️ NERALIS Philosophy

```text
SEE THE PROBLEM
       ↓
UNDERSTAND THE RISK
       ↓
PREDICT THE DISRUPTION
       ↓
OPTIMIZE THE ROUTE
       ↓
TAKE ACTION
       ↓
VERIFY ON GROUND
       ↓
LEARN FROM THE EVENT
```

---

# 🇮🇳 NERALIS

<p align="center">

### 🛰️ Observe the region.
### 🧠 Understand the risk.
### 🌧️ Predict disruption.
### 🛣️ Optimize the route.
### 🚨 Coordinate the response.
### 📱 Empower the field.
### 🔎 Verify the decision.

</p>

<p align="center">

<strong>AI • GIS • Logistics • Disaster Intelligence • Fleet • Routing • Alerts • Offline Resilience</strong>

</p>

<p align="center">

### Built for intelligent and resilient logistics across the North Eastern Region of India 🇮🇳

</p>

---

## 👨‍💻 Project

**NERALIS — AI & GIS Smart Logistics Command Center**

Developed as a technology project focused on intelligent logistics, infrastructure monitoring, disaster resilience, route optimization, fleet visibility, emergency communication, and operational decision support for the North Eastern Region of India.

---
