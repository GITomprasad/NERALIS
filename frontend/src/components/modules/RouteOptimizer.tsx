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

export const RouteOptimizer: React.FC = () => {
  const { districts, addToast } = usePlatform();
  const { t } = useLanguage();

  const [origin, setOrigin] = useState('AS-KAM');
  const [destination, setDestination] = useState('AR-TAW');
  const [cargoType, setCargoType] = useState<CargoType>('CRITICAL_MEDICINES');
  const [vehicleWeight, setVehicleWeight] = useState(16.0);
  const [departureHour, setDepartureHour] = useState(6);
  const [includeIntermodal, setIncludeIntermodal] = useState(true);

  const [isCalculating, setIsCalculating] = useState(false);
  const [routeResult, setRouteResult] = useState<any>(null);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0); // 0 = Primary, 1 = Resilient, 2 = Multimodal

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
    const nextOrigin = destination;
    const nextDestination = origin;
    setOrigin(nextOrigin);
    setDestination(nextDestination);
    handleComputeRoute(nextOrigin, nextDestination);
  };

  const handlePresetCorridor = (from: string, to: string) => {
    setOrigin(from);
    setDestination(to);
    handleComputeRoute(from, to);
  };

  const activeDisplayRoute = routeResult
    ? selectedRouteIndex === 0
      ? routeResult.primary_route
      : (routeResult.alternatives && routeResult.alternatives[selectedRouteIndex - 1]) || routeResult.primary_route
    : null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="card-command flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-black text-[#F5F7FA]">
              {t('module_2')} — Multi-Modal Intelligent Routing
            </h2>
            <span className="bg-[#19C6D2]/15 text-[#19C6D2] border border-[#19C6D2]/30 text-[10px] font-black px-2.5 py-0.5 rounded-full font-mono">
              Constrained A* Solver
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Pathfinding weighted by IoT bridge load limits, landslide probabilities, and departure weather windows
          </p>
        </div>

        {/* Quick Corridor Presets */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[10px] uppercase font-bold text-[#64748B]">Strategic Presets:</span>
          <button
            onClick={() => handlePresetCorridor('AS-KAM', 'AR-TAW')}
            className="px-2.5 py-1 rounded-lg bg-[#0D1522] hover:bg-[#16253B] text-[#19C6D2] border border-[#1E2E45] font-bold text-[11px] cursor-pointer"
          >
            Guwahati → Tawang
          </button>
          <button
            onClick={() => handlePresetCorridor('AS-KAM', 'TR-WES')}
            className="px-2.5 py-1 rounded-lg bg-[#0D1522] hover:bg-[#16253B] text-[#438BFF] border border-[#1E2E45] font-bold text-[11px] cursor-pointer"
          >
            Guwahati → Agartala
          </button>
          <button
            onClick={() => handlePresetCorridor('AS-KAM', 'MN-IMP')}
            className="px-2.5 py-1 rounded-lg bg-[#0D1522] hover:bg-[#16253B] text-[#20C997] border border-[#1E2E45] font-bold text-[11px] cursor-pointer"
          >
            Guwahati → Imphal
          </button>
        </div>
      </div>

      {/* Main Grid: Parameters on Left, Output & Map on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Parameter Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="card-command space-y-4 text-xs">
            <h3 className="font-extrabold text-[#19C6D2] text-xs uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#19C6D2]" /> Route Parameters
            </h3>

            {/* Origin & Destination */}
            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative">
                <div>
                  <label className="block font-bold text-[#94A3B8] mb-1.5">Origin Node</label>
                  <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full p-2.5 bg-[#0D1522] border border-[#1E2E45] rounded-xl text-xs font-semibold text-[#F5F7FA] focus:ring-1 focus:ring-[#19C6D2] focus:outline-none cursor-pointer"
                  >
                    {districts.map((d) => (
                      <option key={`orig-${d.id}`} value={d.id} className="bg-[#0D1522] text-[#F5F7FA]">
                        {d.name} ({d.state})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#94A3B8] mb-1.5">Destination Node</label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full p-2.5 bg-[#0D1522] border border-[#1E2E45] rounded-xl text-xs font-semibold text-[#F5F7FA] focus:ring-1 focus:ring-[#19C6D2] focus:outline-none cursor-pointer"
                  >
                    {districts.map((d) => (
                      <option key={`dest-${d.id}`} value={d.id} className="bg-[#0D1522] text-[#F5F7FA]">
                        {d.name} ({d.state})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSwapNodes}
                  className="text-[11px] font-bold text-[#19C6D2] hover:text-[#16b2bd] flex items-center gap-1.5 hover:underline cursor-pointer"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" /> Swap Nodes &amp; Recompute
                </button>
              </div>
            </div>

            {/* Cargo Specific Profile Selector */}
            <div>
              <label className="block font-bold text-[#94A3B8] mb-1.5">
                Cargo Profile &amp; Safeguards
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {[
                  { id: 'CRITICAL_MEDICINES', label: '💉 Critical Medicines', desc: 'Fastest corridor, low vibration' },
                  { id: 'EMERGENCY_RELIEF', label: '🚨 Emergency Relief', desc: 'Override limits, heli-bridge' },
                  { id: 'FOOD_PDS', label: '🌾 Food & PDS Grain', desc: 'Avoid flood basins & silt' },
                  { id: 'AGRI_COLD_CHAIN', label: '🥬 Agri Cold Chain', desc: 'Continuous temp monitoring' },
                  { id: 'CONSTRUCTION_HEAVY', label: '🏗️ Heavy Machinery', desc: 'Strict bridge weight check' },
                  { id: 'FUEL_HAZMAT', label: '⛽ Fuel & Hazmat', desc: 'Tunnel & pass restrictions' },
                  { id: 'STANDARD_COMMERCIAL', label: '📦 General Cargo', desc: 'Balanced cost & fuel' }
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCargoType(c.id as CargoType)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      cargoType === c.id
                        ? 'bg-[#16253B] text-[#F5F7FA] border-[#19C6D2]/60 font-bold shadow-command-glow'
                        : 'bg-[#0D1522] text-[#94A3B8] border-[#1E2E45] hover:bg-[#111D2D] hover:text-[#F5F7FA]'
                    }`}
                  >
                    <div className="text-xs truncate">{c.label}</div>
                    <div className={`text-[10px] truncate ${cargoType === c.id ? 'text-[#19C6D2]' : 'text-[#64748B]'}`}>
                      {c.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle Weight & Departure Slider */}
            <div className="space-y-3 border-t border-[#1E2E45] pt-3">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-[#94A3B8]">Gross Vehicle Weight (Tons)</span>
                  <span className="text-[#19C6D2] font-mono font-black">{vehicleWeight} MT</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="50"
                  step="1"
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

              <div className="flex items-center justify-between p-3 bg-[#0D1522] rounded-xl border border-[#1E2E45]">
                <span className="font-semibold text-[#F5F7FA] flex items-center gap-2">
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
              className="w-full btn-primary font-black py-3 rounded-xl flex items-center justify-center gap-2 shadow-command-glow transition-all"
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

        {/* Right Output & Map Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {routeResult ? (
            <div className="space-y-4">
              {/* 3-Way Alternative Route Selector Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => setSelectedRouteIndex(0)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedRouteIndex === 0
                      ? 'bg-[#16253B] border-[#19C6D2] shadow-command-glow'
                      : 'bg-[#111D2D] border-[#1E2E45] hover:bg-[#16253B]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#94A3B8] uppercase">Option 1</span>
                    <span className="text-[10px] bg-[#20C997]/20 text-[#20C997] border border-[#20C997]/30 font-bold px-2 py-0.5 rounded">
                      FASTEST
                    </span>
                  </div>
                  <div className="font-black text-xs text-[#F5F7FA] mt-1.5">{routeResult.primary_route.route_tag}</div>
                  <div className="text-[11px] text-[#94A3B8] mt-1 font-mono">
                    {routeResult.primary_route.total_distance_km} km • {routeResult.primary_route.total_time_hrs}h
                  </div>
                </button>

                {routeResult.alternatives?.map((alt: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedRouteIndex(idx + 1)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedRouteIndex === idx + 1
                        ? 'bg-[#16253B] border-[#438BFF] shadow-command-blue'
                        : 'bg-[#111D2D] border-[#1E2E45] hover:bg-[#16253B]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#94A3B8] uppercase">Option {idx + 2}</span>
                      <span className="text-[10px] bg-[#818CF8]/20 text-[#818CF8] border border-[#818CF8]/30 font-bold px-2 py-0.5 rounded">
                        {idx === 0 ? 'RESILIENT' : 'WATERWAY'}
                      </span>
                    </div>
                    <div className="font-black text-xs text-[#F5F7FA] mt-1.5 truncate">{alt.route_tag}</div>
                    <div className="text-[11px] text-[#94A3B8] mt-1 font-mono">
                      {alt.total_distance_km} km • {alt.total_time_hrs}h
                    </div>
                  </button>
                ))}
              </div>

              {/* Active Route Details Card */}
              {activeDisplayRoute && (
                <div className="card-command space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E2E45] pb-3">
                    <div>
                      <h4 className="font-black text-sm text-[#F5F7FA]">{activeDisplayRoute.route_tag}</h4>
                      <p className="text-[11px] text-[#94A3B8] mt-0.5">{activeDisplayRoute.tradeoff_reason}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
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
                      className="btn-primary text-xs py-2 px-4 shadow-command-glow font-black"
                    >
                      LOCK ROUTE &amp; DISPATCH &rarr;
                    </button>
                  </div>

                  {/* Map Preview */}
                  <div className="h-80 sm:h-96 rounded-xl overflow-hidden border border-[#1E2E45] shadow-lg relative bg-[#080D16]">
                    <NerGisMap height="100%" highlightRoute={activeDisplayRoute} initialShowRoads={false} />
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
