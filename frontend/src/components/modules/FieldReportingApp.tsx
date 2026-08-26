import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { useLanguage } from '../../context/LanguageContext';
import { ARMeasurementModal } from '../common/ARMeasurementModal';
import { DigitalSignatureModal } from '../common/DigitalSignatureModal';
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
  Sparkles
} from 'lucide-react';

export const FieldReportingApp: React.FC = () => {
  const {
    fieldReports,
    addNewReport,
    networkMode,
    setIsARModalOpen,
    setIsSignatureModalOpen,
    addToast
  } = usePlatform();
  const { t } = useLanguage();

  const [reporterName, setReporterName] = useState('Ranjan Hazarika');
  const [reporterRole, setReporterRole] = useState('PWD Junior Engineer');
  const [district, setDistrict] = useState('AS-KAM');
  const [locationName, setLocationName] = useState('NH-27 Changsari Culvert Km 14');
  const [incidentType, setIncidentType] = useState('Roadbed Erosion / Pavement Subsidence');
  const [crackSpan, setCrackSpan] = useState(4.5);
  const [potholeDepth, setPotholeDepth] = useState(24.0);
  const [debrisVol, setDebrisVol] = useState(8.0);
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [sosSent, setSosSent] = useState(false);

  const handleVoiceRecord = () => {
    setIsListeningVoice(true);
    addToast('Voice-to-Text Active', 'Speech recognition listening in regional language...', 'INFO');
    setTimeout(() => {
      setIsListeningVoice(false);
      setLocationName('NH-13 Sela Pass West Curve Km 42');
      setIncidentType('Active Rockslide with Mud Slurry');
      addToast('Voice Transcribed', 'Field audio converted to structured incident text.', 'SUCCESS');
    }, 1800);
  };

  const handleSOS = () => {
    setSosSent(true);
    addToast('🚨 SATELLITE SOS BROADCASTED', 'One-tap emergency beacon sent to State Disaster Control Room.', 'DANGER');
    setTimeout(() => setSosSent(false), 5000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRep = {
      id: `REP-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
      reporter_name: reporterName,
      reporter_role: reporterRole,
      state: 'Assam',
      district,
      location_name: locationName,
      lat: 26.2410,
      lng: 91.6820,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
      incident_type: incidentType,
      damage_dimensions: {
        crack_length_m: crackSpan,
        pothole_depth_cm: potholeDepth,
        debris_volume_cum: debrisVol
      },
      ai_severity_predicted: debrisVol > 20 ? 'SEVERE (Tier 3 Action)' : 'MODERATE (Tier 2 Action)',
      status: 'VERIFIED_QUEUED',
      assigned_crew: 'State PWD Rapid Action Division',
      points_awarded: 50
    };

    addNewReport(newRep);
    addToast('Report Logged Successfully', `Report #${newRep.id} stamped with GPS EXIF metadata. +50 Reporter Points awarded!`, 'SUCCESS');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-[#D1D5DB] flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div>
          <h2 className="text-base font-black text-[#1E3A5F]">
            {t('module_6')} — PWA Field Inspector & SDRF Portal
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Offline-first reporting, AR LiDAR crack measurement, digital delivery sign-off, and one-tap satellite SOS
          </p>
        </div>

        {/* SOS Emergency Button */}
        <button
          onClick={handleSOS}
          className={`px-4 py-2 rounded-lg font-black text-xs flex items-center gap-1.5 shadow-md transition-all ${
            sosSent ? 'bg-red-800 text-white animate-bounce' : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>{sosSent ? 'SOS BEACON TRANSMITTING...' : 'ONE-TAP SATELLITE SOS'}</span>
        </button>
      </div>

      {/* Main Grid: Mobile Form Wizard (6 cols), Gamification Leaderboard & Recent Reports (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Interactive Field Report Form (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-[#D1D5DB] shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between border-b pb-3">
            <span className="font-bold text-[#1E3A5F] text-xs uppercase flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-blue-600" /> Geo-Tagged Incident Submission Wizard
            </span>
            {networkMode === 'OFFLINE' && (
              <span className="bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                <WifiOff className="w-3 h-3" /> Offline Queueing Active
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Reporter details */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Field Official Name</label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-[#1E3A5F]"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Designation / Unit</label>
                <input
                  type="text"
                  value={reporterRole}
                  onChange={(e) => setReporterRole(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-xs font-semibold"
                />
              </div>
            </div>

            {/* Location & Voice helper */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-gray-700">Location / Highway Milestone</label>
                <button
                  type="button"
                  onClick={handleVoiceRecord}
                  className="text-blue-700 hover:text-blue-900 font-bold text-[11px] flex items-center gap-1"
                >
                  <Mic className={`w-3.5 h-3.5 ${isListeningVoice ? 'text-red-500 animate-pulse' : ''}`} />
                  <span>{isListeningVoice ? 'Listening...' : 'Voice-to-Text (8 Languages)'}</span>
                </button>
              </div>
              <input
                type="text"
                required
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. NH-27 Changsari Culvert Km 14"
                className="w-full p-2 border border-gray-300 rounded-lg text-xs font-semibold"
              />
            </div>

            {/* Incident Type */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">Hazard / Incident Classification</label>
              <select
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg text-xs font-semibold"
              >
                <option value="Roadbed Erosion / Pavement Subsidence">Roadbed Erosion / Pavement Subsidence</option>
                <option value="Active Rockslide / Debris Avalanche">Active Rockslide / Debris Avalanche</option>
                <option value="Bridge Scour / Girder Damage">Bridge Scour / Girder Damage</option>
                <option value="Waterlogging / Flash Flood Submersion">Waterlogging / Flash Flood Submersion</option>
                <option value="Fallen Tree / Powerline Obstruction">Fallen Tree / Powerline Obstruction</option>
              </select>
            </div>

            {/* AR Dimension measurement launcher */}
            <div className="p-3.5 bg-[#EBF3FB] rounded-xl border border-blue-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1E3A5F] flex items-center gap-1.5">
                  <Ruler className="w-4 h-4 text-blue-700" /> AR LiDAR Damage Dimension Measurement
                </span>
                <button
                  type="button"
                  onClick={() => setIsARModalOpen(true)}
                  className="btn-primary text-[11px] py-1 px-2.5"
                >
                  Launch AR Camera
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                <div className="bg-white p-2 rounded border">
                  <span className="text-gray-500 block">Crack Span</span>
                  <strong className="text-[#1E3A5F]">{crackSpan} m</strong>
                </div>
                <div className="bg-white p-2 rounded border">
                  <span className="text-gray-500 block">Pothole Depth</span>
                  <strong className="text-amber-800">{potholeDepth} cm</strong>
                </div>
                <div className="bg-white p-2 rounded border">
                  <span className="text-gray-500 block">Debris Volume</span>
                  <strong className="text-sky-800">{debrisVol} m³</strong>
                </div>
              </div>
            </div>

            {/* Digital Signature Pod Trigger */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsSignatureModalOpen(true)}
                className="flex-1 btn-secondary text-xs py-2 justify-center"
              >
                <PenTool className="w-3.5 h-3.5 text-sky-700" /> Digital Proof of Delivery
              </button>
              <button
                type="submit"
                className="flex-1 btn-primary text-xs py-2 justify-center shadow-md"
              >
                <Send className="w-3.5 h-3.5" /> Submit Verified Report
              </button>
            </div>
          </form>
        </div>

        {/* Right: Gamified Leaderboard & Recent Verified Reports (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Gamification Points Leaderboard */}
          <div className="bg-white p-4 rounded-xl border border-[#D1D5DB] shadow-xs space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#1E3A5F] flex items-center gap-1.5 uppercase tracking-wider">
                <Award className="w-4 h-4 text-amber-500" /> Field Scout Leaderboard
              </span>
              <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">
                Monthly State Honors
              </span>
            </div>

            <div className="space-y-2">
              {[
                { rank: '🥇 #1', name: 'Khrawbok Lyngdoh', state: 'Meghalaya', points: 1450, badge: 'Master Scout' },
                { rank: '🥈 #2', name: 'Ranjan Hazarika', state: 'Assam', points: 1280, badge: 'Veteran Surveyor' },
                { rank: '🥉 #3', name: 'Pemba Tashi', state: 'Arunachal Pradesh', points: 1150, badge: 'Alpine Scout' },
                { rank: '🎖️ #4', name: 'Thangminlun Haokip', state: 'Manipur', points: 980, badge: 'Hill Pathfinder' }
              ].map((user, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-gray-50/80 border border-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs">{user.rank}</span>
                    <div>
                      <span className="font-bold text-gray-900 block">{user.name}</span>
                      <span className="text-[10px] text-gray-500">{user.state} • {user.badge}</span>
                    </div>
                  </div>
                  <span className="font-black text-amber-800 text-xs">{user.points} pts</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Field Reports Log */}
          <div className="bg-white p-4 rounded-xl border border-[#D1D5DB] shadow-xs space-y-2 text-xs">
            <h3 className="font-bold text-[#1E3A5F] text-xs uppercase tracking-wider">
              Recent Verified Incident Log
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {fieldReports.slice(0, 3).map((r) => (
                <div key={r.id} className="p-2.5 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between font-bold text-gray-800">
                    <span>{r.location_name}</span>
                    <span className="text-emerald-700 text-[10px]">+{r.points_awarded} pts</span>
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">{r.incident_type}</div>
                  <div className="text-[10px] text-blue-700 font-semibold mt-1">
                    AI Severity: {r.ai_severity_predicted}
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
        }}
      />
      <DigitalSignatureModal />
    </div>
  );
};
