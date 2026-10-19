import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { MessageCircle, Sparkles, Send, Compass, ShieldCheck, PhoneCall } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';
import { SITE_CONFIG } from '../config/siteConfig';

interface HeroCard3DProps {
  onOpenInquiry: (destination?: string) => void;
}

export const HeroCard3D: React.FC<HeroCard3DProps> = ({ onOpenInquiry }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Motion Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Responsive spring physics for natural tilt settle
  const springPhysics = { stiffness: 180, damping: 20, mass: 0.8 };
  const mouseX = useSpring(x, springPhysics);
  const mouseY = useSpring(y, springPhysics);

  // Transforms: rotateX maps from mouseY, rotateY maps from mouseX (inverted for natural 3D tilt)
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-12, 12]);

  // Glare position
  const glareX = useTransform(mouseX, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], [0, 100]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    // Normalizing from -0.5 to 0.5
    const xPct = (clientX / width) - 0.5;
    const yPct = (clientY / height) - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const directWhatsAppUrl = `https://wa.me/${SITE_CONFIG.contact.whatsappNumber}?text=${encodeURIComponent(
    SITE_CONFIG.contact.defaultWhatsAppMessage
  )}`;

  return (
    <div className="perspective-1200 w-full max-w-4xl mx-auto px-4 sm:px-6">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-3xl border border-amber-400/25 bg-gradient-to-b from-slate-900/85 via-[#091122]/90 to-[#060a16]/95 p-6 sm:p-10 md:p-12 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] backdrop-blur-2xl transition-shadow duration-500 hover:shadow-[0_30px_70px_rgba(212,175,55,0.18)]"
      >
        {/* Dynamic Light Glare Overlay */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-20 mix-blend-overlay transition-opacity duration-300"
          style={{
            background: useTransform(
              [glareX, glareY],
              ([gx, gy]) =>
                `radial-gradient(circle 350px at ${gx}% ${gy}%, rgba(255, 235, 175, 0.5), transparent 70%)`
            ),
          }}
        />

        {/* Ambient Top Gold Line */}
        <div className="absolute inset-x-12 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

        {/* Inner Content with Layered Z-Depth */}
        <div style={{ transform: 'translateZ(40px)', transformStyle: 'preserve-3d' }} className="flex flex-col items-center text-center">
          
          {/* Glowing Gold Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1.5 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
            </span>
            <span className="text-xs sm:text-sm font-medium tracking-wide text-amber-200">
              {SITE_CONFIG.company.sloganAr}
            </span>
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          </div>

          {/* Majestic Metallic-Gold Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-[1.25] tracking-tight text-gold-gradient max-w-3xl mb-4 text-balance">
            بوابتكم لخدمات السياحة والعقارات الفاخرة في تركيا
          </h1>

          {/* Luxury Subtitle & VIP Availability Guarantee */}
          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl font-light leading-relaxed mb-6">
            نصمم أرقى الرحلات السياحية الملكية في إسطنبول، كابادوكيا، أنطاليا والشمال التركي. 
            <span className="block mt-1 font-medium text-amber-300">
              منصتنا الرقمية قيد الإطلاق، ولكن حجوزات VIP والاستشارات المباشرة متاحة الآن على مدار الساعة.
            </span>
          </p>

          {/* 3D Animated Countdown Timer */}
          <div style={{ transform: 'translateZ(25px)' }} className="w-full">
            <div className="flex items-center justify-center gap-2 text-xs font-medium text-amber-300/80 mb-2">
              <Compass className="h-3.5 w-3.5" />
              <span>العد التنازلي للإطلاق الرسمي للمنصة الكاملة</span>
            </div>
            <CountdownTimer targetDate={SITE_CONFIG.launchDate} />
          </div>

          {/* Action CTAs: WhatsApp Instant Booking & Custom Inquiry */}
          <div 
            style={{ transform: 'translateZ(50px)' }}
            className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            {/* Primary Glowing WhatsApp Button */}
            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center gap-3 w-full sm:w-auto rounded-xl px-8 py-4 font-bold text-slate-950 transition-all duration-300 overflow-hidden shadow-[0_0_25px_rgba(212,175,55,0.35)] hover:shadow-[0_0_35px_rgba(212,175,55,0.6)] hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #FFF0B3 0%, #D4AF37 45%, #AA771C 80%, #F5DE93 100%)',
              }}
            >
              {/* Button Shimmer Ray */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform" />
              
              <MessageCircle className="h-5 w-5 fill-slate-950 text-slate-950 shrink-0" />
              <span className="text-base whitespace-nowrap">
                تواصل مع مستشارك السياحي الآن عبر واتساب
              </span>
            </a>

            {/* Secondary Inquiry Modal Trigger */}
            <button
              onClick={() => onOpenInquiry()}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-xl border border-amber-400/40 bg-slate-900/60 px-6 py-4 font-semibold text-amber-100 backdrop-blur-md transition-all duration-300 hover:bg-amber-400/15 hover:border-amber-400/80 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Send className="h-4 w-4 text-amber-300" />
              <span className="text-base whitespace-nowrap">
                اطلب عرض سعر مخصص الآن
              </span>
            </button>
          </div>

          {/* Live Concierge Status Indicator */}
          <div style={{ transform: 'translateZ(20px)' }} className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-amber-400" />
              <span>{SITE_CONFIG.company.tursabLicenseNumber}</span>
            </div>
            <span className="hidden sm:inline text-amber-500/40">•</span>
            <div className="flex items-center gap-2">
              <PhoneCall className="h-4 w-4 text-emerald-400" />
              <span className="text-emerald-300">مستشار كونسيرج متاح الآن للرد الفوري</span>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};
