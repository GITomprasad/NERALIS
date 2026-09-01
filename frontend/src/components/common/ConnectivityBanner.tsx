import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import {
  Wifi,
  WifiOff,
  Radio,
  RefreshCw,
  Zap,
  Clock,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Truck,
  AlertTriangle,
  Layers
} from 'lucide-react';

export const ConnectivityBanner: React.FC = () => {
  const {
    connectivityStatus,
    effectiveConnectionType,
    networkOverride,
    setNetworkOverride,
    isLiteMode,
    liteData,
    isCachedData,
    lastSyncedAt,
    syncNow
  } = usePlatform();

  const [isSyncing, setIsSyncing] = useState(false);
  const [showCriticalDrawer, setShowCriticalDrawer] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncNow();
    } finally {
      setIsSyncing(false);
    }
  };

  // If optimal 4G and Auto mode, show compact, non-intrusive status pill
  if (connectivityStatus === 'GOOD' && networkOverride === 'AUTO') {
    return (
      <div className="bg-slate-900/90 border-b border-emerald-500/20 px-4 py-1.5 text-xs text-slate-300 flex items-center justify-between transition-all">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-emerald-400">High-Speed 4G Link Active</span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden sm:inline">Full GIS Telemetry Stream (IMD + ISRO NavIC + CWC)</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-[11px] hidden md:inline">
            Synced: <span className="text-slate-200">{lastSyncedAt || 'Live'}</span>
          </span>
          <div className="flex items-center gap-1 bg-slate-800/80 border border-slate-700/60 rounded px-2 py-0.5 text-[11px]">
            <span className="text-slate-400">Test Mode:</span>
            <button
              onClick={() => setNetworkOverride('LIMITED')}
              className="text-amber-400 hover:text-amber-300 font-mono hover:underline px-1"
              title="Test 3G Limited Mode"
            >
              3G
            </button>
            <span className="text-slate-600">/</span>
            <button
              onClick={() => setNetworkOverride('CRITICAL')}
              className="text-rose-400 hover:text-rose-300 font-mono hover:underline px-1"
              title="Test 2G Critical Mode"
            >
              2G
            </button>
            <span className="text-slate-600">/</span>
            <button
              onClick={() => setNetworkOverride('OFFLINE')}
              className="text-red-400 hover:text-red-300 font-mono hover:underline px-1"
              title="Test Offline Mode"
            >
              Offline
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3G / LIMITED or 2G / CRITICAL / OFFLINE Mode Banner
  const isCritical = connectivityStatus === 'CRITICAL' || effectiveConnectionType === 'offline' || effectiveConnectionType === '2g' || effectiveConnectionType === 'slow-2g';
  const bannerBg = isCritical ? 'bg-gradient-to-r from-red-950 via-rose-950 to-slate-950 border-rose-500/40 text-rose-100' : 'bg-gradient-to-r from-amber-950 via-yellow-950 to-slate-950 border-amber-500/40 text-amber-100';
  const badgeColor = isCritical ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40';

  return (
    <div className={`border-b px-3 sm:px-4 py-2 transition-all ${bannerBg}`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5">
        {/* Status Text & Indicators */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {isCritical ? (
            <span className="flex items-center justify-center p-1 rounded bg-rose-500/20 text-rose-400 animate-pulse">
              <WifiOff className="w-4 h-4" />
            </span>
          ) : (
            <span className="flex items-center justify-center p-1 rounded bg-amber-500/20 text-amber-400">
              <Radio className="w-4 h-4" />
            </span>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm tracking-tight">
              {isCritical ? '🔴 2G Low-Network / Offline — Lite Mode Engaged' : '⚠ Limited Connectivity (3G) — Lite Mode Active'}
            </span>

            <span className={`text-[11px] font-mono px-2 py-0.5 rounded border font-semibold ${badgeColor}`}>
              {isCachedData ? 'CACHED SNAPSHOT' : 'LIGHTWEIGHT API (<2 KB)'}
            </span>

            {isCachedData && (
              <span className="text-xs text-slate-300 flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3 text-slate-400" />
                Last synced: {lastSyncedAt || 'Earlier session'}
              </span>
            )}
          </div>
        </div>

        {/* Action Controls & Network Switcher */}
        <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
          {/* Quick Critical Summary Toggle */}
          <button
            onClick={() => setShowCriticalDrawer(!showCriticalDrawer)}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700 transition"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Critical Feed</span>
            {showCriticalDrawer ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
          </button>

          {/* Manual Sync Button */}
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 text-xs px-3 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white font-medium shadow-sm transition disabled:opacity-50"
            title="Force synchronization"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
          </button>

          {/* Network Simulator Controls for Demo / Testing */}
          <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-700/80 rounded px-2 py-1 text-[11px]">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mr-1">Simulate:</span>
            <button
              onClick={() => setNetworkOverride('AUTO')}
              className={`px-1.5 py-0.5 rounded font-mono ${networkOverride === 'AUTO' ? 'bg-sky-600 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
            >
              Auto
            </button>
            <button
              onClick={() => setNetworkOverride('GOOD')}
              className={`px-1.5 py-0.5 rounded font-mono ${networkOverride === 'GOOD' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
            >
              4G
            </button>
            <button
              onClick={() => setNetworkOverride('LIMITED')}
              className={`px-1.5 py-0.5 rounded font-mono ${networkOverride === 'LIMITED' ? 'bg-amber-600 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
            >
              3G
            </button>
            <button
              onClick={() => setNetworkOverride('CRITICAL')}
              className={`px-1.5 py-0.5 rounded font-mono ${networkOverride === 'CRITICAL' ? 'bg-rose-600 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
            >
              2G
            </button>
            <button
              onClick={() => setNetworkOverride('OFFLINE')}
              className={`px-1.5 py-0.5 rounded font-mono ${networkOverride === 'OFFLINE' ? 'bg-red-700 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
            >
              Offline
            </button>
          </div>
        </div>
      </div>

      {/* Collapsible Lightweight Critical Snapshot Summary */}
      {showCriticalDrawer && liteData && (
        <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-900/95 p-3 rounded-lg border border-slate-800 shadow-xl animate-fadeIn">
          {/* Priority Vehicles */}
          <div className="bg-slate-950/80 p-2.5 rounded border border-slate-800">
            <div className="flex items-center justify-between mb-2 text-sky-400 font-bold border-b border-slate-800 pb-1">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                <span>Tracked Fleet ({liteData.vehicles.length})</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Payload: {liteData.payload_size_kb} KB</span>
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {liteData.vehicles.slice(0, 4).map((v) => (
                <div key={v.vehicle_id} className="flex items-center justify-between text-[11px] bg-slate-900/60 p-1.5 rounded border border-slate-800/80">
                  <div>
                    <span className="font-bold text-slate-200 font-mono">{v.vehicle_id}</span>
                    <span className="text-slate-400 ml-1.5 truncate block sm:inline">{v.last_known_location}</span>
                  </div>
                  <div className="text-right">
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${v.status === 'RESTRICTED' ? 'bg-rose-900/60 text-rose-300' : 'bg-emerald-900/60 text-emerald-300'}`}>
                      {v.status}
                    </span>
                    {v.cold_chain_temp_c && (
                      <span className="block text-[10px] text-cyan-300 font-mono">{v.cold_chain_temp_c}°C</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Corridors & Blockades */}
          <div className="bg-slate-950/80 p-2.5 rounded border border-slate-800">
            <div className="flex items-center justify-between mb-2 text-amber-400 font-bold border-b border-slate-800 pb-1">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Hazard Corridors ({liteData.corridors_at_risk.length})</span>
              </span>
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {liteData.corridors_at_risk.length === 0 ? (
                <p className="text-slate-400 text-center py-2">No critical blockades recorded.</p>
              ) : (
                liteData.corridors_at_risk.slice(0, 4).map((c) => (
                  <div key={c.id} className="flex items-center justify-between text-[11px] bg-slate-900/60 p-1.5 rounded border border-slate-800/80">
                    <div>
                      <span className="font-bold text-slate-200">{c.name}</span>
                      <span className="text-slate-400 block text-[10px]">{c.hazard_type}</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-rose-950 text-rose-300 border border-rose-800 font-bold">
                      Risk {c.risk_score}%
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Critical Alerts & Bridges */}
          <div className="bg-slate-950/80 p-2.5 rounded border border-slate-800">
            <div className="flex items-center justify-between mb-2 text-rose-400 font-bold border-b border-slate-800 pb-1">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Active Alerts ({liteData.critical_alerts.length})</span>
              </span>
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {liteData.critical_alerts.slice(0, 3).map((a) => (
                <div key={a.id} className="text-[11px] bg-slate-900/60 p-1.5 rounded border border-slate-800/80">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-slate-200">{a.title}</span>
                    <span className="text-[10px] text-rose-400 font-mono font-bold">{a.tier.split(' - ')[0]}</span>
                  </div>
                  <p className="text-slate-400 text-[10px] line-clamp-1">{a.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
