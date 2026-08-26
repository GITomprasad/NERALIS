# NERALIS

### AI & GIS Smart Logistics Command Center for the North Eastern Region

> **NERALIS** is an AI-powered, GIS-enabled smart logistics and disaster-resilience platform designed to support transportation, emergency response, infrastructure monitoring, fleet management, and administrative decision-making across the North Eastern Region of India.

[![Live Frontend](https://img.shields.io/badge/Live-Demo-2ea44f?style=for-the-badge)](https://neralis-frontend.onrender.com)
[![Backend](https://img.shields.io/badge/API-FastAPI-009688?style=for-the-badge)](https://neralis-backend.onrender.com)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Backend](https://img.shields.io/badge/Backend-Python%20%2B%20FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![GIS](https://img.shields.io/badge/GIS-Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Deployment](https://img.shields.io/badge/Deployed-Render-46E3B7?style=for-the-badge)](https://render.com/)

---

## 🌐 Live Demo

### Frontend
**https://neralis-frontend.onrender.com**

### Backend API
**https://neralis-backend.onrender.com**

---

## 📌 Overview

The North Eastern Region faces unique logistical and disaster-management challenges due to mountainous terrain, landslides, floods, remote locations, infrastructure constraints, and limited connectivity.

NERALIS provides a unified command-center interface that brings together GIS intelligence, route optimization, disaster prediction, fleet monitoring, infrastructure telemetry, alerts, field reporting, analytics, and administrative reporting.

The platform is designed around the principle of:

> **Observe → Predict → Decide → Respond → Report**

---

## 🎯 Objectives

- Improve accessibility and logistics planning across the North Eastern Region.
- Provide a unified GIS-based operational dashboard.
- Support intelligent route optimization.
- Predict potential disruptions and disaster risks.
- Monitor vehicles and fleet operations.
- Integrate infrastructure and IoT telemetry.
- Provide multilingual alerts for field-level communication.
- Support offline-first field reporting.
- Generate decision-support reports for administrators.
- Improve emergency response and resource allocation.

---

## ✨ Key Features

### 🗺️ GIS Grid Command Center

A centralized GIS dashboard for monitoring districts, roads, corridors, bridges, and operational conditions.

**Capabilities:**

- Interactive GIS map
- District-level monitoring
- State filtering
- Road accessibility visualization
- Critical corridor diagnostics
- Infrastructure monitoring
- Map expansion and navigation
- OpenStreetMap-based visualization

---

### 🤖 AI Route Optimizer

Intelligent route planning designed for logistics and emergency response.

**Planned capabilities:**

- Route optimization
- Road accessibility consideration
- Restricted/degraded/closed route handling
- Alternative route suggestions
- Logistics-aware routing
- Emergency route planning

---

### 🌧️ Predictive Disaster Intelligence

A predictive intelligence layer for identifying potential disruptions.

**Target capabilities:**

- 72-hour disruption prediction
- Disaster-risk assessment
- Landslide/flood-related risk indicators
- Critical corridor risk monitoring
- Early-warning support
- Predictive operational recommendations

---

### 🚚 Vehicle & Fleet Tracking

A fleet-management module for monitoring operational vehicles.

**Capabilities:**

- Vehicle tracking
- Fleet status
- GPS-based monitoring
- Route visibility
- Operational status
- Fleet analytics
- Navigation support

---

### 🌉 Bridge & Infrastructure IoT

An infrastructure-monitoring layer designed to integrate telemetry from bridges and other critical infrastructure.

**Target capabilities:**

- Bridge sensor monitoring
- Infrastructure health indicators
- IoT telemetry
- Threshold-based alerts
- Critical infrastructure status
- Historical monitoring

---

### 🚨 Multilingual Alert Center

A centralized alert and emergency communication system.

**Features:**

- Emergency alerts
- Critical corridor warnings
- Multilingual communication
- Priority-based notifications
- State/district targeting
- Field-level communication

---

### 📱 Field Reporting PWA

A Progressive Web App concept for field personnel operating in remote or low-connectivity areas.

**Target capabilities:**

- Field incident reporting
- Offline data capture
- Synchronization when connectivity returns
- Mobile-friendly interface
- Location-aware reports
- Media/evidence attachment support

---

### 📊 Central Analytics Dashboard

A command-level analytics module for operational decision-making.

**Target capabilities:**

- Logistics analytics
- Fleet analytics
- Route performance
- Disaster-risk trends
- Infrastructure status
- District-level insights
- Operational KPIs

---

### 📴 Offline & Resilience Layer

NERALIS is designed with the connectivity challenges of remote regions in mind.

**Target capabilities:**

- Offline-first workflows
- Local data caching
- Delayed synchronization
- Low-bandwidth operation
- Connectivity status
- Data synchronization monitoring

---

### 🏛️ Parliament / MLA Brief

A reporting module designed to convert operational information into concise administrative briefs.

**Target capabilities:**

- Region/state/district summaries
- Infrastructure status
- Critical incidents
- Route accessibility
- Disaster-risk summaries
- Key operational statistics
- Report generation

---

## 🖥️ Platform Dashboard

The current dashboard provides a centralized operational view containing:

- Active Alerts
- Open Corridors
- Tracked Fleet
- Pending Reports
- GIS Map
- District monitoring
- Platform modules
- Critical corridor diagnostics
- Road accessibility status

---

## 🏗️ System Architecture

```text
                         ┌──────────────────────────┐
                         │        NERALIS UI        │
                         │ React + TypeScript + Vite │
                         └────────────┬─────────────┘
                                      │
                                      │ REST API
                                      ▼
                         ┌──────────────────────────┐
                         │       FastAPI Backend     │
                         │       Python Services     │
                         └────────────┬─────────────┘
                                      │
              ┌───────────────────────┼───────────────────────┐
              │                       │                       │
              ▼                       ▼                       ▼
      ┌───────────────┐       ┌───────────────┐       ┌───────────────┐
      │ GIS & Mapping │       │ AI / ML Layer  │       │ IoT / Telemetry│
      └───────────────┘       └───────────────┘       └───────────────┘
              │                       │                       │
              ▼                       ▼                       ▼
        Roads / Districts       Prediction Engine       Fleet / Bridges
        Corridors / Maps        Route Optimization       Infrastructure
              │                       │                       │
              └───────────────────────┼───────────────────────┘
                                      ▼
                         ┌──────────────────────────┐
                         │ Decision Support & Alerts│
                         │ Reports / Analytics / PWA│
                         └──────────────────────────┘
