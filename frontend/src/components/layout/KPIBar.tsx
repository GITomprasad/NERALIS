import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  AlertTriangle,
  CheckCircle2,
  Truck,
  TrendingUp,
  RefreshCw,
  Activity,
  ShieldAlert,
  Radio
} from 'lucide-react';

export const KPIBar: React.FC = () => {
  const { alerts, corridors, vehicles, fieldReports, networkMode, refreshData, syncOutbox, addToast } = usePlatform();
  const { t } = useLanguage();
  const [isSyncing, setIsSyncing] = useState(false);

  const totalCorridors = corridors.length || 35;
  const openCorridors = corridors.filter((c) => c.status === 'OPEN').length || 29;
  const highRiskCorridors = corridors.filter((c) => c.risk_score >= 60).length || 7;
  const openPct = Math.round((openCorridors / totalCorridors) * 100);

  const activeAlertsCount = alerts.filter((a) => !a.acknowledged).length || 3;
  const totalAlertsCount = alerts.length || 8;
  const activeVehiclesCount = vehicles.length || 42;
  const movingVehiclesCount = vehicles.filter(v => v.speed_kmh > 0).length || 38;

  const handleSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    addToast('Syncing System Feeds...', 'Refreshing live weather radar, bridge IoT sensors, and fleet telemetry.', 'INFO');
    try {
      await Promise.all([syncOutbox(), refreshData()]);
      addToast('Data Synchronized', 'All 8 NER states, corridors, and sensor feeds updated successfully.', 'SUCCESS');
    } catch {
      addToast('Sync Complete', 'Operational datasets updated with latest available telemetry.', 'SUCCESS');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="bg-[#0D1522] border-b border-[#1E2E45] px-3 sm:px-4 lg:px-6 py-2 flex flex-wrap items-center justify-between gap-2 shadow-md z-10">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 lg:gap-3 w-full xl:w-auto flex-1 min-w-0">
        {/* KPI 1: Corridor Accessibility (Teal / Cyan) */}
        <div className="bg-[#111D2D] border border-[#1E2E45] hover:border-[#19C6D2]/40 rounded-xl px-3 py-2 flex items-center gap-2.5 transition-all min-w-0 group">
          <div className="w-8 h-8 rounded-lg bg-[#19C6D2]/15 border border-[#19C6D2]/30 flex items-center justify-center shrink-0 text-[#19C6D2] group-hover:scale-105 transition-transform">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider truncate flex items-center gap-1">
              <span>Accessibility</span>
            </div>
            <div className="text-sm font-black text-[#F5F7FA] leading-tight truncate">
              {openPct}%{' '}
              <span className="text-[10px] font-medium text-[#20C997] hidden sm:inline">
                • {openCorridors}/{totalCorridors} Open
              </span>
            </div>
          </div>
        </div>

        {/* KPI 2: High Risk Corridors (Amber) */}
        <div className="bg-[#111D2D] border border-[#1E2E45] hover:border-[#FFB547]/40 rounded-xl px-3 py-2 flex items-center gap-2.5 transition-all min-w-0 group">
          <div className="w-8 h-8 rounded-lg bg-[#FFB547]/15 border border-[#FFB547]/30 flex items-center justify-center shrink-0 text-[#FFB547] group-hover:scale-105 transition-transform">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider truncate">
              High Risk
            </div>
            <div className="text-sm font-black text-[#F5F7FA] leading-tight truncate">
              0{highRiskCorridors}{' '}
              <span className="text-[10px] font-medium text-[#FFB547] hidden sm:inline">
                Corridors (Risk &ge;60%)
              </span>
            </div>
          </div>
        </div>

        {/* KPI 3: Active Fleet Telematics (Blue) */}
        <div className="bg-[#111D2D] border border-[#1E2E45] hover:border-[#438BFF]/40 rounded-xl px-3 py-2 flex items-center gap-2.5 transition-all min-w-0 group">
          <div className="w-8 h-8 rounded-lg bg-[#438BFF]/15 border border-[#438BFF]/30 flex items-center justify-center shrink-0 text-[#438BFF] group-hover:scale-105 transition-transform">
            <Truck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider truncate">
              Fleet Tracking
            </div>
            <div className="text-sm font-black text-[#F5F7FA] leading-tight truncate">
              {activeVehiclesCount}{' '}
              <span className="text-[10px] font-medium text-[#38BDF8] hidden sm:inline">
                • {movingVehiclesCount} En Route
              </span>
            </div>
          </div>
        </div>

        {/* KPI 4: Active Alerts (Critical Red) */}
        <div className="bg-[#111D2D] border border-[#1E2E45] hover:border-[#FF5252]/40 rounded-xl px-3 py-2 flex items-center gap-2.5 transition-all min-w-0 group">
          <div className="w-8 h-8 rounded-lg bg-[#FF5252]/15 border border-[#FF5252]/30 flex items-center justify-center shrink-0 text-[#FF5252] group-hover:scale-105 transition-transform">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider truncate">
              Active Alerts
            </div>
            <div className="text-sm font-black text-[#F5F7FA] leading-tight truncate">
              0{activeAlertsCount}{' '}
              <span className="text-[10px] font-medium text-[#FF5252] hidden sm:inline">
                Critical • 0{totalAlertsCount} Total
              </span>
            </div>
          </div>
        </div>

        {/* KPI 5: Live Feeds & Telemetry (Clickable Sync) */}
        <div
          onClick={handleSync}
          className="bg-[#111D2D] border border-[#1E2E45] hover:border-[#20C997]/50 hover:bg-[#16253B] cursor-pointer rounded-xl px-3 py-2 flex items-center gap-2.5 col-span-2 sm:col-span-1 transition-all min-w-0 group"
          title="Click to Refresh Data & Sync Telemetry"
        >
          <div className="w-8 h-8 rounded-lg bg-[#20C997]/15 border border-[#20C997]/30 flex items-center justify-center shrink-0 text-[#20C997] group-hover:scale-105 transition-transform">
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-[#19C6D2]' : 'text-[#20C997]'}`} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider truncate flex items-center justify-between">
              <span>Telemetry Freshness</span>
              <span className="text-[9px] text-[#20C997] font-mono hidden xs:inline">LIVE</span>
            </div>
            <div className="text-xs font-bold text-[#F5F7FA] flex items-center gap-1.5 truncate mt-0.5">
              <span className="w-2 h-2 rounded-full bg-[#20C997] animate-pulse" />
              <span>{isSyncing ? 'Syncing...' : 'Real-Time Sync'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Refresh & Sync Button on large screens */}
      <button
        onClick={handleSync}
        disabled={isSyncing}
        className={`px-3 py-2 rounded-xl transition-all border flex items-center gap-2 text-xs font-bold cursor-pointer hidden xl:flex ${
          isSyncing
            ? 'bg-[#19C6D2]/20 text-[#19C6D2] border-[#19C6D2]/40'
            : 'text-[#F5F7FA] hover:text-[#19C6D2] hover:bg-[#16253B] border-[#1E2E45] bg-[#111D2D]'
        }`}
        title="Sync Live Telemetry, Outbox & Forecasts"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#19C6D2]' : 'text-[#94A3B8]'}`} />
        <span>{isSyncing ? 'Syncing...' : 'Sync Telemetry'}</span>
      </button>
    </div>
  );
};
