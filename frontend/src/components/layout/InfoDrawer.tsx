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
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[2999] transition-opacity duration-200"
      />

      {/* Drawer Panel (White Surface, Cherry Accent Header) */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-[#FFFFFF] shadow-2xl z-[3000] flex flex-col border-l border-[#DFE5DD] animate-in slide-in-from-right duration-200 text-[#29372D]">
        {/* Drawer Header */}
        <div className="h-16 bg-[#F4F5F0] text-[#29372D] px-5 flex items-center justify-between shrink-0 border-b border-[#DFE5DD]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#DCE4DB] border border-[#DFE5DD] rounded-xl">
              {drawerType === 'DISTRICT' && <MapPin className="w-5 h-5 text-[#1B3022]" />}
              {drawerType === 'CORRIDOR' && <Compass className="w-5 h-5 text-[#1B3022]" />}
              {drawerType === 'BRIDGE' && <Activity className="w-5 h-5 text-[#D97706]" />}
              {drawerType === 'VEHICLE' && <Truck className="w-5 h-5 text-[#29372D]" />}
              {drawerType === 'ALERT' && <AlertTriangle className="w-5 h-5 text-[#1B3022]" />}
              {drawerType === 'REPORT' && <FileText className="w-5 h-5 text-[#7C9082]" />}
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#1B3022] uppercase tracking-wider block font-mono">
                {drawerType} INSPECTION
              </span>
              <h3 className="text-sm font-bold truncate max-w-[320px] text-[#29372D]">
                {drawerData.name || drawerData.title || drawerData.plate_number || drawerData.id}
              </h3>
            </div>
          </div>
          <button
            onClick={closeDrawer}
            className="p-1.5 rounded-lg hover:bg-[#DCE4DB] transition-colors text-[#68766C] hover:text-[#29372D] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-[#68766C]">
          {/* Universal Provenance & Freshness Strip */}
          <div className="bg-[#F4F5F0] p-3.5 rounded-xl border border-[#DFE5DD] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#68766C] uppercase flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[#1B3022]" /> Source &amp; Data Freshness
              </span>
              <ProvenanceBadge
                status={drawerData.verification_status || 'OBSERVED'}
                confidence={drawerData.confidence || 98.7}
                dataItem={drawerData}
              />
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#68766C]">Source Agency:</span>
              <span className="font-bold text-[#29372D]">{drawerData.source || 'SRC-IMD-AWS / ISRO Bhuvan'}</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#68766C]">Last Observed:</span>
              <span className="font-mono text-[#1B3022] font-bold">{drawerData.observed_at || 'Live (15m sync)'}</span>
            </div>
            <button
              onClick={() => openProvenanceModal(drawerData)}
              className="w-full mt-1 py-1.5 px-3 rounded-lg bg-[#FFFFFF] hover:bg-[#DCE4DB] border border-[#DFE5DD] text-[#1B3022] font-bold text-[10px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#7C9082]" />
              <span>Inspect Cryptographic Audit Trail (SHA-256)</span>
            </button>
          </div>

          {/* DISTRICT VIEW */}
          {drawerType === 'DISTRICT' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#F4F5F0] p-3.5 rounded-xl border border-[#DFE5DD]">
                  <span className="text-[10px] font-bold text-[#1B3022] uppercase">Readiness Score</span>
                  <div className="text-2xl font-bold text-[#29372D] mt-1 font-mono">{drawerData.score} / 100</div>
                </div>
                <div className="bg-[#F4F5F0] p-3.5 rounded-xl border border-[#DFE5DD]">
                  <span className="text-[10px] font-bold text-[#68766C] uppercase">Terrain Profile</span>
                  <div className="text-sm font-bold text-[#29372D] mt-1">{drawerData.terrain}</div>
                  <div className="text-[11px] text-[#68766C]">Elevation: {drawerData.elevation} m</div>
                </div>
              </div>

              <div className="space-y-2.5 border-t border-[#DFE5DD] pt-3">
                <h4 className="font-bold text-[#1B3022] text-xs uppercase">Health &amp; Supply Readiness</h4>
                <div className="flex justify-between py-1.5 border-b border-[#DFE5DD]">
                  <span className="text-[#68766C]">Active Health Centers (PHCs):</span>
                  <span className="font-bold text-[#29372D]">{drawerData.phc_count} Centers</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#DFE5DD]">
                  <span className="text-[#68766C]">Critical Medicine Buffer Level:</span>
                  <span className={`font-bold ${drawerData.critical_stock_pct < 60 ? 'text-[#1B3022]' : 'text-[#1B3022]'}`}>
                    {drawerData.critical_stock_pct}% Stocked
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#DFE5DD]">
                  <span className="text-[#68766C]">Current Highway Status:</span>
                  <span className="font-bold text-[#29372D]">{drawerData.status}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#68766C]">Monsoon Vulnerability:</span>
                  <span className="font-bold text-[#B45309]">{drawerData.risk_level}</span>
                </div>
              </div>
            </div>
          )}

          {/* CORRIDOR VIEW */}
          {drawerType === 'CORRIDOR' && (
            <div className="space-y-4">
              <div className="bg-[#F4F5F0] p-3.5 rounded-xl border border-[#DFE5DD] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-[#68766C] uppercase">Corridor ID</span>
                  <span className="font-mono font-bold bg-[#DCE4DB] border border-[#DFE5DD] px-2 py-0.5 rounded text-xs text-[#1B3022]">
                    {drawerData.id}
                  </span>
                </div>
                <div className="text-sm font-bold text-[#29372D]">{drawerData.name}</div>
                <div className="text-xs text-[#68766C]">
                  Distance: {drawerData.distance_km} km • Avg Speed: {drawerData.avg_speed_kmh} km/h
                </div>
              </div>

              {/* Status History Timeline */}
              <div className="p-3.5 bg-[#F4F5F0] rounded-xl border border-[#DFE5DD] space-y-2">
                <div className="text-[10px] font-bold text-[#1B3022] uppercase flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-[#1B3022]" /> Status Timeline History
                </div>
                <div className="space-y-2.5 text-[11px] border-l-2 border-[#DFE5DD] pl-3 ml-1.5 mt-2">
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-[#1B3022] absolute -left-[17px] top-1" />
                    <span className="font-bold text-[#29372D]">Current Status: {drawerData.status}</span>
                    <p className="text-[10px] text-[#68766C]">{drawerData.hazard_type ? `Active condition: ${drawerData.hazard_type}` : 'All lanes passable under speed regulation.'}</p>
                  </div>
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-[#786D6D] absolute -left-[17px] top-1" />
                    <span className="font-medium text-[#68766C]">06:00 IST — Routine Morning Patrol</span>
                    <p className="text-[10px] text-[#68766C]">Border Roads Organisation clearance verified.</p>
                  </div>
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-[#786D6D] absolute -left-[17px] top-1" />
                    <span className="font-medium text-[#68766C]">Yesterday 18:30 IST — Weather Advisory</span>
                    <p className="text-[10px] text-[#68766C]">Precautionary heavy rain warning logged by IMD AWS.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-[#1B3022] text-xs uppercase">Live Hazard &amp; Structural Limits</h4>
                <div className="p-3 bg-[#F59E0B]/15 rounded-xl border border-[#F59E0B]/30">
                  <div className="font-bold text-[#B45309] text-xs">Active Hazard Warning:</div>
                  <div className="text-xs text-[#29372D] mt-0.5">{drawerData.hazard_type || 'None reported'}</div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="p-2.5 bg-[#F4F5F0] rounded-xl border border-[#DFE5DD] text-center">
                    <div className="text-[10px] text-[#68766C] uppercase">Max Height</div>
                    <div className="font-bold text-sm text-[#29372D] font-mono">{drawerData.clearance_height_m} m</div>
                  </div>
                  <div className="p-2.5 bg-[#F4F5F0] rounded-xl border border-[#DFE5DD] text-center">
                    <div className="text-[10px] text-[#68766C] uppercase">Weight Limit</div>
                    <div className="font-bold text-sm text-[#29372D] font-mono">{drawerData.weight_limit_tons} Tons</div>
                  </div>
                </div>
              </div>

              {/* Status Control */}
              <div className="border-t border-[#DFE5DD] pt-3">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[10px] font-bold text-[#68766C] uppercase">
                    Highway Status Control
                  </label>
                  {isAdminOrAuthority ? (
                    <span className="text-[9px] bg-[#1B3022]/10 text-[#1B3022] font-bold px-1.5 py-0.5 rounded border border-[#1B3022]/20">
                      Authority Control
                    </span>
                  ) : (
                    <span className="text-[9px] bg-[#7C9082]/15 text-[#1B3022] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-[#7C9082]/30">
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
                      className="px-2 py-2 rounded-xl bg-[#7C9082]/20 hover:bg-[#7C9082]/30 text-[#1B3022] border border-[#7C9082]/40 font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      🟢 Open
                    </button>
                    <button
                      onClick={() => {
                        updateRoadStatus(drawerData.id, 'RESTRICTED');
                        addToast('Corridor Status Updated', `${drawerData.name} set to RESTRICTED.`, 'WARNING');
                      }}
                      className="px-2 py-2 rounded-xl bg-[#F59E0B]/20 hover:bg-[#F59E0B]/30 text-[#B45309] border border-[#F59E0B]/40 font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      🟡 Restricted
                    </button>
                    <button
                      onClick={() => {
                        updateRoadStatus(drawerData.id, 'CLOSED');
                        addToast('Corridor Closed', `${drawerData.name} CLOSED by Traffic Authority.`, 'DANGER');
                      }}
                      className="px-2 py-2 rounded-xl bg-[#1B3022]/20 hover:bg-[#1B3022]/30 text-[#1B3022] border border-[#1B3022]/40 font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      🔴 Closed
                    </button>
                  </div>
                ) : (
                  <div className="bg-[#F4F5F0] border border-[#DFE5DD] rounded-xl p-2.5 text-[11px] text-[#68766C] space-y-1">
                    <div className="font-semibold text-[#29372D]">
                      🔒 Traffic Authority Controlled
                    </div>
                    <p className="text-[10px] text-[#68766C] leading-relaxed">
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
              <div className="bg-[#F4F5F0] p-3.5 rounded-xl border border-[#DFE5DD]">
                <span className="text-[10px] font-bold text-[#1B3022] uppercase">Bridge Structural Health</span>
                <div className="text-2xl font-bold text-[#1B3022] mt-1 font-mono">{drawerData.structural_health_pct}%</div>
                <div className="text-[11px] text-[#68766C] mt-1">Crossing: {drawerData.river} River</div>
              </div>

              <div className="space-y-2 border-t border-[#DFE5DD] pt-3">
                <h4 className="font-bold text-[#1B3022] text-xs uppercase">Live IoT Sensor Telemetry</h4>
                <div className="flex justify-between py-1.5 border-b border-[#DFE5DD]">
                  <span className="text-[#68766C]">Microstrain:</span>
                  <span className="font-mono font-bold text-[#B45309]">{drawerData.strain_microstrain} με</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#DFE5DD]">
                  <span className="text-[#68766C]">Vibration Frequency:</span>
                  <span className="font-mono font-bold text-[#29372D]">{drawerData.vibration_hz} Hz</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#DFE5DD]">
                  <span className="text-[#68766C]">Water Clearance to Girder:</span>
                  <span className="font-bold text-[#1B3022]">{drawerData.water_clearance_m} m</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#DFE5DD]">
                  <span className="text-[#68766C]">CCTV Stream Status:</span>
                  <span className="font-bold text-[#29372D]">{drawerData.cctv_status}</span>
                </div>
              </div>
            </div>
          )}

          {/* VEHICLE VIEW */}
          {drawerType === 'VEHICLE' && (
            <div className="space-y-4">
              <div className="bg-[#F4F5F0] p-3.5 rounded-xl border border-[#DFE5DD]">
                <div className="flex justify-between">
                  <span className="font-mono font-bold text-sm text-[#1B3022]">{drawerData.plate_number}</span>
                  <span className="bg-[#7C9082]/20 text-[#1B3022] border border-[#7C9082]/30 px-2 py-0.5 rounded text-[10px] font-bold font-mono">
                    {drawerData.network_mode}
                  </span>
                </div>
                <div className="text-xs font-semibold text-[#29372D] mt-1">{drawerData.vehicle_type}</div>
                <div className="text-[11px] text-[#68766C]">Driver: {drawerData.driver_name} ({drawerData.driver_phone})</div>
              </div>

              {drawerData.cold_chain && (
                <div className="p-3 bg-[#F4F5F0] rounded-xl border border-[#7C9082]/30">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#1B3022] uppercase flex items-center gap-1.5">
                      <Thermometer className="w-3.5 h-3.5 text-[#7C9082]" /> Cold Chain Telemetry
                    </span>
                    <span className="text-xs font-bold text-[#1B3022] font-mono">{drawerData.cold_chain.current_temp_c}°C</span>
                  </div>
                  <div className="text-[11px] text-[#68766C] mt-1">Target Range: 2.0°C - 8.0°C • Tamper Door: Locked</div>
                </div>
              )}

              <div className="space-y-2 border-t border-[#DFE5DD] pt-3">
                <h4 className="font-bold text-[#1B3022] text-xs uppercase">Cargo &amp; Trip Manifest</h4>
                <div className="flex justify-between py-1.5 border-b border-[#DFE5DD]">
                  <span className="text-[#68766C]">Cargo Type:</span>
                  <span className="font-bold text-[#29372D]">{drawerData.cargo_type}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#DFE5DD]">
                  <span className="text-[#68766C]">Weight:</span>
                  <span className="font-bold text-[#29372D] font-mono">{drawerData.cargo_weight_tons} Tons</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#DFE5DD]">
                  <span className="text-[#68766C]">GST e-Way Bill:</span>
                  <span className="font-mono font-bold text-[#29372D]">{drawerData.e_way_bill_no}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#68766C]">ETA Destination:</span>
                  <span className="font-bold text-[#1B3022] font-mono">{drawerData.eta_destination}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-[#F4F5F0] border-t border-[#DFE5DD] flex justify-end">
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
