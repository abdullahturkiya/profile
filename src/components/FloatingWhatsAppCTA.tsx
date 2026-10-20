import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FloatingWhatsAppCTA: React.FC = () => {
  const { primaryWhatsAppNumber, siteSettings } = useApp();
  const targetWhatsAppNumber = siteSettings.contactWhatsAppNumber || primaryWhatsAppNumber;
  const targetWhatsAppMessage = siteSettings.contactWhatsAppDefaultMessage || 'مرحباً، أود التواصل معكم من أجل الخدمات في تركيا.';

  const directWhatsAppUrl = `https://wa.me/${targetWhatsAppNumber}?text=${encodeURIComponent(
    targetWhatsAppMessage
  )}`;

  return (
    <motion.aside
      aria-label="مستشار كونسيرج VIP المباشر"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed bottom-6 left-6 z-40 flex items-center gap-3"
    >
      {/* Tooltip Badge */}
      <div className="hidden sm:flex items-center gap-2 rounded-full border border-amber-400/30 bg-slate-900/90 py-2 px-4 shadow-[0_10px_25px_rgba(0,0,0,0.6)] backdrop-blur-md">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
        </span>
        <span className="text-xs font-semibold text-slate-200 whitespace-nowrap">
          مستشار كونسيرج متاح الآن
        </span>
      </div>

      {/* Glowing Round Floating Button */}
      <a
        href={directWhatsAppUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل مع مستشارك السياحي عبر واتساب"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-white shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-[0_0_35px_rgba(16,185,129,0.8)]"
      >
        <div className="absolute -inset-1 rounded-full border border-amber-400/40 animate-pulse pointer-events-none" />
        <MessageCircle className="h-7 w-7 fill-white" />
      </a>
    </motion.aside>
  );
};
