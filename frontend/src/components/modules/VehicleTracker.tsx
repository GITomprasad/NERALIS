import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { useLanguage } from '../../context/LanguageContext';
import type { Vehicle } from '../../types';
import {
  Truck,
  Thermometer,
  Fuel,
  QrCode,
  FileCheck,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export const VehicleTracker: React.FC = () => {
  const { vehicles, openDrawer, addToast } = usePlatform();
  const { t } = useLanguage();

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(vehicles[0] || null);
  const [playbackIndex, setPlaybackIndex] = useState(2);
  const [qrCodeScanned, setQrCodeScanned] = useState(false);

  // Playback waypoints for selected truck
  const samplePlaybackWaypoints = [
    { time: '06:00 IST', location: 'Guwahati Central Logistics Hub', speed: 0, temp: 4.1, event: 'Dispatched with E-Way Bill' },
    { time: '07:30 IST', location: 'Jagiroad Checkpoint (NH-27)', speed: 56, temp: 4.2, event: 'QR Scan Check-in Passed' },
    { time: '09:15 IST', location: 'Nagaon Bypass Four-Lane', speed: 62, temp: 4.1, event: 'NavIC Satellite Ping Normal' },
    { time: '11:00 IST', location: 'Swagat Safe Rest Area (Jorhat)', speed: 0, temp: 4.2, event: 'Mandatory Driver Fatigue Break' },
    { time: '12:45 IST', location: 'Numaligarh Foothills Transition', speed: 38, temp: 4.3, event: 'Entering Mountainous Sector' },
    { time: '14:30 IST', location: 'Dimapur Border Checkpoint', speed: 44, temp: 4.2, event: 'Current Position Verified' }
  ];

  const handleSimulateQRScan = () => {
    setQrCodeScanned(true);
    addToast('QR Checkpoint Verified', 'Vehicle AS-01-GC-4921 arrival auto-logged at Dimapur Gateway.', 'SUCCESS');
    setTimeout(() => setQrCodeScanned(false), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="bg-white p-4 rounded-xl border border-[#D1D5DB] flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div>
          <h2 className="text-base font-black text-[#1E3A5F]">
            {t('module_3')} — Real-Time NavIC & Satellite Telemetry
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            End-to-end monitoring of essential medicine, food grain, and hazmat fleets with cold-chain safeguards
          </p>
        </div>

        {/* Action Button: QR Scanner */}
        <button
          onClick={handleSimulateQRScan}
          className="btn-secondary text-xs py-2 shadow-xs"
        >
          <QrCode className="w-4 h-4 text-emerald-700" />
          <span>{qrCodeScanned ? 'Checkpoint Verified ✓' : 'Scan Checkpoint QR'}</span>
        </button>
      </div>

      {/* Fleet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {vehicles.map((veh) => {
          const isSelected = selectedVehicle?.id === veh.id;
          return (
            <div
              key={veh.id}
              onClick={() => setSelectedVehicle(veh)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white border-[#2563A8] shadow-md ring-2 ring-blue-100'
                  : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center">
                    <Truck className="w-4 h-4 text-[#1E3A5F]" />
                  </div>
                  <div>
                    <span className="font-mono font-black text-xs text-[#1E3A5F]">{veh.plate_number}</span>
                    <span className="text-[10px] text-gray-500 block">{veh.vehicle_type}</span>
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
                <div className="font-semibold text-gray-800 truncate">{veh.cargo_type}</div>
                <div className="text-[11px] text-gray-500">
                  {veh.origin.split(' ')[0]} &rarr; {veh.destination.split(' ')[0]} • ETA: {veh.eta_destination}
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px]">
                <span className="text-gray-600 font-medium">
                  Speed: <strong>{veh.speed_kmh} km/h</strong>
                </span>
                <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold text-gray-700">
                  {veh.network_mode.split(' ')[0]}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Vehicle Diagnostics & Cold-Chain Panel */}
      {selectedVehicle && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Manifest, Telemetry & Cold Chain Chart (7 cols) */}
          <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-[#D1D5DB] shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase">Detailed Telemetry Inspector</span>
                <h3 className="text-sm font-black text-[#1E3A5F]">
                  {selectedVehicle.plate_number} — {selectedVehicle.driver_name}
                </h3>
              </div>
              <button
                onClick={() => openDrawer('VEHICLE', selectedVehicle)}
                className="text-xs font-bold text-[#2563A8] hover:underline"
              >
                Open Full Drawer &rarr;
              </button>
            </div>

            {/* Cold Chain Real-Time Graph (If cold-chain vehicle) */}
            {selectedVehicle.cold_chain ? (
              <div className="p-4 bg-[#F8FAFC] rounded-xl border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <Thermometer className="w-4 h-4 text-emerald-700" />
                    Cold-Chain Vaccine / Plasma Telemetry ({selectedVehicle.cold_chain.sensor_id})
                  </span>
                  <span className="bg-emerald-600 text-white font-bold px-2 py-0.5 rounded text-[10px]">
                    Current: {selectedVehicle.cold_chain.current_temp_c}°C
                  </span>
                </div>

                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { time: '10:00', temp: 4.1 },
                      { time: '10:30', temp: 4.2 },
                      { time: '11:00', temp: 4.3 },
                      { time: '11:30', temp: 4.1 },
                      { time: '12:00', temp: 4.2 },
                      { time: '12:30', temp: 4.4 },
                      { time: '13:00', temp: 4.2 },
                      { time: '13:30', temp: 4.2 }
                    ]}>
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
              <div className="p-4 bg-slate-50 rounded-xl border border-gray-200 text-gray-600">
                <div className="font-bold text-gray-800">Standard Freight Manifest</div>
                <div className="text-xs mt-1">Cargo: {selectedVehicle.cargo_type} ({selectedVehicle.cargo_weight_tons} MT)</div>
              </div>
            )}

            {/* Fuel & Driver Safety Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between text-gray-600">
                  <span className="flex items-center gap-1 font-bold">
                    <Fuel className="w-3.5 h-3.5 text-blue-700" /> Fuel Tank Sensor
                  </span>
                  <span className="font-bold text-gray-900">{selectedVehicle.fuel_monitor.tank_level_pct}%</span>
                </div>
                <div className="text-[10px] text-emerald-700 mt-1 font-semibold">
                  IQR Anomaly Algorithm: Normal (No Siphon Theft)
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between text-gray-600">
                  <span className="flex items-center gap-1 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Driver Safety Score
                  </span>
                  <span className="font-black text-sm text-[#1E3A5F]">{selectedVehicle.driver_score} / 100</span>
                </div>
                <div className="text-[10px] text-gray-500 mt-1">
                  Harsh Braking: 0 • High Speed Warning: 0
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
              <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[10px] font-bold">
                Logged GPS Waypoints
              </span>
            </div>

            {/* Scrubber slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold text-gray-700">
                <span>Waypoint {playbackIndex + 1} of {samplePlaybackWaypoints.length}</span>
                <span className="text-blue-700">{samplePlaybackWaypoints[playbackIndex].time}</span>
              </div>
              <input
                type="range"
                min="0"
                max={samplePlaybackWaypoints.length - 1}
                value={playbackIndex}
                onChange={(e) => setPlaybackIndex(Number(e.target.value))}
                className="w-full accent-[#1E3A5F]"
              />
            </div>

            {/* Current Waypoint Details */}
            <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-200 space-y-2">
              <div className="text-xs font-bold text-[#1E3A5F]">
                {samplePlaybackWaypoints[playbackIndex].location}
              </div>
              <div className="text-[11px] text-gray-600">
                Event: <strong>{samplePlaybackWaypoints[playbackIndex].event}</strong>
              </div>
              <div className="flex justify-between text-[10px] text-gray-500 pt-1 border-t border-blue-200">
                <span>Recorded Speed: {samplePlaybackWaypoints[playbackIndex].speed} km/h</span>
                <span>Cold Temp: {samplePlaybackWaypoints[playbackIndex].temp}°C</span>
              </div>
            </div>

            {/* GST e-Way Bill Verified Badge */}
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2.5">
              <FileCheck className="w-5 h-5 text-emerald-700 shrink-0" />
              <div>
                <span className="font-bold text-emerald-950 block">
                  GSTN e-Way Bill Active: {selectedVehicle.e_way_bill_no}
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
