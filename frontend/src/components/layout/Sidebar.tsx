import React from 'react';
import { usePlatform, ActiveModule } from '../../context/PlatformContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  MapPin,
  Route,
  Truck,
  CloudLightning,
  BellRing,
  Smartphone,
  BarChart3,
  HardDrive,
  FileText,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Map
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeModule,
    navigateToModule,
    setIsParliamentModalOpen,
    isSidebarCollapsed,
    toggleSidebar
  } = usePlatform();
  const { t } = useLanguage();

  const navItems: { id: ActiveModule; labelKey: string; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'ACCESSIBILITY',
      labelKey: 'module_1',
      label: 'Main GIS Map',
      icon: <Map className="w-4 h-4 text-emerald-600" />,
      badge: 'Home'
    },
    {
      id: 'ROUTE',
      labelKey: 'module_2',
      label: 'Route Optimizer',
      icon: <Route className="w-4 h-4 text-blue-600" />,
      badge: 'AI'
    },
    {
      id: 'FLEET',
      labelKey: 'module_3',
      label: 'Fleet Telemetry',
      icon: <Truck className="w-4 h-4 text-indigo-600" />,
      badge: 'NavIC'
    },
    {
      id: 'PREDICTION',
      labelKey: 'module_4',
      label: '72h Forecasting',
      icon: <CloudLightning className="w-4 h-4 text-amber-600" />,
      badge: '72h'
    },
    {
      id: 'ALERT',
      labelKey: 'module_5',
      label: 'Alert Broadcast',
      icon: <BellRing className="w-4 h-4 text-rose-600" />,
      badge: '8-Lang'
    },
    {
      id: 'FIELD_APP',
      labelKey: 'module_6',
      label: 'Field Reporting',
      icon: <Smartphone className="w-4 h-4 text-teal-600" />,
      badge: 'PWA'
    },
    {
      id: 'ANALYTICS',
      labelKey: 'module_7',
      label: 'Command Analytics',
      icon: <BarChart3 className="w-4 h-4 text-cyan-700" />,
      badge: 'HQ'
    },
    {
      id: 'OFFLINE_RESILIENCE',
      labelKey: 'module_8',
      label: 'Offline Resilience',
      icon: <HardDrive className="w-4 h-4 text-slate-700" />,
      badge: 'Sync'
    }
  ];

  return (
    <aside
      className={`bg-white border-r border-[#D1D5DB] flex flex-col justify-between shrink-0 shadow-sm select-none z-20 transition-all duration-200 ${
        isSidebarCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      <div className="p-2.5 space-y-1">
        {/* Sidebar Header & Toggle */}
        <div className="flex items-center justify-between px-2 py-1.5 border-b border-gray-100 mb-1">
          {!isSidebarCollapsed && (
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Platform Modules
            </span>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors ml-auto"
            title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {navItems.map((item) => {
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigateToModule(item.id)}
              title={`${item.label} (${item.badge || ''})`}
              className={`w-full flex items-center ${
                isSidebarCollapsed ? 'justify-center p-2' : 'justify-between px-3 py-2.5'
              } rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#2563A8] text-white shadow-sm'
                  : 'text-[#374151] hover:bg-[#EBF3FB] hover:text-[#1E3A5F]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`p-1 rounded shrink-0 ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100'}`}>
                  {item.icon}
                </span>
                {!isSidebarCollapsed && (
                  <span className="truncate text-left">{t(item.labelKey)}</span>
                )}
              </div>
              {!isSidebarCollapsed && item.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ${
                    isActive
                      ? 'bg-white/25 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {!isSidebarCollapsed && (
          <div className="pt-3 border-t border-gray-100">
            <div className="px-3 py-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Reports & Compliance
            </div>
            <button
              onClick={() => setIsParliamentModalOpen(true)}
              className="w-full mt-1 flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-700" />
                <span>Parliament Brief (ROI)</span>
              </div>
              <ExternalLink className="w-3 h-3 text-emerald-600" />
            </button>
          </div>
        )}
      </div>

      {/* Footer / Region Status Badge */}
      {!isSidebarCollapsed ? (
        <div className="p-3 bg-[#EBF3FB]/60 border-t border-[#D1D5DB] text-[11px] text-gray-600">
          <div className="flex items-center gap-2 font-bold text-[#1E3A5F]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>NER Digital Grid v1.0</span>
          </div>
          <p className="text-[10px] text-gray-500 mt-1">
            8 States • 89 Districts Monitored
            <br />
            MDoNER SIH-2026 Reference Solution
          </p>
        </div>
      ) : (
        <div className="p-2 bg-[#EBF3FB]/60 border-t border-[#D1D5DB] flex justify-center" title="NER Digital Grid v1.0">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
        </div>
      )}
    </aside>
  );
};

