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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[3000] flex items-center justify-center p-4">
      <div className="bg-slate-900 text-white rounded-2xl w-full max-w-lg overflow-hidden border border-slate-700 shadow-2xl relative">
        {/* Top bar */}
        <div className="bg-slate-800/80 px-4 py-3 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              AR Pavement & Landslide Dimension Scanner
            </span>
          </div>
          <button onClick={() => setIsARModalOpen(false)} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport simulation */}
        <div className="relative h-72 bg-gradient-to-b from-slate-950 to-slate-800 flex items-center justify-center overflow-hidden">
          {/* Simulated camera background */}
          <img
            src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80"
            alt="Pavement view"
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
          />

          {/* AR Overlay Lines & Reticle */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="relative w-48 h-48 border border-emerald-500/40 rounded-lg flex items-center justify-center">
              <Crosshair className="w-10 h-10 text-emerald-400 animate-pulse" />
              {/* AR Laser Dimension vector */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_8px_#34d399]"></div>
              <div className="absolute top-2 left-2 bg-black/70 px-1.5 py-0.5 rounded text-[10px] text-emerald-300 font-mono">
                L: {crackLength} m
              </div>
              <div className="absolute bottom-2 right-2 bg-black/70 px-1.5 py-0.5 rounded text-[10px] text-amber-300 font-mono">
                D: {potholeDepth} cm
              </div>
            </div>
          </div>

          {measurementStep === 'MEASURING' && (
            <div className="absolute inset-0 bg-emerald-950/60 backdrop-blur-xs flex items-center justify-center gap-2 text-xs font-bold text-emerald-300">
              <Sparkles className="w-5 h-5 animate-spin" /> LiDAR Mesh Point-Cloud Computing...
            </div>
          )}
        </div>

        {/* Bottom stats & action */}
        <div className="p-4 bg-slate-900 space-y-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-800 p-2 rounded-lg border border-slate-700">
              <div className="text-[10px] text-gray-400">Crack Span</div>
              <div className="text-base font-bold text-emerald-400 font-mono">{crackLength} m</div>
            </div>
            <div className="bg-slate-800 p-2 rounded-lg border border-slate-700">
              <div className="text-[10px] text-gray-400">Pothole Depth</div>
              <div className="text-base font-bold text-amber-400 font-mono">{potholeDepth} cm</div>
            </div>
            <div className="bg-slate-800 p-2 rounded-lg border border-slate-700">
              <div className="text-[10px] text-gray-400">Debris Est.</div>
              <div className="text-base font-bold text-sky-400 font-mono">{debrisVol} m³</div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSimulateScan}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-600"
            >
              <Camera className="w-3.5 h-3.5" /> Re-scan LiDAR Mesh
            </button>
            <button
              onClick={handleApply}
              className="flex-1 bg-[#1E3A5F] hover:bg-[#2563A8] text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border border-sky-400/40 shadow-sm"
            >
              <Check className="w-4 h-4" /> Inject into Field Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
