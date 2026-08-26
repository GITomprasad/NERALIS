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
  Map
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeModule,
    goToLanding,
    userRole,
    setUserRole,
    networkMode,
    setNetworkMode,
    searchQuery,
    setSearchQuery,
    setIsUSSDModalOpen,
    setIsParliamentModalOpen,
    toasts,
    alerts
  } = usePlatform();

  const { currentLanguage, setLanguage, languages, t } = useLanguage();
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const unackAlerts = alerts.filter(a => !a.acknowledged);

  return (
    <header className="h-16 bg-[#1E3A5F] text-white px-4 lg:px-6 flex items-center justify-between shadow-md z-[5000] sticky top-0 border-b border-[#2563A8]/40">
      {/* Left: Branding & Emblem */}
      <div className="flex items-center gap-3">
        {/* Ashoka Stambh / GoI Emblem representation */}
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
                SIH26002
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
            className="ml-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
            title="Back to Landing Page (Main GIS Map)"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-900" />
            <span className="font-extrabold">← Back to Map</span>
          </button>
        )}
      </div>

      {/* Center: Live Emergency Ticker & Search */}
      <div className="hidden md:flex items-center gap-4 flex-1 max-w-xl mx-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('quick_search')}
            className="w-full bg-white/10 text-white placeholder:text-sky-200/60 text-xs rounded-lg pl-9 pr-3 py-1.5 border border-white/15 focus:outline-none focus:bg-white focus:text-gray-900 focus:ring-2 focus:ring-amber-400 transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 lg:gap-3">
        {/* USSD *123# Feature Phone Tool */}
        <button
          onClick={() => setIsUSSDModalOpen(true)}
          className="bg-emerald-600/90 hover:bg-emerald-600 text-white px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 border border-emerald-400/40 shadow-sm"
          title="Open USSD *123# Feature Phone Fallback Simulator"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">USSD *123#</span>
        </button>

        {/* Parliament Report Button */}
        <button
          onClick={() => setIsParliamentModalOpen(true)}
          className="bg-[#2563A8] hover:bg-[#1d4f88] text-white px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 border border-sky-400/40 shadow-sm"
          title="Generate Parliament / MLA Status Report"
        >
          <FileText className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">{t('parliament_report')}</span>
        </button>

        {/* Network Mode Switcher */}
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
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-white/15 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-amber-300" />
            <span className="uppercase">{currentLanguage}</span>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>

          {showLangDropdown && (
            <div className="absolute right-0 mt-2 w-64 max-w-[90vw] bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-200 p-2 z-[2500] text-xs space-y-1 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 border-b border-gray-100 font-bold text-gray-500 text-[10px] uppercase">
                Select NER Official Language (8 States)
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
                    <div className="min-w-0 flex-1">
                      <span className="font-semibold block">{l.native}</span>
                      <span className="text-[10px] text-gray-500 block">{l.states}</span>
                    </div>
                    <span className="shrink-0 text-[10px] bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded uppercase font-mono font-bold">
                      {l.code}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
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
            <div className="absolute right-0 mt-2 w-80 max-w-[92vw] bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-200 p-2 z-[2500] text-xs space-y-1 animate-in fade-in zoom-in-95 duration-150">
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

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="relative p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/15"
            title="Urgent Alerts"
          >
            <Bell className="w-4 h-4 text-white" />
            {unackAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#1E3A5F] animate-pulse">
                {unackAlerts.length}
              </span>
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white text-gray-800 rounded-lg shadow-xl border border-gray-200 p-2 z-[2500] text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="font-bold text-gray-800">Urgent Field Dispatches</span>
                <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-semibold">
                  {unackAlerts.length} Unacknowledged
                </span>
              </div>
              <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto mt-1">
                {alerts.slice(0, 4).map((a) => (
                  <div key={a.id} className="py-2 px-1">
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span className="font-semibold text-gray-900 text-xs">{a.title}</span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">{a.message_i18n?.en || a.title}</p>
                    <span className="text-[10px] text-gray-400 block mt-1">{a.timestamp}</span>
                  </div>
                ))}
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
