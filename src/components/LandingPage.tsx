import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  MessageCircle, 
  Compass, 
  ShieldCheck, 
  Phone, 
  MapPin, 
  ChevronDown,
  ChevronUp,
  Sun,
  Moon
} from 'lucide-react';
import { ParallaxBackground } from './ParallaxBackground';
import { ServiceCard3D } from './ServiceCard3D';
import { ReviewModal } from './ReviewModal';
import { SiteLogo } from './SiteLogo';
import { HospitalityStandardsSection } from './HospitalityStandardsSection';
import { LuxurySocialChannels } from './LuxurySocialChannels';
import { TourismService } from '../types';
import { useApp } from '../context/AppContext';

export const LandingPage: React.FC = () => {
  const { services, siteSettings, primaryWhatsAppNumber, navigateTo, theme, toggleTheme } = useApp();
  const [selectedServiceForReviews, setSelectedServiceForReviews] = useState<TourismService | null>(null);
  
  // Show More / Show Less for services (At least 6 services initially)
  const INITIAL_VISIBLE_COUNT = 6;
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleServices = isExpanded ? services : services.slice(0, INITIAL_VISIBLE_COUNT);

  const directWhatsAppUrl = `https://wa.me/${primaryWhatsAppNumber}?text=${encodeURIComponent(
    `مرحباً، أود الاستفسار عن حجز برنامج سياحي VIP في تركيا عبر ${siteSettings.nameAr}.`
  )}`;

  return (
    <ParallaxBackground>
      {/* 1. Luxury Brand Top Navigation Bar */}
      <header className={`sticky top-0 z-30 w-full border-b backdrop-blur-xl transition-all ${
        theme === 'light'
          ? 'border-amber-500/20 bg-[#FAF7F2]/95 shadow-[0_4px_25px_rgba(212,175,55,0.08)]'
          : 'border-amber-400/15 bg-[#060a16]/90'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 xs:gap-2 sm:gap-4 px-2.5 sm:px-6 lg:px-8 h-16 sm:h-20">
          
          {/* Brand Wordmark with Customizable Logo */}
          <a href="#" className="flex items-center gap-1.5 sm:gap-3 min-w-0 shrink group overflow-hidden">
            <SiteLogo size="md" className="shrink-0 transition-transform group-hover:scale-105" />
            <div className="flex flex-col text-right min-w-0">
              <span className="text-xs xs:text-sm sm:text-xl font-bold tracking-tight text-gold-gradient truncate max-w-[110px] xs:max-w-[170px] sm:max-w-none">
                {siteSettings.nameAr}
              </span>
              <span className={`text-[8px] sm:text-[10px] tracking-widest uppercase font-mono truncate hidden sm:block ${
                theme === 'light' ? 'text-slate-600' : 'text-slate-400'
              }`}>
                {siteSettings.nameEn}
              </span>
            </div>
          </a>

          {/* Clean Nav Links */}
          <nav className={`hidden lg:flex items-center gap-8 text-sm font-medium ${
            theme === 'light' ? 'text-slate-700' : 'text-slate-300'
          }`}>
            <a href="#hero" className="hover:text-amber-600 transition-colors whitespace-nowrap">الرئيسية</a>
            <a href="#services" className="hover:text-amber-600 transition-colors whitespace-nowrap">باقات النخبة VIP</a>
            <a href="#standards" className="hover:text-amber-600 transition-colors whitespace-nowrap">معايير الضيافة الملكية</a>
            <a href="#contact" className="hover:text-amber-600 transition-colors whitespace-nowrap">التواصل والمكتب</a>
          </nav>

          {/* Action Area: Theme Toggle & WhatsApp CTA */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            {/* Interactive Royal Theme Toggle Button (Sun / Moon) */}
            <button
              type="button"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'التحويل إلى الوضع النهاري الملكي' : 'التحويل إلى الوضع الليلي الملكي'}
              aria-label={theme === 'dark' ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي'}
              className={`relative flex items-center justify-center h-8 w-8 sm:h-11 sm:w-11 rounded-lg sm:rounded-xl border transition-all duration-300 shrink-0 ${
                theme === 'light'
                  ? 'border-amber-500/40 bg-white/95 text-amber-900 hover:bg-amber-50 hover:border-amber-500 shadow-[0_2px_12px_rgba(212,175,55,0.2)]'
                  : 'border-amber-400/30 bg-slate-900/80 text-amber-300 hover:bg-amber-400/15 hover:border-amber-400 shadow-[0_0_15px_rgba(212,175,55,0.15)]'
              }`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === 'dark' ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-amber-300 fill-amber-300/30" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0, scale: 0.7 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -90, opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-amber-800 fill-amber-700/20" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Direct WhatsApp Concierge CTA - Ultra Responsive & Ultra Compact on Mobile */}
            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1 sm:gap-2 rounded-lg sm:rounded-xl px-2 sm:px-4 py-1.5 sm:py-2.5 text-[11px] sm:text-sm font-bold transition-all whitespace-nowrap shrink-0 hover:scale-[1.02] active:scale-[0.98] ${
                theme === 'light'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500 shadow-[0_3px_12px_rgba(16,185,129,0.3)]'
                  : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
              }`}
            >
              <MessageCircle className={`h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 ${theme === 'light' ? 'text-white fill-white' : 'text-emerald-400 fill-emerald-400'}`} />
              <span className={`font-bold ${theme === 'light' ? 'text-white' : 'text-emerald-200'}`}>
                <span className="hidden sm:inline">مستشارك السياحي</span>
                <span className="sm:hidden">واتساب VIP</span>
              </span>
            </a>
          </div>

        </div>
      </header>

      {/* 2. 3D Parallax Hero Section - Full Width Edge-to-Edge Image Backdrop */}
      <section id="hero" className="relative w-full overflow-hidden pt-12 pb-16 text-center">
        {/* Turkey Scenic Background Backdrop - Full Width across any screen size */}
        <div 
          className="pointer-events-none absolute inset-0 -z-10 w-full h-full overflow-hidden"
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.88) 35%, rgba(0,0,0,0.45) 65%, rgba(0,0,0,0.1) 85%, rgba(0,0,0,0) 100%)',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.88) 35%, rgba(0,0,0,0.45) 65%, rgba(0,0,0,0.1) 85%, rgba(0,0,0,0) 100%)',
          }}
        >
          {/* Turkey Backdrop Image - Spans full width edge-to-edge */}
          <img
            src={siteSettings.heroBackgroundImage || "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1920&q=85"}
            alt="أجواء وسياحة تركيا الفاخرة"
            className="h-full w-full object-cover object-center transition-all duration-700 min-w-full"
            style={{
              opacity: siteSettings.heroBackgroundOpacity ?? (theme === 'light' ? 0.7 : 0.45),
            }}
          />

          {/* Deep atmospheric gradient overlay for seamless blending with current theme background */}
          <div className={`absolute inset-0 bg-gradient-to-b ${
            theme === 'light'
              ? 'from-[#FAF7F2]/45 via-[#FAF7F2]/25 to-[#FAF7F2]'
              : 'from-[#060A16]/30 via-transparent to-[#060A16]'
          }`} />
          
          {/* Subtle gold ambient glow ring inside hero */}
          <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-[600px] max-w-full rounded-full blur-[120px] pointer-events-none ${
            theme === 'light' ? 'bg-amber-300/30 opacity-25' : 'bg-amber-400 opacity-25'
          }`} />
        </div>

        {/* Hero Content Wrapper with Margins & Width Constraint */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6">
          {/* Gold Pill Badge */}
          {siteSettings.heroBadgeVisible !== false && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 backdrop-blur-md mb-6 transition-all ${
                theme === 'light'
                  ? 'border-amber-400/50 bg-amber-50/90 text-amber-950 shadow-sm'
                  : 'border-amber-400/40 bg-amber-400/10 shadow-[0_0_15px_rgba(212,175,55,0.2)]'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  theme === 'light' ? 'bg-amber-600' : 'bg-amber-400'
                }`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  theme === 'light' ? 'bg-amber-600' : 'bg-amber-400'
                }`}></span>
              </span>
              <span className={`text-xs sm:text-sm font-bold tracking-wide ${
                theme === 'light' ? 'text-amber-950' : 'text-amber-200'
              }`}>
                {siteSettings.heroBadgeText || siteSettings.sloganAr || "خدمات كونسيرج سياحي فئة خمس نجوم في تركيا"}
              </span>
              <Sparkles className={`h-3.5 w-3.5 ${theme === 'light' ? 'text-amber-600' : 'text-amber-300'}`} />
            </motion.div>
          )}

          {/* Majestic Calligraphic Arabic Headline */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-[1.25] tracking-tight text-gold-gradient max-w-4xl mx-auto mb-6 text-balance"
          >
            {siteSettings.heroHeadline || "بوابتك الاستثنائية لأرقى رحلات النخبة واليخوت الملكية في تركيا"}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`text-sm sm:text-lg md:text-xl max-w-2xl mx-auto font-normal leading-relaxed mb-8 px-2 ${
              theme === 'light' ? 'text-slate-700' : 'text-slate-300 font-light'
            }`}
          >
            {siteSettings.heroSubtitle || "نصمم رحلاتك الخاصة في إسطنبول، كابادوكيا، طرابزون وأنطاليا بأعلى درجات الرفاهية والخصوصية التامة، مع أسطول سيارات مايباخ VIP ويخوت البوسفور الفارهة."}
          </motion.p>

          {/* Hero CTAs */}
          {(siteSettings.heroPrimaryCtaVisible !== false || siteSettings.heroSecondaryCtaVisible !== false) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto px-4"
            >
              {siteSettings.heroPrimaryCtaVisible !== false && (
                <a
                  href={siteSettings.heroPrimaryCtaCustomUrl || directWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-xl px-8 py-4 font-bold text-sm sm:text-base hover:scale-[1.02] active:scale-[0.98] transition-all ${
                    theme === 'light'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500 shadow-[0_4px_20px_rgba(16,185,129,0.35)]'
                      : 'text-slate-950 shadow-[0_0_25px_rgba(212,175,55,0.35)] hover:shadow-[0_0_35px_rgba(212,175,55,0.6)]'
                  }`}
                  style={
                    theme === 'light'
                      ? undefined
                      : {
                          background: 'linear-gradient(135deg, #FFF0B3 0%, #D4AF37 45%, #AA771C 80%, #F5DE93 100%)',
                        }
                  }
                >
                  <MessageCircle className={`h-5 w-5 shrink-0 ${theme === 'light' ? 'fill-white text-white' : 'fill-slate-950 text-slate-950'}`} />
                  <span className="whitespace-nowrap">
                    {siteSettings.heroPrimaryCtaText || "احجز رحلتك الخاصة الآن عبر واتساب"}
                  </span>
                </a>
              )}

              {siteSettings.heroSecondaryCtaVisible !== false && (
                <a
                  href={siteSettings.heroSecondaryCtaLink || "#services"}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border backdrop-blur-md transition-all text-sm sm:text-base px-7 py-4 font-bold ${
                    theme === 'light'
                      ? 'border-slate-300 bg-white text-slate-800 hover:bg-amber-50 hover:border-amber-400 hover:text-amber-900 shadow-sm'
                      : 'border-amber-400/40 bg-slate-900/70 text-amber-100 hover:bg-amber-400/15 hover:border-amber-400'
                  }`}
                >
                  <Compass className="h-4 w-4 text-amber-500 shrink-0" />
                  <span className="whitespace-nowrap">
                    {siteSettings.heroSecondaryCtaText || "استكشف باقات VIP المتاحة"}
                  </span>
                </a>
              )}
            </motion.div>
          )}

          {/* Trust credentials line */}
          {siteSettings.heroTrustBarVisible !== false && (
            <div className={`mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs px-2 ${
              theme === 'light' ? 'text-slate-600' : 'text-slate-400'
            }`}>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-amber-500 shrink-0" />
                <span>{siteSettings.heroTrustText1 || siteSettings.tursabLicense || "TÜRSAB - 14920 (فئة أ)"}</span>
              </div>
              <span className="text-amber-500/40">•</span>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-amber-500 shrink-0" />
                <span>{siteSettings.heroTrustText2 || siteSettings.headquarters || "Zorlu Center, Beşiktaş, Istanbul"}</span>
              </div>
              <span className="text-amber-500/40">•</span>
              <div className="flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className={theme === 'light' ? 'text-emerald-700 font-medium' : 'text-emerald-300'}>
                  {siteSettings.heroTrustText3 || "كونسيرج متاح 24/7"}
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. 3D Services & Packages Grid with Show More (عرض المزيد) */}
      <section id="services" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
        <div className="text-center mb-12">
          <span className="text-xs uppercase font-mono tracking-widest text-amber-400">
            OUR ROYAL PACKAGES & SERVICES
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gold-gradient mt-2 text-balance">
            باقات النخبة والجولات السياحية الفاخرة
          </h2>
          <p className={`mt-3 text-xs sm:text-base max-w-2xl mx-auto px-2 ${
            theme === 'light' ? 'text-slate-600' : 'text-slate-300'
          }`}>
            جميع باقاتنا تشمل سيارات خاصة VIP، سائق كونسيرج يتحدث العربية، استقبال المطار، وتقييمات معتمدة من ضيوفنا الكرام.
          </p>
        </div>

        {/* 3D Cards Responsive Grid: 1 col on mobile, 2 on tablet, 3 on desktop, 4 on xl */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {visibleServices.map((service, index) => (
              <ServiceCard3D
                key={service.id}
                service={service}
                index={index}
                onOpenReviews={(srv) => setSelectedServiceForReviews(srv)}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Show More / Show Less Button (إذا كان هناك الكثير من الخدمات) */}
        {services.length > INITIAL_VISIBLE_COUNT && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`inline-flex items-center gap-2.5 rounded-2xl border px-8 py-3.5 text-xs sm:text-sm font-bold backdrop-blur-xl transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] ${
                theme === 'light'
                  ? 'border-slate-300 bg-white text-slate-900 hover:bg-amber-50 hover:border-amber-400 shadow-[0_4px_16px_rgba(0,0,0,0.06)]'
                  : 'border-amber-400/40 bg-slate-900/80 text-amber-200 hover:border-amber-400 hover:bg-amber-400/15 shadow-[0_0_20px_rgba(212,175,55,0.2)]'
              }`}
            >
              <span>
                {isExpanded
                  ? 'عرض أقل من الباقات'
                  : `عرض المزيد من الباقات الملكية (${services.length - INITIAL_VISIBLE_COUNT} باقات إضافية)`}
              </span>
              {isExpanded ? (
                <ChevronUp className={`h-4 w-4 ${theme === 'light' ? 'text-amber-600' : 'text-amber-400'}`} />
              ) : (
                <ChevronDown className={`h-4 w-4 ${theme === 'light' ? 'text-amber-600' : 'text-amber-400'}`} />
              )}
            </button>
          </div>
        )}
      </section>

      {/* 4. Royal Hospitality Standards (Fully Dynamic from Admin) */}
      <HospitalityStandardsSection />

      {/* 5. Ultra-Luxury Official Social Media Channels */}
      <LuxurySocialChannels />

      {/* 6. Footer */}
      <footer className={`w-full border-t pt-12 pb-10 text-right transition-colors duration-500 ${
        theme === 'light'
          ? 'border-slate-200 bg-[#FAF7F2] text-slate-700'
          : 'border-amber-400/15 bg-[#03060d] text-slate-400'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b ${
            theme === 'light' ? 'border-slate-200' : 'border-slate-900'
          }`}>
            <div className="flex items-center gap-3">
              <SiteLogo size="md" />
              <div>
                <span className="text-base sm:text-lg font-bold text-gold-gradient block">
                  {siteSettings.nameAr}
                </span>
                <span className={`text-xs font-mono ${
                  theme === 'light' ? 'text-slate-600' : 'text-slate-500'
                }`}>
                  {siteSettings.headquarters}
                </span>
              </div>
            </div>
          </div>

          <div className={`pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-center sm:text-right ${
            theme === 'light' ? 'text-slate-600' : 'text-slate-500'
          }`}>
            <p>جميع الحقوق محفوظة © {new Date().getFullYear()} {siteSettings.nameAr}.</p>
            <div className={`flex items-center gap-2 ${
              theme === 'light' ? 'text-slate-700' : 'text-slate-400'
            }`}>
              <ShieldCheck className="h-4 w-4 text-amber-500" />
              <span>{siteSettings.tursabLicense} • Luxury Concierge Turkey</span>
            </div>
          </div>
        </div>
      </footer>

      {/* 7. Moderated Review Modal */}
      <ReviewModal
        service={selectedServiceForReviews}
        onClose={() => setSelectedServiceForReviews(null)}
      />
    </ParallaxBackground>
  );
};
