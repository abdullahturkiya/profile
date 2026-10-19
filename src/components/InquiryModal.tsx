import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Sparkles, CheckCircle2, MessageCircle, ShieldCheck } from 'lucide-react';
import { SITE_CONFIG, ServiceTeaser } from '../config/siteConfig';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: ServiceTeaser | null;
  initialDestination?: string;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  isOpen,
  onClose,
  initialService,
  initialDestination,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [destination, setDestination] = useState('برنامج شامل (إسطنبول، طرابزون، كابادوكيا)');
  const [travelDate, setTravelDate] = useState('');
  const [guestsCount, setGuestsCount] = useState('شخصان (VIP)');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([
    'سيارة مرسيدس VIP مع سائق خاص',
    'استقبال من باب الطائرة بالمطار',
  ]);
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');

  // Sync initial service/destination if passed
  useEffect(() => {
    if (initialService) {
      setDestination(initialService.title);
    } else if (initialDestination) {
      setDestination(initialDestination);
    }
  }, [initialService, initialDestination]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const toggleAddon = (addon: string) => {
    if (selectedAddons.includes(addon)) {
      setSelectedAddons(selectedAddons.filter((a) => a !== addon));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const destinationsList = [
    'برنامج شامل (إسطنبول، طرابزون، كابادوكيا)',
    'إسطنبول ويخوت البوسفور الخاصة',
    'طرابزون والشمال التركي وجولات الطبيعة',
    'كابادوكيا والمناطيد الخاصة',
    'أنطاليا وفلل البحر الأبيض المتوسط',
    'بودروم وفتحية (رحلات بحرية وشواطئ)',
  ];

  const availableAddons = [
    'سيارة مرسيدس VIP مع سائق خاص',
    'استقبال من باب الطائرة بالمطار (Fast Track)',
    'يخت خاص في البوسفور مع عشاء ملكي',
    'منطاد هوائي خاص في كابادوكيا',
    'طائرة هليكوبتر خاصة بين المدن',
    'حجز في أرقى الفنادق والقصور التاريخية',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) return;

    // Build the formatted Arabic WhatsApp message
    const message = `🌟 طلب حجز واستشارة سياحية VIP جديدة:
--------------------------------
👤 اسم الضيف الكريم: ${fullName.trim()}
📱 رقم التواصل / واتساب: ${phone.trim() || 'عبر المحادثة الحالية'}
📍 الوجهة المطلوبة: ${destination}
📅 موعد السفر التقريبي: ${travelDate || 'غير محدد حالياً'}
👥 عدد المسافرين: ${guestsCount}
✨ الخدمات الإضافية المطلوبة:
${selectedAddons.map((a) => `• ${a}`).join('\n')}
${notes ? `📝 ملاحظات خاصة: ${notes}\n` : ''}--------------------------------
مرحباً، أرجو من المستشار السياحي التواصل معي لترتيب هذا البرنامج وتقديم أفضل عرض.`;

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${SITE_CONFIG.contact.whatsappNumber}?text=${encoded}`;
    setGeneratedLink(whatsappUrl);
    setIsSubmitted(true);

    // Automatically open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-xl rounded-3xl border border-amber-400/30 bg-gradient-to-b from-slate-900 via-[#0a1224] to-[#060a16] p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl z-10 max-h-[92vh] overflow-y-auto"
          >
            {/* Top Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 left-5 p-2 rounded-full border border-slate-700 bg-slate-800/80 text-slate-300 hover:text-amber-300 hover:border-amber-400/60 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {!isSubmitted ? (
              <div>
                {/* Header */}
                <div className="text-right pr-2 mb-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300 mb-2">
                    <Sparkles className="h-3 w-3" />
                    <span>حجز فوري بدون انتظار</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gold-gradient">
                    صمم رحلتك الفاخرة مع مستشارك الخاص
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    أدخل بيانات رحلتك وسيتم تحويلك فوراً لمحادثة المستشار عبر واتساب مع تفاصيل طلبك كاملة.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4 text-right">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-amber-200 mb-1.5">
                      الاسم الكريم *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: د. عبدالله التميمي"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-xl border border-amber-400/25 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all"
                    />
                  </div>

                  {/* Phone / WhatsApp */}
                  <div>
                    <label className="block text-xs font-semibold text-amber-200 mb-1.5">
                      رقم الواتساب مع المفتاح الدولي (اختياري)
                    </label>
                    <input
                      type="tel"
                      dir="ltr"
                      placeholder="+966 50 000 0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-amber-400/25 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all text-right"
                    />
                  </div>

                  {/* Destination Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-amber-200 mb-1.5">
                      الوجهة السياحية المطلوبة
                    </label>
                    <select
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full rounded-xl border border-amber-400/25 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all"
                    >
                      {destinationsList.map((item) => (
                        <option key={item} value={item} className="bg-slate-900 text-slate-100">
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dates and Guests Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-amber-200 mb-1.5">
                        موعد السفر المتوقع
                      </label>
                      <input
                        type="text"
                        placeholder="مثال: بداية الشهر القادم / يوليو"
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="w-full rounded-xl border border-amber-400/25 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-amber-200 mb-1.5">
                        عدد المسافرين
                      </label>
                      <select
                        value={guestsCount}
                        onChange={(e) => setGuestsCount(e.target.value)}
                        className="w-full rounded-xl border border-amber-400/25 bg-slate-950/90 px-4 py-2.5 text-sm text-slate-100 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all"
                      >
                        <option value="شخص واحد (VIP)">شخص واحد (VIP)</option>
                        <option value="شخصان (شهر عسل / VIP)">شخصان (شهر عسل / VIP)</option>
                        <option value="عائلة صغيرة (3-5 أشخاص)">عائلة صغيرة (3-5 أشخاص)</option>
                        <option value="عائلة كبيرة (6-10 أشخاص)">عائلة كبيرة (6-10 أشخاص)</option>
                        <option value="وفد خاص / رجال أعمال (أكثر من 10)">وفد خاص / رجال أعمال (أكثر من 10)</option>
                      </select>
                    </div>
                  </div>

                  {/* VIP Addons Checklist */}
                  <div>
                    <label className="block text-xs font-semibold text-amber-200 mb-2">
                      الخدمات الملكية الإضافية المرغوبة
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {availableAddons.map((addon) => {
                        const isSelected = selectedAddons.includes(addon);
                        return (
                          <button
                            type="button"
                            key={addon}
                            onClick={() => toggleAddon(addon)}
                            className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs text-right transition-all ${
                              isSelected
                                ? 'border-amber-400/70 bg-amber-400/15 text-amber-200 font-semibold'
                                : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <span
                              className={`h-4 w-4 rounded-md border flex items-center justify-center shrink-0 ${
                                isSelected ? 'border-amber-400 bg-amber-400 text-slate-950' : 'border-slate-600'
                              }`}
                            >
                              {isSelected && <CheckCircle2 className="h-3 w-3" />}
                            </span>
                            <span className="truncate">{addon}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-semibold text-amber-200 mb-1.5">
                      ملاحظات أو رغبات خاصة (اختياري)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="هل تود إطلالة محددة، شيف خاص، أو سيارات ذات مواصفات خاصة؟"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full rounded-xl border border-amber-400/25 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="group relative w-full flex items-center justify-center gap-3 rounded-xl py-4 px-6 font-bold text-slate-950 text-base shadow-[0_0_25px_rgba(212,175,55,0.35)] transition-all duration-300 hover:shadow-[0_0_35px_rgba(212,175,55,0.6)] hover:scale-[1.01] active:scale-[0.99]"
                      style={{
                        background: 'linear-gradient(135deg, #FFF0B3 0%, #D4AF37 45%, #AA771C 80%, #F5DE93 100%)',
                      }}
                    >
                      <MessageCircle className="h-5 w-5 fill-slate-950 text-slate-950" />
                      <span>إرسال الطلب وفتح المحادثة عبر واتساب</span>
                      <Send className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Guarantee footer */}
                  <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-slate-400">
                    <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                    <span>خصوصية تامة لجميع بيانات ضيوفنا الكرام وسرية مطلقة</span>
                  </div>
                </form>
              </div>
            ) : (
              /* Success / WhatsApp redirection feedback */
              <div className="text-center py-6">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                  <CheckCircle2 className="h-9 w-9" />
                </div>
                <h3 className="text-2xl font-bold text-slate-100">
                  تم تجهيز طلبك الفاخر بنجاح!
                </h3>
                <p className="mt-2 text-sm text-slate-300 max-w-md mx-auto">
                  تم فتح محادثة الواتساب مع مستشارك السياحي. إذا لم تفتح تلقائياً، يرجى الضغط على الزر أدناه:
                </p>

                <div className="mt-6 flex flex-col gap-3">
                  <a
                    href={generatedLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-6 py-3.5 font-bold text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>متابعة المحادثة في واتساب الآن</span>
                  </a>

                  <button
                    onClick={handleReset}
                    className="text-xs text-slate-400 hover:text-slate-200 mt-2"
                  >
                    إغلاق النافذة
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
