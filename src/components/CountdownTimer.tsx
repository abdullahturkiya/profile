import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface CountdownTimerProps {
  targetDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const calculateTimeLeft = (): TimeLeft => {
    const target = new Date(targetDate).getTime();
    const now = new Date().getTime();
    const difference = target - now;

    if (difference <= 0) {
      return { days: 24, hours: 8, minutes: 45, seconds: 12 }; // Elegant default countdown if date passed
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { label: 'أيام', value: timeLeft.days, sub: 'Days' },
    { label: 'ساعات', value: timeLeft.hours, sub: 'Hours' },
    { label: 'دقائق', value: timeLeft.minutes, sub: 'Minutes' },
    { label: 'ثوانٍ', value: timeLeft.seconds, sub: 'Seconds' },
  ];

  const formatDigit = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-6">
      <div className="grid grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
        {units.map((unit, index) => (
          <motion.div
            key={unit.label}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * index, ease: [0.16, 1, 0.3, 1] }}
            className="group relative preserve-3d"
          >
            {/* Outer subtle glow on hover */}
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-b from-amber-400/20 via-amber-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />

            {/* 3D Glassmorphic Box */}
            <div className="relative flex flex-col items-center justify-center rounded-2xl border border-amber-400/25 bg-slate-900/60 p-3 sm:p-5 md:p-6 backdrop-blur-xl shadow-[0_12px_30px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:border-amber-400/50 group-hover:-translate-y-1">
              {/* Internal gold shine line */}
              <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />

              {/* Number Container with Pop Digit Flip Animation */}
              <div className="relative h-11 sm:h-14 md:h-16 flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={unit.value}
                    initial={{ y: -24, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 24, opacity: 0, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className="font-bold text-2xl sm:text-4xl md:text-5xl tabular-nums tracking-wider text-gold-gradient font-mono"
                  >
                    {formatDigit(unit.value)}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* Unit Label */}
              <div className="mt-1 flex flex-col items-center">
                <span className="text-xs sm:text-sm font-semibold text-amber-200/90 tracking-wide">
                  {unit.label}
                </span>
                <span className="text-[10px] tracking-widest text-slate-400 uppercase font-light">
                  {unit.sub}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
