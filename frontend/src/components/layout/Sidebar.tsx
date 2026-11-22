import React from 'react';
import { usePlatform, ActiveModule } from '../../context/PlatformContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Map,
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
  Bot,
  X,
  Compass,
  Radio,
  Sparkles
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
    toggleSidebar,
    toggleChatbot,
    isChatbotOpen
  } = usePlatform();
  const { t } = useLanguage();

  const navSections: {
    sectionKey: string;
    sectionTitle: string;
    items: {
      id: ActiveModule;
      labelKey: string;
      code: string;
      icon: React.ReactNode;
      accentColor: string;
    }[];
  }[] = [
    {
      sectionKey: 'operations',
      sectionTitle: 'OPERATIONS',
      items: [
        {
          id: 'ACCESSIBILITY',
          labelKey: 'module_1',
          code: '01',
          icon: <Map className="w-4 h-4" />,
          accentColor: '#19C6D2'
        },
        {
          id: 'ROUTE',
          labelKey: 'module_2',
          code: '02',
          icon: <Route className="w-4 h-4" />,
          accentColor: '#438BFF'
        },
        {
          id: 'FLEET',
          labelKey: 'module_3',
          code: '03',
          icon: <Truck className="w-4 h-4" />,
          accentColor: '#818CF8'
        },
        {
          id: 'PREDICTION',
          labelKey: 'module_4',
          code: '04',
          icon: <CloudLightning className="w-4 h-4" />,
          accentColor: '#FFB547'
        }
      ]
    },
    {
      sectionKey: 'response',
      sectionTitle: 'RESPONSE & FIELD',
      items: [
        {
          id: 'ALERT',
          labelKey: 'module_5',
          code: '05',
          icon: <BellRing className="w-4 h-4" />,
          accentColor: '#FF5252'
        },
        {
          id: 'FIELD_APP',
          labelKey: 'module_6',
          code: '06',
          icon: <Smartphone className="w-4 h-4" />,
          accentColor: '#20C997'
        }
      ]
    },
    {
      sectionKey: 'insights',
      sectionTitle: 'GOVERNANCE & SYNC',
      items: [
        {
          id: 'ANALYTICS',
          labelKey: 'module_7',
          code: '07',
          icon: <BarChart3 className="w-4 h-4" />,
          accentColor: '#38BDF8'
        },
        {
          id: 'OFFLINE_RESILIENCE',
          labelKey: 'module_8',
          code: '08',
          icon: <HardDrive className="w-4 h-4" />,
          accentColor: '#94A3B8'
        }
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
        className={`hidden lg:flex bg-[#0D1522] border-r border-[#1E2E45] flex-col justify-between shrink-0 shadow-xl select-none z-20 transition-all duration-200 ${
          isSidebarCollapsed ? 'w-18' : 'w-64'
        }`}
      >
        <div className="p-3 space-y-4 overflow-y-auto">
          {/* Header section with collapse toggle */}
          <div className="flex items-center justify-between px-2 py-1 border-b border-[#1E2E45]/70 pb-2">
            {!isSidebarCollapsed && (
              <span className="text-[10px] font-extrabold text-[#94A3B8] tracking-widest uppercase flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#19C6D2]" />
                Command Modules
              </span>
            )}
            <button
              onClick={toggleSidebar}
              className={`p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F5F7FA] hover:bg-[#16253B] transition-colors cursor-pointer ${
                isSidebarCollapsed ? 'mx-auto' : 'ml-auto'
              }`}
              title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              aria-label={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="w-4 h-4 text-[#19C6D2]" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-[#94A3B8]" />
              )}
            </button>
          </div>

          {/* Module Nav Links */}
          {navSections.map((sec, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {!isSidebarCollapsed && (
                <div className="px-2.5 py-1 text-[9px] font-black tracking-widest text-[#64748B] uppercase">
                  {t(sec.sectionKey) || sec.sectionTitle}
                </div>
              )}
              <div className="space-y-1">
                {sec.items.map((item) => {
                  const isActive = activeModule === item.id;
                  const itemLabel = `${item.code} ${t(item.labelKey)}`;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.id)}
                      title={itemLabel}
                      className={`w-full flex items-center ${
                        isSidebarCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2.5'
                      } rounded-xl text-xs font-semibold transition-all cursor-pointer relative group ${
                        isActive
                          ? 'bg-[#16253B] text-[#F5F7FA] border border-[#19C6D2]/50 shadow-command-glow'
                          : 'text-[#94A3B8] hover:text-[#F5F7FA] hover:bg-[#111D2D] border border-transparent'
                      }`}
                    >
                      {/* Active indicator bar */}
                      {isActive && (
                        <div
                          className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full"
                          style={{ backgroundColor: item.accentColor }}
                        />
                      )}

                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                            isActive
                              ? 'bg-[#111D2D] text-[#19C6D2]'
                              : 'bg-[#111D2D]/60 text-[#94A3B8] group-hover:text-[#F5F7FA]'
                          }`}
                          style={isActive ? { color: item.accentColor } : {}}
                        >
                          {item.icon}
                        </span>
                        {!isSidebarCollapsed && (
                          <span className={`truncate text-left font-medium ${isActive ? 'font-bold text-[#F5F7FA]' : ''}`}>
                            {t(item.labelKey)}
                          </span>
                        )}
                      </div>

                      {!isSidebarCollapsed && (
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold shrink-0 ${
                            isActive
                              ? 'bg-[#111D2D] text-[#19C6D2] border border-[#19C6D2]/30'
                              : 'bg-[#111D2D]/60 text-[#64748B]'
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

          {/* Quick Tools & Reports */}
          {!isSidebarCollapsed && (
            <div className="pt-3 border-t border-[#1E2E45]/70 space-y-2">
              <div className="px-2.5 text-[9px] font-black tracking-widest text-[#64748B] uppercase">
                {t('reports_compliance') || 'Reports & Tools'}
              </div>

              {/* NERALIS AI Assistant Trigger Button */}
              <button
                onClick={() => {
                  toggleChatbot();
                  onMobileClose?.();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isChatbotOpen
                    ? 'bg-[#19C6D2] text-[#080D16] shadow-command-glow'
                    : 'text-[#F5F7FA] bg-[#111D2D] hover:bg-[#16253B] border border-[#1E2E45]'
                }`}
                title="Open NERALIS AI Sahayak Assistant"
              >
                <div className="flex items-center gap-2.5">
                  <Bot className={`w-4 h-4 ${isChatbotOpen ? 'text-[#080D16]' : 'text-[#19C6D2]'}`} />
                  <span>NERALIS Sahayak</span>
                </div>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                    isChatbotOpen
                      ? 'bg-[#080D16]/30 text-[#080D16]'
                      : 'bg-[#19C6D2]/20 text-[#19C6D2] border border-[#19C6D2]/30'
                  }`}
                >
                  AI
                </span>
              </button>

              <button
                onClick={() => {
                  setIsParliamentModalOpen(true);
                  onMobileClose?.();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[#20C997] bg-[#20C997]/10 hover:bg-[#20C997]/20 border border-[#20C997]/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-[#20C997]" />
                  <span className="truncate">{t('parliament_report') || 'Parliament Report'}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-[#20C997] shrink-0" />
              </button>
            </div>
          )}
        </div>

        {/* Footer info badge */}
        {!isSidebarCollapsed && (
          <div className="p-3 bg-[#080D16]/60 border-t border-[#1E2E45] text-[11px] text-[#94A3B8]">
            <div className="flex items-center justify-between font-bold text-[#F5F7FA]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#20C997]" />
                <span className="text-xs">NER Digital Grid</span>
              </div>
              <span className="bg-[#19C6D2]/15 text-[#19C6D2] border border-[#19C6D2]/30 text-[9px] font-mono px-1.5 py-0.2 rounded">
                v2.0
              </span>
            </div>
            <p className="text-[10px] text-[#64748B] mt-1">8 States • 89 Districts Monitored</p>
            <p className="text-[9px] text-[#64748B]">MDoNER National Logistics Platform</p>
          </div>
        )}
      </aside>

      {/* Mobile Drawer Overlay Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/75 z-[3500] lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile Sidebar Slide-over Drawer */}
      <div
        className={`fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-[#0D1522] border-r border-[#1E2E45] z-[3600] lg:hidden transform transition-transform duration-200 ease-in-out flex flex-col justify-between shadow-2xl ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#1E2E45]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#19C6D2]/20 border border-[#19C6D2]/40 flex items-center justify-center">
                <Compass className="w-4 h-4 text-[#19C6D2]" />
              </div>
              <div>
                <span className="font-black text-sm text-[#F5F7FA] tracking-wider block">NERALIS</span>
                <span className="text-[10px] text-[#94A3B8]">Command Center Navigation</span>
              </div>
            </div>
            <button
              onClick={onMobileClose}
              className="p-2 rounded-lg bg-[#111D2D] hover:bg-[#16253B] text-[#94A3B8] hover:text-[#F5F7FA] border border-[#1E2E45] cursor-pointer"
              aria-label="Close Navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Module Sections */}
          {navSections.map((sec, sIdx) => (
            <div key={sIdx} className="space-y-1.5">
              <div className="px-2 text-[10px] font-black tracking-widest text-[#64748B] uppercase">
                {t(sec.sectionKey) || sec.sectionTitle}
              </div>
              <div className="space-y-1">
                {sec.items.map((item) => {
                  const isActive = activeModule === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#16253B] text-[#F5F7FA] border border-[#19C6D2]/50 shadow-command-glow'
                          : 'text-[#94A3B8] hover:text-[#F5F7FA] hover:bg-[#111D2D]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`p-2 rounded-lg ${
                            isActive ? 'bg-[#111D2D]' : 'bg-[#111D2D]/60'
                          }`}
                          style={{ color: item.accentColor }}
                        >
                          {item.icon}
                        </span>
                        <span className={isActive ? 'font-bold text-[#F5F7FA]' : ''}>
                          {t(item.labelKey)}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          isActive
                            ? 'bg-[#19C6D2]/20 text-[#19C6D2] border border-[#19C6D2]/30'
                            : 'bg-[#111D2D] text-[#64748B]'
                        }`}
                      >
                        {item.code}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Mobile Tools */}
          <div className="pt-3 border-t border-[#1E2E45] space-y-2">
            <button
              onClick={() => {
                toggleChatbot();
                onMobileClose?.();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                isChatbotOpen
                  ? 'bg-[#19C6D2] text-[#080D16]'
                  : 'text-[#F5F7FA] bg-[#111D2D] hover:bg-[#16253B] border border-[#1E2E45]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bot className={`w-5 h-5 ${isChatbotOpen ? 'text-[#080D16]' : 'text-[#19C6D2]'}`} />
                <span>NERALIS AI Sahayak</span>
              </div>
              <span className="text-[10px] bg-[#19C6D2]/20 text-[#19C6D2] px-2 py-0.5 rounded font-bold">
                AI Assistant
              </span>
            </button>

            <button
              onClick={() => {
                setIsParliamentModalOpen(true);
                onMobileClose?.();
              }}
              className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold text-[#20C997] bg-[#20C997]/10 hover:bg-[#20C997]/20 border border-[#20C997]/30 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#20C997]" />
                <span>{t('parliament_report') || 'Parliament Report'}</span>
              </div>
              <ExternalLink className="w-4 h-4 text-[#20C997]" />
            </button>
          </div>
        </div>

        {/* Mobile Footer */}
        <div className="p-3.5 bg-[#080D16] border-t border-[#1E2E45] text-xs text-[#94A3B8]">
          <div className="flex items-center gap-2 font-bold text-[#F5F7FA]">
            <ShieldCheck className="w-4 h-4 text-[#20C997]" />
            <span>NER Digital Grid v2.0</span>
          </div>
          <p className="text-[10px] text-[#64748B] mt-1">8 States • 89 Districts Monitored</p>
        </div>
      </div>
    </>
  );
};
