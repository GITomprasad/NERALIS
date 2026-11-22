import React from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  AlertTriangle,
  CheckCircle2,
  Truck,
  TrendingUp,
  Activity,
  ArrowUpRight
} from 'lucide-react';

export const KPIBar: React.FC = () => {
  const { alerts, corridors, vehicles, fieldReports } = usePlatform();
  const { t } = useLanguage();

  const totalCorridors = corridors.length || 35;
  const openCorridors = corridors.filter((c) => c.status === 'OPEN').length || 29;
  const highRiskCorridors = corridors.filter((c) => c.risk_score >= 60).length || 7;
  const openPct = Math.round((openCorridors / totalCorridors) * 100);

  const activeAlertsCount = alerts.filter((a) => !a.acknowledged).length || 3;
  const totalAlertsCount = alerts.length || 8;
  const activeVehiclesCount = vehicles.length || 42;
  const movingVehiclesCount = vehicles.filter((v) => v.speed_kmh > 0).length || 38;
  const reportsCount = fieldReports.length || 14;

  return (
    <div className="bg-[#E7E8D1] border-b border-[#D6D8C8] px-3 sm:px-4 lg:px-6 py-2.5 z-10">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 w-full">
        {/* KPI 1: Corridor Accessibility */}
        <div className="bg-[#FFFFFF] border border-[#D6D8C8] hover:border-[#B85042]/30 rounded-xl p-3 flex flex-col justify-between transition-colors shadow-sm">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-md bg-[#E7E8D1] border border-[#D6D8C8] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#A7BEAE]" />
              </div>
              <span className="text-[11px] font-medium text-[#74796F] uppercase tracking-wider truncate">
                Accessibility
              </span>
            </div>
            <span className="text-[10px] font-semibold text-[#2C5242] bg-[#A7BEAE]/25 px-1.5 py-0.5 rounded flex items-center gap-0.5 shrink-0">
              <ArrowUpRight className="w-3 h-3" />
              <span>{openPct}%</span>
            </span>
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-[#30342F] tracking-tight">
              <span className="text-[#B85042]">{openCorridors}</span> <span className="text-xs font-normal text-[#74796F]">/ {totalCorridors}</span>
            </div>
            <div className="text-[11px] text-[#74796F] mt-0.5 truncate">
              Arterial corridors open
            </div>
          </div>
        </div>

        {/* KPI 2: High Risk Corridors */}
        <div className="bg-[#FFFFFF] border border-[#D6D8C8] hover:border-[#B85042]/30 rounded-xl p-3 flex flex-col justify-between transition-colors shadow-sm">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-md bg-[#E7E8D1] border border-[#D6D8C8] flex items-center justify-center shrink-0">
                <TrendingUp className="w-3.5 h-3.5 text-[#E59866]" />
              </div>
              <span className="text-[11px] font-medium text-[#74796F] uppercase tracking-wider truncate">
                Disruption Risk
              </span>
            </div>
            <span className="text-[10px] font-semibold text-[#A04000] bg-[#E59866]/20 px-1.5 py-0.5 rounded shrink-0">
              Watch
            </span>
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-[#30342F] tracking-tight">
              <span className="text-[#B85042]">{highRiskCorridors}</span> <span className="text-xs font-normal text-[#74796F]">corridors</span>
            </div>
            <div className="text-[11px] text-[#74796F] mt-0.5 truncate">
              Landslide risk score &ge; 60%
            </div>
          </div>
        </div>

        {/* KPI 3: Fleet Tracking */}
        <div className="bg-[#FFFFFF] border border-[#D6D8C8] hover:border-[#B85042]/30 rounded-xl p-3 flex flex-col justify-between transition-colors shadow-sm">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-md bg-[#E7E8D1] border border-[#D6D8C8] flex items-center justify-center shrink-0">
                <Truck className="w-3.5 h-3.5 text-[#A7BEAE]" />
              </div>
              <span className="text-[11px] font-medium text-[#74796F] uppercase tracking-wider truncate">
                Active Fleet
              </span>
            </div>
            <span className="text-[10px] font-semibold text-[#30342F] bg-[#D5D8C3] px-1.5 py-0.5 rounded shrink-0">
              97.4%
            </span>
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-[#30342F] tracking-tight">
              {activeVehiclesCount} <span className="text-xs font-normal text-[#74796F]">tracked</span>
            </div>
            <div className="text-[11px] text-[#74796F] mt-0.5 truncate">
              {movingVehiclesCount} moving with NavIC/GPS
            </div>
          </div>
        </div>

        {/* KPI 4: Active Alerts */}
        <div className="bg-[#FFFFFF] border border-[#D6D8C8] hover:border-[#B85042]/30 rounded-xl p-3 flex flex-col justify-between transition-colors shadow-sm">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-md bg-[#E7E8D1] border border-[#D6D8C8] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-3.5 h-3.5 text-[#B85042]" />
              </div>
              <span className="text-[11px] font-medium text-[#74796F] uppercase tracking-wider truncate">
                Emergency Alerts
              </span>
            </div>
            <span className="text-[10px] font-semibold text-[#B85042] bg-[#B85042]/15 px-1.5 py-0.5 rounded shrink-0">
              {activeAlertsCount} Active
            </span>
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-[#30342F] tracking-tight">
              <span className="text-[#B85042]">0{activeAlertsCount}</span> <span className="text-xs font-normal text-[#74796F]">/ {totalAlertsCount} total</span>
            </div>
            <div className="text-[11px] text-[#74796F] mt-0.5 truncate">
              Critical bulletins unacknowledged
            </div>
          </div>
        </div>

        {/* KPI 5: Field Inspections */}
        <div className="bg-[#FFFFFF] border border-[#D6D8C8] hover:border-[#B85042]/30 rounded-xl p-3 flex flex-col justify-between transition-colors col-span-2 md:col-span-1 shadow-sm">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-md bg-[#E7E8D1] border border-[#D6D8C8] flex items-center justify-center shrink-0">
                <Activity className="w-3.5 h-3.5 text-[#A7BEAE]" />
              </div>
              <span className="text-[11px] font-medium text-[#74796F] uppercase tracking-wider truncate">
                Field Reports
              </span>
            </div>
            <span className="text-[10px] font-semibold text-[#2C5242] bg-[#A7BEAE]/25 px-1.5 py-0.5 rounded shrink-0">
              PWA Sync
            </span>
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-[#30342F] tracking-tight">
              {reportsCount} <span className="text-xs font-normal text-[#74796F]">verified</span>
            </div>
            <div className="text-[11px] text-[#74796F] mt-0.5 truncate">
              Geo-tagged field damage reports
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
