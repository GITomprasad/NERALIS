<div align="center">

# 🚦 NERALIS

### AI & GIS Smart Logistics Command Center for the North Eastern Region

**AI-powered • GIS-enabled • Risk-aware • Logistics Intelligence • Offline-ready**

<br>

> **See the problem → Understand the risk → Predict disruption → Optimize the route → Track the mission → Alert the right people → Respond**

</div>

---

<div align="center">

### 🟢 LIVE PLATFORM • 🔵 GIS • 🟣 AI/ML • 🟠 LOGISTICS • 🔴 DISASTER RESPONSE

</div>

---

## 🌐 Live Deployment

| Component | Status | Platform |
|---|---|---|
| 🖥️ Frontend | 🟢 Deployed | Render |
| ⚙️ Backend API | 🟢 Deployed | Render |
| 🗺️ GIS Engine | 🟢 Active | Leaflet |
| 🤖 AI/ML | 🟣 Integrated | Python |
| 📡 Fleet Intelligence | 🔵 Integrated | GPS/Telemetry Architecture |
| 📱 Field Reporting | 🟠 Integrated | Offline-ready workflow |

### Frontend

**https://neralis-frontend.onrender.com**

### Backend API

**https://neralis-backend.onrender.com**

> [!NOTE]
> Deployment status and API availability may change. NERALIS also supports demo/fallback data for development and presentation scenarios.

---

# 🎯 Project Purpose

NERALIS is designed to address the unique transportation and logistics challenges of the **North Eastern Region (NER) of India**.

The region faces:

🔴 Difficult and mountainous terrain  
🔴 Heavy rainfall and extreme weather  
🔴 Landslides and floods  
🔴 Road and bridge disruptions  
🔴 Limited connectivity in remote areas  
🔴 Delays in essential-goods transportation  
🔴 Difficulty collecting real-time field information  
🔴 Fragmented logistics and infrastructure information  

NERALIS brings these different information sources together into **one intelligent operational platform**.

### 🚚 Priority Logistics

NERALIS can support monitoring and planning for:

- 💊 Medicines and emergency supplies
- 🍚 Food and essential commodities
- 🌾 Agricultural produce
- 🏗️ Construction materials
- 🚑 Emergency-response logistics
- 📦 Other priority cargo

---

# 🧭 What NERALIS Does

NERALIS combines multiple capabilities into one platform:

| 🧩 Capability | 🎯 Purpose |
|---|---|
| 🗺️ GIS Accessibility Monitoring | Visualize roads, districts, bridges, depots, vehicles and incidents |
| 🧭 Route Optimization | Compare routes using travel time, risk and operational constraints |
| 🚛 Fleet Telemetry | Monitor vehicle movement and trip information |
| 🤖 Disruption Forecasting | Estimate future disruption risk using AI/ML inputs |
| 📱 Field Reporting | Collect geo-tagged ground information and photographs |
| 🚨 Alert Broadcast | Generate and manage operational warnings |
| 📊 Command Analytics | Monitor KPIs, disruptions and corridor performance |
| 📡 Offline Resilience | Support low-network and offline field workflows |
| 🔎 Data Provenance | Show where operational information comes from |
| 🧠 ML Transparency | Expose model metadata and evaluation information |

---

# 🗺️ Core Modules

## 01 — 🗺️ Accessibility Monitor

The **GIS Command Center** is the primary operational view of NERALIS.

It provides a map-based view of:

- 🛣️ Road and corridor status
- 🏙️ District connectivity
- 🌉 Bridges
- 🏢 Depots
- 🚛 Vehicles
- 🚨 Incidents
- 🧭 Selected routes
- 🔀 Route alternatives

### Road Accessibility States

| Status | Meaning |
|---|---|
| 🟢 `OPEN` | Normal accessibility |
| 🟡 `RESTRICTED` | Movement possible with restrictions |
| 🟠 `DEGRADED` | Reduced accessibility / operational concern |
| 🔴 `CLOSED` | Route currently inaccessible |

The map acts as the **central decision-support layer** of NERALIS.

---

# 02 — 🧭 Route Optimizer

The Route Optimizer helps operators select practical routes for logistics missions.

### Inputs

- 📍 Origin
- 📍 Destination
- 📦 Cargo type
- 🚛 Vehicle weight
- 🕐 Departure time
- 🚧 Route constraints
- ⚠️ Hazard/risk information
- 🚢 Optional multimodal/waterway alternatives

### Route Comparison

The system can compare:

| Factor | Purpose |
|---|---|
| 📏 Distance | Total route length |
| ⏱️ Transit Time | Estimated journey duration |
| ⚠️ Risk | Disruption and hazard exposure |
| 🌉 Bridge Status | Infrastructure accessibility |
| 🔀 Alternatives | Backup routes |
| 🕐 Departure Window | Better timing decisions |

> [!IMPORTANT]
> NERALIS is not designed simply to find the shortest route. The objective is to support **safer and operationally suitable logistics decisions**.

---

# 03 — 🚛 Fleet Telemetry

The Fleet module provides vehicle-oriented operational visibility.

### Capabilities

- 📍 Vehicle location
- 📡 GPS / telemetry information
- 🛣️ Trip information
- 🕐 Event timelines
- 🗺️ Vehicle map visualization
- ▶️ Trip playback
- 🔐 QR / checkpoint verification
- 🧪 Telemetry simulation for demonstrations

The production architecture can later ingest real GPS and telematics data from vehicles.

---

# 04 — 🤖 Predictive Intelligence

NERALIS includes an AI/ML layer for transportation disruption intelligence.

### 🧠 Disruption Model

```text
backend/app/ml/disruption_model.py
```

### 🛣️ Road Damage Model

```text
backend/app/ml/damage_classifier.py
```

These components provide the foundation for models using factors such as:

- 🌧️ Weather
- 📚 Historical disruptions
- ⛰️ Terrain
- 🛣️ Road conditions
- 📱 Field reports
- 📸 Damage observations

### Prediction Interface

The system is designed to expose:

- 🔴 Risk level
- 📊 Probability / confidence
- ⚠️ Predicted event
- 🔎 Contributing factors
- 🧭 Recommended action
- 🧠 Model/version information

> [!WARNING]
> Model metrics displayed in the UI should be treated as prototype/evaluation information unless the corresponding dataset, training pipeline and validation process are available and reproducible.

NERALIS therefore separates **AI intelligence** from unsupported claims of real-world accuracy.

---

# 05 — 🚨 Alert Broadcast

The Alert Center is designed for operational response.

### Alert Types

🟢 Advisory  
🟡 Warning  
🔴 Critical  

### Capabilities

- 🚨 Alert creation
- 📢 Alert broadcasting
- ✅ Acknowledgement
- 🌐 Multilingual message previews
- 📡 Broadcast workflows
- 🛣️ High-risk corridor briefings
- 📄 CAP-style emergency messaging

### Potential Channels

- 📱 SMS
- 📞 Voice / IVR
- 💬 WhatsApp Business
- 📡 CAP/XML emergency communication

Actual delivery depends on the configured provider/API.

---

# 06 — 📱 Field Reporting

Field officials can submit ground-level information directly into NERALIS.

### Field Workflow

```text
📍 Location
     ↓
🚧 Incident Classification
     ↓
📸 Photo / Evidence
     ↓
📏 Measurements
     ↓
🔎 Review
     ↓
☁️ Submit / Synchronize
```

### Possible Incidents

- 🌊 Flood
- ⛰️ Landslide
- 🕳️ Pothole
- 🌉 Bridge damage
- 🪨 Road debris
- 🛣️ Road cracking
- ⚠️ Other infrastructure incidents

### Field Capabilities

- 📍 GPS/location capture
- 📸 Photo-based damage classification
- 🎤 Voice-to-text
- 📏 Measurement assistance
- ✍️ Digital signature
- 📡 Offline report queue
- 👮 Human verification

This creates a powerful:

> **Field → Intelligence → Command Center → Response**

feedback loop.

---

# 07 — 📊 Command Analytics

The Analytics module provides a centralized operational view.

### Dashboard Information

- 📈 Accessibility KPIs
- 🚨 Active alerts
- 🚛 Vehicle information
- ⚠️ Disruption logs
- 🛣️ Corridor status
- 🔴 Risk information
- 🏙️ State/district comparisons
- 📋 Operational reports

### Export

- 📄 PDF
- 📊 Excel
- 📑 CSV

The long-term objective is to make every important KPI traceable to the underlying operational data.

---

# 08 — 📡 Offline & Low-Network Resilience

NER includes areas where network availability can be limited.

NERALIS therefore follows an **offline-first design philosophy**.

### Supported Network States

🟢 Online  
🟡 Low 2G  
🔴 Offline  

### Capabilities

- 📥 Offline report queues
- 🔄 Queued / Syncing / Synced / Failed states
- 💾 Cached district data
- 🗺️ Vector-tile / MBTiles concepts
- 🔄 Delta synchronization
- 📡 Low-bandwidth optimization
- 📞 USSD / feature-phone workflows
- 🌐 Multilingual interfaces

> [!IMPORTANT]
> Offline resilience is a key differentiator because NERALIS is designed for **real field conditions**, not only high-speed internet environments.

---

# 🤖 AI + GIS + Logistics Architecture

```text
                         🌐 DATA SOURCES
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
          🌧️ Weather        🗺️ GIS         📱 Field Reports
              │                │                │
              └────────────────┼────────────────┘
                               ▼
                        📦 DATA LAYER
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 ▼                           ▼
             🤖 AI / ML                🧭 ROUTE ENGINE
                 │                           │
                 └─────────────┬─────────────┘
                               ▼
                     🧠 DECISION LAYER
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
           🗺️ GIS            🚛 Fleet          🚨 Alerts
              │                │                │
              └────────────────┼────────────────┘
                               ▼
                    🏛️ COMMAND CENTER
                               │
                               ▼
                       ⚡ ACTION / RESPONSE
                               │
                               ▼
                       📊 ANALYTICS / AUDIT
```

---

# 🔄 End-to-End Operational Workflow

### Example: Heavy Rainfall + Road Risk

```text
🌧️ Heavy rainfall detected
             ↓
🧠 Risk factors evaluated
             ↓
🛣️ Affected corridor identified
             ↓
🗺️ GIS map highlights corridor
             ↓
🤖 Disruption risk estimated
             ↓
🧭 Alternate routes calculated
             ↓
🚛 Affected vehicles identified
             ↓
🚨 Warning prepared
             ↓
📱 Field officer verifies situation
             ↓
📝 Road status updated
             ↓
🔄 Routes recalculated if necessary
             ↓
✅ Incident resolved
             ↓
📊 Event recorded for future analysis
```

This creates a continuous loop between:

**Prediction → Verification → Decision → Response → Learning**

---

# 🔍 Why NERALIS Is Different

Traditional logistics systems often focus mainly on:

- 🚛 Vehicle tracking
- 📦 Shipment tracking
- 🧭 Basic route planning

NERALIS takes a broader approach.

### NERALIS combines:

> 🗺️ **GIS + 🤖 AI/ML + 🧭 Route Optimization + 🚛 Fleet Visibility + 📱 Field Intelligence + 🚨 Alerts + 📡 Offline Support**

Instead of only asking:

> **"Where is my vehicle?"**

NERALIS aims to answer:

> **"Can my vehicle safely reach the destination, what is the current route risk, what could disrupt the journey, what alternative should we use, and who needs to know?"**

---

# ⭐ Key Differentiators

### 🏔️ 1. Region-Specific Design

Designed around NER-specific challenges:

- Mountain terrain
- Heavy rainfall
- Landslides
- Flooding
- Remote connectivity
- Infrastructure disruption

### 🤖 2. Predictive + Operational

Not only current-condition monitoring — NERALIS is designed to support **future-risk assessment**.

### 📱 3. Field-to-Dashboard Intelligence

Ground reports can directly contribute to centralized operational intelligence.

### 🧭 4. Risk-Aware Routing

Route selection can consider more than just distance.

### 📦 5. Essential Logistics Focus

The platform can support priority movement of critical goods.

### 📡 6. Offline Resilience

Remote field operations remain part of the architecture.

### 🔎 7. Explainable Intelligence

The platform is designed to expose:

- Data source
- Timestamp
- Verification state
- Contributing factors
- Model information

instead of presenting AI as a black box.

---

# 🏛️ Who Can Benefit?

| 👤 Stakeholder | 💡 Benefit |
|---|---|
| 🏛️ Government / Ministries | Centralized regional logistics visibility |
| 🚨 Disaster Management Teams | Faster identification of risky corridors |
| 🏙️ District Authorities | Field-to-dashboard incident monitoring |
| 🚚 Logistics Operators | Better route and delay awareness |
| 🚛 Fleet Managers | Vehicle and trip visibility |
| 🚑 Emergency Services | Emergency-route and alert support |
| 🏗️ Infrastructure Teams | Road/bridge incident information |
| 🌾 Agricultural Supply Chains | Better disruption awareness |
| 📦 Essential Goods Suppliers | Priority logistics monitoring |
| 🏘️ Remote Communities | Potentially faster disruption response |

---

# 📊 Expected Benefits

NERALIS is designed to help improve:

| Area | Expected Benefit |
|---|---|
| ⏱️ Time | Faster route selection and incident response |
| 🛡️ Safety | Better awareness of high-risk roads |
| 💰 Cost | Potential reduction in unnecessary delays and detours |
| 📦 Supply Continuity | Better disruption awareness for essential goods |
| 🚨 Emergency Response | Faster identification of critical routes |
| 🚛 Fleet Visibility | Better understanding of vehicle movement |
| 📱 Field Communication | Faster ground-level information collection |
| 🏗️ Infrastructure Planning | Historical data can support future planning |
| 🏛️ Governance | More data-driven operational decisions |

> [!NOTE]
> Real-world impact depends on the quality, freshness, coverage and reliability of connected data sources.

---

# 🧱 Technology Stack

### 🖥️ Frontend

| Technology | Role |
|---|---|
| ⚛️ React | UI framework |
| 🔷 TypeScript | Type-safe development |
| ⚡ Vite | Frontend build tooling |
| 🎨 Tailwind CSS | UI styling |
| 🗺️ Leaflet | Interactive GIS maps |
| 🗺️ React-Leaflet | React GIS integration |

### ⚙️ Backend

| Technology | Role |
|---|---|
| 🐍 Python | Backend + ML |
| ⚡ FastAPI | REST API |
| 📦 Pydantic | Data validation |
| 🔗 REST APIs | Frontend/backend communication |

### 🤖 AI / ML

- Disruption prediction
- Road-damage classification
- Risk intelligence
- Model metadata
- Explainability

### 🗺️ GIS

- Leaflet
- React-Leaflet
- OpenStreetMap-based mapping
- Road layers
- Incident layers
- Vehicle layers
- Route layers

---

# 🏗️ Project Architecture

```text
NERALIS/
│
├── 📁 backend/
│   ├── 📁 app/
│   │   ├── 🤖 ml/
│   │   │   ├── damage_classifier.py
│   │   │   └── disruption_model.py
│   │   │
│   │   └── ...
│   │
│   └── 🧪 tests/
│
├── 📁 frontend/
│   └── 📁 src/
│       ├── 📁 components/
│       │   ├── 📁 common/
│       │   │   ├── DataProvenanceModal.tsx
│       │   │   ├── MLModelMetricsModal.tsx
│       │   │   └── ProvenanceBadge.tsx
│       │   │
│       │   └── ...
│       │
│       ├── 📁 services/
│       │   └── 📁 api/
│       │       └── apiClient.ts
│       │
│       ├── 📁 types/
│       │   └── index.ts
│       │
│       └── ...
│
├── 📄 .gitignore
└── 📄 README.md
```

---

# 🔐 Data Trust & Provenance

NERALIS includes a dedicated provenance concept so that operational information can be associated with:

- 🔎 Source
- 🕐 Timestamp
- ✅ Verification state
- 🤖 Model information
- 📡 Data freshness

Reusable frontend components include:

```text
DataProvenanceModal
ProvenanceBadge
MLModelMetricsModal
```

This is especially important for a government/operational platform because users need to understand:

> **Where did this information come from?**

and

> **How fresh and trustworthy is it?**

---

# 🧪 Testing

Backend tests are maintained under:

```text
backend/tests/
```

Example:

```text
backend/tests/test_all.py
```

Testing areas include:

- API availability
- Route calculations
- ML inference
- Field reporting
- Offline synchronization
- GIS rendering
- Alert workflows
- Invalid/missing data
- Authentication
- Production configuration

---

# ⚙️ Local Development

## 1️⃣ Clone

```bash
git clone https://github.com/GITomprasad/NERALIS.git
cd NERALIS
```

## 2️⃣ Backend

```bash
cd backend
python -m venv venv
```

### Windows

```powershell
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run FastAPI:

```bash
uvicorn app.main:app --reload
```

Backend:

```text
http://localhost:8000
```

API documentation:

```text
http://localhost:8000/docs
```

## 3️⃣ Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🔧 Environment Configuration

Example:

```env
VITE_API_BASE_URL=http://localhost:8000
```

For production, configure the deployed backend URL through your hosting platform's environment variables.

### 🔒 Never commit

```text
.env
.env.*
API keys
Passwords
Tokens
Private credentials
```

---

# 🌐 Production Architecture

```text
                   🌍 INTERNET / USERS
                           │
                           ▼
                 🖥️ NERALIS FRONTEND
                    React + Vite
                           │
                           ▼
                     🔗 REST API
                           │
                           ▼
                    ⚙️ FASTAPI
                       BACKEND
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
        🗺️ GIS           🤖 AI/ML         🚛 Fleet
        Data            Services        Telemetry
          │                │                │
          └────────────────┼────────────────┘
                           ▼
                 🗄️ OPERATIONAL DATA
                           │
                           ▼
                 📊 ANALYTICS + ALERTS
                           │
                           ▼
                     🧾 AUDIT
```

### Future Production Extensions

- PostgreSQL / PostGIS
- Object storage
- Redis / caching
- Background jobs
- Authentication / RBAC
- Monitoring / logging
- Weather APIs
- GPS / telematics providers
- Notification providers

---

# 🛡️ Security & Production

Before production deployment, implement:

- 🔐 Authentication
- 👥 Role-based access control
- 🔑 Secure environment variables
- 🚦 API rate limiting
- ✅ Input validation
- 📁 File-upload validation
- 🧾 Audit logging
- 💾 Database backups
- 📡 Monitoring
- 🔒 HTTPS
- 🚨 Error tracking
- 🔌 Provider/API health checks

---

# 🚧 Current Project Status

NERALIS is an **active prototype / development platform**.

The current implementation demonstrates the integrated product architecture and major operational workflows.

Some capabilities may use:

- 🧪 Demo data
- 🔄 Fallback data
- 🚛 Simulated telemetry
- 🤖 Prototype ML outputs
- 🔌 Conceptual external integrations

These should be clearly labelled during demonstrations.

### Production-readiness priorities

```text
Current Prototype
       ↓
Real Data Sources
       ↓
Persistent Database
       ↓
Real GPS / Telemetry
       ↓
Validated ML Models
       ↓
Notification Providers
       ↓
Authentication + RBAC
       ↓
Production Platform
```

---

# 🗺️ Roadmap

### Phase 1 — 🏗️ Foundation

- Production database
- Authentication / RBAC
- API hardening
- Source registry
- Data validation

### Phase 2 — 🗺️ GIS Intelligence

- PostGIS
- Real road network
- Road-status history
- Weather layers
- Flood/landslide risk layers

### Phase 3 — 🚛 Logistics Intelligence

- Real GPS telemetry
- ETA prediction
- Geofencing
- Essential-goods mission management

### Phase 4 — 🤖 AI/ML

- Versioned datasets
- Reproducible training pipeline
- Disruption prediction
- Road-damage detection
- Model monitoring

### Phase 5 — 📱 Field Operations

- Offline-first PWA
- Durable synchronization
- Conflict resolution
- Photo storage
- Human verification

### Phase 6 — 🚨 Response

- Real notification providers
- Escalation rules
- Alert acknowledgement
- Emergency workflows

### Phase 7 — 🏛️ Governance

- Audit trails
- Decision logs
- Advanced analytics
- Infrastructure planning reports

---

# 🏆 SIH26002 Alignment

NERALIS is designed around the major requirements of the Smart India Hackathon problem:

| SIH Requirement | NERALIS Capability |
|---|---|
| 🛣️ Road accessibility | GIS Accessibility Monitor |
| 🤖 Disruption prediction | Predictive Intelligence |
| 🧭 Alternate routes | Route Optimizer |
| 🚛 Vehicle tracking | Fleet Telemetry |
| 🚨 Automated alerts | Alert Broadcast |
| 📍 Geo-tagged reporting | Field Reporting |
| 📊 Centralized dashboards | Command Analytics |
| 🚑 Emergency routes | Route + Risk Intelligence |
| 🌐 Multilingual notifications | Alert/Field architecture |
| 📡 Offline support | Offline Resilience |
| 🌧️ Weather integration | Weather-aware intelligence architecture |
| ☁️ Cloud-ready platform | Frontend + FastAPI deployment |

---

# 💡 The Core Idea

NERALIS is **not just a:**

❌ Map  
❌ GPS tracker  
❌ Route planner  
❌ Weather dashboard  
❌ Alert system  
❌ AI model  

It is the combination of all of them into a **single logistics intelligence workflow**.

```text
       👁️ OBSERVE
            ↓
       🔎 UNDERSTAND
            ↓
       🤖 PREDICT
            ↓
       🧭 OPTIMIZE
            ↓
       🚛 TRACK
            ↓
       🚨 ALERT
            ↓
       ⚡ RESPOND
            ↓
       📊 LEARN
```

---

<div align="center">

# 🚦 NERALIS

### AI & GIS Smart Logistics Command Center

**For a safer, smarter and more connected North Eastern Region**

<br>

### 🏆 Smart India Hackathon 2026

**SIH26002**

</div>

---

## 📜 Disclaimer

NERALIS is a prototype/development project intended to demonstrate an integrated approach to logistics accessibility intelligence.

Operational decisions should be based on verified data and authorized personnel.

AI-generated predictions and route recommendations should be treated as **decision-support information** and validated against current field conditions before critical deployment.
