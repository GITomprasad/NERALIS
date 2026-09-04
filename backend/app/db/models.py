"""
NERALIS Comprehensive SQLAlchemy Target Data Models.
Implements the 18 target domain tables according to the architecture specification.
"""

import datetime
from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    Boolean,
    DateTime,
    JSON,
    Text,
    ForeignKey
)
from app.db.database import Base

class StateModel(Base):
    __tablename__ = "states"

    id = Column(String(10), primary_key=True)
    name = Column(String(100), nullable=False)
    capital = Column(String(100), nullable=False)
    districts_count = Column(Integer, default=0)
    terrain = Column(String(200), nullable=True)
    area_sqkm = Column(Float, default=0.0)
    avg_annual_rainfall_mm = Column(Float, default=0.0)
    key_lifeline = Column(String(200), nullable=True)
    vulnerability_score = Column(Integer, default=50)
    active_corridors_count = Column(Integer, default=0)
    total_depots_count = Column(Integer, default=0)


class DistrictModel(Base):
    __tablename__ = "districts"

    id = Column(String(20), primary_key=True)
    name = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    state_id = Column(String(10), ForeignKey("states.id"), nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    elevation = Column(Float, default=0.0)
    terrain = Column(String(100), nullable=True)
    score = Column(Integer, default=80)
    status = Column(String(30), default="OPEN")
    risk_level = Column(String(30), default="LOW")
    phc_count = Column(Integer, default=0)
    critical_stock_pct = Column(Integer, default=80)
    rainfall_24h_mm = Column(Float, default=0.0)
    soil_moisture_pct = Column(Float, default=50.0)
    source = Column(String(100), default="SRC-IMD-AWS")
    observed_at = Column(String(50), nullable=True)
    verification_status = Column(String(30), default="OBSERVED")
    confidence = Column(Float, default=98.0)


class RoadSegmentModel(Base):
    __tablename__ = "road_segments"

    id = Column(String(30), primary_key=True)
    name = Column(String(200), nullable=False)
    from_district = Column(String(100), nullable=False)
    to_district = Column(String(100), nullable=False)
    distance_km = Column(Float, nullable=False)
    avg_speed_kmh = Column(Float, default=40.0)
    status = Column(String(30), default="OPEN")
    hazard_type = Column(String(200), default="None")
    risk_score = Column(Integer, default=20)
    clearance_height_m = Column(Float, default=4.5)
    weight_limit_tons = Column(Float, default=40.0)
    bridges_on_route = Column(JSON, default=list)
    coordinates = Column(JSON, default=list)
    source = Column(String(100), default="SRC-BRO-VARTAK")
    observed_at = Column(String(50), nullable=True)
    verification_status = Column(String(30), default="VERIFIED")
    confidence = Column(Float, default=99.0)


class CorridorStatusEventModel(Base):
    __tablename__ = "corridor_status_events"

    id = Column(String(50), primary_key=True)
    corridor_id = Column(String(30), ForeignKey("road_segments.id"), nullable=False)
    status = Column(String(30), nullable=False)
    onset_time = Column(String(50), nullable=False)
    clearance_time = Column(String(50), nullable=True)
    reason = Column(String(255), nullable=True)
    reported_by = Column(String(100), nullable=True)
    verified_by = Column(String(100), nullable=True)
    event_data = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class BridgeModel(Base):
    __tablename__ = "bridges"

    id = Column(String(30), primary_key=True)
    name = Column(String(200), nullable=False)
    location = Column(String(200), nullable=False)
    river = Column(String(100), nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    structural_health_pct = Column(Integer, default=90)
    strain_microstrain = Column(Float, default=150.0)
    vibration_hz = Column(Float, default=2.0)
    water_clearance_m = Column(Float, default=6.0)
    flood_danger_level_m = Column(Float, default=50.0)
    current_water_level_m = Column(Float, default=40.0)
    cctv_status = Column(String(100), default="ONLINE")
    status = Column(String(50), default="HEALTHY")
    load_capacity_tons = Column(Float, default=40.0)
    sensor_last_ping = Column(String(50), nullable=True)
    sensor_status = Column(String(30), default="LIVE")
    scour_depth_m = Column(Float, default=1.0)
    source = Column(String(100), default="SRC-CWC-GAUGES")
    observed_at = Column(String(50), nullable=True)
    verification_status = Column(String(30), default="OBSERVED")


class SupplyDepotModel(Base):
    __tablename__ = "supply_depots"

    id = Column(String(30), primary_key=True)
    name = Column(String(200), nullable=False)
    location = Column(String(200), nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    type = Column(String(100), default="Primary Hub")
    capacity_metric_tons = Column(Float, default=20000.0)
    current_stock_tons = Column(Float, default=15000.0)
    critical_vaccine_units = Column(Integer, default=50000)
    pds_grain_tons = Column(Float, default=10000.0)
    fuel_reserve_kl = Column(Float, default=4000.0)
    waterway_berth = Column(String(100), default="None")
    servicing_states = Column(JSON, default=list)
    source = Column(String(100), default="SRC-STATE-PWD")
    verification_status = Column(String(30), default="VERIFIED")


class VehicleModel(Base):
    __tablename__ = "vehicles"

    id = Column(String(30), primary_key=True)
    plate_number = Column(String(30), nullable=False)
    vehicle_type = Column(String(100), nullable=False)
    driver_name = Column(String(100), nullable=False)
    driver_phone = Column(String(30), nullable=False)
    driver_score = Column(Integer, default=90)
    current_lat = Column(Float, nullable=False)
    current_lng = Column(Float, nullable=False)
    heading_deg = Column(Float, default=0.0)
    speed_kmh = Column(Float, default=40.0)
    origin = Column(String(100), nullable=False)
    destination = Column(String(100), nullable=False)
    cargo_type = Column(String(50), default="STANDARD_COMMERCIAL")
    cargo_weight_tons = Column(Float, default=10.0)
    e_way_bill_no = Column(String(50), nullable=True)
    network_mode = Column(String(50), default="NavIC")
    cold_chain = Column(JSON, nullable=True)
    cold_chain_profile = Column(String(50), default="STANDARD_VACCINES")
    fuel_monitor = Column(JSON, default=dict)
    trip_waypoints = Column(JSON, default=list)
    eta_destination = Column(String(50), nullable=True)
    status = Column(String(50), default="IN_TRANSIT")
    is_simulated = Column(Boolean, default=False)
    source = Column(String(100), default="SRC-FIELD-PWA")
    observed_at = Column(String(50), nullable=True)
    verification_status = Column(String(30), default="OBSERVED")
    confidence = Column(Float, default=99.0)


class VehiclePositionModel(Base):
    __tablename__ = "vehicle_positions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    vehicle_id = Column(String(30), ForeignKey("vehicles.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    speed_kmh = Column(Float, default=0.0)
    heading_deg = Column(Float, default=0.0)
    network_mode = Column(String(50), default="NavIC")
    is_simulated = Column(Boolean, default=False)


class DisasterAlertModel(Base):
    __tablename__ = "disaster_alerts"

    id = Column(String(50), primary_key=True)
    tier = Column(String(30), nullable=False)
    tier_level = Column(Integer, default=3)
    title = Column(String(200), nullable=False)
    corridor_id = Column(String(30), nullable=True)
    affected_districts = Column(JSON, default=list)
    trigger_condition = Column(String(255), nullable=True)
    timestamp = Column(String(50), nullable=False)
    acknowledged = Column(Boolean, default=False)
    acknowledged_by = Column(String(100), nullable=True)
    escalation_sla_mins = Column(Integer, default=20)
    dispatched_channels = Column(JSON, default=list)
    target_recipients_count = Column(Integer, default=150)
    dispatch_status = Column(String(30), default="QUEUED")
    message_i18n = Column(JSON, default=dict)
    source = Column(String(100), default="SRC-NDMA-CAP")
    verification_status = Column(String(30), default="VERIFIED")


class FieldReportModel(Base):
    __tablename__ = "field_reports"

    id = Column(String(50), primary_key=True)
    client_event_id = Column(String(100), unique=True, nullable=True)
    reporter_name = Column(String(100), nullable=False)
    reporter_role = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    location_name = Column(String(200), nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    timestamp = Column(String(50), nullable=False)
    incident_type = Column(String(100), nullable=False)
    damage_dimensions = Column(JSON, default=dict)
    ai_severity_predicted = Column(String(100), nullable=True)
    ai_confidence_pct = Column(Float, default=90.0)
    ai_model_version = Column(String(100), nullable=True)
    status = Column(String(50), default="VERIFIED_QUEUED")
    assigned_crew = Column(String(100), nullable=True)
    photo_url = Column(Text, nullable=True)
    points_awarded = Column(Integer, default=25)
    sync_status = Column(String(30), default="SYNCED")
    source = Column(String(100), default="SRC-FIELD-PWA")
    verification_status = Column(String(30), default="REPORTED")


class SourceRegistryModel(Base):
    __tablename__ = "source_registry"

    id = Column(String(50), primary_key=True)
    name = Column(String(200), nullable=False)
    department = Column(String(200), nullable=False)
    service = Column(String(200), nullable=False)
    update_frequency = Column(String(100), nullable=False)
    status = Column(String(30), default="ONLINE")
    trust_score = Column(Float, default=99.0)
    endpoint_pattern = Column(String(255), nullable=True)
    data_types = Column(JSON, default=list)
    last_heartbeat = Column(String(50), nullable=True)
    is_live_connector = Column(Boolean, default=True)


class AuditLogModel(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    event_type = Column(String(100), nullable=False)
    actor = Column(String(100), default="SYSTEM")
    role = Column(String(50), default="PUBLIC_VIEWER")
    endpoint = Column(String(200), nullable=True)
    payload_summary = Column(JSON, default=dict)
    outcome = Column(String(50), default="SUCCESS")
    latency_ms = Column(Float, nullable=True)


class UserModel(Base):
    __tablename__ = "users"

    id = Column(String(50), primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(200), nullable=False)
    role = Column(String(50), default="PUBLIC_VIEWER", nullable=False)
    state = Column(String(100), nullable=True)
    district = Column(String(100), nullable=True)
    organization = Column(String(200), nullable=True)
    phone = Column(String(30), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class SyncQueueModel(Base):
    __tablename__ = "sync_queue"

    id = Column(String(60), primary_key=True)
    entity_type = Column(String(50), nullable=False)   # CORRIDOR, ALERT, VEHICLE, FIELD_REPORT, BRIDGE
    entity_id = Column(String(100), nullable=False)
    operation_type = Column(String(30), nullable=False) # INSERT, UPDATE, DELETE, ACKNOWLEDGE, DISPATCH
    payload = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    synced_at = Column(DateTime, nullable=True)
    retry_count = Column(Integer, default=0)
    sync_status = Column(String(30), default="PENDING") # PENDING, SYNCED, FAILED
    error_message = Column(Text, nullable=True)


class PredictionCacheModel(Base):
    __tablename__ = "predictions_cache"

    id = Column(String(50), primary_key=True)  # e.g., FORECAST_6H, FORECAST_24H, FORECAST_48H, FORECAST_72H, ADVISORIES
    forecast_horizon_hours = Column(Integer, default=24)
    data = Column(JSON, default=dict)
    model_version = Column(String(100), default="NERALIS-RF-NER-Landslide-v1.0")
    cached_at = Column(DateTime, default=datetime.datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)


class SystemMetadataModel(Base):
    __tablename__ = "system_metadata"

    key = Column(String(100), primary_key=True)
    value = Column(Text, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)


