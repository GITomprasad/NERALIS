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
      <div className="bg-[#F4F5F0]/95 border-b border-[#DFE5DD] px-4 py-1.5 text-xs text-[#68766C] flex items-center justify-between transition-all backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7C9082] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7C9082]"></span>
          </span>
          <span className="font-bold text-[#7C9082]">High-Speed 4G Link Active</span>
          <span className="text-[#334155] hidden sm:inline">|</span>
          <span className="text-[#68766C] hidden sm:inline">Full GIS Telemetry Stream (IMD + ISRO NavIC + CWC)</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[#68766C] text-[11px] hidden md:inline">
            Synced: <span className="text-[#29372D] font-mono">{lastSyncedAt || 'Live'}</span>
          </span>
          <div className="flex items-center gap-1 bg-[#FFFFFF] border border-[#DFE5DD] rounded-lg px-2 py-0.5 text-[11px]">
            <span className="text-[#68766C]">Simulate:</span>
            <button
              onClick={() => setNetworkOverride('LIMITED')}
              className="text-[#FFB547] hover:text-amber-300 font-mono hover:underline px-1 cursor-pointer"
              title="Test 3G Limited Mode"
            >
              3G
            </button>
            <span className="text-[#334155]">/</span>
            <button
              onClick={() => setNetworkOverride('CRITICAL')}
              className="text-[#FF5252] hover:text-rose-300 font-mono hover:underline px-1 cursor-pointer"
              title="Test 2G Critical Mode"
            >
              2G
            </button>
            <span className="text-[#334155]">/</span>
            <button
              onClick={() => setNetworkOverride('OFFLINE')}
              className="text-red-400 hover:text-red-300 font-mono hover:underline px-1 cursor-pointer"
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
  const bannerBg = isCritical
    ? 'bg-red-50 border-red-200 text-red-900'
    : 'bg-amber-50 border-amber-200 text-amber-900';
  const badgeColor = isCritical
    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
    : 'bg-amber-500/20 text-amber-300 border-amber-500/40';

  return (
    <div className={`border-b px-3 sm:px-4 py-2 transition-all backdrop-blur-md ${bannerBg}`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5">
        {/* Status Text & Indicators */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5">
            {isCritical ? (
              <WifiOff className="w-4 h-4 text-[#FF5252] animate-pulse" />
            ) : (
              <Radio className="w-4 h-4 text-[#FFB547]" />
            )}
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider ${badgeColor}`}>
              {isCritical ? '2G / Offline Degraded' : '3G Bandwidth Throttled'}
            </span>
          </div>

          <div className="text-xs">
            <span className="font-bold text-[#29372D]">
              {isCritical ? 'Ultra-Lite Bandwidth Compression Engaged.' : 'Low-Bandwidth Mode Active.'}
            </span>{' '}
            <span className="text-[#68766C] text-[11px] hidden sm:inline">
              Serving IndexedDB cached corridors and delta updates under 2 KB.
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          {networkOverride !== 'AUTO' && (
            <button
              onClick={() => setNetworkOverride('AUTO')}
              className="text-[11px] font-bold text-sky-400 hover:text-sky-300 underline cursor-pointer mr-1"
            >
              Reset Auto
            </button>
          )}

          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FFFFFF] hover:bg-[#DCE4DB] border border-[#1B3022]/30 text-[#1B3022] rounded-lg text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-command-card"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Delta Sync'}</span>
          </button>

          <button
            onClick={() => setShowCriticalDrawer(!showCriticalDrawer)}
            className="flex items-center gap-1 px-2 py-1 bg-[#FFFFFF] text-[#68766C] hover:text-[#29372D] border border-[#DFE5DD] rounded-lg text-xs font-medium cursor-pointer"
          >
            <span>Diagnostics</span>
            {showCriticalDrawer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Diagnostics Drawer */}
      {showCriticalDrawer && (
        <div className="mt-3 pt-3 border-t border-[#DFE5DD] text-xs grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-7xl mx-auto animate-fadeIn">
          <div className="p-2.5 bg-[#F4F5F0] rounded-xl border border-[#DFE5DD]">
            <div className="text-[10px] uppercase font-bold text-[#68766C]">Payload Compression</div>
            <div className="text-sm font-black text-[#7C9082] mt-0.5">87% Compressed</div>
            <div className="text-[10px] text-[#68766C] mt-0.5">High-res satellite overlays disabled; vector lines rendered locally.</div>
          </div>
          <div className="p-2.5 bg-[#F4F5F0] rounded-xl border border-[#DFE5DD]">
            <div className="text-[10px] uppercase font-bold text-[#68766C]">Local Cache Status</div>
            <div className="text-sm font-black text-[#7C9082] mt-0.5">IndexedDB Operational</div>
            <div className="text-[10px] text-[#68766C] mt-0.5">All 89 districts and 4 key corridors pre-cached in browser.</div>
          </div>
          <div className="p-2.5 bg-[#F4F5F0] rounded-xl border border-[#DFE5DD]">
            <div className="text-[10px] uppercase font-bold text-[#68766C]">Emergency Fallback</div>
            <div className="text-sm font-black text-[#FFB547] mt-0.5">USSD *123# Available</div>
            <div className="text-[10px] text-[#68766C] mt-0.5">Field staff can dial zero-data GSM USSD gateway for status.</div>
          </div>
        </div>
      )}
    </div>
  );
};
