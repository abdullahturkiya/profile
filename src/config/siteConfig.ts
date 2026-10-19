/**
 * =======================================================================
 * إعدادات الموقع الرئيسية | MAIN SITE CONFIGURATION
 * =======================================================================
 * يمكنك تعديل بيانات الشركة، رقم الواتساب، تاريخ الإطلاق، وروابط التواصل
 * بسهولة من خلال هذا الملف وسينعكس التغيير فوراً في كل أنحاء الموقع.
 */

export interface ServiceTeaser {
  id: string;
  title: string;
  englishTitle: string;
  tagline: string;
  description: string;
  highlights: string[];
  destination: string;
  badge: string;
  suggestedMessage: string;
}

export const SITE_CONFIG = {
  // اسم الشركة والعلامة التجارية
  company: {
    nameAr: "عبد الله في تركيا",
    nameEn: "Abdullah in Turkey",
    sloganAr: "للخدمات السياحية والعقارية في تركيا",
    subSloganAr: "بوابتكم الخاصة للخدمات السياحية والعقارية والبرامج الفاخرة في تركيا",
    foundedYear: "2018",
    tursabLicenseNumber: "TÜRSAB - 14920 (فئة أ)",
    headquarters: "إسطنبول - تركيا",
  },

  // تاريخ ووقت الإطلاق الرسمي المستهدف (السنة، الشهر - 1، اليوم، الساعة، الدقيقة)
  // مثال: 2026-11-20
  launchDate: "2026-11-20T12:00:00",

  // بيانات التواصل المباشر وواتساب الحجوزات
  contact: {
    // رقم الواتساب مع المفتاح الدولي بدون إشارات (+ أو 00)
    whatsappNumber: "905380000000",
    displayPhone: "+90 (538) 000 0000",
    email: "contact@abdullahinturkey.com",
    officeAddress: "Zorlu Center, Levazım, Beşiktaş, Istanbul, Turkey",
    workingHours: "خدمة كونسيرج واستشارات على مدار الساعة 24/7",
    
    // نص الرسالة الافتراضية عند فتح محادثة الواتساب
    defaultWhatsAppMessage: "مرحباً، أود الاستفسار عن الخدمات السياحية والعقارية في تركيا عبر موقعكم.",
  },

  // روابط وسائل التواصل الاجتماعي
  socialMedia: {
    whatsapp: "https://wa.me/905380000000",
    instagram: "https://instagram.com/abdullahinturkey",
    telegram: "https://t.me/abdullahinturkey",
    tiktok: "https://tiktok.com/@abdullahinturkey",
    facebook: "https://facebook.com/abdullahinturkey",
    youtube: "https://youtube.com/@abdullahinturkey",
  },

  // خدمات VIP الحصرية التي سيتم تقديمها
  services: [
    {
      id: "istanbul-yachts",
      title: "رحلات ويخوت VIP في إسطنبول",
      englishTitle: "Bosphorus Royal Private Yachts",
      tagline: "إبحار خاص في مضيق البوسفور بأعلى درجات الرفاهية",
      description: "أسطول من أفخم اليخوت الفارهة مع طاقم خاص، شيف تركي وعالمي محترف، وجولات ساحرة بين قارة آسيا وأوروبا عند الغروب.",
      highlights: [
        "يخوت فاخرة حديثة بأحجام مختلفة (40 - 90 قدم)",
        "طعام ملكي مخصص بإشراف أمهر الطهاة",
        "خدمة استقبال بالمروحية (Helicopter) من المطار",
        "حجوزات حصرية في قصور ومطاعم الميشلان بإسطنبول"
      ],
      destination: "إسطنبول",
      badge: "تجربة ملكية",
      suggestedMessage: "مرحباً، أرغب في الاستفسار وحجز يخت VIP خاص في مضيق البوسفور بإسطنبول.",
    },
    {
      id: "cappadocia-antalya",
      title: "برامج كابادوكيا وأنطاليا الفاخرة",
      englishTitle: "Cappadocia & Antalya Royal Escapes",
      tagline: "أجنحة كهفية تاريخية، مناطيد خاصة وفلل شاطئية",
      description: "عش سحر كابادوكيا بمناطيد شروق الشمس الخاصة وأرقى الفنادق الكهفية العالمية، ثم انتقل لفلل أنطاليا الشاطئية الخاصة مع مسابح دافئة.",
      highlights: [
        "رحلة منطاد هوائي خاصة بدون زحام لشروق الشمس",
        "إقامة في أجنحة كهفية ملكية 5 نجوم (Museum Hotel / Argos)",
        "فلل شاطئية خاصة مع خدمات خدم وطاهٍ خاص في أنطاليا",
        "طيران داخلي خاص أو مقاعد درجة أولى VIP"
      ],
      destination: "كابادوكيا & أنطاليا",
      badge: "الأكثر طلباً",
      suggestedMessage: "مرحباً، أرغب بالاستفسار عن برامج كابادوكيا الفاخرة والمناطيد الخاصة وفلل أنطاليا.",
    },
    {
      id: "trabzon-north",
      title: "جولات الشمال التركي وطرابزون",
      englishTitle: "Black Sea & Trabzon Private Touring",
      tagline: "طبيعة ساحرة بسيارات مرسيدس مايباخ وسبرينتر VIP",
      description: "جولات يومية خاصة في ريزا، آيدر، بحيرة أوزنجول ومرتفعات حيدر نبي مع سائق كونسيرج خاص يتحدث العربية، وأكواخ بإطلالات بانورامية.",
      highlights: [
        "سيارات مرسيدس مايباخ ومرسيدس VIP فسيحة ومجهزة بالكامل",
        "حجوزات أكواخ خشبية فاخرة مطلة على شلالات أيدر وأوزنجول",
        "سائقين ومرشدين معتمدين ذوي خبرة وأخلاق عالية",
        "جولات مخصصة للعائلات مع خصوصية تامة"
      ],
      destination: "طرابزون والشمال التركي",
      badge: "طبيعة وخصوصية تامة",
      suggestedMessage: "مرحباً، أرغب في حجز جولة خاصة في الشمال التركي وطرابزون بسيارة VIP وسائق خاص.",
    },
  ] as ServiceTeaser[],

  // نقاط الثقة والاعتمادات
  trustPillars: [
    {
      title: "ترخيص رسمي TÜRSAB",
      description: "وكالة سياحية مسجلة رسمياً ومرخصة من وزارة السياحة التركية برخصة فئة (أ)",
      icon: "award",
    },
    {
      title: "استقبال VIP من باب الطائرة",
      description: "خدمة Fast Track وخدمات الاستقبال الفاخرة بمطاري إسطنبول وطرابزون",
      icon: "plane",
    },
    {
      title: "أسطول سيارات مايباخ وفيانو VIP",
      description: "سيارات حديثة مجهزة بشاشات، إنترنت فائق السرعة، ومقاعد مساج مريحة",
      icon: "car",
    },
    {
      title: "مستشار سياحي خاص 24/7",
      description: "متابعة دقيقة لكل تفاصيل رحلتكم باللغة العربية على مدار الساعة",
      icon: "headset",
    },
  ],
};
