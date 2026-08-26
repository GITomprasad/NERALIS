import React, { createContext, useContext, useState, useEffect } from 'react';
import type { District, RoadSegment, Bridge, SupplyDepot, Vehicle, Alert, FieldReport } from '../types';

export type ActiveModule =
  | 'ACCESSIBILITY'
  | 'ROUTE'
  | 'FLEET'
  | 'PREDICTION'
  | 'ALERT'
  | 'FIELD_APP'
  | 'ANALYTICS'
  | 'OFFLINE_RESILIENCE';

export type UserRole = 'CITIZEN' | 'STATE_ADMIN' | 'DISTRICT_COLLECTOR' | 'LOGISTICS_OPERATOR' | 'FIELD_INSPECTOR';

export type NetworkMode = 'ONLINE' | 'LOW_2G' | 'OFFLINE';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  tier: 'INFO' | 'SUCCESS' | 'WARNING' | 'DANGER';
  timestamp: string;
}

interface PlatformContextType {
  activeModule: ActiveModule;
  setActiveModule: (mod: ActiveModule) => void;
  navigationHistory: ActiveModule[];
  navigateToModule: (mod: ActiveModule) => void;
  goBack: () => void;
  goToLanding: () => void;
  previousModule: ActiveModule | null;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isAdminOrAuthority: boolean;
  isFullAdmin: boolean;
  networkMode: NetworkMode;
  setNetworkMode: (mode: NetworkMode) => void;
  
  // Sidebar collapsed state
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (v: boolean) => void;
  toggleSidebar: () => void;
  
  // Drawer state
  isDrawerOpen: boolean;
  drawerData: any | null;
  drawerType: 'DISTRICT' | 'CORRIDOR' | 'BRIDGE' | 'VEHICLE' | 'ALERT' | 'REPORT' | null;
  openDrawer: (type: 'DISTRICT' | 'CORRIDOR' | 'BRIDGE' | 'VEHICLE' | 'ALERT' | 'REPORT', data: any) => void;
  closeDrawer: () => void;

  // Search & Global filter
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedStateFilter: string;
  setSelectedStateFilter: (state: string) => void;

  // Modals
  isUSSDModalOpen: boolean;
  setIsUSSDModalOpen: (open: boolean) => void;
  isARModalOpen: boolean;
  setIsARModalOpen: (open: boolean) => void;
  isSignatureModalOpen: boolean;
  setIsSignatureModalOpen: (open: boolean) => void;
  isParliamentModalOpen: boolean;
  setIsParliamentModalOpen: (open: boolean) => void;

  // Live Toast Notifications
  toasts: ToastMessage[];
  addToast: (title: string, message: string, tier?: 'INFO' | 'SUCCESS' | 'WARNING' | 'DANGER') => void;
  dismissToast: (id: string) => void;

  // Data Cache
  districts: District[];
  corridors: RoadSegment[];
  bridges: Bridge[];
  depots: SupplyDepot[];
  vehicles: Vehicle[];
  alerts: Alert[];
  fieldReports: FieldReport[];
  refreshData: () => Promise<void>;
  updateRoadStatus: (corridorId: string, status: any) => void;
  addNewReport: (report: any) => void;
  addNewAlert: (alert: any) => void;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeModule, setActiveModuleState] = useState<ActiveModule>('ACCESSIBILITY');
  const [navigationHistory, setNavigationHistory] = useState<ActiveModule[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole>('STATE_ADMIN');
  const [networkMode, setNetworkMode] = useState<NetworkMode>('ONLINE');

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const navigateToModule = (mod: ActiveModule) => {
    if (mod === activeModule) return;
    setNavigationHistory((prev) => [...prev, activeModule].slice(-20));
    setActiveModuleState(mod);
  };

  const setActiveModule = (mod: ActiveModule) => {
    navigateToModule(mod);
  };

  const goBack = () => {
    if (navigationHistory.length > 0) {
      const prevStack = [...navigationHistory];
      const prevMod = prevStack.pop() || 'ACCESSIBILITY';
      setNavigationHistory(prevStack);
      setActiveModuleState(prevMod);
    } else {
      setActiveModuleState('ACCESSIBILITY');
    }
  };

  const goToLanding = () => {
    if (activeModule !== 'ACCESSIBILITY') {
      setNavigationHistory((prev) => [...prev, activeModule].slice(-20));
      setActiveModuleState('ACCESSIBILITY');
    }
  };

  const previousModule = navigationHistory.length > 0 ? navigationHistory[navigationHistory.length - 1] : null;

  // Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState<any | null>(null);
  const [drawerType, setDrawerType] = useState<any | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStateFilter, setSelectedStateFilter] = useState('ALL');

  // Modals
  const [isUSSDModalOpen, setIsUSSDModalOpen] = useState(false);
  const [isARModalOpen, setIsARModalOpen] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [isParliamentModalOpen, setIsParliamentModalOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([
    {
      id: 't-1',
      title: 'T4 Emergency Warning Dispatched',
      message: 'Teesta Valley NH-10 Corridor blocked due to heavy rock surge. 482 operators alerted.',
      tier: 'DANGER',
      timestamp: '08:15 IST'
    }
  ]);

  // Master Data state
  const [districts, setDistricts] = useState<District[]>([]);
  const [corridors, setCorridors] = useState<RoadSegment[]>([]);
  const [bridges, setBridges] = useState<Bridge[]>([]);
  const [depots, setDepots] = useState<SupplyDepot[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [fieldReports, setFieldReports] = useState<FieldReport[]>([]);

  const addToast = (title: string, message: string, tier: 'INFO' | 'SUCCESS' | 'WARNING' | 'DANGER' = 'INFO') => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      title,
      message,
      tier,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setToasts((prev) => [newToast, ...prev].slice(0, 5));
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const openDrawer = (type: 'DISTRICT' | 'CORRIDOR' | 'BRIDGE' | 'VEHICLE' | 'ALERT' | 'REPORT', data: any) => {
    setDrawerType(type);
    setDrawerData(data);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setDrawerData(null);
    setDrawerType(null);
  };

  const updateRoadStatus = (corridorId: string, status: any) => {
    setCorridors((prev) =>
      prev.map((c) => (c.id === corridorId ? { ...c, status } : c))
    );
    addToast('Road Status Updated', `Corridor ${corridorId} status altered to ${status}.`, 'SUCCESS');
  };

  const addNewReport = (report: any) => {
    setFieldReports((prev) => [report, ...prev]);
    addToast('Field Report Submitted', `Report #${report.id} registered for ${report.district}.`, 'SUCCESS');
  };

  const addNewAlert = (alert: any) => {
    setAlerts((prev) => [alert, ...prev]);
    addToast('New Alert Dispatched', alert.title, 'WARNING');
  };

  // Fetch initial data from backend with robust local fallbacks
  const refreshData = async () => {
    try {
      const [distRes, corrRes, brRes, depRes, vehRes, altRes, repRes] = await Promise.all([
        fetch('http://127.0.0.1:8000/api/districts').then(r => r.json()).catch(() => null),
        fetch('http://127.0.0.1:8000/api/corridors').then(r => r.json()).catch(() => null),
        fetch('http://127.0.0.1:8000/api/bridges').then(r => r.json()).catch(() => null),
        fetch('http://127.0.0.1:8000/api/depots').then(r => r.json()).catch(() => null),
        fetch('http://127.0.0.1:8000/api/fleet/vehicles').then(r => r.json()).catch(() => null),
        fetch('http://127.0.0.1:8000/api/alerts').then(r => r.json()).catch(() => null),
        fetch('http://127.0.0.1:8000/api/reports/field').then(r => r.json()).catch(() => null)
      ]);

      if (distRes?.districts) setDistricts(distRes.districts);
      if (corrRes?.corridors) setCorridors(corrRes.corridors);
      if (brRes?.bridges) setBridges(brRes.bridges);
      if (depRes?.depots) setDepots(depRes.depots);
      if (vehRes?.vehicles) setVehicles(vehRes.vehicles);
      if (altRes?.alerts) setAlerts(altRes.alerts);
      if (repRes?.reports) setFieldReports(repRes.reports);
    } catch (e) {
      console.warn('Backend offline, using fallback local cache', e);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const isAdminOrAuthority = userRole === 'STATE_ADMIN' || userRole === 'DISTRICT_COLLECTOR' || userRole === 'FIELD_INSPECTOR';
  const isFullAdmin = userRole === 'STATE_ADMIN' || userRole === 'DISTRICT_COLLECTOR';

  return (
    <PlatformContext.Provider
      value={{
        activeModule,
        setActiveModule,
        navigationHistory,
        navigateToModule,
        goBack,
        goToLanding,
        previousModule,
        userRole,
        setUserRole,
        isAdminOrAuthority,
        isFullAdmin,
        networkMode,
        setNetworkMode,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        toggleSidebar,
        isDrawerOpen,
        drawerData,
        drawerType,
        openDrawer,
        closeDrawer,
        searchQuery,
        setSearchQuery,
        selectedStateFilter,
        setSelectedStateFilter,
        isUSSDModalOpen,
        setIsUSSDModalOpen,
        isARModalOpen,
        setIsARModalOpen,
        isSignatureModalOpen,
        setIsSignatureModalOpen,
        isParliamentModalOpen,
        setIsParliamentModalOpen,
        toasts,
        addToast,
        dismissToast,
        districts,
        corridors,
        bridges,
        depots,
        vehicles,
        alerts,
        fieldReports,
        refreshData,
        updateRoadStatus,
        addNewReport,
        addNewAlert
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => {
  const ctx = useContext(PlatformContext);
  if (!ctx) {
    throw new Error('usePlatform must be used within PlatformProvider');
  }
  return ctx;
};
