import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, MessageCircle, MapPin, Sparkles, Send } from 'lucide-react';
import { ServiceTeaser, SITE_CONFIG } from '../config/siteConfig';

interface ServiceDetailModalProps {
  service: ServiceTeaser | null;
  onClose: () => void;
  onBookNow: (service: ServiceTeaser) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onBookNow,
}) => {
  if (!service) return null;

  const directWhatsAppUrl = `https://wa.me/${SITE_CONFIG.contact.whatsappNumber}?text=${encodeURIComponent(
    service.suggestedMessage
  )}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl rounded-3xl border border-amber-400/30 bg-gradient-to-b from-slate-900 via-[#0a1224] to-[#060a16] p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl z-10 text-right"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 left-5 p-2 rounded-full border border-slate-700 bg-slate-800/80 text-slate-300 hover:text-amber-300 hover:border-amber-400/60 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Destination Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-xs font-semibold text-amber-300 mb-3">
            <MapPin className="h-3.5 w-3.5" />
            <span>{service.destination}</span>
            <span className="text-amber-500/50">•</span>
            <span>{service.badge}</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-gold-gradient">
            {service.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
            {service.englishTitle}
          </p>

          <p className="mt-4 text-sm sm:text-base text-slate-200 leading-relaxed">
            {service.description}
          </p>

          {/* Highlights */}
          <div className="mt-6 rounded-2xl border border-amber-400/15 bg-slate-950/50 p-5">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>أبرز مميزات وامتيازات البرنامج:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {service.highlights.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 inline-flex items-center justify-center gap-2.5 rounded-xl py-3.5 px-6 font-bold text-slate-950 shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all hover:scale-[1.02]"
              style={{
                background: 'linear-gradient(135deg, #FFF0B3 0%, #D4AF37 45%, #AA771C 80%, #F5DE93 100%)',
              }}
            >
              <MessageCircle className="h-5 w-5 fill-slate-950 text-slate-950" />
              <span>طلب حجز البرنامج فوراً عبر واتساب</span>
            </a>

            <button
              onClick={() => {
                onClose();
                onBookNow(service);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-amber-400/40 bg-slate-800/80 px-6 py-3.5 text-xs sm:text-sm font-semibold text-amber-200 hover:bg-amber-400/15 transition-all"
            >
              <Send className="h-4 w-4" />
              <span>تخصيص تفاصيل الرحلة</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
