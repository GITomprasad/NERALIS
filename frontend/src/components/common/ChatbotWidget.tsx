import React, { useState, useEffect, useRef } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { useLanguage } from '../../context/LanguageContext';
import { apiClient } from '../../services/api/apiClient';
import {
  Bot,
  Sparkles,
  Send,
  X,
  Minimize2,
  Maximize2,
  Trash2,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Copy,
  Check,
  ArrowRight,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Wifi,
  WifiOff,
  RefreshCw,
  MapPin,
  Route,
  Compass,
  AlertTriangle,
  FileText,
  PhoneCall
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  topic?: string;
  timestamp: string;
  suggestions?: string[];
  actions?: Array<{
    label: string;
    action: string;
    target?: string;
    entity_type?: string;
    entity_id?: string;
  }>;
}

export const ChatbotWidget: React.FC = () => {
  const {
    isChatbotOpen,
    setIsChatbotOpen,
    toggleChatbot,
    chatbotInitialPrompt,
    navigateToModule,
    openDrawer,
    openProvenanceModal,
    setIsModelMetricsModalOpen,
    setIsParliamentModalOpen,
    setIsUSSDModalOpen,
    openAuthModal,
    districts,
    corridors,
    bridges,
    networkMode,
    addToast
  } = usePlatform();

  const { currentLanguage } = useLanguage();

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: (
        "**Namaste! I am the NERALIS AI Sahayak (Operations & Logistics Assistant).**\n\n" +
        "I provide evidence-backed intelligence across all 8 North Eastern States, monitored corridors, and platform modules.\n\n" +
        "**What would you like to explore?**\n" +
        "• 🗺️ **Platform Modules:** GIS Grid, AI Routing, 72h Forecast, Fleet Tracking, Field Reporting, Alert Center.\n" +
        "• 🛣️ **Live Status:** Inquire about specific districts (*Kamrup*, *East Khasi Hills*), highways (*NH-27*, *NH-10*), or bridges (*Saraighat*, *Bogibeel*).\n" +
        "• 🧠 **AI & ML Models:** Authentic NASA + IMD Landslide ML model (85.1% Raw Acc, 52.4% Balanced Acc, 0.556 F1).\n" +
        "• 📡 **Offline Ops:** USSD `*123#` simulator and IndexedDB sync."
      ),

      topic: 'WELCOME',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        'What is NERALIS?',
        'Explain the 8 Platform Modules',
        'How does AI Route Optimization work?',
        'Explain 72-hour Disruption Forecast',
        'Check active emergency alerts',
        'How does offline mode & USSD work?'
      ],
      actions: [
        { label: 'Explore GIS Map', action: 'NAVIGATE', target: 'ACCESSIBILITY' },
        { label: 'Open Route Optimizer', action: 'NAVIGATE', target: 'ROUTE' }
      ]
    }
  ]);

  // Handle auto scroll
  useEffect(() => {
    if (isChatbotOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatbotOpen, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isChatbotOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isChatbotOpen]);

  // Handle external prompt trigger
  useEffect(() => {
    if (chatbotInitialPrompt && isChatbotOpen) {
      handleSendMessage(chatbotInitialPrompt);
    }
  }, [chatbotInitialPrompt]);

  // Speech Recognition (STT) setup
  const handleToggleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addToast('Voice Input Unsupported', 'Speech recognition is not supported by your current browser.', 'WARNING');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputQuery(transcript);
          setIsListening(false);
          handleSendMessage(transcript);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Text to Speech (TTS)
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    // Strip markdown formatting for cleaner speech
    const cleanText = text
      .replace(/###|\*\*|\*|`|#|•|>|_/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/\n+/g, '. ');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (queryToSend?: string) => {
    const query = (queryToSend || inputQuery).trim();
    if (!query || isLoading) return;

    const userMessageId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMessageId,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await apiClient.queryChatbot(query, currentLanguage);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        topic: response.topic,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: response.suggestions,
        actions: response.actions
      };

      setMessages((prev) => [...prev, botMsg]);

      if (autoSpeak) {
        speakText(response.text);
      }
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: "**Connectivity Advisory:** NERALIS AI Assistant is operating with local cache intelligence. You can still query all 89 NER districts, highway corridors, bridge sensors, and offline workflows.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: {
    label: string;
    action: string;
    target?: string;
    entity_type?: string;
    entity_id?: string;
  }) => {
    if (action.action === 'NAVIGATE' && action.target) {
      navigateToModule(action.target as any);
      addToast('Navigated', `Switched to ${action.label}`, 'INFO');
    } else if (action.action === 'OPEN_MODAL') {
      if (action.target === 'MODEL_METRICS') setIsModelMetricsModalOpen(true);
      else if (action.target === 'PARLIAMENT') setIsParliamentModalOpen(true);
      else if (action.target === 'USSD') setIsUSSDModalOpen(true);
      else if (action.target === 'PROVENANCE') openProvenanceModal({ source_id: 'SRC-IMD-AWS' });
      else if (action.target === 'AUTH') openAuthModal('SIGNIN');
    } else if (action.action === 'INSPECT_ENTITY') {
      if (action.entity_type === 'DISTRICT') {
        const found = districts.find((d) => d.id === action.entity_id);
        if (found) {
          openDrawer('DISTRICT', found);
          navigateToModule('ACCESSIBILITY');
        }
      } else if (action.entity_type === 'CORRIDOR') {
        const found = corridors.find((c) => c.id === action.entity_id);
        if (found) {
          openDrawer('CORRIDOR', found);
          navigateToModule('ACCESSIBILITY');
        }
      } else if (action.entity_type === 'BRIDGE') {
        const found = bridges.find((b) => b.id === action.entity_id);
        if (found) {
          openDrawer('BRIDGE', found);
          navigateToModule('ACCESSIBILITY');
        }
      }
    }
  };

  const copyToClipboard = (text: string, msgId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(msgId);
    setTimeout(() => setCopiedMsgId(null), 2000);
    addToast('Copied to Clipboard', 'Assistant answer copied.', 'SUCCESS');
  };

  const clearChatHistory = () => {
    setMessages([
      {
        id: 'welcome-cleared',
        sender: 'assistant',
        text: "**Chat history cleared.** How can I assist your logistics or command operations today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          'What is NERALIS?',
          'Explain the 8 Platform Modules',
          'How does AI Route Optimization work?',
          'Check active emergency alerts'
        ]
      }
    ]);
    window.speechSynthesis?.cancel();
  };

  // Simple Markdown Parser for Rich Rendering
  const renderMarkdown = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-1.5 leading-relaxed text-xs">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={idx} className="h-1" />;

          // Headers
          if (trimmed.startsWith('### ')) {
            return (
              <h4 key={idx} className="font-black text-sm text-[#17365D] mt-2 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>{trimmed.replace('### ', '')}</span>
              </h4>
            );
          }
          if (trimmed.startsWith('## ')) {
            return (
              <h3 key={idx} className="font-black text-sm text-[#17365D] mt-2 mb-1">
                {trimmed.replace('## ', '')}
              </h3>
            );
          }

          // Blockquote
          if (trimmed.startsWith('> ')) {
            return (
              <blockquote key={idx} className="border-l-2 border-amber-500 bg-amber-50/70 px-2 py-1 my-1 text-[11px] font-medium text-amber-900 rounded-r">
                {trimmed.replace('> ', '')}
              </blockquote>
            );
          }

          // Bullet points
          if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const textContent = trimmed.substring(2);
            return (
              <div key={idx} className="flex items-start gap-1.5 pl-1 my-0.5">
                <span className="text-blue-600 font-bold">•</span>
                <div className="flex-1">{formatInlineMarkup(textContent)}</div>
              </div>
            );
          }

          // Numbered list
          if (/^\d+\.\s/.test(trimmed)) {
            const match = trimmed.match(/^(\d+\.)\s(.*)/);
            if (match) {
              return (
                <div key={idx} className="flex items-start gap-1.5 pl-1 my-0.5">
                  <span className="font-bold text-blue-800 text-[11px] font-mono">{match[1]}</span>
                  <div className="flex-1">{formatInlineMarkup(match[2])}</div>
                </div>
              );
            }
          }

          return <p key={idx}>{formatInlineMarkup(trimmed)}</p>;
        })}
      </div>
    );
  };

  // Inline formatting for **bold**, `code`, and *italics*
  const formatInlineMarkup = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`|\*.*?\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-bold text-gray-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={index} className="bg-slate-100 text-blue-800 font-mono text-[10px] px-1 py-0.2 rounded border border-slate-200">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <em key={index} className="italic text-gray-700">
            {part.slice(1, -1)}
          </em>
        );
      }
      return part;
    });
  };

  return (
    <>
      {/* 1. Floating Launch Pill / Button */}
      {!isChatbotOpen && (
        <div className="fixed bottom-5 right-5 z-[5500] animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={toggleChatbot}
            className="group relative flex items-center gap-2.5 bg-gradient-to-r from-[#17365D] via-[#1E3A5F] to-[#2563A8] text-white px-4 py-3 rounded-full shadow-2xl hover:shadow-blue-500/25 border-2 border-white/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Open NERALIS AI Sahayak Copilot"
          >
            {/* Glowing Pulse Ring */}
            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 opacity-30 blur-xs group-hover:opacity-60 transition duration-300 animate-pulse" />

            <div className="relative flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center font-black shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-xs tracking-wide">NERALIS Sahayak</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <span className="text-[10px] text-sky-200 font-medium block">AI Operations Copilot</span>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* 2. Floating AI Assistant Chat Dialog Window */}
      {isChatbotOpen && (
        <div
          className={`fixed z-[6000] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden transition-all duration-200 animate-in fade-in slide-in-from-bottom-5 ${
            isExpanded
              ? 'inset-4 sm:inset-10 max-w-5xl mx-auto'
              : 'bottom-5 right-3 sm:right-6 w-[94vw] sm:w-[440px] h-[600px] max-h-[86vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#17365D] via-[#1E3A5F] to-[#2563A8] text-white p-3.5 flex items-center justify-between shadow-xs select-none shrink-0 border-b border-blue-400/20">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-black shadow-xs shrink-0">
                <Bot className="w-5 h-5 text-slate-900" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm tracking-wide text-white truncate">
                    NERALIS AI Sahayak
                  </span>
                  <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded font-bold uppercase border border-amber-400/30">
                    Copilot
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-sky-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>8 States • 89 Districts • MDoNER</span>
                </div>
              </div>
            </div>

            {/* Action Tools */}
            <div className="flex items-center gap-1 shrink-0">
              {/* TTS Toggle */}
              <button
                onClick={() => {
                  setAutoSpeak(!autoSpeak);
                  if (autoSpeak) window.speechSynthesis?.cancel();
                  addToast('Voice Narration', autoSpeak ? 'Voice output muted.' : 'Voice output enabled.', 'INFO');
                }}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  autoSpeak ? 'bg-amber-400 text-slate-900 font-bold' : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title={autoSpeak ? 'Mute Speech Synthesis' : 'Enable Voice Audio Output'}
              >
                {autoSpeak ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              {/* Clear History */}
              <button
                onClick={clearChatHistory}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Clear Chat History"
              >
                <Trash2 className="w-3.5 h-3.5 text-gray-300 hover:text-red-300" />
              </button>

              {/* Expand / Minimize */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden sm:block p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title={isExpanded ? 'Restore Normal Window' : 'Expand to Full Screen'}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>

              {/* Close */}
              <button
                onClick={toggleChatbot}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-red-600 text-white transition-colors cursor-pointer"
                title="Close AI Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Network Mode Status Banner */}
          <div className="bg-slate-100 border-b border-gray-200 px-3 py-1 flex items-center justify-between text-[10px] text-gray-600 shrink-0 font-medium">
            <div className="flex items-center gap-1.5">
              {networkMode === 'OFFLINE' ? (
                <>
                  <WifiOff className="w-3 h-3 text-red-600" />
                  <span className="text-red-700 font-bold">Offline Intelligence Active</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-800 font-bold">Live Evidence Engine Connected</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1 text-[9px] text-gray-500 font-mono">
              <span>Lang: {currentLanguage.toUpperCase()}</span>
              <span>•</span>
              <span>GBDT v3.4</span>
            </div>
          </div>

          {/* Chat Messages Feed */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 bg-slate-50/50">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-150`}
                >
                  {!isUser && (
                    <div className="w-6 h-6 rounded-lg bg-[#17365D] text-amber-400 flex items-center justify-center font-black shrink-0 mt-0.5 shadow-2xs">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className={`max-w-[85%] sm:max-w-[82%] space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>
                    {/* Message Bubble */}
                    <div
                      className={`p-3 rounded-2xl shadow-xs text-xs ${
                        isUser
                          ? 'bg-gradient-to-r from-[#17365D] to-[#1E3A5F] text-white rounded-tr-xs'
                          : 'bg-white text-gray-800 border border-gray-200 rounded-tl-xs'
                      }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                      ) : (
                        renderMarkdown(msg.text)
                      )}
                    </div>

                    {/* Action Buttons in Bot Message */}
                    {!isUser && msg.actions && msg.actions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {msg.actions.map((act, aIdx) => (
                          <button
                            key={aIdx}
                            onClick={() => handleActionClick(act)}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 font-bold px-2.5 py-1 rounded-lg text-[10px] flex items-center gap-1.5 shadow-2xs transition-all hover:scale-102 cursor-pointer"
                          >
                            <span>{act.label}</span>
                            <ArrowRight className="w-3 h-3 text-blue-600" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Message Metadata & Copy/Audio controls */}
                    <div className={`flex items-center gap-2 text-[10px] text-gray-400 px-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <span>{msg.timestamp}</span>
                      {!isUser && (
                        <>
                          <span>•</span>
                          <button
                            onClick={() => copyToClipboard(msg.text, msg.id)}
                            className="hover:text-gray-700 flex items-center gap-0.5 cursor-pointer"
                            title="Copy answer"
                          >
                            {copiedMsgId === msg.id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>{copiedMsgId === msg.id ? 'Copied' : 'Copy'}</span>
                          </button>
                          <span>•</span>
                          <button
                            onClick={() => speakText(msg.text)}
                            className="hover:text-gray-700 flex items-center gap-0.5 cursor-pointer"
                            title="Read answer out loud"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>Listen</span>
                          </button>
                        </>
                      )}
                    </div>

                    {/* Suggested Follow-up Prompt Chips */}
                    {!isUser && msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="space-y-1 pt-1">
                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-blue-600" />
                          Suggested Queries:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {msg.suggestions.map((sug, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={() => handleSendMessage(sug)}
                              className="bg-white hover:bg-slate-100 text-gray-700 border border-gray-200 px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors cursor-pointer text-left"
                            >
                              {sug}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-gray-500 bg-white p-2.5 rounded-xl border border-gray-200 max-w-[200px] shadow-2xs">
                <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                <span className="font-semibold text-gray-700">Synthesizing GIS data...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Bar */}
          <div className="p-3 bg-white border-t border-gray-200 shrink-0 space-y-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              {/* Mic STT Button */}
              <button
                type="button"
                onClick={handleToggleVoiceInput}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isListening
                    ? 'bg-red-500 text-white border-red-600 animate-pulse'
                    : 'bg-slate-100 hover:bg-slate-200 text-gray-600 border-gray-200'
                }`}
                title={isListening ? 'Listening... Click to cancel' : 'Click to Speak (Voice Input)'}
              >
                {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>

              {/* Input Field */}
              <input
                ref={inputRef}
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder={isListening ? 'Listening to your question...' : 'Ask about routes, districts, alerts, models, or offline...'}
                className="flex-1 bg-slate-50 text-gray-900 placeholder:text-gray-400 text-xs rounded-xl px-3.5 py-2.5 border border-gray-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#17365D] transition-all"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputQuery.trim() || isLoading}
                className="bg-[#17365D] hover:bg-[#1E3A5F] disabled:opacity-40 text-white px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>

            <div className="flex items-center justify-between text-[9px] text-gray-400 px-1">
              <span>Official MDoNER Logistics Intelligence</span>
              <span className="font-mono">Press Enter to send</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
