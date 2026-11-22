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
  UserPlus,
  ChevronRight
} from 'lucide-react';

export const Navbar: React.FC<{ onMobileMenuToggle?: () => void }> = ({ onMobileMenuToggle }) => {
  const {
    activeModule,
    navigateToModule,
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
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications,
    alerts,
    districts,
    corridors,
    bridges,
    vehicles,
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
    <>
      <header className="h-14 bg-[#FFFFFF] text-[#30342F] px-3 sm:px-4 lg:px-6 flex items-center justify-between shadow-xs z-[5000] sticky top-0 border-b border-[#D6D8C8]">
        {/* LEFT: Branding & Emblem */}
        <div className="flex items-center gap-2 lg:gap-3 shrink-0">
          {/* Mobile Hamburger Menu */}
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-1.5 rounded-lg bg-[#E7E8D1] hover:bg-[#D5D8C3] text-[#30342F] transition-colors border border-[#D6D8C8] cursor-pointer"
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
            <div className="w-8 h-8 rounded-lg bg-[#E7E8D1] p-1.5 flex items-center justify-center border border-[#D6D8C8] group-hover:border-[#B85042] transition-colors">
              <svg viewBox="0 0 100 100" className="w-5 h-5">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#B85042" strokeWidth="4" />
                <circle cx="50" cy="50" r="16" fill="#B85042" />
                <path d="M50 8 L50 92 M8 50 L92 50 M20 20 L80 80 M20 80 L80 20" stroke="#A7BEAE" strokeWidth="2.5" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-base text-[#30342F]">
                  NERALIS
                </span>
                <span className="bg-[#B85042]/10 text-[#B85042] text-[9px] font-semibold px-1.5 py-0.5 rounded border border-[#B85042]/20 hidden xs:inline">
                  COMMAND CENTER
                </span>
              </div>
              <p className="text-[10px] text-[#74796F] hidden md:block leading-none font-medium">
                AI &amp; GIS Smart Logistics
              </p>
            </div>
          </div>

          {/* Quick Back to Map button if on another module */}
          {activeModule !== 'ACCESSIBILITY' && (
            <button
              onClick={goToLanding}
              className="ml-1 sm:ml-2 bg-[#B85042] hover:bg-[#9E4336] text-white font-semibold px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              title="Back to Landing Page (Main GIS Map)"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">GIS Map</span>
              <span className="sm:hidden">Map</span>
            </button>
          )}
        </div>

        {/* CENTER: Global Search with Smart District Suggestions Dropdown */}
        <div className="flex items-center flex-1 min-w-[180px] max-w-md mx-2 lg:mx-6 relative">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#74796F] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setShowSearchSuggestions(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchSuggestions(true);
              }}
              placeholder={t('quick_search') || 'Search 89 districts, corridors, bridges...'}
              className="w-full bg-[#E7E8D1]/40 text-[#30342F] placeholder:text-[#74796F] text-xs rounded-lg pl-8 pr-7 py-1.5 border border-[#D6D8C8] focus:outline-none focus:border-[#B85042] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchSuggestions(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#74796F] hover:text-[#30342F] p-0.5 cursor-pointer"
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

              <div className="absolute left-0 top-full mt-2 w-[340px] xs:w-[420px] sm:w-[480px] md:w-[540px] max-w-[92vw] bg-[#FFFFFF] text-[#30342F] rounded-xl shadow-2xl border border-[#D6D8C8] p-3 z-[2500] text-xs space-y-2.5 max-h-[500px] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-100">
                {/* Header & State Filter Pills */}
                <div className="space-y-2 border-b border-[#D6D8C8] pb-2 shrink-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#B85042] uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#B85042]" /> NER Districts &amp; Highway Nodes
                    </span>
                    <span className="text-[10px] bg-[#B85042]/10 text-[#B85042] border border-[#B85042]/20 font-semibold px-2 py-0.5 rounded-md font-mono">
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
                        className={`px-2 py-0.5 rounded-md text-[10px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                          searchStateFilter === st.id
                            ? 'bg-[#B85042] text-white font-semibold'
                            : 'bg-[#E7E8D1] text-[#30342F] hover:bg-[#D5D8C3] border border-[#D6D8C8]'
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
                    <div className="text-[9px] font-semibold text-[#74796F] uppercase tracking-wider px-1">
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
                          className="w-full text-left p-2 rounded-lg hover:bg-[#E7E8D1]/50 border border-transparent hover:border-[#D6D8C8] transition-colors flex items-center justify-between gap-2 group cursor-pointer"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-6 h-6 rounded-md bg-[#D5D8C3] border border-[#D6D8C8] flex items-center justify-center shrink-0 group-hover:border-[#B85042]">
                              <MapPin className="w-3.5 h-3.5 text-[#B85042]" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-[#30342F] group-hover:text-[#B85042] truncate">
                                {d.name}
                              </div>
                              <div className="text-[10px] text-[#74796F] flex items-center gap-1.5">
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
                              className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                                d.status === 'OPEN'
                                  ? 'bg-[#A7BEAE]/25 text-[#2C5242] border border-[#A7BEAE]/50'
                                  : d.status === 'RESTRICTED'
                                  ? 'bg-[#E59866]/20 text-[#A04000] border border-[#E59866]/40'
                                  : 'bg-[#B85042]/15 text-[#B85042] border border-[#B85042]/30'
                              }`}
                            >
                              Score: {d.score}/100
                            </span>
                            <span className="text-[9px] font-mono font-medium bg-[#D5D8C3] text-[#30342F] px-1.5 py-0.5 rounded uppercase border border-[#D6D8C8]">
                              {d.state_id}
                            </span>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="p-3 text-center text-[#74796F] text-xs">
                        No matching districts found for "{searchQuery}".
                      </div>
                    )}
                  </div>

                  {/* Corridors Match (If query is active) */}
                  {filteredCorridors.length > 0 && (
                    <div className="space-y-1 pt-2 border-t border-[#D6D8C8]">
                      <div className="text-[9px] font-semibold text-[#74796F] uppercase tracking-wider px-1">
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
                          className="w-full text-left p-2 rounded-lg hover:bg-[#E7E8D1]/50 border border-transparent hover:border-[#D6D8C8] transition-colors flex items-center justify-between gap-2 cursor-pointer group"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Compass className="w-3.5 h-3.5 text-[#B85042] shrink-0" />
                            <div className="min-w-0">
                              <div className="font-semibold text-[#30342F] group-hover:text-[#B85042] truncate">{c.name}</div>
                              <div className="text-[10px] text-[#74796F]">{c.distance_km} km • {c.id}</div>
                            </div>
                          </div>
                          <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-[#D5D8C3] text-[#30342F] border border-[#D6D8C8]">
                            {c.status}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Bridges Match (If query is active) */}
                  {filteredBridges.length > 0 && (
                    <div className="space-y-1 pt-2 border-t border-[#D6D8C8]">
                      <div className="text-[9px] font-semibold text-[#74796F] uppercase tracking-wider px-1">
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
                          className="w-full text-left p-2 rounded-lg hover:bg-[#E7E8D1]/50 border border-transparent hover:border-[#D6D8C8] transition-colors flex items-center justify-between gap-2 cursor-pointer group"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Activity className="w-3.5 h-3.5 text-[#A7BEAE] shrink-0" />
                            <div className="min-w-0">
                              <div className="font-semibold text-[#30342F] group-hover:text-[#B85042] truncate">{b.name}</div>
                              <div className="text-[10px] text-[#74796F]">{b.river} River • {b.id}</div>
                            </div>
                          </div>
                          <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-[#A7BEAE]/25 text-[#2C5242] border border-[#A7BEAE]/50">
                            {b.structural_health_pct}% Health
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Helper */}
                <div className="pt-2 border-t border-[#D6D8C8] flex items-center justify-between text-[10px] text-[#74796F]">
                  <span>Click any district to inspect terrain, PHCs &amp; road health</span>
                  <span className="font-mono">ESC to close</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* RIGHT: Connection Status, Notifications, Language, User Account */}
        <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2.5 shrink-0">
          {/* 1. Connection Status Badge (Click to Force Telemetry Sync) */}
          <button
            onClick={handleNavbarSync}
            disabled={isNavbarSyncing}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 border transition-colors cursor-pointer ${
              networkMode === 'OFFLINE'
                ? 'bg-[#D5D8C3] text-[#74796F] border-[#D6D8C8]'
                : isDemoMode
                ? 'bg-[#E59866]/20 text-[#A04000] border-[#E59866]/40'
                : networkMode === 'LOW_2G'
                ? 'bg-[#D5D8C3] text-[#30342F] border-[#D6D8C8]'
                : 'bg-[#A7BEAE]/25 text-[#2C5242] border-[#A7BEAE]/50'
            }`}
            title="Click to force sync live telemetry"
          >
            {isNavbarSyncing ? (
              <>
                <RefreshCw className="w-3 h-3 text-[#B85042] animate-spin" />
                <span className="hidden sm:inline">Syncing...</span>
              </>
            ) : networkMode === 'OFFLINE' ? (
              <>
                <span className="w-2 h-2 rounded-full bg-[#74796F]" />
                <span className="hidden sm:inline">Offline</span>
              </>
            ) : isDemoMode ? (
              <>
                <span className="w-2 h-2 rounded-full bg-[#E59866]" />
                <span className="hidden sm:inline">Demo Sim</span>
              </>
            ) : networkMode === 'LOW_2G' ? (
              <>
                <span className="w-2 h-2 rounded-full bg-[#B85042]" />
                <span className="hidden sm:inline">2G Grid</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-[#A7BEAE]" />
                <span className="hidden sm:inline">Online</span>
              </>
            )}
          </button>

          {/* 2. Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifDropdown(!showNotifDropdown);
                setShowLangDropdown(false);
                setShowRoleDropdown(false);
                setShowToolsDropdown(false);
              }}
              className="p-1.5 rounded-lg bg-[#FFFFFF] hover:bg-[#E7E8D1] text-[#30342F] border border-[#D6D8C8] transition-colors cursor-pointer relative"
              title="Operational Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#B85042] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
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
                <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-[#FFFFFF] text-[#30342F] rounded-xl shadow-2xl border border-[#D6D8C8] p-3 z-[2500] text-xs space-y-2 animate-in fade-in zoom-in-95 duration-100">
                  <div className="flex items-center justify-between pb-2 border-b border-[#D6D8C8]">
                    <span className="font-semibold text-[11px] text-[#B85042] uppercase tracking-wider">
                      Notifications ({notifications.length})
                    </span>
                    <div className="flex items-center gap-2 text-[10px]">
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-[#74796F] hover:text-[#B85042] cursor-pointer"
                      >
                        Mark all read
                      </button>
                      <span>•</span>
                      <button
                        onClick={clearAllNotifications}
                        className="text-[#74796F] hover:text-[#B85042] cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
                    {notifications.length > 0 ? (
                      notifications.map((n) => {
                        const handleItemClick = () => {
                          markNotificationAsRead(n.id);
                          setShowNotifDropdown(false);

                          let targetMod = n.targetModule;
                          if (!targetMod) {
                            const txt = `${n.title} ${n.message}`.toLowerCase();
                            if (txt.includes('route') || txt.includes('dispatch') || txt.includes('itinerary')) targetMod = 'ROUTE';
                            else if (txt.includes('vehicle') || txt.includes('fleet') || txt.includes('truck')) targetMod = 'FLEET';
                            else if (txt.includes('prediction') || txt.includes('landslide')) targetMod = 'PREDICTION';
                            else if (txt.includes('field') || txt.includes('inspector') || txt.includes('damage')) targetMod = 'FIELD_APP';
                            else if (txt.includes('bridge') || txt.includes('corridor') || txt.includes('nh-')) targetMod = 'ACCESSIBILITY';
                            else targetMod = 'ALERT';
                          }

                          if (targetMod && activeModule !== targetMod) {
                            navigateToModule(targetMod);
                          }

                          if (n.targetDrawer) {
                            openDrawer(n.targetDrawer.type, n.targetDrawer.data);
                          } else {
                            const txt = `${n.title} ${n.message}`.toLowerCase();
                            const matchedCorridor = corridors.find((c) =>
                              txt.includes(c.name.toLowerCase()) || txt.includes(c.id.toLowerCase())
                            );
                            if (matchedCorridor) {
                              openDrawer('CORRIDOR', matchedCorridor);
                              return;
                            }
                            const matchedBridge = bridges.find((b) =>
                              txt.includes(b.name.toLowerCase()) || txt.includes(b.id.toLowerCase())
                            );
                            if (matchedBridge) {
                              openDrawer('BRIDGE', matchedBridge);
                              return;
                            }
                            const matchedAlert = alerts.find((a) =>
                              txt.includes(a.title.toLowerCase()) || txt.includes(a.id.toLowerCase())
                            );
                            if (matchedAlert) {
                              openDrawer('ALERT', matchedAlert);
                            }
                          }
                        };

                        return (
                          <button
                            key={n.id}
                            onClick={handleItemClick}
                            className={`w-full text-left p-2.5 rounded-lg border transition-colors cursor-pointer group ${
                              !n.isRead
                                ? 'bg-[#E7E8D1]/40 border-[#B85042]/30 hover:border-[#B85042]'
                                : 'bg-[#FFFFFF] border-[#D6D8C8] hover:bg-[#E7E8D1]/40'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="font-semibold text-[#30342F] group-hover:text-[#B85042] truncate text-xs transition-colors">
                                {n.title}
                              </span>
                              <span className="text-[9px] text-[#74796F] font-mono shrink-0">{n.timestamp}</span>
                            </div>
                            <p className="text-[11px] text-[#74796F] leading-tight">{n.message}</p>
                            <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-[#D6D8C8] text-[9px]">
                              <span className="font-medium text-[#B85042] flex items-center gap-0.5 group-hover:underline">
                                <span>Inspect Context</span>
                                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                              </span>
                              {!n.isRead && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#B85042]" />
                              )}
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="p-4 text-center text-[#74796F]">No notifications recorded</div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* 3. Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLangDropdown(!showLangDropdown);
                setShowRoleDropdown(false);
                setShowNotifDropdown(false);
                setShowToolsDropdown(false);
              }}
              className="flex items-center gap-1.5 bg-[#FFFFFF] hover:bg-[#E7E8D1] text-[#30342F] px-2 py-1 rounded-lg text-xs font-medium border border-[#D6D8C8] transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#A7BEAE]" />
              <span className="uppercase font-mono text-[11px]">{currentLanguage}</span>
              <ChevronDown className="w-3 h-3 text-[#74796F]" />
            </button>

            {showLangDropdown && (
              <>
                <div
                  className="fixed inset-0 z-[2400]"
                  onClick={() => setShowLangDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-72 sm:w-80 min-w-[280px] max-w-[90vw] bg-[#FFFFFF] text-[#30342F] rounded-xl shadow-2xl border border-[#D6D8C8] p-2 z-[2500] text-xs space-y-1 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 border-b border-[#D6D8C8] font-semibold text-[#74796F] text-[10px] uppercase tracking-wider flex items-center justify-between">
                    <span>NER Languages (8 States)</span>
                    <span className="text-[9px] bg-[#D5D8C3] text-[#B85042] px-1.5 py-0.5 rounded font-mono font-semibold border border-[#D6D8C8]">
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
                        className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between hover:bg-[#E7E8D1]/40 transition-colors cursor-pointer ${
                          currentLanguage === l.code ? 'bg-[#D5D8C3] text-[#B85042] font-semibold border border-[#B85042]/30' : ''
                        }`}
                      >
                        <div className="min-w-0 flex-1 pr-2">
                          <span className="font-medium block text-[#30342F]">{l.native}</span>
                          <span className="text-[10px] text-[#74796F] block truncate">{l.states}</span>
                        </div>
                        <span className="shrink-0 text-[10px] bg-[#D5D8C3] text-[#30342F] px-2 py-0.5 rounded uppercase font-mono font-medium border border-[#D6D8C8]">
                          {l.code}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* 4. User Profile / Role & Auth Switcher */}
          <div className="relative">
            {currentUser ? (
              <button
                onClick={() => {
                  setShowRoleDropdown(!showRoleDropdown);
                  setShowLangDropdown(false);
                  setShowNotifDropdown(false);
                  setShowToolsDropdown(false);
                }}
                className="flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#FFFFFF] hover:bg-[#E7E8D1] text-[#30342F] border border-[#D6D8C8] transition-colors cursor-pointer"
                title="View Account Profile & Switch Role"
              >
                <div className="w-5 h-5 rounded-full bg-[#B85042] text-white font-bold text-[10px] flex items-center justify-center">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden sm:block text-left min-w-0">
                  <span className="font-semibold block text-[11px] truncate max-w-[100px]">
                    {currentUser.name.split(' ')[0]}
                  </span>
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded uppercase bg-[#B85042]/10 text-[#B85042] border border-[#B85042]/20">
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
                <ChevronDown className="w-3 h-3 text-[#74796F]" />
              </button>
            ) : (
              <button
                onClick={() => openAuthModal('SIGNIN')}
                className="flex items-center gap-1.5 bg-[#B85042] hover:bg-[#9E4336] text-white font-semibold px-3 py-1 rounded-lg text-xs shadow-xs transition-colors cursor-pointer"
                title="Sign In to NERALIS Portal"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {showRoleDropdown && currentUser && (
              <>
                <div
                  className="fixed inset-0 z-[2400]"
                  onClick={() => setShowRoleDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-80 sm:w-88 max-w-[94vw] bg-[#FFFFFF] text-[#30342F] rounded-xl shadow-2xl border border-[#D6D8C8] p-3 z-[2500] text-xs space-y-3 animate-in fade-in zoom-in-95 duration-100">
                  {/* Profile Header */}
                  <div className="p-3 bg-[#E7E8D1]/40 rounded-lg border border-[#D6D8C8] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#B85042]/10 border border-[#B85042]/30 flex items-center justify-center font-bold text-sm text-[#B85042]">
                          {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-[#30342F] truncate">{currentUser.name}</div>
                          <div className="text-[11px] text-[#74796F] truncate">{currentUser.email}</div>
                        </div>
                      </div>
                      <span className="bg-[#B85042]/10 text-[#B85042] border border-[#B85042]/20 text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                        {userRole}
                      </span>
                    </div>

                    {currentUser.organization && (
                      <div className="text-[10px] text-[#74796F] bg-[#FFFFFF] px-2 py-1 rounded truncate border border-[#D6D8C8]">
                        {currentUser.organization}
                      </div>
                    )}
                  </div>

                  {/* Switch Role Section */}
                  <div className="space-y-1">
                    <div className="px-1 text-[10px] font-semibold text-[#74796F] uppercase tracking-wider">
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
                          className={`w-full text-left p-2 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                            userRole === r.role
                              ? 'bg-[#D5D8C3] text-[#B85042] font-semibold border border-[#B85042]/30'
                              : 'hover:bg-[#E7E8D1]/40 text-[#30342F]'
                          }`}
                        >
                          <span className="truncate pr-2">{r.label}</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#D5D8C3] text-[#30342F] border border-[#D6D8C8] shrink-0">
                            {r.badge}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sign Out Button */}
                  <div className="pt-2 border-t border-[#D6D8C8]">
                    <button
                      onClick={() => {
                        logout();
                        setShowRoleDropdown(false);
                      }}
                      className="w-full py-1.5 px-3 rounded-lg bg-[#B85042]/10 hover:bg-[#B85042]/20 text-[#B85042] border border-[#B85042]/20 font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
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

      {/* DEDICATED OPERATIONAL STATUS STRIP (Secondary Navigation Zone - Soft Sage Surface) */}
      <div className="bg-[#D5D8C3] border-b border-[#D6D8C8] px-3 sm:px-4 lg:px-6 py-1.5 flex flex-wrap items-center justify-between text-xs text-[#30342F] gap-2 z-[4900]">
        {/* Left: Operational Metrics & Verified Sources */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 flex-wrap">
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-[#A7BEAE]" />
            <span className="font-semibold text-[#30342F]">89 Monitored Districts</span>
            <span className="text-[#74796F]">•</span>
            <span className="text-[#74796F]">35 Corridors</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-[10px] text-[#74796F] pl-2 border-l border-[#D6D8C8]">
            <ShieldCheck className="w-3 h-3 text-[#A7BEAE]" />
            <span>Verified Feeds: IMD Doppler • ISRO Bhuvan • CWC Hydro</span>
          </div>
        </div>

        {/* Right: Operational Controls & Tools */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Network Simulator Controls */}
          <div className="flex items-center bg-[#FFFFFF] rounded-lg p-0.5 border border-[#D6D8C8] text-[10px]">
            <button
              onClick={() => setNetworkOverride('GOOD')}
              className={`px-2 py-0.5 rounded font-medium transition-colors cursor-pointer ${
                networkOverride === 'GOOD' || (networkOverride === 'AUTO' && networkMode === 'ONLINE')
                  ? 'bg-[#A7BEAE] text-[#30342F] font-bold'
                  : 'text-[#74796F] hover:text-[#30342F]'
              }`}
              title="Full Online 4G"
            >
              4G
            </button>
            <button
              onClick={() => setNetworkOverride('LIMITED')}
              className={`px-2 py-0.5 rounded font-medium transition-colors cursor-pointer ${
                networkOverride === 'LIMITED'
                  ? 'bg-[#E59866] text-white font-bold'
                  : 'text-[#74796F] hover:text-[#30342F]'
              }`}
              title="Simulate 3G"
            >
              3G
            </button>
            <button
              onClick={() => setNetworkOverride('CRITICAL')}
              className={`px-2 py-0.5 rounded font-medium transition-colors cursor-pointer ${
                networkOverride === 'CRITICAL' || networkMode === 'LOW_2G'
                  ? 'bg-[#B85042] text-white font-bold'
                  : 'text-[#74796F] hover:text-[#30342F]'
              }`}
              title="Simulate 2G"
            >
              2G
            </button>
            <button
              onClick={() => setNetworkOverride('OFFLINE')}
              className={`px-2 py-0.5 rounded font-medium transition-colors cursor-pointer ${
                networkOverride === 'OFFLINE' || networkMode === 'OFFLINE'
                  ? 'bg-[#74796F] text-white font-bold'
                  : 'text-[#74796F] hover:text-[#30342F]'
              }`}
              title="Simulate Offline"
            >
              Off
            </button>
          </div>

          {/* Operations Tools Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowToolsDropdown(!showToolsDropdown);
                setShowLangDropdown(false);
                setShowRoleDropdown(false);
                setShowNotifDropdown(false);
              }}
              className="flex items-center gap-1.5 bg-[#FFFFFF] hover:bg-[#E7E8D1] text-[#30342F] px-2 py-1 rounded-lg text-xs font-medium border border-[#D6D8C8] transition-colors cursor-pointer"
              title="Operations Tools & Simulators"
            >
              <Wrench className="w-3 h-3 text-[#A7BEAE]" />
              <span className="hidden sm:inline">Tools</span>
              <ChevronDown className="w-3 h-3 text-[#74796F]" />
            </button>

            {showToolsDropdown && (
              <>
                <div
                  className="fixed inset-0 z-[2400]"
                  onClick={() => setShowToolsDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-72 bg-[#FFFFFF] text-[#30342F] rounded-xl shadow-2xl border border-[#D6D8C8] p-2 z-[2500] text-xs space-y-1 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 border-b border-[#D6D8C8] font-semibold text-[#74796F] text-[10px] uppercase tracking-wider flex items-center justify-between">
                    <span>Operations Tools</span>
                    <span className="text-[9px] bg-[#B85042]/10 text-[#B85042] px-1.5 py-0.5 rounded font-semibold">
                      HQ &amp; Field
                    </span>
                  </div>

                  {/* Parliamentary Report */}
                  <button
                    onClick={() => {
                      setIsParliamentModalOpen(true);
                      setShowToolsDropdown(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg flex items-center gap-2.5 hover:bg-[#E7E8D1]/40 text-[#30342F] transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#A7BEAE] shrink-0" />
                    <div>
                      <div className="font-semibold text-[#30342F]">Parliamentary Report</div>
                      <div className="text-[10px] text-[#74796F]">PDF &amp; Excel for Lok Sabha / MDoNER</div>
                    </div>
                  </button>

                  {/* USSD *123# Simulator */}
                  <button
                    onClick={() => {
                      setIsUSSDModalOpen(true);
                      setShowToolsDropdown(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg flex items-center gap-2.5 hover:bg-[#E7E8D1]/40 text-[#30342F] transition-colors cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-[#E59866] shrink-0" />
                    <div>
                      <div className="font-semibold text-[#30342F]">USSD *123# Simulator</div>
                      <div className="text-[10px] text-[#74796F]">Feature phone zero-data corridor queries</div>
                    </div>
                  </button>

                  {/* AI Model Benchmark Modal */}
                  <button
                    onClick={() => {
                      setIsModelMetricsModalOpen(true);
                      setShowToolsDropdown(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg flex items-center gap-2.5 hover:bg-[#E7E8D1]/40 text-[#30342F] transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#B85042] shrink-0" />
                    <div>
                      <div className="font-semibold text-[#30342F]">AI Benchmark (NASA + IMD)</div>
                      <div className="text-[10px] text-[#74796F]">ROC curve, confusion matrix &amp; accuracy</div>
                    </div>
                  </button>

                  {/* Demo Simulation Switch */}
                  <div className="border-t border-[#D6D8C8] pt-1 mt-1">
                    <button
                      onClick={() => {
                        toggleDemoMode();
                        setShowToolsDropdown(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between hover:bg-[#E7E8D1]/40 text-[#30342F] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <FlaskConical className="w-3.5 h-3.5 text-[#E59866]" />
                        <div>
                          <div className="font-semibold text-[#30342F]">Demo Simulation Feeds</div>
                          <div className="text-[10px] text-[#74796F]">Toggle synthetic test scenarios</div>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                          isDemoMode
                            ? 'bg-[#E59866]/20 text-[#A04000] border border-[#E59866]/30'
                            : 'bg-[#D5D8C3] text-[#74796F]'
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

          {/* AI Sahayak Assistant Trigger */}
          <button
            onClick={toggleChatbot}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              isChatbotOpen
                ? 'bg-[#B85042] text-white'
                : 'bg-[#FFFFFF] hover:bg-[#E7E8D1] text-[#30342F] border border-[#D6D8C8]'
            }`}
            title="Open NERALIS Sahayak AI Copilot"
          >
            <Bot className={`w-3.5 h-3.5 ${isChatbotOpen ? 'text-white' : 'text-[#B85042]'}`} />
            <span className="hidden sm:inline">Sahayak</span>
          </button>
        </div>
      </div>
    </>
  );
};
