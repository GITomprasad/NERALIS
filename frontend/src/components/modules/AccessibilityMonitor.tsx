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
  ChevronRight
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
  const [isCorridorDrawerOpen, setIsCorridorDrawerOpen] = useState(true);
  const [isIntelPanelOpen, setIsIntelPanelOpen] = useState(true);

  const filteredDistricts = districts.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(districtSearch.toLowerCase()) ||
      d.state.toLowerCase().includes(districtSearch.toLowerCase());
    const matchesState = selectedStateFilter === 'ALL' || d.state_id === selectedStateFilter;
    return matchesSearch && matchesState;
  });

  return (
    <div className="w-full h-full flex flex-col relative">
      {/* TAB 1: FULL-COVERAGE LIVE GIS MAP */}
      {activeTab === 'MAP' && (
        <div className="relative w-full flex-1 h-[calc(100vh-108px)] sm:h-[calc(100vh-112px)] min-h-[400px] sm:min-h-[580px] overflow-hidden bg-slate-900">
          {/* Main Map Edge-to-Edge */}
          <NerGisMap height="100%" className="h-full w-full" />

          {/* Floating Top Glassmorphism HUD Controls */}
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 z-[1000] flex flex-wrap items-center justify-between gap-1.5 sm:gap-2.5 pointer-events-none">
            {/* Left Title & Status Indicator */}
            <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-gray-300 shadow-md flex items-center gap-2 sm:gap-3">
              <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <div>
                <div className="flex items-center gap-1.5 font-black text-xs text-[#1E3A5F]">
                  <span className="hidden sm:inline">NER GIS Grid Command Center</span>
                  <span className="sm:hidden">NER Grid</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded font-bold">
                    89 Districts Live
                  </span>
                </div>
                <div className="text-[10px] text-gray-500 hidden md:block">
                  Live satellite telemetry, bridge sensors & corridor hazards
                </div>
              </div>
            </div>

            {/* Center Tab Switcher */}
            <div className="pointer-events-auto bg-white/95 backdrop-blur-md p-1 rounded-xl border border-gray-300 shadow-md flex items-center gap-1 text-xs font-bold overflow-x-auto max-w-[95vw] sm:max-w-none">
              <button
                onClick={() => setActiveTab('MAP')}
                className="px-2.5 sm:px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 bg-[#1E3A5F] text-white shadow-xs whitespace-nowrap"
              >
                🗺️ <span className="hidden sm:inline">GIS</span> Map
              </button>
              <button
                onClick={() => setActiveTab('DISTRICTS')}
                className="px-2.5 sm:px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 text-gray-700 hover:bg-gray-100 whitespace-nowrap"
              >
                📍 <span className="hidden sm:inline">89 </span>Districts
              </button>
              <button
                onClick={() => setActiveTab('BRIDGES')}
                className="px-2.5 sm:px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 text-gray-700 hover:bg-gray-100 whitespace-nowrap"
              >
                🌉 Bridges <span className="hidden sm:inline">({bridges.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('SATELLITE')}
                className="px-2.5 sm:px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 text-gray-700 hover:bg-gray-100 whitespace-nowrap"
              >
                🛰️ Sentinel-2
              </button>
            </div>

            {/* Right: State Filter & Fullscreen Toggle */}
            <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
              {/* State Filter Dropdown */}
              <div className="bg-white/95 backdrop-blur-md px-2 sm:px-2.5 py-1.5 rounded-xl border border-gray-300 shadow-md flex items-center gap-1 sm:gap-1.5 text-xs font-bold">
                <Filter className="w-3.5 h-3.5 text-blue-700" />
                <span className="text-gray-500 text-[10px] hidden md:inline">State:</span>
                <select
                  value={selectedStateFilter}
                  onChange={(e) => setSelectedStateFilter(e.target.value)}
                  className="bg-transparent text-gray-800 text-xs font-bold focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All States</option>
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

              {/* Sidebar Collapse / Full Screen Toggle */}
              <button
                onClick={toggleSidebar}
                className="bg-white/95 backdrop-blur-md p-1.5 sm:p-2 rounded-xl border border-gray-300 shadow-md text-gray-700 hover:text-[#1E3A5F] hover:bg-white transition-all text-xs font-bold flex items-center gap-1 hidden lg:flex"
                title={isSidebarCollapsed ? 'Expand Sidebar Navigation' : 'Maximize Map Canvas'}
              >
                {isSidebarCollapsed ? (
                  <>
                    <Minimize2 className="w-4 h-4 text-blue-700" />
                    <span className="hidden xl:inline text-[11px]">Normal View</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-4 h-4 text-blue-700" />
                    <span className="hidden xl:inline text-[11px]">Expand Map</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Universal Legend (Floating Top Left / Below Controls) */}
          <div className="absolute top-16 left-3 z-[1000] pointer-events-auto hidden md:block">
            <div className="bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-gray-300 shadow-md space-y-1 text-[10px]">
              <div className="font-black text-[#1E3A5F] text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-teal-600" /> Operational Legend
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 px-1.5 py-0.5 rounded font-bold">● OBSERVED</span>
                <span className="bg-teal-50 text-teal-800 border border-teal-300 px-1.5 py-0.5 rounded font-bold">✓ VERIFIED</span>
                <span className="bg-purple-50 text-purple-800 border border-purple-300 px-1.5 py-0.5 rounded font-bold">✦ PREDICTED</span>
                <span className="bg-sky-50 text-sky-800 border border-sky-300 px-1.5 py-0.5 rounded font-bold">⌖ REPORTED</span>
                <span className="bg-amber-50 text-amber-800 border border-amber-300 px-1.5 py-0.5 rounded font-bold">⚗ DEMO</span>
              </div>
            </div>
          </div>

          {/* Right Intelligence Panel (Section 7: Critical Alerts + Next 24h Risk + Recommended Action) */}
          <div className="absolute top-16 right-3 z-[1000] pointer-events-auto hidden lg:block w-80">
            <div className="bg-white/95 backdrop-blur-md rounded-xl border border-gray-300 shadow-xl overflow-hidden transition-all duration-200">
              {/* Panel Header */}
              <div
                onClick={() => setIsIntelPanelOpen(!isIntelPanelOpen)}
                className="px-3.5 py-2 bg-[#1E3A5F] text-white flex items-center justify-between cursor-pointer text-xs font-bold"
              >
                <div className="flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>Right Intelligence Stream</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-sky-200">
                  <span>{isIntelPanelOpen ? 'Collapse' : 'Expand'}</span>
                  {isIntelPanelOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </div>
              </div>

              {/* Panel Body */}
              {isIntelPanelOpen && (
                <div className="p-3 space-y-2.5 max-h-[420px] overflow-y-auto text-xs">
                  {/* 1. Critical Disruption Alert */}
                  <div className="bg-red-50/80 border border-red-200 rounded-lg p-2.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-red-800 uppercase flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-red-600" /> Active Emergency Alert
                      </span>
                      <span className="text-[9px] bg-red-100 text-red-700 font-bold px-1.5 py-0.2 rounded">T4 CRITICAL</span>
                    </div>
                    <div className="font-black text-gray-900 text-xs mt-0.5">
                      {alerts[0]?.title || 'NH-10 Teesta Corridor Blockade'}
                    </div>
                    <p className="text-[10px] text-gray-600 leading-snug">
                      Debris slurry impassable at Km 42. Diversion to alternate hill bypass activated.
                    </p>
                  </div>

                  {/* 2. Next 24h Risk Outlook */}
                  <div className="bg-purple-50/70 border border-purple-200 rounded-lg p-2.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-purple-800 uppercase flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-purple-600" /> 24h AI Risk Forecast
                      </span>
                      <span className="text-[9px] text-purple-700 font-bold">98.7% Baseline</span>
                    </div>

                    <div className="text-[11px] font-bold text-gray-800">
                      Sela Pass Sector (NH-13): 86% Landslide Probability
                    </div>
                    <div className="text-[10px] text-gray-500">
                      IMD 72h Rain: 240mm • Soil Saturation: 92%
                    </div>
                  </div>

                  {/* 3. Recommended Operator Action */}
                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-2.5 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-600" /> Operator Recommended Action
                    </span>
                    <p className="text-[11px] text-gray-700 font-medium leading-snug">
                      Pre-position 4,000 vaccine units from Guwahati Central Depot to Tawang buffer before 05:00 AM.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Floating Bottom Collapsible Corridor Status Drawer */}
          <div className="absolute bottom-3 right-3 left-3 sm:left-auto sm:right-3 sm:max-w-2xl z-[1000] pointer-events-auto">
            <div className="bg-white/95 backdrop-blur-md rounded-xl border border-gray-300 shadow-xl overflow-hidden transition-all duration-200">
              {/* Drawer Header Toggle */}
              <div
                onClick={() => setIsCorridorDrawerOpen(!isCorridorDrawerOpen)}
                className="px-3.5 py-2 bg-[#1E3A5F]/90 text-white flex items-center justify-between cursor-pointer hover:bg-[#1E3A5F] transition-colors text-xs font-bold"
              >
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-sky-300" />
                  <span>Critical Corridors Diagnostics ({corridors.length})</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-sky-200">
                  <span>{isCorridorDrawerOpen ? 'Hide' : 'Show'} Quick Cards</span>
                  {isCorridorDrawerOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </div>
              </div>

              {/* Drawer Content */}
              {isCorridorDrawerOpen && (
                <div className="p-3 max-h-48 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {corridors.slice(0, 6).map((c) => (
                    <div
                      key={c.id}
                      onClick={() => openDrawer('CORRIDOR', c)}
                      className="p-2.5 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-xs cursor-pointer transition-all bg-gray-50/70 hover:bg-white"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-[11px] text-[#1E3A5F]">{c.id}</span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
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
                      <div className="font-bold text-[11px] text-gray-900 mt-1 truncate">{c.name}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5 flex justify-between">
                        <span>{c.distance_km} km</span>
                        <span>Risk: <strong className="text-amber-800">{c.risk_score}%</strong></span>
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
        <div className="p-4 lg:p-6 space-y-4 max-w-7xl mx-auto w-full">
          {/* Top Controls Bar with Return to Map Button */}
          <div className="bg-white p-4 rounded-xl border border-[#D1D5DB] flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('MAP')}
                className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5 shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Full GIS Map</span>
              </button>
              <div>
                <h2 className="text-base font-black text-[#1E3A5F]">
                  {t('module_1')} — North Eastern Region GIS Grid
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Detailed analytics and diagnostic inspections across all 89 districts
                </p>
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex items-center bg-gray-100 p-1 rounded-lg text-xs font-bold gap-1">
              <button
                onClick={() => setActiveTab('MAP')}
                className="px-3 py-1.5 rounded-md transition-all text-gray-600 hover:text-gray-900"
              >
                🗺️ Full GIS Map
              </button>
              <button
                onClick={() => setActiveTab('DISTRICTS')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  activeTab === 'DISTRICTS' ? 'bg-[#1E3A5F] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📍 89-District Scorecard
              </button>
              <button
                onClick={() => setActiveTab('BRIDGES')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  activeTab === 'BRIDGES' ? 'bg-[#1E3A5F] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🌉 Bridge Health IoT ({bridges.length})
              </button>
              <button
                onClick={() => setActiveTab('SATELLITE')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  activeTab === 'SATELLITE' ? 'bg-[#1E3A5F] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🛰️ Sentinel-2 Diff
              </button>
            </div>
          </div>

          {/* TAB 2: 89-DISTRICT SCORECARD GRID */}
          {activeTab === 'DISTRICTS' && (
            <div className="bg-white p-4 rounded-xl border border-[#D1D5DB] space-y-4 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={districtSearch}
                    onChange={(e) => setDistrictSearch(e.target.value)}
                    placeholder="Search by district name or state..."
                    className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
                  />
                </div>

                {/* State filter buttons */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="font-bold text-gray-500 text-[10px] uppercase mr-1">Filter State:</span>
                  {['ALL', 'AS', 'AR', 'MN', 'ML', 'MZ', 'NL', 'SK', 'TR'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setSelectedStateFilter(st)}
                      className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                        selectedStateFilter === st
                          ? 'bg-[#1E3A5F] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-x-auto">
                <table className="w-full text-left table-official min-w-[700px]">
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
                      <tr key={d.id} className="hover:bg-blue-50/40">
                        <td>
                          <div className="font-bold text-gray-900">{d.name}</div>
                          <div className="text-[11px] text-gray-500">{d.state}</div>
                        </td>
                        <td>
                          <span className="bg-gray-100 px-2 py-0.5 rounded text-[11px] text-gray-700 font-medium">
                            {d.terrain}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-sm text-[#1E3A5F]">{d.score}</span>
                            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${d.score > 75 ? 'bg-emerald-600' : d.score > 55 ? 'bg-amber-500' : 'bg-red-600'}`}
                                style={{ width: `${d.score}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
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
                                ? 'text-red-700'
                                : d.risk_level === 'HIGH'
                                ? 'text-amber-700'
                                : 'text-emerald-700'
                            }`}
                          >
                            {d.risk_level}
                          </span>
                        </td>
                        <td>
                          <span className="text-xs font-semibold text-gray-800">
                            {d.critical_stock_pct}% ({d.phc_count} Centers)
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openDrawer('DISTRICT', d)}
                              className="text-xs font-bold text-[#2563A8] hover:underline flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" /> Inspect
                            </button>
                            <button
                              onClick={() => openProvenanceModal(d)}
                              className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1"
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
                  className="bg-white p-4 rounded-xl border border-[#D1D5DB] shadow-xs hover:border-blue-400 cursor-pointer space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs bg-slate-100 px-2 py-0.5 rounded text-gray-700">
                      {br.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        br.structural_health_pct > 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {br.status.split(' ')[0]}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-[#1E3A5F]">{br.name}</h3>
                    <div className="text-[11px] text-gray-500 mt-0.5">{br.location}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center bg-[#F8FAFC] p-2.5 rounded-lg border border-gray-200 text-xs">
                    <div>
                      <div className="text-[10px] text-gray-500">Structural Health</div>
                      <div className="text-base font-black text-[#1E3A5F]">{br.structural_health_pct}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500">Strain (με)</div>
                      <div className="text-base font-black text-amber-800">{br.strain_microstrain}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500">Vibration (Hz)</div>
                      <div className="font-mono font-bold">{br.vibration_hz} Hz</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500">Girder Clearance</div>
                      <div className="font-bold text-emerald-700">{br.water_clearance_m} m</div>
                    </div>
                  </div>

                  <div className="text-[11px] text-blue-700 font-medium truncate flex items-center gap-1">
                    <Radio className="w-3 h-3 text-emerald-600 animate-pulse" /> {br.cctv_status}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: SATELLITE SENTINEL-2 CHANGE DETECTION */}
          {activeTab === 'SATELLITE' && (
            <div className="bg-white p-5 rounded-xl border border-[#D1D5DB] space-y-4 shadow-xs">
              <div className="flex items-center gap-2">
                <Satellite className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="text-sm font-bold text-[#1E3A5F]">
                    ISRO Bhuvan & Copernicus Sentinel-2 Bi-Daily Damage Detection
                  </h3>
                  <p className="text-xs text-gray-500">
                    Automated optical difference detection flagging recent debris slips, road washed sections, and riverbank erosions
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-xl overflow-hidden shadow-xs">
                  <div className="bg-gray-100 px-3 py-2 text-xs font-bold text-gray-700 flex justify-between">
                    <span>Baseline Image (T-48h) — Sentinel-2 MSI Band 4-3-2</span>
                    <span className="text-[10px] text-gray-500">2026-08-24</span>
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=700&q=80"
                    alt="Baseline satellite terrain"
                    className="w-full h-56 object-cover"
                  />
                </div>

                <div className="border border-red-300 rounded-xl overflow-hidden shadow-xs">
                  <div className="bg-red-50 px-3 py-2 text-xs font-bold text-red-800 flex justify-between">
                    <span>Current Overpass (T-0) — AI Highlighted Mudflow Scar</span>
                    <span className="text-[10px] bg-red-200 text-red-900 px-1.5 py-0.2 rounded">Anomaly Detected</span>
                  </div>
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=700&q=80"
                      alt="Post-event damage satellite view"
                      className="w-full h-56 object-cover"
                    />
                    <div className="absolute top-8 left-16 border-2 border-red-500 bg-red-500/20 px-2 py-1 rounded text-[10px] font-bold text-white shadow">
                      🚨 Active Rockslide Area (12,400 sq.m)
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                <span className="font-semibold">
                  AI Verification Complete: YOLOv8 model classified damage as <strong>SEVERE (Tier 3 Disruption)</strong>.
                </span>
                <span className="font-bold bg-emerald-200 px-2 py-1 rounded text-[10px]">
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
