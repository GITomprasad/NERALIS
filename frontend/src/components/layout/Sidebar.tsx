import React from 'react';
import { usePlatform, ActiveModule } from '../../context/PlatformContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  LayoutDashboard,
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
  Compass
} from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

interface NavItem {
  id?: ActiveModule;
  label: string;
  icon: React.ReactNode;
  action?: () => void;
  isSpecialAction?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onMobileClose }) => {
  const {
    activeModule,
    navigateToModule,
    goToLanding,
    setIsParliamentModalOpen,
    isSidebarCollapsed,
    toggleSidebar,
    toggleChatbot,
    isChatbotOpen
  } = usePlatform();
  const { t } = useLanguage();

  const navSections: NavSection[] = [
    {
      title: 'OVERVIEW',
      items: [
        {
          label: 'Dashboard',
          icon: <LayoutDashboard className="w-4 h-4 text-[#0EA5E9]" />,
          action: () => goToLanding()
        },
        {
          id: 'ACCESSIBILITY',
          label: 'GIS Command Center',
          icon: <Map className="w-4 h-4 text-[#0EA5E9]" />
        }
      ]
    },
    {
      title: 'OPERATIONS',
      items: [
        {
          id: 'ACCESSIBILITY',
          label: 'Accessibility Monitoring',
          icon: <Compass className="w-4 h-4 text-[#0EA5E9]" />
        },
        {
          id: 'ROUTE',
          label: 'AI Route Optimizer',
          icon: <Route className="w-4 h-4 text-[#38BDF8]" />
        },
        {
          id: 'FLEET',
          label: 'Fleet Tracking',
          icon: <Truck className="w-4 h-4 text-[#818CF8]" />
        },
        {
          id: 'PREDICTION',
          label: 'Predictive Disruption',
          icon: <CloudLightning className="w-4 h-4 text-[#F59E0B]" />
        }
      ]
    },
    {
      title: 'RESPONSE',
      items: [
        {
          id: 'ALERT',
          label: 'Alert Center',
          icon: <BellRing className="w-4 h-4 text-[#EF4444]" />
        },
        {
          id: 'FIELD_APP',
          label: 'Field Reporting',
          icon: <Smartphone className="w-4 h-4 text-[#10B981]" />
        }
      ]
    },
    {
      title: 'INTELLIGENCE',
      items: [
        {
          id: 'ANALYTICS',
          label: 'Analytics',
          icon: <BarChart3 className="w-4 h-4 text-[#38BDF8]" />
        },
        {
          id: 'OFFLINE_RESILIENCE',
          label: 'Offline & Resilience',
          icon: <HardDrive className="w-4 h-4 text-[#94A3B8]" />
        },
        {
          label: 'Reports',
          icon: <FileText className="w-4 h-4 text-[#10B981]" />,
          action: () => setIsParliamentModalOpen(true),
          isSpecialAction: true
        }
      ]
    }
  ];

  const handleItemClick = (item: NavItem) => {
    if (item.action) {
      item.action();
    } else if (item.id) {
      navigateToModule(item.id);
    }
    onMobileClose?.();
  };

  return (
    <>
      {/* Desktop Sidebar (Collapsible: w-64 expanded, w-16 collapsed) */}
      <aside
        className={`hidden lg:flex bg-[#0A0F18] border-r border-[#1E293B] flex-col justify-between shrink-0 shadow-lg select-none z-20 transition-all duration-200 ${
          isSidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="p-3 space-y-4 overflow-y-auto">
          {/* Collapse/Expand Toggle Header */}
          <div className="flex items-center justify-between px-1 pb-2 border-b border-[#1E293B]">
            {!isSidebarCollapsed && (
              <span className="text-[10px] font-semibold text-[#64748B] tracking-wider uppercase">
                Navigation
              </span>
            )}
            <button
              onClick={toggleSidebar}
              className={`p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F5F7FA] hover:bg-[#162235] transition-colors cursor-pointer ${
                isSidebarCollapsed ? 'mx-auto' : 'ml-auto'
              }`}
              title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              aria-label={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="w-4 h-4 text-[#0EA5E9]" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-[#94A3B8]" />
              )}
            </button>
          </div>

          {/* 4 Clean Navigation Sections */}
          {navSections.map((sec, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {!isSidebarCollapsed && (
                <div className="px-2 py-0.5 text-[10px] font-semibold tracking-wider text-[#64748B] uppercase">
                  {sec.title}
                </div>
              )}
              <div className="space-y-0.5">
                {sec.items.map((item, iIdx) => {
                  const isActive = !item.isSpecialAction && !item.action && activeModule === item.id;
                  return (
                    <button
                      key={iIdx}
                      onClick={() => handleItemClick(item)}
                      title={item.label}
                      className={`w-full flex items-center ${
                        isSidebarCollapsed ? 'justify-center p-2.5' : 'justify-between px-2.5 py-2'
                      } rounded-lg text-xs font-medium transition-colors cursor-pointer relative group ${
                        isActive
                          ? 'bg-[#162235] text-[#F5F7FA] border border-[#1E293B]'
                          : 'text-[#94A3B8] hover:text-[#F5F7FA] hover:bg-[#0F1726] border border-transparent'
                      }`}
                    >
                      {/* Active indicator bar */}
                      {isActive && (
                        <div className="absolute left-0 top-1 bottom-1 w-1 bg-[#0EA5E9] rounded-r-md" />
                      )}

                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`p-1 rounded-md shrink-0 transition-colors ${
                            isActive
                              ? 'bg-[#0F1726]'
                              : 'bg-transparent group-hover:bg-[#0F1726]'
                          }`}
                        >
                          {item.icon}
                        </span>
                        {!isSidebarCollapsed && (
                          <span className={`truncate text-left ${isActive ? 'font-semibold text-[#F5F7FA]' : ''}`}>
                            {item.label}
                          </span>
                        )}
                      </div>

                      {!isSidebarCollapsed && item.isSpecialAction && (
                        <ExternalLink className="w-3 h-3 text-[#64748B] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info badge */}
        {!isSidebarCollapsed && (
          <div className="p-3 bg-[#0A0F18] border-t border-[#1E293B] text-[11px] text-[#94A3B8]">
            <div className="flex items-center justify-between font-semibold text-[#F5F7FA]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                <span className="text-xs">NER Digital Grid</span>
              </div>
              <span className="bg-[#0EA5E9]/10 text-[#0EA5E9] border border-[#0EA5E9]/20 text-[9px] font-mono px-1.5 py-0.5 rounded">
                v2.0
              </span>
            </div>
            <p className="text-[10px] text-[#64748B] mt-1">8 States • 89 Districts Monitored</p>
          </div>
        )}
      </aside>

      {/* Mobile Drawer Overlay Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[5500] lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile Sidebar Slide-over Drawer */}
      <div
        className={`fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-[#0A0F18] border-r border-[#1E293B] z-[5600] lg:hidden transform transition-transform duration-200 ease-in-out flex flex-col justify-between shadow-2xl ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0F1726] border border-[#1E293B] flex items-center justify-center">
                <Compass className="w-4 h-4 text-[#0EA5E9]" />
              </div>
              <div>
                <span className="font-bold text-sm text-[#F5F7FA] tracking-tight block">NERALIS</span>
                <span className="text-[10px] text-[#64748B]">Command Center Navigation</span>
              </div>
            </div>
            <button
              onClick={onMobileClose}
              className="p-1.5 rounded-lg bg-[#0F1726] hover:bg-[#162235] text-[#94A3B8] hover:text-[#F5F7FA] border border-[#1E293B] cursor-pointer"
              aria-label="Close Navigation"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Navigation Sections */}
          {navSections.map((sec, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <div className="px-2 text-[10px] font-semibold tracking-wider text-[#64748B] uppercase">
                {sec.title}
              </div>
              <div className="space-y-0.5">
                {sec.items.map((item, iIdx) => {
                  const isActive = !item.isSpecialAction && !item.action && activeModule === item.id;
                  return (
                    <button
                      key={iIdx}
                      onClick={() => handleItemClick(item)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#162235] text-[#F5F7FA] border border-[#1E293B]'
                          : 'text-[#94A3B8] hover:text-[#F5F7FA] hover:bg-[#0F1726]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="p-1 rounded-md bg-[#0F1726]">
                          {item.icon}
                        </span>
                        <span className={isActive ? 'font-semibold text-[#F5F7FA]' : ''}>
                          {item.label}
                        </span>
                      </div>
                      {item.isSpecialAction && (
                        <ExternalLink className="w-3 h-3 text-[#64748B]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quick AI Trigger */}
          <div className="pt-3 border-t border-[#1E293B]">
            <button
              onClick={() => {
                toggleChatbot();
                onMobileClose?.();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-[#F5F7FA] bg-[#0F1726] hover:bg-[#162235] border border-[#1E293B] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Bot className="w-4 h-4 text-[#0EA5E9]" />
                <span>Sahayak Copilot</span>
              </div>
              <span className="text-[10px] bg-[#0EA5E9]/10 text-[#0EA5E9] px-1.5 py-0.5 rounded font-medium">
                AI
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Footer */}
        <div className="p-3 bg-[#0A0F18] border-t border-[#1E293B] text-xs text-[#94A3B8]">
          <div className="flex items-center gap-2 font-semibold text-[#F5F7FA]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
            <span>NER Digital Grid v2.0</span>
          </div>
          <p className="text-[10px] text-[#64748B] mt-0.5">8 States • 89 Districts Monitored</p>
        </div>
      </div>
    </>
  );
};
