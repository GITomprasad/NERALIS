# NERALIS

## AI & GIS Smart Logistics Command Center for the North Eastern Region

NERALIS is an AI-powered, GIS-enabled smart logistics and accessibility intelligence platform designed for the North Eastern Region (NER) of India.

It brings **road accessibility, disruption intelligence, route optimization, fleet visibility, field reporting, alerts, analytics, and offline resilience** into one operational platform.

The goal is simple:

> **See the problem → understand the risk → predict disruption → choose a better route → monitor the mission → alert the right people → record the outcome.**

---

## 🚀 Live Deployment

### Frontend

https://neralis-frontend.onrender.com

### Backend API

https://neralis-backend.onrender.com

> Deployment status and API availability can change. The application also supports demo/fallback data for development and presentation scenarios.

---

## 🎯 Purpose

NER faces unique logistics challenges because of:

- Difficult and mountainous terrain
- Heavy rainfall and extreme weather
- Landslides and floods
- Road and bridge disruptions
- Limited connectivity in remote areas
- Delays in movement of essential goods
- Difficulty collecting real-time field information
- Fragmented logistics and infrastructure information

NERALIS is designed to provide a **single operational view** of these conditions.

It can support the movement and monitoring of:

- Medicines and emergency supplies
- Food and essential commodities
- Agricultural produce
- Construction materials
- Other priority logistics missions

---

# 🧭 What NERALIS Does

NERALIS combines multiple operational capabilities into one platform:

| Capability | Purpose |
|---|---|
| GIS Accessibility Monitoring | Visualize roads, districts, bridges, depots, vehicles and incidents |
| Route Optimization | Compare routes using travel, risk and operational constraints |
| Fleet Telemetry | Monitor vehicle movement and trip information |
| Disruption Forecasting | Estimate future disruption risk using AI/ML inputs |
| Field Reporting | Collect geo-tagged ground information and photographs |
| Alert Broadcast | Generate and manage operational warnings |
| Command Analytics | Monitor KPIs, disruptions and corridor performance |
| Offline Resilience | Support low-network/offline field workflows |
| Data Provenance | Show where operational information comes from |
| ML Transparency | Expose model metadata and evaluation information |

---

# 🗺️ Core Modules

## 1. Accessibility Monitor

The GIS command center is the main operational view.

It provides a map-based view of:

- Road/corridor status
- District connectivity
- Bridges
- Depots
- Vehicles
- Incidents
- Selected routes
- Route alternatives

Road conditions can be represented using operational states such as:

- `OPEN`
- `RESTRICTED`
- `DEGRADED`
- `CLOSED`

The map is designed to become the central decision-support layer of NERALIS.

---

## 2. Route Optimizer

The Route Optimizer helps operators select practical routes for logistics missions.

Inputs can include:

- Origin
- Destination
- Cargo type
- Vehicle weight
- Departure time
- Route constraints
- Hazard/risk information
- Optional multimodal/waterway alternatives

The system can compare:

- Distance
- Transit time
- Hazard/risk
- Bridge verification
- Route alternatives
- Recommended departure windows

The objective is not simply to find the shortest route, but to support **safer and operationally suitable logistics decisions**.

---

## 3. Fleet Telemetry

The fleet module provides vehicle-oriented operational visibility.

It supports concepts such as:

- Vehicle location
- GPS/telemetry information
- Trip details
- Event timelines
- Vehicle map visualization
- Trip playback
- QR/checkpoint verification
- Telemetry simulation for demonstrations

The production architecture can later ingest real GPS/telematics data from vehicles.

---

## 4. Predictive Intelligence

NERALIS includes a predictive intelligence layer for transportation disruption.

The current project contains ML components for:

### Disruption intelligence

`backend/app/ml/disruption_model.py`

### Road damage intelligence

`backend/app/ml/damage_classifier.py`

These components provide the foundation for models that can use factors such as:

- Weather
- Historical disruptions
- Terrain
- Road conditions
- Field reports
- Damage observations

The prediction interface is designed to expose:

- Risk level
- Probability/confidence
- Predicted event
- Contributing factors
- Recommended action
- Model/version information

### Important

Model metrics shown in the UI should be treated as **prototype/evaluation information unless the corresponding dataset, training pipeline and validation process are available and reproducible**.

NERALIS intentionally separates model information from unsupported claims of real-world accuracy.

---

## 5. Alert Broadcast

The Alert Center is designed for operational response.

It supports concepts such as:

- Advisory alerts
- Warning alerts
- Critical alerts
- Alert acknowledgement
- Manual alert creation
- Multilingual message previews
- CAP-style emergency messaging
- Broadcast workflows
- High-risk corridor briefings

Potential notification channels include:

- SMS
- Voice/IVR
- WhatsApp Business
- CAP/XML-based emergency communication

Actual delivery depends on the configured provider/API.

---

## 6. Field Reporting

Field officials can provide ground-level information to the platform.

The field workflow is designed around:

1. Location
2. Incident classification
3. Photo/evidence
4. Measurements
5. Review
6. Submission/synchronization

Possible incident types include:

- Flood
- Landslide
- Pothole
- Bridge damage
- Road debris
- Road cracking
- Other infrastructure incidents

The system also includes concepts for:

- GPS/location capture
- Photo-based damage classification
- Voice-to-text
- Measurement assistance
- Digital signature
- Offline report queue
- Human verification

This creates a **field-to-command-center feedback loop**.

---

## 7. Command Analytics

The analytics module provides a centralized operational view.

It can include:

- Accessibility KPIs
- Active alerts
- Vehicle information
- Disruption logs
- Corridor status
- Risk information
- State/district comparisons
- Operational reports

Export workflows include:

- CSV
- Excel
- PDF/report generation

The long-term goal is to make every KPI traceable to the underlying operational data.

---

## 8. Offline & Low-Network Resilience

NER has areas where network availability can be limited.

NERALIS therefore includes an offline-first design concept.

Supported states include:

- Online
- Low 2G
- Offline

The project includes concepts for:

- Offline report queues
- Queued/syncing/synced/failed states
- Cached district data
- Vector-tile/MBTiles concepts
- Delta synchronization
- Low-bandwidth optimization
- USSD/feature-phone workflows
- Multilingual interfaces

This is an important differentiator because the platform is designed for **real field conditions**, not only high-speed internet environments.

---

# 🤖 AI + GIS + Logistics Architecture

```text
             DATA SOURCES
                  │
       ┌──────────┼──────────┐
       │          │          │
    Weather      GIS       Field
       │          │         Reports
       │          │          │
       └──────────┼──────────┘
                  │
             Data Layer
                  │
        ┌─────────┴─────────┐
        │                   │
     AI / ML            Route Engine
        │                   │
        └─────────┬─────────┘
                  │
           Decision Layer
                  │
       ┌──────────┼──────────┐
       │          │          │
      GIS       Fleet      Alerts
       │          │          │
       └──────────┼──────────┘
                  │
          Command Center
                  │
        Action / Response
                  │
          Analytics / Audit
