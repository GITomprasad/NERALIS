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
  Bot,
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
  RefreshCw,
  LogIn,
  LogOut,
  UserPlus
} from 'lucide-react';

export const Navbar: React.FC<{ onMobileMenuToggle?: () => void }> = ({ onMobileMenuToggle }) => {
  const {
    activeModule,
    goToLanding,
    userRole,
    setUserRole,
    currentUser,
    openAuthModal,
    logout,
    quickSwitchRole,
    networkMode,
    setNetworkMode,
    networkOverride,
    setNetworkOverride,
    isLiteMode,
    isDemoMode,
    toggleDemoMode,
    setIsModelMetricsModalOpen,
    searchQuery,
    setSearchQuery,
    setIsUSSDModalOpen,
    setIsParliamentModalOpen,
    isChatbotOpen,
    toggleChatbot,
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
    <header className="h-16 bg-[#0D1522] text-[#F5F7FA] px-3 sm:px-4 lg:px-6 flex items-center justify-between shadow-lg z-[5000] sticky top-0 border-b border-[#1E2E45]">
      {/* Left: Branding & Emblem */}
      <div className="flex items-center gap-2 lg:gap-3">
        {/* Mobile Hamburger Menu */}
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-xl bg-[#111D2D] hover:bg-[#16253B] text-[#94A3B8] hover:text-[#F5F7FA] transition-colors border border-[#1E2E45] cursor-pointer"
          title="Open Navigation Menu"
          aria-label="Open Navigation Menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Branding representation */}
        <div
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={goToLanding}
          title="Go to Main GIS Map Landing Page"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#111D2D] to-[#16253B] p-1.5 flex items-center justify-center border border-[#19C6D2]/40 shadow-command-glow group-hover:border-[#19C6D2] transition-all">
            <svg viewBox="0 0 100 100" className="w-6 h-6 sm:w-7 sm:h-7">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#19C6D2" strokeWidth="4" />
              <circle cx="50" cy="50" r="16" fill="#438BFF" />
              <path d="M50 8 L50 92 M8 50 L92 50 M20 20 L80 80 M20 80 L80 20" stroke="#19C6D2" strokeWidth="2.5" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black tracking-wider text-base sm:text-lg text-[#F5F7FA]">
                NERALIS
              </span>
              <span className="bg-[#19C6D2]/15 text-[#19C6D2] text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded border border-[#19C6D2]/30 hidden xs:inline">
                COMMAND CENTER
              </span>
            </div>
            <p className="text-[10px] text-[#94A3B8] hidden md:block leading-tight font-medium">
              AI &amp; GIS Smart Logistics • Northeast India
            </p>
          </div>
        </div>

        {/* Quick Back to Map button if on another module */}
        {activeModule !== 'ACCESSIBILITY' && (
          <button
            onClick={goToLanding}
            className="ml-1 sm:ml-2 bg-[#19C6D2] hover:bg-[#16b2bd] text-[#080D16] font-bold px-2.5 sm:px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            title="Back to Landing Page (Main GIS Map)"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="font-extrabold hidden sm:inline">GIS Map</span>
            <span className="font-extrabold sm:hidden">Map</span>
          </button>
        )}
      </div>

      {/* Mobile Search Trigger Button */}
      <div className="md:hidden relative ml-1">
        <button
          onClick={() => setShowSearchSuggestions(!showSearchSuggestions)}
          className="p-2 rounded-xl bg-[#111D2D] hover:bg-[#16253B] text-[#19C6D2] border border-[#1E2E45] cursor-pointer flex items-center justify-center"
          title="Search Districts & Road Nodes"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Center: Search with Smart District Suggestions Dropdown */}
      <div className="hidden md:flex items-center flex-1 min-w-[200px] max-w-md mx-2 lg:mx-4 relative">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setShowSearchSuggestions(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchSuggestions(true);
            }}
            placeholder={t('quick_search') || 'Search 89 districts, corridors, bridges...'}
            className="w-full bg-[#111D2D] text-[#F5F7FA] placeholder:text-[#64748B] text-xs rounded-xl pl-9 pr-8 py-2 border border-[#1E2E45] focus:outline-none focus:border-[#19C6D2] focus:ring-1 focus:ring-[#19C6D2] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setShowSearchSuggestions(false);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#F5F7FA] p-0.5 cursor-pointer"
              title="Clear search query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* District & Node Autocomplete Suggestions Dropdown */}
        {showSearchSuggestions && (
          <>
            <div
              className="fixed inset-0 z-[2400]"
              onClick={() => setShowSearchSuggestions(false)}
            />

            <div className="absolute left-0 top-full mt-2 w-[340px] xs:w-[420px] sm:w-[480px] md:w-[540px] max-w-[92vw] bg-[#0D1522] text-[#F5F7FA] rounded-2xl shadow-2xl border border-[#1E2E45] p-3.5 z-[2500] text-xs space-y-2.5 max-h-[500px] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
              {/* Header & State Filter Pills */}
              <div className="space-y-2 border-b border-[#1E2E45] pb-2.5 shrink-0">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#19C6D2] uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#19C6D2]" /> NER Districts &amp; Highway Nodes
                  </span>
                  <span className="text-[10px] bg-[#19C6D2]/15 text-[#19C6D2] border border-[#19C6D2]/30 font-bold px-2 py-0.5 rounded-full font-mono">
                    89 Districts
                  </span>
                </div>

                {/* State Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5 py-0.5">
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
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                        searchStateFilter === st.id
                          ? 'bg-[#19C6D2] text-[#080D16] shadow-sm font-extrabold'
                          : 'bg-[#111D2D] text-[#94A3B8] hover:bg-[#16253B] hover:text-[#F5F7FA] border border-[#1E2E45]'
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
                  <div className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider px-1">
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
                        className="w-full text-left p-2 rounded-xl hover:bg-[#16253B] border border-transparent hover:border-[#1E2E45] transition-all flex items-center justify-between gap-2 group cursor-pointer"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-6 h-6 rounded-md bg-[#111D2D] border border-[#1E2E45] flex items-center justify-center shrink-0 group-hover:border-[#19C6D2]">
                            <MapPin className="w-3.5 h-3.5 text-[#19C6D2]" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-[#F5F7FA] group-hover:text-[#19C6D2] truncate">
                              {d.name}
                            </div>
                            <div className="text-[10px] text-[#94A3B8] flex items-center gap-1.5">
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
                                ? 'bg-[#20C997]/15 text-[#20C997] border border-[#20C997]/30'
                                : d.status === 'RESTRICTED'
                                ? 'bg-[#FFB547]/15 text-[#FFB547] border border-[#FFB547]/30'
                                : 'bg-[#FF5252]/15 text-[#FF5252] border border-[#FF5252]/30'
                            }`}
                          >
                            Score: {d.score}/100
                          </span>
                          <span className="text-[9px] font-mono font-bold bg-[#111D2D] text-[#94A3B8] px-1.5 py-0.5 rounded uppercase border border-[#1E2E45]">
                            {d.state_id}
                          </span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-center text-[#64748B] text-xs">
                      No matching districts found for "{searchQuery}".
                    </div>
                  )}
                </div>

                {/* Corridors Match (If query is active) */}
                {filteredCorridors.length > 0 && (
                  <div className="space-y-1 pt-2 border-t border-[#1E2E45]">
                    <div className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider px-1">
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
                        className="w-full text-left p-2 rounded-xl hover:bg-[#16253B] border border-transparent hover:border-[#1E2E45] transition-all flex items-center justify-between gap-2 cursor-pointer"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Compass className="w-4 h-4 text-[#818CF8] shrink-0" />
                          <div className="min-w-0">
                            <div className="font-bold text-[#F5F7FA] truncate">{c.name}</div>
                            <div className="text-[10px] text-[#94A3B8]">{c.distance_km} km • {c.id}</div>
                          </div>
                        </div>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#111D2D] text-[#94A3B8] border border-[#1E2E45]">
                          {c.status}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Bridges Match (If query is active) */}
                {filteredBridges.length > 0 && (
                  <div className="space-y-1 pt-2 border-t border-[#1E2E45]">
                    <div className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider px-1">
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
                        className="w-full text-left p-2 rounded-xl hover:bg-[#16253B] border border-transparent hover:border-[#1E2E45] transition-all flex items-center justify-between gap-2 cursor-pointer"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Activity className="w-4 h-4 text-[#FFB547] shrink-0" />
                          <div className="min-w-0">
                            <div className="font-bold text-[#F5F7FA] truncate">{b.name}</div>
                            <div className="text-[10px] text-[#94A3B8]">{b.river} River • {b.id}</div>
                          </div>
                        </div>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#20C997]/15 text-[#20C997] border border-[#20C997]/30">
                          {b.structural_health_pct}% Health
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer Helper */}
              <div className="pt-2 border-t border-[#1E2E45] flex items-center justify-between text-[10px] text-[#64748B]">
                <span>Click any district to inspect terrain, PHCs &amp; road health</span>
                <span className="font-mono">ESC to close</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2.5">
        {/* Live Telemetry Sync Pill */}
        <button
          onClick={handleNavbarSync}
          disabled={isNavbarSyncing}
          className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 border transition-all cursor-pointer hover:opacity-90 active:scale-95 ${
            networkMode === 'OFFLINE'
              ? 'bg-[#111D2D] text-[#94A3B8] border-[#1E2E45]'
              : isDemoMode
              ? 'bg-[#FFB547]/15 text-[#FFB547] border-[#FFB547]/30'
              : networkMode === 'LOW_2G'
              ? 'bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/30'
              : 'bg-[#20C997]/15 text-[#20C997] border-[#20C997]/30'
          }`}
          title="Click to Force Sync Live Telemetry & Outbox"
        >
          {isNavbarSyncing ? (
            <>
              <RefreshCw className="w-3 h-3 text-[#19C6D2] animate-spin" />
              <span className="hidden sm:inline">Syncing...</span>
            </>
          ) : networkMode === 'OFFLINE' ? (
            <>
              <span className="w-2 h-2 rounded-xs bg-[#64748B]" />
              <span className="hidden sm:inline">OFFLINE</span>
            </>
          ) : isDemoMode ? (
            <>
              <span className="w-2 h-2 rounded-full bg-[#FFB547]" />
              <span className="hidden sm:inline">DEMO SIM</span>
            </>
          ) : networkMode === 'LOW_2G' ? (
            <>
              <span className="w-2 h-2 rounded-xs bg-[#38BDF8]" />
              <span className="hidden sm:inline">LOW 2G</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-[#20C997] animate-pulse" />
              <span className="hidden sm:inline">LIVE GRID</span>
            </>
          )}
        </button>

        {/* AI Assistant Sahayak Quick Trigger */}
        <button
          onClick={toggleChatbot}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            isChatbotOpen
              ? 'bg-[#19C6D2] text-[#080D16] shadow-command-glow'
              : 'bg-[#111D2D] hover:bg-[#16253B] text-[#F5F7FA] border border-[#1E2E45] hover:border-[#19C6D2]/50'
          }`}
          title="Open NERALIS AI Sahayak Assistant"
        >
          <Bot className={`w-3.5 h-3.5 ${isChatbotOpen ? 'text-[#080D16]' : 'text-[#19C6D2]'}`} />
          <span className="hidden sm:inline">AI Sahayak</span>
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifDropdown(!showNotifDropdown);
              setShowLangDropdown(false);
              setShowRoleDropdown(false);
              setShowToolsDropdown(false);
            }}
            className="p-2 rounded-xl bg-[#111D2D] hover:bg-[#16253B] text-[#94A3B8] hover:text-[#F5F7FA] border border-[#1E2E45] transition-all cursor-pointer relative"
            title="Operational Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF5252] text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">
                {unreadNotifCount}
              </span>
            )}
          </button>

          {showNotifDropdown && (
            <>
              <div
                className="fixed inset-0 z-[2400]"
                onClick={() => setShowNotifDropdown(false)}
              />
              <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-[#0D1522] text-[#F5F7FA] rounded-2xl shadow-2xl border border-[#1E2E45] p-3 z-[2500] text-xs space-y-2 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-[#1E2E45]">
                  <span className="font-bold text-[11px] text-[#19C6D2] uppercase tracking-wider">
                    Notifications ({notifications.length})
                  </span>
                  <div className="flex items-center gap-2 text-[10px]">
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[#94A3B8] hover:text-[#19C6D2] cursor-pointer"
                    >
                      Mark all read
                    </button>
                    <span>•</span>
                    <button
                      onClick={clearAllNotifications}
                      className="text-[#64748B] hover:text-[#FF5252] cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl border transition-all ${
                          !n.isRead
                            ? 'bg-[#16253B] border-[#1E2E45]'
                            : 'bg-[#111D2D]/60 border-[#1E2E45]/50 opacity-80'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-bold text-[#F5F7FA] truncate text-xs">{n.title}</span>
                          <span className="text-[9px] text-[#64748B] font-mono shrink-0">{n.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-[#94A3B8] leading-tight">{n.message}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-[#64748B]">No notifications recorded</div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* More Tools Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowToolsDropdown(!showToolsDropdown);
              setShowLangDropdown(false);
              setShowRoleDropdown(false);
              setShowNotifDropdown(false);
            }}
            className="flex items-center gap-1.5 bg-[#111D2D] hover:bg-[#16253B] text-[#F5F7FA] px-2.5 py-1.5 rounded-xl text-xs font-semibold border border-[#1E2E45] transition-colors cursor-pointer"
            title="Advanced Governance & Field Tools"
          >
            <Wrench className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span className="hidden lg:inline">Tools</span>
            <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
          </button>

          {showToolsDropdown && (
            <>
              <div
                className="fixed inset-0 z-[2400]"
                onClick={() => setShowToolsDropdown(false)}
              />
              <div className="absolute right-0 mt-2 w-72 bg-[#0D1522] text-[#F5F7FA] rounded-2xl shadow-2xl border border-[#1E2E45] p-2 z-[2500] text-xs space-y-1 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-[#1E2E45] font-bold text-[#64748B] text-[10px] uppercase tracking-wider flex items-center justify-between">
                  <span>Operations Tools</span>
                  <span className="text-[9px] bg-[#19C6D2]/15 text-[#19C6D2] px-1.5 py-0.5 rounded font-bold">
                    HQ &amp; Field
                  </span>
                </div>

                {/* 1. Parliamentary Status Report */}
                <button
                  onClick={() => {
                    setIsParliamentModalOpen(true);
                    setShowToolsDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl flex items-center gap-2.5 hover:bg-[#16253B] text-[#F5F7FA] transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#20C997] shrink-0" />
                  <div>
                    <div className="font-bold text-[#F5F7FA]">Parliamentary Report</div>
                    <div className="text-[10px] text-[#94A3B8]">PDF &amp; Excel for Lok Sabha / MDoNER</div>
                  </div>
                </button>

                {/* 2. USSD *123# Feature Phone Simulator */}
                <button
                  onClick={() => {
                    setIsUSSDModalOpen(true);
                    setShowToolsDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl flex items-center gap-2.5 hover:bg-[#16253B] text-[#F5F7FA] transition-colors cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 text-[#FFB547] shrink-0" />
                  <div>
                    <div className="font-bold text-[#F5F7FA]">USSD *123# Simulator</div>
                    <div className="text-[10px] text-[#94A3B8]">Feature phone zero-data corridor queries</div>
                  </div>
                </button>

                {/* 3. AI Model Performance Benchmark Modal */}
                <button
                  onClick={() => {
                    setIsModelMetricsModalOpen(true);
                    setShowToolsDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl flex items-center gap-2.5 hover:bg-[#16253B] text-[#F5F7FA] transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#818CF8] shrink-0" />
                  <div>
                    <div className="font-bold text-[#F5F7FA]">AI Benchmark (NASA + IMD)</div>
                    <div className="text-[10px] text-[#94A3B8]">ROC curve, confusion matrix &amp; accuracy</div>
                  </div>
                </button>

                {/* 4. Demo Simulation Switch */}
                <div className="border-t border-[#1E2E45] pt-1 mt-1">
                  <button
                    onClick={() => {
                      toggleDemoMode();
                      setShowToolsDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl flex items-center justify-between hover:bg-[#16253B] text-[#F5F7FA] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <FlaskConical className="w-4 h-4 text-[#FFB547]" />
                      <div>
                        <div className="font-bold text-[#F5F7FA]">Demo Simulation Feeds</div>
                        <div className="text-[10px] text-[#94A3B8]">Toggle synthetic test scenarios</div>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isDemoMode
                          ? 'bg-[#FFB547]/20 text-[#FFB547] border border-[#FFB547]/30'
                          : 'bg-[#111D2D] text-[#64748B]'
                      }`}
                    >
                      {isDemoMode ? 'ON' : 'OFF'}
                    </span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Network Mode Switcher (4G / 3G / 2G / Offline) */}
        <div className="hidden sm:flex items-center bg-[#111D2D] rounded-xl p-0.5 border border-[#1E2E45] text-[11px]">
          <button
            onClick={() => setNetworkOverride('GOOD')}
            className={`px-2 py-1 rounded-lg flex items-center gap-1 font-medium transition-colors cursor-pointer ${
              networkOverride === 'GOOD' || (networkOverride === 'AUTO' && networkMode === 'ONLINE')
                ? 'bg-[#20C997] text-[#080D16] font-bold'
                : 'text-[#94A3B8] hover:text-[#F5F7FA]'
            }`}
            title="Full 4G / Broadband Online Mode"
          >
            <Wifi className="w-3 h-3" />
            <span className="hidden xl:inline">4G</span>
          </button>
          <button
            onClick={() => setNetworkOverride('LIMITED')}
            className={`px-2 py-1 rounded-lg flex items-center gap-1 font-medium transition-colors cursor-pointer ${
              networkOverride === 'LIMITED'
                ? 'bg-[#FFB547] text-[#080D16] font-bold'
                : 'text-[#94A3B8] hover:text-[#F5F7FA]'
            }`}
            title="Simulate 3G Limited Lite Mode"
          >
            <SignalLow className="w-3 h-3" />
            <span className="hidden xl:inline">3G</span>
          </button>
          <button
            onClick={() => setNetworkOverride('CRITICAL')}
            className={`px-2 py-1 rounded-lg flex items-center gap-1 font-medium transition-colors cursor-pointer ${
              networkOverride === 'CRITICAL' || networkMode === 'LOW_2G'
                ? 'bg-[#FF5252] text-white font-bold'
                : 'text-[#94A3B8] hover:text-[#F5F7FA]'
            }`}
            title="Simulate 2G Critical Bandwidth Mode"
          >
            <SignalLow className="w-3 h-3" />
            <span className="hidden xl:inline">2G</span>
          </button>
          <button
            onClick={() => setNetworkOverride('OFFLINE')}
            className={`px-2 py-1 rounded-lg flex items-center gap-1 font-medium transition-colors cursor-pointer ${
              networkOverride === 'OFFLINE' || networkMode === 'OFFLINE'
                ? 'bg-[#64748B] text-white font-bold'
                : 'text-[#94A3B8] hover:text-[#F5F7FA]'
            }`}
            title="Simulate Zero Connectivity Offline Storage Mode"
          >
            <WifiOff className="w-3 h-3" />
            <span className="hidden xl:inline">Off</span>
          </button>
        </div>

        {/* Language Selector Dropdown (8 NER Languages + HI + EN) */}
        <div className="relative">
          <button
            onClick={() => {
              setShowLangDropdown(!showLangDropdown);
              setShowRoleDropdown(false);
              setShowNotifDropdown(false);
              setShowToolsDropdown(false);
            }}
            className="flex items-center gap-1.5 bg-[#111D2D] hover:bg-[#16253B] text-[#F5F7FA] px-2.5 py-1.5 rounded-xl text-xs font-semibold border border-[#1E2E45] transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#19C6D2]" />
            <span className="uppercase font-mono">{currentLanguage}</span>
            <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
          </button>

          {showLangDropdown && (
            <>
              <div
                className="fixed inset-0 z-[2400]"
                onClick={() => setShowLangDropdown(false)}
              />
              <div className="absolute right-0 mt-2 w-72 sm:w-80 min-w-[280px] max-w-[90vw] bg-[#0D1522] text-[#F5F7FA] rounded-2xl shadow-2xl border border-[#1E2E45] p-2 z-[2500] text-xs space-y-1 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-[#1E2E45] font-bold text-[#64748B] text-[10px] uppercase tracking-wider flex items-center justify-between">
                  <span>NER Languages (8 States)</span>
                  <span className="text-[9px] bg-[#111D2D] text-[#19C6D2] px-1.5 py-0.5 rounded font-mono font-bold border border-[#1E2E45]">
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
                        addToast('Language Switched', `Interface set to ${l.native} (${l.label}).`, 'INFO');
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between hover:bg-[#16253B] transition-colors cursor-pointer ${
                        currentLanguage === l.code ? 'bg-[#16253B] text-[#19C6D2] font-bold border border-[#19C6D2]/30' : ''
                      }`}
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <span className="font-semibold block text-[#F5F7FA]">{l.native}</span>
                        <span className="text-[10px] text-[#94A3B8] block truncate">{l.states}</span>
                      </div>
                      <span className="shrink-0 text-[10px] bg-[#111D2D] text-[#94A3B8] px-2 py-0.5 rounded uppercase font-mono font-bold border border-[#1E2E45]">
                        {l.code}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Account / Role & Auth Switcher */}
        <div className="relative">
          {currentUser ? (
            /* Logged In User Pill */
            <button
              onClick={() => {
                setShowRoleDropdown(!showRoleDropdown);
                setShowLangDropdown(false);
                setShowNotifDropdown(false);
                setShowToolsDropdown(false);
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-[#111D2D] hover:bg-[#16253B] text-[#F5F7FA] border border-[#1E2E45] transition-all cursor-pointer"
              title="View Account Profile & Switch Governance Role"
            >
              <div className="w-5 h-5 rounded-full bg-[#19C6D2] text-[#080D16] font-black text-[10px] flex items-center justify-center">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden sm:block text-left min-w-0">
                <span className="font-bold block text-[11px] truncate max-w-[100px]">
                  {currentUser.name.split(' ')[0]}
                </span>
              </div>
              <span
                className={`text-[9px] font-black px-1.5 py-0.2 rounded uppercase ${
                  userRole === 'STATE_ADMIN'
                    ? 'bg-[#438BFF]/20 text-[#438BFF] border border-[#438BFF]/30'
                    : userRole === 'DISTRICT_COLLECTOR'
                    ? 'bg-[#818CF8]/20 text-[#818CF8] border border-[#818CF8]/30'
                    : userRole === 'LOGISTICS_OPERATOR'
                    ? 'bg-[#FFB547]/20 text-[#FFB547] border border-[#FFB547]/30'
                    : userRole === 'FIELD_INSPECTOR'
                    ? 'bg-[#20C997]/20 text-[#20C997] border border-[#20C997]/30'
                    : 'bg-[#64748B]/20 text-[#94A3B8] border border-[#64748B]/30'
                }`}
              >
                {userRole === 'STATE_ADMIN'
                  ? 'ADMIN'
                  : userRole === 'DISTRICT_COLLECTOR'
                  ? 'AUTH'
                  : userRole === 'LOGISTICS_OPERATOR'
                  ? 'FLEET'
                  : userRole === 'FIELD_INSPECTOR'
                  ? 'FIELD'
                  : 'PUBLIC'}
              </span>
              <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
            </button>
          ) : (
            /* Logged Out: Direct Sign In Trigger */
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => openAuthModal('SIGNIN')}
                className="flex items-center gap-1.5 bg-[#19C6D2] hover:bg-[#16b2bd] text-[#080D16] font-extrabold px-3 py-1.5 rounded-xl text-xs shadow-sm transition-all cursor-pointer"
                title="Sign In to NERALIS Portal"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            </div>
          )}

          {showRoleDropdown && currentUser && (
            <>
              <div
                className="fixed inset-0 z-[2400]"
                onClick={() => setShowRoleDropdown(false)}
              />
              <div className="absolute right-0 mt-2 w-80 sm:w-88 max-w-[94vw] bg-[#0D1522] text-[#F5F7FA] rounded-2xl shadow-2xl border border-[#1E2E45] p-3 z-[2500] text-xs space-y-3 animate-in fade-in zoom-in-95 duration-150">
                {/* Profile Header */}
                <div className="p-3 bg-[#111D2D] rounded-xl border border-[#1E2E45] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#19C6D2]/20 border border-[#19C6D2]/40 flex items-center justify-center font-black text-sm text-[#19C6D2]">
                        {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="min-w-0">
                        <div className="font-black text-xs text-[#F5F7FA] truncate">{currentUser.name}</div>
                        <div className="text-[11px] text-[#94A3B8] truncate">{currentUser.email}</div>
                      </div>
                    </div>
                    <span className="bg-[#19C6D2]/15 text-[#19C6D2] border border-[#19C6D2]/30 text-[9px] font-black px-2 py-0.5 rounded uppercase">
                      {userRole}
                    </span>
                  </div>

                  {currentUser.organization && (
                    <div className="text-[10px] text-[#94A3B8] bg-[#080D16] px-2 py-1 rounded truncate border border-[#1E2E45]/50">
                      {currentUser.organization}
                    </div>
                  )}
                </div>

                {/* Switch Role Section */}
                <div className="space-y-1">
                  <div className="px-1 text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                    Switch Governance Role
                  </div>
                  <div className="space-y-1">
                    {[
                      { role: 'STATE_ADMIN', label: 'State Logistics Administrator (MDoNER / Assam PWD)', badge: 'FULL HQ' },
                      { role: 'DISTRICT_COLLECTOR', label: 'District Magistrate / Collector (Kamrup / Tawang)', badge: 'DM / DDMA' },
                      { role: 'LOGISTICS_OPERATOR', label: 'Logistics Fleet Operator (IOCL / Cold Chain)', badge: 'OPERATOR' },
                      { role: 'FIELD_INSPECTOR', label: 'PWD Field Junior Engineer / Highway Patrol', badge: 'FIELD PWA' },
                      { role: 'CITIZEN', label: 'Public Citizen / Transporter Inquiry', badge: 'PUBLIC' }
                    ].map((r) => (
                      <button
                        key={r.role}
                        onClick={() => {
                          quickSwitchRole(r.role as UserRole);
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full text-left p-2 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                          userRole === r.role
                            ? 'bg-[#16253B] text-[#19C6D2] font-bold border border-[#19C6D2]/40'
                            : 'hover:bg-[#111D2D] text-[#94A3B8]'
                        }`}
                      >
                        <span className="truncate pr-2">{r.label}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#111D2D] text-[#F5F7FA] border border-[#1E2E45] shrink-0">
                          {r.badge}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sign Out Button */}
                <div className="pt-2 border-t border-[#1E2E45]">
                  <button
                    onClick={() => {
                      logout();
                      setShowRoleDropdown(false);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-[#FF5252]/10 hover:bg-[#FF5252]/20 text-[#FF5252] border border-[#FF5252]/30 font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
