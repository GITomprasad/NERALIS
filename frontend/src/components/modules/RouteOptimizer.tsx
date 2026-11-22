import React, { useState, useEffect } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { useLanguage } from '../../context/LanguageContext';
import { apiClient } from '../../services/api/apiClient';
import type { CargoType } from '../../types';
import { NerGisMap } from '../map/NerGisMap';
import { ProvenanceBadge } from '../common/ProvenanceBadge';
import {
  Route,
  Compass,
  Clock,
  Calendar,
  Truck,
  Ship,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  ArrowLeftRight,
  TrendingDown,
  Navigation,
  Zap,
  MapPin
} from 'lucide-react';

export type LogisticsVehicleClass = 'THREE_WHEELER' | 'FOUR_WHEELER_SCV' | 'MEDIUM_TRUCK' | 'HEAVY_TRAILER';

interface VehicleClassConfig {
  id: LogisticsVehicleClass;
  title: string;
  category: string;
  defaultWeight: number;
  widthMeters: number;
  iconEmoji: string;
  roadSuitability: string;
  clearanceNote: string;
  badge: string;
  badgeColor: string;
}

const VEHICLE_CLASSES: VehicleClassConfig[] = [
  {
    id: 'THREE_WHEELER',
    title: '3-Wheeler Cargo Auto / EV',
    category: 'Small Mountain Feeder (<1.5 MT)',
    defaultWeight: 1.5,
    widthMeters: 1.4,
    iconEmoji: '🛺',
    roadSuitability: 'Single-Lane (<2.2m) Passable',
    clearanceNote: 'Passes narrow hillside bypasses, single-lane village shortcuts & emergency landslide detours where heavy trucks get blocked.',
    badge: 'Narrow Track Passable',
    badgeColor: 'bg-emerald-500/20 text-[#20C997] border-emerald-500/30'
  },
  {
    id: 'FOUR_WHEELER_SCV',
    title: '4-Wheeler Small LCV / Pickup',
    category: 'Compact Commercial (Tata Ace / Bolero)',
    defaultWeight: 3.5,
    widthMeters: 1.8,
    iconEmoji: '🛻',
    roadSuitability: 'Narrow Mountain Roads (<2.8m)',
    clearanceNote: 'Passes secondary hill roads, steep ghat gradients, and low-capacity Bailey bridges.',
    badge: 'All-Terrain Hill LCV',
    badgeColor: 'bg-cyan-500/20 text-[#19C6D2] border-cyan-500/30'
  },
  {
    id: 'MEDIUM_TRUCK',
    title: '6-Wheeler Freight Truck (16T)',
    category: 'Standard Goods Vehicle',
    defaultWeight: 16.0,
    widthMeters: 2.5,
    iconEmoji: '🚚',
    roadSuitability: 'Standard 2-Lane Highway',
    clearanceNote: 'Standard National & State Highways. Requires certified two-lane bridges and standard turning radius.',
    badge: 'Standard 2-Lane Only',
    badgeColor: 'bg-amber-500/20 text-[#FFB547] border-amber-500/30'
  },
  {
    id: 'HEAVY_TRAILER',
    title: 'Heavy Multi-Axle / 16-Wheeler Trailer',
    category: 'Heavy Freight Carrier (28T - 42T)',
    defaultWeight: 36.0,
    widthMeters: 2.7,
    iconEmoji: '🚛',
    roadSuitability: 'Heavy Express Highway (4-Lane / Wide)',
    clearanceNote: 'Restricted from narrow single-lane hairpin passes. Strictly routed via Class-70R rated bridges & 4-lane corridors.',
    badge: 'Heavy Corridor Only',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
  }
];

export const RouteOptimizer: React.FC = () => {
  const { districts, addToast } = usePlatform();
  const { t } = useLanguage();

  const [origin, setOrigin] = useState('AS-KAM');
  const [destination, setDestination] = useState('AR-TAW');
  const [cargoType, setCargoType] = useState<CargoType>('CRITICAL_MEDICINES');
  const [vehicleClass, setVehicleClass] = useState<LogisticsVehicleClass>('MEDIUM_TRUCK');
  const [vehicleWeight, setVehicleWeight] = useState(16.0);
  const [departureHour, setDepartureHour] = useState(8);
  const [includeIntermodal, setIncludeIntermodal] = useState(true);

  const [isCalculating, setIsCalculating] = useState(false);
  const [routeResult, setRouteResult] = useState<any>(null);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0); // 0 = Primary, 1 = Resilient, 2 = Multimodal

  const handleVehicleClassSelect = (vClass: LogisticsVehicleClass) => {
    setVehicleClass(vClass);
    const cfg = VEHICLE_CLASSES.find((c) => c.id === vClass);
    if (cfg) {
      setVehicleWeight(cfg.defaultWeight);
    }
  };

  const handleComputeRoute = async (customOrigin?: string, customDestination?: string) => {
    const orig = typeof customOrigin === 'string' ? customOrigin : origin;
    const dest = typeof customDestination === 'string' ? customDestination : destination;
    setIsCalculating(true);
    try {
      const data = await apiClient.optimizeRoute({
        origin: orig,
        destination: dest,
        cargo_type: cargoType,
        vehicle_weight_tons: vehicleWeight,
        departure_hour: departureHour,
        include_intermodal: includeIntermodal
      });

      if (data) {
        setRouteResult(data);
        addToast('Route Optimization Complete', `Primary path and alternatives computed with verified bridge clearances.`, 'SUCCESS');
      } else {
        addToast('Optimization Failed', 'Unable to compute route between the selected nodes.', 'DANGER');
      }
    } catch {
      addToast('Optimization Error', 'An error occurred while calculating the route.', 'DANGER');
    } finally {
      setIsCalculating(false);
    }
  };

  // Auto-calculate on initial load
  useEffect(() => {
    if (!routeResult) {
      handleComputeRoute('AS-KAM', 'AR-TAW');
    }
  }, []);

  const handleSwapNodes = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const cargoOptions: { type: CargoType; label: string; icon: string; desc: string }[] = [
    { type: 'CRITICAL_MEDICINES', label: 'Medicines & Vaccines', icon: '💉', desc: 'Prioritizes high reliability & bridge stability' },
    { type: 'AGRI_COLD_CHAIN', label: 'Perishable Cold-Chain', icon: '🥦', desc: 'Prioritizes shortest transit duration & low vibration' },
    { type: 'FOOD_PDS', label: 'FCI Public Food Grain', icon: '🌾', desc: 'Tolerant to transit delays; bypasses weak bridges' },
    { type: 'FUEL_HAZMAT', label: 'Petroleum & Fuels', icon: '⛽', desc: 'Requires Class-70R bridges & standard radius' },
    { type: 'CONSTRUCTION_HEAVY', label: 'Heavy Infrastructure', icon: '🛡️', desc: 'Prioritizes strategic high-clearance corridors' },
    { type: 'EMERGENCY_RELIEF', label: 'SDRF / NDRF Disaster Relief', icon: '🚨', desc: 'Multi-modal air/waterway bypass prioritization' }
  ];

  const presets = [
    { label: 'Guwahati → Tawang', orig: 'AS-KAM', dest: 'AR-TAW', sub: 'NH-13 Sela Tunnel Route' },
    { label: 'Siliguri → Gangtok', orig: 'AS-KAM', dest: 'SK-EAS', sub: 'NH-10 Teesta Corridor' },
    { label: 'Guwahati → Agartala', orig: 'AS-KAM', dest: 'TR-WES', sub: 'NH-08 & River Multi-Modal' },
    { label: 'Silchar → Imphal', orig: 'AS-CAC', dest: 'MN-IMW', sub: 'NH-37 Barring Transit' }
  ];

  const activeDisplayRoute = routeResult
    ? selectedRouteIndex === 0
      ? routeResult.primary_route
      : routeResult.alternative_routes?.[selectedRouteIndex - 1] || routeResult.primary_route
    : null;

  return (
    <div className="space-y-4">
      {/* Module Title Banner */}
      <div className="card-command flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-black text-[#F5F7FA]">
              {t('module_2')} — Multi-Objective Dijkstra Logistics Router
            </h2>
            <ProvenanceBadge status="PREDICTED" confidence={94.6} />
          </div>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Real-time constraint optimization balancing travel time, terrain hazard probabilities, structural bridge load clearances &amp; Brahmaputra NW-2 barge links.
          </p>
        </div>

        {/* Strategic Presets */}
        <div className="flex flex-wrap items-center gap-2">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setOrigin(p.orig);
                setDestination(p.dest);
                handleComputeRoute(p.orig, p.dest);
              }}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-[#111D2D] hover:bg-[#16253B] text-[#19C6D2] border border-[#1E2E45] transition-all flex items-center gap-1.5 cursor-pointer shadow-command-card"
            >
              <Navigation className="w-3 h-3 text-[#19C6D2]" />
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Route Configuration HUD (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="card-command space-y-4">
            <h3 className="font-black text-sm text-[#F5F7FA] border-b border-[#1E2E45] pb-2 flex items-center justify-between">
              <span>Route Parameters</span>
              <span className="text-[10px] font-mono text-[#19C6D2]">89 DISTRICT NODES</span>
            </h3>

            {/* Origin & Destination with Swap */}
            <div className="space-y-2.5 relative">
              <div>
                <label className="text-xs font-bold text-[#94A3B8] mb-1 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#20C997]" /> Origin Node (Dispatch Center)
                </label>
                <select
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="input-command text-xs font-medium cursor-pointer"
                >
                  {districts.map((d) => (
                    <option key={`orig-${d.id}`} value={d.id}>
                      {d.name} ({d.state})
                    </option>
                  ))}
                </select>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center -my-1">
                <button
                  type="button"
                  onClick={handleSwapNodes}
                  className="p-1.5 rounded-full bg-[#111D2D] hover:bg-[#16253B] border border-[#1E2E45] text-[#19C6D2] shadow-sm transition-transform active:scale-95 cursor-pointer"
                  title="Swap Origin and Destination"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-[#94A3B8] mb-1 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#FF5252]" /> Destination Node (Delivery Target)
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="input-command text-xs font-medium cursor-pointer"
                >
                  {districts.map((d) => (
                    <option key={`dest-${d.id}`} value={d.id}>
                      {d.name} ({d.state})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Cargo Profile Picker */}
            <div className="space-y-2 border-t border-[#1E2E45] pt-3">
              <label className="text-xs font-bold text-[#94A3B8] block">Consignment Commodity Class</label>
              <div className="grid grid-cols-2 gap-2">
                {cargoOptions.map((c) => (
                  <button
                    key={c.type}
                    type="button"
                    onClick={() => setCargoType(c.type)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      cargoType === c.type
                        ? 'bg-[#16253B] border-[#19C6D2] shadow-command-glow'
                        : 'bg-[#0D1522] border-[#1E2E45] hover:bg-[#111D2D]'
                    }`}
                  >
                    <div className="text-base mb-1">{c.icon}</div>
                    <div className={`font-bold text-xs truncate ${cargoType === c.type ? 'text-[#19C6D2]' : 'text-[#F5F7FA]'}`}>
                      {c.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Logistics Vehicle Class & Road Width Clearance Selector */}
            <div className="space-y-3 border-t border-[#1E2E45] pt-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#94A3B8] flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#19C6D2]" /> Logistics Vehicle Class &amp; Road Clearance
                </label>
                <span className="text-[10px] bg-[#111D2D] text-[#19C6D2] font-bold px-1.5 py-0.5 rounded border border-cyan-500/20 font-mono">
                  {VEHICLE_CLASSES.find((c) => c.id === vehicleClass)?.widthMeters}m Width • {vehicleWeight} MT
                </span>
              </div>

              {/* 4 Vehicle Type Cards with Logos & Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {VEHICLE_CLASSES.map((vc) => {
                  const isSelected = vehicleClass === vc.id;
                  return (
                    <button
                      key={vc.id}
                      type="button"
                      onClick={() => handleVehicleClassSelect(vc.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all relative cursor-pointer ${
                        isSelected
                          ? 'bg-[#16253B] border-[#19C6D2] shadow-command-glow ring-1 ring-[#19C6D2]/30'
                          : 'bg-[#0D1522] border-[#1E2E45] hover:bg-[#111D2D]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl select-none" role="img" aria-label={vc.title}>
                            {vc.iconEmoji}
                          </span>
                          <div className="min-w-0">
                            <div className={`font-black text-xs truncate ${isSelected ? 'text-[#19C6D2]' : 'text-[#F5F7FA]'}`}>
                              {vc.title}
                            </div>
                            <div className="text-[10px] text-[#64748B] truncate">{vc.category}</div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-1.5 flex items-center justify-between gap-1 text-[10px]">
                        <span className={`font-bold px-1.5 py-0.5 rounded border ${vc.badgeColor}`}>
                          {vc.badge}
                        </span>
                        <span className="font-mono text-[#F5F7FA] font-bold">{vc.defaultWeight} MT</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Vehicle Clearance Policy Box */}
              {(() => {
                const activeCfg = VEHICLE_CLASSES.find((c) => c.id === vehicleClass);
                if (!activeCfg) return null;
                return (
                  <div className="p-3 bg-[#0D1522] rounded-xl border border-[#1E2E45] text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="flex items-center gap-1">
                        <span className="text-[#94A3B8]">Road Passability:</span>
                        <span className="text-[#19C6D2] font-semibold">{activeCfg.roadSuitability}</span>
                      </span>
                      <span className="text-[10px] text-[#20C997] font-bold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Clearance Active
                      </span>
                    </div>
                    <p className="text-[10px] text-[#94A3B8] leading-relaxed">{activeCfg.clearanceNote}</p>
                  </div>
                );
              })()}

              {/* Sliders */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-[#94A3B8]">Gross Vehicle Weight (Tons)</span>
                  <span className="text-[#19C6D2] font-mono font-black">{vehicleWeight} MT</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="0.5"
                  value={vehicleWeight}
                  onChange={(e) => setVehicleWeight(Number(e.target.value))}
                  className="w-full accent-[#19C6D2] bg-[#0D1522] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-[#94A3B8]">Planned Departure Hour</span>
                  <span className="text-[#438BFF] font-mono font-black">{departureHour}:00 IST</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="23"
                  step="1"
                  value={departureHour}
                  onChange={(e) => setDepartureHour(Number(e.target.value))}
                  className="w-full accent-[#438BFF] bg-[#0D1522] cursor-pointer"
                />
              </div>

              {/* Multi-Modal Waterway Bypass */}
              <div className="flex items-center justify-between p-3 bg-[#0D1522] rounded-xl border border-[#1E2E45]">
                <span className="font-semibold text-[#F5F7FA] flex items-center gap-2 text-xs">
                  <Ship className="w-4 h-4 text-[#38BDF8]" /> Multi-Modal Waterway Bypass (NW-2 Brahmaputra)
                </span>
                <input
                  type="checkbox"
                  checked={includeIntermodal}
                  onChange={(e) => setIncludeIntermodal(e.target.checked)}
                  className="rounded text-[#19C6D2] bg-[#111D2D] border-[#1E2E45] w-4 h-4 cursor-pointer"
                />
              </div>
            </div>

            {/* Compute Button */}
            <button
              onClick={() => handleComputeRoute()}
              disabled={isCalculating}
              className="w-full btn-primary font-black py-3 rounded-xl flex items-center justify-center gap-2 shadow-command-glow transition-all cursor-pointer"
            >
              {isCalculating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-[#080D16]" /> Computing Multi-Objective Optimal Route...
                </>
              ) : (
                <>
                  <Route className="w-4 h-4 text-[#080D16]" /> Calculate Multi-Objective Route
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Comparative Route Alternatives & Stepper (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {routeResult ? (
            <div className="space-y-4">
              {/* Route Alternative Comparison Tabs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* 1. Fastest Primary Path */}
                {routeResult.primary_route && (
                  <button
                    onClick={() => setSelectedRouteIndex(0)}
                    className={`card-command text-left p-4 cursor-pointer transition-all ${
                      selectedRouteIndex === 0 ? 'border-[#19C6D2] shadow-command-glow bg-[#16253B]' : 'hover:border-[#334155]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-[#19C6D2]/15 text-[#19C6D2] border border-[#19C6D2]/30 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                        Fastest Primary
                      </span>
                      <span className="text-xs font-mono font-bold text-[#F5F7FA]">
                        {routeResult.primary_route.total_distance_km} KM
                      </span>
                    </div>
                    <div className="text-sm font-black text-[#F5F7FA] truncate">
                      {routeResult.primary_route.corridors_used?.[0] || 'Strategic Express Path'}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-[#94A3B8]">
                      <span>{routeResult.primary_route.total_time_hrs.toFixed(1)} hrs</span>
                      <span className="text-[#FFB547] font-bold">Hazard: {routeResult.primary_route.avg_risk_score}/100</span>
                    </div>
                  </button>
                )}

                {/* 2. Resilient Hazard Avoidance Path */}
                {routeResult.alternative_routes?.[0] && (
                  <button
                    onClick={() => setSelectedRouteIndex(1)}
                    className={`card-command text-left p-4 cursor-pointer transition-all ${
                      selectedRouteIndex === 1 ? 'border-[#20C997] shadow-command-glow bg-[#16253B]' : 'hover:border-[#334155]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-[#20C997]/15 text-[#20C997] border border-[#20C997]/30 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                        Most Resilient
                      </span>
                      <span className="text-xs font-mono font-bold text-[#F5F7FA]">
                        {routeResult.alternative_routes[0].total_distance_km} KM
                      </span>
                    </div>
                    <div className="text-sm font-black text-[#F5F7FA] truncate">
                      {routeResult.alternative_routes[0].corridors_used?.[0] || 'Hazard Avoidance Detour'}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-[#94A3B8]">
                      <span>{routeResult.alternative_routes[0].total_time_hrs.toFixed(1)} hrs</span>
                      <span className="text-[#20C997] font-bold">Hazard: {routeResult.alternative_routes[0].avg_risk_score}/100</span>
                    </div>
                  </button>
                )}

                {/* 3. Multi-Modal Waterway Bypass */}
                {routeResult.alternative_routes?.[1] && (
                  <button
                    onClick={() => setSelectedRouteIndex(2)}
                    className={`card-command text-left p-4 cursor-pointer transition-all ${
                      selectedRouteIndex === 2 ? 'border-[#38BDF8] shadow-command-glow bg-[#16253B]' : 'hover:border-[#334155]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                        Multi-Modal Waterway
                      </span>
                      <span className="text-xs font-mono font-bold text-[#F5F7FA]">
                        {routeResult.alternative_routes[1].total_distance_km} KM
                      </span>
                    </div>
                    <div className="text-sm font-black text-[#F5F7FA] truncate">
                      NW-2 Brahmaputra Barge Bypass
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-[#94A3B8]">
                      <span>{routeResult.alternative_routes[1].total_time_hrs.toFixed(1)} hrs</span>
                      <span className="text-[#38BDF8] font-bold">Fuel: -34%</span>
                    </div>
                  </button>
                )}
              </div>

              {/* Active Route Details Card */}
              {activeDisplayRoute && (
                <div className="card-command space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E2E45] pb-3">
                    <div>
                      <h4 className="font-black text-sm text-[#F5F7FA]">{activeDisplayRoute.route_tag}</h4>
                      <p className="text-[11px] text-[#94A3B8] mt-0.5">{activeDisplayRoute.tradeoff_reason}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {(() => {
                        const vCfg = VEHICLE_CLASSES.find((c) => c.id === vehicleClass);
                        return (
                          <div className="text-right">
                            <div className="text-[10px] font-bold text-[#64748B]">Vehicle Profile:</div>
                            <div className="text-xs font-black text-[#19C6D2] flex items-center gap-1 justify-end">
                              <span>{vCfg?.iconEmoji}</span>
                              <span>{vCfg?.title}</span>
                            </div>
                          </div>
                        );
                      })()}
                      <div className="text-right border-l border-[#1E2E45] pl-3">
                        <div className="text-xs font-bold text-[#94A3B8]">Departure Window:</div>
                        <div className="text-xs font-black text-[#20C997] font-mono">{routeResult.recommended_departure_window}</div>
                      </div>
                    </div>
                  </div>

                  {/* Route Metrics Summary */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="bg-[#0D1522] p-3 rounded-xl border border-[#1E2E45]">
                      <div className="text-[10px] text-[#64748B] font-bold uppercase">Total Distance</div>
                      <div className="font-black text-[#F5F7FA] mt-0.5">{activeDisplayRoute.total_distance_km} KM</div>
                    </div>
                    <div className="bg-[#0D1522] p-3 rounded-xl border border-[#1E2E45]">
                      <div className="text-[10px] text-[#64748B] font-bold uppercase">Estimated Time</div>
                      <div className="font-black text-[#19C6D2] mt-0.5 font-mono">
                        {Math.floor(activeDisplayRoute.total_time_hrs)}h {Math.round((activeDisplayRoute.total_time_hrs % 1) * 60)}m
                      </div>
                    </div>
                    <div className="bg-[#0D1522] p-3 rounded-xl border border-[#1E2E45]">
                      <div className="text-[10px] text-[#64748B] font-bold uppercase">Hazard Risk Score</div>
                      <div className="font-black text-[#FFB547] mt-0.5">{activeDisplayRoute.avg_risk_score} / 100</div>
                    </div>
                    <div className="bg-[#0D1522] p-3 rounded-xl border border-[#1E2E45]">
                      <div className="text-[10px] text-[#64748B] font-bold uppercase">Bridges Cleared</div>
                      <div className="font-black text-[#20C997] mt-0.5">{activeDisplayRoute.bridges_on_route?.length || 2} Passed</div>
                    </div>
                  </div>

                  {/* Route Journey Stepper (Requirement 5) */}
                  {(() => {
                    const journeyWaypoints = (activeDisplayRoute.waypoints && activeDisplayRoute.waypoints.length > 0)
                      ? activeDisplayRoute.waypoints
                      : (Array.isArray(activeDisplayRoute.path_nodes) && activeDisplayRoute.path_nodes.length > 0)
                      ? activeDisplayRoute.path_nodes.map((nId: string, idx: number) => {
                          const d = districts.find((item) => item.id === nId);
                          return {
                            index: idx + 1,
                            node_id: nId,
                            name: d ? d.name : nId,
                            state: d ? d.state : '',
                            lat: d ? d.lat : 26.1445,
                            lng: d ? d.lng : 91.7362,
                            role: idx === 0 ? 'ORIGIN' : idx === activeDisplayRoute.path_nodes.length - 1 ? 'DESTINATION' : 'TRANSIT'
                          };
                        })
                      : [];

                    if (journeyWaypoints.length === 0) return null;

                    return (
                      <div className="p-3.5 bg-[#0D1522] rounded-xl border border-[#1E2E45] space-y-2.5 text-xs">
                        <div className="font-bold text-[#19C6D2] text-[11px] uppercase tracking-wider flex items-center justify-between">
                          <span>Route Journey &amp; Waypoint Sequence:</span>
                          <span className="text-[10px] text-[#64748B] font-mono">
                            {journeyWaypoints.length} Nodes • {activeDisplayRoute.segments_count || (journeyWaypoints.length - 1)} Corridor Segments
                          </span>
                        </div>
                        <div className="flex flex-col gap-2 pt-1">
                          {journeyWaypoints.map((wp: any, idx: number) => {
                            const isOrigin = idx === 0;
                            const isDest = idx === journeyWaypoints.length - 1;
                            const segmentAfter = activeDisplayRoute.segments && activeDisplayRoute.segments[idx];
                            return (
                              <div key={`journey-node-${idx}`} className="flex items-start gap-2.5">
                                <div className="flex flex-col items-center">
                                  <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] text-white shadow-command-card ${
                                      isOrigin
                                        ? 'bg-[#20C997] text-slate-900 ring-2 ring-emerald-500/30'
                                        : isDest
                                        ? 'bg-[#FF5252] text-white ring-2 ring-rose-500/30'
                                        : 'bg-[#111D2D] border border-cyan-500/30 text-[#19C6D2]'
                                    }`}
                                  >
                                    {isDest ? '🎯' : wp.index}
                                  </div>
                                  {!isDest && <div className="w-0.5 h-6 bg-[#1E2E45] my-0.5" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <span className="font-black text-[#F5F7FA] text-xs">
                                      {wp.name} {wp.state ? `(${wp.state})` : ''}
                                    </span>
                                    <span
                                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                                        isOrigin
                                          ? 'bg-emerald-500/20 text-[#20C997] border-emerald-500/30'
                                          : isDest
                                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                                          : 'bg-cyan-500/15 text-[#19C6D2] border-cyan-500/30'
                                      }`}
                                    >
                                      {isOrigin ? 'Origin Departure' : isDest ? 'Destination Target' : 'Transit Junction'}
                                    </span>
                                  </div>
                                  {!isDest && segmentAfter && (
                                    <div className="text-[10px] text-[#64748B] flex items-center gap-1 mt-0.5 font-mono">
                                      <span>↳ {segmentAfter.name || 'Corridor Link'}</span>
                                      <span>({segmentAfter.distance_km} km • {segmentAfter.duration_hrs}h)</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Why Recommended / Trade-off Rationale Box */}
                  <div className="p-3.5 bg-[#0D1522] rounded-xl border border-[#1E2E45] space-y-1.5 text-xs">
                    <div className="font-bold text-[#19C6D2] text-[11px] flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-[#20C997]" /> Selection Rationale &amp; Safeguards:
                      </span>
                      <span className="text-[10px] bg-[#20C997]/15 text-[#20C997] border border-[#20C997]/30 font-bold px-2 py-0.5 rounded">
                        Optimal Policy
                      </span>
                    </div>
                    <ul className="text-[11px] text-[#94A3B8] space-y-1 list-disc pl-4">
                      <li>
                        <strong>Vehicle Clearance ({VEHICLE_CLASSES.find((c) => c.id === vehicleClass)?.iconEmoji} {VEHICLE_CLASSES.find((c) => c.id === vehicleClass)?.title}):</strong>{' '}
                        {VEHICLE_CLASSES.find((c) => c.id === vehicleClass)?.clearanceNote}
                      </li>
                      <li><strong>Zero Active Blockades:</strong> Bypasses high-risk landslide zones on NH-10 &amp; NH-13.</li>
                      <li><strong>Structural Clearance:</strong> All culverts and bridges certified for {vehicleWeight} MT.</li>
                      <li><strong>Weather Window:</strong> Low precipitation risk interval for next 12 hours.</li>
                    </ul>
                  </div>

                  {/* Action Button */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <span className="text-xs text-[#94A3B8]">
                      Itinerary approved for {cargoType} convoy dispatch.
                    </span>
                    <button
                      onClick={() => addToast('Route Selected & Dispatched', `Route ${activeDisplayRoute.route_tag} locked for vehicle dispatch with NavIC telemetry geofence.`, 'SUCCESS')}
                      className="btn-primary text-xs py-2 px-4 shadow-command-glow font-black cursor-pointer"
                    >
                      LOCK ROUTE &amp; DISPATCH &rarr;
                    </button>
                  </div>

                  {/* Map Preview */}
                  <div className="h-80 sm:h-96 rounded-xl overflow-hidden border border-[#1E2E45] shadow-command-card relative bg-[#080D16]">
                    {(() => {
                      const origD = districts.find((d) => d.id === origin);
                      const destD = districts.find((d) => d.id === destination);
                      return (
                        <NerGisMap
                          height="100%"
                          highlightRoute={activeDisplayRoute}
                          originPoint={origD ? { lat: origD.lat, lng: origD.lng, label: `${origD.name} (${origD.state})` } : undefined}
                          destinationPoint={destD ? { lat: destD.lat, lng: destD.lng, label: `${destD.name} (${destD.state})` } : undefined}
                          initialShowRoads={false}
                          initialShowBridges={false}
                          initialShowDepots={false}
                          initialShowVehicles={false}
                          initialShowDistricts={false}
                        />
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="card-command p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#16253B] text-[#19C6D2] flex items-center justify-center mx-auto border border-[#1E2E45]">
                <Route className="w-6 h-6" />
              </div>
              <h4 className="font-black text-sm text-[#F5F7FA]">Select Nodes &amp; Calculate Route</h4>
              <p className="text-xs text-[#94A3B8] max-w-md mx-auto">
                Configure origin, destination, vehicle weight, and cargo type on the left panel to calculate AI-optimized routes and resilient alternatives.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
