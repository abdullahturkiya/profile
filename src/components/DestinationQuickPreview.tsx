import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Check, MessageCircle, Star, Sparkles } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';

interface DestinationItem {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  vibe: string;
  perks: string[];
  bestTime: string;
}

export const DestinationQuickPreview: React.FC<{
  onSelectDestination: (destName: string) => void;
}> = ({ onSelectDestination }) => {
  const [activeTab, setActiveTab] = useState(0);

  const destinations: DestinationItem[] = [
    {
      id: 'istanbul',
      name: 'إسطنبول الملكية',
      subtitle: 'سحر البوسفور وعراقة التاريخ',
      vibe: 'يخوت خاصة، قصور عثمانية، ومطاعم ميشلان راقية',
      description: 'استمتع بإقامة استثنائية في قصر سيراجان أو فورسيزونز البوسفور، مع جولات هليكوبتر، يخوت خاصة، وتسوق خاص مع مساعد شخصي في أرقى دور الأزياء بنيشانتاشي.',
      perks: [
        'إبحار خاص في البوسفور مع عشاء ملكي خاص',
        'خدمة Fast Track واستقبال خاص بالمروحية',
        'جولات خاصة في آيا صوفيا وقصر الباب العالي وقصر دولما بهجة',
        'سيارات مرسيدس مايباخ VIP مع سائق خاص يتحدث العربية'
      ],
      bestTime: 'طوال العام',
    },
    {
      id: 'cappadocia',
      name: 'كابادوكيا الحالمة',
      subtitle: 'مناطيد شروق الشمس وأجنحة الكهوف الفاخرة',
      vibe: 'سكون رومانسي، مناطيد خاصة وتاريخ أسطوري',
      description: 'أرقى تجربة مناطيد خاصة لشروق الشمس فوق وادي العشاق ومداخن الجنيات، وإقامة في فنادق الكهوف التاريخية المصنفة عالمياً مع مسابح كهفية خاصة دافئة.',
      perks: [
        'رحلة منطاد هوائي VIP خاصة بالعائلة فقط مع إفطار شروق الشمس',
        'أجنحة ملكية في Museum Hotel أو Argos in Cappadocia',
        'جلسات تصوير احترافية خاصة بين الوديان والمناطيد',
        'جولات بسيارات كلاسيكية مكشوفة لغروب الشمس'
      ],
      bestTime: 'أبريل - نوفمبر',
    },
    {
      id: 'trabzon',
      name: 'الشمال التركي وطرابزون',
      subtitle: 'طبيعة عذراء وأكواخ فاخرة بين السحاب',
      vibe: 'مرتفعات خضراء، شلالات مياه عذبة، وخصوصية تامة',
      description: 'جولات خاصة في مرتفعات آيدر، بحيرة أوزنجول، ريزا، وهضبة حيدر نبي. إقامة في أرقى الأكواخ الخشبية الفاخرة المجهزة بالكامل المطلة مباشرة على الطبيعة.',
      perks: [
        'أحدث سيارات مرسيدس سبرينتر VIP مجهزة بشاشات وواي فاي وثلاجة',
        'سائق محترف خبير بمرتفعات الشمال التركي ومرشد شخصي',
        'أكواخ فندقية فاخرة مع جاكوزي بإطلالة بانورامية كاملة',
        'تنظيم رحلات شواء خاصة وتناول الطعام في قمم الجبال'
      ],
      bestTime: 'مايو - أكتوبر',
    },
    {
      id: 'antalya',
      name: 'ريفييرا أنطاليا وبودروم',
      subtitle: 'فلل البحر وشواطئ الريفييرا التركية',
      vibe: 'شواطئ فيروزية، يخوت بحرية وفلل ملكية خاصة',
      description: 'إجازة استجمام راقية في أرقى منتجعات وفلل أنطاليا وبودروم مع شواطئ رملية خاصة، ومسابح خاصة، ورحلات إبحار يومية لخلجان مائية ساحرة منعزلة.',
      perks: [
        'فلل فندقية خاصة مع مسابح معزولة وخدم خاص (Private Butler)',
        'رحلات يخت يومية لجزر وخلجان أولودينيز وكيكوفا الغارقة',
        'حجوزات VIP في نوادي الشاطئ ومطاعم المأكولات البحرية الراقية',
        'استقبال ونقل خاص بسيارات فارهة من مطار أنطاليا / ميلاس'
      ],
      bestTime: 'مايو - نوفمبر',
    },
  ];

  const current = destinations[activeTab];

  return (
    <section id="standards" className="w-full max-w-6xl mx-auto px-4 sm:px-6 my-16 text-right">
      <div className="text-center mb-10">
        <span className="text-xs uppercase font-mono tracking-widest text-amber-400">
          DESTINATION HIGHLIGHTS
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-gold-gradient mt-2">
          اختر وجهتك المفضلة واستكشف مزاياها الملكية
        </h2>
        <p className="mt-2 text-sm text-slate-400 max-w-xl mx-auto">
          نغطي كافة أرجاء تركيا الساحرة بأعلى معايير الضيافة والخدمة الراقية
        </p>
      </div>

      {/* Destination Tabs (Interactive filter buttons) */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-amber-400/20 max-w-2xl mx-auto mb-8 backdrop-blur-xl">
        {destinations.map((dest, idx) => (
          <button
            key={dest.id}
            onClick={() => setActiveTab(idx)}
            className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap shrink-0 ${
              activeTab === idx
                ? 'bg-gradient-to-r from-amber-400/25 to-amber-500/15 border border-amber-400/60 text-amber-200 shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {dest.name}
          </button>
        ))}
      </div>

      {/* Active Destination Card with smooth animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl border border-amber-400/25 bg-slate-900/60 p-6 sm:p-10 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Details col */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-2xl font-bold text-slate-100">
                    {current.name}
                  </h3>
                  <span className="text-xs text-amber-300/80 font-medium">
                    {current.subtitle}
                  </span>
                </div>
              </div>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {current.description}
              </p>

              {/* Perks grid */}
              <div className="pt-2">
                <h4 className="text-xs font-bold text-amber-200 mb-3 flex items-center gap-2">
                  <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                  <span>الامتيازات المشمولة في برنامج هذه الوجهة:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {current.perks.map((perk, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action sidebar */}
            <div className="flex flex-col justify-between p-6 rounded-2xl border border-amber-400/20 bg-slate-950/60 text-center">
              <div>
                <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                  طبيعة التجربة
                </span>
                <p className="text-xs font-semibold text-amber-200 mt-1">
                  {current.vibe}
                </p>

                <div className="my-6 border-y border-slate-800 py-4">
                  <span className="text-[11px] text-slate-400 block mb-1">
                    أفضل فترات الزيارة
                  </span>
                  <span className="text-sm font-bold text-slate-200">
                    {current.bestTime}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => onSelectDestination(current.name)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 px-4 font-bold text-slate-950 text-xs sm:text-sm transition-all hover:scale-[1.02]"
                  style={{
                    background: 'linear-gradient(135deg, #FFF0B3 0%, #D4AF37 50%, #B8860B 100%)',
                  }}
                >
                  <Sparkles className="h-4 w-4" />
                  <span>طلب خطة رحلة مخصصة</span>
                </button>

                <a
                  href={`https://wa.me/${SITE_CONFIG.contact.whatsappNumber}?text=${encodeURIComponent(
                    `مرحباً، أود الاستفسار عن تفاصيل البرنامج السياحي الفاخر في ${current.name}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 py-3 px-4 text-xs sm:text-sm font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-all"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>محادثة واتساب سريعة</span>
                </a>
              </div>

            </div>

          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};
