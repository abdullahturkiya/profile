import React from 'react';
import { motion } from 'motion/react';
import { 
  MessageCircle, 
  Instagram, 
  Send, 
  Video, 
  Facebook, 
  Youtube, 
  Phone, 
  Sparkles, 
  ArrowLeft,
  ShieldCheck,
  Clock,
  Share2,
  Linkedin
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LuxurySocialChannels: React.FC = () => {
  const { socialLinks, primaryWhatsAppNumber, siteSettings, theme } = useApp();

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'whatsapp':
        return <MessageCircle className="h-5 w-5 text-emerald-500 fill-emerald-500" />;
      case 'instagram':
        return <Instagram className="h-5 w-5 text-pink-500" />;
      case 'telegram':
        return <Send className="h-5 w-5 text-sky-500" />;
      case 'tiktok':
        return <Video className="h-5 w-5 text-amber-500" />;
      case 'facebook':
        return <Facebook className="h-5 w-5 text-blue-500" />;
      case 'youtube':
        return <Youtube className="h-5 w-5 text-red-500" />;
      case 'linkedin':
        return <Linkedin className="h-5 w-5 text-blue-600" />;
      case 'x':
        return <span className={`font-extrabold text-sm ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>𝕏</span>;
      case 'snapchat':
        return <span className="font-extrabold text-sm text-yellow-400">👻</span>;
      case 'phone':
      default:
        return <Phone className="h-5 w-5 text-emerald-500" />;
    }
  };

  const getPlatformDefaultDescription = (platform: string) => {
    switch (platform) {
      case 'whatsapp':
        return 'مستشارك السياحي الخاص متواجد للرد الفوري على مدار 24 ساعة.';
      case 'instagram':
        return 'تغطيات يومية حصرية لليخوت الملكية والفنادق الفاخرة في تركيا.';
      case 'telegram':
        return 'عروض حصرية وخاصة للمتابعين قبل الإعلان عنها.';
      case 'tiktok':
        return 'جولات مصورة ومقاطع فيديو من رحلات ضيوفنا في إسطنبول وطرابزون.';
      case 'facebook':
        return 'الصفحة الرسمية المعتمدة لعبدالله في تركيا للخدمات السياحية والعقارية.';
      case 'linkedin':
        return 'الملف المهني والشراكات الفندقية والعقارية في تركيا.';
      case 'x':
        return 'آخر التحديثات والأخبار السياحية الفاخرة في تركيا.';
      case 'snapchat':
        return 'يوميات وبث حي مباشر من كبرى الوجهات السياحية.';
      case 'phone':
      default:
        return 'خدمة استقبال المكالمات الدولية والاستشارات المباشرة.';
    }
  };

  const activeLinks = socialLinks.filter((l) => l.isActive);
  const targetWhatsAppNumber = siteSettings.contactWhatsAppNumber || primaryWhatsAppNumber;
  const targetWhatsAppMessage = siteSettings.contactWhatsAppDefaultMessage || 'مرحباً، أود التواصل معكم من أجل الخدمات السياحية والعقارية في تركيا.';

  return (
    <section id="contact" className="w-full max-w-6xl mx-auto px-4 sm:px-6 my-20 text-right">
      {/* Outer Luxury Card Container */}
      <div className={`relative rounded-3xl border p-5 sm:p-8 md:p-12 backdrop-blur-2xl transition-all duration-300 overflow-hidden ${
        theme === 'light'
          ? 'border-slate-200 bg-white/95 shadow-[0_15px_45px_rgba(0,0,0,0.06)]'
          : 'border-amber-400/30 bg-gradient-to-b from-slate-900/90 via-[#0a1224]/90 to-[#060a16]/95 shadow-[0_25px_60px_rgba(0,0,0,0.8)]'
      }`}>
        
        {/* Ambient Top Gold Light Bar */}
        <div className="absolute inset-x-12 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/80 to-transparent" />

        {/* Customizable Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          {siteSettings.contactBadgeVisible !== false && (
            <div className={`inline-flex items-center gap-2 rounded-full border px-3.5 sm:px-4 py-1.5 text-xs font-bold mb-3 ${
              theme === 'light'
                ? 'border-amber-400/50 bg-amber-50 text-amber-950 shadow-sm'
                : 'border-amber-400/40 bg-amber-400/10 text-amber-500'
            }`}>
              <Sparkles className="h-3.5 w-3.5" />
              <span>{siteSettings.contactBadgeText || 'قنوات التواصل الرسمية الخاصة بنا'}</span>
            </div>
          )}

          <h3 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-gold-gradient">
            {siteSettings.contactTitle || 'تواصل ملكي مباشر مع مستشارك السياحي 24/7'}
          </h3>
          <p className={`mt-2 text-xs sm:text-sm leading-relaxed ${
            theme === 'light' ? 'text-slate-600' : 'text-slate-300'
          }`}>
            {siteSettings.contactSubtitle || 'اختر القناة المفضلة لديك وسيقوم فريق الكونسيرج بمتابعة كافة متطلبات رحلتك وتجهيز برنامجك الفاخر بدقة متناهية.'}
          </p>
        </div>

        {/* Customizable Featured VIP WhatsApp Card - Perfectly Aligned & Organized on Mobile */}
        {siteSettings.contactWhatsAppVisible !== false && (
          <div className={`mb-8 rounded-2xl border p-4 sm:p-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 md:gap-6 transition-all ${
            theme === 'light'
              ? 'border-emerald-200 bg-emerald-50/70 shadow-[0_4px_20px_rgba(16,185,129,0.08)]'
              : 'border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-slate-950/60 to-emerald-950/40 shadow-[0_0_30px_rgba(16,185,129,0.15)]'
          }`}>
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 text-right w-full md:w-auto">
              <div className="relative flex h-11 w-11 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] mt-0.5 sm:mt-0">
                <MessageCircle className="h-5 w-5 sm:h-7 sm:w-7 fill-white" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3 sm:h-3.5 sm:w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 sm:h-3.5 sm:w-3.5 bg-emerald-400 border border-slate-950"></span>
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between sm:justify-start gap-1.5 sm:gap-2 mb-1 w-full">
                  <span className={`text-sm sm:text-lg font-extrabold ${
                    theme === 'light' ? 'text-slate-950' : 'text-slate-100'
                  }`}>
                    {siteSettings.contactWhatsAppTitle || 'واتساب كونسيرج VIP المباشر'}
                  </span>
                  {siteSettings.contactWhatsAppBadge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border shrink-0 ${
                      theme === 'light'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}>
                      {siteSettings.contactWhatsAppBadge}
                    </span>
                  )}
                </div>
                <p className={`text-xs sm:text-sm leading-relaxed ${
                  theme === 'light' ? 'text-slate-600' : 'text-slate-300'
                }`}>
                  {siteSettings.contactWhatsAppDescription || 'حجوزات اليخوت، طائرات الهليكوبتر، سيارات مايباخ، وفلل البحر مع مستشارك الخاص.'}
                </p>
              </div>
            </div>

            <a
              href={`https://wa.me/${targetWhatsAppNumber}?text=${encodeURIComponent(targetWhatsAppMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full md:w-auto inline-flex items-center justify-center gap-2 sm:gap-2.5 rounded-xl px-5 sm:px-7 py-3 sm:py-3.5 font-bold text-xs sm:text-sm transition-all hover:scale-[1.01] shrink-0 active:scale-[0.98] ${
                theme === 'light'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_4px_16px_rgba(16,185,129,0.35)] border border-emerald-500'
                  : 'text-slate-950 shadow-[0_0_20px_rgba(212,175,55,0.35)]'
              }`}
              style={
                theme === 'light'
                  ? undefined
                  : {
                      background: 'linear-gradient(135deg, #FFF0B3 0%, #D4AF37 45%, #AA771C 80%, #F5DE93 100%)',
                    }
              }
            >
              <span className={theme === 'light' ? 'text-white font-bold' : 'text-slate-950 font-bold'}>
                {siteSettings.contactWhatsAppButtonText || 'بدء المحادثة الفورية'}
              </span>
              <ArrowLeft className={`h-4 w-4 ${theme === 'light' ? 'text-white' : 'text-slate-950'}`} />
            </a>
          </div>
        )}

        {/* Grid of Other Official Channels - ALL Elements Customizable */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeLinks
            .filter((l) => l.platform !== 'whatsapp')
            .map((link) => (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3, scale: 1.02 }}
                className={`group flex flex-col justify-between p-5 rounded-2xl border transition-all shadow-md ${
                  theme === 'light'
                    ? 'border-slate-200/90 bg-slate-50/80 hover:border-amber-400 hover:bg-white hover:shadow-md'
                    : 'border-amber-400/20 bg-slate-950/60 hover:border-amber-400/50 hover:bg-slate-900/80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${
                      theme === 'light'
                        ? 'bg-amber-50 border border-amber-200'
                        : 'bg-amber-400/15 border border-amber-400/30'
                    }`}>
                      {getPlatformIcon(link.platform)}
                    </div>
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${
                      theme === 'light' ? 'text-amber-800' : 'text-amber-500'
                    }`}>
                      {link.badge || 'OFFICIAL'}
                    </span>
                  </div>

                  <h4 className={`text-sm font-bold transition-colors ${
                    theme === 'light' ? 'text-slate-900 group-hover:text-amber-800' : 'text-slate-100 group-hover:text-amber-200'
                  }`}>
                    {link.label}
                  </h4>
                  <p className={`text-xs mt-1 leading-relaxed ${
                    theme === 'light' ? 'text-slate-600' : 'text-slate-400'
                  }`}>
                    {link.description || getPlatformDefaultDescription(link.platform)}
                  </p>
                </div>

                <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs font-bold ${
                  theme === 'light' ? 'border-slate-200 text-amber-800' : 'border-slate-800/80 text-amber-300'
                }`}>
                  <span>{link.actionText || 'زيارة القناة الرسمية'}</span>
                  <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                </div>
              </motion.a>
            ))}
        </div>

        {/* Customizable Trust Badges & Information Strip */}
        {siteSettings.contactTrustBarVisible !== false && (
          <div className={`mt-10 pt-6 border-t flex flex-wrap items-center justify-center gap-6 text-xs ${
            theme === 'light' ? 'border-slate-200 text-slate-700 font-medium' : 'border-amber-400/15 text-slate-400'
          }`}>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-amber-500" />
              <span>{siteSettings.contactLicenseText || siteSettings.tursabLicense}</span>
            </div>
            <span className="text-amber-500/40">•</span>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-500" />
              <span className={theme === 'light' ? 'text-emerald-700 font-bold' : 'text-emerald-300'}>
                {siteSettings.contactSupportHours || 'خدمة عملاء وكونسيرج 24/7'}
              </span>
            </div>
            <span className="text-amber-500/40">•</span>
            <span>{siteSettings.contactHeadquartersText || siteSettings.headquarters}</span>
          </div>
        )}

      </div>
    </section>
  );
};
