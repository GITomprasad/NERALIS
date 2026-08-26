import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { Phone, X, RefreshCw, Radio } from 'lucide-react';

export const USSDPhoneModal: React.FC = () => {
  const { isUSSDModalOpen, setIsUSSDModalOpen } = usePlatform();
  const [dialCode, setDialCode] = useState('*123#');
  const [ussdScreen, setUssdScreen] = useState<'IDLE' | 'MENU' | 'SUB_ROADS' | 'SUB_STATUS' | 'SOS_SENT'>('IDLE');
  const [selectedResponse, setSelectedResponse] = useState('');

  if (!isUSSDModalOpen) return null;

  const handleDial = () => {
    if (dialCode === '*123#' || dialCode === '*123') {
      setUssdScreen('MENU');
    }
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ussdScreen === 'MENU') {
      if (selectedResponse === '1') setUssdScreen('SUB_ROADS');
      else if (selectedResponse === '2') setUssdScreen('SUB_STATUS');
      else if (selectedResponse === '3') setUssdScreen('SOS_SENT');
    } else if (ussdScreen === 'SUB_ROADS') {
      setUssdScreen('SUB_STATUS');
    }
    setSelectedResponse('');
  };

  const resetPhone = () => {
    setUssdScreen('IDLE');
    setDialCode('*123#');
    setSelectedResponse('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[3000] flex items-center justify-center p-4">
      <div className="bg-slate-900 text-white rounded-3xl p-6 w-full max-w-xs shadow-2xl border-4 border-slate-700 relative">
        <button
          onClick={() => setIsUSSDModalOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-3">
          <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider flex items-center justify-center gap-1">
            <Radio className="w-3 h-3 animate-pulse" /> 2G BSNL/Airtel Feature Phone Simulator
          </div>
          <h4 className="text-xs font-bold text-gray-300">NER USSD *123# Emergency Gateway</h4>
        </div>

        {/* Feature Phone Screen */}
        <div className="bg-[#8CA87B] text-[#1A2E10] font-mono p-4 rounded-xl shadow-inner min-h-[190px] flex flex-col justify-between text-xs border-2 border-[#6D875E]">
          {ussdScreen === 'IDLE' && (
            <div className="text-center my-auto space-y-2">
              <div className="text-sm font-bold tracking-widest text-[#102008]">NERALIS USSD</div>
              <div className="text-[11px]">Dial *123# for Road Status in Zero-Data Areas</div>
              <div className="bg-[#7D996D] py-1 px-2 rounded text-base font-black tracking-widest">
                {dialCode}
              </div>
            </div>
          )}

          {ussdScreen === 'MENU' && (
            <div className="space-y-1">
              <div className="font-bold border-b border-[#1A2E10]/30 pb-1">GOI NERALIS SYSTEM:</div>
              <div>1. NH-10 Teesta Status</div>
              <div>2. NH-13 Sela Pass Status</div>
              <div>3. SOS Satellite Beacon</div>
              <div>4. Cold Chain Depot Status</div>
            </div>
          )}

          {ussdScreen === 'SUB_ROADS' && (
            <div className="space-y-1">
              <div className="font-bold">SELECT ROUTE:</div>
              <div>1. Siliguri - Gangtok</div>
              <div>2. Guwahati - Tawang</div>
              <div>3. Silchar - Imphal</div>
            </div>
          )}

          {ussdScreen === 'SUB_STATUS' && (
            <div className="space-y-1">
              <div className="font-bold text-red-900">ALERT: NH-10 CLOSED</div>
              <div className="text-[10px]">Km 29 debris slide. Light vehicles diverted via Melli. Ro-Ro barge active.</div>
              <div className="text-[9px] pt-1 opacity-80">Updated: 10:45 IST via BSNL GSM</div>
            </div>
          )}

          {ussdScreen === 'SOS_SENT' && (
            <div className="space-y-1 text-center my-auto">
              <div className="font-bold text-red-950">🚨 SOS DISPATCHED</div>
              <div className="text-[11px]">GPS coordinates relayed to State Disaster Control Room via SMS tower uplink.</div>
            </div>
          )}

          {/* Prompt input field on feature phone */}
          {ussdScreen !== 'IDLE' && ussdScreen !== 'SOS_SENT' && (
            <form onSubmit={handleInputSubmit} className="mt-2 border-t border-[#1A2E10]/30 pt-1.5 flex gap-1">
              <input
                type="text"
                maxLength={2}
                value={selectedResponse}
                onChange={(e) => setSelectedResponse(e.target.value)}
                placeholder="Reply (1-4)"
                autoFocus
                className="w-full bg-[#7D996D] text-[#1A2E10] px-1.5 py-0.5 rounded text-xs focus:outline-none placeholder:text-[#1A2E10]/50 font-bold"
              />
              <button type="submit" className="bg-[#1A2E10] text-[#8CA87B] px-2 py-0.5 rounded text-[10px] font-bold">
                Send
              </button>
            </form>
          )}
        </div>

        {/* Feature Phone Keypad */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {ussdScreen === 'IDLE' ? (
            <button
              onClick={handleDial}
              className="col-span-3 bg-emerald-600 hover:bg-emerald-500 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1 shadow"
            >
              <Phone className="w-3.5 h-3.5" /> Call *123# (USSD)
            </button>
          ) : (
            <button
              onClick={resetPhone}
              className="col-span-3 bg-slate-700 hover:bg-slate-600 py-1.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> End / Reset USSD Call
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
