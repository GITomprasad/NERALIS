import React, { useState, useEffect } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  CloudLightning,
  AlertOctagon,
  Boxes,
  Activity,
  Sliders,
  Play,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Cpu
} from 'lucide-react';

export const PredictiveIntelligence: React.FC = () => {
  const { bridges, corridors, addToast } = usePlatform();
  const { t } = useLanguage();

  const [forecastHorizon, setForecastHorizon] = useState<number>(24);
  const [forecastData, setForecastData] = useState<any>(null);
  const [advisories, setAdvisories] = useState<any[]>([]);
  const [isDigitalTwinActive, setIsDigitalTwinActive] = useState(false);
  const [simulatedScenario, setSimulatedScenario] = useState<'BRIDGE_COLLAPSE' | 'HIGHWAY_BLOCKADE'>('BRIDGE_COLLAPSE');
  const [digitalTwinResult, setDigitalTwinResult] = useState<any>(null);

  const fetchForecast = async (hours: number) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/predictions/72h?hours=${hours}`);
      const data = await res.json();
      setForecastData(data);
    } catch {
      // Fallback
      setForecastData({
        forecast_horizon_hours: hours,
        monsoon_intensity_index: 'SEVERE (Active Brahmaputra Cloudburst)',
        highest_risk_state: 'Sikkim & Arunachal Pradesh',
        at_risk_corridors_count: 5,
        corridors: corridors.map((c) => ({
          corridor_id: c.id,
          name: c.name,
          base_risk: c.risk_score,
          predicted_risk_pct: Math.min(100, Math.round(c.risk_score * (hours === 72 ? 1.4 : hours === 48 ? 1.25 : 1.0))),
          forecast_event: c.risk_score > 60 ? 'Landslide & Debris Flow Risk' : 'Wet Pavement & Mountain Fog',
          current_status: c.status,
          ai_confidence_pct: 92,
          weather_input: {
            rainfall_72h_mm: c.risk_score > 60 ? 240 : 45,
            soil_moisture_pct: c.risk_score > 60 ? 92 : 40,
            slope_gradient_deg: 36
          }
        })).sort((a, b) => b.predicted_risk_pct - a.predicted_risk_pct)
      });
    }
  };

  const fetchAdvisories = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/predictions/prepositioning');
      const data = await res.json();
      setAdvisories(data.advisories || []);
    } catch {
      setAdvisories([
        {
          id: 'PRE-POS-01',
          target_district: 'AR-TAW (Tawang, Arunachal Pradesh)',
          source_depot: 'DEP-01 (Guwahati Central Hub)',
          reason: 'Sela Pass sector predicted 79% landslide risk within 48h.',
          recommended_transfer: { critical_vaccines_units: 4000, blood_units: 150, food_grains_quintals: 1200, diesel_reserve_kl: 250 },
          recommended_convoy_window: 'Departure by 05:00 AM Tomorrow (6 Light 4WD Trucks)',
          urgency: 'CRITICAL',
          days_of_autonomy_gained: 18
        },
        {
          id: 'PRE-POS-02',
          target_district: 'SK-MANG (Mangan, North Sikkim)',
          source_depot: 'DEP-01 (Guwahati / Siliguri Reserve)',
          reason: 'Teesta river gauge exceeding warning level; NH-10 closed.',
          recommended_transfer: { critical_vaccines_units: 2500, blood_units: 80, food_grains_quintals: 850, water_purification_tablets_packs: 5000 },
          recommended_convoy_window: 'Helicopter Air-Bridge via Bagdogra/Gangtok Heliport',
          urgency: 'EMERGENCY',
          days_of_autonomy_gained: 14
        }
      ]);
    }
  };

  useEffect(() => {
    fetchForecast(forecastHorizon);
    fetchAdvisories();
  }, [forecastHorizon]);

  const handleRunDigitalTwin = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/predictions/digital-twin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incident_type: simulatedScenario,
          target_id: simulatedScenario === 'BRIDGE_COLLAPSE' ? 'BR-04' : 'SEG-05'
        })
      });
      const data = await res.json();
      setDigitalTwinResult(data);
      setIsDigitalTwinActive(true);
      addToast('Digital Twin Simulation Active', 'Scenario simulated with cascading delay analysis.', 'WARNING');
    } catch {
      setDigitalTwinResult({
        scenario: simulatedScenario === 'BRIDGE_COLLAPSE' ? 'Simulated Failure: Lubha River Suspension Bridge (NH-6)' : 'Simulated Total Blockade: Bomdila-Tawang (NH-13)',
        immediate_impact: {
          cut_off_districts: ['Silchar (Cachar)', 'Aizawl (Mizoram)', 'Agartala (Tripura)'],
          isolated_population: '4.2 Million',
          daily_freight_disrupted_tons: 3800,
          delay_increase_hrs: 34.5
        },
        recommended_mitigation: [
          '1. Activate National Waterway 2 (NW-2) Ro-Ro barge service from Pandu to Karimganj.',
          '2. Divert light essential medical traffic via Badarpur-Jowai old hill bypass with 15T limit.',
          '3. Mobilize Border Roads Organisation (BRO) 70R Bailey bridge emergency crew (ETA 48h).'
        ],
        ndma_severity_rating: 'LEVEL 4 STATE DISASTER ALERT'
      });
      setIsDigitalTwinActive(true);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white p-4 rounded-xl border border-[#D1D5DB] flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div>
          <h2 className="text-base font-black text-[#1E3A5F]">
            {t('module_4')} — 6 to 72-Hour Disruption Forecasting
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            ML models forecasting landslides, flash floods, and bridge structural anomalies before logistics failure
          </p>
        </div>

        {/* Forecast Horizon Buttons */}
        <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-lg text-xs font-bold">
          <span className="text-gray-500 px-2 text-[10px] uppercase">Forecast Horizon:</span>
          {[6, 24, 48, 72].map((hrs) => (
            <button
              key={hrs}
              onClick={() => setForecastHorizon(hrs)}
              className={`px-3 py-1.5 rounded-md transition-all ${
                forecastHorizon === hrs
                  ? 'bg-[#1E3A5F] text-white shadow-xs'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              +{hrs} Hours
            </button>
          ))}
        </div>
      </div>

      {/* AI Pre-Positioning Advisor (SIH26002 High-Value Feature) */}
      <div className="bg-white p-5 rounded-xl border border-[#D1D5DB] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Boxes className="w-5 h-5 text-emerald-700" />
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-[#1E3A5F]">
                AI Emergency Supply Pre-Positioning Advisor
              </h3>
              <p className="text-[11px] text-gray-500">
                Triggered automatically when predicted disruption risk exceeds 70% on lifeline corridors
              </p>
            </div>
          </div>
          <span className="badge-open">Active Stock Safeguards</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {advisories.map((adv) => (
            <div
              key={adv.id}
              className="p-4 rounded-xl border border-amber-300 bg-amber-50/40 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900">{adv.target_district}</span>
                <span className="bg-red-600 text-white font-bold px-2 py-0.5 rounded text-[9px] uppercase">
                  {adv.urgency}
                </span>
              </div>
              <p className="text-gray-700 text-[11px]">{adv.reason}</p>
              <div className="p-2.5 bg-white rounded-lg border border-amber-200 text-[11px] space-y-1">
                <div className="font-bold text-gray-800">Recommended Stock Transfer:</div>
                <div className="text-emerald-800 font-semibold">
                  • Vaccines: {adv.recommended_transfer.critical_vaccines_units?.toLocaleString()} doses | Food Grains: {adv.recommended_transfer.food_grains_quintals} Qtl
                </div>
                <div className="text-gray-600">
                  • Window: <strong>{adv.recommended_convoy_window}</strong>
                </div>
              </div>
              <div className="text-[10px] text-emerald-800 font-bold">
                ✓ Secures {adv.days_of_autonomy_gained} days of district supply autonomy
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disruption Risk Forecasting Cards */}
      <div className="bg-white p-5 rounded-xl border border-[#D1D5DB] shadow-xs space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-[#1E3A5F] flex items-center gap-2">
          <CloudLightning className="w-4 h-4 text-amber-600" />
          Corridor Landslide & Flood Probability (+{forecastHorizon}h Ahead)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {forecastData?.corridors?.slice(0, 6).map((c: any) => (
            <div
              key={c.corridor_id}
              className="p-3.5 rounded-xl border border-gray-200 bg-[#F8FAFC] space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-gray-700 text-[11px]">{c.corridor_id}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    c.predicted_risk_pct > 70
                      ? 'bg-red-100 text-red-800'
                      : c.predicted_risk_pct > 40
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {c.predicted_risk_pct}% Disruption Risk
                </span>
              </div>

              <div className="font-bold text-gray-900 truncate">{c.name}</div>
              <div className="text-[11px] text-gray-600 font-medium">{c.forecast_event}</div>

              <div className="pt-2 border-t border-gray-200 text-[10px] text-gray-500 flex justify-between">
                <span>72h Rain: {c.weather_input.rainfall_72h_mm} mm</span>
                <span>Soil Moisture: {c.weather_input.soil_moisture_pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Digital Twin "What-If" Scenario Simulation Sandbox */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-700 shadow-xl space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-sky-400" />
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Digital Twin 'What-If' Disaster Simulation Sandbox
              </h3>
              <p className="text-[11px] text-slate-400">
                Simulate catastrophic bridge collapse or highway blockades to test cascading logistics resilience
              </p>
            </div>
          </div>
          <span className="bg-sky-500/20 text-sky-300 px-2.5 py-1 rounded text-[10px] font-bold border border-sky-400/30">
            State Disaster Management Authority (SDMA) Tool
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">Select Scenario</label>
            <select
              value={simulatedScenario}
              onChange={(e) => setSimulatedScenario(e.target.value as any)}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-white text-xs font-semibold focus:outline-none focus:border-sky-400"
            >
              <option value="BRIDGE_COLLAPSE">💥 Lubha River Suspension Bridge Failure (NH-6)</option>
              <option value="HIGHWAY_BLOCKADE">🪨 Total Sela Pass Avalanche Blockade (NH-13)</option>
            </select>
          </div>

          <div className="sm:col-span-2 flex items-end">
            <button
              onClick={handleRunDigitalTwin}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <Play className="w-4 h-4" /> Run Digital Twin Stress Test Simulation
            </button>
          </div>
        </div>

        {/* Simulation Output Card */}
        {isDigitalTwinActive && digitalTwinResult && (
          <div className="bg-slate-800 p-4 rounded-xl border border-red-500/40 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="font-black text-red-400 text-xs uppercase">
                {digitalTwinResult.ndma_severity_rating}
              </span>
              <span className="text-[10px] text-slate-400">Simulated by AI Engine</span>
            </div>

            <h4 className="font-bold text-white text-sm">{digitalTwinResult.scenario}</h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="bg-slate-900/80 p-2 rounded border border-slate-700">
                <div className="text-[10px] text-slate-400">Cut-Off Districts</div>
                <div className="text-sm font-black text-amber-400">
                  {digitalTwinResult.immediate_impact.cut_off_districts.length} Districts
                </div>
              </div>
              <div className="bg-slate-900/80 p-2 rounded border border-slate-700">
                <div className="text-[10px] text-slate-400">Isolated Population</div>
                <div className="text-sm font-black text-red-400">
                  {digitalTwinResult.immediate_impact.isolated_population}
                </div>
              </div>
              <div className="bg-slate-900/80 p-2 rounded border border-slate-700">
                <div className="text-[10px] text-slate-400">Disrupted Daily Freight</div>
                <div className="text-sm font-black text-sky-400">
                  {digitalTwinResult.immediate_impact.daily_freight_disrupted_tons} MT
                </div>
              </div>
              <div className="bg-slate-900/80 p-2 rounded border border-slate-700">
                <div className="text-[10px] text-slate-400">Detour Delay Added</div>
                <div className="text-sm font-black text-amber-300">
                  +{digitalTwinResult.immediate_impact.delay_increase_hrs} hrs
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-900 rounded-lg border border-slate-700 space-y-1">
              <span className="font-bold text-emerald-400 text-xs">
                AI Automated Mitigation Plan:
              </span>
              {digitalTwinResult.recommended_mitigation.map((m: string, idx: number) => (
                <div key={idx} className="text-[11px] text-slate-300">
                  {m}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
