import React from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { PlatformProvider, usePlatform } from './context/PlatformContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { KPIBar } from './components/layout/KPIBar';
import { InfoDrawer } from './components/layout/InfoDrawer';
import { ToastContainer } from './components/common/ToastContainer';
import { USSDPhoneModal } from './components/common/USSDPhoneModal';
import { ParliamentReportModal } from './components/reports/ParliamentReportModal';

// Module Components
import { AccessibilityMonitor } from './components/modules/AccessibilityMonitor';
import { RouteOptimizer } from './components/modules/RouteOptimizer';
import { VehicleTracker } from './components/modules/VehicleTracker';
import { PredictiveIntelligence } from './components/modules/PredictiveIntelligence';
import { AlertCenter } from './components/modules/AlertCenter';
import { FieldReportingApp } from './components/modules/FieldReportingApp';
import { AnalyticsDashboard } from './components/modules/AnalyticsDashboard';
import { OfflineMultilingual } from './components/modules/OfflineMultilingual';

import { ArrowLeft, Home, ChevronRight, Sparkles } from 'lucide-react';
import type { ActiveModule } from './context/PlatformContext';

const getModuleMeta = (mod: ActiveModule) => {
  switch (mod) {
    case 'ACCESSIBILITY':
      return { title: 'North Eastern Region GIS Grid', short: 'Main GIS Map', icon: '🗺️' };
    case 'ROUTE':
      return { title: 'Multi-Modal Intelligent Routing', short: 'Route Optimizer', icon: '🛣️' };
    case 'FLEET':
      return { title: 'Real-Time NavIC & Satellite Telemetry', short: 'Fleet Telemetry', icon: '🚛' };
    case 'PREDICTION':
      return { title: '6 to 72-Hour Disruption Forecasting', short: '72h Forecasting', icon: '⚡' };
    case 'ALERT':
      return { title: 'Multilingual Broadcast & NDMA Integration', short: 'Alert Center', icon: '📢' };
    case 'FIELD_APP':
      return { title: 'PWA Field Inspector & SDRF Portal', short: 'Field Reporting', icon: '📱' };
    case 'ANALYTICS':
      return { title: 'Centralised Logistics Command & Analytics', short: 'Command Analytics', icon: '📊' };
    case 'OFFLINE_RESILIENCE':
      return { title: 'Offline-First & Multilingual Infrastructure', short: 'Offline Sync', icon: '💾' };
    default:
      return { title: 'NERALIS Platform', short: 'Main Map', icon: '🗺️' };
  }
};

const MainLayout: React.FC = () => {
  const { activeModule, goBack, goToLanding, previousModule } = usePlatform();
  const currentMeta = getModuleMeta(activeModule);
  const prevMeta = previousModule ? getModuleMeta(previousModule) : null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar />

      {/* KPI Status Chips Bar */}
      <KPIBar />

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <Sidebar />

        {/* Dynamic Center Module Canvas */}
        {activeModule === 'ACCESSIBILITY' ? (
          /* Full-Bleed Map Landing Layout (Edge-to-Edge Canvas) */
          <main className="flex-1 overflow-hidden relative flex flex-col bg-slate-900">
            <AccessibilityMonitor />
          </main>
        ) : (
          /* Secondary Module Container with Universal Back Navigation Bar */
          <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-[#F8FAFC]">
            <div className="max-w-7xl mx-auto space-y-4">
              {/* Universal Navigation Header Bar */}
              <div className="bg-white border border-[#D1D5DB] rounded-xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
                {/* Back Button and Breadcrumb Trail */}
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={goBack}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E3A5F] hover:bg-[#2563A8] text-white rounded-lg text-xs font-bold shadow-xs transition-all hover:scale-102"
                    title={`Back to ${prevMeta ? prevMeta.short : 'Main GIS Map'}`}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back {prevMeta ? `(${prevMeta.short})` : 'to Map'}</span>
                  </button>

                  <button
                    onClick={goToLanding}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-colors"
                    title="Return to Landing Page (Main GIS Map)"
                  >
                    <Home className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden sm:inline">Landing Map</span>
                  </button>

                  <div className="h-4 w-px bg-gray-300 hidden md:block" />

                  {/* Breadcrumb path */}
                  <div className="hidden md:flex items-center gap-1 text-xs text-gray-500">
                    <span
                      onClick={goToLanding}
                      className="hover:text-blue-700 cursor-pointer font-medium"
                    >
                      Home (GIS Grid)
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    <span className="font-bold text-[#1E3A5F]">{currentMeta.title}</span>
                  </div>
                </div>

                {/* Right Status Badge */}
                <div className="flex items-center gap-2 text-xs font-bold">
                  <span className="bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-full flex items-center gap-1 text-[11px]">
                    <Sparkles className="w-3 h-3 text-blue-600" />
                    <span>SIH26002 Production Module</span>
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

      {/* Slide-out Entity Inspector Drawer (480px) */}
      <InfoDrawer />

      {/* Global Modals & Toasts */}
      <USSDPhoneModal />
      <ParliamentReportModal />
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
