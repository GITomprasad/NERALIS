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
            <h2 className="text-base font-black text-[#102A43]">
              {t('module_3')} — Real-Time NavIC &amp; Fleet Telematics
            </h2>
            <span className="bg-[#F58220]/15 text-[#F58220] border border-[#F58220]/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
              <Radio className="w-3 h-3 text-[#F58220] animate-pulse" />
              NavIC L5 / S-Band Lock: ±2.4m
            </span>
          </div>
          <p className="text-xs text-[#627D98] mt-0.5">
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
            <QrCode className="w-4 h-4 text-[#2477C8]" />
            <span>{qrCodeScanned ? 'Checkpoint Verified ✓' : 'Scan Checkpoint QR'}</span>
          </button>
        </div>
      </div>

      {/* Fleet Filter Bar */}
      <div className="card-command p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5 font-bold">
          <span className="text-[#627D98] text-[11px] uppercase mr-1">Fleet Filters:</span>
          {(['ALL', 'MOVING', 'DELAYED', 'AT_RISK', 'OFFLINE'] as const).map((filterKey) => (
            <button
              key={filterKey}
              onClick={() => setFleetFilter(filterKey)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                fleetFilter === filterKey
                  ? 'bg-[#F58220] text-white shadow-sm font-black'
                  : 'bg-[#F5F8FC] text-[#627D98] hover:bg-[#EBF2FA] hover:text-[#102A43] border border-[#D9E2EC]'
              }`}
            >
              {filterKey === 'ALL' ? `All (${vehicles.length})` : filterKey.replace('_', ' ')}
            </button>
          ))}
        </div>
        <div className="text-[11px] text-[#627D98] font-medium">
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
                  ? 'bg-[#EBF2FA] border-[#F58220] shadow-command-glow'
                  : 'card-command hover:border-[#D9E2EC] hover:bg-[#EBF2FA]/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-[#F58220] text-white' : 'bg-[#F5F8FC] text-[#F58220] border border-[#D9E2EC]'}`}>
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono font-black text-xs text-[#102A43]">{veh.plate_number}</span>
                    <span className="text-[10px] text-[#627D98] block">{veh.id} • {veh.vehicle_type}</span>
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
                <div className="font-semibold text-[#102A43] truncate">{veh.cargo_type} ({veh.cargo_weight_tons} MT)</div>
                <div className="text-[11px] text-[#627D98]">
                  {veh.origin?.split(' ')[0]} &rarr; {veh.destination?.split(' ')[0]} • ETA: <strong className="text-[#F58220] font-mono">{veh.eta_destination}</strong>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#D9E2EC] flex items-center justify-between text-[11px]">
                <span className="text-[#627D98]">
                  Speed: <strong className="text-[#2477C8] font-mono">{veh.speed_kmh} km/h</strong>
                </span>
                <span className="bg-[#F5F8FC] border border-[#D9E2EC] px-2 py-0.5 rounded text-[10px] font-bold text-[#627D98] font-mono">
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
            <div className="flex items-center justify-between border-b border-[#D9E2EC] pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#627D98] uppercase">Telemetry Inspector</span>
                <h3 className="text-sm font-black text-[#102A43]">
                  {currentVehicle.plate_number} — {currentVehicle.driver_name}
                </h3>
              </div>
              <button
                onClick={() => openDrawer('VEHICLE', currentVehicle)}
                className="text-xs font-bold text-[#F58220] hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Full Manifest Drawer</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Cold Chain Real-Time Graph */}
            {currentVehicle.cold_chain ? (
              <div className="p-4 bg-[#F5F8FC] rounded-xl border border-[#2477C8]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#102A43] flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-[#2477C8]" />
                    Cold-Chain Vaccine / Plasma Telemetry ({currentVehicle.cold_chain.sensor_id})
                  </span>
                  <span className="bg-[#2477C8]/20 text-[#2477C8] border border-[#2477C8]/30 font-bold px-2 py-0.5 rounded text-[10px] font-mono">
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

                <div className="text-[10px] text-[#627D98] flex justify-between">
                  <span>Target Safe Window: 2.0°C – 8.0°C (WHO Pharma Standard)</span>
                  <span className="text-[#2477C8] font-bold">Tamper Seal: ENGAGED</span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-[#F5F8FC] rounded-xl border border-[#D9E2EC] text-[#627D98] space-y-1">
                <div className="font-bold text-[#102A43]">Standard Logistics Manifest</div>
                <div className="text-xs">Cargo: <strong className="text-[#F58220]">{currentVehicle.cargo_type}</strong> ({currentVehicle.cargo_weight_tons} MT)</div>
                <div className="text-[11px]">Origin: {currentVehicle.origin} &rarr; Destination: {currentVehicle.destination}</div>
              </div>
            )}

            {/* Fuel & Driver Safety Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#F5F8FC] rounded-xl border border-[#D9E2EC]">
                <div className="flex items-center justify-between text-[#627D98]">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Fuel className="w-3.5 h-3.5 text-[#2477C8]" /> Fuel Tank Sensor
                  </span>
                  <span className="font-bold text-[#102A43] font-mono">{currentVehicle.fuel_monitor?.tank_level_pct || 72}%</span>
                </div>
                <div className="text-[10px] text-[#2477C8] mt-1 font-semibold">
                  IQR Anomaly Detection: Normal (No Siphon Loss)
                </div>
              </div>

              <div className="p-3 bg-[#F5F8FC] rounded-xl border border-[#D9E2EC]">
                <div className="flex items-center justify-between text-[#627D98]">
                  <span className="flex items-center gap-1.5 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2477C8]" /> Driver Safety Score
                  </span>
                  <span className="font-black text-sm text-[#102A43] font-mono">{currentVehicle.driver_score || 90} / 100</span>
                </div>
                <div className="text-[10px] text-[#627D98] mt-1">
                  Harsh Braking: 0 • Fatigue Compliance: 100%
                </div>
              </div>
            </div>
          </div>

          {/* Right: Historical Journey Playback Tool (5 cols) */}
          <div className="lg:col-span-5 card-command space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#F58220] text-xs uppercase tracking-wider flex items-center gap-1.5">
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
                  className="bg-[#F5F8FC] hover:bg-[#EBF2FA] text-[#627D98] border border-[#D9E2EC] p-1 rounded-lg cursor-pointer"
                  title="Reset Playback"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Scrubber slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold text-[#627D98]">
                <span>Waypoint {playbackIndex + 1} of {waypoints.length}</span>
                <span className="text-[#F58220] font-mono">{currentWaypoint?.time || 'Live'}</span>
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
                className="w-full accent-[#F58220] bg-[#F5F8FC] cursor-pointer"
              />
            </div>

            {/* Current Waypoint Details */}
            <div className="p-3.5 bg-[#F5F8FC] rounded-xl border border-[#D9E2EC] space-y-2">
              <div className="text-xs font-bold text-[#102A43]">
                {currentWaypoint?.checkpoint || currentWaypoint?.location || 'Waypoint'}
              </div>
              <div className="text-[11px] text-[#627D98]">
                Event: <strong className="text-[#102A43]">{currentWaypoint?.event || 'Logged Telemetry'}</strong>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] text-[#627D98] pt-1.5 border-t border-[#D9E2EC]">
                <div>Recorded Speed: <strong className="text-[#2477C8] font-mono">{currentWaypoint?.speed ?? currentWaypoint?.speed_kmh ?? 45} km/h</strong></div>
                <div>Network Link: <strong className="text-[#102A43]">{currentWaypoint?.network || currentVehicle.network_mode}</strong></div>
                {currentWaypoint?.temp !== undefined && (
                  <div>Cold-Chain Temp: <strong className="text-[#2477C8] font-mono">{currentWaypoint.temp}°C</strong></div>
                )}
                <div>Fuel Tank: <strong className="text-[#2477C8] font-mono">{currentWaypoint?.fuel_pct ?? 78}%</strong></div>
              </div>
            </div>

            {/* GST e-Way Bill Verified Badge */}
            <div className="p-3.5 bg-[#2477C8]/10 rounded-xl border border-[#2477C8]/30 flex items-center gap-3">
              <FileCheck className="w-5 h-5 text-[#2477C8] shrink-0" />
              <div>
                <span className="font-bold text-[#102A43] block text-xs">
                  GSTN e-Way Bill: {currentVehicle.e_way_bill_no || 'EWB-NER-2026-89104'}
                </span>
                <span className="text-[10px] text-[#2477C8]">
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
