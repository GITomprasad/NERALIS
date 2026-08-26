import React from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { AlertTriangle, CheckCircle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = usePlatform();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-5 z-[9999] space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isDanger = toast.tier === 'DANGER';
        const isWarning = toast.tier === 'WARNING';
        const isSuccess = toast.tier === 'SUCCESS';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl shadow-xl border bg-white flex items-start gap-3 transition-all animate-in slide-in-from-right duration-200 ${
              isDanger
                ? 'border-l-4 border-l-red-600 border-red-200'
                : isWarning
                ? 'border-l-4 border-l-amber-500 border-amber-200'
                : isSuccess
                ? 'border-l-4 border-l-emerald-600 border-emerald-200'
                : 'border-l-4 border-l-blue-600 border-blue-200'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isDanger && <XCircle className="w-4 h-4 text-red-600" />}
              {isWarning && <AlertTriangle className="w-4 h-4 text-amber-500" />}
              {isSuccess && <CheckCircle className="w-4 h-4 text-emerald-600" />}
              {!isDanger && !isWarning && !isSuccess && <Info className="w-4 h-4 text-blue-600" />}
            </div>

            <div className="flex-1 min-w-0 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">{toast.title}</span>
                <span className="text-[10px] text-gray-400">{toast.timestamp}</span>
              </div>
              <p className="text-gray-600 mt-0.5 leading-snug">{toast.message}</p>
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
