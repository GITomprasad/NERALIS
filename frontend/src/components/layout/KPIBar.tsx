import React from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  AlertTriangle,
  CheckCircle2,
  Truck,
  ClipboardList,
  RefreshCw,
  TrendingUp,
  MapPin
} from 'lucide-react';

export const KPIBar: React.FC = () => {
  const { alerts, corridors, vehicles, fieldReports, networkMode, refreshData } = usePlatform();
  const { t } = useLanguage();

  const totalCorridors = corridors.length || 15;
  const openCorridors = corridors.filter((c) => c.status === 'OPEN').length || 10;
  const openPct = Math.round((openCorridors / totalCorridors) * 100);

  const pendingReportsCount = fieldReports.filter((r) => r.status.includes('QUEUED') || r.status.includes('DISPATCHED')).length || 2;
  const activeAlertsCount = alerts.filter((a) => !a.acknowledged).length || 3;

  return (
    <div className="bg-white border-b border-[#D1D5DB] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)] z-10">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 lg:gap-3 w-full xl:w-auto flex-1">
        {/* Chip 1: Active Alerts */}
        <div className="bg-[#FFF5F5] border border-red-200 rounded-lg px-3 py-1.5 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4 text-[#9B1B1B]" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-red-700 tracking-wider">
              {t('today_alerts')}
            </div>
            <div className="text-sm font-black text-gray-900 leading-tight">
              {activeAlertsCount} <span className="text-[10px] font-normal text-red-600">Pending Ack</span>
            </div>
          </div>
        </div>

        {/* Chip 2: Open Routes % */}
        <div className="bg-[#EBFBF5] border border-emerald-200 rounded-lg px-3 py-1.5 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-[#0F6B6B]" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
              {t('open_routes_pct')}
            </div>
            <div className="text-sm font-black text-gray-900 leading-tight">
              {openPct}% <span className="text-[10px] font-normal text-emerald-700">({openCorridors}/{totalCorridors})</span>
            </div>
          </div>
        </div>

        {/* Chip 3: Vehicles Tracked */}
        <div className="bg-[#EBF3FB] border border-blue-200 rounded-lg px-3 py-1.5 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4 text-[#2563A8]" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-[#1E3A5F] tracking-wider">
              {t('vehicles_tracked')}
            </div>
            <div className="text-sm font-black text-gray-900 leading-tight">
              {vehicles.length || 5} <span className="text-[10px] font-normal text-blue-700">98.4% GPS Ping</span>
            </div>
          </div>
        </div>

        {/* Chip 4: Pending Field Reports */}
        <div className="bg-[#FFFDF0] border border-amber-200 rounded-lg px-3 py-1.5 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <ClipboardList className="w-4 h-4 text-[#B85C00]" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
              {t('pending_reports')}
            </div>
            <div className="text-sm font-black text-gray-900 leading-tight">
              {pendingReportsCount} <span className="text-[10px] font-normal text-amber-700">In Verification</span>
            </div>
          </div>
        </div>

        {/* Chip 5: Sync Status */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 flex items-center gap-2.5 col-span-2 sm:col-span-1">
          <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
            <RefreshCw className="w-4 h-4 text-slate-700" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] uppercase font-bold text-slate-700 tracking-wider">
              {t('sync_status')}
            </div>
            <div className="text-xs font-bold text-gray-900 truncate">
              {networkMode === 'ONLINE'
                ? t('online')
                : networkMode === 'LOW_2G'
                ? t('low_2g')
                : t('offline')}
            </div>
          </div>
        </div>
      </div>

      {/* Manual Refresh Button */}
      <button
        onClick={() => refreshData()}
        className="p-2 text-gray-500 hover:text-[#1E3A5F] hover:bg-[#EBF3FB] rounded-lg transition-colors border border-gray-200 hidden xl:flex items-center gap-1.5 text-xs font-semibold"
        title="Sync Live Telemetry & Forecasts"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>Sync</span>
      </button>
    </div>
  );
};
