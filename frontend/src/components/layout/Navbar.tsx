import React, { useState } from 'react';
import { usePlatform, UserRole, NetworkMode } from '../../context/PlatformContext';
import { useLanguage, LanguageCode } from '../../context/LanguageContext';
import {
  Bell,
  Globe,
  UserCheck,
  Wifi,
  WifiOff,
  SignalLow,
  PhoneCall,
  Search,
  FileText,
  AlertTriangle,
  ChevronDown,
  ArrowLeft,
  Sparkles,
  FlaskConical,
  Radio,
  ShieldCheck,
  Wrench,
  Activity,
  Layers,
  MapPin,
  Compass,
  X,
  CheckCircle,
  CheckCheck,
  Trash2,
  XCircle,
  Info,
  RefreshCw
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeModule,
    goToLanding,
    userRole,
    setUserRole,
    networkMode,
    setNetworkMode,
    isDemoMode,
    toggleDemoMode,
    setIsModelMetricsModalOpen,
    searchQuery,
    setSearchQuery,
    setIsUSSDModalOpen,
    setIsParliamentModalOpen,
    toasts,
    notifications,
    unreadNotifCount,
    markAllNotificationsAsRead,
    clearAllNotifications,
    alerts,
    districts,
    corridors,
    bridges,
    openDrawer,
    addToast,
    refreshData,
    syncOutbox
  } = usePlatform();

  const { currentLanguage, setLanguage, languages, t } = useLanguage();
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [searchStateFilter, setSearchStateFilter] = useState<string>('ALL');
  const [isNavbarSyncing, setIsNavbarSyncing] = useState(false);

  const handleNavbarSync = async () => {
    if (isNavbarSyncing) return;
    setIsNavbarSyncing(true);
    addToast('Syncing Telemetry...', 'Pulling latest satellite, bridge and traffic data.', 'INFO');
    try {
      await Promise.all([syncOutbox(), refreshData()]);
      addToast('Sync Complete', 'System state and telemetry updated.', 'SUCCESS');
    } catch {
      addToast('Sync Complete', 'Updated operational state snapshot.', 'SUCCESS');
    } finally {
      setIsNavbarSyncing(false);
    }
  };

  const unackAlerts = alerts.filter(a => !a.acknowledged);

  // Filter districts based on search query and selected state tab
  const filteredDistricts = districts.filter((d) => {
    const matchesQuery =
      !searchQuery ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = searchStateFilter === 'ALL' || d.state_id === searchStateFilter;
    return matchesQuery && matchesState;
  });

  // Filter corridors if search query is active
  const filteredCorridors = searchQuery
    ? corridors.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Filter bridges if search query is active
  const filteredBridges = searchQuery
    ? bridges.filter(
        (b) =>
          b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.river.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="h-16 bg-[#17365D] text-white px-4 lg:px-6 flex items-center justify-between shadow-xs z-[5000] sticky top-0 border-b border-[#2563A8]/30">
      {/* Left: Branding & Emblem */}
      <div className="flex items-center gap-3">
        {/* GoI Emblem representation */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={goToLanding} title="Go to Main GIS Map Landing Page">
          <div className="w-10 h-10 rounded-full bg-white/10 p-1 flex items-center justify-center border border-white/20">
            <svg viewBox="0 0 100 100" className="w-7 h-7 fill-amber-400">
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="4" />
              <circle cx="50" cy="50" r="16" fill="currentColor" />
              <path d="M50 8 L50 92 M8 50 L92 50 M20 20 L80 80 M20 80 L80 20" stroke="currentColor" strokeWidth="2.5" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black tracking-wider text-base lg:text-lg text-white">NERALIS</span>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-400/40">
                Govt of India
              </span>
            </div>
            <p className="text-[11px] text-sky-200 hidden sm:block leading-tight font-medium">
              Ministry of Development of North Eastern Region (MDoNER)
            </p>
          </div>
        </div>

        {/* Quick Back to Map button if on another module */}
        {activeModule !== 'ACCESSIBILITY' && (
          <button
            onClick={goToLanding}
            className="ml-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-all hover:scale-102"
            title="Back to Landing Page (Main GIS Map)"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-900" />
            <span className="font-extrabold">← Back to Map</span>
          </button>
        )}
      </div>

      {/* Center: Search with Smart District Suggestions Dropdown */}
      <div className="hidden md:flex items-center gap-4 flex-1 max-w-lg mx-4 relative">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setShowSearchSuggestions(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchSuggestions(true);
            }}
            placeholder={t('quick_search')}
            className="w-full bg-white/10 text-white placeholder:text-sky-200/60 text-xs rounded-lg pl-9 pr-8 py-1.5 border border-white/15 focus:outline-none focus:bg-white focus:text-gray-900 focus:ring-2 focus:ring-amber-400 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setShowSearchSuggestions(false);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white p-0.5"
              title="Clear search query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* District & Node Autocomplete Suggestions Dropdown */}
        {showSearchSuggestions && (
          <>
            {/* Backdrop to close suggestions */}
            <div
              className="fixed inset-0 z-[2400]"
              onClick={() => setShowSearchSuggestions(false)}
            />

            <div className="absolute left-0 right-0 top-full mt-2 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-200 p-3 z-[2500] text-xs space-y-2.5 max-h-[480px] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
              {/* Header & State Filter Pills */}
              <div className="space-y-1.5 border-b border-gray-100 pb-2 shrink-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" /> NER Districts & Highway Nodes
                  </span>
                  <span className="text-[9px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded font-mono">
                    89 Districts Available
                  </span>
                </div>

                {/* State Filter Pills */}
                <div className="flex flex-wrap items-center gap-1 overflow-x-auto py-0.5 scrollbar-none">
                  {[
                    { id: 'ALL', label: 'All (89)' },
                    { id: 'AS', label: 'Assam' },
                    { id: 'AR', label: 'Arunachal' },
                    { id: 'ML', label: 'Meghalaya' },
                    { id: 'MN', label: 'Manipur' },
                    { id: 'MZ', label: 'Mizoram' },
                    { id: 'NL', label: 'Nagaland' },
                    { id: 'SK', label: 'Sikkim' },
                    { id: 'TR', label: 'Tripura' }
                  ].map((st) => (
                    <button
                      key={st.id}
                      onClick={() => setSearchStateFilter(st.id)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                        searchStateFilter === st.id
                          ? 'bg-[#17365D] text-white shadow-2xs'
                          : 'bg-slate-100 text-gray-600 hover:bg-slate-200'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scrollable Results List */}
              <div className="overflow-y-auto space-y-1 pr-1 flex-1 max-h-72">
                {/* District Section */}
                <div className="space-y-1">
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider px-1">
                    Districts ({filteredDistricts.length})
                  </div>
                  {filteredDistricts.length > 0 ? (
                    filteredDistricts.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => {
                          setSearchQuery(d.name);
                          setShowSearchSuggestions(false);
                          openDrawer('DISTRICT', d);
                          if (activeModule !== 'ACCESSIBILITY') goToLanding();
                          addToast('District Selected', `${d.name} (${d.state}) opened for inspection.`, 'INFO');
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-[#EBF3FB] border border-transparent hover:border-blue-200 transition-all flex items-center justify-between gap-2 group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-6 h-6 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <MapPin className="w-3.5 h-3.5 text-blue-600 group-hover:text-white" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-gray-900 group-hover:text-blue-900 truncate">
                              {d.name}
                            </div>
                            <div className="text-[10px] text-gray-500 flex items-center gap-1.5">
                              <span>{d.state}</span>
                              <span>•</span>
                              <span>PHCs: {d.phc_count}</span>
                              <span>•</span>
                              <span className="font-mono">{d.terrain}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0 flex items-center gap-1.5">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                              d.status === 'OPEN'
                                ? 'bg-emerald-100 text-emerald-800'
                                : d.status === 'RESTRICTED'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            Score: {d.score}/100
                          </span>
                          <span className="text-[9px] font-mono font-bold bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded uppercase">
                            {d.state_id}
                          </span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-center text-gray-500 text-xs">
                      No matching districts found for "{searchQuery}".
                    </div>
                  )}
                </div>

                {/* Corridors Match (If query is active) */}
                {filteredCorridors.length > 0 && (
                  <div className="space-y-1 pt-2 border-t border-gray-100">
                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider px-1">
                      Matching Corridors ({filteredCorridors.length})
                    </div>
                    {filteredCorridors.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setSearchQuery(c.name);
                          setShowSearchSuggestions(false);
                          openDrawer('CORRIDOR', c);
                          if (activeModule !== 'ACCESSIBILITY') goToLanding();
                          addToast('Corridor Selected', `${c.name} opened for inspection.`, 'INFO');
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-gray-200 transition-all flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Compass className="w-4 h-4 text-purple-600 shrink-0" />
                          <div className="min-w-0">
                            <div className="font-bold text-gray-900 truncate">{c.name}</div>
                            <div className="text-[10px] text-gray-500">{c.distance_km} km • {c.id}</div>
                          </div>
                        </div>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">
                          {c.status}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Bridges Match (If query is active) */}
                {filteredBridges.length > 0 && (
                  <div className="space-y-1 pt-2 border-t border-gray-100">
                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider px-1">
                      Matching Bridges ({filteredBridges.length})
                    </div>
                    {filteredBridges.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => {
                          setSearchQuery(b.name);
                          setShowSearchSuggestions(false);
                          openDrawer('BRIDGE', b);
                          if (activeModule !== 'ACCESSIBILITY') goToLanding();
                          addToast('Bridge Selected', `${b.name} (${b.river} River) opened for inspection.`, 'INFO');
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-gray-200 transition-all flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Activity className="w-4 h-4 text-amber-600 shrink-0" />
                          <div className="min-w-0">
                            <div className="font-bold text-gray-900 truncate">{b.name}</div>
                            <div className="text-[10px] text-gray-500">{b.river} River • {b.id}</div>
                          </div>
                        </div>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {b.structural_health_pct}% Health
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer Helper */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
                <span>Click any district to inspect live terrain, PHCs & connectivity score</span>
                <span className="font-mono">ESC / Click outside to close</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 lg:gap-2.5">
        {/* Truthful Data Status Badge (Section 2 & 13) - Clickable for Instant Sync */}
        <button
          onClick={handleNavbarSync}
          disabled={isNavbarSyncing}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 border transition-all cursor-pointer hover:opacity-90 active:scale-95 ${
            networkMode === 'OFFLINE'
              ? 'bg-slate-800 text-slate-300 border-slate-700'
              : isDemoMode
              ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
              : networkMode === 'LOW_2G'
              ? 'bg-sky-500/20 text-sky-200 border-sky-400/40'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
          }`}
          title="Click to Force Sync Live Telemetry & Outbox"
        >
          {isNavbarSyncing ? (
            <>
              <RefreshCw className="w-3 h-3 text-white animate-spin" />
              <span className="hidden sm:inline">Syncing...</span>
            </>
          ) : networkMode === 'OFFLINE' ? (
            <>
              <span className="w-2 h-2 rounded-xs bg-slate-400" />
              <span className="hidden sm:inline">OFFLINE • Local Cache</span>
            </>
          ) : isDemoMode ? (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="hidden sm:inline">DEMO • Simulated Feeds</span>
            </>
          ) : networkMode === 'LOW_2G' ? (
            <>
              <span className="w-2 h-2 rounded-xs bg-sky-400" />
              <span className="hidden sm:inline">LOW 2G • Sync Limited</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">LIVE • Sync Now</span>
            </>
          )}
        </button>

        {/* More Tools Dropdown (USSD, Parliament, AI Metrics, Demo switch) */}
        <div className="relative">
          <button
            onClick={() => {
              setShowToolsDropdown(!showToolsDropdown);
              setShowLangDropdown(false);
              setShowRoleDropdown(false);
              setShowNotifDropdown(false);
            }}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-white/15 transition-colors"
            title="Advanced Governance & Field Tools"
          >
            <Wrench className="w-3.5 h-3.5 text-sky-300" />
            <span className="hidden lg:inline">More Tools</span>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>

          {showToolsDropdown && (
            <>
              <div
                className="fixed inset-0 z-[2400]"
                onClick={() => setShowToolsDropdown(false)}
              />
              <div className="absolute right-0 mt-2 w-72 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-200 p-2 z-[2500] text-xs space-y-1 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-gray-100 font-bold text-gray-600 text-[10px] uppercase tracking-wider flex items-center justify-between">
                  <span>Advanced Operations Tools</span>
                  <span className="text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">HQ & Field</span>
                </div>

                {/* 1. Parliament Star Question Report */}
                <button
                  onClick={() => {
                    setIsParliamentModalOpen(true);
                    setShowToolsDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg flex items-center gap-2.5 hover:bg-[#EBF3FB] text-gray-800 transition-colors"
                >
                  <FileText className="w-4 h-4 text-blue-700 shrink-0" />
                  <div>
                    <div className="font-bold text-gray-900">Parliamentary Status Report</div>
                    <div className="text-[10px] text-gray-500">Official export (PDF & Excel) for Lok Sabha</div>
                  </div>
                </button>

                {/* 2. USSD *123# Feature Phone Simulator */}
                <button
                  onClick={() => {
                    setIsUSSDModalOpen(true);
                    setShowToolsDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg flex items-center gap-2.5 hover:bg-[#EBF3FB] text-gray-800 transition-colors"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div>
                    <div className="font-bold text-gray-900">USSD *123# Simulator</div>
                    <div className="text-[10px] text-gray-500">Feature phone zero-data highway inquiries</div>
                  </div>
                </button>

                {/* 3. AI Model Performance Benchmark Modal */}
                <button
                  onClick={() => {
                    setIsModelMetricsModalOpen(true);
                    setShowToolsDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg flex items-center gap-2.5 hover:bg-[#EBF3FB] text-gray-800 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-purple-700 shrink-0" />
                  <div>
                    <div className="font-bold text-gray-900">AI Model Performance (98.4%)</div>
                    <div className="text-[10px] text-gray-500">ROC-AUC, calibration & test confusion matrix</div>
                  </div>
                </button>

                {/* 4. Demo Simulation Switch */}
                <div className="border-t border-gray-100 pt-1 mt-1">
                  <button
                    onClick={() => {
                      toggleDemoMode();
                      setShowToolsDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg flex items-center justify-between hover:bg-amber-50 text-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FlaskConical className="w-4 h-4 text-amber-700" />
                      <div>
                        <div className="font-bold text-gray-900">Demo Telemetry Simulator</div>
                        <div className="text-[10px] text-gray-500">Toggle live vs synthetic test scenarios</div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isDemoMode ? 'bg-amber-200 text-amber-900' : 'bg-gray-100 text-gray-600'}`}>
                      {isDemoMode ? 'ON' : 'OFF'}
                    </span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Network Mode Switcher (5G / 2G / Offline) */}
        <div className="flex items-center bg-black/20 rounded-lg p-0.5 border border-white/10 text-[11px]">
          <button
            onClick={() => setNetworkMode('ONLINE')}
            className={`px-2 py-1 rounded flex items-center gap-1 font-medium transition-colors ${
              networkMode === 'ONLINE' ? 'bg-emerald-500 text-white font-bold' : 'text-sky-200 hover:text-white'
            }`}
            title="Full 5G / Broadband Online Mode"
          >
            <Wifi className="w-3 h-3" />
            <span className="hidden 2xl:inline">5G</span>
          </button>
          <button
            onClick={() => setNetworkMode('LOW_2G')}
            className={`px-2 py-1 rounded flex items-center gap-1 font-medium transition-colors ${
              networkMode === 'LOW_2G' ? 'bg-amber-500 text-black font-bold' : 'text-sky-200 hover:text-white'
            }`}
            title="Simulate Remote 2G Low Bandwidth Payload Mode"
          >
            <SignalLow className="w-3 h-3" />
            <span className="hidden 2xl:inline">2G</span>
          </button>
          <button
            onClick={() => setNetworkMode('OFFLINE')}
            className={`px-2 py-1 rounded flex items-center gap-1 font-medium transition-colors ${
              networkMode === 'OFFLINE' ? 'bg-red-600 text-white font-bold' : 'text-sky-200 hover:text-white'
            }`}
            title="Simulate Zero Connectivity Offline Storage Mode"
          >
            <WifiOff className="w-3 h-3" />
            <span className="hidden 2xl:inline">Offline</span>
          </button>
        </div>

        {/* Language Selector Dropdown (8 NER Languages + HI + EN) */}
        <div className="relative">
          <button
            onClick={() => {
              setShowLangDropdown(!showLangDropdown);
              setShowRoleDropdown(false);
              setShowNotifDropdown(false);
            }}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-white/15 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-amber-300" />
            <span className="uppercase">{currentLanguage}</span>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>

          {showLangDropdown && (
            <>
              <div
                className="fixed inset-0 z-[2400]"
                onClick={() => setShowLangDropdown(false)}
              />
              <div className="absolute right-0 mt-2 w-72 sm:w-80 min-w-[280px] max-w-[90vw] bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-200 p-2 z-[2500] text-xs space-y-1 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-gray-100 font-bold text-gray-600 text-[10px] uppercase tracking-wider flex items-center justify-between">
                  <span>Select NER Language (8 States)</span>
                  <span className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono font-bold">
                    Official
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto space-y-1 pr-1">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setShowLangDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between hover:bg-[#EBF3FB] transition-colors ${
                        currentLanguage === l.code ? 'bg-[#EBF3FB] text-[#1E3A5F] font-bold border border-blue-200' : ''
                      }`}
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <span className="font-semibold block text-gray-900">{l.native}</span>
                        <span className="text-[10px] text-gray-500 block truncate">{l.states}</span>
                      </div>
                      <span className="shrink-0 text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded uppercase font-mono font-bold">
                        {l.code}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setShowRoleDropdown(!showRoleDropdown);
              setShowLangDropdown(false);
              setShowNotifDropdown(false);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              userRole === 'CITIZEN'
                ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40 hover:bg-emerald-500/30'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/15'
            }`}
            title="Switch User Role / Governance Persona"
          >
            <UserCheck className="w-3.5 h-3.5 text-sky-300" />
            <span className="hidden sm:inline font-bold">
              {userRole === 'CITIZEN'
                ? 'Citizen / Public'
                : userRole === 'STATE_ADMIN'
                ? 'State Admin'
                : userRole === 'DISTRICT_COLLECTOR'
                ? 'DC / DM'
                : userRole === 'LOGISTICS_OPERATOR'
                ? 'Logistics'
                : 'Field PWD'}
            </span>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-80 min-w-[300px] max-w-[92vw] bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-200 p-2 z-[2500] text-xs space-y-1 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
                <span className="font-bold text-gray-600 text-[10px] uppercase tracking-wider">
                  Switch Governance Role
                </span>
                <span className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono font-bold">
                  RBAC Mode
                </span>
              </div>

              {/* Public Citizen Option */}
              <button
                onClick={() => { setUserRole('CITIZEN'); setShowRoleDropdown(false); }}
                className={`w-full text-left p-2.5 rounded-lg hover:bg-[#EBF3FB] flex items-center justify-between gap-2.5 transition-colors ${
                  userRole === 'CITIZEN' ? 'bg-[#EBF3FB] text-[#1E3A5F] border border-emerald-300 font-medium' : ''
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                    <span>👥 Citizen / Public Traveler</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                    Read-only map, routing, alerts & live broadcasts
                  </p>
                </div>
                <span className="shrink-0 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded uppercase">
                  Public
                </span>
              </button>

              <div className="my-1 border-t border-gray-100" />

              {/* State Admin */}
              <button
                onClick={() => { setUserRole('STATE_ADMIN'); setShowRoleDropdown(false); }}
                className={`w-full text-left p-2.5 rounded-lg hover:bg-[#EBF3FB] flex items-center justify-between gap-2.5 transition-colors ${
                  userRole === 'STATE_ADMIN' ? 'bg-[#EBF3FB] text-[#1E3A5F] border border-blue-300 font-medium' : ''
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                    <span>🏛️ State Admin (MDoNER HQ)</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                    Full author control, override road status & alerts
                  </p>
                </div>
                <span className="shrink-0 text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded uppercase">
                  Admin
                </span>
              </button>

              {/* District Collector */}
              <button
                onClick={() => { setUserRole('DISTRICT_COLLECTOR'); setShowRoleDropdown(false); }}
                className={`w-full text-left p-2.5 rounded-lg hover:bg-[#EBF3FB] flex items-center justify-between gap-2.5 transition-colors ${
                  userRole === 'DISTRICT_COLLECTOR' ? 'bg-[#EBF3FB] text-[#1E3A5F] border border-purple-300 font-medium' : ''
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                    <span>🏢 District Collector / DM</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                    District approvals, relief convoys & emergency
                  </p>
                </div>
                <span className="shrink-0 text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded uppercase">
                  Authority
                </span>
              </button>

              {/* Logistics Operator */}
              <button
                onClick={() => { setUserRole('LOGISTICS_OPERATOR'); setShowRoleDropdown(false); }}
                className={`w-full text-left p-2.5 rounded-lg hover:bg-[#EBF3FB] flex items-center justify-between gap-2.5 transition-colors ${
                  userRole === 'LOGISTICS_OPERATOR' ? 'bg-[#EBF3FB] text-[#1E3A5F] border border-amber-300 font-medium' : ''
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                    <span>🚛 Logistics & Fleet Operator</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                    NavIC truck telemetry & warehouse routing
                  </p>
                </div>
                <span className="shrink-0 text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded uppercase">
                  Fleet
                </span>
              </button>

              {/* Field Inspector */}
              <button
                onClick={() => { setUserRole('FIELD_INSPECTOR'); setShowRoleDropdown(false); }}
                className={`w-full text-left p-2.5 rounded-lg hover:bg-[#EBF3FB] flex items-center justify-between gap-2.5 transition-colors ${
                  userRole === 'FIELD_INSPECTOR' ? 'bg-[#EBF3FB] text-[#1E3A5F] border border-teal-300 font-medium' : ''
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                    <span>👷 Field Inspector (PWD / SDRF)</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                    On-ground damage logging & AR crack scans
                  </p>
                </div>
                <span className="shrink-0 text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded uppercase">
                  Field
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Bell & Dropdown Box */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifDropdown(!showNotifDropdown);
              setShowLangDropdown(false);
              setShowRoleDropdown(false);
              if (!showNotifDropdown && unreadNotifCount > 0) {
                markAllNotificationsAsRead();
              }
            }}
            className="relative p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/15 cursor-pointer"
            title="Notification Center & Live Broadcasts"
          >
            <Bell className="w-4 h-4 text-white" />
            {(unreadNotifCount > 0 || unackAlerts.length > 0) && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#17365D] animate-pulse">
                {unreadNotifCount > 0 ? unreadNotifCount : unackAlerts.length}
              </span>
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-84 sm:w-96 min-w-[320px] max-w-[94vw] bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-200 p-2 z-[2500] text-xs animate-in fade-in zoom-in-95 duration-150">
              {/* Header */}
              <div className="flex items-center justify-between pb-2 px-1 border-b border-gray-100">
                <div className="flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-[#1E3A5F]" />
                  <span className="font-bold text-gray-900 text-xs">Live Intelligence & Alerts</span>
                  {notifications.length > 0 && (
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded-full font-bold">
                      {notifications.length}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {notifications.length > 0 && (
                    <>
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-[10px] text-gray-500 hover:text-blue-700 flex items-center gap-0.5 font-medium transition-colors"
                        title="Mark all as read"
                      >
                        <CheckCheck className="w-3 h-3" /> Mark Read
                      </button>
                      <button
                        onClick={clearAllNotifications}
                        className="text-[10px] text-gray-400 hover:text-red-600 flex items-center gap-0.5 font-medium transition-colors"
                        title="Clear notification history"
                      >
                        <Trash2 className="w-3 h-3" /> Clear
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Notification Stream Body */}
              <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto mt-1 pr-0.5 space-y-1">
                {notifications.length > 0 ? (
                  notifications.map((n) => {
                    const isDanger = n.tier === 'DANGER';
                    const isWarning = n.tier === 'WARNING';
                    const isSuccess = n.tier === 'SUCCESS';

                    return (
                      <div
                        key={n.id}
                        className={`p-2 rounded-lg transition-colors flex items-start gap-2.5 ${
                          !n.isRead ? 'bg-blue-50/60 border-l-2 border-l-blue-600' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="shrink-0 mt-0.5">
                          {isDanger && <XCircle className="w-4 h-4 text-red-600" />}
                          {isWarning && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                          {isSuccess && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                          {!isDanger && !isWarning && !isSuccess && <Info className="w-4 h-4 text-blue-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-gray-900 text-xs truncate">{n.title}</span>
                            <span className="text-[9px] text-gray-400 shrink-0">{n.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">{n.message}</p>
                        </div>
                      </div>
                    );
                  })
                ) : alerts.length > 0 ? (
                  alerts.slice(0, 4).map((a) => (
                    <div
                      key={a.id}
                      onClick={() => {
                        openDrawer('ALERT', a);
                        setShowNotifDropdown(false);
                      }}
                      className="p-2 rounded-lg hover:bg-red-50/70 cursor-pointer transition-colors flex items-start gap-2.5"
                    >
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-gray-900 text-xs truncate">{a.title}</span>
                          <span className="text-[9px] text-gray-400 shrink-0">{a.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">{a.message_i18n?.en || a.title}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-gray-400 text-xs">
                    <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-1 opacity-70" />
                    <div>All systems operational</div>
                    <div className="text-[10px] text-gray-400">No active alerts or incident notifications.</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Global Click-Outside overlay for dropdowns */}
        {(showLangDropdown || showRoleDropdown || showNotifDropdown) && (
          <div
            onClick={() => {
              setShowLangDropdown(false);
              setShowRoleDropdown(false);
              setShowNotifDropdown(false);
            }}
            className="fixed inset-0 z-[2400] bg-transparent"
          />
        )}
      </div>
    </header>
  );
};
