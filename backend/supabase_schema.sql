-- ==============================================================================
-- NERALIS: SUPABASE POSTGRESQL SCHEMA INITIALIZATION SCRIPT
-- Project: North Eastern Region Accessibility & Logistics Intelligence System
-- Compatible with: Supabase PostgreSQL (PostGIS enabled)
-- ==============================================================================

-- Enable Useful Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. States Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS states (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    capital VARCHAR(100) NOT NULL,
    districts_count INTEGER DEFAULT 0,
    terrain VARCHAR(200),
    area_sqkm DOUBLE PRECISION DEFAULT 0.0,
    avg_annual_rainfall_mm DOUBLE PRECISION DEFAULT 0.0,
    key_lifeline VARCHAR(200),
    vulnerability_score INTEGER DEFAULT 50,
    active_corridors_count INTEGER DEFAULT 0,
    total_depots_count INTEGER DEFAULT 0
);

-- ------------------------------------------------------------------------------
-- 2. Districts Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS districts (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    state_id VARCHAR(10) NOT NULL REFERENCES states(id) ON DELETE CASCADE,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    elevation DOUBLE PRECISION DEFAULT 0.0,
    terrain VARCHAR(100),
    score INTEGER DEFAULT 80,
    status VARCHAR(30) DEFAULT 'OPEN',
    risk_level VARCHAR(30) DEFAULT 'LOW',
    phc_count INTEGER DEFAULT 0,
    critical_stock_pct INTEGER DEFAULT 80,
    rainfall_24h_mm DOUBLE PRECISION DEFAULT 0.0,
    soil_moisture_pct DOUBLE PRECISION DEFAULT 50.0,
    source VARCHAR(100) DEFAULT 'SRC-IMD-AWS',
    observed_at VARCHAR(50),
    verification_status VARCHAR(30) DEFAULT 'OBSERVED',
    confidence DOUBLE PRECISION DEFAULT 98.0
);

-- ------------------------------------------------------------------------------
-- 3. Strategic Road Segments / Corridors
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS road_segments (
    id VARCHAR(30) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    from_district VARCHAR(100) NOT NULL,
    to_district VARCHAR(100) NOT NULL,
    distance_km DOUBLE PRECISION NOT NULL,
    avg_speed_kmh DOUBLE PRECISION DEFAULT 40.0,
    status VARCHAR(30) DEFAULT 'OPEN',
    hazard_type VARCHAR(200) DEFAULT 'None',
    risk_score INTEGER DEFAULT 20,
    clearance_height_m DOUBLE PRECISION DEFAULT 4.5,
    weight_limit_tons DOUBLE PRECISION DEFAULT 40.0,
    bridges_on_route JSONB DEFAULT '[]'::jsonb,
    coordinates JSONB DEFAULT '[]'::jsonb,
    source VARCHAR(100) DEFAULT 'SRC-BRO-VARTAK',
    observed_at VARCHAR(50),
    verification_status VARCHAR(30) DEFAULT 'VERIFIED',
    confidence DOUBLE PRECISION DEFAULT 99.0
);

-- ------------------------------------------------------------------------------
-- 4. Corridor Status Events
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS corridor_status_events (
    id VARCHAR(50) PRIMARY KEY,
    corridor_id VARCHAR(30) NOT NULL REFERENCES road_segments(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL,
    onset_time VARCHAR(50) NOT NULL,
    clearance_time VARCHAR(50),
    reason VARCHAR(255),
    reported_by VARCHAR(100),
    verified_by VARCHAR(100),
    event_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 5. Strategic Bridges & River Crossings
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bridges (
    id VARCHAR(30) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    location VARCHAR(200) NOT NULL,
    river VARCHAR(100) NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    structural_health_pct INTEGER DEFAULT 90,
    strain_microstrain DOUBLE PRECISION DEFAULT 150.0,
    vibration_hz DOUBLE PRECISION DEFAULT 2.0,
    water_clearance_m DOUBLE PRECISION DEFAULT 6.0,
    flood_danger_level_m DOUBLE PRECISION DEFAULT 50.0,
    current_water_level_m DOUBLE PRECISION DEFAULT 40.0,
    cctv_status VARCHAR(100) DEFAULT 'ONLINE',
    status VARCHAR(50) DEFAULT 'HEALTHY',
    load_capacity_tons DOUBLE PRECISION DEFAULT 40.0,
    sensor_last_ping VARCHAR(50),
    sensor_status VARCHAR(30) DEFAULT 'LIVE',
    scour_depth_m DOUBLE PRECISION DEFAULT 1.0,
    source VARCHAR(100) DEFAULT 'SRC-CWC-GAUGES',
    observed_at VARCHAR(50),
    verification_status VARCHAR(30) DEFAULT 'OBSERVED'
);

-- ------------------------------------------------------------------------------
-- 6. Essential Relief Supply Depots & Hubs
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS supply_depots (
    id VARCHAR(30) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    location VARCHAR(200) NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    type VARCHAR(100) DEFAULT 'Primary Hub',
    capacity_metric_tons DOUBLE PRECISION DEFAULT 20000.0,
    current_stock_tons DOUBLE PRECISION DEFAULT 15000.0,
    critical_vaccine_units INTEGER DEFAULT 50000,
    pds_grain_tons DOUBLE PRECISION DEFAULT 10000.0,
    fuel_reserve_kl DOUBLE PRECISION DEFAULT 4000.0,
    waterway_berth VARCHAR(100) DEFAULT 'None',
    servicing_states JSONB DEFAULT '[]'::jsonb,
    source VARCHAR(100) DEFAULT 'SRC-STATE-PWD',
    verification_status VARCHAR(30) DEFAULT 'VERIFIED'
);

-- ------------------------------------------------------------------------------
-- 7. Logistics Fleet Vehicles
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vehicles (
    id VARCHAR(30) PRIMARY KEY,
    plate_number VARCHAR(30) NOT NULL,
    vehicle_type VARCHAR(100) NOT NULL,
    driver_name VARCHAR(100) NOT NULL,
    driver_phone VARCHAR(30) NOT NULL,
    driver_score INTEGER DEFAULT 90,
    current_lat DOUBLE PRECISION NOT NULL,
    current_lng DOUBLE PRECISION NOT NULL,
    heading_deg DOUBLE PRECISION DEFAULT 0.0,
    speed_kmh DOUBLE PRECISION DEFAULT 40.0,
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    cargo_type VARCHAR(50) DEFAULT 'STANDARD_COMMERCIAL',
    cargo_weight_tons DOUBLE PRECISION DEFAULT 10.0,
    e_way_bill_no VARCHAR(50),
    network_mode VARCHAR(50) DEFAULT 'NavIC',
    cold_chain JSONB,
    cold_chain_profile VARCHAR(50) DEFAULT 'STANDARD_VACCINES',
    fuel_monitor JSONB DEFAULT '{}'::jsonb,
    eta_destination VARCHAR(50),
    status VARCHAR(50) DEFAULT 'IN_TRANSIT',
    is_simulated BOOLEAN DEFAULT FALSE,
    source VARCHAR(100) DEFAULT 'SRC-FIELD-PWA',
    observed_at VARCHAR(50),
    verification_status VARCHAR(30) DEFAULT 'OBSERVED',
    confidence DOUBLE PRECISION DEFAULT 99.0
);

-- ------------------------------------------------------------------------------
-- 8. Vehicle Positions Telemetry Log
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vehicle_positions (
    id SERIAL PRIMARY KEY,
    vehicle_id VARCHAR(30) NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    speed_kmh DOUBLE PRECISION DEFAULT 0.0,
    heading_deg DOUBLE PRECISION DEFAULT 0.0,
    network_mode VARCHAR(50) DEFAULT 'NavIC',
    is_simulated BOOLEAN DEFAULT FALSE
);

-- ------------------------------------------------------------------------------
-- 9. Disaster & Emergency Alerts (NDMA CAP)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS disaster_alerts (
    id VARCHAR(50) PRIMARY KEY,
    tier VARCHAR(30) NOT NULL,
    tier_level INTEGER DEFAULT 3,
    title VARCHAR(200) NOT NULL,
    corridor_id VARCHAR(30),
    affected_districts JSONB DEFAULT '[]'::jsonb,
    trigger_condition VARCHAR(255),
    timestamp VARCHAR(50) NOT NULL,
    acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_by VARCHAR(100),
    escalation_sla_mins INTEGER DEFAULT 20,
    dispatched_channels JSONB DEFAULT '[]'::jsonb,
    target_recipients_count INTEGER DEFAULT 150,
    dispatch_status VARCHAR(30) DEFAULT 'QUEUED',
    message_i18n JSONB DEFAULT '{}'::jsonb,
    source VARCHAR(100) DEFAULT 'SRC-NDMA-CAP',
    verification_status VARCHAR(30) DEFAULT 'VERIFIED'
);

-- ------------------------------------------------------------------------------
-- 10. Field Inspection Reports
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS field_reports (
    id VARCHAR(50) PRIMARY KEY,
    client_event_id VARCHAR(100) UNIQUE,
    reporter_name VARCHAR(100) NOT NULL,
    reporter_role VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    location_name VARCHAR(200) NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    timestamp VARCHAR(50) NOT NULL,
    incident_type VARCHAR(100) NOT NULL,
    damage_dimensions JSONB DEFAULT '{}'::jsonb,
    ai_severity_predicted VARCHAR(100),
    ai_confidence_pct DOUBLE PRECISION DEFAULT 90.0,
    ai_model_version VARCHAR(100),
    status VARCHAR(50) DEFAULT 'VERIFIED_QUEUED',
    assigned_crew VARCHAR(100),
    photo_url TEXT,
    points_awarded INTEGER DEFAULT 25,
    sync_status VARCHAR(30) DEFAULT 'SYNCED',
    source VARCHAR(100) DEFAULT 'SRC-FIELD-PWA',
    verification_status VARCHAR(30) DEFAULT 'REPORTED'
);

-- ------------------------------------------------------------------------------
-- 11. Official Data Source Registry
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS source_registry (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    department VARCHAR(200) NOT NULL,
    service VARCHAR(200) NOT NULL,
    update_frequency VARCHAR(100) NOT NULL,
    status VARCHAR(30) DEFAULT 'ONLINE',
    trust_score DOUBLE PRECISION DEFAULT 99.0,
    endpoint_pattern VARCHAR(255),
    data_types JSONB DEFAULT '[]'::jsonb,
    last_heartbeat VARCHAR(50),
    is_live_connector BOOLEAN DEFAULT TRUE
);

-- ------------------------------------------------------------------------------
-- 12. Security Audit Logs
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    event_type VARCHAR(100) NOT NULL,
    actor VARCHAR(100) DEFAULT 'SYSTEM',
    role VARCHAR(50) DEFAULT 'PUBLIC_VIEWER',
    endpoint VARCHAR(200),
    payload_summary JSONB DEFAULT '{}'::jsonb,
    outcome VARCHAR(50) DEFAULT 'SUCCESS',
    latency_ms DOUBLE PRECISION
);

-- ------------------------------------------------------------------------------
-- 13. Governance User Accounts
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(200) NOT NULL,
    role VARCHAR(50) DEFAULT 'PUBLIC_VIEWER' NOT NULL,
    state VARCHAR(100),
    district VARCHAR(100),
    organization VARCHAR(200),
    phone VARCHAR(30),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indices for Fast Geospatial and Lookup Queries
CREATE INDEX IF NOT EXISTS idx_districts_state ON districts(state_id);
CREATE INDEX IF NOT EXISTS idx_corridors_from_to ON road_segments(from_district, to_district);
CREATE INDEX IF NOT EXISTS idx_alerts_tier ON disaster_alerts(tier);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
