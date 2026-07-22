import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const styles = {
    success: {
      bg: 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200 shadow-emerald-950/50',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />,
    },
    error: {
      bg: 'bg-rose-950/90 border-rose-500/40 text-rose-200 shadow-rose-950/50',
      icon: <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />,
    },
    warning: {
      bg: 'bg-amber-950/90 border-amber-500/40 text-amber-200 shadow-amber-950/50',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />,
    },
  }[type];

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 border rounded-xl shadow-2xl backdrop-blur-md transition-all duration-300 transform translate-y-0 ${styles.bg}`}
    >
      {styles.icon}
      <span className="text-xs font-semibold pr-2 leading-relaxed">{message}</span>
      <button
        onClick={onClose}
        className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors ml-auto"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
