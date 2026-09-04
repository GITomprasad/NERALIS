# NERALIS Codebase Maturity Audit Report

> **IMPORTANT NOTICE:** As per instructions, **no source code files or project assets have been modified or altered** during this audit. All files remain in their original state.

This document provides a comprehensive maturity audit of the NERALIS platform across both backend and frontend layers, distinguishing between production-ready modules, those requiring configuration/integration fixes, and those relying on mock data or simulation stubs.

---

## Maturity Dashboard

| Category | Status | Count | Key Highlights |
| :--- | :--- | :---: | :--- |
| 🟢 **Working Fine** | End-to-End Operational | **11** | NetworkX route optimization, ML model integration (predictive risk scoring), geospatial/infrastructure constants, field reporting engine, IndexedDB offline store. |
| 🟡 **Needs Work** | Partial Logic / Gaps | **8** | Unmounted FastAPI route modules, lost `Promise.allSettled` frontend fallback, unused SQLite/PostgreSQL database models & seeder, lack of Google Identity credential wiring. |
| 🔴 **Mock / Placeholder** | Simulated / Stubs | **7** | Rule-based damage classification (no real YOLOv8), dummy external connectors (IMD, ISRO Bhuvan, CWC, SACHET), static prepositioning advisories, static digital twin outcomes. |

---

## Detailed Category Breakdown

### 🟢 WORKING FINE (Operational & Verified)

1. **Geospatial & Infrastructure Registry (Data Layer)**
   - **Files:** [`states.py`](file:///C:/Users/SUBHAM/Desktop/Codes/PROJECTS/NERALIS/backend/app/data/states.py), [`infrastructure.py`](file:///C:/Users/SUBHAM/Desktop/Codes/PROJECTS/NERALIS/backend/app/data/infrastructure.py), [`fleet.py`](file:///C:/Users/SUBHAM/Desktop/Codes/PROJECTS/NERALIS/backend/app/data/fleet.py), [`sources.py`](file:///C:/Users/SUBHAM/Desktop/Codes/PROJECTS/NERALIS/backend/app/data/sources.py), [`history.py`](file:///C:/Users/SUBHAM/Desktop/Codes/PROJECTS/NERALIS/backend/app/data/history.py)
   - **Details:** Contains accurate real-world GIS coordinates, elevation, and terrain attributes for all 8 Northeast Region (NER) states, 40+ districts, 16 key highway corridors, bridges, and supply depots. Real re-export is configured in [`ner_geography.py`](file:///C:/Users/SUBHAM/Desktop/Codes/PROJECTS/NERALIS/backend/app/data/ner_geography.py).
   - **Status:** Complete and working.

2. **AI Multi-Objective Route Optimizer (Module 2)**
   - **File:** [`routing_engine.py`](file:///C:/Users/SUBHAM/Desktop/Codes/PROJECTS/NERALIS/backend/app/services/routing_engine.py)
   - **Details:** Successfully builds a spatial NetworkX graph based on districts and roads. Evaluates multi-criteria routing (Haversine distance, hazard weather factors, bridge weight capacity limits) to compute three distinct route paths: Primary, Weather-Resilient, and Multi-Modal (rail/inland water interop).
   - **Status:** Complete and working.

3. **ML Disruption Predictive Engine (Module 4)**
   - **Files:** [`disruption_model.py`](file:///C:/Users/SUBHAM/Desktop/Codes/PROJECTS/NERALIS/backend/app/ml/disruption_model.py), [`model.pkl`](file:///C:/Users/SUBHAM/Desktop/Codes/PROJECTS/NERALIS/backend/app/ml/model.pkl)
   - **Details:** Operates a real Random Forest classifier (500 estimators) trained on historical landslide inventories (348 NER events) and historical rainfall normals. Exposes authentic classification metrics (balanced accuracy ~52.4%, Macro F1 ~0.556, overall test accuracy ~85.06%).
   - **Status:** Complete and working.

4. **ML Disruption Forecasting Service (Module 4)**
   - **File:** [`disruption_forecasting.py`](file:///C:/Users/SUBHAM/Desktop/Codes/PROJECTS/NERALIS/backend/app/services/disruption_forecasting.py)
   - **Details:** Performs risk predictions dynamically by evaluating real-time inputs against the loaded scikit-learn pipeline, mapping hazards correctly to specific road corridors.
   - **Status:** Complete and working.

5. **Multilingual Alert Dispatcher & NDMA CAP XML Interop (Module 5)**
   - **File:** [`alert_dispatcher.py`](file:///C:/Users/SUBHAM/Desktop/Codes/PROJECTS/NERALIS/backend/app/services/alert_dispatcher.py)
   - **Details:** Dispatches alerts across localized languages (Assamese, Bengali, Bodo, Khasi, Garo, Mizo, Manipuri, Nepali) and generates valid Common Alerting Protocol (CAP XML v1.2) payloads designed for NDMA integration.
   - **Status:** Complete and working.

6. **Field Reporting & Gamification Engine (Module 6)**
   - **File:** [`field_reporting.py`](file:///C:/Users/SUBHAM/Desktop/Codes/PROJECTS/NERALIS/backend/app/services/field_reporting.py)
   - **Details:** Handles field report submissions (potholes, debris, cracks) and updates user leaderboard points to reward proactive reporting.
   - **Status:** Complete and working.

7. **Parliament & Executive Briefing Generator (Module 7)**
   - **File:** [`report_generator.py`](file:///C:/Users/SUBHAM/Desktop/Codes/PROJECTS/NERALIS/backend/app/services/report_generator.py)
   - **Details:** Computes analytics aggregated by state and drafts formal briefings for administrative and legislative review.
   - **Status:** Complete and working.

8. **Security & RBAC Infrastructure**
   - **File:** [`security.py`](file:///C:/Users/SUBHAM/Desktop/Codes/PROJECTS/NERALIS/backend/app/core/security.py)
   - **Details:** Implements salted SHA-256 password hashing, token generation, and role authorization maps (Citizen, State Admin, District Collector, Logistics Operator, Field Inspector).
   - **Status:** Complete and working.

9. **Frontend Offline Client Sync & Outbox (IndexedDB)**
   - **File:** [`offlineStore.ts`](file:///C:/Users/SUBHAM/Desktop/Codes/PROJECTS/NERALIS/frontend/src/services/offline/offlineStore.ts)
   - **Details:** A full offline-first architecture utilizing IndexedDB to store mutations (field reports, alert acknowledgments) locally. Triggers automatic synchronization when connectivity is restored.
   - **Status:** Complete and working.

10. **Frontend API Client & Resilient Fallbacks**
    - **File:** [`apiClient.ts`](file:///C:/Users/SUBHAM/Desktop/Codes/PROJECTS/NERALIS/frontend/src/services/api/apiClient.ts)
    - **Details:** Handles standard operations and encapsulates timeout handlers that query a local 71KB fallback database if the server is unreachable.
    - **Status:** Complete and working.

11. **Fleet In-Memory Telemetry Engine**
    - **File:** [`fleet_telemetry.py`](file:///C:/Users/SUBHAM/Desktop/Codes/PROJECTS/NERALIS/backend/app/services/fleet_telemetry.py)
    - **Details:** Provides spatial vehicle filtering and simulates telemetry ingestion in-memory (updating speeds, coordinates, and routes).
    - **Status:** Working (uses hardcoded initial vehicle objects, but the operational code is real).

---

## 🟡 NEEDS WORK (Wiring Gaps & Configuration Issues)

1. **Lost Frontend Cold-Start Fix (`PlatformContext.tsx`)**
   - **File:** [`PlatformContext.tsx`](file:///C:/Users/SUBHAM/Desktop/Codes/PROJECTS/NERALIS/frontend/src/context/PlatformContext.tsx#L589-L639)
   - **Issue:** The `refreshData` method was reverted to `Promise.all`. If a single micro-service request times out (common on free-tier deployments due to sleep states), the entire frontend state initialization fails, leading to an empty UI.
   - **Remedy:** Needs reinstatement of the `Promise.allSettled` block to handle partial failures gracefully.

2. **Unregistered API Routers in Backend**
   - **File:** [`main.py`](file:///C:/Users/SUBHAM/Desktop/Codes/PROJECTS/NERALIS/backend/app/main.py)
   - **Issue:** All routes are defined inline within `main.py`. The modular API routers located under [`app/api/`](file:///C:/Users/SUBHAM/Desktop/Codes/PROJECTS/NERALIS/backend/app/api) (such as `auth.py`, `alerts.py`, `fleet.py`, etc.) are **never registered** with the main FastAPI app.
   - **Remedy:** Need to add router imports and mount them using `app.include_router()`.

3. **Dead Authentication Endpoints**
   - **File:** [`auth.py`](file:///C:/Users/SUBHAM/Desktop/Codes/PROJECTS/NERALIS/backend/app/api/auth.py)
   - **Issue:** A robust 421-line authentication service exists with endpoints for email signup, signin, token verification, and Google OAuth credentials. However, due to the unregistered routers, all frontend calls to `/api/auth/*` result in `404 Not Found`.
   - **Remedy:** Mount the auth router. Currently, the frontend circumvents this by using mock logins.

4. **Database Persistence Layer Disconnected**
   - **Files:** [`database.py`](file:///C:/Users/SUBHAM/Desktop/Codes/PROJECTS/NERALIS/backend/app/db/database.py), [`models.py`](file:///C:/Users/SUBHAM/Desktop/Codes/PROJECTS/NERALIS/backend/app/db/models.py), [`seed.py`](file:///C:/Users/SUBHAM/Desktop/Codes/PROJECTS/NERALIS/backend/app/db/seed.py)
   - **Issue:** There are 18 SQLAlchemy models defined along with a seeder script. However, the backend never initializes the database or seeds data on startup. Instead, the backend relies completely on static variables stored in memory.
   - **Remedy:** Add database setup to startup events, migrate in-memory variables to query operations using database sessions.

5. **Missing Backend Mutators for Alerts & Corridors**
   - **Files:** [`main.py`](file:///C:/Users/SUBHAM/Desktop/Codes/PROJECTS/NERALIS/backend/app/main.py)
   - **Issue:** The frontend attempts to sync offline mutations (such as changing a corridor's status via `PUT /api/corridors/{id}/status` or acknowledging an alert via `PUT /api/alerts/{id}/ack`), but these endpoints do not exist in the backend.
   - **Remedy:** Add the missing HTTP PUT handlers.

6. **Unused Heavy Assets (Training Data)**
   - **Files:** `Global_Landslide_Catalog_Export_rows.csv` (8.5 MB), `district wise rainfall normal.csv` (69 KB), `rainfall in india 1901-2015.csv` (528 KB)
   - **Issue:** These large CSVs were used exclusively during the model training phase. Because they remain in the runtime directories, they inflate deployment size.
   - **Remedy:** Move them to a separate training repository or ignore them via `.gitignore`.

7. **Partial Frontend Offline Configuration UI**
   - **File:** [`OfflineMultilingual.tsx`](file:///C:/Users/SUBHAM/Desktop/Codes/PROJECTS/NERALIS/frontend/src/components/modules/OfflineMultilingual.tsx)
   - **Issue:** The component renders UI settings for network sync options and local language selections, but there are no backend counterparts for persistent profile preferences.
   - **Remedy:** Low priority; can remain static for administrative client-side state.

8. **Google Identity Credentials Shell**
   - **File:** [`googleAuth.ts`](file:///C:/Users/SUBHAM/Desktop/Codes/PROJECTS/NERALIS/frontend/src/services/googleAuth.ts)
   - **Issue:** Contains authentication hooks for Google login but operates on an empty Client ID configuration.
   - **Remedy:** Require setup of OAuth 2.0 Credentials in Google Cloud Console.

---

## 🔴 MOCK DATA & SIMULATION (Hardcoded / Simulated Stubs)

1. **YOLOv8 Damage Vision Classifier**
   - **File:** [`damage_classifier.py`](file:///C:/Users/SUBHAM/Desktop/Codes/PROJECTS/NERALIS/backend/app/ml/damage_classifier.py)
   - **Reality:** No computer vision weights (YOLOv8 `.pt` or `.onnx` files) are present. The classifier checks the properties of the report metadata (such as crack length or pothole depth) using simple `if/else` rules. It generates a fake inference time (`random.randint(18, 42)`) and ignores the image file/URL.

2. **IMD Weather API Connector**
   - **File:** [`imd_connector.py`](file:///C:/Users/SUBHAM/Desktop/Codes/PROJECTS/NERALIS/backend/app/integrations/imd_connector.py)
   - **Reality:** Points to a fictional government domain endpoint (`api.imd.gov.in/public/v2/weather/ner`). It fails immediately on execution and falls back to a hardcoded response (`rainfall_24h_mm: 52.5`, `soil_moisture_pct: 74.0`). It is not active in any primary route logic.

3. **ISRO Bhuvan Terrain API Connector**
   - **File:** [`bhuvan_connector.py`](file:///C:/Users/SUBHAM/Desktop/Codes/PROJECTS/NERALIS/backend/app/integrations/bhuvan_connector.py)
   - **Reality:** Hardcodes terrain slope metrics based on simple latitude boundary checks (`slope_gradient_deg: 38.0` if lat > 26.5 else `14.0`) rather than executing actual spatial API calls.

4. **CWC Hydro-Telemetry Connector**
   - **File:** [`cwc_connector.py`](file:///C:/Users/SUBHAM/Desktop/Codes/PROJECTS/NERALIS/backend/app/integrations/cwc_connector.py)
   - **Reality:** Returns statically declared water and hazard warning thresholds (`current_water_level_m: 44.1`, `danger_level_m: 49.68`). It is not bound to real sensor networks.

5. **NDMA SACHET Emergency Alert Connector**
   - **File:** [`sachet_connector.py`](file:///C:/Users/SUBHAM/Desktop/Codes/PROJECTS/NERALIS/backend/app/integrations/sachet_connector.py)
   - **Reality:** Contains structures for ETag validation headers, but returns empty lists and contains no functional CAP XML parser.

6. **Prepositioning Advisory Logic**
   - **File:** [`disruption_forecasting.py`](file:///C:/Users/SUBHAM/Desktop/Codes/PROJECTS/NERALIS/backend/app/services/disruption_forecasting.py#L70-L136)
   - **Reality:** The advisory results returned from the forecasting service are loaded from 3 hardcoded static dictionaries. They are not derived from active model prediction scores.

7. **Multi-Layer Digital Twin Simulation**
   - **File:** [`disruption_forecasting.py`](file:///C:/Users/SUBHAM/Desktop/Codes/PROJECTS/NERALIS/backend/app/services/disruption_forecasting.py#L138-L179)
   - **Reality:** Simulates structural damage impact on isolation corridors by outputting predefined text templates for "bridge collapse" and "highway blockade". It does not evaluate dynamic cascades over the NetworkX graph.

---

## Action Plan Recommendations

To transition the NERALIS platform to a fully integrated operational state:

1. **Mount Routers (Priority High):** Mount the modular routers in [`main.py`](file:///C:/Users/SUBHAM/Desktop/Codes/PROJECTS/NERALIS/backend/app/main.py) to enable authentication endpoints and resolve the 404 errors.
2. **Apply Platform Resiliency (Priority High):** Update [`PlatformContext.tsx`](file:///C:/Users/SUBHAM/Desktop/Codes/PROJECTS/NERALIS/frontend/src/context/PlatformContext.tsx) to use `Promise.allSettled` to prevent frontend load failures during cold starts.
3. **Initialize DB (Priority Medium):** Configure FastAPI's startup event handler to execute database seeding via `init_and_seed_db()` so records persist across sessions.
4. **Link Digital Twin (Priority Low):** Connect the digital twin simulation to the routing engine's NetworkX instance to dynamically calculate route disruption impacts rather than rendering static templates.
