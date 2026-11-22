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
        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[2999] transition-opacity duration-200"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-[#0D1522] shadow-2xl z-[3000] flex flex-col border-l border-[#1E2E45] animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="h-16 bg-[#111D2D] text-[#F5F7FA] px-5 flex items-center justify-between shrink-0 border-b border-[#1E2E45]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#080D16] border border-[#1E2E45] rounded-xl">
              {drawerType === 'DISTRICT' && <MapPin className="w-5 h-5 text-[#20C997]" />}
              {drawerType === 'CORRIDOR' && <Compass className="w-5 h-5 text-[#19C6D2]" />}
              {drawerType === 'BRIDGE' && <Activity className="w-5 h-5 text-[#FFB547]" />}
              {drawerType === 'VEHICLE' && <Truck className="w-5 h-5 text-[#818CF8]" />}
              {drawerType === 'ALERT' && <AlertTriangle className="w-5 h-5 text-[#FF5252]" />}
              {drawerType === 'REPORT' && <FileText className="w-5 h-5 text-[#20C997]" />}
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#19C6D2] uppercase tracking-wider block font-mono">
                {drawerType} INSPECTION
              </span>
              <h3 className="text-sm font-bold truncate max-w-[320px] text-[#F5F7FA]">
                {drawerData.name || drawerData.title || drawerData.plate_number || drawerData.id}
              </h3>
            </div>
          </div>
          <button
            onClick={closeDrawer}
            className="p-1.5 rounded-lg hover:bg-[#16253B] transition-colors text-[#94A3B8] hover:text-[#F5F7FA] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-[#94A3B8]">
          {/* Universal Provenance & Freshness Strip */}
          <div className="bg-[#111D2D] p-3.5 rounded-xl border border-[#1E2E45] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#64748B] uppercase flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[#19C6D2]" /> Source &amp; Data Freshness
              </span>
              <ProvenanceBadge
                status={drawerData.verification_status || 'OBSERVED'}
                confidence={drawerData.confidence || 98.7}
                dataItem={drawerData}
              />
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#94A3B8]">Source Agency:</span>
              <span className="font-bold text-[#F5F7FA]">{drawerData.source || 'SRC-IMD-AWS / ISRO Bhuvan'}</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#94A3B8]">Last Observed:</span>
              <span className="font-mono text-[#19C6D2] font-bold">{drawerData.observed_at || 'Live (15m sync)'}</span>
            </div>
            <button
              onClick={() => openProvenanceModal(drawerData)}
              className="w-full mt-1 py-1.5 px-3 rounded-lg bg-[#0D1522] hover:bg-[#16253B] border border-[#1E2E45] text-[#20C997] font-bold text-[10px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#20C997]" />
              <span>Inspect Cryptographic Audit Trail (SHA-256)</span>
            </button>
          </div>

          {/* DISTRICT VIEW */}
          {drawerType === 'DISTRICT' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#111D2D] p-3.5 rounded-xl border border-[#1E2E45]">
                  <span className="text-[10px] font-bold text-[#19C6D2] uppercase">Readiness Score</span>
                  <div className="text-2xl font-black text-[#F5F7FA] mt-1 font-mono">{drawerData.score} / 100</div>
                </div>
                <div className="bg-[#111D2D] p-3.5 rounded-xl border border-[#1E2E45]">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase">Terrain Profile</span>
                  <div className="text-sm font-bold text-[#F5F7FA] mt-1">{drawerData.terrain}</div>
                  <div className="text-[11px] text-[#94A3B8]">Elevation: {drawerData.elevation} m</div>
                </div>
              </div>

              <div className="space-y-2.5 border-t border-[#1E2E45] pt-3">
                <h4 className="font-bold text-[#19C6D2] text-xs uppercase">Health &amp; Supply Readiness</h4>
                <div className="flex justify-between py-1.5 border-b border-[#1E2E45]">
                  <span className="text-[#94A3B8]">Active Health Centers (PHCs):</span>
                  <span className="font-bold text-[#F5F7FA]">{drawerData.phc_count} Centers</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#1E2E45]">
                  <span className="text-[#94A3B8]">Critical Medicine Buffer Level:</span>
                  <span className={`font-bold ${drawerData.critical_stock_pct < 60 ? 'text-[#FF5252]' : 'text-[#20C997]'}`}>
                    {drawerData.critical_stock_pct}% Stocked
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#1E2E45]">
                  <span className="text-[#94A3B8]">Current Highway Status:</span>
                  <span className="font-bold text-[#F5F7FA]">{drawerData.status}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#94A3B8]">Monsoon Vulnerability:</span>
                  <span className="font-bold text-[#FFB547]">{drawerData.risk_level}</span>
                </div>
              </div>
            </div>
          )}

          {/* CORRIDOR VIEW */}
          {drawerType === 'CORRIDOR' && (
            <div className="space-y-4">
              <div className="bg-[#111D2D] p-3.5 rounded-xl border border-[#1E2E45] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase">Corridor ID</span>
                  <span className="font-mono font-bold bg-[#0D1522] border border-[#1E2E45] px-2 py-0.5 rounded text-xs text-[#19C6D2]">
                    {drawerData.id}
                  </span>
                </div>
                <div className="text-sm font-bold text-[#F5F7FA]">{drawerData.name}</div>
                <div className="text-xs text-[#94A3B8]">
                  Distance: {drawerData.distance_km} km • Avg Speed: {drawerData.avg_speed_kmh} km/h
                </div>
              </div>

              {/* Status History Timeline */}
              <div className="p-3.5 bg-[#111D2D] rounded-xl border border-[#1E2E45] space-y-2">
                <div className="text-[10px] font-bold text-[#19C6D2] uppercase flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-[#19C6D2]" /> Status Timeline History
                </div>
                <div className="space-y-2.5 text-[11px] border-l-2 border-[#1E2E45] pl-3 ml-1.5 mt-2">
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-[#19C6D2] absolute -left-[17px] top-1" />
                    <span className="font-bold text-[#F5F7FA]">Current Status: {drawerData.status}</span>
                    <p className="text-[10px] text-[#94A3B8]">{drawerData.hazard_type ? `Active condition: ${drawerData.hazard_type}` : 'All lanes passable under speed regulation.'}</p>
                  </div>
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-[#64748B] absolute -left-[17px] top-1" />
                    <span className="font-medium text-[#94A3B8]">06:00 IST — Routine Morning Patrol</span>
                    <p className="text-[10px] text-[#64748B]">Border Roads Organisation clearance verified.</p>
                  </div>
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-[#64748B] absolute -left-[17px] top-1" />
                    <span className="font-medium text-[#94A3B8]">Yesterday 18:30 IST — Weather Advisory</span>
                    <p className="text-[10px] text-[#64748B]">Precautionary heavy rain warning logged by IMD AWS.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-[#19C6D2] text-xs uppercase">Live Hazard &amp; Structural Limits</h4>
                <div className="p-3 bg-[#FFB547]/10 rounded-xl border border-[#FFB547]/30">
                  <div className="font-bold text-[#FFB547] text-xs">Active Hazard Warning:</div>
                  <div className="text-xs text-[#F5F7FA] mt-0.5">{drawerData.hazard_type || 'None reported'}</div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="p-2.5 bg-[#111D2D] rounded-xl border border-[#1E2E45] text-center">
                    <div className="text-[10px] text-[#64748B] uppercase">Max Height</div>
                    <div className="font-bold text-sm text-[#F5F7FA] font-mono">{drawerData.clearance_height_m} m</div>
                  </div>
                  <div className="p-2.5 bg-[#111D2D] rounded-xl border border-[#1E2E45] text-center">
                    <div className="text-[10px] text-[#64748B] uppercase">Weight Limit</div>
                    <div className="font-bold text-sm text-[#F5F7FA] font-mono">{drawerData.weight_limit_tons} Tons</div>
                  </div>
                </div>
              </div>

              {/* Status Control */}
              <div className="border-t border-[#1E2E45] pt-3">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[10px] font-bold text-[#64748B] uppercase">
                    Highway Status Control
                  </label>
                  {isAdminOrAuthority ? (
                    <span className="text-[9px] bg-[#19C6D2]/15 text-[#19C6D2] font-bold px-1.5 py-0.5 rounded border border-[#19C6D2]/30">
                      Authority Control
                    </span>
                  ) : (
                    <span className="text-[9px] bg-[#20C997]/15 text-[#20C997] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-[#20C997]/30">
                      👁️ Public View (Read-Only)
                    </span>
                  )}
                </div>

                {isAdminOrAuthority ? (
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => {
                        updateRoadStatus(drawerData.id, 'OPEN');
                        addToast('Corridor Status Updated', `${drawerData.name} updated to OPEN.`, 'SUCCESS');
                      }}
                      className="px-2 py-2 rounded-xl bg-[#20C997]/20 hover:bg-[#20C997]/30 text-[#20C997] border border-[#20C997]/40 font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      🟢 Open
                    </button>
                    <button
                      onClick={() => {
                        updateRoadStatus(drawerData.id, 'RESTRICTED');
                        addToast('Corridor Status Updated', `${drawerData.name} set to RESTRICTED.`, 'WARNING');
                      }}
                      className="px-2 py-2 rounded-xl bg-[#FFB547]/20 hover:bg-[#FFB547]/30 text-[#FFB547] border border-[#FFB547]/40 font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      🟡 Restricted
                    </button>
                    <button
                      onClick={() => {
                        updateRoadStatus(drawerData.id, 'CLOSED');
                        addToast('Corridor Closed', `${drawerData.name} CLOSED by Traffic Authority.`, 'DANGER');
                      }}
                      className="px-2 py-2 rounded-xl bg-[#FF5252]/20 hover:bg-[#FF5252]/30 text-[#FF5252] border border-[#FF5252]/40 font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      🔴 Closed
                    </button>
                  </div>
                ) : (
                  <div className="bg-[#111D2D] border border-[#1E2E45] rounded-xl p-2.5 text-[11px] text-[#94A3B8] space-y-1">
                    <div className="font-semibold text-[#F5F7FA]">
                      🔒 Traffic Authority Controlled
                    </div>
                    <p className="text-[10px] text-[#64748B] leading-relaxed">
                      Public citizens receive live status updates in real-time. Highway status modifications are restricted to verified State Traffic Authorities.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* BRIDGE VIEW */}
          {drawerType === 'BRIDGE' && (
            <div className="space-y-4">
              <div className="bg-[#111D2D] p-3.5 rounded-xl border border-[#1E2E45]">
                <span className="text-[10px] font-bold text-[#19C6D2] uppercase">Bridge Structural Health</span>
                <div className="text-2xl font-black text-[#20C997] mt-1 font-mono">{drawerData.structural_health_pct}%</div>
                <div className="text-[11px] text-[#94A3B8] mt-1">Crossing: {drawerData.river} River</div>
              </div>

              <div className="space-y-2 border-t border-[#1E2E45] pt-3">
                <h4 className="font-bold text-[#19C6D2] text-xs uppercase">Live IoT Sensor Telemetry</h4>
                <div className="flex justify-between py-1.5 border-b border-[#1E2E45]">
                  <span className="text-[#94A3B8]">Microstrain:</span>
                  <span className="font-mono font-bold text-[#FFB547]">{drawerData.strain_microstrain} με</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#1E2E45]">
                  <span className="text-[#94A3B8]">Vibration Frequency:</span>
                  <span className="font-mono font-bold text-[#F5F7FA]">{drawerData.vibration_hz} Hz</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#1E2E45]">
                  <span className="text-[#94A3B8]">Water Clearance to Girder:</span>
                  <span className="font-bold text-[#20C997]">{drawerData.water_clearance_m} m</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#1E2E45]">
                  <span className="text-[#94A3B8]">CCTV Stream Status:</span>
                  <span className="font-bold text-[#38BDF8]">{drawerData.cctv_status}</span>
                </div>
              </div>
            </div>
          )}

          {/* VEHICLE VIEW */}
          {drawerType === 'VEHICLE' && (
            <div className="space-y-4">
              <div className="bg-[#111D2D] p-3.5 rounded-xl border border-[#1E2E45]">
                <div className="flex justify-between">
                  <span className="font-mono font-black text-sm text-[#19C6D2]">{drawerData.plate_number}</span>
                  <span className="bg-[#20C997]/20 text-[#20C997] border border-[#20C997]/30 px-2 py-0.5 rounded text-[10px] font-bold font-mono">
                    {drawerData.network_mode}
                  </span>
                </div>
                <div className="text-xs font-semibold text-[#F5F7FA] mt-1">{drawerData.vehicle_type}</div>
                <div className="text-[11px] text-[#94A3B8]">Driver: {drawerData.driver_name} ({drawerData.driver_phone})</div>
              </div>

              {drawerData.cold_chain && (
                <div className="p-3 bg-[#0D1522] rounded-xl border border-[#20C997]/30">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#20C997] uppercase flex items-center gap-1.5">
                      <Thermometer className="w-3.5 h-3.5 text-[#20C997]" /> Cold Chain Telemetry
                    </span>
                    <span className="text-xs font-bold text-[#20C997] font-mono">{drawerData.cold_chain.current_temp_c}°C</span>
                  </div>
                  <div className="text-[11px] text-[#94A3B8] mt-1">Target Range: 2.0°C - 8.0°C • Tamper Door: Locked</div>
                </div>
              )}

              <div className="space-y-2 border-t border-[#1E2E45] pt-3">
                <h4 className="font-bold text-[#19C6D2] text-xs uppercase">Cargo &amp; Trip Manifest</h4>
                <div className="flex justify-between py-1.5 border-b border-[#1E2E45]">
                  <span className="text-[#94A3B8]">Cargo Type:</span>
                  <span className="font-bold text-[#F5F7FA]">{drawerData.cargo_type}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#1E2E45]">
                  <span className="text-[#94A3B8]">Weight:</span>
                  <span className="font-bold text-[#F5F7FA] font-mono">{drawerData.cargo_weight_tons} Tons</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#1E2E45]">
                  <span className="text-[#94A3B8]">GST e-Way Bill:</span>
                  <span className="font-mono font-bold text-[#38BDF8]">{drawerData.e_way_bill_no}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#94A3B8]">ETA Destination:</span>
                  <span className="font-bold text-[#20C997] font-mono">{drawerData.eta_destination}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-[#111D2D] border-t border-[#1E2E45] flex justify-end">
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
