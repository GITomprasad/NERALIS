import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { usePlatform } from '../../context/PlatformContext';
import { Layers, Eye, EyeOff, MapPin, Truck, AlertTriangle, Activity, ShieldCheck } from 'lucide-react';
import { ProvenanceBadge } from '../common/ProvenanceBadge';

const MapResizer: React.FC<{ isSidebarCollapsed?: boolean }> = ({ isSidebarCollapsed }) => {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [isSidebarCollapsed, map]);
  return null;
};

// Fix standard Leaflet default icon issues in React
const createCustomIcon = (color: string, label: string) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 10px;">${label}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const vehicleIcon = L.divIcon({
  className: 'vehicle-icon',
  html: `<div style="background-color: #1E3A5F; width: 28px; height: 28px; border-radius: 6px; border: 2px solid #38bdf8; box-shadow: 0 2px 6px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white;">🚛</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

const bridgeIcon = L.divIcon({
  className: 'bridge-icon',
  html: `<div style="background-color: #B85C00; width: 26px; height: 26px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px #f59e0b; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px;">🌉</div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13]
});

const depotIcon = L.divIcon({
  className: 'depot-icon',
  html: `<div style="background-color: #0F6B6B; width: 28px; height: 28px; border-radius: 8px; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 14px;">🏢</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

export const NerGisMap: React.FC<{ height?: string; highlightRoute?: any; className?: string }> = ({
  height = '100%',
  highlightRoute,
  className = ''
}) => {
  const {
    districts,
    corridors,
    bridges,
    depots,
    vehicles,
    openDrawer,
    isSidebarCollapsed,
    openProvenanceModal,
    selectedStateFilter
  } = usePlatform();

  const visibleDistricts = districts.filter(d => selectedStateFilter === 'ALL' || d.state_id === selectedStateFilter);
  const visibleCorridors = corridors.filter(c => {
    if (selectedStateFilter === 'ALL') return true;
    const fromId = c.from_district || '';
    const toId = c.to_district || '';
    return fromId.startsWith(selectedStateFilter) || toId.startsWith(selectedStateFilter);
  });
  const visibleBridges = bridges.filter(b => {
    if (selectedStateFilter === 'ALL') return true;
    return b.id?.startsWith(`BR-${selectedStateFilter}`) || b.location?.toLowerCase().includes(selectedStateFilter.toLowerCase());
  });

  // Layer Visibility Controls
  const [showRoads, setShowRoads] = useState(true);
  const [showBridges, setShowBridges] = useState(true);
  const [showDepots, setShowDepots] = useState(true);
  const [showVehicles, setShowVehicles] = useState(true);
  const [showDistricts, setShowDistricts] = useState(true);
  const [showLayersMenu, setShowLayersMenu] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return '#0F6B6B'; // Teal
      case 'RESTRICTED':
        return '#B85C00'; // Amber/Orange
      case 'DEGRADED':
        return '#ea580c'; // Orange-red
      case 'CLOSED':
        return '#9B1B1B'; // Danger Red
      case 'SEASONAL':
        return '#2563A8'; // Blue
      default:
        return '#6b7280';
    }
  };

  return (
    <div className={`relative w-full overflow-hidden ${className}`} style={{ height }}>
      {/* Map Container */}
      <MapContainer
        center={[26.2000, 92.8000]}
        zoom={7}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <MapResizer isSidebarCollapsed={isSidebarCollapsed} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | ISRO Bhuvan GIS'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 1. Road Segments Polylines */}
        {showRoads &&
          visibleCorridors.map((seg) => {
            const color = getStatusColor(seg.status);
            const isClosed = seg.status === 'CLOSED';
            const isOpen = seg.status === 'OPEN';
            return (
              <Polyline
                key={seg.id}
                positions={seg.coordinates as any}
                pathOptions={{
                  color,
                  weight: isClosed ? 5 : isOpen ? 3 : 4,
                  opacity: isOpen ? 0.65 : 0.85,
                  dashArray: isClosed ? '6, 8' : undefined
                }}
                eventHandlers={{
                  click: () => openDrawer('CORRIDOR', seg)
                }}
              >
                <Popup>
                  <div className="p-1 text-xs space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <div className="font-bold text-[#1E3A5F]">{seg.name}</div>
                      <ProvenanceBadge status={seg.verification_status || 'VERIFIED'} dataItem={seg} />
                    </div>
                    <div className="text-[11px] text-gray-600">
                      Distance: {seg.distance_km} km • Status: <strong>{seg.status}</strong>
                    </div>
                    {seg.hazard_type && (
                      <div className="text-[10px] text-red-600 font-semibold">
                        Hazard: {seg.hazard_type}
                      </div>
                    )}
                    <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                      <button
                        onClick={() => openDrawer('CORRIDOR', seg)}
                        className="text-[10px] font-bold text-blue-700 underline"
                      >
                        Corridor Details &rarr;
                      </button>
                      <button
                        onClick={() => openProvenanceModal(seg)}
                        className="text-[10px] font-bold text-teal-700 flex items-center gap-0.5 hover:underline ml-auto"
                      >
                        <ShieldCheck className="w-2.5 h-2.5" /> Provenance
                      </button>
                    </div>
                  </div>
                </Popup>
              </Polyline>
            );
          })}

        {/* Highlight Active Route if present */}
        {highlightRoute && highlightRoute.segments && (
          highlightRoute.segments.map((seg: any, idx: number) => (
            <Polyline
              key={`hl-${idx}`}
              positions={seg.coordinates}
              pathOptions={{
                color: '#38bdf8',
                weight: 7,
                opacity: 0.9
              }}
            />
          ))
        )}

        {/* 2. District Headquarter Markers */}
        {showDistricts &&
          visibleDistricts.map((d) => (
            <CircleMarker
              key={d.id}
              center={[d.lat, d.lng]}
              radius={6}
              pathOptions={{
                fillColor: getStatusColor(d.status),
                fillOpacity: 0.9,
                color: '#ffffff',
                weight: 2
              }}
              eventHandlers={{
                click: () => openDrawer('DISTRICT', d)
              }}
            >
              <Popup>
                <div className="p-1 text-xs space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <div className="font-bold text-[#1E3A5F]">{d.name}</div>
                    <ProvenanceBadge status={d.verification_status || 'OBSERVED'} dataItem={d} />
                  </div>
                  <div className="text-[11px] text-gray-500">{d.state} ({d.terrain})</div>
                  <div className="font-bold text-emerald-800">
                    Connectivity Score: {d.score} / 100
                  </div>
                  <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                    <button
                      onClick={() => openDrawer('DISTRICT', d)}
                      className="text-[10px] font-bold text-blue-700 underline"
                    >
                      Readiness &rarr;
                    </button>
                    <button
                      onClick={() => openProvenanceModal(d)}
                      className="text-[10px] font-bold text-teal-700 flex items-center gap-0.5 hover:underline ml-auto"
                    >
                      <ShieldCheck className="w-2.5 h-2.5" /> Provenance
                    </button>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}

        {/* 3. Strategic Bridge IoT Sensors */}
        {showBridges &&
          visibleBridges.map((br) => (
            <Marker
              key={br.id}
              position={[br.lat, br.lng]}
              icon={bridgeIcon}
              eventHandlers={{
                click: () => openDrawer('BRIDGE', br)
              }}
            >
              <Popup>
                <div className="p-1 text-xs space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <div className="font-bold text-[#1E3A5F]">{br.name}</div>
                    <ProvenanceBadge status={br.verification_status || 'OBSERVED'} dataItem={br} />
                  </div>
                  <div className="text-[11px] text-gray-600">River: {br.river}</div>
                  <div className="font-semibold text-amber-800">
                    Health: {br.structural_health_pct}% • Strain: {br.strain_microstrain} με
                  </div>
                  <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                    <button
                      onClick={() => openDrawer('BRIDGE', br)}
                      className="text-[10px] font-bold text-blue-700 underline"
                    >
                      IoT Diagnostics &rarr;
                    </button>
                    <button
                      onClick={() => openProvenanceModal(br)}
                      className="text-[10px] font-bold text-teal-700 flex items-center gap-0.5 hover:underline ml-auto"
                    >
                      <ShieldCheck className="w-2.5 h-2.5" /> Provenance
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* 4. Strategic Depots */}
        {showDepots &&
          depots.map((dep) => (
            <Marker
              key={dep.id}
              position={[dep.lat, dep.lng]}
              icon={depotIcon}
            >
              <Popup>
                <div className="p-1 text-xs space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <div className="font-bold text-[#1E3A5F]">{dep.name}</div>
                    <ProvenanceBadge status={dep.verification_status || 'VERIFIED'} dataItem={dep} />
                  </div>
                  <div className="text-[11px] text-gray-600">{dep.type}</div>
                  <div className="text-emerald-800 font-bold">
                    Stock: {dep.current_stock_tons.toLocaleString()} / {dep.capacity_metric_tons.toLocaleString()} MT
                  </div>
                  <div className="text-[10px] text-blue-700">
                    Vaccines: {dep.critical_vaccine_units.toLocaleString()} doses
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* 5. Real-Time Fleet Vehicles */}
        {showVehicles &&
          vehicles.map((veh) => (
            <Marker
              key={veh.id}
              position={[veh.current_lat, veh.current_lng]}
              icon={vehicleIcon}
              eventHandlers={{
                click: () => openDrawer('VEHICLE', veh)
              }}
            >
              <Popup>
                <div className="p-1 text-xs space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <div className="font-bold text-[#1E3A5F]">{veh.plate_number}</div>
                    <ProvenanceBadge status={veh.verification_status || 'OBSERVED'} dataItem={veh} />
                  </div>
                  <div className="text-[11px] text-gray-700">{veh.cargo_type}</div>
                  <div className="text-[10px] text-gray-500">
                    Speed: {veh.speed_kmh} km/h • Mode: {veh.network_mode}
                  </div>
                  {veh.cold_chain && (
                    <div className="text-[10px] font-bold text-emerald-700">
                      ❄️ Temp: {veh.cold_chain.current_temp_c}°C
                    </div>
                  )}
                  <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                    <button
                      onClick={() => openDrawer('VEHICLE', veh)}
                      className="text-[10px] font-bold text-blue-700 underline"
                    >
                      Track Manifest &rarr;
                    </button>
                    <button
                      onClick={() => openProvenanceModal(veh)}
                      className="text-[10px] font-bold text-teal-700 flex items-center gap-0.5 hover:underline ml-auto"
                    >
                      <ShieldCheck className="w-2.5 h-2.5" /> Provenance
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>

      {/* Floating Layer Control Panel (Top-Right) */}
      <div className="absolute top-3 right-3 z-[1000]">
        <div className="relative">
          <button
            onClick={() => setShowLayersMenu(!showLayersMenu)}
            className="bg-white/95 backdrop-blur shadow-md px-3 py-2 rounded-lg border border-gray-300 text-xs font-bold text-[#1E3A5F] flex items-center gap-2 hover:bg-white transition-all"
          >
            <Layers className="w-4 h-4 text-[#2563A8]" />
            <span>GIS Map Layers</span>
          </button>

          {showLayersMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl border border-gray-200 p-3 space-y-2 text-xs">
              <div className="font-bold text-gray-500 text-[10px] uppercase border-b pb-1">
                Toggle GIS Overlays
              </div>
              <label className="flex items-center justify-between cursor-pointer">
                <span>🛣️ Road Corridors</span>
                <input
                  type="checkbox"
                  checked={showRoads}
                  onChange={(e) => setShowRoads(e.target.checked)}
                  className="rounded text-[#1E3A5F]"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-medium text-gray-800">Road Corridors</span>
                <input
                  type="checkbox"
                  checked={showRoads}
                  onChange={(e) => setShowRoads(e.target.checked)}
                  className="rounded text-[#17365D]"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-medium text-gray-800">Bridge IoT Health</span>
                <input
                  type="checkbox"
                  checked={showBridges}
                  onChange={(e) => setShowBridges(e.target.checked)}
                  className="rounded text-[#17365D]"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-medium text-gray-800">Strategic Depots</span>
                <input
                  type="checkbox"
                  checked={showDepots}
                  onChange={(e) => setShowDepots(e.target.checked)}
                  className="rounded text-[#17365D]"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-medium text-gray-800">Tracked Fleet</span>
                <input
                  type="checkbox"
                  checked={showVehicles}
                  onChange={(e) => setShowVehicles(e.target.checked)}
                  className="rounded text-[#17365D]"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-medium text-gray-800">District Nodes</span>
                <input
                  type="checkbox"
                  checked={showDistricts}
                  onChange={(e) => setShowDistricts(e.target.checked)}
                  className="rounded text-[#17365D]"
                />
              </label>
              <div className="pt-2 border-t border-gray-100 text-[10px] text-gray-500 flex items-center justify-between">
                <span>Data updated 42 sec ago</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Map Legend (Bottom-Left) */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-gray-300 shadow-md text-[11px] space-y-1.5">
        <div className="font-bold text-[#17365D] text-[10px] uppercase tracking-wider mb-1 flex items-center justify-between">
          <span>Corridor Accessibility Status</span>
          <span className="text-[9px] text-gray-400 font-mono">LIVE</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#0F6B6B]"></span>
          <span className="text-gray-700 font-medium">Open (Normal Flow)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#B85C00]"></span>
          <span className="text-gray-700 font-medium">Restricted (One-way / Hazard)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#ea580c]"></span>
          <span className="text-gray-700 font-medium">Degraded (Rough / Mud Slurry)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#9B1B1B]"></span>
          <span className="text-gray-700 font-bold">Closed (Impassable Blockade)</span>
        </div>
      </div>
    </div>
  );
};
