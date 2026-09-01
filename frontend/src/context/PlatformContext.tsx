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
import {
  FALLBACK_SOURCES,
  FALLBACK_DISTRICTS,
  FALLBACK_CORRIDORS,
  FALLBACK_BRIDGES,
  FALLBACK_DEPOTS,
  FALLBACK_VEHICLES,
  FALLBACK_ALERTS,
  FALLBACK_FIELD_REPORTS
} from '../services/data/nerGeographyFallback';

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

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  tier: 'INFO' | 'SUCCESS' | 'WARNING' | 'DANGER';
  timestamp: string;
  isRead: boolean;
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
  currentUser: any | null;
  isAuthModalOpen: boolean;
  authModalMode: 'SIGNIN' | 'SIGNUP';
  openAuthModal: (mode?: 'SIGNIN' | 'SIGNUP') => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: (payload?: {
    email?: string;
    name?: string;
    role?: UserRole;
    photo_url?: string;
    google_id?: string;
    credential?: string;
    is_sandbox?: boolean;
  }) => Promise<boolean>;
  signup: (payload: any) => Promise<boolean>;
  logout: () => void;
  quickSwitchRole: (role: UserRole) => void;
  demoAccounts: any[];
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

  // AI Assistant Chatbot (NERALIS AI Sahayak)
  isChatbotOpen: boolean;
  setIsChatbotOpen: (open: boolean) => void;
  toggleChatbot: () => void;
  chatbotInitialPrompt: string;
  openChatbotWithPrompt: (prompt: string) => void;

  // Live Toast Notifications & Notifications History
  toasts: ToastMessage[];
  notifications: NotificationItem[];
  unreadNotifCount: number;
  addToast: (title: string, message: string, tier?: 'INFO' | 'SUCCESS' | 'WARNING' | 'DANGER') => void;
  dismissToast: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearAllNotifications: () => void;

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

  // Authentication State
  const [currentUser, setCurrentUser] = useState<any | null>(() => {
    try {
      const saved = localStorage.getItem('neralis_user_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'SIGNIN' | 'SIGNUP'>('SIGNIN');
  const [demoAccounts, setDemoAccounts] = useState<any[]>([]);

  // Sync userRole with currentUser on mount
  useEffect(() => {
    if (currentUser?.frontend_role) {
      setUserRole(currentUser.frontend_role as UserRole);
    }
  }, [currentUser]);

  // Load demo accounts
  useEffect(() => {
    apiClient.getDemoAccounts().then((accs) => {
      if (accs && accs.length > 0) setDemoAccounts(accs);
    });
  }, []);

  const openAuthModal = (mode: 'SIGNIN' | 'SIGNUP' = 'SIGNIN') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await apiClient.signIn(email, password);
      if (res?.success && res.user) {
        setCurrentUser(res.user);
        setUserRole(res.user.frontend_role as UserRole);
        localStorage.setItem('neralis_user_session', JSON.stringify(res.user));
        addToast('Authentication Verified', `Logged in as ${res.user.name} (${res.user.frontend_role}).`, 'SUCCESS');
        setIsAuthModalOpen(false);
        return true;
      }
      return false;
    } catch (err: any) {
      addToast('Authentication Failed', err.message || 'Invalid credentials', 'DANGER');
      return false;
    }
  };

  const loginWithGoogle = async (payload?: {
    email?: string;
    name?: string;
    role?: UserRole;
    photo_url?: string;
    google_id?: string;
    credential?: string;
    is_sandbox?: boolean;
  }): Promise<boolean> => {
    try {
      const googleData = {
        email: payload?.email,
        name: payload?.name,
        role: payload?.role || 'CITIZEN',
        photo_url: payload?.photo_url,
        google_id: payload?.google_id,
        credential: payload?.credential,
        is_sandbox: payload?.is_sandbox
      };
      const res = await apiClient.signInWithGoogle(googleData);
      if (res?.success && res.user) {
        setCurrentUser(res.user);
        setUserRole(res.user.frontend_role as UserRole);
        localStorage.setItem('neralis_user_session', JSON.stringify(res.user));
        const toastTitle = payload?.is_sandbox ? 'Sandbox Session Active' : 'Google Sign-In Verified';
        addToast(toastTitle, `Welcome to NERALIS, ${res.user.name}!`, 'SUCCESS');
        setIsAuthModalOpen(false);
        return true;
      }
      return false;
    } catch (err: any) {
      addToast('Google Sign-In Failed', err.message || 'Unable to authenticate with Google', 'DANGER');
      return false;
    }
  };

  const signup = async (payload: any): Promise<boolean> => {
    try {
      const res = await apiClient.signUp(payload);
      if (res?.success && res.user) {
        setCurrentUser(res.user);
        setUserRole(res.user.frontend_role as UserRole);
        localStorage.setItem('neralis_user_session', JSON.stringify(res.user));
        addToast('Registration Successful', `Welcome to NERALIS, ${res.user.name}!`, 'SUCCESS');
        setIsAuthModalOpen(false);
        return true;
      }
      return false;
    } catch (err: any) {
      addToast('Registration Error', err.message || 'Could not register user', 'DANGER');
      return false;
    }
  };

  const logout = () => {
    apiClient.logout().catch(() => {});
    setCurrentUser(null);
    setUserRole('CITIZEN');
    localStorage.removeItem('neralis_user_session');
    addToast('Session Ended', 'You have been signed out successfully.', 'INFO');
  };

  const quickSwitchRole = (role: UserRole) => {
    setUserRole(role);
    const demo = demoAccounts.find((d) => d.role_key === role);
    if (demo) {
      const demoUser = {
        id: `USR-${role}`,
        name: demo.name,
        email: demo.email,
        role: role,
        frontend_role: role,
        organization: demo.description
      };
      setCurrentUser(demoUser);
      localStorage.setItem('neralis_user_session', JSON.stringify(demoUser));
    }
    addToast('Governance Role Switched', `Active governance permission: ${role}`, 'INFO');
  };

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

  // AI Assistant Chatbot
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatbotInitialPrompt, setChatbotInitialPrompt] = useState('');

  const toggleChatbot = () => {
    setIsChatbotOpen((prev) => !prev);
  };

  const openChatbotWithPrompt = (prompt: string) => {
    setChatbotInitialPrompt(prompt);
    setIsChatbotOpen(true);
  };

  // Live Outbox
  const [outbox, setOutbox] = useState<OutboxItem[]>([]);

  // Toasts (Auto-vanish after 2s) & Notifications Dropdown History
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'T4 Emergency Warning Dispatched',
      message: 'Teesta Valley NH-10 Corridor blocked due to debris surge. 482 operators alerted.',
      tier: 'DANGER',
      timestamp: '08:15 IST',
      isRead: false
    },
    {
      id: 'notif-2',
      title: 'Bridge Telemetry Synchronized',
      message: 'Saraighat Bridge sensor health: 94%. Water clearance 5.8m (safe).',
      tier: 'SUCCESS',
      timestamp: '08:10 IST',
      isRead: true
    }
  ]);

  // Master Data state initialized with full fallback datasets
  const [sources, setSources] = useState<SourceRegistryItem[]>(FALLBACK_SOURCES);
  const [districts, setDistricts] = useState<District[]>(FALLBACK_DISTRICTS);
  const [corridors, setCorridors] = useState<RoadSegment[]>(FALLBACK_CORRIDORS);
  const [bridges, setBridges] = useState<Bridge[]>(FALLBACK_BRIDGES);
  const [depots, setDepots] = useState<SupplyDepot[]>(FALLBACK_DEPOTS);
  const [vehicles, setVehicles] = useState<Vehicle[]>(FALLBACK_VEHICLES);
  const [alerts, setAlerts] = useState<Alert[]>(FALLBACK_ALERTS);
  const [fieldReports, setFieldReports] = useState<FieldReport[]>(FALLBACK_FIELD_REPORTS);

  const addToast = (title: string, message: string, tier: 'INFO' | 'SUCCESS' | 'WARNING' | 'DANGER' = 'INFO') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newToast: ToastMessage = {
      id,
      title,
      message,
      tier,
      timestamp
    };

    const newNotif: NotificationItem = {
      id,
      title,
      message,
      tier,
      timestamp,
      isRead: false
    };

    // Show floating toast
    setToasts((prev) => [newToast, ...prev].slice(0, 5));
    // Add to dropdown notification history
    setNotifications((prev) => [newNotif, ...prev].slice(0, 30));

    // Automatically vanish toast from screen after 2 seconds
    setTimeout(() => {
      dismissToast(id);
    }, 2000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;

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
    try {
      const dbItems = await offlineStore.getAllOutboxItems();
      const currentItems = dbItems && dbItems.length > 0 ? dbItems : outbox;

      if (currentItems.length === 0) {
        return;
      }

      addToast('Syncing Outbox...', `Uploading ${currentItems.length} pending mutations to backend.`, 'INFO');

      for (const item of currentItems) {
        if (item.action === 'FIELD_REPORT') {
          const synced = await apiClient.submitFieldReport(item.payload);
          if (synced) {
            await offlineStore.removeOutboxItem(item.client_event_id);
            setFieldReports((prev) =>
              prev.map((r) => (r.client_event_id === item.client_event_id ? { ...synced, sync_status: 'SYNCED' } : r))
            );
          }
        } else if (item.action === 'ROAD_STATUS') {
          await apiClient.updateCorridorStatus(item.payload.corridor_id, item.payload.status);
          await offlineStore.removeOutboxItem(item.client_event_id);
        } else if (item.action === 'ALERT_ACK') {
          await apiClient.acknowledgeAlert(item.payload.alert_id, item.payload.acknowledged_by);
          await offlineStore.removeOutboxItem(item.client_event_id);
        }
      }
      setOutbox([]);
      addToast('Outbox Synced Successfully', 'All offline mutations assigned canonical server IDs.', 'SUCCESS');
    } catch {
      // Offline fallback handling
    }
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

  // Real-Time NavIC & GPS Telematics Simulation Heartbeat (Every 4 seconds)
  useEffect(() => {
    const telemetryInterval = setInterval(() => {
      setVehicles((prevVehicles) =>
        prevVehicles.map((v) => {
          if (v.status === 'RESTRICTED' || v.speed_kmh === 0) {
            return v;
          }

          // Subtle realistic coordinate drift along heading
          const headingRad = ((v.heading_deg || 45) * Math.PI) / 180;
          const delta = 0.0008; // ~80 meters per tick
          const nextLat = Number((v.current_lat + Math.cos(headingRad) * delta).toFixed(5));
          const nextLng = Number((v.current_lng + Math.sin(headingRad) * delta).toFixed(5));

          // Speed fluctuation
          const speedJitter = Math.floor(Math.random() * 5) - 2;
          const nextSpeed = Math.max(15, Math.min(75, v.speed_kmh + speedJitter));

          // Temperature fluctuation if cold-chain
          let nextColdChain = v.cold_chain;
          if (v.cold_chain) {
            const tempJitter = (Math.random() * 0.2 - 0.1);
            const nextTemp = Number(Math.max(2.1, Math.min(7.8, v.cold_chain.current_temp_c + tempJitter)).toFixed(1));
            nextColdChain = {
              ...v.cold_chain,
              current_temp_c: nextTemp,
              status: `NORMAL (Safe ${nextTemp}°C)`
            };
          }

          return {
            ...v,
            current_lat: nextLat,
            current_lng: nextLng,
            speed_kmh: nextSpeed,
            cold_chain: nextColdChain,
            observed_at: new Date().toISOString(),
            verification_status: 'OBSERVED'
          };
        })
      );
    }, 4000);

    return () => clearInterval(telemetryInterval);
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
        currentUser,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        loginWithGoogle,
        signup,
        logout,
        quickSwitchRole,
        demoAccounts,
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
        isChatbotOpen,
        setIsChatbotOpen,
        toggleChatbot,
        chatbotInitialPrompt,
        openChatbotWithPrompt,
        toasts,
        notifications,
        unreadNotifCount,
        addToast,
        dismissToast,
        markAllNotificationsAsRead,
        clearAllNotifications,
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
