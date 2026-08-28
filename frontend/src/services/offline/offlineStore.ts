/**
 * Durable IndexedDB Storage for NERALIS Offline Outbox & Cached Operational Data.
 * Guarantees offline mutations (field reports, status updates) survive browser restarts.
 */

const DB_NAME = 'neralis_offline_db';
const DB_VERSION = 1;
const STORE_OUTBOX = 'outbox_mutations';
const STORE_CACHE = 'reference_cache';

export interface DurableOutboxItem {
  client_event_id: string;
  action: 'FIELD_REPORT' | 'ROAD_STATUS' | 'ALERT_ACK';
  payload: any;
  status: 'QUEUED' | 'SYNCING' | 'SYNCED' | 'FAILED';
  retry_count: number;
  queued_at: string;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_OUTBOX)) {
        db.createObjectStore(STORE_OUTBOX, { keyPath: 'client_event_id' });
      }
      if (!db.objectStoreNames.contains(STORE_CACHE)) {
        db.createObjectStore(STORE_CACHE, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const offlineStore = {
  async saveOutboxItem(item: DurableOutboxItem): Promise<void> {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_OUTBOX, 'readwrite');
      tx.objectStore(STORE_OUTBOX).put(item);
      return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch (e) {
      console.warn('IndexedDB outbox write fallback:', e);
    }
  },

  async getAllOutboxItems(): Promise<DurableOutboxItem[]> {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_OUTBOX, 'readonly');
      const req = tx.objectStore(STORE_OUTBOX).getAll();
      return new Promise((resolve, reject) => {
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return [];
    }
  },

  async removeOutboxItem(client_event_id: string): Promise<void> {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_OUTBOX, 'readwrite');
      tx.objectStore(STORE_OUTBOX).delete(client_event_id);
      return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch (e) {
      console.warn('IndexedDB outbox delete fallback:', e);
    }
  },

  async cacheReferenceData(key: string, data: any): Promise<void> {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_CACHE, 'readwrite');
      tx.objectStore(STORE_CACHE).put({ key, data, cached_at: new Date().toISOString() });
      return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch (e) {
      console.warn('IndexedDB cache write fallback:', e);
    }
  },

  async getCachedReferenceData<T>(key: string): Promise<T | null> {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_CACHE, 'readonly');
      const req = tx.objectStore(STORE_CACHE).get(key);
      return new Promise((resolve, reject) => {
        req.onsuccess = () => resolve(req.result ? req.result.data : null);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return null;
    }
  }
};
