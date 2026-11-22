import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { Camera, X, Check, Crosshair, Sparkles, Ruler } from 'lucide-react';

export const ARMeasurementModal: React.FC<{ onApplyMeasurements?: (data: { crack_length_m: number; pothole_depth_cm: number; debris_volume_cum: number }) => void }> = ({
  onApplyMeasurements
}) => {
  const { isARModalOpen, setIsARModalOpen, addToast } = usePlatform();
  const [measurementStep, setMeasurementStep] = useState<'AIM' | 'MEASURING' | 'CALCULATED'>('AIM');
  const [crackLength, setCrackLength] = useState(4.8);
  const [potholeDepth, setPotholeDepth] = useState(26.0);
  const [debrisVol, setDebrisVol] = useState(12.5);

  if (!isARModalOpen) return null;

  const handleSimulateScan = () => {
    setMeasurementStep('MEASURING');
    setTimeout(() => {
      setCrackLength(Number((Math.random() * 6 + 2).toFixed(1)));
      setPotholeDepth(Number((Math.random() * 30 + 10).toFixed(1)));
      setDebrisVol(Number((Math.random() * 20 + 4).toFixed(1)));
      setMeasurementStep('CALCULATED');
    }, 1200);
  };

  const handleApply = () => {
    if (onApplyMeasurements) {
      onApplyMeasurements({
        crack_length_m: crackLength,
        pothole_depth_cm: potholeDepth,
        debris_volume_cum: debrisVol
      });
    }
    addToast('AR Dimensions Injected', `Crack ${crackLength}m & Depth ${potholeDepth}cm auto-filled in report.`, 'SUCCESS');
    setIsARModalOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[6000] flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#F4F5F0] text-[#29372D] rounded-2xl w-full max-w-lg overflow-hidden border border-[#DFE5DD] shadow-2xl relative">
        {/* Top bar */}
        <div className="bg-[#F4F5F0] px-4 py-3 flex items-center justify-between border-b border-[#DFE5DD]">
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-[#1B3022]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#1B3022]">
              AR Pavement &amp; Landslide Dimension Scanner
            </span>
          </div>
          <button onClick={() => setIsARModalOpen(false)} className="text-[#68766C] hover:text-[#29372D] p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport simulation */}
        <div className="relative h-72 bg-gradient-to-b from-[#EDE4E2] to-[#FCF6F5] flex items-center justify-center overflow-hidden">
          {/* Simulated camera background */}
          <img
            src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80"
            alt="Pavement view"
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
          />

          {/* AR Overlay Lines & Reticle */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="relative w-48 h-48 border border-[#1B3022]/40 rounded-xl flex items-center justify-center">
              <Crosshair className="w-10 h-10 text-[#1B3022] animate-pulse" />
              {/* AR Laser Dimension vector */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#1B3022] shadow-[0_0_8px_#19C6D2]"></div>
              <div className="absolute top-2 left-2 bg-[#F4F5F0]/90 border border-[#1B3022]/30 px-2 py-0.5 rounded text-[10px] text-[#1B3022] font-mono">
                L: {crackLength} m
              </div>
              <div className="absolute bottom-2 right-2 bg-[#F4F5F0]/90 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] text-[#FFB547] font-mono">
                D: {potholeDepth} cm
              </div>
            </div>
          </div>

          {measurementStep === 'MEASURING' && (
            <div className="absolute inset-0 bg-[#F4F5F0]/80 backdrop-blur-xs flex items-center justify-center gap-2 text-xs font-bold text-[#1B3022]">
              <Sparkles className="w-5 h-5 animate-spin text-[#1B3022]" /> LiDAR Mesh Point-Cloud Computing...
            </div>
          )}
        </div>

        {/* Bottom stats & action */}
        <div className="p-4 bg-[#F4F5F0] space-y-3.5 border-t border-[#DFE5DD]">
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="bg-[#FFFFFF] p-2.5 rounded-xl border border-[#DFE5DD]">
              <div className="text-[10px] text-[#68766C] uppercase font-bold">Crack Span</div>
              <div className="text-base font-bold text-[#1B3022] font-mono mt-0.5">{crackLength} m</div>
            </div>
            <div className="bg-[#FFFFFF] p-2.5 rounded-xl border border-[#DFE5DD]">
              <div className="text-[10px] text-[#68766C] uppercase font-bold">Pothole Depth</div>
              <div className="text-base font-bold text-[#FFB547] font-mono mt-0.5">{potholeDepth} cm</div>
            </div>
            <div className="bg-[#FFFFFF] p-2.5 rounded-xl border border-[#DFE5DD]">
              <div className="text-[10px] text-[#68766C] uppercase font-bold">Debris Est.</div>
              <div className="text-base font-bold text-[#7C9082] font-mono mt-0.5">{debrisVol} m³</div>
            </div>
          </div>

          <div className="flex gap-2.5 pt-1">
            <button
              onClick={handleSimulateScan}
              className="flex-1 btn-secondary text-xs py-2.5 justify-center cursor-pointer"
            >
              <Camera className="w-4 h-4 mr-1 text-[#1B3022]" /> Re-Scan Mesh
            </button>
            <button
              onClick={handleApply}
              className="flex-1 btn-primary text-xs py-2.5 justify-center cursor-pointer shadow-command-card"
            >
              <Check className="w-4 h-4 mr-1 text-slate-900" /> Apply to Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
