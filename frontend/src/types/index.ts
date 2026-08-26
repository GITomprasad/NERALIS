export type RoadStatus = 'OPEN' | 'RESTRICTED' | 'DEGRADED' | 'CLOSED' | 'UNKNOWN' | 'SEASONAL';

export type AlertTier = 'T1 - INFO' | 'T2 - ADVISORY' | 'T3 - WARNING' | 'T4 - CRITICAL' | 'T5 - DISASTER';

export type CargoType =
  | 'CRITICAL_MEDICINES'
  | 'EMERGENCY_RELIEF'
  | 'FOOD_PDS'
  | 'AGRI_COLD_CHAIN'
  | 'CONSTRUCTION_HEAVY'
  | 'FUEL_HAZMAT'
  | 'STANDARD_COMMERCIAL';

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
    current_temp_c: number;
    target_min_c: number;
    target_max_c: number;
    status: string;
    door_locked: boolean;
    temp_history: number[];
  } | null;
  fuel_monitor: {
    tank_level_pct: number;
    consumption_rate_lph: number;
    anomaly_flag: boolean;
  };
  eta_destination: string;
  status: string;
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
  message_i18n: Record<string, string>;
}

export interface FieldReport {
  id: string;
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
  status: string;
  assigned_crew: string;
  photo_url?: string;
  points_awarded: number;
}
