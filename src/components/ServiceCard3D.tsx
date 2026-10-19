import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Star, MessageCircle, MessageSquareQuote, Check, Sparkles, MapPin } from 'lucide-react';
import { TourismService } from '../types';
import { useApp } from '../context/AppContext';

interface ServiceCard3DProps {
  service: TourismService;
  onOpenReviews: (service: TourismService) => void;
  index: number;
}

export const ServiceCard3D: React.FC<ServiceCard3DProps> = ({ service, onOpenReviews, index }) => {
  const { getServiceRating, primaryWhatsAppNumber, theme } = useApp();
  const ratingInfo = getServiceRating(service.id);
  const [imageError, setImageError] = useState(false);

  // 3D Tilt Physics
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 220, damping: 20 };
  const mouseX = useSpring(x, springConfig);
  const mouseY = useSpring(y, springConfig);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-8, 8]);

  // Glare highlight
  const glareX = useTransform(mouseX, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], [0, 100]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const bookingWhatsAppMessage = `مرحباً، أود حجز واستشارة بخصوص:
🌟 ${service.title} (${service.englishTitle || service.destination})
💵 السعر المعروض: $${service.price} ${service.currency}
أرجو تزويدي بالبرنامج ومواعيد الانطلاق المتاحة. شكراً لكم.`;

  const bookingWhatsAppUrl = `https://wa.me/${primaryWhatsAppNumber}?text=${encodeURIComponent(bookingWhatsAppMessage)}`;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative flex flex-col justify-between rounded-3xl border transition-all duration-300 overflow-hidden w-full ${
        theme === 'light'
          ? 'border-slate-200 bg-white text-slate-900 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-amber-400 hover:shadow-[0_15px_35px_rgba(212,175,55,0.15)]'
          : 'border-amber-400/25 bg-gradient-to-b from-slate-900/95 via-[#0a1224]/95 to-[#060a16]/98 text-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.7)] hover:border-amber-400/60 hover:shadow-[0_25px_60px_rgba(212,175,55,0.22)]'
      }`}
    >
      {/* Dynamic Glare Reflection */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-20 mix-blend-overlay transition-opacity duration-300 z-10"
        style={{
          background: useTransform(
            [glareX, glareY],
            ([gx, gy]) =>
              `radial-gradient(circle 280px at ${gx}% ${gy}%, rgba(255, 235, 175, 0.8), transparent 70%)`
          ),
        }}
      />

      {/* Card Header & High-Res Visual */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-950 border-b border-amber-400/20">
        {!imageError ? (
          <img
            src={service.imageUrl}
            alt={service.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0c162b] to-[#060a16] p-6 text-center">
            <Sparkles className="h-10 w-10 text-amber-400 mb-2" />
            <span className="text-base font-bold text-amber-200">{service.title}</span>
            <span className="text-xs text-slate-400 mt-1">{service.destination}</span>
          </div>
        )}

        {/* Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

        {/* Floating VIP Badge (Elevated in 3D) */}
        <div 
          style={{ transform: 'translateZ(30px)' }}
          className="absolute top-3.5 right-3.5 z-20 inline-flex items-center gap-1.5 rounded-full border border-amber-400/50 bg-slate-950/85 px-3 py-1 text-[11px] font-bold text-amber-300 backdrop-blur-md shadow-[0_0_15px_rgba(212,175,55,0.3)]"
        >
          <Sparkles className="h-3 w-3 text-amber-300" />
          <span>{service.badge}</span>
        </div>

        {/* Price Tag (Elevated in 3D) */}
        <div 
          style={{ transform: 'translateZ(30px)' }}
          className="absolute bottom-3 left-3 z-20 flex items-baseline gap-1 rounded-xl border border-amber-400/40 bg-slate-950/90 px-3 py-1 backdrop-blur-md"
        >
          <span className="text-[11px] text-amber-300/80 font-medium">ابتداءً من</span>
          <span className="text-base font-bold text-gold-gradient font-mono tabular-nums">
            ${service.price}
          </span>
          <span className="text-[10px] text-slate-400">{service.currency}</span>
        </div>

        {/* Destination Pill */}
        <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1 text-[11px] font-medium text-slate-300 bg-slate-900/85 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-slate-700/50">
          <MapPin className="h-3 w-3 text-amber-400" />
          <span>{service.destination}</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex flex-col flex-1 justify-between text-right">
        <div>
          {/* Average Rating Bar */}
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3.5 w-3.5 ${
                      star <= Math.round(ratingInfo.average)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-transparent text-slate-600'
                    }`}
                  />
                ))}
              </div>
              <span className={`text-xs font-bold tabular-nums ${
                theme === 'light' ? 'text-amber-800' : 'text-amber-200'
              }`}>
                {ratingInfo.average.toFixed(1)}
              </span>
            </div>

            <button
              onClick={() => onOpenReviews(service)}
              className={`text-[11px] transition-colors flex items-center gap-1 underline underline-offset-4 ${
                theme === 'light' ? 'text-amber-700 hover:text-amber-900' : 'text-amber-300 hover:text-amber-200'
              }`}
            >
              <span>({ratingInfo.count} تقييم معتمد)</span>
            </button>
          </div>

          {/* Title (Elevated in 3D) */}
          <h3 
            style={{ transform: 'translateZ(25px)' }}
            className={`text-lg font-bold transition-colors leading-snug ${
              theme === 'light'
                ? 'text-slate-900 group-hover:text-amber-800'
                : 'text-slate-100 group-hover:text-amber-200'
            }`}
          >
            {service.title}
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5 font-mono truncate">
            {service.englishTitle}
          </p>

          {/* Description */}
          <p className={`mt-2.5 text-xs leading-relaxed line-clamp-3 ${
            theme === 'light' ? 'text-slate-600' : 'text-slate-300'
          }`}>
            {service.description}
          </p>

          {/* Features Checklist */}
          {service.features && service.features.length > 0 && (
            <div className={`mt-3.5 space-y-1.5 border-t pt-2.5 ${
              theme === 'light' ? 'border-amber-900/10' : 'border-slate-800/80'
            }`}>
              {service.features.slice(0, 3).map((feat, i) => (
                <div key={i} className={`flex items-center gap-1.5 text-xs ${
                  theme === 'light' ? 'text-slate-700 font-medium' : 'text-slate-300'
                }`}>
                  <Check className="h-3 w-3 text-amber-500 shrink-0" />
                  <span className="truncate">{feat}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons: Horizontal in One Single Row (Fully Responsive, Never Overlaps or Overflows) */}
        <div 
          style={{ transform: 'translateZ(35px)' }}
          className={`mt-5 pt-3.5 border-t grid grid-cols-2 gap-2 w-full items-stretch ${
            theme === 'light' ? 'border-slate-100' : 'border-amber-400/20'
          }`}
        >
          {/* Primary Action: Book via WhatsApp */}
          <a
            href={bookingWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="احجز عبر واتساب"
            className={`w-full min-w-0 inline-flex items-center justify-center gap-1 sm:gap-1.5 rounded-xl py-2.5 px-1.5 sm:px-2.5 font-bold text-[11px] sm:text-xs transition-all hover:scale-[1.02] active:scale-[0.98] text-center ${
              theme === 'light'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_2px_10px_rgba(16,185,129,0.25)] border border-emerald-500'
                : 'text-slate-950 shadow-[0_0_15px_rgba(212,175,55,0.25)] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]'
            }`}
            style={
              theme === 'light'
                ? undefined
                : {
                    background: 'linear-gradient(135deg, #FFF0B3 0%, #D4AF37 45%, #AA771C 80%, #F5DE93 100%)',
                  }
            }
          >
            <MessageCircle className={`h-3.5 w-3.5 shrink-0 ${theme === 'light' ? 'fill-white text-white' : 'fill-slate-950 text-slate-950'}`} />
            <span className={`truncate font-bold ${theme === 'light' ? 'text-white' : 'text-slate-950'}`}>احجز الآن</span>
          </a>

          {/* Secondary Action: Read & Write Reviews */}
          <button
            type="button"
            onClick={() => onOpenReviews(service)}
            title="التقييمات والتعليقات"
            className={`w-full min-w-0 inline-flex items-center justify-center gap-1 sm:gap-1.5 rounded-xl border py-2.5 px-1.5 sm:px-2.5 text-[11px] sm:text-xs font-bold transition-all text-center ${
              theme === 'light'
                ? 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-amber-50 hover:border-amber-400 hover:text-amber-900 shadow-sm'
                : 'border-amber-400/35 bg-slate-900/90 text-amber-200 hover:bg-amber-400/15 hover:border-amber-400/60'
            }`}
          >
            <MessageSquareQuote className={`h-3.5 w-3.5 shrink-0 ${theme === 'light' ? 'text-amber-600' : 'text-amber-400'}`} />
            <span className="truncate">التقييمات</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
