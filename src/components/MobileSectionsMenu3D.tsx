import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Crown, 
  Compass, 
  ShieldCheck, 
  MapPin, 
  MessageCircle, 
  ArrowLeft, 
  Sparkles,
  Sun,
  Moon,
  ExternalLink
} from 'lucide-react';
import { ThemeMode, SiteSettings } from '../types';
import { SiteLogo } from './SiteLogo';

interface MobileSectionsMenu3DProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  toggleTheme: () => void;
  siteSettings: SiteSettings;
  servicesCount: number;
  directWhatsAppUrl: string;
}

interface NavSectionItem {
  id: string;
  href: string;
  titleAr: string;
  titleEn: string;
  description: string;
  badge: string;
  icon: React.ElementType;
  accentColor: string;
}

export const MobileSectionsMenu3D: React.FC<MobileSectionsMenu3DProps> = ({
  isOpen,
  onClose,
  theme,
  toggleTheme,
  siteSettings,
  servicesCount,
  directWhatsAppUrl,
}) => {
  const sections: NavSectionItem[] = [
    {
      id: 'hero',
      href: '#hero',
      titleAr: 'الرئيسية الملكية',
      titleEn: 'Royal Welcome',
      description: 'الواجهة الرئيسية، برامج السفر الفاخرة، وحجز الكونسيرج الفوري',
      badge: 'VIP Concierge',
      icon: Crown,
      accentColor: 'from-amber-400 to-amber-600',
    },
    {
      id: 'services',
      href: '#services',
      titleAr: 'الباقات والجولات VIP',
      titleEn: 'Services & Tours',
      description: 'يخوت البوسفور، طيران هليكوبتر، مناطيد كابادوكيا، وفلل الساحل',
      badge: `${servicesCount > 0 ? servicesCount : '8'} باقات معتمدة`,
      icon: Compass,
      accentColor: 'from-amber-300 via-amber-500 to-yellow-600',
    },
    {
      id: 'standards',
      href: '#standards',
      titleAr: 'معايير الضيافة الملكية',
      titleEn: 'Hospitality Standards',
      description: 'أعلى معايير الخصوصية، أسطول مايباخ، وكوادر تتحدث العربية',
      badge: siteSettings.tursabLicense || 'TÜRSAB معتمد',
      icon: ShieldCheck,
      accentColor: 'from-amber-500 to-amber-700',
    },
    {
      id: 'contact',
      href: '#contact',
      titleAr: 'المكتب والتواصل المباشر',
      titleEn: 'Contact & Office',
      description: 'موقع مكتبنا في Zorlu Center إسطنبول، وقنوات التواصل المباشر 24/7',
      badge: 'مستشار متاح 24/7',
      icon: MapPin,
      accentColor: 'from-emerald-400 to-emerald-600',
    },
  ];

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    onClose();

    // Smooth scroll to section after closing menu
    setTimeout(() => {
      const targetId = href.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.location.hash = href;
      }
    }, 220);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 overflow-y-auto overflow-x-hidden">
          {/* Glassmorphic Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            onClick={onClose}
            className={`fixed inset-0 transition-colors backdrop-blur-md ${
              theme === 'light' ? 'bg-slate-900/40' : 'bg-black/75'
            }`}
          />

          {/* 3D Perspective Modal Container */}
          <div className="relative w-full max-w-lg my-auto [perspective:1400px]">
            <motion.div
              initial={{ 
                opacity: 0, 
                rotateX: 18, 
                rotateY: 2,
                scale: 0.92, 
                y: -25,
                transformPerspective: 1200 
              }}
              animate={{ 
                opacity: 1, 
                rotateX: 0, 
                rotateY: 0,
                scale: 1, 
                y: 0,
                transition: { 
                  type: 'spring', 
                  damping: 24, 
                  stiffness: 280,
                  mass: 0.9
                } 
              }}
              exit={{ 
                opacity: 0, 
                rotateX: -14, 
                scale: 0.93, 
                y: -20,
                transition: { duration: 0.22, ease: 'easeInOut' } 
              }}
              className={`relative w-full rounded-2xl sm:rounded-3xl border overflow-hidden shadow-2xl transition-all duration-300 [transform-style:preserve-3d] ${
                theme === 'light'
                  ? 'bg-gradient-to-b from-white via-[#FAF7F2] to-amber-50/70 border-amber-500/40 shadow-[0_25px_60px_-15px_rgba(212,175,55,0.35)]'
                  : 'bg-gradient-to-b from-[#0e1628] via-[#090f1d] to-[#040812] border-amber-400/40 shadow-[0_25px_70px_-15px_rgba(212,175,55,0.25)]'
              }`}
            >
              {/* Luxury Ambient Golden Glow Orbs */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

              {/* 3D Header Bar */}
              <div className={`relative px-5 py-4 border-b flex items-center justify-between gap-3 ${
                theme === 'light' ? 'border-amber-400/20 bg-white/80' : 'border-amber-400/20 bg-slate-900/60'
              }`}>
                <div className="flex items-center gap-2.5 min-w-0">
                  <SiteLogo size="sm" />
                  <div className="text-right min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-gold-gradient truncate">
                        {siteSettings.nameAr || 'عبد الله في تركيا'}
                      </span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-amber-400/15 text-amber-500 border border-amber-400/30">
                        قائمة الأقسام
                      </span>
                    </div>
                    <p className={`text-[10px] font-mono tracking-widest truncate ${
                      theme === 'light' ? 'text-slate-500' : 'text-slate-400'
                    }`}>
                      ROYAL SITE DIRECTORY
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Theme Switcher Quick Toggle */}
                  <button
                    type="button"
                    onClick={toggleTheme}
                    title={theme === 'dark' ? 'التحويل إلى الوضع النهاري' : 'التحويل إلى الوضع الليلي'}
                    className={`h-8 w-8 rounded-lg flex items-center justify-center border transition-all ${
                      theme === 'light'
                        ? 'border-amber-400/40 bg-amber-50 text-amber-900 hover:bg-amber-100'
                        : 'border-amber-400/30 bg-slate-800 text-amber-300 hover:bg-amber-400/20'
                    }`}
                  >
                    {theme === 'dark' ? (
                      <Sun className="h-4 w-4 text-amber-300" />
                    ) : (
                      <Moon className="h-4 w-4 text-amber-800" />
                    )}
                  </button>

                  {/* Close Button with 3D Hover Spin */}
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="إغلاق القائمة"
                    className={`h-8 w-8 rounded-lg flex items-center justify-center border transition-all ${
                      theme === 'light'
                        ? 'border-slate-300 bg-white text-slate-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300'
                        : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-rose-950/40 hover:text-rose-400 hover:border-rose-500/40'
                    }`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* 3D Section Cards List with Staggered Entrance */}
              <div className="p-4 sm:p-5 space-y-2.5 max-h-[65vh] overflow-y-auto">
                <p className={`text-[11px] font-semibold tracking-wider text-right px-1 mb-2 ${
                  theme === 'light' ? 'text-slate-600' : 'text-slate-400'
                }`}>
                  اختر القسم المطلوب للانتقال الفوري إليه:
                </p>

                {sections.map((section, index) => {
                  const Icon = section.icon;
                  return (
                    <motion.a
                      key={section.id}
                      href={section.href}
                      onClick={(e) => handleSectionClick(e, section.href)}
                      initial={{ opacity: 0, y: 15, rotateX: 10 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0, 
                        rotateX: 0,
                        transition: { delay: index * 0.05, duration: 0.3 } 
                      }}
                      whileHover={{ 
                        scale: 1.02, 
                        rotateY: -2,
                        transition: { duration: 0.18 } 
                      }}
                      whileTap={{ scale: 0.98 }}
                      className={`group relative flex items-center justify-between gap-3 p-3.5 rounded-xl border text-right transition-all duration-300 [transform-style:preserve-3d] ${
                        theme === 'light'
                          ? 'border-amber-400/25 bg-white hover:bg-amber-50/80 hover:border-amber-500/50 shadow-sm hover:shadow-[0_8px_20px_rgba(212,175,55,0.18)]'
                          : 'border-amber-400/20 bg-slate-900/60 hover:bg-slate-800/80 hover:border-amber-400/50 shadow-sm hover:shadow-[0_8px_25px_rgba(212,175,55,0.18)]'
                      }`}
                    >
                      {/* Active Indicator Strip */}
                      <div className="absolute right-0 top-2 bottom-2 w-1 rounded-l-full bg-gradient-to-b from-amber-400 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />

                      {/* Right Side: Icon & Details */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 group-hover:scale-110 ${
                          theme === 'light'
                            ? 'border-amber-400/40 bg-amber-50 text-amber-800 group-hover:bg-amber-500 group-hover:text-white shadow-sm'
                            : 'border-amber-400/30 bg-amber-400/10 text-amber-300 group-hover:bg-amber-400/20 group-hover:border-amber-400 shadow-[0_0_12px_rgba(212,175,55,0.15)]'
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1 text-right">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm sm:text-base font-bold transition-colors ${
                              theme === 'light'
                                ? 'text-slate-900 group-hover:text-amber-900'
                                : 'text-slate-100 group-hover:text-amber-200'
                            }`}>
                              {section.titleAr}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-500 shrink-0 font-medium">
                              {section.badge}
                            </span>
                          </div>
                          <p className={`text-xs mt-0.5 line-clamp-1 ${
                            theme === 'light' ? 'text-slate-600' : 'text-slate-400'
                          }`}>
                            {section.description}
                          </p>
                        </div>
                      </div>

                      {/* Left Side: Direction Arrow */}
                      <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:-translate-x-1.5 ${
                        theme === 'light'
                          ? 'text-amber-800 bg-amber-100/60 group-hover:bg-amber-200'
                          : 'text-amber-300 bg-slate-800/80 group-hover:bg-amber-400/20'
                      }`}>
                        <ArrowLeft className="h-4 w-4" />
                      </div>
                    </motion.a>
                  );
                })}
              </div>

              {/* Bottom Quick Contact & VIP Concierge Bar */}
              <div className={`p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${
                theme === 'light' ? 'border-amber-400/20 bg-white/90' : 'border-amber-400/20 bg-slate-900/80'
              }`}>
                <a
                  href={directWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 px-4 font-bold text-xs sm:text-sm transition-all hover:scale-[1.01] active:scale-[0.99] ${
                    theme === 'light'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_3px_15px_rgba(16,185,129,0.3)]'
                      : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                  }`}
                >
                  <MessageCircle className="h-4 w-4 shrink-0 fill-current" />
                  <span>تواصل فوري مع كونسيرج تركيا عبر واتساب VIP</span>
                  <ExternalLink className="h-3 w-3 opacity-70" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
