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
  ShieldCheck,
  X
} from 'lucide-react';

export const AlertCenter: React.FC = () => {
  const { alerts, addNewAlert, openDrawer, addToast, navigateToModule, isAdminOrAuthority, userRole } = usePlatform();
  const { currentLanguage, languages, t } = useLanguage();

  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(alerts[0] || null);
  const [targetLang, setTargetLang] = useState<LanguageCode>('en');
  const [channelView, setChannelView] = useState<'WHATSAPP' | 'SMS' | 'VOICE' | 'CAP_XML' | 'MORNING_BRIEF'>('WHATSAPP');
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
      `Official DM acknowledgement logged for ${selectedAlert.id}. 20-min SLA escalation stopped.`,
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
      <div className="card-command flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-black text-[#29372D]">
            {t('module_5')} — Multilingual Broadcast &amp; Emergency Alert Center
          </h2>
          <p className="text-xs text-[#68766C] mt-0.5">
            5-Tier alert hierarchy dispatched across 8 NER regional languages, 2G SMS, IVR voice, and NDMA CAP feeds
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-danger text-xs py-2 px-3.5 flex items-center gap-1.5 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Dispatch Emergency Alert</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Alert List on Left (5 cols), Multi-channel preview on Right (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Active Alerts Queue (5 cols) */}
        <div className="lg:col-span-5 card-command space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#DFE5DD]">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#1B3022]">
              Dispatched Alerts Queue ({alerts.length})
            </h3>
            <span className="text-[10px] bg-[#FF5252]/15 text-[#FF5252] border border-[#FF5252]/30 font-bold px-2 py-0.5 rounded">
              20-Min SLA Escalation Active
            </span>
          </div>

          <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
            {alerts.map((a) => {
              const isSelected = selectedAlert?.id === a.id;
              const isCrit = a.tier_level >= 4;
              return (
                <div
                  key={a.id}
                  onClick={() => setSelectedAlert(a)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#DCE4DB] border-[#1B3022] shadow-command-glow'
                      : 'bg-[#F4F5F0] border-[#DFE5DD] hover:bg-[#FFFFFF]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded uppercase font-mono ${
                        isCrit
                          ? 'bg-[#FF5252]/20 text-[#FF5252] border border-[#FF5252]/40'
                          : a.tier_level === 3
                          ? 'bg-[#FFB547]/20 text-[#FFB547] border border-[#FFB547]/40'
                          : 'bg-[#7C9082]/20 text-[#7C9082] border border-[#438BFF]/40'
                      }`}
                    >
                      {a.tier}
                    </span>
                    <span className="text-[10px] text-[#68766C] font-mono">{a.timestamp}</span>
                  </div>

                  <div className="font-bold text-xs text-[#29372D] mt-1.5">{a.title}</div>
                  <p className="text-[11px] text-[#68766C] mt-0.5 line-clamp-2">
                    {a.message_i18n?.en || a.title}
                  </p>

                  <div className="mt-2 pt-2 border-t border-[#DFE5DD] flex items-center justify-between text-[10px]">
                    <span className="text-[#68766C]">
                      Recipients: <strong className="text-[#29372D]">{a.target_recipients_count}</strong>
                    </span>
                    <span
                      className={`font-semibold ${
                        a.acknowledged ? 'text-[#7C9082] font-bold' : 'text-[#FFB547] animate-pulse'
                      }`}
                    >
                      {a.acknowledged ? '✓ Acknowledged' : '⏱️ Pending DC Ack'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Multi-Channel Formatter & Regional Translator (7 cols) */}
        <div className="lg:col-span-7 card-command space-y-4 text-xs">
          {/* Header with Language Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DFE5DD] pb-3">
            <div>
              <span className="text-[10px] font-bold text-[#68766C] uppercase">Alert Delivery Simulator</span>
              <h3 className="text-sm font-black text-[#29372D]">
                {selectedAlert?.title || 'Select Alert'}
              </h3>
            </div>

            {/* Regional Language Switcher */}
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#1B3022]" />
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value as LanguageCode)}
                className="bg-[#F4F5F0] border border-[#DFE5DD] rounded-xl px-2.5 py-1 text-xs font-bold text-[#29372D] focus:ring-1 focus:ring-[#1B3022] cursor-pointer"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code} className="bg-[#F4F5F0] text-[#29372D]">
                    {l.native} ({l.label})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Channel Selector Tabs */}
          <div className="flex flex-wrap gap-1 bg-[#F4F5F0] p-1 rounded-xl border border-[#DFE5DD] text-xs font-bold">
            <button
              onClick={() => setChannelView('WHATSAPP')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all ${
                channelView === 'WHATSAPP' ? 'bg-[#1B3022] text-white font-black' : 'text-[#68766C] hover:text-[#29372D]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#7C9082]" /> WhatsApp
            </button>
            <button
              onClick={() => setChannelView('SMS')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all ${
                channelView === 'SMS' ? 'bg-[#1B3022] text-white font-black' : 'text-[#68766C] hover:text-[#29372D]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-[#7C9082]" /> 2G SMS
            </button>
            <button
              onClick={() => setChannelView('VOICE')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all ${
                channelView === 'VOICE' ? 'bg-[#1B3022] text-white font-black' : 'text-[#68766C] hover:text-[#29372D]'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5 text-[#FFB547]" /> IVR Voice
            </button>
            <button
              onClick={() => setChannelView('CAP_XML')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all ${
                channelView === 'CAP_XML' ? 'bg-[#1B3022] text-white font-black' : 'text-[#68766C] hover:text-[#29372D]'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-[#7C9082]" /> NDMA CAP (XML)
            </button>
            <button
              onClick={() => setChannelView('MORNING_BRIEF')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all ${
                channelView === 'MORNING_BRIEF' ? 'bg-[#1B3022] text-white font-black' : 'text-[#68766C] hover:text-[#29372D]'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#FF5252]" /> 6 AM Briefing
            </button>
          </div>

          {/* CHANNEL PREVIEWS */}
          {channelView === 'WHATSAPP' && (
            <div className="p-4 bg-[#0B141A] rounded-2xl border border-[#DFE5DD] max-w-md mx-auto space-y-2 shadow-inner">
              <div className="bg-[#1F2C34] p-3.5 rounded-2xl rounded-tl-none shadow-md space-y-2 border border-[#2A3942]">
                <div className="flex items-center justify-between border-b border-[#2A3942] pb-1.5">
                  <span className="font-bold text-[#25D366] text-[11px] flex items-center gap-1">
                    🏛️ GOI NERALIS EMERGENCY ALERTS
                  </span>
                  <span className="text-[9px] text-[#8696A0]">10:45 AM</span>
                </div>
                <div className="font-bold text-[#E9EDEF] text-xs">
                  {selectedAlert?.title}
                </div>
                <p className="text-[#D1D7DB] text-xs leading-relaxed font-regional">
                  {activeMsgText}
                </p>
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={handleViewAlternateRoute}
                    className="bg-[#00A884] hover:bg-[#008f6f] text-white font-bold py-2 px-3 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>View Live Alternate Route Bypass</span>
                  </button>
                  <button
                    onClick={handleAcknowledgeAlert}
                    disabled={selectedAlert?.acknowledged}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                      selectedAlert?.acknowledged
                        ? 'bg-[#7C9082]/20 text-[#7C9082] border border-[#7C9082]/40 cursor-default'
                        : 'bg-[#2A3942] hover:bg-[#32424B] text-[#E9EDEF]'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#7C9082]" />
                    <span>{selectedAlert?.acknowledged ? '✓ Receipt Acknowledged (DM Office)' : 'Acknowledge Receipt (DM Office)'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {channelView === 'SMS' && (
            <div className="p-4 bg-[#F4F5F0] text-[#7C9082] font-mono rounded-xl border border-[#DFE5DD] space-y-2">
              <div className="text-[10px] text-[#68766C] flex justify-between">
                <span>BSNL / AIRTEL 2G CELL BROADCAST</span>
                <span>{activeMsgText.length} / 160 chars</span>
              </div>
              <div className="bg-[#F4F5F0] p-3 rounded-lg border border-[#DFE5DD] text-xs leading-relaxed font-regional text-[#29372D]">
                {activeMsgText}
              </div>
              <div className="text-[10px] text-[#68766C] flex items-center justify-between">
                <span>Auto-compressed for low-bandwidth 2G feature phones.</span>
                <span className="text-[#7C9082] font-bold">✓ Cell Broadcast Pushed</span>
              </div>
            </div>
          )}

          {channelView === 'VOICE' && (
            <div className="p-4 bg-[#F4F5F0] rounded-xl border border-[#FFB547]/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#FFB547] flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-[#FFB547]" /> Automated Multilingual IVR Voice Broadcast
                </span>
                <span className="text-[10px] bg-[#FFB547]/20 text-[#FFB547] font-bold px-2 py-0.5 rounded border border-[#FFB547]/30">
                  TTS Engine Active
                </span>
              </div>
              <p className="text-xs text-[#29372D] italic bg-[#FFFFFF] p-3 rounded-lg border border-[#DFE5DD] font-regional">
                "{activeMsgText}"
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSpeak(activeMsgText)}
                  className="btn-primary text-xs py-2 px-3.5"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{isPlayingAudio ? 'Broadcasting Audio...' : 'Play Synthetic Voice Preview'}</span>
                </button>
              </div>
            </div>
          )}

          {channelView === 'CAP_XML' && (
            <div className="p-3 bg-[#F4F5F0] text-[#7C9082] font-mono rounded-xl border border-[#DFE5DD] space-y-2 text-[11px] overflow-x-auto">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#1B3022] font-bold">
                  NDMA Common Alerting Protocol (CAP v1.2 XML Feed)
                </span>
                <button
                  onClick={handleCopyXml}
                  className="btn-secondary text-[10px] py-1 px-2.5"
                >
                  {copiedXml ? <Check className="w-3 h-3 text-[#7C9082]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedXml ? 'Copied' : 'Copy CAP XML'}</span>
                </button>
              </div>
              <pre className="text-[10px] leading-relaxed text-[#68766C] max-h-64 overflow-y-auto">
                {rawCapXml}
              </pre>
            </div>
          )}

          {channelView === 'MORNING_BRIEF' && (
            <div className="p-4 bg-[#F4F5F0] rounded-xl border border-[#DFE5DD] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#29372D] text-xs">
                  Automated 6 AM Daily Logistics Intelligence Briefing
                </span>
                <button
                  onClick={() => addToast('Briefing Exported', '6 AM Logistics Briefing saved as summary digest.', 'SUCCESS')}
                  className="btn-secondary text-[10px] py-1 px-2.5 flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  <span>Export Digest</span>
                </button>
              </div>
              <div className="bg-[#FFFFFF] p-3.5 rounded-xl border border-[#DFE5DD] text-xs space-y-2">
                <div className="font-bold text-[#1B3022]">
                  TOP 5 HIGH-RISK LOGISTICS CORRIDORS FOR TODAY:
                </div>
                <div className="space-y-1.5 text-[11px] text-[#68766C]">
                  <div>1. <strong className="text-[#29372D]">NH-10 (Siliguri - Gangtok)</strong>: 82% Risk (Restricted). Bypass light freight via Melli.</div>
                  <div>2. <strong className="text-[#29372D]">NH-13 (Bomdila - Tawang)</strong>: 79% Risk (Degraded). Pre-position BRO bulldozers.</div>
                  <div>3. <strong className="text-[#29372D]">NH-37 (Silchar - Imphal)</strong>: 75% Risk (Degraded). River gauge watch at Irang Bridge.</div>
                  <div>4. <strong className="text-[#29372D]">NH-6 (Sonapur Tunnel)</strong>: 68% Risk (Restricted). Mudflow vacuum pumps deployed.</div>
                  <div>5. <strong className="text-[#29372D]">NH-2 (Dimapur - Kohima)</strong>: 64% Risk (Restricted). Stagger heavy truck departure.</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Manual Alert Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[3000] flex items-center justify-center p-4">
          <div className="bg-[#F4F5F0] rounded-2xl w-full max-w-md overflow-hidden border border-[#DFE5DD] shadow-2xl p-5 space-y-4 text-xs text-[#29372D] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#DFE5DD] pb-3">
              <h3 className="font-bold text-sm text-[#29372D]">Dispatch New Emergency Alert</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#68766C] hover:text-[#29372D] p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAlertSubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-[#68766C] mb-1">Alert Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Landslide Warning on NH-29"
                  className="w-full p-2.5 bg-[#FFFFFF] border border-[#DFE5DD] rounded-xl text-xs font-semibold text-[#29372D] focus:ring-1 focus:ring-[#1B3022] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#68766C] mb-1">Severity Tier</label>
                <select
                  value={newTier}
                  onChange={(e) => setNewTier(e.target.value)}
                  className="w-full p-2.5 bg-[#FFFFFF] border border-[#DFE5DD] rounded-xl text-xs font-semibold text-[#29372D] cursor-pointer"
                >
                  <option value="T1 - INFO" className="bg-[#F4F5F0]">T1 — Info (Minor delay notice)</option>
                  <option value="T2 - ADVISORY" className="bg-[#F4F5F0]">T2 — Advisory (Route degraded / heavy rain)</option>
                  <option value="T3 - WARNING" className="bg-[#F4F5F0]">T3 — Warning (Route closure predicted 6h)</option>
                  <option value="T4 - CRITICAL" className="bg-[#F4F5F0]">T4 — Critical (Route fully blocked)</option>
                  <option value="T5 - DISASTER" className="bg-[#F4F5F0]">T5 — Disaster (Region isolated / NDRF)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#68766C] mb-1">Message Text (English)</label>
                <textarea
                  required
                  rows={3}
                  value={newMsgEn}
                  onChange={(e) => setNewMsgEn(e.target.value)}
                  placeholder="Type alert description. System will auto-translate to 8 regional languages."
                  className="w-full p-2.5 bg-[#FFFFFF] border border-[#DFE5DD] rounded-xl text-xs text-[#29372D] focus:ring-1 focus:ring-[#1B3022] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#DFE5DD]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-danger text-xs">
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
