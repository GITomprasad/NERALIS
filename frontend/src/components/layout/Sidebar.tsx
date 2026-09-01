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
  Map,
  X
} from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onMobileClose }) => {
  const {
    activeModule,
    navigateToModule,
    setIsParliamentModalOpen,
    isSidebarCollapsed,
    toggleSidebar
  } = usePlatform();
  const { t } = useLanguage();

  const navSections: {
    sectionKey: string;
    sectionTitle: string;
    items: { id: ActiveModule; labelKey: string; code: string; icon: React.ReactNode }[];
  }[] = [
    {
      sectionKey: 'operations',
      sectionTitle: 'OPERATIONS',
      items: [
        { id: 'ACCESSIBILITY', labelKey: 'module_1', code: '01', icon: <Map className="w-4 h-4 text-emerald-600" /> },
        { id: 'ROUTE', labelKey: 'module_2', code: '02', icon: <Route className="w-4 h-4 text-blue-600" /> },
        { id: 'FLEET', labelKey: 'module_3', code: '03', icon: <Truck className="w-4 h-4 text-indigo-600" /> },
        { id: 'PREDICTION', labelKey: 'module_4', code: '04', icon: <CloudLightning className="w-4 h-4 text-amber-600" /> }
      ]
    },
    {
      sectionKey: 'response',
      sectionTitle: 'RESPONSE',
      items: [
        { id: 'ALERT', labelKey: 'module_5', code: '05', icon: <BellRing className="w-4 h-4 text-rose-600" /> },
        { id: 'FIELD_APP', labelKey: 'module_6', code: '06', icon: <Smartphone className="w-4 h-4 text-teal-600" /> }
      ]
    },
    {
      sectionKey: 'insights',
      sectionTitle: 'INSIGHTS',
      items: [
        { id: 'ANALYTICS', labelKey: 'module_7', code: '07', icon: <BarChart3 className="w-4 h-4 text-cyan-700" /> },
        { id: 'OFFLINE_RESILIENCE', labelKey: 'module_8', code: '08', icon: <HardDrive className="w-4 h-4 text-slate-700" /> }
      ]
    }
  ];

  const handleNav = (id: ActiveModule) => {
    navigateToModule(id);
    onMobileClose?.();
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex bg-white border-r border-[#D1D5DB] flex-col justify-between shrink-0 shadow-xs select-none z-20 transition-all duration-200 ${
          isSidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="p-2 space-y-3 overflow-y-auto">
          {/* Sidebar Header & Toggle */}
          <div className="flex items-center justify-between px-2 py-1 border-b border-gray-100 mb-1">
            {!isSidebarCollapsed && (
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                {t('navigation') || 'Navigation'}
              </span>
            )}
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors ml-auto cursor-pointer"
              title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {navSections.map((sec, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {!isSidebarCollapsed && (
                <div className="px-2.5 py-0.5 text-[9px] font-black tracking-wider text-gray-400 uppercase">
                  {t(sec.sectionKey) || sec.sectionTitle}
                </div>
              )}
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const isActive = activeModule === item.id;
                  const itemLabel = `${item.code} ${t(item.labelKey)}`;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.id)}
                      title={itemLabel}
                      className={`w-full flex items-center ${
                        isSidebarCollapsed ? 'justify-center p-2' : 'justify-between px-2.5 py-2'
                      } rounded-lg text-xs font-semibold transition-all cursor-pointer ${
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
                          <span className="truncate text-left">{itemLabel}</span>
                        )}
                      </div>
                      {!isSidebarCollapsed && (
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold shrink-0 ${
                          isActive ? 'bg-blue-200/80 text-blue-900' : 'bg-gray-100 text-gray-500'
                        }`}>
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
                {t('reports_compliance') || 'Reports & Compliance'}
              </div>
              <button
                onClick={() => { setIsParliamentModalOpen(true); onMobileClose?.(); }}
                className="w-full mt-1 flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <span>{t('parliament_report')}</span>
                </div>
                <ExternalLink className="w-3 h-3 text-emerald-600" />
              </button>
            </div>
          )}
        </div>

        {/* Footer info badge */}
        {!isSidebarCollapsed && (
          <div className="p-3 bg-[#EBF3FB]/60 border-t border-[#D1D5DB] text-[11px] text-gray-600">
            <div className="flex items-center gap-2 font-bold text-[#1E3A5F]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>NER Digital Grid v1.0</span>
            </div>
            <p className="text-[10px] text-gray-500 mt-1">8 States • 89 Districts Monitored</p>
            <p className="text-[9px] text-gray-400">MDoNER National Logistics Platform</p>
          </div>
        )}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-y-0 left-0 w-72 bg-white z-50 lg:hidden transform transition-transform duration-200 ease-in-out flex flex-col justify-between ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 space-y-4 overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <div className="flex items-center gap-2 font-black text-sm text-[#17365D]">
              <span>NERALIS Navigation</span>
            </div>
            <button
              onClick={onMobileClose}
              className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {navSections.map((sec, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <div className="px-3 text-[10px] font-black tracking-wider text-gray-400 uppercase">
                {t(sec.sectionKey) || sec.sectionTitle}
              </div>
              <div className="space-y-1">
                {sec.items.map((item) => {
                  const isActive = activeModule === item.id;
                  const itemLabel = `${item.code} ${t(item.labelKey)}`;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#EBF3FB] text-[#17365D] border border-[#2563A8]/30 font-bold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`p-1.5 rounded-lg ${isActive ? 'bg-white shadow-sm' : 'bg-gray-100'}`}>
                          {item.icon}
                        </span>
                        <span>{itemLabel}</span>
                      </div>
                      {isActive && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="pt-3 border-t border-gray-100">
            <button
              onClick={() => { setIsParliamentModalOpen(true); onMobileClose?.(); }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-emerald-700" />
                <span>{t('parliament_report')}</span>
              </div>
              <ExternalLink className="w-4 h-4 text-emerald-600" />
            </button>
          </div>
        </div>

        <div className="p-3 bg-[#EBF3FB]/60 border-t border-[#D1D5DB] text-[11px] text-gray-600">
          <div className="flex items-center gap-2 font-bold text-[#1E3A5F]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>NER Digital Grid v1.0</span>
          </div>
          <p className="text-[10px] text-gray-500 mt-1">8 States • 89 Districts Monitored</p>
        </div>
      </div>
    </>
  );
};
