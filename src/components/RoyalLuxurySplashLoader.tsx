import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Crown, Sparkles, Database, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ThemeMode } from '../types';

interface RoyalLuxurySplashLoaderProps {
  theme?: ThemeMode;
  stageText: string;
  progressPercent: number;
  brandName?: string;
  brandSubtitle?: string;
}

export const RoyalLuxurySplashLoader: React.FC<RoyalLuxurySplashLoaderProps> = ({
  theme = 'dark',
  stageText,
  progressPercent,
  brandName = 'عبد الله في تركيا',
  brandSubtitle = 'للخدمات السياحية والعقارية في تركيا',
}) => {
  const [dots, setDots] = useState('');

  // Subtle animated dots for live feeling
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 450);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03, filter: 'blur(10px)' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden bg-[#060A16] text-slate-100 px-4 select-none"
    >
      {/* 1. Deep Royal Radial Glow Background */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 45%, rgba(212, 175, 55, 0.15) 0%, rgba(6, 10, 22, 0.85) 55%, #060A16 100%)',
        }}
      />

      {/* Subtle Golden Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#D4AF37 1px, transparent 1px), linear-gradient(90deg, #D4AF37 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* 2. Central Luxury Royal Seal / Emblem */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full text-center">
        
        {/* Outer Rotating Chronometer / Royal Astrolabe Ring */}
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center mb-8">
          {/* Ambient Golden Pulsing Halo */}
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.25, 0.5, 0.25],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/20 via-amber-300/30 to-yellow-600/10 blur-xl"
          />

          {/* Clockwise rotating dashed royal orbit */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute inset-0 rounded-full border border-dashed border-amber-400/40"
          />

          {/* Counter-clockwise rotating inner notch ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{
              duration: 26,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute inset-2 rounded-full border border-amber-500/20 border-t-amber-400/80 border-b-amber-300/60 shadow-[0_0_20px_rgba(212,175,55,0.2)]"
          />

          {/* Center Royal Crown Shield */}
          <motion.div
            animate={{
              y: [0, -4, 0],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center shadow-2xl border border-amber-400/60"
            style={{
              background: 'linear-gradient(135deg, rgba(26, 20, 10, 0.95) 0%, rgba(10, 14, 26, 0.98) 100%)',
              boxShadow: '0 0 35px rgba(212, 175, 55, 0.35), inset 0 0 15px rgba(212, 175, 55, 0.2)',
            }}
          >
            <Crown className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400 drop-shadow-[0_0_12px_rgba(245,222,147,0.8)]" />
            <Sparkles className="w-4 h-4 text-amber-200 absolute -top-1 -right-1 animate-pulse" />
          </motion.div>
        </div>

        {/* Brand Name with Gold Gradient */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-2 mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-[10px] sm:text-xs font-mono tracking-widest uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>بوابة النخبة للسياحة والعقارات</span>
          </div>

          <h1 
            className="text-2xl sm:text-3xl font-extrabold tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #FFF0B3 0%, #D4AF37 45%, #AA771C 80%, #F5DE93 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {brandName}
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 font-medium tracking-wide">
            {brandSubtitle}
          </p>
        </motion.div>

        {/* 3. Real Live Database Progress Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-full max-w-xs space-y-3"
        >
          {/* Laser Progress Bar */}
          <div className="relative w-full h-1.5 rounded-full bg-slate-900 border border-amber-500/20 overflow-hidden shadow-inner">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-200 shadow-[0_0_15px_#D4AF37]"
              initial={{ width: '8%' }}
              animate={{ width: `${Math.max(12, Math.min(100, progressPercent))}%` }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />
          </div>

          {/* Dynamic Stage Text (Real Database Activity) */}
          <div className="flex items-center justify-between text-xs px-1">
            <div className="flex items-center gap-2 text-amber-200/90 font-medium">
              <Database className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>{stageText}{dots}</span>
            </div>
            <span className="font-mono text-xs text-amber-400 font-bold">
              {Math.round(Math.max(12, Math.min(100, progressPercent)))}%
            </span>
          </div>

          {/* Connection Security Badge */}
          <div className="pt-2 flex items-center justify-center gap-2 text-[10px] text-slate-500 font-mono">
            <CheckCircle2 className="w-3 h-3 text-emerald-400/80" />
            <span>اتصال مباشر ومحدث سحابياً مع Supabase</span>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};
