import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { usePlatform } from '../../context/PlatformContext';
import {
  Layers,
  Eye,
  EyeOff,
  MapPin,
  Truck,
  AlertTriangle,
  Activity,
  ShieldCheck,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  ExternalLink,
  Key,
  X,
  Compass
} from 'lucide-react';
import { ProvenanceBadge } from '../common/ProvenanceBadge';

const MapResizer: React.FC<{ isSidebarCollapsed?: boolean; isFullscreen?: boolean }> = ({ isSidebarCollapsed, isFullscreen }) => {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    return () => clearTimeout(timer);
  }, [isSidebarCollapsed, isFullscreen, map]);
  return null;
};

const RouteBoundsFitter: React.FC<{ highlightRoute?: any }> = ({ highlightRoute }) => {
  const map = useMap();
  useEffect(() => {
    if (!highlightRoute) return;
    const coords: [number, number][] = [];
    if (Array.isArray(highlightRoute.coordinates)) {
      highlightRoute.coordinates.forEach((c: any) => {
        if (Array.isArray(c) && c.length >= 2 && typeof c[0] === 'number' && typeof c[1] === 'number') {
          coords.push([c[0], c[1]]);
        }
      });
    }
    if (coords.length === 0 && Array.isArray(highlightRoute.segments)) {
      highlightRoute.segments.forEach((seg: any) => {
        if (Array.isArray(seg.coordinates)) {
          seg.coordinates.forEach((c: any) => {
            if (Array.isArray(c) && c.length >= 2 && typeof c[0] === 'number' && typeof c[1] === 'number') {
              coords.push([c[0], c[1]]);
            }
          });
        }
      });
    }
    if (coords.length > 0) {
      try {
        const bounds = L.latLngBounds(coords);
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 10, animate: true });
      } catch {
        // Safe fallback
      }
    }
  }, [highlightRoute, map]);
  return null;
};

// Clean, high-contrast DivIcons (Cherry Red + Soft Off-White Enterprise style)
const vehicleIcon = L.divIcon({
  className: 'vehicle-icon',
  html: `<div style="background: #FFFFFF; width: 28px; height: 28px; border-radius: 6px; border: 1.5px solid #990011; box-shadow: 0 2px 6px rgba(37,33,36,0.15); display: flex; align-items: center; justify-content: center; color: #252124; font-size: 13px;">🚛</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

const bridgeIcon = L.divIcon({
  className: 'bridge-icon',
  html: `<div style="background: #FFFFFF; width: 26px; height: 26px; border-radius: 50%; border: 1.5px solid #D97706; box-shadow: 0 2px 6px rgba(37,33,36,0.15); display: flex; align-items: center; justify-content: center; color: #252124; font-size: 12px;">🌉</div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13]
});

const depotIcon = L.divIcon({
  className: 'depot-icon',
  html: `<div style="background: #FFFFFF; width: 26px; height: 26px; border-radius: 6px; border: 1.5px solid #10B981; box-shadow: 0 2px 6px rgba(37,33,36,0.15); display: flex; align-items: center; justify-content: center; color: #252124; font-size: 12px;">🏢</div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13]
});

const originIcon = (label: string = 'A') => L.divIcon({
  className: 'origin-marker-pin',
  html: `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; transform: translate(-50%, -50%);">
      <div style="width: 26px; height: 26px; border-radius: 50%; background: #059669; border: 2px solid #ffffff; box-shadow: 0 2px 6px rgba(37,33,36,0.2); display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 11px; font-family: Inter, system-ui, sans-serif;">
        ${label}
      </div>
    </div>
  `,
  iconSize: [26, 26],
  iconAnchor: [0, 0]
});

const destinationIcon = (label: string = '🎯') => L.divIcon({
  className: 'destination-marker-pin',
  html: `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; transform: translate(-50%, -50%);">
      <div style="width: 28px; height: 28px; border-radius: 50%; background: #990011; border: 2px solid #ffffff; box-shadow: 0 2px 6px rgba(37,33,36,0.25); display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 12px; font-family: Inter, system-ui, sans-serif;">
        ${label}
      </div>
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [0, 0]
});

const waypointIcon = (index: number) => L.divIcon({
  className: 'transit-waypoint-pin',
  html: `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; transform: translate(-50%, -50%);">
      <div style="width: 22px; height: 22px; border-radius: 50%; background: #252124; border: 1.5px solid #ffffff; box-shadow: 0 2px 5px rgba(37,33,36,0.2); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 10px; font-family: Inter, system-ui, sans-serif;">
        ${index}
      </div>
    </div>
  `,
  iconSize: [22, 22],
  iconAnchor: [0, 0]
});
export interface NerGisMapProps {
  height?: string;
  highlightRoute?: any;
  className?: string;
  initialShowRoads?: boolean;
  initialShowBridges?: boolean;
  initialShowDepots?: boolean;
  initialShowVehicles?: boolean;
  initialShowDistricts?: boolean;
  originPoint?: { lat: number; lng: number; label?: string };
  destinationPoint?: { lat: number; lng: number; label?: string };
}

export const NerGisMap: React.FC<NerGisMapProps> = ({
  height = '100%',
  highlightRoute,
  className = '',
  initialShowRoads = true,
  initialShowBridges = true,
  initialShowDepots = true,
  initialShowVehicles = true,
  initialShowDistricts = true,
  originPoint,
  destinationPoint
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

  // Extract or resolve start / destination points
  let startPoint = originPoint;
  let endPoint = destinationPoint;

  if (highlightRoute) {
    if (Array.isArray(highlightRoute.coordinates) && highlightRoute.coordinates.length > 0) {
      const first = highlightRoute.coordinates[0];
      const last = highlightRoute.coordinates[highlightRoute.coordinates.length - 1];
      if (!startPoint && Array.isArray(first) && first.length >= 2) {
        startPoint = {
          lat: first[0],
          lng: first[1],
          label: highlightRoute.origin_district || highlightRoute.origin_name || 'Start Point (Origin)'
        };
      }
      if (!endPoint && Array.isArray(last) && last.length >= 2) {
        endPoint = {
          lat: last[0],
          lng: last[1],
          label: highlightRoute.destination_district || highlightRoute.destination_name || 'Destination Target'
        };
      }
    } else if (Array.isArray(highlightRoute.segments) && highlightRoute.segments.length > 0) {
      const firstSeg = highlightRoute.segments[0];
      const lastSeg = highlightRoute.segments[highlightRoute.segments.length - 1];
      if (!startPoint && Array.isArray(firstSeg.coordinates) && firstSeg.coordinates.length > 0) {
        const coord = firstSeg.coordinates[0];
        startPoint = {
          lat: coord[0],
          lng: coord[1],
          label: firstSeg.from_district || highlightRoute.origin_district || 'Start Point (Origin)'
        };
      }
      if (!endPoint && Array.isArray(lastSeg.coordinates) && lastSeg.coordinates.length > 0) {
        const coord = lastSeg.coordinates[lastSeg.coordinates.length - 1];
        endPoint = {
          lat: coord[0],
          lng: coord[1],
          label: lastSeg.to_district || highlightRoute.destination_district || 'Destination Target'
        };
      }
    }
  }

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
  const [showRoads, setShowRoads] = useState(initialShowRoads);
  const [showBridges, setShowBridges] = useState(initialShowBridges);
  const [showDepots, setShowDepots] = useState(initialShowDepots);
  const [showVehicles, setShowVehicles] = useState(initialShowVehicles);
  const [showDistricts, setShowDistricts] = useState(initialShowDistricts);
  const [showLayersMenu, setShowLayersMenu] = useState(false);
  const [showStyleMenu, setShowStyleMenu] = useState(false);

  // CARTO Basemaps API Key Support (Env: VITE_CARTO_API_KEY, fallback to local storage)
  const envCartoKey =
    (import.meta as any).env?.VITE_CARTO_API_KEY ||
    (import.meta as any).env?.VITE_MAP_API_KEY ||
    '';

  const [customCartoKey, setCustomCartoKey] = useState<string>(() => {
    try {
      return localStorage.getItem('NERALIS_CARTO_KEY') || '';
    } catch {
      return '';
    }
  });

  const [tempInputKey, setTempInputKey] = useState('');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showKeyWarning, setShowKeyWarning] = useState(true);

  const activeCartoKey = (customCartoKey || envCartoKey).trim();

  // Map Basemap Styles: Positron (clean light), Voyager (detailed), Dark (dark ops), OSM (open fallback)
  const [mapStyle, setMapStyle] = useState<'POSITRON' | 'VOYAGER' | 'DARK' | 'OSM'>('POSITRON');

  const handleSaveCustomKey = (key: string) => {
    const trimmed = key.trim();
    setCustomCartoKey(trimmed);
    try {
      if (trimmed) {
        localStorage.setItem('NERALIS_CARTO_KEY', trimmed);
      } else {
        localStorage.removeItem('NERALIS_CARTO_KEY');
      }
    } catch {}
    setShowKeyModal(false);
  };

  // Fullscreen State & Handlers
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;

    if (!isFullscreen) {
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => {
          setIsFullscreen(true);
        });
      } else if ((el as any).webkitRequestFullscreen) {
        (el as any).webkitRequestFullscreen();
      } else if ((el as any).msRequestFullscreen) {
        (el as any).msRequestFullscreen();
      } else {
        setIsFullscreen(true);
      }
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {
          setIsFullscreen(false);
        });
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      } else {
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!(document.fullscreenElement || (document as any).webkitFullscreenElement || (document as any).mozFullScreenElement));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return '#10B981'; // Emerald safe
      case 'RESTRICTED':
        return '#F59E0B'; // Amber warning
      case 'DEGRADED':
        return '#F97316'; // Orange-red
      case 'CLOSED':
        return '#EF4444'; // Critical red
      case 'SEASONAL':
        return '#3B82F6'; // Cyan blue
      default:
        return '#64748B';
    }
  };

  // Enterprise GIS Tile Provider: CARTO Basemaps raster tiles with API key support
  // Query parameter `key` removes the watermark: https://carto.com/basemaps/apikey/
  const keyParam = activeCartoKey ? `?key=${encodeURIComponent(activeCartoKey)}` : '';
  const customTileUrl = (import.meta as any).env?.VITE_MAP_TILE_URL;

  let tileUrl = `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png${keyParam}`;
  let tileAttr = '&copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> | ISRO Bhuvan GIS';

  if (customTileUrl) {
    tileUrl = customTileUrl.replace('{key}', activeCartoKey).replace('{api_key}', activeCartoKey);
  } else if (mapStyle === 'VOYAGER') {
    tileUrl = `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png${keyParam}`;
  } else if (mapStyle === 'DARK') {
    tileUrl = `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png${keyParam}`;
  } else if (mapStyle === 'OSM') {
    tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    tileAttr = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors | ISRO Bhuvan GIS';
  } else {
    // Default POSITRON (Muted light geographical map)
    tileUrl = `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png${keyParam}`;
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden transition-all ${
        isFullscreen
          ? 'fixed inset-0 z-[99999] w-screen h-screen bg-[#FCF6F5] flex flex-col'
          : className
      }`}
      style={{ height: isFullscreen ? '100vh' : height }}
    >
      {/* Map Container */}
      <MapContainer
        center={[26.2000, 92.8000]}
        zoom={7}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <MapResizer isSidebarCollapsed={isSidebarCollapsed} isFullscreen={isFullscreen} />
        <RouteBoundsFitter highlightRoute={highlightRoute} />
        <TileLayer
          attribution={tileAttr}
          url={tileUrl}
          subdomains="abcd"
          maxZoom={19}
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
                  weight: isClosed ? 5 : isOpen ? 3.5 : 4.5,
                  opacity: isOpen ? 0.8 : 0.95,
                  dashArray: isClosed ? '6, 8' : undefined
                }}
                eventHandlers={{
                  click: () => openDrawer('CORRIDOR', seg)
                }}
              >
                <Popup>
                  <div className="p-1 text-xs space-y-1.5 min-w-[200px]">
                    <div className="flex items-center justify-between gap-1 pb-1 border-b border-[#E7DAD8]">
                      <div className="font-bold text-[#990011]">{seg.name}</div>
                      <ProvenanceBadge status={seg.verification_status || 'VERIFIED'} dataItem={seg} />
                    </div>
                    <div className="text-[11px] text-[#786D6D]">
                      Distance: <span className="text-[#252124] font-medium">{seg.distance_km} km</span> • Status:{' '}
                      <strong style={{ color }}>{seg.status}</strong>
                    </div>
                    {seg.hazard_type && (
                      <div className="text-[10px] text-[#FF5252] font-semibold bg-[#FF5252]/10 p-1 rounded border border-[#FF5252]/20">
                        Hazard: {seg.hazard_type}
                      </div>
                    )}
                    <div className="flex items-center gap-2 pt-1.5 border-t border-[#E7DAD8]">
                      <button
                        onClick={() => openDrawer('CORRIDOR', seg)}
                        className="text-[10px] font-bold text-[#990011] hover:underline cursor-pointer"
                      >
                        Corridor Details &rarr;
                      </button>
                      <button
                        onClick={() => openProvenanceModal(seg)}
                        className="text-[10px] font-bold text-[#20C997] flex items-center gap-0.5 hover:underline ml-auto cursor-pointer"
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
        {highlightRoute && (
          <>
            {Array.isArray(highlightRoute.coordinates) && highlightRoute.coordinates.length > 0 && (
              <Polyline
                positions={highlightRoute.coordinates as any}
                pathOptions={{
                  color: '#19C6D2',
                  weight: 6,
                  opacity: 0.95,
                  lineJoin: 'round',
                  lineCap: 'round'
                }}
              />
            )}
            {Array.isArray(highlightRoute.segments) &&
              highlightRoute.segments.map((seg: any, idx: number) => {
                if (!Array.isArray(seg.coordinates) || seg.coordinates.length === 0) return null;
                return (
                  <Polyline
                    key={`hl-seg-${idx}-${seg.segment_id || idx}`}
                    positions={seg.coordinates as any}
                    pathOptions={{
                      color: '#438BFF',
                      weight: 7,
                      opacity: 0.9
                    }}
                  />
                );
              })}
          </>
        )}

        {/* Transit Waypoint Markers (Intermediate Nodes) */}
        {highlightRoute && Array.isArray(highlightRoute.waypoints) &&
          highlightRoute.waypoints.map((wp: any) => {
            if (wp.role === 'TRANSIT') {
              return (
                <Marker
                  key={`wp-${wp.index}-${wp.node_id}`}
                  position={[wp.lat, wp.lng]}
                  icon={waypointIcon(wp.index)}
                >
                  <Popup>
                    <div className="p-1.5 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-[#990011]">
                        <span className="w-4 h-4 rounded-full bg-[#EDE4E2] text-[#990011] border border-[#990011]/40 flex items-center justify-center text-[10px] font-bold">
                          {wp.index}
                        </span>
                        <span>TRANSIT JUNCTION / CORRIDOR</span>
                      </div>
                      <div className="font-bold text-[#252124]">{wp.name} {wp.state ? `(${wp.state})` : ''}</div>
                      <div className="text-[11px] text-[#786D6D] font-mono">
                        {wp.lat.toFixed(4)}°N, {wp.lng.toFixed(4)}°E
                      </div>
                      <div className="text-[10px] text-[#990011] font-semibold bg-cyan-950/30 px-1.5 py-0.5 rounded border border-[#990011]/30">
                        Transit Waypoint #{wp.index}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            }
            return null;
          })}

        {/* Origin / Start Point Marker */}
        {startPoint && (
          <Marker position={[startPoint.lat, startPoint.lng]} icon={originIcon('A')}>
            <Popup>
              <div className="p-1.5 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-black text-[#20C997]">
                  <span className="w-2 h-2 rounded-full bg-[#20C997] animate-ping"></span>
                  <span>ORIGIN (START POINT)</span>
                </div>
                <div className="font-bold text-[#252124]">{startPoint.label || 'Convoy Start'}</div>
                <div className="text-[11px] text-[#786D6D] font-mono">
                  {startPoint.lat.toFixed(4)}°N, {startPoint.lng.toFixed(4)}°E
                </div>
                <div className="text-[10px] text-[#20C997] font-bold bg-emerald-950/30 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  ✓ Convoy Departure Node
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Destination / Target Point Marker */}
        {endPoint && (
          <Marker position={[endPoint.lat, endPoint.lng]} icon={destinationIcon('🎯')}>
            <Popup>
              <div className="p-1.5 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-black text-[#FF5252]">
                  <span className="w-2 h-2 rounded-full bg-[#FF5252] animate-ping"></span>
                  <span>DESTINATION (TARGET)</span>
                </div>
                <div className="font-bold text-[#252124]">{endPoint.label || 'Convoy Target'}</div>
                <div className="text-[11px] text-[#786D6D] font-mono">
                  {endPoint.lat.toFixed(4)}°N, {endPoint.lng.toFixed(4)}°E
                </div>
                <div className="text-[10px] text-[#FF5252] font-bold bg-rose-950/30 px-1.5 py-0.5 rounded border border-rose-500/30">
                  🎯 Target Delivery Destination
                </div>
              </div>
            </Popup>
          </Marker>
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
                color: '#252124',
                weight: 2
              }}
              eventHandlers={{
                click: () => openDrawer('DISTRICT', d)
              }}
            >
              <Popup>
                <div className="p-1 text-xs space-y-1.5 min-w-[190px]">
                  <div className="flex items-center justify-between gap-1 pb-1 border-b border-[#E7DAD8]">
                    <div className="font-bold text-[#252124]">{d.name}</div>
                    <ProvenanceBadge status={d.verification_status || 'OBSERVED'} dataItem={d} />
                  </div>
                  <div className="text-[11px] text-[#786D6D]">{d.state} ({d.terrain})</div>
                  <div className="font-bold text-[#20C997]">
                    Readiness Score: {d.score} / 100
                  </div>
                  <div className="flex items-center gap-2 pt-1 border-t border-[#E7DAD8]">
                    <button
                      onClick={() => openDrawer('DISTRICT', d)}
                      className="text-[10px] font-bold text-[#990011] hover:underline cursor-pointer"
                    >
                      Inspect Readiness &rarr;
                    </button>
                    <button
                      onClick={() => openProvenanceModal(d)}
                      className="text-[10px] font-bold text-[#20C997] flex items-center gap-0.5 hover:underline ml-auto cursor-pointer"
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
                <div className="p-1 text-xs space-y-1.5 min-w-[200px]">
                  <div className="flex items-center justify-between gap-1 pb-1 border-b border-[#E7DAD8]">
                    <div className="font-bold text-[#252124]">{br.name}</div>
                    <ProvenanceBadge status={br.verification_status || 'OBSERVED'} dataItem={br} />
                  </div>
                  <div className="text-[11px] text-[#786D6D]">River: {br.river}</div>
                  <div className="font-semibold text-[#FFB547]">
                    Health: {br.structural_health_pct}% • Strain: {br.strain_microstrain} με
                  </div>
                  <div className="flex items-center gap-2 pt-1 border-t border-[#E7DAD8]">
                    <button
                      onClick={() => openDrawer('BRIDGE', br)}
                      className="text-[10px] font-bold text-[#990011] hover:underline cursor-pointer"
                    >
                      IoT Diagnostics &rarr;
                    </button>
                    <button
                      onClick={() => openProvenanceModal(br)}
                      className="text-[10px] font-bold text-[#20C997] flex items-center gap-0.5 hover:underline ml-auto cursor-pointer"
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
                <div className="p-1 text-xs space-y-1.5 min-w-[200px]">
                  <div className="flex items-center justify-between gap-1 pb-1 border-b border-[#E7DAD8]">
                    <div className="font-bold text-[#252124]">{dep.name}</div>
                    <ProvenanceBadge status={dep.verification_status || 'VERIFIED'} dataItem={dep} />
                  </div>
                  <div className="text-[11px] text-[#786D6D]">{dep.type}</div>
                  <div className="text-[#20C997] font-bold">
                    Stock: {dep.current_stock_tons.toLocaleString()} / {dep.capacity_metric_tons.toLocaleString()} MT
                  </div>
                  <div className="text-[10px] text-[#38BDF8]">
                    Vaccine Buffer: {dep.critical_vaccine_units.toLocaleString()} doses
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
                <div className="p-1 text-xs space-y-1.5 min-w-[200px]">
                  <div className="flex items-center justify-between gap-1 pb-1 border-b border-[#E7DAD8]">
                    <div className="font-bold text-[#990011] font-mono">{veh.plate_number}</div>
                    <ProvenanceBadge status={veh.verification_status || 'OBSERVED'} dataItem={veh} />
                  </div>
                  <div className="text-[11px] text-[#252124]">{veh.cargo_type}</div>
                  <div className="text-[10px] text-[#786D6D]">
                    Speed: {veh.speed_kmh} km/h • NavIC: {veh.network_mode}
                  </div>
                  {veh.cold_chain && (
                    <div className="text-[10px] font-bold text-[#20C997] bg-[#20C997]/10 p-1 rounded border border-[#20C997]/20">
                      ❄️ Temp: {veh.cold_chain.current_temp_c}°C ({veh.cold_chain.status})
                    </div>
                  )}
                  <div className="flex items-center gap-2 pt-1 border-t border-[#E7DAD8]">
                    <button
                      onClick={() => openDrawer('VEHICLE', veh)}
                      className="text-[10px] font-bold text-[#990011] hover:underline cursor-pointer"
                    >
                      Track Telematics &rarr;
                    </button>
                    <button
                      onClick={() => openProvenanceModal(veh)}
                      className="text-[10px] font-bold text-[#20C997] flex items-center gap-0.5 hover:underline ml-auto cursor-pointer"
                    >
                      <ShieldCheck className="w-2.5 h-2.5" /> Provenance
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>

      {/* Top Map Notification Banner if CARTO API key is unconfigured */}
      {!activeCartoKey && mapStyle !== 'OSM' && showKeyWarning && (
        <div className="absolute top-3 left-3 right-3 sm:left-auto sm:right-3 sm:max-w-md z-[1100] bg-[#FFFFFF]/95 border border-[#F59E0B]/50 rounded-xl p-3 shadow-lg backdrop-blur-md text-xs text-[#252124] space-y-2 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[#B45309] font-semibold text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>CARTO API Key Required</span>
            </div>
            <button
              onClick={() => setShowKeyWarning(false)}
              className="text-[#786D6D] hover:text-[#252124] p-0.5 cursor-pointer"
              title="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-[#786D6D] leading-relaxed">
            CARTO Basemaps requires an API key to remove the repeated watermark.
            Set <code className="bg-[#EDE4E2] text-[#990011] px-1 py-0.5 rounded font-mono text-[10px]">VITE_CARTO_API_KEY</code> in Render or enter your key below:
          </p>
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              placeholder="Paste CARTO API Key..."
              value={tempInputKey}
              onChange={(e) => setTempInputKey(e.target.value)}
              className="flex-1 bg-[#FCF6F5] border border-[#E7DAD8] rounded-lg px-2.5 py-1 text-xs text-[#252124] placeholder:text-[#786D6D] focus:outline-none focus:border-[#990011]"
            />
            <button
              onClick={() => handleSaveCustomKey(tempInputKey)}
              className="bg-[#990011] hover:bg-[#80000e] text-white font-semibold px-2.5 py-1 rounded-lg text-xs cursor-pointer whitespace-nowrap"
            >
              Apply Key
            </button>
          </div>
          <div className="flex items-center justify-between text-[10px] text-[#786D6D] pt-0.5">
            <a
              href="https://carto.com/basemaps/apikey/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#990011] hover:underline flex items-center gap-1 font-medium"
            >
              <span>Get free CARTO key</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={() => setMapStyle('OSM')}
              className="text-[#786D6D] hover:text-[#252124] underline cursor-pointer"
            >
              Switch to OSM (No Watermark)
            </button>
          </div>
        </div>
      )}

      {/* CARTO Key Settings Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-[12000] bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#E7DAD8] rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4 text-[#252124]">
            <div className="flex items-center justify-between border-b border-[#E7DAD8] pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-[#990011]" />
                <h3 className="font-bold text-sm text-[#252124]">CARTO Basemaps API Key</h3>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-[#786D6D] hover:text-[#252124] p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#786D6D] leading-relaxed">
              CARTO requires a publishable API key for watermark-free basemaps. Get a key at{' '}
              <a
                href="https://carto.com/basemaps/apikey/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#990011] hover:underline inline-flex items-center gap-0.5 font-medium"
              >
                carto.com/basemaps/apikey <ExternalLink className="w-3 h-3" />
              </a>.
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[#252124]">
                Publishable API Key (Saved in browser session &amp; local storage)
              </label>
              <input
                type="text"
                placeholder="Paste CARTO API Key..."
                defaultValue={activeCartoKey}
                onChange={(e) => setTempInputKey(e.target.value)}
                className="w-full bg-[#FCF6F5] border border-[#E7DAD8] rounded-xl px-3 py-2 text-xs text-[#252124] placeholder:text-[#786D6D] focus:outline-none focus:border-[#990011]"
              />
              <span className="text-[10px] text-[#786D6D] block">
                Production builds also read <code className="text-[#990011] font-mono">VITE_CARTO_API_KEY</code> from Render environment variables.
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#E7DAD8]">
              {activeCartoKey && (
                <button
                  onClick={() => handleSaveCustomKey('')}
                  className="text-xs text-[#990011] hover:underline cursor-pointer"
                >
                  Clear Key
                </button>
              )}
              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => setShowKeyModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#786D6D] hover:bg-[#EDE4E2] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveCustomKey(tempInputKey || activeCartoKey)}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-[#990011] hover:bg-[#80000e] text-white cursor-pointer"
                >
                  Save &amp; Reload Map
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Controls (Top-Right) */}
      <div className="absolute top-3 right-3 z-[1000] flex items-center gap-2">
        {/* Basemap Style Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowStyleMenu(!showStyleMenu);
              setShowLayersMenu(false);
            }}
            className="bg-[#FFFFFF]/95 backdrop-blur-md border border-[#E7DAD8] hover:border-[#990011]/50 text-[#252124] px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            title="Select GIS Basemap Style"
          >
            <Compass className="w-3.5 h-3.5 text-[#990011]" />
            <span className="hidden sm:inline">
              {mapStyle === 'POSITRON' ? 'Positron' : mapStyle === 'VOYAGER' ? 'Voyager' : mapStyle === 'DARK' ? 'Dark Matter' : 'OpenStreetMap'}
            </span>
          </button>

          {showStyleMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[#FFFFFF] rounded-xl shadow-2xl border border-[#E7DAD8] p-2 space-y-1 text-xs z-[1050] text-[#252124]">
              <div className="font-semibold text-[#786D6D] text-[10px] uppercase border-b border-[#E7DAD8] pb-1 px-2">
                Basemap Provider
              </div>
              <button
                onClick={() => {
                  setMapStyle('POSITRON');
                  setShowStyleMenu(false);
                }}
                className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                  mapStyle === 'POSITRON' ? 'bg-[#EDE4E2] text-[#990011] font-semibold' : 'text-[#252124] hover:bg-[#FCF6F5]'
                }`}
              >
                <span>CARTO Positron (Light)</span>
                {mapStyle === 'POSITRON' && <span className="w-1.5 h-1.5 rounded-full bg-[#990011]" />}
              </button>
              <button
                onClick={() => {
                  setMapStyle('VOYAGER');
                  setShowStyleMenu(false);
                }}
                className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                  mapStyle === 'VOYAGER' ? 'bg-[#EDE4E2] text-[#990011] font-semibold' : 'text-[#252124] hover:bg-[#FCF6F5]'
                }`}
              >
                <span>CARTO Voyager (Detailed)</span>
                {mapStyle === 'VOYAGER' && <span className="w-1.5 h-1.5 rounded-full bg-[#990011]" />}
              </button>
              <button
                onClick={() => {
                  setMapStyle('DARK');
                  setShowStyleMenu(false);
                }}
                className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                  mapStyle === 'DARK' ? 'bg-[#EDE4E2] text-[#990011] font-semibold' : 'text-[#252124] hover:bg-[#FCF6F5]'
                }`}
              >
                <span>CARTO Dark Matter</span>
                {mapStyle === 'DARK' && <span className="w-1.5 h-1.5 rounded-full bg-[#990011]" />}
              </button>
              <button
                onClick={() => {
                  setMapStyle('OSM');
                  setShowStyleMenu(false);
                }}
                className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                  mapStyle === 'OSM' ? 'bg-[#EDE4E2] text-[#990011] font-semibold' : 'text-[#252124] hover:bg-[#FCF6F5]'
                }`}
              >
                <span>OpenStreetMap (No Key)</span>
                {mapStyle === 'OSM' && <span className="w-1.5 h-1.5 rounded-full bg-[#990011]" />}
              </button>
            </div>
          )}
        </div>

        {/* CARTO Key Config Button */}
        <button
          onClick={() => setShowKeyModal(true)}
          className={`p-1.5 rounded-xl border text-xs font-semibold transition-colors shadow-sm cursor-pointer flex items-center gap-1 ${
            activeCartoKey
              ? 'bg-[#FFFFFF]/95 border-[#10B981]/40 text-[#047857] hover:bg-[#FCF6F5]'
              : 'bg-[#FFFFFF]/95 border-[#F59E0B]/40 text-[#B45309] hover:bg-[#FCF6F5]'
          }`}
          title={activeCartoKey ? 'CARTO Key Active (Click to edit)' : 'Configure CARTO API Key'}
        >
          <Key className="w-3.5 h-3.5" />
          <span className="hidden md:inline text-[10px]">
            {activeCartoKey ? 'Key Active' : 'Set Key'}
          </span>
        </button>

        {/* Fullscreen Toggle Button */}
        <button
          onClick={toggleFullscreen}
          className={`backdrop-blur-md shadow-sm px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            isFullscreen
              ? 'bg-[#990011] hover:bg-[#80000e] text-white border-[#990011] ring-2 ring-[#990011]/30'
              : 'bg-[#FFFFFF]/95 hover:bg-[#FCF6F5] text-[#252124] border-[#E7DAD8] hover:border-[#990011]'
          }`}
          title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Open Fullscreen Interactive Map'}
        >
          {isFullscreen ? (
            <>
              <Minimize2 className="w-4 h-4" />
              <span className="hidden sm:inline">Exit Fullscreen</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-4 h-4 text-[#990011]" />
              <span className="hidden sm:inline">Fullscreen</span>
            </>
          )}
        </button>

        {/* Floating Layer Control Panel */}
        <div className="relative">
          <button
            onClick={() => setShowLayersMenu(!showLayersMenu)}
            className="bg-[#FFFFFF]/95 backdrop-blur-md shadow-sm px-3 py-2 rounded-xl border border-[#E7DAD8] text-xs font-bold text-[#252124] flex items-center gap-2 hover:bg-[#FCF6F5] hover:border-[#990011]/50 transition-all cursor-pointer"
          >
            <Layers className="w-4 h-4 text-[#990011]" />
            <span className="hidden xs:inline">Layers</span>
          </button>

          {showLayersMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-[#FFFFFF] rounded-2xl shadow-2xl border border-[#E7DAD8] p-3 space-y-2 text-xs z-[1050] text-[#252124]">
              <div className="font-bold text-[#786D6D] text-[10px] uppercase border-b border-[#E7DAD8] pb-1.5 flex items-center justify-between">
                <span>GIS Overlays</span>
                <span className="text-[#990011] font-mono">LIVE</span>
              </div>
              <label className="flex items-center justify-between cursor-pointer py-1 text-[#252124]">
                <span className="font-medium">Road Corridors</span>
                <input
                  type="checkbox"
                  checked={showRoads}
                  onChange={(e) => setShowRoads(e.target.checked)}
                  className="rounded text-[#990011] focus:ring-0"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer py-1 text-[#252124]">
                <span className="font-medium">Bridge Sensors</span>
                <input
                  type="checkbox"
                  checked={showBridges}
                  onChange={(e) => setShowBridges(e.target.checked)}
                  className="rounded text-[#990011] focus:ring-0"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer py-1 text-[#252124]">
                <span className="font-medium">Strategic Depots</span>
                <input
                  type="checkbox"
                  checked={showDepots}
                  onChange={(e) => setShowDepots(e.target.checked)}
                  className="rounded text-[#990011] focus:ring-0"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer py-1 text-[#252124]">
                <span className="font-medium">Tracked Fleet</span>
                <input
                  type="checkbox"
                  checked={showVehicles}
                  onChange={(e) => setShowVehicles(e.target.checked)}
                  className="rounded text-[#990011] focus:ring-0"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer py-1 text-[#252124]">
                <span className="font-medium">District Nodes</span>
                <input
                  type="checkbox"
                  checked={showDistricts}
                  onChange={(e) => setShowDistricts(e.target.checked)}
                  className="rounded text-[#990011] focus:ring-0"
                />
              </label>
              <div className="pt-2 border-t border-[#E7DAD8] text-[10px] text-[#786D6D] flex items-center justify-between">
                <span>Auto-refresh active</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Map Legend (Bottom-Left) */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-[#FFFFFF]/95 backdrop-blur-md px-3 py-2.5 rounded-xl border border-[#E7DAD8] shadow-sm text-[11px] space-y-1.5 max-w-[200px] xs:max-w-none text-[#252124]">
        <div className="font-semibold text-[#990011] text-[10px] uppercase tracking-wider mb-1 flex items-center justify-between gap-3">
          <span>Corridor Status</span>
          <span className="text-[9px] text-[#786D6D] font-mono">89 NODES</span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
            <span className="text-[#786D6D] text-[10px]">Open</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span>
            <span className="text-[#786D6D] text-[10px]">Restricted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]"></span>
            <span className="text-[#786D6D] text-[10px]">Degraded</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#990011]"></span>
            <span className="text-[#786D6D] text-[10px]">Closed</span>
          </div>
        </div>
      </div>
    </div>
  );
};
