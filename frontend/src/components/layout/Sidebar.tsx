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

  const navSections: {
    sectionTitle: string;
    items: { id: ActiveModule; labelKey: string; label: string; icon: React.ReactNode; code: string }[];
  }[] = [
    {
      sectionTitle: 'OPERATIONS',
      items: [
        {
          id: 'ACCESSIBILITY',
          labelKey: 'module_1',
          label: '01 Accessibility',
          code: '01',
          icon: <Map className="w-4 h-4 text-emerald-600" />
        },
        {
          id: 'ROUTE',
          labelKey: 'module_2',
          label: '02 Route Planning',
          code: '02',
          icon: <Route className="w-4 h-4 text-blue-600" />
        },
        {
          id: 'FLEET',
          labelKey: 'module_3',
          label: '03 Fleet Tracking',
          code: '03',
          icon: <Truck className="w-4 h-4 text-indigo-600" />
        },
        {
          id: 'PREDICTION',
          labelKey: 'module_4',
          label: '04 Risk Forecast',
          code: '04',
          icon: <CloudLightning className="w-4 h-4 text-amber-600" />
        }
      ]
    },
    {
      sectionTitle: 'RESPONSE',
      items: [
        {
          id: 'ALERT',
          labelKey: 'module_5',
          label: '05 Alerts',
          code: '05',
          icon: <BellRing className="w-4 h-4 text-rose-600" />
        },
        {
          id: 'FIELD_APP',
          labelKey: 'module_6',
          label: '06 Field Reports',
          code: '06',
          icon: <Smartphone className="w-4 h-4 text-teal-600" />
        }
      ]
    },
    {
      sectionTitle: 'INSIGHTS',
      items: [
        {
          id: 'ANALYTICS',
          labelKey: 'module_7',
          label: '07 Analytics',
          code: '07',
          icon: <BarChart3 className="w-4 h-4 text-cyan-700" />
        },
        {
          id: 'OFFLINE_RESILIENCE',
          labelKey: 'module_8',
          label: '08 Offline & Sync',
          code: '08',
          icon: <HardDrive className="w-4 h-4 text-slate-700" />
        }
      ]
    }
  ];

  return (
    <aside
      className={`bg-white border-r border-[#D1D5DB] flex flex-col justify-between shrink-0 shadow-xs select-none z-20 transition-all duration-200 ${
        isSidebarCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      <div className="p-2 space-y-3 overflow-y-auto">
        {/* Sidebar Header & Toggle */}
        <div className="flex items-center justify-between px-2 py-1 border-b border-gray-100 mb-1">
          {!isSidebarCollapsed && (
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Navigation
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

        {/* Grouped Operational Sections */}
        {navSections.map((sec, sIdx) => (
          <div key={sIdx} className="space-y-1">
            {!isSidebarCollapsed && (
              <div className="px-2.5 py-0.5 text-[9px] font-black tracking-wider text-gray-400 uppercase">
                {sec.sectionTitle}
              </div>
            )}
            <div className="space-y-0.5">
              {sec.items.map((item) => {
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigateToModule(item.id)}
                    title={item.label}
                    className={`w-full flex items-center ${
                      isSidebarCollapsed ? 'justify-center p-2' : 'justify-between px-2.5 py-2'
                    } rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#EBF3FB] text-[#17365D] border-r-3 border-[#2563A8] font-bold shadow-xs'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-[#17365D]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`p-1 rounded shrink-0 ${isActive ? 'bg-white text-blue-700 shadow-xs' : 'bg-gray-100 text-gray-600'}`}>
                        {item.icon}
                      </span>
                      {!isSidebarCollapsed && (
                        <span className="truncate text-left">{item.label}</span>
                      )}
                    </div>
                    {!isSidebarCollapsed && (
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold shrink-0 ${
                          isActive
                            ? 'bg-blue-200/80 text-blue-900'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {item.code}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

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
            MDoNER National Logistics Platform
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

