import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, Sparkles, Loader2, X } from 'lucide-react';
import { ThemeMode } from '../types';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'loading';
  duration?: number;
}

interface ToastNotificationContainerProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
  theme: ThemeMode;
}

export const ToastNotificationContainer: React.FC<ToastNotificationContainerProps> = ({
  toasts,
  removeToast,
  theme,
}) => {
  return (
    <div className="fixed bottom-5 left-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-3 sm:px-0">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.85 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`pointer-events-auto relative flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl border shadow-2xl backdrop-blur-2xl transition-colors ${
              theme === 'light'
                ? toast.type === 'success'
                  ? 'border-emerald-300 bg-white/95 text-emerald-950 shadow-[0_8px_25px_rgba(16,185,129,0.18)]'
                  : toast.type === 'error'
                  ? 'border-red-300 bg-white/95 text-red-950 shadow-[0_8px_25px_rgba(239,68,68,0.18)]'
                  : toast.type === 'loading'
                  ? 'border-amber-300 bg-white/95 text-amber-950 shadow-[0_8px_25px_rgba(212,175,55,0.18)]'
                  : 'border-slate-300 bg-white/95 text-slate-900 shadow-[0_8px_25px_rgba(0,0,0,0.1)]'
                : toast.type === 'success'
                ? 'border-emerald-500/40 bg-slate-950/90 text-emerald-200 shadow-[0_0_25px_rgba(16,185,129,0.25)]'
                : toast.type === 'error'
                ? 'border-red-500/40 bg-slate-950/90 text-red-200 shadow-[0_0_25px_rgba(239,68,68,0.25)]'
                : toast.type === 'loading'
                ? 'border-amber-400/40 bg-slate-950/90 text-amber-200 shadow-[0_0_25px_rgba(212,175,55,0.25)]'
                : 'border-amber-400/30 bg-slate-950/90 text-slate-100 shadow-[0_0_25px_rgba(212,175,55,0.15)]'
            }`}
          >
            {/* Icon area */}
            <div className="flex items-center gap-3 min-w-0">
              <div className={`p-2 rounded-xl shrink-0 ${
                toast.type === 'success'
                  ? 'bg-emerald-500/15 text-emerald-500'
                  : toast.type === 'error'
                  ? 'bg-red-500/15 text-red-500'
                  : toast.type === 'loading'
                  ? 'bg-amber-400/15 text-amber-400'
                  : 'bg-sky-500/15 text-sky-400'
              }`}>
                {toast.type === 'success' && <CheckCircle2 className="h-5 w-5" />}
                {toast.type === 'error' && <AlertCircle className="h-5 w-5" />}
                {toast.type === 'loading' && <Loader2 className="h-5 w-5 animate-spin" />}
                {toast.type === 'info' && <Sparkles className="h-5 w-5" />}
              </div>

              <div className="flex flex-col text-right min-w-0">
                <span className="text-xs sm:text-sm font-bold leading-snug break-words">
                  {toast.message}
                </span>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={() => removeToast(toast.id)}
              className={`p-1 rounded-lg transition-colors shrink-0 ${
                theme === 'light'
                  ? 'hover:bg-slate-200/60 text-slate-500'
                  : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              aria-label="إغلاق الإشعار"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
