import React from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { PlatformProvider, usePlatform } from './context/PlatformContext';
import { Navbar } from './components/layout/Navbar';
import { ConnectivityBanner } from './components/common/ConnectivityBanner';
import { Sidebar } from './components/layout/Sidebar';
import { KPIBar } from './components/layout/KPIBar';
import { InfoDrawer } from './components/layout/InfoDrawer';
import { ToastContainer } from './components/common/ToastContainer';
import { USSDPhoneModal } from './components/common/USSDPhoneModal';
import { ParliamentReportModal } from './components/reports/ParliamentReportModal';
import { DataProvenanceModal } from './components/common/DataProvenanceModal';
import { MLModelMetricsModal } from './components/common/MLModelMetricsModal';
import { AuthModal } from './components/common/AuthModal';
import { ChatbotWidget } from './components/common/ChatbotWidget';

// Module Components
import { AccessibilityMonitor } from './components/modules/AccessibilityMonitor';
import { RouteOptimizer } from './components/modules/RouteOptimizer';
import { VehicleTracker } from './components/modules/VehicleTracker';
import { PredictiveIntelligence } from './components/modules/PredictiveIntelligence';
import { AlertCenter } from './components/modules/AlertCenter';
import { FieldReportingApp } from './components/modules/FieldReportingApp';
import { AnalyticsDashboard } from './components/modules/AnalyticsDashboard';
import { OfflineMultilingual } from './components/modules/OfflineMultilingual';

import {
  ArrowLeft,
  Home,
  ChevronRight,
  Sparkles,
  Map,
  Route,
  Truck,
  BellRing,
  Smartphone,
  Menu
} from 'lucide-react';
import type { ActiveModule } from './context/PlatformContext';

const getModuleMeta = (mod: ActiveModule) => {
  switch (mod) {
    case 'ACCESSIBILITY':
      return { title: 'GIS Command Center — Northeast Regional Grid', short: 'GIS Grid' };
    case 'ROUTE':
      return { title: 'Multi-Modal Route Optimizer & Alternatives', short: 'Route Optimizer' };
    case 'FLEET':
      return { title: 'Real-Time Fleet Telematics & NavIC Tracking', short: 'Fleet Telemetry' };
    case 'PREDICTION':
      return { title: 'Predictive Disruption & Digital Twin Simulation', short: 'Risk Intelligence' };
    case 'ALERT':
      return { title: 'Emergency Alert Broadcast & CAP Center', short: 'Alert Broadcast' };
    case 'FIELD_APP':
      return { title: 'PWA Field Inspector & Incident Reporting', short: 'Field Reporting' };
    case 'ANALYTICS':
      return { title: 'Operational Analytics & Strategic Governance', short: 'Command Analytics' };
    case 'OFFLINE_RESILIENCE':
      return { title: 'Offline-First Resilience & Multilingual Sync', short: 'Offline Sync' };
    default:
      return { title: 'NERALIS Platform', short: 'Command Center' };
  }
};

const MainLayout: React.FC = () => {
  const {
    activeModule,
    navigateToModule,
    goBack,
    goToLanding,
    previousModule
  } = usePlatform();
  const currentMeta = getModuleMeta(activeModule);
  const prevMeta = previousModule ? getModuleMeta(previousModule) : null;
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#FCF6F5] text-[#252124] flex flex-col font-sans select-none pb-14 lg:pb-0">
      {/* Top Navbar (Soft Off-White) */}
      <Navbar onMobileMenuToggle={() => setMobileMenuOpen((v) => !v)} />

      {/* Connectivity Banner (Adaptive 4G/3G/2G/Offline) */}
      <ConnectivityBanner />

      {/* KPI Status Chips Bar (White Cards, Cherry Accents) */}
      <KPIBar />

      {/* Main Body with Sidebar + Dynamic Module Canvas */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Navigation Sidebar */}
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />

        {/* Dynamic Center Module Canvas */}
        {activeModule === 'ACCESSIBILITY' ? (
          /* Full-Bleed Map Landing Layout (Edge-to-Edge Canvas) */
          <main className="flex-1 overflow-hidden relative flex flex-col bg-[#FCF6F5]">
            <AccessibilityMonitor />
          </main>
        ) : (
          /* Secondary Module Container with Universal Back Navigation Bar */
          <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 bg-[#FCF6F5]">
            <div className="max-w-7xl mx-auto space-y-3 sm:space-y-4">
              {/* Universal Navigation Header Bar */}
              <div className="bg-[#FFFFFF] border border-[#E7DAD8] rounded-xl p-2.5 sm:p-3 flex flex-wrap items-center justify-between gap-2 shadow-sm">
                {/* Back Button and Breadcrumb Trail */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={goBack}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FCF6F5] hover:bg-[#EDE4E2] text-[#990011] border border-[#E7DAD8] rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    title={`Back to ${prevMeta ? prevMeta.short : 'Main GIS Map'}`}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline">Back</span>
                  </button>

                  <button
                    onClick={goToLanding}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#FFFFFF] hover:bg-[#EDE4E2] text-[#252124] hover:text-[#990011] border border-[#E7DAD8] rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    title="Return to Landing Page (Main GIS Map)"
                  >
                    <Home className="w-3.5 h-3.5 text-[#990011]" />
                    <span className="hidden sm:inline">GIS Map</span>
                  </button>

                  <div className="hidden md:flex items-center gap-1 text-xs text-[#786D6D]">
                    <div className="h-4 w-px bg-[#E7DAD8] mx-1" />
                    <span onClick={goToLanding} className="hover:text-[#990011] cursor-pointer font-medium">Command</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#786D6D]" />
                    <span className="font-semibold text-[#252124] truncate max-w-[240px]">{currentMeta.short}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="bg-[#990011]/10 text-[#990011] border border-[#990011]/20 px-2.5 py-1 rounded-full flex items-center gap-1 text-[11px] font-mono">
                    <Sparkles className="w-3 h-3 text-[#990011]" />
                    <span className="hidden sm:inline">NER Logistics Grid v2.0</span>
                    <span className="sm:hidden">NERALIS</span>
                  </span>
                </div>
              </div>

              {/* Dynamic Module Component Content */}
              {activeModule === 'ROUTE' && <RouteOptimizer />}
              {activeModule === 'FLEET' && <VehicleTracker />}
              {activeModule === 'PREDICTION' && <PredictiveIntelligence />}
              {activeModule === 'ALERT' && <AlertCenter />}
              {activeModule === 'FIELD_APP' && <FieldReportingApp />}
              {activeModule === 'ANALYTICS' && <AnalyticsDashboard />}
              {activeModule === 'OFFLINE_RESILIENCE' && <OfflineMultilingual />}
            </div>
          </main>
        )}
      </div>

      {/* Mobile Bottom Navigation Bar (Thumb Friendly for Android/iPhone) */}
      <nav className="fixed bottom-0 inset-x-0 h-14 bg-[#FCF6F5]/95 backdrop-blur-md border-t border-[#E7DAD8] z-[3400] lg:hidden flex items-center justify-around px-2 pb-safe shadow-md">
        <button
          onClick={() => navigateToModule('ACCESSIBILITY')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
            activeModule === 'ACCESSIBILITY'
              ? 'text-[#990011] font-semibold'
              : 'text-[#786D6D] hover:text-[#252124]'
          }`}
        >
          <Map className="w-4 h-4 mb-0.5" />
          <span className="text-[10px]">GIS Map</span>
        </button>

        <button
          onClick={() => navigateToModule('ROUTE')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
            activeModule === 'ROUTE'
              ? 'text-[#990011] font-semibold'
              : 'text-[#786D6D] hover:text-[#252124]'
          }`}
        >
          <Route className="w-4 h-4 mb-0.5" />
          <span className="text-[10px]">Route</span>
        </button>

        <button
          onClick={() => navigateToModule('FLEET')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
            activeModule === 'FLEET'
              ? 'text-[#990011] font-semibold'
              : 'text-[#786D6D] hover:text-[#252124]'
          }`}
        >
          <Truck className="w-4 h-4 mb-0.5" />
          <span className="text-[10px]">Fleet</span>
        </button>

        <button
          onClick={() => navigateToModule('ALERT')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
            activeModule === 'ALERT'
              ? 'text-[#990011] font-semibold'
              : 'text-[#786D6D] hover:text-[#252124]'
          }`}
        >
          <BellRing className="w-4 h-4 mb-0.5" />
          <span className="text-[10px]">Alerts</span>
        </button>

        <button
          onClick={() => navigateToModule('FIELD_APP')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
            activeModule === 'FIELD_APP'
              ? 'text-[#990011] font-semibold'
              : 'text-[#786D6D] hover:text-[#252124]'
          }`}
        >
          <Smartphone className="w-4 h-4 mb-0.5" />
          <span className="text-[10px]">Field</span>
        </button>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[#786D6D] hover:text-[#252124] transition-colors"
        >
          <Menu className="w-4 h-4 mb-0.5" />
          <span className="text-[10px]">More</span>
        </button>
      </nav>

      {/* Slide-out Entity Inspector Drawer (480px) */}
      <InfoDrawer />

      {/* Global Modals, Chatbot & Toasts */}
      <USSDPhoneModal />
      <ParliamentReportModal />
      <DataProvenanceModal />
      <MLModelMetricsModal />
      <AuthModal />
      <ChatbotWidget />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <LanguageProvider>
      <PlatformProvider>
        <MainLayout />
      </PlatformProvider>
    </LanguageProvider>
  );
}

export default App;
