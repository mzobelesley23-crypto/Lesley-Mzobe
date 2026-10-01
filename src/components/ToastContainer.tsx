import React from 'react';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useMarketplace();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl shadow-lg border text-xs font-medium backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-2 ${
            toast.type === 'success'
              ? 'bg-neutral-900 text-white border-neutral-800'
              : toast.type === 'error'
              ? 'bg-rose-950 text-rose-100 border-rose-800'
              : 'bg-white text-neutral-900 border-neutral-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-amber-500 shrink-0" />}
            <span className="line-clamp-2">{toast.message}</span>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 opacity-60 hover:opacity-100 transition-opacity cursor-pointer shrink-0"
            title="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
