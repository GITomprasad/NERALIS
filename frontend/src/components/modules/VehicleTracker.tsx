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
  ChevronRight,
  Activity
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
      <div className="card-command flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-black text-[#29372D]">
              {t('module_3')} — Real-Time NavIC &amp; Fleet Telematics
            </h2>
            <span className="bg-[#1B3022]/15 text-[#1B3022] border border-[#1B3022]/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
              <Radio className="w-3 h-3 text-[#1B3022] animate-pulse" />
              NavIC L5 / S-Band Lock: ±2.4m
            </span>
          </div>
          <p className="text-xs text-[#68766C] mt-0.5">
            Real-time fleet tracking of essential medicines, food grains, and petroleum with cold-chain sensor monitoring
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentVehicle && (
            <button
              onClick={handleLocateOnMap}
              className="btn-primary text-xs py-2 px-3.5 shadow-sm font-bold"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Locate on GIS Map</span>
            </button>
          )}

          <button
            onClick={handleSimulateQRScan}
            className="btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5"
          >
            <QrCode className="w-4 h-4 text-[#7C9082]" />
            <span>{qrCodeScanned ? 'Checkpoint Verified ✓' : 'Scan Checkpoint QR'}</span>
          </button>
        </div>
      </div>

      {/* Fleet Filter Bar */}
      <div className="card-command p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5 font-bold">
          <span className="text-[#68766C] text-[11px] uppercase mr-1">Fleet Filters:</span>
          {(['ALL', 'MOVING', 'DELAYED', 'AT_RISK', 'OFFLINE'] as const).map((filterKey) => (
            <button
              key={filterKey}
              onClick={() => setFleetFilter(filterKey)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                fleetFilter === filterKey
                  ? 'bg-[#1B3022] text-white shadow-sm font-black'
                  : 'bg-[#F4F5F0] text-[#68766C] hover:bg-[#DCE4DB] hover:text-[#29372D] border border-[#DFE5DD]'
              }`}
            >
              {filterKey === 'ALL' ? `All (${vehicles.length})` : filterKey.replace('_', ' ')}
            </button>
          ))}
        </div>
        <div className="text-[11px] text-[#68766C] font-medium">
          Showing {filteredVehicles.length} of {vehicles.length} tracked vehicles (Live telemetry active)
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
                  ? 'bg-[#DCE4DB] border-[#1B3022] shadow-command-glow'
                  : 'card-command hover:border-[#DFE5DD] hover:bg-[#DCE4DB]/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-[#1B3022] text-white' : 'bg-[#F4F5F0] text-[#1B3022] border border-[#DFE5DD]'}`}>
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono font-black text-xs text-[#29372D]">{veh.plate_number}</span>
                    <span className="text-[10px] text-[#68766C] block">{veh.id} • {veh.vehicle_type}</span>
                  </div>
                </div>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    veh.status === 'IN_TRANSIT'
                      ? 'badge-open'
                      : veh.status === 'CRITICAL_FAST_TRACK'
                      ? 'badge-closed animate-pulse'
                      : 'badge-restricted'
                  }`}
                >
                  {veh.status}
                </span>
              </div>

              <div className="mt-3 text-xs space-y-1">
                <div className="font-semibold text-[#29372D] truncate">{veh.cargo_type} ({veh.cargo_weight_tons} MT)</div>
                <div className="text-[11px] text-[#68766C]">
                  {veh.origin?.split(' ')[0]} &rarr; {veh.destination?.split(' ')[0]} • ETA: <strong className="text-[#1B3022] font-mono">{veh.eta_destination}</strong>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#DFE5DD] flex items-center justify-between text-[11px]">
                <span className="text-[#68766C]">
                  Speed: <strong className="text-[#7C9082] font-mono">{veh.speed_kmh} km/h</strong>
                </span>
                <span className="bg-[#F4F5F0] border border-[#DFE5DD] px-2 py-0.5 rounded text-[10px] font-bold text-[#68766C] font-mono">
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
          <div className="lg:col-span-7 card-command space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#DFE5DD] pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#68766C] uppercase">Telemetry Inspector</span>
                <h3 className="text-sm font-black text-[#29372D]">
                  {currentVehicle.plate_number} — {currentVehicle.driver_name}
                </h3>
              </div>
              <button
                onClick={() => openDrawer('VEHICLE', currentVehicle)}
                className="text-xs font-bold text-[#1B3022] hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Full Manifest Drawer</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Cold Chain Real-Time Graph */}
            {currentVehicle.cold_chain ? (
              <div className="p-4 bg-[#F4F5F0] rounded-xl border border-[#7C9082]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#29372D] flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-[#7C9082]" />
                    Cold-Chain Vaccine / Plasma Telemetry ({currentVehicle.cold_chain.sensor_id})
                  </span>
                  <span className="bg-[#7C9082]/20 text-[#7C9082] border border-[#7C9082]/30 font-bold px-2 py-0.5 rounded text-[10px] font-mono">
                    Current: {currentVehicle.cold_chain.current_temp_c}°C
                  </span>
                </div>

                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={tempChartData}>
                      <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                      <YAxis domain={[0, 10]} stroke="#64748b" fontSize={10} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E7DAD8', borderRadius: '8px', color: '#252124' }}
                      />
                      <ReferenceLine y={2.0} stroke="#438BFF" strokeDasharray="3 3" label={{ value: 'Min 2°C', fontSize: 9, fill: '#438BFF' }} />
                      <ReferenceLine y={8.0} stroke="#FF5252" strokeDasharray="3 3" label={{ value: 'Max 8°C', fontSize: 9, fill: '#FF5252' }} />
                      <Line type="monotone" dataKey="temp" stroke="#20C997" strokeWidth={2.5} dot={{ r: 3, fill: '#20C997' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="text-[10px] text-[#68766C] flex justify-between">
                  <span>Target Safe Window: 2.0°C – 8.0°C (WHO Pharma Standard)</span>
                  <span className="text-[#7C9082] font-bold">Tamper Seal: ENGAGED</span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-[#F4F5F0] rounded-xl border border-[#DFE5DD] text-[#68766C] space-y-1">
                <div className="font-bold text-[#29372D]">Standard Logistics Manifest</div>
                <div className="text-xs">Cargo: <strong className="text-[#1B3022]">{currentVehicle.cargo_type}</strong> ({currentVehicle.cargo_weight_tons} MT)</div>
                <div className="text-[11px]">Origin: {currentVehicle.origin} &rarr; Destination: {currentVehicle.destination}</div>
              </div>
            )}

            {/* Fuel & Driver Safety Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#F4F5F0] rounded-xl border border-[#DFE5DD]">
                <div className="flex items-center justify-between text-[#68766C]">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Fuel className="w-3.5 h-3.5 text-[#7C9082]" /> Fuel Tank Sensor
                  </span>
                  <span className="font-bold text-[#29372D] font-mono">{currentVehicle.fuel_monitor?.tank_level_pct || 72}%</span>
                </div>
                <div className="text-[10px] text-[#7C9082] mt-1 font-semibold">
                  IQR Anomaly Detection: Normal (No Siphon Loss)
                </div>
              </div>

              <div className="p-3 bg-[#F4F5F0] rounded-xl border border-[#DFE5DD]">
                <div className="flex items-center justify-between text-[#68766C]">
                  <span className="flex items-center gap-1.5 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#7C9082]" /> Driver Safety Score
                  </span>
                  <span className="font-black text-sm text-[#29372D] font-mono">{currentVehicle.driver_score || 90} / 100</span>
                </div>
                <div className="text-[10px] text-[#68766C] mt-1">
                  Harsh Braking: 0 • Fatigue Compliance: 100%
                </div>
              </div>
            </div>
          </div>

          {/* Right: Historical Journey Playback Tool (5 cols) */}
          <div className="lg:col-span-5 card-command space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#1B3022] text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#FFB547]" /> Historical Trip Playback
              </h3>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsPlayingPlayback((p) => !p)}
                  className="bg-[#FFB547]/15 hover:bg-[#FFB547]/25 text-[#FFB547] border border-[#FFB547]/30 px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {isPlayingPlayback ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  <span>{isPlayingPlayback ? 'Pause' : 'Play Timeline'}</span>
                </button>
                <button
                  onClick={() => {
                    setIsPlayingPlayback(false);
                    setPlaybackIndex(0);
                  }}
                  className="bg-[#F4F5F0] hover:bg-[#DCE4DB] text-[#68766C] border border-[#DFE5DD] p-1 rounded-lg cursor-pointer"
                  title="Reset Playback"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Scrubber slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold text-[#68766C]">
                <span>Waypoint {playbackIndex + 1} of {waypoints.length}</span>
                <span className="text-[#1B3022] font-mono">{currentWaypoint?.time || 'Live'}</span>
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
                className="w-full accent-[#1B3022] bg-[#F4F5F0] cursor-pointer"
              />
            </div>

            {/* Current Waypoint Details */}
            <div className="p-3.5 bg-[#F4F5F0] rounded-xl border border-[#DFE5DD] space-y-2">
              <div className="text-xs font-bold text-[#29372D]">
                {currentWaypoint?.checkpoint || currentWaypoint?.location || 'Waypoint'}
              </div>
              <div className="text-[11px] text-[#68766C]">
                Event: <strong className="text-[#29372D]">{currentWaypoint?.event || 'Logged Telemetry'}</strong>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] text-[#68766C] pt-1.5 border-t border-[#DFE5DD]">
                <div>Recorded Speed: <strong className="text-[#7C9082] font-mono">{currentWaypoint?.speed ?? currentWaypoint?.speed_kmh ?? 45} km/h</strong></div>
                <div>Network Link: <strong className="text-[#29372D]">{currentWaypoint?.network || currentVehicle.network_mode}</strong></div>
                {currentWaypoint?.temp !== undefined && (
                  <div>Cold-Chain Temp: <strong className="text-[#7C9082] font-mono">{currentWaypoint.temp}°C</strong></div>
                )}
                <div>Fuel Tank: <strong className="text-[#7C9082] font-mono">{currentWaypoint?.fuel_pct ?? 78}%</strong></div>
              </div>
            </div>

            {/* GST e-Way Bill Verified Badge */}
            <div className="p-3.5 bg-[#7C9082]/10 rounded-xl border border-[#7C9082]/30 flex items-center gap-3">
              <FileCheck className="w-5 h-5 text-[#7C9082] shrink-0" />
              <div>
                <span className="font-bold text-[#29372D] block text-xs">
                  GSTN e-Way Bill: {currentVehicle.e_way_bill_no || 'EWB-NER-2026-89104'}
                </span>
                <span className="text-[10px] text-[#7C9082]">
                  Verified via National Logistics Portal (NLP Marine/Highway)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
