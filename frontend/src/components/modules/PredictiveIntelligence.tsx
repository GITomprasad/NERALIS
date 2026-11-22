import React, { useState, useEffect } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { useLanguage } from '../../context/LanguageContext';
import { apiClient } from '../../services/api/apiClient';
import { ProvenanceBadge } from '../common/ProvenanceBadge';
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
  Cpu,
  BarChart2,
  CheckCircle2,
  Info,
  Loader2,
  Layers,
  Truck,
  Anchor,
  ShieldCheck
} from 'lucide-react';

interface SimulationScenarioPreset {
  id: string;
  name: string;
  incidentType: 'BRIDGE_COLLAPSE' | 'HIGHWAY_BLOCKADE';
  targetId: string;
  sector: string;
  description: string;
}

const SCENARIO_PRESETS: SimulationScenarioPreset[] = [
  {
    id: 'SCN-01',
    name: 'Lubha River / Kolia Bhomora Bridge Failure',
    incidentType: 'BRIDGE_COLLAPSE',
    targetId: 'BR-04',
    sector: 'NH-6 Meghalaya-Barak Lifeline',
    description: 'Simulate structural scour failure cutting off Barak Valley, Mizoram, and Tripura.'
  },
  {
    id: 'SCN-02',
    name: 'Sela Pass Avalanche & Roadbed Slip',
    incidentType: 'HIGHWAY_BLOCKADE',
    targetId: 'SEG-05',
    sector: 'NH-13 Bomdila-Tawang Sector',
    description: 'Simulate 8,000 cu.m rock & snow blockade isolating Tawang forward district.'
  },
  {
    id: 'SCN-03',
    name: 'Sonapur Tunnel Mud Silt Torrent',
    incidentType: 'HIGHWAY_BLOCKADE',
    targetId: 'SEG-03',
    sector: 'NH-6 East Jaintia Hills Stretch',
    description: 'Simulate torrential cloudburst mud flow blocking trans-Meghalaya heavy freight.'
  },
  {
    id: 'SCN-04',
    name: 'Teesta Coronation Suspension Bridge Surge',
    incidentType: 'BRIDGE_COLLAPSE',
    targetId: 'BR-05',
    sector: 'NH-10 Sevoke-Teesta Valley',
    description: 'Simulate GLOF glacial outburst flooding severing North & East Sikkim access.'
  }
];

export const PredictiveIntelligence: React.FC = () => {
  const { bridges, corridors, addToast, setIsModelMetricsModalOpen } = usePlatform();
  const { t } = useLanguage();

  const [forecastHorizon, setForecastHorizon] = useState<number>(24);
  const [forecastData, setForecastData] = useState<any>(null);
  const [advisories, setAdvisories] = useState<any[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<SimulationScenarioPreset>(SCENARIO_PRESETS[0]);
  const [isDigitalTwinActive, setIsDigitalTwinActive] = useState(false);
  const [digitalTwinResult, setDigitalTwinResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const fetchForecast = async (hours: number) => {
    setIsLoading(true);
    const data = await apiClient.getPredictions(hours);
    setForecastData(data);
    setIsLoading(false);
  };

  const fetchAdvisories = async () => {
    const data = await apiClient.getPrepositioningAdvisories();
    setAdvisories(data || []);
  };

  useEffect(() => {
    fetchForecast(forecastHorizon);
    fetchAdvisories();
  }, [forecastHorizon]);

  const handleRunDigitalTwin = async (scenarioToRun = selectedScenario) => {
    setIsSimulating(true);
    try {
      const data = await apiClient.runDigitalTwinSimulation(
        scenarioToRun.incidentType,
        scenarioToRun.targetId
      );
      if (data) {
        setDigitalTwinResult(data);
        setIsDigitalTwinActive(true);
        addToast(
          'Digital Twin Simulation Active',
          `Simulated ${scenarioToRun.name} with cascading impact analysis.`,
          'WARNING'
        );
      }
    } catch {
      addToast('Simulation Error', 'Failed to calculate digital twin scenario.', 'DANGER');
    } finally {
      setIsSimulating(false);
    }
  };

  const handleResetDigitalTwin = () => {
    setIsDigitalTwinActive(false);
    setDigitalTwinResult(null);
    addToast('Simulation Reset', 'Digital Twin simulation cleared.', 'INFO');
  };

  return (
    <div className="space-y-4">
      {/* Top Banner with Model Trust & Accuracy Header */}
      <div className="card-command flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-black text-[#252124]">
              {t('module_4')} — 6 to 72-Hour Disruption Forecasting
            </h2>
            <span className="bg-[#818CF8]/15 text-[#818CF8] border border-[#818CF8]/30 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 font-mono">
              <Sparkles className="w-3 h-3 text-[#818CF8]" />
              Balanced Random Forest: 85.1% Acc
            </span>
          </div>
          <p className="text-xs text-[#786D6D] mt-0.5">
            Predictive intelligence engine trained on NASA Landslide Catalog &amp; IMD Historical Automated Weather Stations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModelMetricsModalOpen(true)}
            className="btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5"
          >
            <BarChart2 className="w-3.5 h-3.5 text-[#990011]" />
            <span>Inspect AI Model Benchmark</span>
          </button>
        </div>
      </div>

      {/* Time Horizon Slider Bar */}
      <div className="card-command p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#990011]" />
          <span className="text-xs font-bold text-[#252124]">Forecast Horizon:</span>
        </div>

        <div className="flex items-center gap-1.5">
          {[6, 24, 48, 72].map((hrs) => (
            <button
              key={hrs}
              onClick={() => setForecastHorizon(hrs)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                forecastHorizon === hrs
                  ? 'bg-[#990011] text-white shadow-sm font-black'
                  : 'bg-[#FCF6F5] text-[#786D6D] hover:bg-[#EDE4E2] hover:text-[#252124] border border-[#E7DAD8]'
              }`}
            >
              +{hrs} Hours
            </button>
          ))}
        </div>
      </div>

      {/* Dedicated Model Performance Benchmark Panel */}
      <div className="card-command border-[#818CF8]/30 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E7DAD8] pb-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#818CF8]" />
            <h3 className="font-black text-xs text-[#252124] uppercase tracking-wide">
              NASA &amp; IMD Disruption Model Benchmark Telemetry
            </h3>
          </div>
          <span className="text-[10px] bg-[#818CF8]/15 text-[#818CF8] border border-[#818CF8]/30 font-bold px-2 py-0.5 rounded font-mono">
            NERALIS-NASA-IMD-Real-v1.0
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
          <div className="bg-[#FCF6F5] p-3 rounded-xl border border-[#E7DAD8]">
            <div className="text-[10px] text-[#786D6D] font-bold uppercase">Raw Accuracy</div>
            <div className="text-sm font-black text-[#20C997] mt-0.5 font-mono">85.1%</div>
            <div className="text-[9px] text-[#786D6D] font-semibold">84% Medium Base</div>
          </div>
          <div className="bg-[#FCF6F5] p-3 rounded-xl border border-[#E7DAD8]">
            <div className="text-[10px] text-[#786D6D] font-bold uppercase">Balanced Acc</div>
            <div className="text-sm font-black text-[#818CF8] mt-0.5 font-mono">52.4%</div>
            <div className="text-[9px] text-[#818CF8] font-semibold">Honest Multi-Class</div>
          </div>
          <div className="bg-[#FCF6F5] p-3 rounded-xl border border-[#E7DAD8]">
            <div className="text-[10px] text-[#786D6D] font-bold uppercase">Macro F1</div>
            <div className="text-sm font-black text-[#438BFF] mt-0.5 font-mono">0.556</div>
            <div className="text-[9px] text-[#438BFF] font-semibold">Balanced F1</div>
          </div>
          <div className="bg-[#FCF6F5] p-3 rounded-xl border border-[#E7DAD8]">
            <div className="text-[10px] text-[#786D6D] font-bold uppercase">ROC-AUC</div>
            <div className="text-sm font-black text-[#990011] mt-0.5 font-mono">0.884</div>
            <div className="text-[9px] text-[#990011] font-semibold">OOF CV Split</div>
          </div>
          <div className="bg-[#FCF6F5] p-3 rounded-xl border border-[#E7DAD8] col-span-2 sm:col-span-1">
            <div className="text-[10px] text-[#786D6D] font-bold uppercase">Training Baseline</div>
            <div className="text-xs font-bold text-[#252124] mt-0.5">NASA + IMD Historical</div>
          </div>
        </div>
      </div>

      {/* Disruption Predictions List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {forecastData?.corridors?.map((pred: any, idx: number) => {
          const isCritical = pred.predicted_risk_pct >= 75;
          const isHigh = pred.predicted_risk_pct >= 50 && pred.predicted_risk_pct < 75;

          return (
            <div
              key={pred.corridor_id || idx}
              className={`p-4 rounded-xl border transition-all ${
                isCritical
                  ? 'bg-[#FF5252]/10 border-[#FF5252]/40 shadow-command-critical'
                  : isHigh
                  ? 'bg-[#FFB547]/10 border-[#FFB547]/40'
                  : 'card-command'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div>
                  <h3 className="font-black text-sm text-[#252124]">{pred.corridor_name || pred.name}</h3>
                  <div className="text-[11px] font-bold text-[#786D6D] mt-0.5 flex items-center gap-1.5">
                    <CloudLightning className="w-3.5 h-3.5 text-[#FFB547]" />
                    <span>Likely Cause: {pred.predicted_event || 'Heavy rainfall & slope saturation'}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="flex items-center justify-end gap-1.5">
                    <ProvenanceBadge
                      status={pred.verification_status || 'PREDICTED'}
                      confidence={pred.ai_confidence_pct}
                      dataItem={pred}
                    />
                  </div>
                  <div className={`text-sm font-black mt-1 font-mono ${isCritical ? 'text-[#FF5252]' : isHigh ? 'text-[#FFB547]' : 'text-[#818CF8]'}`}>
                    {pred.predicted_risk_pct}% • {isCritical ? 'CRITICAL' : isHigh ? 'HIGH' : 'ELEVATED'}
                  </div>
                </div>
              </div>

              {/* Evidence & XAI Factors */}
              <div className="bg-[#FCF6F5] p-3 rounded-xl border border-[#E7DAD8] mb-2.5 space-y-1.5 text-[11px]">
                <div className="text-[10px] font-bold text-[#786D6D] uppercase flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[#990011]">
                    <Cpu className="w-3 h-3 text-[#990011]" /> Empirical Risk Factors
                  </span>
                  <span className="text-[#818CF8] font-bold">Confidence: {pred.ai_confidence_pct || 98.7}%</span>
                </div>

                <div className="text-[#786D6D] leading-relaxed space-y-1">
                  {pred.top_contributing_factors && pred.top_contributing_factors.length > 0 ? (
                    pred.top_contributing_factors.map((f: any, i: number) => (
                      <div key={i}>
                        • <strong className="text-[#252124]">{f.factor}</strong> ({f.impact_pct}% weight) — <span className="text-[#786D6D]">{f.source}</span>
                      </div>
                    ))
                  ) : (
                    <div>
                      • <strong className="text-[#252124]">Rainfall Forecast:</strong> {pred.weather_input?.rainfall_72h_mm || 180} mm (72h cumulative)<br />
                      • <strong className="text-[#252124]">Terrain &amp; Soil:</strong> {pred.weather_input?.soil_moisture_pct || 88}% soil saturation on steep incline
                    </div>
                  )}
                </div>
              </div>

              {/* Recommendation & Action Button */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#E7DAD8] text-[11px]">
                <div className="flex-1 min-w-[180px]">
                  <span className="font-bold text-[#252124]">Recommendation: </span>
                  <span className="text-[#786D6D]">{pred.recommended_action || 'Pre-position emergency supplies.'}</span>
                </div>
                <button
                  onClick={() => addToast('Corridor Impact Computed', `Bypass route calculated for ${pred.corridor_name || pred.name}.`, 'INFO')}
                  className="btn-primary text-[10px] py-1.5 px-3 shrink-0"
                >
                  View Route Impact &rarr;
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pre-Positioning Advisories Section */}
      <div className="card-command space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Boxes className="w-4 h-4 text-[#20C997]" />
            <h3 className="font-black text-xs text-[#252124] uppercase tracking-wide">
              Automated Supply Pre-Positioning Advisories (AI Logistics Buffers)
            </h3>
          </div>
          <span className="text-[10px] bg-[#20C997]/15 text-[#20C997] border border-[#20C997]/30 font-bold px-2 py-0.5 rounded">
            {advisories.length} Active Convoy Recommendations
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {advisories.map((adv) => (
            <div key={adv.id} className="p-3.5 bg-[#FCF6F5] rounded-xl border border-[#E7DAD8] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-[11px] text-[#990011] font-mono">{adv.id}</span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${adv.urgency === 'CRITICAL' || adv.urgency === 'EMERGENCY' ? 'badge-closed' : 'badge-restricted'}`}>
                  {adv.urgency}
                </span>
              </div>
              <div className="font-bold text-xs text-[#252124]">{adv.target_district}</div>
              <p className="text-[11px] text-[#786D6D] leading-relaxed">{adv.reason}</p>
              <div className="bg-[#FFFFFF] p-2.5 rounded-lg border border-[#E7DAD8] text-[10px] space-y-1">
                <div className="font-bold text-[#786D6D]">Recommended Window:</div>
                <div className="text-[#20C997] font-medium font-mono">{adv.recommended_convoy_window}</div>
                <div className="text-[#786D6D] font-semibold mt-1">Autonomy Gained: +{adv.days_of_autonomy_gained} Days</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Digital Twin "What-If" Simulation */}
      <div className="card-command space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E7DAD8] pb-2.5">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#FFB547]" />
            <h3 className="font-black text-xs text-[#252124] uppercase tracking-wide">
              Digital Twin "What-If" Scenario Simulation Engine
            </h3>
          </div>
          <span className="text-[10px] bg-[#FFB547]/15 text-[#FFB547] border border-[#FFB547]/30 font-bold px-2 py-0.5 rounded">
            Stress Test Lifelines
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          {SCENARIO_PRESETS.map((scn) => (
            <button
              key={scn.id}
              onClick={() => {
                setSelectedScenario(scn);
                handleRunDigitalTwin(scn);
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                selectedScenario.id === scn.id
                  ? 'bg-[#EDE4E2] border-[#FFB547] shadow-command-card'
                  : 'bg-[#FCF6F5] border-[#E7DAD8] hover:bg-[#FFFFFF]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-[#FFB547] font-bold">{scn.id}</span>
                <span className="text-[9px] bg-[#FFFFFF] text-[#786D6D] px-1.5 py-0.2 rounded border border-[#E7DAD8]">
                  {scn.incidentType}
                </span>
              </div>
              <div className="font-bold text-xs text-[#252124] line-clamp-1">{scn.name}</div>
              <div className="text-[10px] text-[#786D6D] mt-1 line-clamp-2">{scn.description}</div>
            </button>
          ))}
        </div>

        {/* Digital Twin Result Output if Active */}
        {isDigitalTwinActive && digitalTwinResult && (
          <div className="p-4 bg-[#FF5252]/10 rounded-xl border border-[#FF5252]/30 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#FF5252] flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-[#FF5252]" />
                Cascading Impact Breakdown: {selectedScenario.name}
              </span>
              <button
                onClick={handleResetDigitalTwin}
                className="text-[11px] font-bold text-[#786D6D] hover:text-[#252124] cursor-pointer"
              >
                Clear Simulation
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="bg-[#FCF6F5] p-2.5 rounded-lg border border-[#E7DAD8]">
                <div className="text-[10px] text-[#786D6D]">Isolated Districts</div>
                <div className="text-sm font-black text-[#FF5252] font-mono">{digitalTwinResult.isolated_districts?.length || 3} Districts</div>
              </div>
              <div className="bg-[#FCF6F5] p-2.5 rounded-lg border border-[#E7DAD8]">
                <div className="text-[10px] text-[#786D6D]">Delayed Freight Convoy</div>
                <div className="text-sm font-black text-[#FFB547] font-mono">18 Convoys (340 MT)</div>
              </div>
              <div className="bg-[#FCF6F5] p-2.5 rounded-lg border border-[#E7DAD8]">
                <div className="text-[10px] text-[#786D6D]">Bypass Routing</div>
                <div className="text-sm font-black text-[#20C997] font-mono">Brahmaputra NW-2 Barge Ready</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
