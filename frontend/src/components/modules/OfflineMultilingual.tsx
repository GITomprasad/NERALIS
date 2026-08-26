import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  HardDrive,
  Globe,
  Wifi,
  WifiOff,
  SignalLow,
  RefreshCw,
  PhoneCall,
  CheckCircle2,
  Database,
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const OfflineMultilingual: React.FC = () => {
  const { networkMode, setNetworkMode, setIsUSSDModalOpen, addToast } = usePlatform();
  const { languages, currentLanguage, setLanguage, t } = useLanguage();

  const [isSyncingQueue, setIsSyncingQueue] = useState(false);
  const [cachedDistricts, setCachedDistricts] = useState([
    { name: 'Kamrup Met (Assam)', size: '18.4 MB', tiles: 1420, status: 'CACHED' },
    { name: 'Tawang (Arunachal)', size: '24.2 MB', tiles: 1890, status: 'CACHED' },
    { name: 'Imphal West (Manipur)', size: '15.8 MB', tiles: 1210, status: 'CACHED' },
    { name: 'East Khasi Hills (Meghalaya)', size: '19.1 MB', tiles: 1540, status: 'CACHED' },
  ]);

  const handleTriggerSync = () => {
    setIsSyncingQueue(true);
    setTimeout(() => {
      setIsSyncingQueue(false);
      addToast('Delta Sync Complete', 'All 14 pending field reports & telemetry logs synchronized with central server.', 'SUCCESS');
    }, 1500);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-[#D1D5DB] flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div>
          <h2 className="text-base font-black text-[#1E3A5F]">
            {t('module_8')} — Offline-First & Multilingual Infrastructure
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Vector tile caching, delta synchronization, 2G bandwidth compression, and native 8-language support
          </p>
        </div>

        {/* USSD button */}
        <button
          onClick={() => setIsUSSDModalOpen(true)}
          className="btn-primary text-xs py-2 shadow-xs"
        >
          <PhoneCall className="w-3.5 h-3.5" /> Launch *123# USSD Dialer
        </button>
      </div>

      {/* Network Connectivity Simulator Controls */}
      <div className="bg-white p-5 rounded-xl border border-[#D1D5DB] shadow-xs space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-[#1E3A5F] text-xs uppercase">
            Simulate NER Field Connectivity Environment
          </span>
          <span className="text-[10px] text-gray-500">Tests system behavior in deep terrain deadzones</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => {
              setNetworkMode('ONLINE');
              addToast('Network Switched', 'Full 5G/Broadband Online Mode active.', 'SUCCESS');
            }}
            className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
              networkMode === 'ONLINE'
                ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200'
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <Wifi className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <div className="font-bold text-gray-900">5G / Broadband Online</div>
              <div className="text-[10px] text-gray-500 mt-0.5">Full vector tiles, live MQTT telemetry & cloud sync</div>
            </div>
          </button>

          <button
            onClick={() => {
              setNetworkMode('LOW_2G');
              addToast('Network Switched', 'Remote 2G low bandwidth adaptive payload mode active.', 'WARNING');
            }}
            className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
              networkMode === 'LOW_2G'
                ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-200'
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <SignalLow className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <div className="font-bold text-gray-900">Low 2G Bandwidth</div>
              <div className="text-[10px] text-gray-500 mt-0.5">60% JSON payload reduction, vector tile compression</div>
            </div>
          </button>

          <button
            onClick={() => {
              setNetworkMode('OFFLINE');
              addToast('Network Switched', 'Zero connectivity offline IndexedDB mode active.', 'DANGER');
            }}
            className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
              networkMode === 'OFFLINE'
                ? 'bg-red-50 border-red-500 ring-2 ring-red-200'
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <WifiOff className="w-4 h-4 text-red-700" />
            </div>
            <div>
              <div className="font-bold text-gray-900">Zero Network Offline</div>
              <div className="text-[10px] text-gray-500 mt-0.5">IndexedDB local queueing & SMS/USSD fallback</div>
            </div>
          </button>
        </div>
      </div>

      {/* Bandwidth Optimisation Techniques (SIH26002 Quantified Table) */}
      <div className="bg-white p-5 rounded-xl border border-[#D1D5DB] shadow-xs space-y-3 text-xs">
        <span className="font-bold text-[#1E3A5F] text-xs uppercase block">
          Bandwidth Optimisation Techniques & Savings Metrics
        </span>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-left table-official">
            <thead>
              <tr>
                <th>Technique</th>
                <th>Engineering Description</th>
                <th>Bandwidth / Storage Saving</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-bold">Vector Map Tiles (MapLibre)</td>
                <td>10× smaller than raster png tiles; vector rendering on-device</td>
                <td className="font-bold text-emerald-700">90% Map Data Saving</td>
              </tr>
              <tr>
                <td className="font-bold">Delta Sync Protocol</td>
                <td>Only changed attribute fields sent over wire instead of whole record</td>
                <td className="font-bold text-emerald-700">75–80% Bandwidth Saving</td>
              </tr>
              <tr>
                <td className="font-bold">Automated Image Compression</td>
                <td>Field damage photos auto-compressed to ≤ 200 KB before upload</td>
                <td className="font-bold text-emerald-700">85% Photo Size Saving</td>
              </tr>
              <tr>
                <td className="font-bold">SMS Keyword API</td>
                <td>Critical route status via SMS: 'ROAD NH37' returns current status</td>
                <td className="font-bold text-emerald-700">Zero Internet Data Needed</td>
              </tr>
              <tr>
                <td className="font-bold">USSD Gateway (*123#)</td>
                <td>Interactive menu functional on 2G feature phones</td>
                <td className="font-bold text-emerald-700">100% Feature-Phone Compatible</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Column Grid: Cached District Vector Tiles & Multilingual Coverage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Pre-Downloaded Offline District Packages (6 cols) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-[#D1D5DB] shadow-xs space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#1E3A5F] text-xs uppercase flex items-center gap-1.5">
              <Database className="w-4 h-4 text-blue-700" /> Offline Vector Tile Packages (MBTiles)
            </span>
            <button
              onClick={handleTriggerSync}
              disabled={isSyncingQueue}
              className="btn-primary text-[10px] py-1 px-2.5"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncingQueue ? 'animate-spin' : ''}`} />
              <span>{isSyncingQueue ? 'Syncing...' : 'Sync Pending Queue'}</span>
            </button>
          </div>

          <div className="space-y-2">
            {cachedDistricts.map((d, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div>
                  <div className="font-bold text-gray-900">{d.name}</div>
                  <div className="text-[10px] text-gray-500">{d.tiles.toLocaleString()} Vector Tiles Cached</div>
                </div>
                <div className="text-right">
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                    {d.status} ({d.size})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Multilingual Coverage Matrix (6 cols) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-[#D1D5DB] shadow-xs space-y-3 text-xs">
          <span className="font-bold text-[#1E3A5F] text-xs uppercase flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-emerald-700" /> 8 NER States Multilingual Coverage
          </span>

          <div className="grid grid-cols-2 gap-2">
            {languages.map((l) => (
              <div
                key={l.code}
                onClick={() => {
                  setLanguage(l.code);
                  addToast('Language Changed', `Interface switched to ${l.native} (${l.label}).`, 'INFO');
                }}
                className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                  currentLanguage === l.code
                    ? 'bg-[#EBF3FB] border-[#2563A8] font-bold shadow-xs'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-900">{l.native}</span>
                  <span className="text-[9px] bg-white px-1.5 py-0.5 rounded border uppercase font-mono">
                    {l.code}
                  </span>
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5">{l.states}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
