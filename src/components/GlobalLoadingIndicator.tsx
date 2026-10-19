import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, Sparkles, Loader2 } from 'lucide-react';
import { ThemeMode } from '../types';

interface GlobalLoadingIndicatorProps {
  isLoading: boolean;
  loadingText?: string;
  theme: ThemeMode;
}

export const GlobalLoadingIndicator: React.FC<GlobalLoadingIndicatorProps> = ({
  isLoading,
  loadingText = 'جاري التحميل...',
  theme,
}) => {
  return (
    <>
      {/* 1. Top Laser Loading Progress Bar */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 inset-x-0 z-[10000] pointer-events-none h-1 bg-amber-950/20 overflow-hidden"
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                repeat: Infinity,
                duration: 1.2,
                ease: 'easeInOut',
              }}
              className="h-full w-2/3 bg-gradient-to-r from-transparent via-amber-400 to-amber-200 shadow-[0_0_15px_#D4AF37]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Royal Floating Loading Badge Modal Overlay when performing critical async requests */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[9998] pointer-events-none"
          >
            <div className={`flex items-center gap-3 px-5 py-2.5 rounded-full border shadow-2xl backdrop-blur-2xl ${
              theme === 'light'
                ? 'border-amber-500/40 bg-white/95 text-amber-950 shadow-[0_10px_30px_rgba(212,175,55,0.25)]'
                : 'border-amber-400/40 bg-slate-950/90 text-amber-200 shadow-[0_0_30px_rgba(212,175,55,0.3)]'
            }`}>
              <div className="relative flex items-center justify-center">
                <Crown className="h-4 w-4 text-amber-400 animate-bounce" />
                <Sparkles className="h-3 w-3 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <span className="text-xs sm:text-sm font-bold tracking-wide">
                {loadingText}
              </span>
              <Loader2 className="h-4 w-4 text-amber-400 animate-spin shrink-0" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
