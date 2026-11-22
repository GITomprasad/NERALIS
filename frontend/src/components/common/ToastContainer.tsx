import React from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { AlertTriangle, CheckCircle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = usePlatform();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-[9999] space-y-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isDanger = toast.tier === 'DANGER';
        const isWarning = toast.tier === 'WARNING';
        const isSuccess = toast.tier === 'SUCCESS';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl shadow-2xl border backdrop-blur-md bg-[#FCF6F5]/95 flex items-start gap-3 transition-all animate-in slide-in-from-right duration-200 ${
              isDanger
                ? 'border-l-4 border-l-[#FF5252] border-rose-500/30 text-rose-200'
                : isWarning
                ? 'border-l-4 border-l-[#FFB547] border-amber-500/30 text-amber-200'
                : isSuccess
                ? 'border-l-4 border-l-[#20C997] border-emerald-500/30 text-emerald-200'
                : 'border-l-4 border-l-[#19C6D2] border-[#990011]/30 text-cyan-200'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isDanger && <XCircle className="w-4 h-4 text-[#FF5252]" />}
              {isWarning && <AlertTriangle className="w-4 h-4 text-[#FFB547]" />}
              {isSuccess && <CheckCircle className="w-4 h-4 text-[#20C997]" />}
              {!isDanger && !isWarning && !isSuccess && <Info className="w-4 h-4 text-[#990011]" />}
            </div>

            <div className="flex-1 min-w-0 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-[#252124] truncate">{toast.title}</span>
                <span className="text-[10px] text-[#786D6D] shrink-0 font-mono">{toast.timestamp}</span>
              </div>
              <p className="text-[#786D6D] mt-0.5 leading-snug">{toast.message}</p>
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="text-[#786D6D] hover:text-[#252124] transition-colors shrink-0 p-0.5 rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
