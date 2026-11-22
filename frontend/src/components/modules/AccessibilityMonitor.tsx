import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { useLanguage } from '../../context/LanguageContext';
import { NerGisMap } from '../map/NerGisMap';
import {
  MapPin,
  Activity,
  Layers,
  Search,
  Filter,
  Eye,
  CheckCircle,
  AlertTriangle,
  Radio,
  Satellite,
  Maximize2,
  Minimize2,
  ChevronUp,
  ChevronDown,
  Compass,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Truck,
  TrendingUp,
  Clock,
  Info,
  ShieldAlert,
  ChevronRight,
  Zap
} from 'lucide-react';
import { ProvenanceBadge } from '../common/ProvenanceBadge';

export const AccessibilityMonitor: React.FC = () => {
  const {
    districts,
    corridors,
    bridges,
    alerts,
    vehicles,
    fieldReports,
    openDrawer,
    openProvenanceModal,
    selectedStateFilter,
    setSelectedStateFilter,
    isSidebarCollapsed,
    toggleSidebar
  } = usePlatform();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'MAP' | 'DISTRICTS' | 'BRIDGES' | 'SATELLITE'>('MAP');
  const [districtSearch, setDistrictSearch] = useState('');
  const [isCorridorDrawerOpen, setIsCorridorDrawerOpen] = useState(false);
  const [isIntelPanelOpen, setIsIntelPanelOpen] = useState(false);

  const filteredDistricts = districts.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(districtSearch.toLowerCase()) ||
      d.state.toLowerCase().includes(districtSearch.toLowerCase());
    const matchesState = selectedStateFilter === 'ALL' || d.state_id === selectedStateFilter;
    return matchesSearch && matchesState;
  });

  return (
    <div className="w-full h-full flex flex-col relative bg-[#E7E8D1] text-[#30342F]">
      {/* TAB 1: FULL-COVERAGE LIVE GIS MAP */}
      {activeTab === 'MAP' && (
        <div className="relative w-full flex-1 h-[calc(100vh-112px)] min-h-[460px] overflow-hidden bg-[#E7E8D1]">
          {/* Main Map Edge-to-Edge */}
          <NerGisMap
            height="100%"
            className="h-full w-full"
            initialShowRoads={true}
            initialShowBridges={true}
            initialShowDepots={true}
            initialShowVehicles={true}
            initialShowDistricts={true}
          />

          {/* Floating Top Controls */}
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            {/* Left Title & Status Indicator */}
            <div className="pointer-events-auto bg-[#FFFFFF]/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#D6D8C8] shadow-sm flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#A7BEAE]" />
              <div>
                <div className="flex items-center gap-2 font-semibold text-xs text-[#30342F]">
                  <span className="hidden sm:inline">NER GIS Command Center</span>
                  <span className="sm:hidden">NER Grid</span>
                  <span className="bg-[#B85042]/10 text-[#B85042] border border-[#B85042]/20 text-[10px] px-1.5 py-0.2 rounded font-mono font-medium">
                    89 Districts
                  </span>
                </div>
              </div>
            </div>

            {/* Center Tab Switcher */}
            <div className="pointer-events-auto bg-[#FFFFFF]/95 backdrop-blur-md p-1 rounded-xl border border-[#D6D8C8] shadow-sm flex items-center gap-1 text-xs font-medium overflow-x-auto max-w-[95vw] sm:max-w-none">
              <button
                onClick={() => setActiveTab('MAP')}
                className="px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer bg-[#B85042] text-white font-semibold"
              >
                🗺️ <span className="hidden sm:inline">GIS</span> Map
              </button>
              <button
                onClick={() => setActiveTab('DISTRICTS')}
                className="px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer text-[#74796F] hover:text-[#30342F] hover:bg-[#D5D8C3]"
              >
                📍 <span className="hidden sm:inline">89 </span>Districts
              </button>
              <button
                onClick={() => setActiveTab('BRIDGES')}
                className="px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer text-[#74796F] hover:text-[#30342F] hover:bg-[#D5D8C3]"
              >
                🌉 Bridges <span className="hidden sm:inline">({bridges.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('SATELLITE')}
                className="px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer text-[#74796F] hover:text-[#30342F] hover:bg-[#D5D8C3]"
              >
                🛰️ Sentinel-2
              </button>
            </div>

            {/* Right: State Filter & Intelligence Toggle */}
            <div className="pointer-events-auto flex items-center gap-2">
              {/* State Filter Dropdown */}
              <div className="bg-[#FFFFFF]/95 backdrop-blur-md px-2.5 py-1 rounded-xl border border-[#D6D8C8] shadow-sm flex items-center gap-1.5 text-xs font-medium text-[#30342F]">
                <Filter className="w-3.5 h-3.5 text-[#B85042]" />
                <span className="text-[#74796F] text-[10px] hidden md:inline">State:</span>
                <select
                  value={selectedStateFilter}
                  onChange={(e) => setSelectedStateFilter(e.target.value)}
                  className="bg-transparent text-[#30342F] text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All 8 States</option>
                  <option value="AS">Assam (AS)</option>
                  <option value="AR">Arunachal (AR)</option>
                  <option value="MN">Manipur (MN)</option>
                  <option value="ML">Meghalaya (ML)</option>
                  <option value="MZ">Mizoram (MZ)</option>
                  <option value="NL">Nagaland (NL)</option>
                  <option value="SK">Sikkim (SK)</option>
                  <option value="TR">Tripura (TR)</option>
                </select>
              </div>

              {/* Toggle Intelligence Panel Button */}
              <button
                onClick={() => setIsIntelPanelOpen(!isIntelPanelOpen)}
                className={`p-1.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isIntelPanelOpen
                    ? 'bg-[#B85042] text-white border-[#B85042]'
                    : 'bg-[#FFFFFF]/95 hover:bg-[#D5D8C3] text-[#30342F] border-[#D6D8C8]'
                }`}
                title="Toggle Risk Intelligence Stream"
              >
                <ShieldAlert className="w-4 h-4 text-[#D97706]" />
                <span className="hidden xl:inline">Intel</span>
              </button>
            </div>
          </div>

          {/* Universal Provenance Legend (Floating Top Left / Below Controls) */}
          <div className="absolute top-18 left-3 z-[1000] pointer-events-auto hidden md:block">
            <div className="bg-[#FFFFFF]/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-[#D6D8C8] shadow-sm space-y-1.5 text-[10px] text-[#30342F]">
              <div className="font-bold text-[#B85042] text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#A7BEAE]" /> Verification Provenance
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="bg-[#A7BEAE]/25 text-[#2C5242] border border-[#A7BEAE]/50 px-2 py-0.5 rounded-md font-semibold">● OBSERVED</span>
                <span className="bg-[#D5D8C3] text-[#30342F] border border-[#D6D8C8] px-2 py-0.5 rounded-md font-semibold">✓ VERIFIED</span>
                <span className="bg-[#D5D8C3] text-[#B85042] border border-[#B85042]/30 px-2 py-0.5 rounded-md font-semibold">✦ PREDICTED</span>
                <span className="bg-[#D5D8C3] text-[#30342F] border border-[#D6D8C8] px-2 py-0.5 rounded-md font-semibold">⌖ REPORTED</span>
                <span className="bg-[#F59E0B]/15 text-[#B45309] border border-[#F59E0B]/30 px-2 py-0.5 rounded-md font-semibold">⚗ DEMO</span>
              </div>
            </div>
          </div>

          {/* Right Intelligence Panel (Critical Alerts + Next 24h Risk + Recommended Action) */}
          {isIntelPanelOpen && (
            <div className="absolute top-18 right-3 z-[1000] pointer-events-auto w-84 max-w-[90vw] animate-in fade-in slide-in-from-right duration-200">
              <div className="bg-[#FFFFFF]/98 backdrop-blur-md rounded-2xl border border-[#D6D8C8] shadow-2xl overflow-hidden text-[#30342F]">
                {/* Panel Header */}
                <div
                  onClick={() => setIsIntelPanelOpen(false)}
                  className="px-4 py-3 bg-[#E7E8D1] border-b border-[#D6D8C8] text-[#30342F] flex items-center justify-between cursor-pointer text-xs font-bold"
                >
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-[#D97706]" />
                    <span className="font-bold text-[#30342F]">Risk Intelligence Stream</span>
                  </div>
                  <button className="text-[#74796F] hover:text-[#30342F]">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Panel Body */}
                <div className="p-3.5 space-y-3 max-h-[460px] overflow-y-auto text-xs">
                  {/* 1. Critical Disruption Alert */}
                  <div className="bg-[#B85042]/10 border border-[#B85042]/20 rounded-xl p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#B85042] uppercase flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-[#B85042]" /> Active Emergency Alert
                      </span>
                      <span className="text-[9px] bg-[#B85042]/20 text-[#B85042] font-bold px-2 py-0.5 rounded border border-[#B85042]/30">
                        T4 CRITICAL
                      </span>
                    </div>
                    <div className="font-bold text-[#30342F] text-xs">
                      {alerts[0]?.title || 'NH-10 Teesta Corridor Blockade'}
                    </div>
                    <p className="text-[11px] text-[#74796F] leading-relaxed">
                      Debris slurry impassable at Km 42. Diversion to alternate hill bypass activated via Melli.
                    </p>
                  </div>

                  {/* 2. Next 24h Risk Outlook */}
                  <div className="bg-[#D5D8C3] border border-[#D6D8C8] rounded-xl p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#B85042] uppercase flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#B85042]" /> 24h AI Risk Forecast
                      </span>
                      <span className="text-[9px] text-[#74796F] font-bold">NASA + IMD</span>
                    </div>

                    <div className="text-[11px] font-bold text-[#30342F]">
                      Sela Pass Sector (NH-13): 86% Landslide Probability
                    </div>
                    <div className="text-[10px] text-[#74796F]">
                      IMD 72h Rain: 240mm • Soil Saturation: 92%
                    </div>
                  </div>

                  {/* 3. Recommended Operator Action */}
                  <div className="bg-[#A7BEAE]/15 border border-[#A7BEAE]/30 rounded-xl p-3 space-y-1.5">
                    <span className="text-[10px] font-bold text-[#2C5242] uppercase flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-[#2C5242]" /> Recommended Operational Action
                    </span>
                    <p className="text-[11px] text-[#30342F] font-medium leading-relaxed">
                      Pre-position 4,000 vaccine units from Guwahati Central Depot to Tawang buffer before 05:00 AM.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Floating Bottom Collapsible Corridor Status Drawer */}
          <div className="absolute bottom-3 right-3 left-3 sm:left-auto sm:right-3 sm:max-w-2xl z-[1000] pointer-events-auto">
            <div className="bg-[#FFFFFF]/95 backdrop-blur-md rounded-2xl border border-[#D6D8C8] shadow-2xl overflow-hidden transition-all duration-200 text-[#30342F]">
              {/* Drawer Header Toggle */}
              <div
                onClick={() => setIsCorridorDrawerOpen(!isCorridorDrawerOpen)}
                className="px-4 py-2.5 bg-[#E7E8D1] hover:bg-[#D5D8C3] text-[#30342F] flex items-center justify-between cursor-pointer transition-colors text-xs font-bold border-b border-[#D6D8C8]"
              >
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#B85042]" />
                  <span>Strategic Corridors Quick Status ({corridors.length})</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#74796F]">
                  <span>{isCorridorDrawerOpen ? 'Minimize' : 'Expand'}</span>
                  {isCorridorDrawerOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </div>
              </div>

              {/* Drawer Content */}
              {isCorridorDrawerOpen && (
                <div className="p-3 max-h-52 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {corridors.slice(0, 8).map((c) => (
                    <div
                      key={c.id}
                      onClick={() => openDrawer('CORRIDOR', c)}
                      className="p-2.5 rounded-xl border border-[#D6D8C8] hover:border-[#B85042]/60 cursor-pointer transition-all bg-[#FFFFFF] hover:bg-[#E7E8D1]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-[11px] text-[#B85042]">{c.id}</span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            c.status === 'OPEN'
                              ? 'badge-open'
                              : c.status === 'RESTRICTED'
                              ? 'badge-restricted'
                              : c.status === 'DEGRADED'
                              ? 'badge-degraded'
                              : 'badge-closed'
                          }`}
                        >
                          {c.status}
                        </span>
                      </div>
                      <div className="font-bold text-[11px] text-[#30342F] mt-1 truncate">{c.name}</div>
                      <div className="text-[10px] text-[#74796F] mt-0.5 flex justify-between">
                        <span>{c.distance_km} km</span>
                        <span>
                          Hazard Risk: <strong className="text-[#B45309]">{c.risk_score}%</strong>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NON-MAP TABS CONTAINER */}
      {activeTab !== 'MAP' && (
        <div className="p-3 sm:p-4 lg:p-6 space-y-4 max-w-7xl mx-auto w-full text-[#30342F]">
          {/* Top Controls Bar with Return to Map Button */}
          <div className="card-command flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('MAP')}
                className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5 shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to GIS Map</span>
              </button>
              <div>
                <h2 className="text-base font-bold text-[#30342F]">
                  {t('module_1')} — Northeast Regional GIS Grid
                </h2>
                <p className="text-xs text-[#74796F] mt-0.5">
                  Detailed analytics, sensor diagnostics &amp; district scorecards across 89 districts
                </p>
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex items-center bg-[#D5D8C3] p-1 rounded-xl border border-[#D6D8C8] text-xs font-bold gap-1 overflow-x-auto max-w-full">
              <button
                onClick={() => setActiveTab('MAP')}
                className="px-3 py-1.5 rounded-lg transition-all text-[#74796F] hover:text-[#30342F] cursor-pointer whitespace-nowrap"
              >
                🗺️ Full GIS Map
              </button>
              <button
                onClick={() => setActiveTab('DISTRICTS')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'DISTRICTS' ? 'bg-[#B85042] text-white font-bold shadow-sm' : 'text-[#74796F] hover:text-[#30342F]'
                }`}
              >
                📍 89-District Scorecard
              </button>
              <button
                onClick={() => setActiveTab('BRIDGES')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'BRIDGES' ? 'bg-[#B85042] text-white font-bold shadow-sm' : 'text-[#74796F] hover:text-[#30342F]'
                }`}
              >
                🌉 Bridge IoT Health ({bridges.length})
              </button>
              <button
                onClick={() => setActiveTab('SATELLITE')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'SATELLITE' ? 'bg-[#B85042] text-white font-bold shadow-sm' : 'text-[#74796F] hover:text-[#30342F]'
                }`}
              >
                🛰️ Sentinel-2 Diff
              </button>
            </div>
          </div>

          {/* TAB 2: 89-DISTRICT SCORECARD GRID */}
          {activeTab === 'DISTRICTS' && (
            <div className="card-command space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#74796F]" />
                  <input
                    type="text"
                    value={districtSearch}
                    onChange={(e) => setDistrictSearch(e.target.value)}
                    placeholder="Search by district name or state..."
                    className="w-full bg-[#FFFFFF] text-[#30342F] placeholder:text-[#74796F] pl-9 pr-3 py-2 border border-[#D6D8C8] rounded-xl text-xs focus:ring-1 focus:ring-[#B85042] focus:outline-none"
                  />
                </div>

                {/* State filter buttons */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="font-bold text-[#74796F] text-[10px] uppercase mr-1">Filter State:</span>
                  {['ALL', 'AS', 'AR', 'MN', 'ML', 'MZ', 'NL', 'SK', 'TR'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setSelectedStateFilter(st)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        selectedStateFilter === st
                          ? 'bg-[#B85042] text-white'
                          : 'bg-[#FFFFFF] text-[#30342F] hover:bg-[#D5D8C3] border border-[#D6D8C8]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border border-[#D6D8C8] rounded-xl overflow-x-auto bg-[#FFFFFF]">
                <table className="table-command min-w-[700px]">
                  <thead>
                    <tr>
                      <th>District / State</th>
                      <th>Terrain Type</th>
                      <th>Accessibility Score</th>
                      <th>Current Status</th>
                      <th>Provenance</th>
                      <th>Monsoon Risk</th>
                      <th>PHCs Stocked</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDistricts.map((d) => (
                      <tr key={d.id}>
                        <td>
                          <div className="font-bold text-[#30342F]">{d.name}</div>
                          <div className="text-[11px] text-[#74796F]">{d.state}</div>
                        </td>
                        <td>
                          <span className="bg-[#D5D8C3] px-2 py-0.5 rounded text-[11px] text-[#30342F] font-medium border border-[#D6D8C8]">
                            {d.terrain}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#30342F]">{d.score}</span>
                            <div className="w-16 h-1.5 bg-[#D5D8C3] rounded-full overflow-hidden border border-[#D6D8C8]">
                              <div
                                className={`h-full ${d.score > 75 ? 'bg-[#A7BEAE]' : d.score > 55 ? 'bg-[#F59E0B]' : 'bg-[#B85042]'}`}
                                style={{ width: `${d.score}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                              d.status === 'OPEN'
                                ? 'badge-open'
                                : d.status === 'RESTRICTED'
                                ? 'badge-restricted'
                                : d.status === 'DEGRADED'
                                ? 'badge-degraded'
                                : 'badge-closed'
                            }`}
                          >
                            {d.status}
                          </span>
                        </td>
                        <td>
                          <ProvenanceBadge status={d.verification_status || 'OBSERVED'} dataItem={d} />
                        </td>
                        <td>
                          <span
                            className={`font-bold text-xs ${
                              d.risk_level === 'CRITICAL'
                                ? 'text-[#B85042]'
                                : d.risk_level === 'HIGH'
                                ? 'text-[#B45309]'
                                : 'text-[#2C5242]'
                            }`}
                          >
                            {d.risk_level}
                          </span>
                        </td>
                        <td>
                          <span className="text-xs font-semibold text-[#30342F]">
                            {d.critical_stock_pct}% ({d.phc_count} Centers)
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2.5">
                            <button
                              onClick={() => openDrawer('DISTRICT', d)}
                              className="text-xs font-bold text-[#B85042] hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" /> Inspect
                            </button>
                            <button
                              onClick={() => openProvenanceModal(d)}
                              className="text-xs font-bold text-[#2C5242] hover:underline flex items-center gap-1 cursor-pointer"
                              title="Inspect Source & Telemetry Provenance"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" /> Provenance
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: STRATEGIC BRIDGE IOT HEALTH */}
          {activeTab === 'BRIDGES' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bridges.map((br) => (
                <div
                  key={br.id}
                  onClick={() => openDrawer('BRIDGE', br)}
                  className="card-command hover:border-[#B85042]/60 cursor-pointer space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs bg-[#D5D8C3] border border-[#D6D8C8] px-2.5 py-0.5 rounded text-[#B85042]">
                      {br.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        br.structural_health_pct > 80 ? 'badge-open' : 'badge-restricted'
                      }`}
                    >
                      {br.status.split(' ')[0]}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-[#30342F] group-hover:text-[#B85042] transition-colors">{br.name}</h3>
                    <div className="text-[11px] text-[#74796F] mt-0.5">{br.location}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center bg-[#E7E8D1] p-2.5 rounded-xl border border-[#D6D8C8] text-xs">
                    <div>
                      <div className="text-[10px] text-[#74796F]">Structural Health</div>
                      <div className="text-base font-bold text-[#2C5242]">{br.structural_health_pct}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#74796F]">Strain (με)</div>
                      <div className="text-base font-bold text-[#B45309]">{br.strain_microstrain}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#74796F]">Vibration (Hz)</div>
                      <div className="font-mono font-bold text-[#30342F]">{br.vibration_hz} Hz</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#74796F]">Girder Clearance</div>
                      <div className="font-bold text-[#30342F]">{br.water_clearance_m} m</div>
                    </div>
                  </div>

                  <div className="text-[11px] text-[#74796F] truncate flex items-center gap-1.5 pt-1 border-t border-[#D6D8C8]">
                    <Radio className="w-3.5 h-3.5 text-[#A7BEAE] animate-pulse" /> {br.cctv_status}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: SATELLITE SENTINEL-2 CHANGE DETECTION */}
          {activeTab === 'SATELLITE' && (
            <div className="card-command space-y-4">
              <div className="flex items-center gap-2.5">
                <Satellite className="w-5 h-5 text-[#B85042]" />
                <div>
                  <h3 className="text-sm font-bold text-[#30342F]">
                    ISRO Bhuvan &amp; Copernicus Sentinel-2 Bi-Daily Damage Detection
                  </h3>
                  <p className="text-xs text-[#74796F]">
                    Automated optical difference detection flagging recent debris slips, washed road sections, and riverbank erosions
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-[#D6D8C8] bg-[#FFFFFF] rounded-xl overflow-hidden shadow-sm">
                  <div className="px-3 py-2 text-xs font-bold text-[#74796F] flex justify-between border-b border-[#D6D8C8] bg-[#E7E8D1]">
                    <span>Baseline Image (T-48h) — Sentinel-2 MSI Band 4-3-2</span>
                    <span className="text-[10px] font-mono text-[#74796F]">2026-08-24</span>
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=700&q=80"
                    alt="Baseline satellite terrain"
                    className="w-full h-56 object-cover"
                  />
                </div>

                <div className="border border-[#B85042]/30 bg-[#FFFFFF] rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-[#B85042]/10 px-3 py-2 text-xs font-bold text-[#B85042] flex justify-between border-b border-[#B85042]/20">
                    <span>Current Overpass (T-0) — AI Highlighted Mudflow Scar</span>
                    <span className="text-[10px] bg-[#B85042]/20 text-[#B85042] px-2 py-0.5 rounded font-bold border border-[#B85042]/30">
                      Anomaly Detected
                    </span>
                  </div>
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=700&q=80"
                      alt="Post-event damage satellite view"
                      className="w-full h-56 object-cover"
                    />
                    <div className="absolute top-8 left-16 border-2 border-[#B85042] bg-[#B85042]/80 backdrop-blur-xs px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-white shadow-lg">
                      🚨 Active Rockslide Area (12,400 sq.m)
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#A7BEAE]/15 rounded-xl border border-[#A7BEAE]/30 text-xs text-[#30342F] flex items-center justify-between">
                <span className="font-semibold text-[#2C5242]">
                  AI Classification: YOLOv8 model classified damage as <strong>SEVERE (Tier 3 Disruption)</strong>.
                </span>
                <span className="font-bold bg-[#A7BEAE]/20 text-[#2C5242] px-2.5 py-1 rounded-lg text-[10px] border border-[#A7BEAE]/30">
                  Confidence: 94.2%
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
