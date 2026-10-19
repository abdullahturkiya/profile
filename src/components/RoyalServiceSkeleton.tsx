import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Crown } from 'lucide-react';
import { ThemeMode } from '../types';

interface RoyalServiceSkeletonProps {
  theme?: ThemeMode;
  count?: number;
}

export const RoyalServiceSkeleton: React.FC<RoyalServiceSkeletonProps> = ({
  theme = 'dark',
  count = 6,
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={`service-skeleton-${i}`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          className={`relative rounded-3xl overflow-hidden border p-5 flex flex-col justify-between min-h-[460px] ${
            theme === 'light'
              ? 'bg-white/80 border-amber-500/20 shadow-[0_10px_30px_rgba(212,175,55,0.06)]'
              : 'bg-slate-900/60 border-amber-400/20 shadow-[0_0_25px_rgba(212,175,55,0.08)]'
          }`}
        >
          {/* Shimmer sweep effect */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-amber-400/10 to-transparent pointer-events-none" />

          {/* Top image placeholder */}
          <div className="space-y-4">
            <div className={`relative w-full h-52 rounded-2xl overflow-hidden flex items-center justify-center ${
              theme === 'light' ? 'bg-amber-500/10' : 'bg-slate-800/80'
            }`}>
              <div className="flex flex-col items-center gap-2 text-amber-400/40">
                <Crown className="w-8 h-8 animate-pulse" />
                <span className="text-[10px] font-mono tracking-widest uppercase">VIP SERVICE</span>
              </div>
              <div className="absolute top-3 right-3 w-16 h-6 rounded-full bg-amber-400/20 border border-amber-400/30 animate-pulse" />
            </div>

            {/* Title & Badge Skeleton */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <div className="h-5 w-3/4 rounded-lg bg-amber-400/15 animate-pulse" />
                <div className="h-4 w-12 rounded-md bg-amber-400/20 animate-pulse" />
              </div>
              <div className="h-3.5 w-1/2 rounded-md bg-slate-500/20 animate-pulse" />
            </div>

            {/* Description lines */}
            <div className="space-y-2 pt-2">
              <div className="h-3 w-full rounded bg-slate-500/15 animate-pulse" />
              <div className="h-3 w-5/6 rounded bg-slate-500/15 animate-pulse" />
            </div>

            {/* Features pills */}
            <div className="flex flex-wrap gap-2 pt-3">
              <div className="h-6 w-20 rounded-full bg-amber-500/10 border border-amber-500/20 animate-pulse" />
              <div className="h-6 w-24 rounded-full bg-amber-500/10 border border-amber-500/20 animate-pulse" />
              <div className="h-6 w-16 rounded-full bg-amber-500/10 border border-amber-500/20 animate-pulse" />
            </div>
          </div>

          {/* Bottom Price & Button */}
          <div className="pt-5 border-t border-amber-500/10 flex items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="h-3 w-10 rounded bg-slate-500/20 animate-pulse" />
              <div className="h-6 w-20 rounded-lg bg-amber-400/20 animate-pulse" />
            </div>
            <div className="h-10 w-28 rounded-xl bg-amber-400/20 border border-amber-400/30 animate-pulse" />
          </div>
        </motion.div>
      ))}
    </>
  );
};
