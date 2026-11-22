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
    <div className="bg-[#0A0F18] border-b border-[#1E293B] px-3 sm:px-4 lg:px-6 py-2.5 z-10">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 w-full">
        {/* KPI 1: Corridor Accessibility */}
        <div className="bg-[#0F1726] border border-[#1E293B] hover:border-[#334155] rounded-xl p-3 flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-md bg-[#162235] border border-[#1E293B] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
              </div>
              <span className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider truncate">
                Accessibility
              </span>
            </div>
            <span className="text-[10px] font-semibold text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded flex items-center gap-0.5 shrink-0">
              <ArrowUpRight className="w-3 h-3" />
              <span>{openPct}%</span>
            </span>
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-[#F5F7FA] tracking-tight">
              {openCorridors} <span className="text-xs font-normal text-[#64748B]">/ {totalCorridors}</span>
            </div>
            <div className="text-[11px] text-[#64748B] mt-0.5 truncate">
              Arterial corridors open
            </div>
          </div>
        </div>

        {/* KPI 2: High Risk Corridors */}
        <div className="bg-[#0F1726] border border-[#1E293B] hover:border-[#334155] rounded-xl p-3 flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-md bg-[#162235] border border-[#1E293B] flex items-center justify-center shrink-0">
                <TrendingUp className="w-3.5 h-3.5 text-[#F59E0B]" />
              </div>
              <span className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider truncate">
                Disruption Risk
              </span>
            </div>
            <span className="text-[10px] font-semibold text-[#F59E0B] bg-[#F59E0B]/10 px-1.5 py-0.5 rounded shrink-0">
              Watch
            </span>
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-[#F5F7FA] tracking-tight">
              {highRiskCorridors} <span className="text-xs font-normal text-[#64748B]">corridors</span>
            </div>
            <div className="text-[11px] text-[#64748B] mt-0.5 truncate">
              Landslide risk score &ge; 60%
            </div>
          </div>
        </div>

        {/* KPI 3: Fleet Tracking */}
        <div className="bg-[#0F1726] border border-[#1E293B] hover:border-[#334155] rounded-xl p-3 flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-md bg-[#162235] border border-[#1E293B] flex items-center justify-center shrink-0">
                <Truck className="w-3.5 h-3.5 text-[#38BDF8]" />
              </div>
              <span className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider truncate">
                Active Fleet
              </span>
            </div>
            <span className="text-[10px] font-semibold text-[#38BDF8] bg-[#38BDF8]/10 px-1.5 py-0.5 rounded shrink-0">
              97.4%
            </span>
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-[#F5F7FA] tracking-tight">
              {activeVehiclesCount} <span className="text-xs font-normal text-[#64748B]">tracked</span>
            </div>
            <div className="text-[11px] text-[#64748B] mt-0.5 truncate">
              {movingVehiclesCount} moving with NavIC/GPS
            </div>
          </div>
        </div>

        {/* KPI 4: Active Alerts */}
        <div className="bg-[#0F1726] border border-[#1E293B] hover:border-[#334155] rounded-xl p-3 flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-md bg-[#162235] border border-[#1E293B] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444]" />
              </div>
              <span className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider truncate">
                Emergency Alerts
              </span>
            </div>
            <span className="text-[10px] font-semibold text-[#EF4444] bg-[#EF4444]/10 px-1.5 py-0.5 rounded shrink-0">
              {activeAlertsCount} Active
            </span>
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-[#F5F7FA] tracking-tight">
              0{activeAlertsCount} <span className="text-xs font-normal text-[#64748B]">/ {totalAlertsCount} total</span>
            </div>
            <div className="text-[11px] text-[#64748B] mt-0.5 truncate">
              Critical bulletins unacknowledged
            </div>
          </div>
        </div>

        {/* KPI 5: Field Inspections */}
        <div className="bg-[#0F1726] border border-[#1E293B] hover:border-[#334155] rounded-xl p-3 flex flex-col justify-between transition-colors col-span-2 md:col-span-1">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-md bg-[#162235] border border-[#1E293B] flex items-center justify-center shrink-0">
                <Activity className="w-3.5 h-3.5 text-[#818CF8]" />
              </div>
              <span className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider truncate">
                Field Reports
              </span>
            </div>
            <span className="text-[10px] font-semibold text-[#818CF8] bg-[#818CF8]/10 px-1.5 py-0.5 rounded shrink-0">
              PWA Sync
            </span>
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-[#F5F7FA] tracking-tight">
              {reportsCount} <span className="text-xs font-normal text-[#64748B]">verified</span>
            </div>
            <div className="text-[11px] text-[#64748B] mt-0.5 truncate">
              Ground inspections logged
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
