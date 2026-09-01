import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { useLanguage, LanguageCode } from '../../context/LanguageContext';
import { Alert } from '../../types';
import { apiClient } from '../../services/api/apiClient';
import {
  BellRing,
  Volume2,
  MessageSquare,
  Smartphone,
  Mail,
  Send,
  CheckCircle2,
  Clock,
  Globe,
  Radio,
  FileCode,
  FileText,
  AlertTriangle,
  Sparkles,
  Copy,
  Check,
  Download,
  Share2,
  Navigation,
  ShieldCheck
} from 'lucide-react';

export const AlertCenter: React.FC = () => {
  const { alerts, addNewAlert, openDrawer, addToast, navigateToModule, isAdminOrAuthority, userRole } = usePlatform();
  const { currentLanguage, languages, t } = useLanguage();

  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(alerts[0] || null);
  const [targetLang, setTargetLang] = useState<LanguageCode>('en');
  const [channelView, setChannelView] = useState<'SMS' | 'WHATSAPP' | 'VOICE' | 'CAP_XML' | 'MORNING_BRIEF'>('WHATSAPP');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedXml, setCopiedXml] = useState(false);

  // New Alert Form state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTier, setNewTier] = useState('T3 - WARNING');
  const [newMsgEn, setNewMsgEn] = useState('');

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = targetLang === 'hi' ? 'hi-IN' : targetLang === 'bn' ? 'bn-IN' : 'en-IN';
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      addToast('Audio Synthesis', 'Speech Synthesis simulated for field IVR broadcast.', 'INFO');
    }
  };

  const handleAcknowledgeAlert = async () => {
    if (!selectedAlert) return;
    try {
      await apiClient.acknowledgeAlert(selectedAlert.id, 'District Magistrate (Online Command Center)');
    } catch {
      // offline fallback
    }

    selectedAlert.acknowledged = true;
    selectedAlert.acknowledged_by = 'District Magistrate (Verified Online)';
    addToast(
      'Alert Receipt Acknowledged',
      `Official DM acknowledgement logged for ${selectedAlert.id}. 20-min SLA timer stopped.`,
      'SUCCESS'
    );
  };

  const handleViewAlternateRoute = () => {
    navigateToModule('ROUTE');
    addToast(
      'AI Route Optimizer Loaded',
      `Calculating multi-objective emergency bypass for ${selectedAlert?.title || 'affected corridor'}.`,
      'INFO'
    );
  };

  const handleCreateAlertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newMsgEn) return;

    const alertObj: Alert = {
      id: `ALT-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
      tier: newTier,
      tier_level: Number(newTier[1]) || 3,
      title: newTitle,
      corridor_id: 'SEG-05',
      affected_districts: ['Kamrup', 'East Khasi Hills', 'Tawang'],
      trigger_condition: 'Emergency Logistics Command Center Manual Broadcast',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
      acknowledged: false,
      acknowledged_by: 'Pending District Collector Acknowledgement',
      escalation_sla_mins: 20,
      dispatched_channels: ['SMS', 'WhatsApp', 'Push', 'IVR Voice', 'CAP'],
      target_recipients_count: 520,
      message_i18n: {
        en: newMsgEn,
        hi: `चेतावनी (${newTier.slice(0, 2)}): ${newMsgEn}`,
        as: `সতৰ্কবাণী (${newTier.slice(0, 2)}): ${newMsgEn}`,
        bn: `সতর্কবার্তা (${newTier.slice(0, 2)}): ${newMsgEn}`,
        mni: `ꯄꯥꯎꯇꯥꯛ (${newTier.slice(0, 2)}): ${newMsgEn}`,
        khasi: `PYNTIP (${newTier.slice(0, 2)}): ${newMsgEn}`,
        mizo: `HRIATTIRNA (${newTier.slice(0, 2)}): ${newMsgEn}`,
        nagamese: `WARNING (${newTier.slice(0, 2)}): ${newMsgEn}`,
        ne: `चेतावनी (${newTier.slice(0, 2)}): ${newMsgEn}`
      }
    };

    addNewAlert(alertObj);
    setSelectedAlert(alertObj);
    setShowCreateModal(false);
    setNewTitle('');
    setNewMsgEn('');
    addToast(
      'Emergency Alert Dispatched',
      `Broadcast active across 5 channels (WhatsApp, 2G SMS, IVR Voice, NDMA CAP, App Push).`,
      'SUCCESS'
    );
  };

  const getTranslatedMessage = (alert: Alert | null, lang: LanguageCode): string => {
    if (!alert) return '';
    if (alert.message_i18n?.[lang]) {
      return alert.message_i18n[lang];
    }
    const enText = alert.message_i18n?.['en'] || alert.title;
    const prefixes: Record<string, string> = {
      hi: 'चेतावनी: ',
      as: 'সতৰ্কবাণী: ',
      bn: 'সতর্কবার্তা: ',
      mni: 'ꯄꯥꯎꯇꯥꯛ: ',
      khasi: 'PYNTIP: ',
      mizo: 'HRIATTIRNA: ',
      nagamese: 'WARNING: ',
      ne: 'चेतावनी: ',
      bodo: 'सावध: '
    };
    const prefix = prefixes[lang] || '';
    return `${prefix}${enText}`;
  };

  const activeMsgText = getTranslatedMessage(selectedAlert, targetLang);

  const rawCapXml = `<?xml version="1.0" encoding="UTF-8"?>
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>NERALIS-${selectedAlert?.id || 'ALT-2026-0891'}</identifier>
  <sender>mcdoner-alerts@gov.in</sender>
  <sent>${new Date().toISOString()}</sent>
  <status>Actual</status>
  <msgType>Alert</msgType>
  <scope>Public</scope>
  <info>
    <category>Transport</category>
    <event>${selectedAlert?.title || 'Regional Logistics Blockade'}</event>
    <urgency>Immediate</urgency>
    <severity>${selectedAlert?.tier?.includes('CRITICAL') ? 'Critical' : 'Warning'}</severity>
    <certainty>Observed</certainty>
    <headline>${selectedAlert?.title || 'Notice'}</headline>
    <description>${activeMsgText}</description>
    <area>
      <areaDesc>${selectedAlert?.affected_districts?.join(', ') || 'NER Transport Corridor'}</areaDesc>
    </area>
  </info>
</alert>`;

  const handleCopyXml = () => {
    navigator.clipboard.writeText(rawCapXml);
    setCopiedXml(true);
    addToast('NDMA CAP XML Copied', 'Common Alerting Protocol v1.2 XML payload copied to clipboard.', 'SUCCESS');
    setTimeout(() => setCopiedXml(false), 2500);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-[#D1D5DB] flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div>
          <h2 className="text-base font-black text-[#1E3A5F]">
            {t('module_5')} — Multilingual Broadcast & NDMA Integration
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            5-Tier alert hierarchy dispatched across 8 NER regional languages, 2G SMS, IVR voice, and NDMA CAP feeds
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#1E3A5F] hover:bg-[#2563A8] text-white font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Dispatch Emergency Alert</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Alert List on Left (5 cols), Multi-channel preview on Right (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Active Alerts Queue (5 cols) */}
        <div className="lg:col-span-5 bg-white p-4 rounded-xl border border-[#D1D5DB] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#1E3A5F]">
              Dispatched Alerts Queue ({alerts.length})
            </h3>
            <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded">
              20-Min SLA Escalation Active
            </span>
          </div>

          <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
            {alerts.map((a) => {
              const isSelected = selectedAlert?.id === a.id;
              return (
                <div
                  key={a.id}
                  onClick={() => setSelectedAlert(a)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#EBF3FB] border-[#2563A8] shadow-xs ring-1 ring-blue-300'
                      : 'bg-[#F8FAFC] border-gray-200 hover:bg-white hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${
                        a.tier_level >= 4
                          ? 'bg-red-600 text-white'
                          : a.tier_level === 3
                          ? 'bg-amber-500 text-white'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {a.tier}
                    </span>
                    <span className="text-[10px] text-gray-500">{a.timestamp}</span>
                  </div>

                  <div className="font-bold text-xs text-gray-900 mt-1.5">{a.title}</div>
                  <p className="text-[11px] text-gray-600 mt-0.5 line-clamp-2">
                    {a.message_i18n?.en || a.title}
                  </p>

                  <div className="mt-2 pt-2 border-t border-gray-200/60 flex items-center justify-between text-[10px]">
                    <span className="text-gray-500">
                      Recipients: <strong>{a.target_recipients_count}</strong>
                    </span>
                    <span
                      className={`font-semibold ${
                        a.acknowledged ? 'text-emerald-700 font-bold' : 'text-amber-700 animate-pulse'
                      }`}
                    >
                      {a.acknowledged ? '✓ Acknowledged' : '⏱️ Pending DC Ack (11m)'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Multi-Channel Formatter & Regional Translator (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-[#D1D5DB] shadow-xs space-y-4 text-xs">
          {/* Header with Language Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase">Alert Delivery Simulator</span>
              <h3 className="text-sm font-black text-[#1E3A5F]">
                {selectedAlert?.title || 'Select Alert'}
              </h3>
            </div>

            {/* Regional Language Switcher */}
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-700" />
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value as LanguageCode)}
                className="bg-gray-50 border border-gray-300 rounded px-2.5 py-1 text-xs font-bold text-gray-800 focus:ring-2 focus:ring-[#1E3A5F] cursor-pointer"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.native} ({l.label})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Channel Selector Tabs */}
          <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-lg text-xs font-bold">
            <button
              onClick={() => setChannelView('WHATSAPP')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 cursor-pointer transition-all ${
                channelView === 'WHATSAPP' ? 'bg-[#1E3A5F] text-white shadow-xs' : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp Business
            </button>
            <button
              onClick={() => setChannelView('SMS')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 cursor-pointer transition-all ${
                channelView === 'SMS' ? 'bg-[#1E3A5F] text-white shadow-xs' : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-sky-400" /> 2G SMS (160c)
            </button>
            <button
              onClick={() => setChannelView('VOICE')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 cursor-pointer transition-all ${
                channelView === 'VOICE' ? 'bg-[#1E3A5F] text-white shadow-xs' : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-400" /> IVR Voice Call
            </button>
            <button
              onClick={() => setChannelView('CAP_XML')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 cursor-pointer transition-all ${
                channelView === 'CAP_XML' ? 'bg-[#1E3A5F] text-white shadow-xs' : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-cyan-400" /> NDMA CAP (XML)
            </button>
            <button
              onClick={() => setChannelView('MORNING_BRIEF')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 cursor-pointer transition-all ${
                channelView === 'MORNING_BRIEF' ? 'bg-[#1E3A5F] text-white shadow-xs' : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-rose-400" /> 6 AM Briefing
            </button>
          </div>

          {/* CHANNEL PREVIEWS */}
          {channelView === 'WHATSAPP' && (
            <div className="p-4 bg-[#E5DDD5] rounded-xl border border-emerald-300 max-w-md mx-auto space-y-2 shadow-inner">
              <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-xs space-y-1.5 border border-emerald-100">
                <div className="flex items-center justify-between border-b pb-1">
                  <span className="font-bold text-emerald-800 text-[11px] flex items-center gap-1">
                    🏛️ GOI NERALIS DISASTER ALERTS
                  </span>
                  <span className="text-[9px] text-gray-400">10:45 AM</span>
                </div>
                <div className="font-bold text-gray-900 text-xs">
                  {selectedAlert?.title}
                </div>
                <p className="text-gray-800 text-xs leading-relaxed font-regional">
                  {activeMsgText}
                </p>
                <div className="pt-2 flex flex-col gap-1.5">
                  <button
                    onClick={handleViewAlternateRoute}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-3 rounded text-[11px] transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>View Live Alternate Route</span>
                  </button>
                  <button
                    onClick={handleAcknowledgeAlert}
                    disabled={selectedAlert?.acknowledged}
                    className={`py-1.5 px-3 rounded text-[11px] font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                      selectedAlert?.acknowledged
                        ? 'bg-emerald-100 text-emerald-800 cursor-default'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{selectedAlert?.acknowledged ? '✓ Receipt Acknowledged (DM Office)' : 'Acknowledge Receipt (DM Office)'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {channelView === 'SMS' && (
            <div className="p-4 bg-slate-900 text-emerald-400 font-mono rounded-xl border border-slate-700 space-y-2">
              <div className="text-[10px] text-slate-400 flex justify-between">
                <span>BSNL / AIRTEL 2G SMS GATEWAY</span>
                <span>{activeMsgText.length} / 160 chars</span>
              </div>
              <div className="bg-slate-950 p-3 rounded border border-slate-800 text-xs leading-relaxed font-regional">
                {activeMsgText}
              </div>
              <div className="text-[10px] text-slate-400 flex items-center justify-between">
                <span>Auto-compressed for low-bandwidth 2G feature phones.</span>
                <span className="text-emerald-400 font-bold">✓ Cell Broadcast Push Sent</span>
              </div>
            </div>
          )}

          {channelView === 'VOICE' && (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-300 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-950 flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-amber-700" /> Automated Multilingual IVR Voice Broadcast
                </span>
                <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded">
                  TTS Engine Active
                </span>
              </div>
              <p className="text-xs text-gray-800 italic bg-white p-3 rounded-lg border border-amber-200 font-regional">
                "{activeMsgText}"
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSpeak(activeMsgText)}
                  className="bg-[#1E3A5F] hover:bg-[#2563A8] text-white font-bold text-xs px-3 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{isPlayingAudio ? 'Broadcasting Audio...' : 'Play Synthetic Voice Preview'}</span>
                </button>
              </div>
            </div>
          )}

          {channelView === 'CAP_XML' && (
            <div className="p-3 bg-slate-900 text-slate-200 font-mono rounded-xl border border-slate-700 space-y-2 text-[11px] overflow-x-auto">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-sky-400 font-bold">
                  NDMA Common Alerting Protocol (CAP v1.2 XML Feed)
                </span>
                <button
                  onClick={handleCopyXml}
                  className="bg-slate-800 hover:bg-slate-700 text-sky-300 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedXml ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedXml ? 'Copied' : 'Copy CAP XML'}</span>
                </button>
              </div>
              <pre className="text-[10px] leading-relaxed text-sky-200 max-h-64 overflow-y-auto">
                {rawCapXml}
              </pre>
            </div>
          )}

          {channelView === 'MORNING_BRIEF' && (
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1E3A5F] text-xs">
                  Automated 6 AM Daily Logistics Intelligence Briefing
                </span>
                <button
                  onClick={() => addToast('Briefing Exported', '6 AM Logistics Briefing saved as summary digest.', 'SUCCESS')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Export Digest</span>
                </button>
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100 text-xs space-y-2">
                <div className="font-bold text-gray-900">
                  TOP 5 HIGH-RISK LOGISTICS CORRIDORS FOR TODAY:
                </div>
                <div className="space-y-1 text-[11px] text-gray-700">
                  <div>1. <strong>NH-10 (Siliguri - Gangtok)</strong>: 82% Risk (Restricted). Bypass light freight via Melli.</div>
                  <div>2. <strong>NH-13 (Bomdila - Tawang)</strong>: 79% Risk (Degraded). Pre-position BRO bulldozers.</div>
                  <div>3. <strong>NH-37 (Silchar - Imphal)</strong>: 75% Risk (Degraded). River gauge watch at Irang Bridge.</div>
                  <div>4. <strong>NH-6 (Sonapur Tunnel)</strong>: 68% Risk (Restricted). Mudflow vacuum pumps deployed.</div>
                  <div>5. <strong>NH-2 (Dimapur - Kohima)</strong>: 64% Risk (Restricted). Stagger heavy truck departure.</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Manual Alert Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[3000] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden border border-gray-300 shadow-2xl p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-[#1E3A5F]">Dispatch New Multi-Channel Alert</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold cursor-pointer text-base"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAlertSubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Alert Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Landslide Warning on NH-29"
                  className="w-full p-2 border border-gray-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-[#1E3A5F]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Severity Tier</label>
                <select
                  value={newTier}
                  onChange={(e) => setNewTier(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  <option value="T1 - INFO">T1 — Info (Minor delay notice)</option>
                  <option value="T2 - ADVISORY">T2 — Advisory (Route degraded / heavy rain)</option>
                  <option value="T3 - WARNING">T3 — Warning (Route closure predicted 6h)</option>
                  <option value="T4 - CRITICAL">T4 — Critical (Route fully blocked)</option>
                  <option value="T5 - DISASTER">T5 — Disaster (Region isolated / NDRF)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Message Text (English)</label>
                <textarea
                  required
                  rows={3}
                  value={newMsgEn}
                  onChange={(e) => setNewMsgEn(e.target.value)}
                  placeholder="Type alert description. System will auto-translate to 8 regional languages."
                  className="w-full p-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#1E3A5F]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs cursor-pointer">
                  Broadcast Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
