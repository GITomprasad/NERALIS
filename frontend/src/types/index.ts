export type RoadStatus = 'OPEN' | 'RESTRICTED' | 'DEGRADED' | 'CLOSED' | 'UNKNOWN' | 'SEASONAL';

export type AlertTier = 'T1 - INFO' | 'T2 - ADVISORY' | 'T3 - WARNING' | 'T4 - CRITICAL' | 'T5 - DISASTER';

export type VerificationStatus = 'OBSERVED' | 'PREDICTED' | 'REPORTED' | 'VERIFIED' | 'SIMULATED';

export type CargoType =
  | 'CRITICAL_MEDICINES'
  | 'EMERGENCY_RELIEF'
  | 'FOOD_PDS'
  | 'AGRI_COLD_CHAIN'
  | 'CONSTRUCTION_HEAVY'
  | 'FUEL_HAZMAT'
  | 'STANDARD_COMMERCIAL';

export interface SourceRegistryItem {
  id: string;
  name: string;
  department: string;
  service: string;
  update_frequency: string;
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  trust_score: number;
  endpoint_pattern: string;
  data_types: string[];
}

export interface District {
  id: string;
  name: string;
  state: string;
  state_id: string;
  lat: number;
  lng: number;
  elevation: number;
  terrain: string;
  score: number;
  status: RoadStatus;
  risk_level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  phc_count: number;
  critical_stock_pct: number;
  rainfall_24h_mm?: number;
  soil_moisture_pct?: number;
  source?: string;
  observed_at?: string;
  verification_status?: VerificationStatus;
  confidence?: number;
}

export interface RoadSegment {
  id: string;
  name: string;
  from_district: string;
  to_district: string;
  distance_km: number;
  avg_speed_kmh: number;
  status: RoadStatus;
  hazard_type: string;
  risk_score: number;
  bridges_on_route: string[];
  clearance_height_m: number;
  weight_limit_tons: number;
  coordinates: [number, number][];
  source?: string;
  observed_at?: string;
  verification_status?: VerificationStatus;
  confidence?: number;
}

export interface Bridge {
  id: string;
  name: string;
  location: string;
  river: string;
  lat: number;
  lng: number;
  structural_health_pct: number;
  strain_microstrain: number;
  vibration_hz: number;
  water_clearance_m: number;
  flood_danger_level_m: number;
  current_water_level_m: number;
  cctv_status: string;
  status: string;
  load_capacity_tons: number;
  sensor_last_ping?: string;
  sensor_status?: string;
  scour_depth_m?: number;
  source?: string;
  observed_at?: string;
  verification_status?: VerificationStatus;
}

export interface SupplyDepot {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  type: string;
  capacity_metric_tons: number;
  current_stock_tons: number;
  critical_vaccine_units: number;
  pds_grain_tons: number;
  fuel_reserve_kl: number;
  waterway_berth: string;
  servicing_states: string[];
  source?: string;
  verification_status?: VerificationStatus;
}

export interface Vehicle {
  id: string;
  plate_number: string;
  vehicle_type: string;
  driver_name: string;
  driver_phone: string;
  driver_score: number;
  current_lat: number;
  current_lng: number;
  heading_deg: number;
  speed_kmh: number;
  origin: string;
  destination: string;
  cargo_type: string;
  cargo_weight_tons: number;
  e_way_bill_no: string;
  network_mode: string;
  cold_chain?: {
    sensor_id: string;
    profile?: string;
    current_temp_c: number;
    target_min_c: number;
    target_max_c: number;
    status: string;
    door_locked: boolean;
    temp_history: number[];
  } | null;
  cold_chain_profile?: string;
  fuel_monitor: {
    tank_level_pct: number;
    consumption_rate_lph: number;
    anomaly_flag: boolean;
  };
  eta_destination: string;
  status: string;
  is_simulated?: boolean;
  source?: string;
  observed_at?: string;
  verification_status?: VerificationStatus;
  confidence?: number;
}

export interface Alert {
  id: string;
  tier: string;
  tier_level: number;
  title: string;
  corridor_id: string;
  affected_districts: string[];
  trigger_condition: string;
  timestamp: string;
  acknowledged: boolean;
  acknowledged_by: string;
  escalation_sla_mins: number;
  dispatched_channels: string[];
  target_recipients_count: number;
  dispatch_status?: string;
  message_i18n: Record<string, string>;
  source?: string;
  verification_status?: VerificationStatus;
}

export interface FieldReport {
  id: string;
  client_event_id?: string;
  reporter_name: string;
  reporter_role: string;
  state: string;
  district: string;
  location_name: string;
  lat: number;
  lng: number;
  timestamp: string;
  incident_type: string;
  damage_dimensions: {
    crack_length_m: number;
    pothole_depth_cm: number;
    debris_volume_cum: number;
  };
  ai_severity_predicted: string;
  ai_confidence_pct?: number;
  ai_model_version?: string;
  status: string;
  assigned_crew: string;
  photo_url?: string;
  points_awarded: number;
  sync_status?: 'QUEUED' | 'SYNCING' | 'SYNCED' | 'FAILED';
  source?: string;
  verification_status?: VerificationStatus;
}

export interface MLModelMetrics {
  model_version: string;
  algorithm: string;
  training_samples_count: number;
  test_samples_count: number;
  validation_method: string;
  accuracy_pct: number;
  roc_auc: number;
  pr_auc: number;
  f1_score: number;
  precision_pct: number;
  recall_pct: number;
  brier_score: number;
  lead_time_accuracy_pct: number;
  confusion_matrix: {
    true_negative: number;
    false_positive: number;
    false_negative: number;
    true_positive: number;
  };
  roc_curve_points: Array<{ fpr: number; tpr: number }>;
  calibration_curve: Array<{ predicted_prob: number; actual_frequency: number }>;
  feature_importance: Array<{ feature: string; weight: number; category: string }>;
}

export interface CorridorPrediction {
  corridor_id: string;
  corridor_name: string;
  forecast_horizon_hours: number;
  predicted_risk_pct: number;
  risk_tier: string;
  predicted_event: string;
  recommended_action: string;
  ai_confidence_pct: number;
  model_version: string;
  observed_at: string;
  verification_status: VerificationStatus;
  weather_input: {
    rainfall_72h_mm: number;
    soil_moisture_pct: number;
    slope_gradient_deg: number;
    river_margin_m: number;
  };
  top_contributing_factors: Array<{
    factor: string;
    impact_pct: number;
    source: string;
  }>;
}

export interface PrepositioningAdvisory {
  id: string;
  target_district: string;
  source_depot: string;
  reason: string;
  recommended_transfer: {
    critical_vaccines_units: number;
    blood_units: number;
    food_grains_quintals: number;
    diesel_reserve_kl?: number;
    water_purification_tablets_packs?: number;
  };
  recommended_convoy_window: string;
  urgency: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' | 'EMERGENCY';
  days_of_autonomy_gained: number;
  provenance: {
    source: string;
    observed_at: string;
    confidence: number;
  };
}
