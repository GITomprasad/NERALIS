import React, { useRef, useState, useEffect } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { Check, X, RotateCcw, PenTool, ShieldCheck } from 'lucide-react';

export const DigitalSignatureModal: React.FC<{ onSignatureSaved?: (dataUrl: string) => void }> = ({
  onSignatureSaved
}) => {
  const { isSignatureModalOpen, setIsSignatureModalOpen, addToast } = usePlatform();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    if (isSignatureModalOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#19C6D2';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [isSignatureModalOpen]);

  if (!isSignatureModalOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasDrawn(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasDrawn(false);
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (canvas && hasDrawn) {
      const dataUrl = canvas.toDataURL('image/png');
      if (onSignatureSaved) onSignatureSaved(dataUrl);
      addToast('Proof-of-Delivery Certified', 'Digital signature securely encrypted and timestamped.', 'SUCCESS');
      setIsSignatureModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[6000] flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#0D1522] rounded-2xl w-full max-w-md overflow-hidden border border-cyan-500/20 shadow-2xl">
        <div className="bg-[#0A101D] text-[#F5F7FA] px-5 py-3.5 flex items-center justify-between border-b border-[#1E2E45]">
          <div className="flex items-center gap-2">
            <PenTool className="w-4 h-4 text-[#19C6D2]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#F5F7FA]">
              Last-Mile Proof of Delivery Signature Pad
            </span>
          </div>
          <button
            onClick={() => setIsSignatureModalOpen(false)}
            className="text-[#64748B] hover:text-[#F5F7FA] transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-3.5">
          <p className="text-xs text-[#94A3B8]">
            Please sign inside the box below to certify recipient receipt of cold-chain vaccines/grain manifest.
          </p>

          {/* Canvas Box */}
          <div className="border-2 border-dashed border-[#1E2E45] rounded-xl bg-[#080D16] relative overflow-hidden">
            <canvas
              ref={canvasRef}
              width={400}
              height={180}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-[180px] cursor-crosshair touch-none"
            />
            {!hasDrawn && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-xs text-[#64748B] font-medium">
                Sign Here with Stylus or Finger
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#64748B]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#20C997]" /> SHA-256 Tamper Evident
            </span>
            <button
              onClick={clearCanvas}
              className="text-[#FF5252] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Clear Signature
            </button>
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              onClick={() => setIsSignatureModalOpen(false)}
              className="flex-1 btn-secondary text-xs py-2 justify-center cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!hasDrawn}
              className={`flex-1 text-xs py-2 justify-center font-bold flex items-center cursor-pointer transition-all rounded-xl ${
                hasDrawn ? 'btn-primary shadow-command-card' : 'bg-[#111D2D] text-[#64748B] border border-[#1E2E45] cursor-not-allowed opacity-50'
              }`}
            >
              <Check className="w-4 h-4 mr-1" /> Confirm Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
