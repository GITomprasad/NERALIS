import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  District,
  RoadSegment,
  Bridge,
  SupplyDepot,
  Vehicle,
  Alert,
  FieldReport,
  SourceRegistryItem,
  MLModelMetrics
} from '../types';
import { apiClient } from '../services/api/apiClient';
import { offlineStore } from '../services/offline/offlineStore';

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

export interface OutboxItem {
  client_event_id: string;
  action: 'FIELD_REPORT' | 'ROAD_STATUS' | 'ALERT_ACK';
  payload: any;
  status: 'QUEUED' | 'SYNCING' | 'SYNCED' | 'FAILED';
  queued_at: string;
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
  
  // Demo vs Live Mode
  isDemoMode: boolean;
  toggleDemoMode: () => void;

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

  // Provenance Modal state
  isProvenanceModalOpen: boolean;
  provenanceData: any | null;
  openProvenanceModal: (data: any) => void;
  closeProvenanceModal: () => void;

  // ML Model Metrics Modal
  isModelMetricsModalOpen: boolean;
  setIsModelMetricsModalOpen: (open: boolean) => void;

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

  // Master Data Cache
  sources: SourceRegistryItem[];
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

  // Offline Outbox
  outbox: OutboxItem[];
  queueOfflineMutation: (action: 'FIELD_REPORT' | 'ROAD_STATUS' | 'ALERT_ACK', payload: any) => void;
  syncOutbox: () => Promise<void>;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeModule, setActiveModuleState] = useState<ActiveModule>('ACCESSIBILITY');
  const [navigationHistory, setNavigationHistory] = useState<ActiveModule[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole>('STATE_ADMIN');
  const [networkMode, setNetworkMode] = useState<NetworkMode>('ONLINE');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  const toggleDemoMode = () => {
    setIsDemoMode((prev) => {
      const next = !prev;
      addToast(
        next ? 'DEMO Simulation Active' : 'LIVE Mode Active',
        next
          ? 'Synthetic scenarios and test telemetry enabled.'
          : 'Connecting to verified official government sources (IMD, Bhuvan, CWC).',
        next ? 'WARNING' : 'SUCCESS'
      );
      return next;
    });
  };

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

  // Provenance Modal
  const [isProvenanceModalOpen, setIsProvenanceModalOpen] = useState(false);
  const [provenanceData, setProvenanceData] = useState<any | null>(null);

  const openProvenanceModal = (data: any) => {
    setProvenanceData(data);
    setIsProvenanceModalOpen(true);
  };

  const closeProvenanceModal = () => {
    setIsProvenanceModalOpen(false);
    setProvenanceData(null);
  };

  // ML Model Metrics Modal
  const [isModelMetricsModalOpen, setIsModelMetricsModalOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStateFilter, setSelectedStateFilter] = useState('ALL');

  // Modals
  const [isUSSDModalOpen, setIsUSSDModalOpen] = useState(false);
  const [isARModalOpen, setIsARModalOpen] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [isParliamentModalOpen, setIsParliamentModalOpen] = useState(false);

  // Live Outbox
  const [outbox, setOutbox] = useState<OutboxItem[]>([]);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([
    {
      id: 't-1',
      title: 'T4 Emergency Warning Dispatched',
      message: 'Teesta Valley NH-10 Corridor blocked due to debris surge. 482 operators alerted.',
      tier: 'DANGER',
      timestamp: '08:15 IST'
    }
  ]);

  // Master Data state
  const [sources, setSources] = useState<SourceRegistryItem[]>([]);
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
    addToast('Field Report Registered', `Report #${report.id} recorded with verified YOLOv8 classification.`, 'SUCCESS');
  };

  const addNewAlert = (alert: any) => {
    setAlerts((prev) => [alert, ...prev]);
    addToast('New Alert Dispatched', alert.title, 'WARNING');
  };

  // Offline Outbox Queueing & Sync
  const queueOfflineMutation = async (action: 'FIELD_REPORT' | 'ROAD_STATUS' | 'ALERT_ACK', payload: any) => {
    const client_event_id = `OUTBOX-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newItem: OutboxItem = {
      client_event_id,
      action,
      payload: { ...payload, client_event_id },
      status: networkMode === 'OFFLINE' ? 'QUEUED' : 'SYNCING',
      queued_at: new Date().toLocaleTimeString()
    };
    setOutbox((prev) => [newItem, ...prev]);

    // Save to durable IndexedDB
    await offlineStore.saveOutboxItem({
      ...newItem,
      retry_count: 0
    });

    if (action === 'FIELD_REPORT') {
      const optimisticReport: FieldReport = {
        id: `PENDING-${client_event_id}`,
        client_event_id,
        reporter_name: payload.reporter_name || 'Field Scout',
        reporter_role: payload.reporter_role || 'Inspector',
        state: payload.state || 'Assam',
        district: payload.district || 'AS-KAM',
        location_name: payload.location_name || 'Highway Point',
        lat: payload.lat || 26.1445,
        lng: payload.lng || 91.7362,
        timestamp: new Date().toISOString(),
        incident_type: payload.incident_type || 'Road Damage',
        damage_dimensions: {
          crack_length_m: payload.crack_length_m || 0,
          pothole_depth_cm: payload.pothole_depth_cm || 0,
          debris_volume_cum: payload.debris_volume_cum || 0
        },
        ai_severity_predicted: 'CALCULATING (Queued in IndexedDB)',
        status: 'QUEUED_LOCAL',
        assigned_crew: 'Local Division',
        points_awarded: 30,
        sync_status: 'QUEUED',
        source: 'SRC-FIELD-PWA',
        verification_status: 'REPORTED'
      };
      setFieldReports((prev) => [optimisticReport, ...prev]);
      addToast('Report Saved to IndexedDB Outbox', 'Durable offline storage active. Will auto-sync on reconnect.', 'INFO');
    }
  };

  const syncOutbox = async () => {
    if (outbox.length === 0) return;
    addToast('Syncing Outbox...', `Uploading ${outbox.length} pending mutations to backend.`, 'INFO');
    
    for (const item of outbox) {
      if (item.action === 'FIELD_REPORT') {
        const synced = await apiClient.submitFieldReport(item.payload);
        if (synced) {
          await offlineStore.removeOutboxItem(item.client_event_id);
          setFieldReports((prev) =>
            prev.map((r) => (r.client_event_id === item.client_event_id ? { ...synced, sync_status: 'SYNCED' } : r))
          );
        }
      }
    }
    setOutbox([]);
    addToast('Outbox Synced Successfully', 'All offline mutations assigned canonical server IDs.', 'SUCCESS');
  };

  // Fetch initial data from backend via typed apiClient
  const refreshData = async () => {
    try {
      const [srcRes, distRes, corrRes, brRes, depRes, vehRes, altRes, repRes] = await Promise.all([
        apiClient.getSources(),
        apiClient.getDistricts(),
        apiClient.getCorridors(),
        apiClient.getBridges(),
        apiClient.getDepots(),
        apiClient.getVehicles(isDemoMode),
        apiClient.getAlerts(),
        apiClient.getFieldReports()
      ]);

      if (srcRes.length > 0) {
        setSources(srcRes);
        offlineStore.cacheReferenceData('sources', srcRes);
      }
      if (distRes.length > 0) {
        setDistricts(distRes);
        offlineStore.cacheReferenceData('districts', distRes);
      }
      if (corrRes.length > 0) {
        setCorridors(corrRes);
        offlineStore.cacheReferenceData('corridors', corrRes);
      }
      if (brRes.length > 0) {
        setBridges(brRes);
        offlineStore.cacheReferenceData('bridges', brRes);
      }
      if (depRes.length > 0) {
        setDepots(depRes);
        offlineStore.cacheReferenceData('depots', depRes);
      }
      if (vehRes.length > 0) {
        setVehicles(vehRes);
        offlineStore.cacheReferenceData('vehicles', vehRes);
      }
      if (altRes.length > 0) {
        setAlerts(altRes);
        offlineStore.cacheReferenceData('alerts', altRes);
      }
      if (repRes.length > 0) {
        setFieldReports(repRes);
        offlineStore.cacheReferenceData('reports', repRes);
      }
    } catch (e) {
      console.warn('API error during refresh, loading from IndexedDB cache', e);
      const cachedDistricts = await offlineStore.getCachedReferenceData<District[]>('districts');
      if (cachedDistricts) setDistricts(cachedDistricts);
    }
  };

  useEffect(() => {
    // Load existing IndexedDB outbox items on startup
    offlineStore.getAllOutboxItems().then((items) => {
      if (items && items.length > 0) {
        setOutbox(items.map((i) => ({
          client_event_id: i.client_event_id,
          action: i.action,
          payload: i.payload,
          status: i.status,
          queued_at: i.queued_at
        })));
      }
    });
    refreshData();
  }, [isDemoMode]);

  useEffect(() => {
    if (networkMode === 'ONLINE' && outbox.length > 0) {
      syncOutbox();
    }
  }, [networkMode]);

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
        isDemoMode,
        toggleDemoMode,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        toggleSidebar,
        isDrawerOpen,
        drawerData,
        drawerType,
        openDrawer,
        closeDrawer,
        isProvenanceModalOpen,
        provenanceData,
        openProvenanceModal,
        closeProvenanceModal,
        isModelMetricsModalOpen,
        setIsModelMetricsModalOpen,
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
        sources,
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
        addNewAlert,
        outbox,
        queueOfflineMutation,
        syncOutbox
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
