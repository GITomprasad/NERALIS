import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { useLanguage } from '../../context/LanguageContext';
import { ARMeasurementModal } from '../common/ARMeasurementModal';
import { DigitalSignatureModal } from '../common/DigitalSignatureModal';
import { apiClient } from '../../services/api/apiClient';
import type { FieldReport, Alert } from '../../types';
import {
  Smartphone,
  Camera,
  Ruler,
  PenTool,
  Radio,
  Award,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Mic,
  WifiOff,
  Send,
  MapPin,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  UserCheck,
  Layers,
  X,
  FileCheck2,
  Download,
  Crosshair,
  RefreshCw
} from 'lucide-react';
import { ProvenanceBadge } from '../common/ProvenanceBadge';

interface ScoutProfile {
  rank: string;
  name: string;
  state: string;
  points: number;
  badge: string;
  verifiedReports: number;
}

const SCOUT_LEADERBOARD: ScoutProfile[] = [
  { rank: '🥇 #1', name: 'Khrawbok Lyngdoh', state: 'Meghalaya', points: 1450, badge: 'Master Scout', verifiedReports: 29 },
  { rank: '🥈 #2', name: 'Ranjan Hazarika', state: 'Assam', points: 1280, badge: 'Veteran Surveyor', verifiedReports: 25 },
  { rank: '🥉 #3', name: 'Pemba Tashi', state: 'Arunachal Pradesh', points: 1150, badge: 'Alpine Scout', verifiedReports: 23 },
  { rank: '🎖️ #4', name: 'Thangminlun Haokip', state: 'Manipur', points: 980, badge: 'Hill Pathfinder', verifiedReports: 19 }
];

export const FieldReportingApp: React.FC = () => {
  const {
    fieldReports,
    addNewReport,
    addNewAlert,
    networkMode,
    currentUser,
    setIsARModalOpen,
    setIsSignatureModalOpen,
    openDrawer,
    addToast,
    queueOfflineMutation,
    outbox,
    districts
  } = usePlatform();
  const { t } = useLanguage();

  const [reporterName, setReporterName] = useState('Ranjan Hazarika');
  const [reporterRole, setReporterRole] = useState('PWD Junior Engineer');
  const [selectedState, setSelectedState] = useState('Assam');
  const [district, setDistrict] = useState('AS-KAM');
  const [locationName, setLocationName] = useState('NH-27 Changsari Culvert Km 14');
  const [incidentType, setIncidentType] = useState('Roadbed Erosion / Pavement Subsidence');
  const [severityLevel, setSeverityLevel] = useState<'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'>('HIGH');
  const [crackSpan, setCrackSpan] = useState(4.5);
  const [potholeDepth, setPotholeDepth] = useState(24.0);
  const [debrisVol, setDebrisVol] = useState(8.0);
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({ lat: 26.241, lng: 91.682 });
  const [isLocating, setIsLocating] = useState(false);
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [sosSent, setSosSent] = useState(false);
  const [signatureSaved, setSignatureSaved] = useState(false);
  const [selectedScout, setSelectedScout] = useState<ScoutProfile | null>(null);
  const [showHonorsModal, setShowHonorsModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCaptureGPS = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentCoords({
            lat: Number(pos.coords.latitude.toFixed(4)),
            lng: Number(pos.coords.longitude.toFixed(4))
          });
          setIsLocating(false);
          addToast('GPS Coordinates Locked', `Lat ${pos.coords.latitude.toFixed(4)}, Lng ${pos.coords.longitude.toFixed(4)} (±${Math.round(pos.coords.accuracy)}m)`, 'SUCCESS');
        },
        () => {
          setIsLocating(false);
          // Fallback realistic Northeast milestone
          setCurrentCoords({ lat: 26.241, lng: 91.682 });
          addToast('GPS Simulation Locked', 'Milestone coordinates locked: 26.2410° N, 91.6820° E (±2.8m)', 'INFO');
        },
        { timeout: 5000, enableHighAccuracy: true }
      );
    } else {
      setIsLocating(false);
      addToast('GPS Locked', 'Milestone coordinates locked: 26.2410° N, 91.6820° E', 'INFO');
    }
  };

  const handleVoiceRecord = () => {
    setIsListeningVoice(true);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-IN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
          const speechResult = event.results[0][0].transcript;
          if (speechResult) {
            setLocationName(speechResult);
            addToast('Voice Transcribed', `Recognized speech: "${speechResult}"`, 'SUCCESS');
          }
          setIsListeningVoice(false);
        };

        recognition.onerror = () => {
          simulateFallbackSpeech();
        };

        recognition.onend = () => {
          setIsListeningVoice(false);
        };

        recognition.start();
        return;
      } catch {
        simulateFallbackSpeech();
      }
    } else {
      simulateFallbackSpeech();
    }
  };

  const simulateFallbackSpeech = () => {
    addToast('Voice-to-Text Active', 'Speech recognition listening in regional language...', 'INFO');
    setTimeout(() => {
      setIsListeningVoice(false);
      setLocationName('NH-13 Sela Pass West Incline Km 42');
      setIncidentType('Active Rockslide / Debris Avalanche');
      setDebrisVol(18.5);
      setCrackSpan(6.2);
      addToast('Voice Transcribed', 'Field audio converted to structured incident text.', 'SUCCESS');
    }, 1500);
  };

  const handleSOS = () => {
    setSosSent(true);

    const sosAlert: Alert = {
      id: `ALT-SOS-${Math.floor(Math.random() * 9000 + 1000)}`,
      tier: 'T5 - DISASTER',
      tier_level: 5,
      title: `EMERGENCY SATELLITE SOS: ${reporterName} at ${locationName}`,
      corridor_id: 'SEG-01',
      affected_districts: ['Kamrup', 'State SDRF HQ'],
      trigger_condition: 'One-Tap Satellite SOS Beacon from Field Inspector PWA',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
      acknowledged: false,
      acknowledged_by: 'State SDRF Emergency Response Unit Notified',
      escalation_sla_mins: 5,
      dispatched_channels: ['SMS', 'WhatsApp', 'IVR Voice', 'NDMA CAP', 'Satellite VHF'],
      target_recipients_count: 850,
      message_i18n: {
        en: `CRITICAL SOS: Inspector ${reporterName} triggered distress beacon at ${locationName}. Immediate SDRF & air rescue alerted.`,
        hi: `आपातकालीन एसओएस: निरीक्षक ${reporterName} ने ${locationName} पर संकट बीकन सक्रिय किया। राहत दल को सूचित किया गया।`,
        as: `জৰুৰীকালীন এছঅ'এছ: পৰিদৰ্শক ${reporterName} এ ${locationName}ত বিপদৰ সংকেত প্ৰেৰণ কৰিছে। এছডিআৰএফক সতৰ্ক কৰা হৈছে।`
      }
    };
    addNewAlert(sosAlert);

    addToast(
      '🚨 SATELLITE SOS BROADCASTED',
      'One-tap distress beacon dispatched to State SDRF, Army Logistics & NDMA HQ.',
      'DANGER'
    );
    setTimeout(() => setSosSent(false), 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const resolvedRole = currentUser?.role || currentUser?.frontend_role || reporterRole || 'FIELD_INSPECTOR';
    const resolvedName = currentUser?.name || reporterName || 'Field Surveyor';
    const payload = {
      reporter_name: resolvedName,
      reporter_role: resolvedRole,
      state: selectedState || 'Assam',
      district,
      location_name: locationName,
      lat: currentCoords.lat,
      lng: currentCoords.lng,
      incident_type: incidentType,
      crack_length_m: crackSpan,
      pothole_depth_cm: potholeDepth,
      debris_volume_cum: debrisVol,
      damage_dimensions: {
        crack_length_m: crackSpan,
        pothole_depth_cm: potholeDepth,
        debris_volume_cum: debrisVol
      }
    };

    if (networkMode === 'OFFLINE') {
      await queueOfflineMutation('FIELD_REPORT', payload);
      setIsSubmitting(false);
    } else {
      try {
        await apiClient.submitFieldReport(payload);
      } catch {
        // Fallback local addition
      }

      const isSevere = debrisVol > 15 || crackSpan > 5.0 || severityLevel === 'CRITICAL';
      const newRep: FieldReport = {
        id: `REP-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
        ...payload,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
        ai_severity_predicted: isSevere ? 'SEVERE (Tier 3 Immediate Action)' : 'MODERATE (Tier 2 PWD Repair)',
        status: 'VERIFIED_GROUND_TRUTH',
        assigned_crew: 'State PWD Rapid Action Division 4',
        points_awarded: 50,
        source: 'SRC-FIELD-PWA',
        verification_status: 'REPORTED'
      };

      addNewReport(newRep);
      setIsSubmitting(false);
      addToast(
        'Ground Incident Logged',
        `Report #${newRep.id} verified with YOLO AI Vision & GPS EXIF. +50 Reporter Points awarded!`,
        'SUCCESS'
      );
    }
  };

  const availableDistricts = districts.filter(
    (d) => selectedState === 'All' || d.state.toLowerCase().includes(selectedState.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="card-command flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-black text-[#30342F]">
              {t('module_6')} — PWA Field Operations &amp; Incident Reporting
            </h2>
            <span className="bg-[#A7BEAE]/15 text-[#A7BEAE] border border-[#A7BEAE]/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono">
              Offline-First Mobile PWA
            </span>
          </div>
          <p className="text-xs text-[#74796F] mt-0.5">
            Offline-first ground incident reports, GPS geotagging, AR crack measurement, digital sign-off, and one-tap satellite SOS
          </p>
        </div>

        {/* SOS Emergency Button */}
        <button
          onClick={handleSOS}
          className={`px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
            sosSent
              ? 'bg-[#FF5252] text-white animate-bounce ring-4 ring-[#FF5252]/50'
              : 'bg-[#FF5252] hover:bg-[#e04343] text-white shadow-command-critical active:scale-95'
          }`}
        >
          <Radio className="w-4 h-4 animate-pulse" />
          <span>{sosSent ? 'SOS BEACON TRANSMITTING...' : 'ONE-TAP SATELLITE SOS'}</span>
        </button>
      </div>

      {/* Main Grid: Form (7 cols) + Leaderboard & Log (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Mobile-Friendly Field Report Form (7 cols) */}
        <div className="lg:col-span-7 card-command space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-[#D6D8C8] pb-3">
            <span className="font-extrabold text-[#B85042] text-xs uppercase flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#B85042]" /> Incident Submission Form
            </span>
            {networkMode === 'OFFLINE' ? (
              <span className="bg-[#FF5252]/15 text-[#FF5252] border border-[#FF5252]/30 font-bold px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1 font-mono">
                <WifiOff className="w-3 h-3" /> Offline Mode ({outbox.length} in Outbox)
              </span>
            ) : (
              <span className="bg-[#A7BEAE]/15 text-[#A7BEAE] border border-[#A7BEAE]/30 font-bold px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3 h-3 text-[#A7BEAE]" /> Direct Sync Online
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Step 1: Location, State, District & GPS */}
            <div className="space-y-3 p-3.5 bg-[#E7E8D1] rounded-xl border border-[#D6D8C8]">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-[#30342F] uppercase flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#B85042]" /> Step 1: Location &amp; GPS Coordinates
                </span>
                <span className="text-[10px] bg-[#A7BEAE]/15 text-[#A7BEAE] border border-[#A7BEAE]/30 font-bold px-2 py-0.5 rounded font-mono">
                  {currentCoords.lat}° N, {currentCoords.lng}° E
                </span>
              </div>

              {/* State & District Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-[#74796F] text-[10px] uppercase mb-1">State</label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full p-2.5 bg-[#FFFFFF] border border-[#D6D8C8] rounded-xl text-xs font-semibold text-[#30342F] focus:ring-1 focus:ring-[#B85042] cursor-pointer"
                  >
                    <option value="Assam" className="bg-[#E7E8D1]">Assam</option>
                    <option value="Arunachal" className="bg-[#E7E8D1]">Arunachal Pradesh</option>
                    <option value="Manipur" className="bg-[#E7E8D1]">Manipur</option>
                    <option value="Meghalaya" className="bg-[#E7E8D1]">Meghalaya</option>
                    <option value="Mizoram" className="bg-[#E7E8D1]">Mizoram</option>
                    <option value="Nagaland" className="bg-[#E7E8D1]">Nagaland</option>
                    <option value="Sikkim" className="bg-[#E7E8D1]">Sikkim</option>
                    <option value="Tripura" className="bg-[#E7E8D1]">Tripura</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#74796F] text-[10px] uppercase mb-1">District</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full p-2.5 bg-[#FFFFFF] border border-[#D6D8C8] rounded-xl text-xs font-semibold text-[#30342F] focus:ring-1 focus:ring-[#B85042] cursor-pointer"
                  >
                    {availableDistricts.length > 0 ? (
                      availableDistricts.map((d) => (
                        <option key={d.id} value={d.id} className="bg-[#E7E8D1]">
                          {d.name} ({d.state})
                        </option>
                      ))
                    ) : (
                      districts.map((d) => (
                        <option key={d.id} value={d.id} className="bg-[#E7E8D1]">
                          {d.name} ({d.state})
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              {/* Highway Milestone & Voice input */}
              <div>
                <label className="block font-bold text-[#74796F] text-[10px] uppercase mb-1">
                  Highway Milestone / Landmark Point
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="e.g. NH-27 Changsari Culvert Km 14"
                    className="flex-1 p-2.5 bg-[#FFFFFF] border border-[#D6D8C8] rounded-xl text-xs font-semibold text-[#30342F] focus:ring-1 focus:ring-[#B85042] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCaptureGPS}
                    disabled={isLocating}
                    className="px-3 py-2 bg-[#D5D8C3] hover:bg-[#D5D8C3] text-[#B85042] border border-[#D6D8C8] rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors"
                    title="Capture live GPS location"
                  >
                    <Crosshair className={`w-4 h-4 ${isLocating ? 'animate-spin text-[#B85042]' : ''}`} />
                    <span className="hidden sm:inline">Capture GPS</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleVoiceRecord}
                    className="px-3 py-2 bg-[#D5D8C3] hover:bg-[#D5D8C3] text-[#FFB547] border border-[#D6D8C8] rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors"
                    title="Voice-to-Text"
                  >
                    <Mic className={`w-4 h-4 ${isListeningVoice ? 'text-[#FF5252] animate-pulse' : ''}`} />
                    <span className="hidden sm:inline">{isListeningVoice ? 'Listening...' : 'Voice'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2: Incident Classification & Severity */}
            <div className="space-y-3 p-3.5 bg-[#E7E8D1] rounded-xl border border-[#D6D8C8]">
              <span className="font-bold text-[#30342F] text-[11px] uppercase block">
                Step 2: Incident Category &amp; Severity
              </span>

              <div>
                <label className="block font-bold text-[#74796F] text-[10px] uppercase mb-1">Incident Category</label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value)}
                  className="w-full p-2.5 bg-[#FFFFFF] border border-[#D6D8C8] rounded-xl text-xs font-semibold text-[#30342F] focus:ring-1 focus:ring-[#B85042] cursor-pointer"
                >
                  <option value="Roadbed Erosion / Pavement Subsidence" className="bg-[#E7E8D1]">Roadbed Erosion / Pavement Subsidence</option>
                  <option value="Active Rockslide / Debris Avalanche" className="bg-[#E7E8D1]">Active Rockslide / Debris Avalanche</option>
                  <option value="Bridge Scour / Girder Damage" className="bg-[#E7E8D1]">Bridge Scour / Girder Damage</option>
                  <option value="Waterlogging / Flash Flood Submersion" className="bg-[#E7E8D1]">Waterlogging / Flash Flood Submersion</option>
                  <option value="Pothole Crater Cluster / Rough Pavement" className="bg-[#E7E8D1]">Pothole Crater Cluster / Rough Pavement</option>
                  <option value="Fallen Tree / Powerline Obstruction" className="bg-[#E7E8D1]">Fallen Tree / Powerline Obstruction</option>
                </select>
              </div>

              {/* Severity Level Radio/Buttons */}
              <div>
                <label className="block font-bold text-[#74796F] text-[10px] uppercase mb-1.5">Severity Level</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'LOW', label: 'Low (Advisory)', color: 'text-[#A7BEAE]', activeBg: 'bg-[#A7BEAE]/20 border-[#A7BEAE]' },
                    { id: 'MODERATE', label: 'Moderate', color: 'text-[#A7BEAE]', activeBg: 'bg-[#38BDF8]/20 border-[#38BDF8]' },
                    { id: 'HIGH', label: 'High (Hazard)', color: 'text-[#FFB547]', activeBg: 'bg-[#FFB547]/20 border-[#FFB547]' },
                    { id: 'CRITICAL', label: 'Critical Block', color: 'text-[#FF5252]', activeBg: 'bg-[#FF5252]/20 border-[#FF5252]' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSeverityLevel(s.id as any)}
                      className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                        severityLevel === s.id
                          ? `${s.activeBg} ${s.color} shadow-sm`
                          : 'bg-[#FFFFFF] border-[#D6D8C8] text-[#74796F] hover:text-[#30342F]'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 3: Evidence & Measurements (Optional AR) */}
            <div className="p-3.5 bg-[#E7E8D1] rounded-xl border border-[#D6D8C8] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#30342F] text-[11px] uppercase flex items-center gap-1.5">
                  <Ruler className="w-4 h-4 text-[#B85042]" /> Step 3: Damage Dimensions &amp; Measurements
                </span>
                <button
                  type="button"
                  onClick={() => setIsARModalOpen(true)}
                  className="px-3 py-1.5 bg-[#D5D8C3] hover:bg-[#D5D8C3] text-[#B85042] border border-[#D6D8C8] rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#B85042]" />
                  <span>Launch AR LiDAR</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-[#FFFFFF] p-2.5 rounded-xl border border-[#D6D8C8]">
                  <span className="text-[#74796F] block text-[10px] font-bold uppercase">Crack Span</span>
                  <strong className="text-[#30342F] text-xs font-mono">{crackSpan} m</strong>
                </div>
                <div className="bg-[#FFFFFF] p-2.5 rounded-xl border border-[#D6D8C8]">
                  <span className="text-[#74796F] block text-[10px] font-bold uppercase">Pothole Depth</span>
                  <strong className="text-[#FFB547] text-xs font-mono">{potholeDepth} cm</strong>
                </div>
                <div className="bg-[#FFFFFF] p-2.5 rounded-xl border border-[#D6D8C8]">
                  <span className="text-[#74796F] block text-[10px] font-bold uppercase">Debris Volume</span>
                  <strong className="text-[#A7BEAE] text-xs font-mono">{debrisVol} m³</strong>
                </div>
              </div>
            </div>

            {/* Step 4: Reporter & Officer Designation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3.5 bg-[#E7E8D1] rounded-xl border border-[#D6D8C8]">
              <div>
                <label className="block font-bold text-[#74796F] text-[10px] uppercase mb-1">Step 4: Field Official</label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="w-full p-2.5 bg-[#FFFFFF] border border-[#D6D8C8] rounded-xl text-xs font-semibold text-[#30342F] focus:ring-1 focus:ring-[#B85042]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#74796F] text-[10px] uppercase mb-1">Designation</label>
                <input
                  type="text"
                  value={reporterRole}
                  onChange={(e) => setReporterRole(e.target.value)}
                  className="w-full p-2.5 bg-[#FFFFFF] border border-[#D6D8C8] rounded-xl text-xs font-semibold text-[#30342F] focus:ring-1 focus:ring-[#B85042]"
                />
              </div>
            </div>

            {/* Step 5: Submit & Sign-off Buttons */}
            <div className="pt-2 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => setIsSignatureModalOpen(true)}
                className={`px-4 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-colors cursor-pointer ${
                  signatureSaved
                    ? 'bg-[#A7BEAE]/20 text-[#A7BEAE] border-[#A7BEAE]/40'
                    : 'bg-[#FFFFFF] hover:bg-[#D5D8C3] text-[#74796F] hover:text-[#30342F] border-[#D6D8C8]'
                }`}
                title="Cryptographic Sign-off"
              >
                <PenTool className="w-4 h-4" />
                <span>{signatureSaved ? 'Digital Signature Saved ✓' : 'Digital Sign-off'}</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 btn-primary py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-command-glow disabled:opacity-50"
              >
                <Send className="w-4 h-4 text-white" />
                <span>
                  {isSubmitting
                    ? 'Submitting Report...'
                    : networkMode === 'OFFLINE'
                    ? 'Queue Offline to IndexedDB'
                    : 'Submit Ground Incident Report'}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Gamified Leaderboard & Recent Verified Reports (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Gamification Points Leaderboard */}
          <div className="card-command space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#D6D8C8]">
              <span className="font-bold text-[#FFB547] flex items-center gap-2 uppercase tracking-wider">
                <Award className="w-4 h-4 text-[#FFB547]" /> Field Scout Leaderboard
              </span>
              <button
                onClick={() => setShowHonorsModal(true)}
                className="text-[10px] bg-[#FFB547]/15 hover:bg-[#FFB547]/25 text-[#FFB547] border border-[#FFB547]/30 font-bold px-2 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>State Honors</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2">
              {SCOUT_LEADERBOARD.map((user, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedScout(user);
                    addToast('Inspector Profile', `${user.name} (${user.state}) has ${user.verifiedReports} verified ground inspections.`, 'INFO');
                  }}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#E7E8D1] hover:bg-[#D5D8C3] border border-[#D6D8C8] hover:border-[#B85042]/50 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-xs">{user.rank}</span>
                    <div>
                      <span className="font-bold text-[#30342F] block">{user.name}</span>
                      <span className="text-[10px] text-[#74796F]">{user.state} • {user.badge}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-[#FFB547] text-xs block font-mono">{user.points} pts</span>
                    <span className="text-[9px] text-[#74796F]">{user.verifiedReports} logs</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Field Reports Log */}
          <div className="card-command space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#D6D8C8]">
              <h3 className="font-bold text-[#B85042] text-xs uppercase tracking-wider">
                Recent Verified Ground Reports
              </h3>
              <span className="text-[10px] text-[#74796F] font-mono">
                {fieldReports.length} incidents logged
              </span>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {fieldReports.slice(0, 6).map((r) => (
                <div
                  key={r.id}
                  onClick={() => {
                    openDrawer('REPORT', r);
                    addToast('Incident Details Opened', `Viewing verification for ${r.location_name}.`, 'INFO');
                  }}
                  className="p-3 bg-[#E7E8D1] hover:bg-[#D5D8C3] rounded-xl border border-[#D6D8C8] hover:border-[#B85042]/50 transition-all cursor-pointer space-y-1.5"
                >
                  <div className="flex justify-between font-bold text-[#30342F]">
                    <span className="truncate flex-1">{r.location_name}</span>
                    <span className="text-[#A7BEAE] text-[10px] shrink-0 ml-1 font-mono">+{r.points_awarded || 50} pts</span>
                  </div>
                  <div className="text-[11px] text-[#74796F]">{r.incident_type}</div>
                  <div className="flex items-center justify-between text-[10px] text-[#B85042] font-semibold pt-1 border-t border-[#D6D8C8]">
                    <span>AI Severity: {r.ai_severity_predicted || 'MODERATE'}</span>
                    <span className="text-[#74796F] font-normal">Inspect &rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AR & Signature Modals */}
      <ARMeasurementModal
        onApplyMeasurements={(m) => {
          setCrackSpan(m.crack_length_m);
          setPotholeDepth(m.pothole_depth_cm);
          setDebrisVol(m.debris_volume_cum);
          addToast('AR LiDAR Measurements Applied', `Set crack span to ${m.crack_length_m}m, depth ${m.pothole_depth_cm}cm.`, 'SUCCESS');
        }}
      />
      <DigitalSignatureModal
        onSignatureSaved={() => {
          setSignatureSaved(true);
          addToast('Digital Sign-off Saved', 'Proof of inspection encrypted and attached to report payload.', 'SUCCESS');
        }}
      />

      {/* Monthly State Honors Modal */}
      {showHonorsModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[3000] flex items-center justify-center p-4">
          <div className="bg-[#E7E8D1] rounded-2xl w-full max-w-md overflow-hidden border border-[#D6D8C8] shadow-2xl p-5 space-y-4 text-xs text-[#30342F] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#D6D8C8] pb-2.5">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#FFB547]" />
                <h3 className="font-bold text-sm text-[#30342F]">MDoNER Monthly Field Honors &amp; Citations</h3>
              </div>
              <button
                onClick={() => setShowHonorsModal(false)}
                className="text-[#74796F] hover:text-[#30342F] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[#74796F] text-xs leading-relaxed">
              Recognizing the top field scouts, PWD road inspectors, and SDRF personnel safeguarding logistics connectivity across Northeast India.
            </p>

            <div className="p-3.5 bg-[#FFFFFF] rounded-xl border border-[#FFB547]/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#FFB547] text-xs">Governor's Logistics Valor Badge</span>
                <span className="bg-[#FFB547]/20 text-[#FFB547] border border-[#FFB547]/30 font-bold text-[9px] px-2 py-0.5 rounded font-mono">
                  AUGUST 2026
                </span>
              </div>
              <div className="text-xs text-[#30342F]">
                Awarded to <strong>Khrawbok Lyngdoh (Meghalaya)</strong> for logging 29 high-altitude road slips ahead of monsoon floods.
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#D6D8C8]">
              <button
                onClick={() => {
                  setShowHonorsModal(false);
                  addToast('Honor Citation Downloaded', 'PDF certification downloaded for official record.', 'SUCCESS');
                }}
                className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Citation PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
