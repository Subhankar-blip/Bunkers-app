import React from 'react';
import { useTrip } from '../../context/TripContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useTrip();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let Icon = Info;
        let bgStyle = 'bg-slate-900 border-slate-700 text-slate-100';
        let iconColor = 'text-blue-400';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          bgStyle = 'bg-slate-900/95 border-emerald-500/40 text-slate-100 shadow-emerald-950/40';
          iconColor = 'text-emerald-400';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          bgStyle = 'bg-slate-900/95 border-rose-500/40 text-slate-100 shadow-rose-950/40';
          iconColor = 'text-rose-400';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          bgStyle = 'bg-slate-900/95 border-amber-500/40 text-slate-100 shadow-amber-950/40';
          iconColor = 'text-amber-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-xl transition-all duration-300 transform translate-y-0 ${bgStyle}`}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              {toast.title && (
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-0.5">
                  {toast.title}
                </h4>
              )}
              <p className="text-sm font-medium text-slate-100 leading-snug">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
