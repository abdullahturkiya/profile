import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Anchor, Sparkles, Mountain, ArrowLeft, CheckCircle2, MessageCircle } from 'lucide-react';
import { SITE_CONFIG, ServiceTeaser } from '../config/siteConfig';

interface ServiceTeasers3DProps {
  onSelectService: (service: ServiceTeaser) => void;
}

const ServiceMiniCard3D: React.FC<{
  service: ServiceTeaser;
  index: number;
  onSelect: () => void;
}> = ({ service, index, onSelect }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springPhysics = { stiffness: 220, damping: 22 };
  const mouseX = useSpring(x, springPhysics);
  const mouseY = useSpring(y, springPhysics);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);

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

  const getIcon = () => {
    if (service.id.includes('istanbul')) return <Anchor className="h-5 w-5 text-amber-300" />;
    if (service.id.includes('cappadocia')) return <Sparkles className="h-5 w-5 text-amber-300" />;
    return <Mountain className="h-5 w-5 text-amber-300" />;
  };

  // Luxury visual vector representation for each destination (guaranteed zero broken images)
  const renderVisualArtwork = () => {
    if (service.id === 'istanbul-yachts') {
      return (
        <div className="relative h-44 w-full overflow-hidden rounded-t-2xl bg-gradient-to-b from-[#0e1a32] via-[#091122] to-[#060a16] border-b border-amber-400/20">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 200" fill="none">
            {/* Sunset glow */}
            <circle cx="200" cy="110" r="60" fill="#D4AF37" fillOpacity="0.25" filter="blur(20px)" />
            <circle cx="200" cy="110" r="30" fill="#FFF2B2" fillOpacity="0.3" filter="blur(10px)" />
            {/* Maiden's tower silhouette */}
            <path d="M120 130 L130 90 L140 130 Z" fill="#D4AF37" fillOpacity="0.6" />
            <line x1="130" y1="90" x2="130" y2="78" stroke="#D4AF37" strokeWidth="2" />
            {/* Bosphorus bridge silhouette */}
            <path d="M20 120 Q120 100 220 105 T400 115" stroke="#D4AF37" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="3 3" />
            {/* Luxury Yacht in foreground */}
            <path d="M180 145 L320 145 Q335 145 345 138 L305 160 L195 160 Z" fill="#0E1E3A" stroke="#D4AF37" strokeWidth="1.2" />
            <path d="M210 144 L280 144 L270 128 L220 128 Z" fill="#1A2D52" stroke="#F3E5AB" strokeWidth="1" />
            <line x1="260" y1="128" x2="245" y2="114" stroke="#D4AF37" strokeWidth="1.5" />
            {/* Water reflections */}
            <line x1="150" y1="165" x2="350" y2="165" stroke="#D4AF37" strokeOpacity="0.3" strokeWidth="1" />
            <line x1="180" y1="172" x2="320" y2="172" stroke="#D4AF37" strokeOpacity="0.2" strokeWidth="1" />
          </svg>
          <div className="absolute top-3 right-3 rounded-full bg-slate-950/70 border border-amber-400/40 px-3 py-1 text-[11px] font-semibold text-amber-300 backdrop-blur-md">
            {service.badge}
          </div>
          <div className="absolute bottom-3 left-3 text-[11px] font-mono text-slate-400">
            {service.englishTitle}
          </div>
        </div>
      );
    }

    if (service.id === 'cappadocia-antalya') {
      return (
        <div className="relative h-44 w-full overflow-hidden rounded-t-2xl bg-gradient-to-b from-[#1a1c36] via-[#101426] to-[#060a16] border-b border-amber-400/20">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 200" fill="none">
            {/* Morning Sun */}
            <circle cx="280" cy="80" r="50" fill="#FFB703" fillOpacity="0.2" filter="blur(25px)" />
            {/* Cappadocia Fairy Chimneys valleys */}
            <path d="M0 160 Q80 110 160 170 T320 130 Q360 110 400 160 L400 200 L0 200 Z" fill="#141829" stroke="#D4AF37" strokeOpacity="0.3" strokeWidth="1" />
            <path d="M120 180 L130 140 Q135 130 140 140 L150 180 Z" fill="#201E35" stroke="#D4AF37" strokeWidth="1" />
            <path d="M220 185 L235 130 Q240 120 250 135 L265 185 Z" fill="#231F3B" stroke="#D4AF37" strokeWidth="1" />
            {/* Majestic Hot Air Balloons */}
            <g transform="translate(70, 30) scale(0.85)">
              <ellipse cx="40" cy="45" rx="25" ry="32" fill="#D4AF37" fillOpacity="0.8" stroke="#FFE58F" strokeWidth="1" />
              <polygon points="28,75 52,75 46,85 34,85" fill="#8C6212" />
              <rect x="35" y="88" width="10" height="7" fill="#FFE58F" rx="1" />
            </g>
            <g transform="translate(190, 45) scale(0.55)">
              <ellipse cx="40" cy="45" rx="25" ry="32" fill="#D4AF37" fillOpacity="0.7" stroke="#FFE58F" strokeWidth="1" />
              <polygon points="28,75 52,75 46,85 34,85" fill="#8C6212" />
              <rect x="35" y="88" width="10" height="7" fill="#FFE58F" rx="1" />
            </g>
          </svg>
          <div className="absolute top-3 right-3 rounded-full bg-slate-950/70 border border-amber-400/40 px-3 py-1 text-[11px] font-semibold text-amber-300 backdrop-blur-md">
            {service.badge}
          </div>
          <div className="absolute bottom-3 left-3 text-[11px] font-mono text-slate-400">
            {service.englishTitle}
          </div>
        </div>
      );
    }

    // Trabzon & Black Sea
    return (
      <div className="relative h-44 w-full overflow-hidden rounded-t-2xl bg-gradient-to-b from-[#0b241a] via-[#081816] to-[#060a16] border-b border-amber-400/20">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 200" fill="none">
          {/* Alpine Green Mountain Ridges */}
          <path d="M0 130 L90 70 L200 150 L310 60 L400 140 L400 200 L0 200 Z" fill="#0A241C" stroke="#2DD4BF" strokeOpacity="0.3" strokeWidth="1" />
          <path d="M60 170 L150 110 L260 180 L350 115 L400 160 L400 200 L60 200 Z" fill="#061A14" stroke="#D4AF37" strokeOpacity="0.3" strokeWidth="1" />
          {/* Wooden Alpine Chalet / Ayder cottage */}
          <polygon points="120,135 155,105 190,135" fill="#3D2916" stroke="#D4AF37" strokeWidth="1" />
          <rect x="130" y="135" width="50" height="30" fill="#291C10" stroke="#D4AF37" strokeWidth="1" />
          <rect x="148" y="145" width="14" height="15" fill="#FFE58F" rx="1" />
          {/* Mercedes Maybach VIP Silhouette */}
          <path d="M260 165 Q275 152 300 152 L345 152 Q365 158 375 168 L375 178 L255 178 Z" fill="#020617" stroke="#D4AF37" strokeWidth="1.2" />
          <circle cx="280" cy="178" r="7" fill="#1E293B" stroke="#D4AF37" strokeWidth="1" />
          <circle cx="355" cy="178" r="7" fill="#1E293B" stroke="#D4AF37" strokeWidth="1" />
        </svg>
        <div className="absolute top-3 right-3 rounded-full bg-slate-950/70 border border-amber-400/40 px-3 py-1 text-[11px] font-semibold text-amber-300 backdrop-blur-md">
          {service.badge}
        </div>
        <div className="absolute bottom-3 left-3 text-[11px] font-mono text-slate-400">
          {service.englishTitle}
        </div>
      </div>
    );
  };

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
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col justify-between rounded-2xl border border-amber-400/25 bg-slate-900/70 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.6)] transition-all duration-300 hover:border-amber-400/60 hover:shadow-[0_20px_50px_rgba(212,175,55,0.15)]"
    >
      {/* Visual Artwork Banner */}
      {renderVisualArtwork()}

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
        <div>
          {/* Header & Tagline */}
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 rounded-lg bg-amber-400/10 border border-amber-400/30">
              {getIcon()}
            </span>
            <span className="text-xs font-semibold text-amber-300">
              {service.destination}
            </span>
          </div>

          <h3 className="text-xl font-bold text-slate-100 group-hover:text-amber-200 transition-colors">
            {service.title}
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            {service.description}
          </p>

          {/* Key Highlights list */}
          <div className="mt-4 space-y-2 border-t border-slate-800 pt-3">
            {service.highlights.slice(0, 3).map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 pt-4 border-t border-amber-400/15 flex items-center justify-between gap-3">
          <button
            onClick={onSelect}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-amber-400/30 bg-amber-400/10 py-2.5 px-4 text-xs font-bold text-amber-200 transition-all hover:bg-amber-400/20 hover:border-amber-400"
          >
            <span>تفاصيل وحجز العرض</span>
            <ArrowLeft className="h-3.5 w-3.5" />
          </button>

          <a
            href={`https://wa.me/${SITE_CONFIG.contact.whatsappNumber}?text=${encodeURIComponent(service.suggestedMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            title="حجز مباشر عبر واتساب"
            className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export const ServiceTeasers3D: React.FC<ServiceTeasers3DProps> = ({ onSelectService }) => {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 my-16">
      {/* Section Header */}
      <div className="text-center mb-12">
        <span className="text-xs uppercase font-mono tracking-widest text-amber-400">
          EXCLUSIVE LUXURY OFFERINGS
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-gold-gradient mt-2 text-balance">
          نماذج من تجاربنا السياحية الفاخرة المرتقبة
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          بينما نضع اللمسات الأخيرة على منصتنا الرسمية، يمكنك حجز أي من هذه البرامج الحصرية مع مستشارك السياحي فوراً.
        </p>
      </div>

      {/* 3D Mini Tilt Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {SITE_CONFIG.services.map((service, index) => (
          <ServiceMiniCard3D
            key={service.id}
            service={service}
            index={index}
            onSelect={() => onSelectService(service)}
          />
        ))}
      </div>
    </section>
  );
};
