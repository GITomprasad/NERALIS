import React from 'react';
import { usePlatform } from '../../context/PlatformContext';
import {
  X,
  MapPin,
  Truck,
  Activity,
  AlertTriangle,
  FileText,
  Shield,
  Clock,
  Thermometer,
  Fuel,
  Compass,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Database,
  History,
  CheckCircle2
} from 'lucide-react';
import { ProvenanceBadge } from '../common/ProvenanceBadge';

export const InfoDrawer: React.FC = () => {
  const {
    isDrawerOpen,
    drawerType,
    drawerData,
    closeDrawer,
    updateRoadStatus,
    openProvenanceModal,
    isAdminOrAuthority,
    addToast
  } = usePlatform();

  if (!isDrawerOpen || !drawerData) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="fixed inset-0 bg-black/30 backdrop-blur-xs z-[1999] transition-opacity duration-200"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white shadow-2xl z-[2000] flex flex-col border-l border-[#D1D5DB] animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="h-16 bg-[#1E3A5F] text-white px-5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-white/10 rounded-lg">
            {drawerType === 'DISTRICT' && <MapPin className="w-5 h-5 text-emerald-400" />}
            {drawerType === 'CORRIDOR' && <Compass className="w-5 h-5 text-sky-400" />}
            {drawerType === 'BRIDGE' && <Activity className="w-5 h-5 text-amber-400" />}
            {drawerType === 'VEHICLE' && <Truck className="w-5 h-5 text-indigo-400" />}
            {drawerType === 'ALERT' && <AlertTriangle className="w-5 h-5 text-red-400" />}
            {drawerType === 'REPORT' && <FileText className="w-5 h-5 text-teal-400" />}
          </div>
          <div>
            <span className="text-[10px] font-bold text-sky-300 uppercase tracking-wider block">
              {drawerType} INSPECTION
            </span>
            <h3 className="text-sm font-bold truncate max-w-[320px]">
              {drawerData.name || drawerData.title || drawerData.plate_number || drawerData.id}
            </h3>
          </div>
        </div>
        <button
          onClick={closeDrawer}
          className="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-white/80 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-[#374151]">
        {/* Universal Provenance & Freshness Strip */}
        <div className="bg-slate-50 p-3 rounded-xl border border-gray-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-blue-600" /> Source & Data Freshness
            </span>
            <ProvenanceBadge
              status={drawerData.verification_status || 'OBSERVED'}
              confidence={drawerData.confidence || 98.4}
              dataItem={drawerData}
            />
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-gray-600 font-medium">Source Agency:</span>
            <span className="font-bold text-gray-900">{drawerData.source || 'SRC-IMD-AWS / ISRO Bhuvan'}</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-gray-600 font-medium">Last Observed:</span>
            <span className="font-mono text-gray-700 font-bold">{drawerData.observed_at || 'Live (15m sync)'}</span>
          </div>
          <button
            onClick={() => openProvenanceModal(drawerData)}
            className="w-full mt-1 py-1 px-2 rounded bg-white hover:bg-gray-100 border border-gray-200 text-teal-700 font-bold text-[10px] flex items-center justify-center gap-1 transition-colors"
          >
            <ShieldCheck className="w-3 h-3 text-teal-600" />
            <span>Inspect Cryptographic Audit Trail (SHA-256)</span>
          </button>
        </div>

        {/* DISTRICT VIEW */}
        {drawerType === 'DISTRICT' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#EBF3FB] p-3 rounded-lg border border-blue-200">
                <span className="text-[10px] font-bold text-blue-800 uppercase">Accessibility Score</span>
                <div className="text-2xl font-black text-[#1E3A5F] mt-1">{drawerData.score} / 100</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-gray-200">
                <span className="text-[10px] font-bold text-gray-600 uppercase">Terrain Profile</span>
                <div className="text-sm font-bold text-gray-900 mt-1">{drawerData.terrain}</div>
                <div className="text-[11px] text-gray-500">Elevation: {drawerData.elevation} m</div>
              </div>
            </div>

            <div className="space-y-2 border-t pt-3">
              <h4 className="font-bold text-[#1E3A5F] text-xs uppercase">Health & Supply Readiness</h4>
              <div className="flex justify-between py-1.5 border-b">
                <span className="text-gray-600">Active Primary Health Centers (PHCs):</span>
                <span className="font-bold">{drawerData.phc_count} Centers</span>
              </div>
              <div className="flex justify-between py-1.5 border-b">
                <span className="text-gray-600">Critical Medicine Buffer Level:</span>
                <span className={`font-bold ${drawerData.critical_stock_pct < 60 ? 'text-red-600' : 'text-emerald-700'}`}>
                  {drawerData.critical_stock_pct}% Stocked
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b">
                <span className="text-gray-600">Current Road Status:</span>
                <span className="font-bold">{drawerData.status}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-600">Monsoon Vulnerability:</span>
                <span className="font-bold text-amber-700">{drawerData.risk_level}</span>
              </div>
            </div>
          </div>
        )}

        {/* CORRIDOR VIEW */}
        {drawerType === 'CORRIDOR' && (
          <div className="space-y-4">
            <div className="bg-slate-50 p-3.5 rounded-lg border border-gray-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Corridor ID</span>
                <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border text-xs">{drawerData.id}</span>
              </div>
              <div className="text-sm font-bold text-[#1E3A5F]">{drawerData.name}</div>
              <div className="text-xs text-gray-600">Distance: {drawerData.distance_km} km • Avg Speed: {drawerData.avg_speed_kmh} km/h</div>
            </div>

            {/* Status History Timeline (Section 6 & 11) */}
            <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-2">
              <div className="text-[10px] font-bold text-[#1E3A5F] uppercase flex items-center gap-1">
                <History className="w-3.5 h-3.5 text-blue-600" /> Road Status Timeline History
              </div>
              <div className="space-y-2 text-[11px] border-l-2 border-blue-200 pl-3 ml-1.5 mt-2">
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-blue-600 absolute -left-[17px] top-1" />
                  <span className="font-bold text-gray-900">Current Status: {drawerData.status}</span>
                  <p className="text-[10px] text-gray-500">{drawerData.hazard_type ? `Active condition: ${drawerData.hazard_type}` : 'All lanes passable under speed regulation.'}</p>
                </div>
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-gray-300 absolute -left-[17px] top-1" />
                  <span className="font-medium text-gray-700">06:00 IST — Routine Morning Patrol</span>
                  <p className="text-[10px] text-gray-500">Border Roads Organisation clearance verified.</p>
                </div>
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-gray-300 absolute -left-[17px] top-1" />
                  <span className="font-medium text-gray-700">Yesterday 18:30 IST — Weather Advisory</span>
                  <p className="text-[10px] text-gray-500">Precautionary heavy rain warning logged by IMD AWS.</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-[#1E3A5F] text-xs uppercase">Live Hazard & Structural Limits</h4>
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <div className="font-bold text-amber-900 text-xs">Active Hazard Warning:</div>
                <div className="text-xs text-amber-800 mt-0.5">{drawerData.hazard_type || 'None reported'}</div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="p-2.5 bg-gray-50 rounded border text-center">
                  <div className="text-[10px] text-gray-500 uppercase">Max Height</div>
                  <div className="font-bold text-sm text-gray-900">{drawerData.clearance_height_m} m</div>
                </div>
                <div className="p-2.5 bg-gray-50 rounded border text-center">
                  <div className="text-[10px] text-gray-500 uppercase">Weight Limit</div>
                  <div className="font-bold text-sm text-gray-900">{drawerData.weight_limit_tons} Tons</div>
                </div>
              </div>
            </div>

            {/* Quick Status Override */}
            <div className="border-t pt-3">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[10px] font-bold text-gray-500 uppercase">
                  Highway Status Control
                </label>
                {isAdminOrAuthority ? (
                  <span className="text-[9px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">
                    Authority Control Active
                  </span>
                ) : (
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    👁️ Public View (Read-Only)
                  </span>
                )}
              </div>

              {isAdminOrAuthority ? (
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => {
                      updateRoadStatus(drawerData.id, 'OPEN');
                      addToast('Corridor Status Updated', `${drawerData.name} updated to OPEN by Traffic Authority.`, 'SUCCESS');
                    }}
                    className="px-2 py-1.5 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-[11px] transition-colors"
                  >
                    🟢 Open
                  </button>
                  <button
                    onClick={() => {
                      updateRoadStatus(drawerData.id, 'RESTRICTED');
                      addToast('Corridor Status Updated', `${drawerData.name} set to RESTRICTED (Hazard Flow).`, 'WARNING');
                    }}
                    className="px-2 py-1.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold text-[11px] transition-colors"
                  >
                    🟡 Restricted
                  </button>
                  <button
                    onClick={() => {
                      updateRoadStatus(drawerData.id, 'CLOSED');
                      addToast('Corridor Closed', `${drawerData.name} CLOSED by Traffic Authority.`, 'DANGER');
                    }}
                    className="px-2 py-1.5 rounded bg-red-100 hover:bg-red-200 text-red-800 font-bold text-[11px] transition-colors"
                  >
                    🔴 Closed
                  </button>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[11px] text-slate-600 space-y-1">
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <span>🔒 Traffic Authority Controlled</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-snug">
                    Public citizens and travelers receive live highway status updates in real-time. Highway status modifications are restricted to verified State Traffic & Disaster Authorities.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* BRIDGE VIEW */}
        {drawerType === 'BRIDGE' && (
          <div className="space-y-4">
            <div className="bg-[#EBF3FB] p-3.5 rounded-lg border border-blue-200">
              <span className="text-[10px] font-bold text-blue-800 uppercase">Bridge Structural Health</span>
              <div className="text-2xl font-black text-[#1E3A5F] mt-1">{drawerData.structural_health_pct}%</div>
              <div className="text-[11px] text-gray-600 mt-1">Crossing: {drawerData.river} River</div>
            </div>

            <div className="space-y-2 border-t pt-3">
              <h4 className="font-bold text-[#1E3A5F] text-xs uppercase">Live IoT Sensor Telemetry</h4>
              <div className="flex justify-between py-1.5 border-b">
                <span className="text-gray-600">Microstrain:</span>
                <span className="font-mono font-bold">{drawerData.strain_microstrain} με</span>
              </div>
              <div className="flex justify-between py-1.5 border-b">
                <span className="text-gray-600">Vibration Frequency:</span>
                <span className="font-mono font-bold">{drawerData.vibration_hz} Hz</span>
              </div>
              <div className="flex justify-between py-1.5 border-b">
                <span className="text-gray-600">Water Clearance to Girder:</span>
                <span className="font-bold text-emerald-700">{drawerData.water_clearance_m} m</span>
              </div>
              <div className="flex justify-between py-1.5 border-b">
                <span className="text-gray-600">CCTV Stream Status:</span>
                <span className="font-bold text-blue-700">{drawerData.cctv_status}</span>
              </div>
            </div>
          </div>
        )}

        {/* VEHICLE VIEW */}
        {drawerType === 'VEHICLE' && (
          <div className="space-y-4">
            <div className="bg-[#EBF3FB] p-3.5 rounded-lg border border-blue-200">
              <div className="flex justify-between">
                <span className="font-mono font-black text-sm text-[#1E3A5F]">{drawerData.plate_number}</span>
                <span className="bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px] font-bold">{drawerData.network_mode}</span>
              </div>
              <div className="text-xs font-semibold text-gray-800 mt-1">{drawerData.vehicle_type}</div>
              <div className="text-[11px] text-gray-600">Driver: {drawerData.driver_name} ({drawerData.driver_phone})</div>
            </div>

            {drawerData.cold_chain && (
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-900 uppercase flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5" /> Cold Chain Telemetry
                  </span>
                  <span className="text-xs font-bold text-emerald-800">{drawerData.cold_chain.current_temp_c}°C</span>
                </div>
                <div className="text-[11px] text-emerald-700 mt-1">Target Range: 2.0°C - 8.0°C • Tamper Door: Locked</div>
              </div>
            )}

            <div className="space-y-2 border-t pt-3">
              <h4 className="font-bold text-[#1E3A5F] text-xs uppercase">Cargo & Trip Manifest</h4>
              <div className="flex justify-between py-1.5 border-b">
                <span className="text-gray-600">Cargo Type:</span>
                <span className="font-bold text-gray-900">{drawerData.cargo_type}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b">
                <span className="text-gray-600">Weight:</span>
                <span className="font-bold">{drawerData.cargo_weight_tons} Tons</span>
              </div>
              <div className="flex justify-between py-1.5 border-b">
                <span className="text-gray-600">GST e-Way Bill:</span>
                <span className="font-mono font-bold text-blue-700">{drawerData.e_way_bill_no}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-600">ETA Destination:</span>
                <span className="font-bold text-emerald-700">{drawerData.eta_destination}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Drawer Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
        <button
          onClick={closeDrawer}
          className="btn-secondary text-xs"
        >
          Close Drawer
        </button>
      </div>
    </div>
    </>
  );
};
