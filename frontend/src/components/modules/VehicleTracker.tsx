import React, { useState, useEffect, useRef } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { useLanguage } from '../../context/LanguageContext';
import { apiClient } from '../../services/api/apiClient';
import type { Vehicle } from '../../types';
import {
  Truck,
  Thermometer,
  Fuel,
  QrCode,
  FileCheck,
  Clock,
  ShieldCheck,
  Play,
  Pause,
  RotateCcw,
  Navigation,
  Radio,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ChevronRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export const VehicleTracker: React.FC = () => {
  const { vehicles, openDrawer, addToast, navigateToModule } = usePlatform();
  const { t } = useLanguage();

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(vehicles[0]?.id || 'VEH-01');
  const [playbackIndex, setPlaybackIndex] = useState(0);
  const [isPlayingPlayback, setIsPlayingPlayback] = useState(false);
  const [playbackData, setPlaybackData] = useState<any>(null);
  const [isLoadingPlayback, setIsLoadingPlayback] = useState(false);
  const [qrCodeScanned, setQrCodeScanned] = useState(false);
  const [fleetFilter, setFleetFilter] = useState<'ALL' | 'MOVING' | 'DELAYED' | 'AT_RISK' | 'OFFLINE'>('ALL');

  const playbackTimerRef = useRef<any>(null);

  // Sync selected vehicle with live vehicles array
  const currentVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0] || null;

  // Load trip playback waypoints whenever selected vehicle changes
  useEffect(() => {
    if (!currentVehicle) return;

    let isMounted = true;
    setIsLoadingPlayback(true);
    apiClient.getVehiclePlayback(currentVehicle.id).then((data) => {
      if (isMounted) {
        setPlaybackData(data);
        setPlaybackIndex(data?.waypoints ? Math.max(0, data.waypoints.length - 1) : 0);
        setIsLoadingPlayback(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [currentVehicle?.id]);

  // Playback Auto-play timer
  useEffect(() => {
    if (isPlayingPlayback && playbackData?.waypoints?.length) {
      playbackTimerRef.current = setInterval(() => {
        setPlaybackIndex((prev) => {
          if (prev >= playbackData.waypoints.length - 1) {
            setIsPlayingPlayback(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
    } else {
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
    }
    return () => {
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
    };
  }, [isPlayingPlayback, playbackData]);

  const handleSimulateQRScan = () => {
    if (!currentVehicle) return;
    setQrCodeScanned(true);
    addToast(
      'Checkpoint RFID / QR Verified',
      `Vehicle ${currentVehicle.plate_number} (${currentVehicle.driver_name}) arrival logged at Gateway Checkpoint.`,
      'SUCCESS'
    );
    setTimeout(() => setQrCodeScanned(false), 3500);
  };

  const handleLocateOnMap = () => {
    if (!currentVehicle) return;
    openDrawer('VEHICLE', currentVehicle);
    navigateToModule('ACCESSIBILITY');
    addToast('Focused Vehicle on GIS Map', `Tracking ${currentVehicle.plate_number} live position.`, 'INFO');
  };

  const filteredVehicles = vehicles.filter((v) => {
    if (fleetFilter === 'MOVING') return v.speed_kmh > 0;
    if (fleetFilter === 'DELAYED') return v.status === 'RESTRICTED' || v.status.includes('DELAY') || v.status === 'SLOW_TERRAIN';
    if (fleetFilter === 'AT_RISK') return v.status === 'CRITICAL_FAST_TRACK';
    if (fleetFilter === 'OFFLINE') return v.network_mode.includes('Offline') || v.network_mode.includes('Iridium');
    return true;
  });

  const waypoints = playbackData?.waypoints || [
    { time: '06:00 IST', location: currentVehicle?.origin || 'Guwahati Hub', speed: 0, temp: 4.2, event: 'Dispatched with E-Way Bill' },
    { time: '09:15 IST', location: 'Intermediate Checkpoint (NH)', speed: currentVehicle?.speed_kmh || 45, temp: 4.2, event: 'NavIC Satellite Ping Normal' },
    { time: '14:30 IST', location: currentVehicle?.destination || 'Destination Depot', speed: currentVehicle?.speed_kmh || 40, temp: 4.2, event: 'Live Telemetry Active' }
  ];

  const currentWaypoint = waypoints[Math.min(playbackIndex, waypoints.length - 1)];

  // Temperature chart data
  const tempChartData = currentVehicle?.cold_chain?.temp_history
    ? currentVehicle.cold_chain.temp_history.map((t, idx) => ({
        time: `T-${((currentVehicle.cold_chain?.temp_history?.length || 8) - idx) * 30}m`,
        temp: t
      }))
    : [
        { time: '10:00', temp: 4.1 },
        { time: '11:00', temp: 4.2 },
        { time: '12:00', temp: 4.3 },
        { time: '13:00', temp: 4.1 },
        { time: '14:00', temp: currentVehicle?.cold_chain?.current_temp_c || 4.2 }
      ];

  return (
    <div className="space-y-4">
      {/* Top Header & Action Strip */}
      <div className="bg-white p-4 rounded-xl border border-[#D1D5DB] flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-black text-[#17365D]">
              {t('module_3')} — Real-Time NavIC & Satellite Telematics
            </h2>
            <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
              <Radio className="w-3 h-3 text-blue-600 animate-pulse" />
              NavIC L5 / S-Band Lock: ±2.4m
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time fleet tracking of essential medicines, food grains, and petroleum with cold-chain monitoring
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentVehicle && (
            <button
              onClick={handleLocateOnMap}
              className="bg-[#17365D] hover:bg-[#2563A8] text-white font-bold text-xs px-3 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Locate on GIS Map</span>
            </button>
          )}

          <button
            onClick={handleSimulateQRScan}
            className="btn-secondary text-xs py-2 shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <QrCode className="w-4 h-4 text-emerald-700" />
            <span>{qrCodeScanned ? 'Checkpoint Verified ✓' : 'Scan Checkpoint QR'}</span>
          </button>
        </div>
      </div>

      {/* Fleet Filter Bar */}
      <div className="bg-white p-2.5 rounded-xl border border-[#D1D5DB] shadow-xs flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 font-bold">
          <span className="text-gray-500 text-[11px] uppercase mr-1">Fleet Filters:</span>
          {(['ALL', 'MOVING', 'DELAYED', 'AT_RISK', 'OFFLINE'] as const).map((filterKey) => (
            <button
              key={filterKey}
              onClick={() => setFleetFilter(filterKey)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                fleetFilter === filterKey
                  ? 'bg-[#17365D] text-white shadow-xs'
                  : 'bg-slate-100 text-gray-700 hover:bg-slate-200'
              }`}
            >
              {filterKey === 'ALL' ? `All (${vehicles.length})` : filterKey.replace('_', ' ')}
            </button>
          ))}
        </div>
        <div className="text-[11px] text-gray-500 font-medium">
          Showing {filteredVehicles.length} of {vehicles.length} tracked vehicles (Live telemetry sync active)
        </div>
      </div>

      {/* Fleet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredVehicles.map((veh) => {
          const isSelected = currentVehicle?.id === veh.id;
          return (
            <div
              key={veh.id}
              onClick={() => setSelectedVehicleId(veh.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white border-[#2563A8] shadow-md ring-2 ring-blue-200'
                  : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-blue-600 text-white' : 'bg-blue-50 text-[#17365D]'}`}>
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono font-black text-xs text-[#17365D]">{veh.plate_number}</span>
                    <span className="text-[10px] text-gray-500 block">{veh.id} • {veh.vehicle_type}</span>
                  </div>
                </div>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    veh.status === 'IN_TRANSIT'
                      ? 'bg-emerald-100 text-emerald-800'
                      : veh.status === 'CRITICAL_FAST_TRACK'
                      ? 'bg-red-100 text-red-800 font-black animate-pulse'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {veh.status}
                </span>
              </div>

              <div className="mt-3 text-xs space-y-1">
                <div className="font-semibold text-gray-800 truncate">{veh.cargo_type} ({veh.cargo_weight_tons} MT)</div>
                <div className="text-[11px] text-gray-500">
                  {veh.origin?.split(' ')[0]} &rarr; {veh.destination?.split(' ')[0]} • ETA: <strong>{veh.eta_destination}</strong>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px]">
                <span className="text-gray-600 font-medium">
                  Speed: <strong className="text-emerald-700">{veh.speed_kmh} km/h</strong>
                </span>
                <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold text-gray-700">
                  {veh.network_mode?.split(' ')[0]} • ±2.4m
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Vehicle Diagnostics & Cold-Chain Panel */}
      {currentVehicle && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Manifest, Telemetry & Cold Chain Chart (7 cols) */}
          <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-[#D1D5DB] shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase">Detailed Telemetry Inspector</span>
                <h3 className="text-sm font-black text-[#1E3A5F]">
                  {currentVehicle.plate_number} — {currentVehicle.driver_name}
                </h3>
              </div>
              <button
                onClick={() => openDrawer('VEHICLE', currentVehicle)}
                className="text-xs font-bold text-[#2563A8] hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Full Manifest Drawer</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Cold Chain Real-Time Graph */}
            {currentVehicle.cold_chain ? (
              <div className="p-4 bg-[#F8FAFC] rounded-xl border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <Thermometer className="w-4 h-4 text-emerald-700" />
                    Cold-Chain Vaccine / Plasma Telemetry ({currentVehicle.cold_chain.sensor_id})
                  </span>
                  <span className="bg-emerald-600 text-white font-bold px-2 py-0.5 rounded text-[10px]">
                    Current: {currentVehicle.cold_chain.current_temp_c}°C
                  </span>
                </div>

                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={tempChartData}>
                      <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                      <YAxis domain={[0, 10]} stroke="#64748b" fontSize={10} />
                      <Tooltip />
                      <ReferenceLine y={2.0} stroke="#2563A8" strokeDasharray="3 3" label={{ value: 'Min 2°C', fontSize: 9 }} />
                      <ReferenceLine y={8.0} stroke="#9B1B1B" strokeDasharray="3 3" label={{ value: 'Max 8°C', fontSize: 9 }} />
                      <Line type="monotone" dataKey="temp" stroke="#0F6B6B" strokeWidth={2.5} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="text-[10px] text-gray-500 flex justify-between">
                  <span>Target Range: 2.0°C – 8.0°C (WHO Pharma Standard)</span>
                  <span className="text-emerald-700 font-bold">Door Tamper Lock: ENGAGED</span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl border border-gray-200 text-gray-600 space-y-1">
                <div className="font-bold text-gray-800">Standard Heavy Logistics Manifest</div>
                <div className="text-xs">Cargo: <strong>{currentVehicle.cargo_type}</strong> ({currentVehicle.cargo_weight_tons} MT)</div>
                <div className="text-[11px] text-gray-500">Origin: {currentVehicle.origin} &rarr; Destination: {currentVehicle.destination}</div>
              </div>
            )}

            {/* Fuel & Driver Safety Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between text-gray-600">
                  <span className="flex items-center gap-1 font-bold">
                    <Fuel className="w-3.5 h-3.5 text-blue-700" /> Fuel Tank Sensor
                  </span>
                  <span className="font-bold text-gray-900">{currentVehicle.fuel_monitor?.tank_level_pct || 72}%</span>
                </div>
                <div className="text-[10px] text-emerald-700 mt-1 font-semibold">
                  IQR Anomaly Detection: Normal (No Siphon Loss)
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between text-gray-600">
                  <span className="flex items-center gap-1 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Driver Safety Score
                  </span>
                  <span className="font-black text-sm text-[#1E3A5F]">{currentVehicle.driver_score || 90} / 100</span>
                </div>
                <div className="text-[10px] text-gray-500 mt-1">
                  Harsh Braking: 0 • Fatigue Compliance: 100%
                </div>
              </div>
            </div>
          </div>

          {/* Right: Historical Journey Playback Tool (5 cols) */}
          <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-[#D1D5DB] shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#1E3A5F] text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" /> Historical Trip Playback
              </h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsPlayingPlayback((p) => !p)}
                  className="bg-amber-100 hover:bg-amber-200 text-amber-900 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {isPlayingPlayback ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  <span>{isPlayingPlayback ? 'Pause' : 'Play Timeline'}</span>
                </button>
                <button
                  onClick={() => {
                    setIsPlayingPlayback(false);
                    setPlaybackIndex(0);
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-1 rounded cursor-pointer"
                  title="Reset Playback"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Scrubber slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold text-gray-700">
                <span>Waypoint {playbackIndex + 1} of {waypoints.length}</span>
                <span className="text-blue-700 font-mono">{currentWaypoint?.time || 'Live'}</span>
              </div>
              <input
                type="range"
                min="0"
                max={waypoints.length - 1}
                value={playbackIndex}
                onChange={(e) => {
                  setIsPlayingPlayback(false);
                  setPlaybackIndex(Number(e.target.value));
                }}
                className="w-full accent-[#1E3A5F] cursor-pointer"
              />
            </div>

            {/* Current Waypoint Details */}
            <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200 space-y-2">
              <div className="text-xs font-bold text-[#1E3A5F]">
                {currentWaypoint?.checkpoint || currentWaypoint?.location || 'Waypoint'}
              </div>
              <div className="text-[11px] text-gray-600">
                Event: <strong>{currentWaypoint?.event || 'Logged Telemetry'}</strong>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-600 pt-1 border-t border-blue-200">
                <div>Recorded Speed: <strong>{currentWaypoint?.speed ?? currentWaypoint?.speed_kmh ?? 45} km/h</strong></div>
                <div>Network Link: <strong>{currentWaypoint?.network || currentVehicle.network_mode}</strong></div>
                {currentWaypoint?.temp !== undefined && (
                  <div>Cold-Chain Temp: <strong className="text-emerald-700">{currentWaypoint.temp}°C</strong></div>
                )}
                <div>Fuel Tank: <strong>{currentWaypoint?.fuel_pct ?? 78}%</strong></div>
              </div>
            </div>

            {/* GST e-Way Bill Verified Badge */}
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2.5">
              <FileCheck className="w-5 h-5 text-emerald-700 shrink-0" />
              <div>
                <span className="font-bold text-emerald-950 block">
                  GSTN e-Way Bill: {currentVehicle.e_way_bill_no || 'EWB-NER-2026-89104'}
                </span>
                <span className="text-[10px] text-emerald-800">
                  Auto-linked to National Logistics Portal (NLP Marine/Highway)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
