# بوابة تركيا الفاخرة | ELITE TURKEY VIP LUXURY TRAVEL

> صفحة ترقبوا انطلاقنا (Coming Soon) تفاعلية بتقنية 3D باللغة العربية بالكامل، مصممة خصيصاً لوكالات وشركات السياحة الفاخرة وحجوزات النخبة (VIP) في تركيا.

![Preview](https://raw.githubusercontent.com/abdullahturkiya/turkey-vip-tourism/main/public/preview.png)

---

## 🌟 أبرز المميزات

1. **واجهة عربية فاخرة 100% (RTL)**:
   - تصميم متكامل يدعم الاتجاه من اليمين لليسار.
   - خطوط Google Fonts الفاخرة: **Cairo** للعناوين الرئيسية، **Tajawal** للنصوص التوضيحية، و **Cinzel** للرموز الملكية.
   - هوية لونية ملكية: كحلي داكن (`#060A16`)، ذهبي شامبانيا (`#D4AF37`)، ولمسات زجاجية (`backdrop-blur-2xl`).

2. **تأثيرات 3D تفاعلية متقدمة (`motion/react`)**:
   - **خلفية بارالاكس تفاعلية ثلاثية الأبعاد (3D Mouse Parallax)**: طبقات متعددة العمق تتفاعل مع حركة المؤشر ترسم معالم إسطنبول (برج الفتاة ومضيق البوسفور) ومناطيد كابادوكيا وجبال طرابزون الخضراء.
   - **غبار ونجوم ذهبية عائمة (Canvas Golden Stardust)**: محاكاة فيزيائية حية لذرات النور الذهبي في الخلفية.
   - **بطاقة العرض الرئيسية 3D (Perspective Tilt Hero Card)**: حاوية ثلاثية الأبعاد تستجيب لحركة الماوس بزوايا ميلان واقعية وتأثير لمعان ضوئي ديناميكي (Dynamic Glare).

3. **عداد تنازلي ثلاثي الأبعاد (3D Countdown Timer)**:
   - كتل زجاجية عائمة للأيام، الساعات، الدقائق، والثواني مع حركة flip انسيابية عند تغير الأرقام.

4. **معاينة الخدمات الملكية (3D Mini-Tilt Teasers)**:
   - رحلات ويخوت VIP في مضيق البوسفور بإسطنبول.
   - برامج كابادوكيا وأنطاليا الفاخرة والمناطيد الخاصة.
   - جولات الشمال التركي وطرابزون بسيارات مرسيدس مايباخ وسبرينتر VIP.

5. **نظام حجز فوري بدون فقدان أي عميل (Zero Lead Loss)**:
   - زر واتساب تفاعلي عائم وثابت للتواصل المباشر 24/7.
   - نافذة استفسار منبثقة تفاعلية تأخذ اسم الضيف، الوجهة، عدد المسافرين، والخدمات المطلوبة وتنشئ رسالة واتساب منسقة ومجهزة تلقائياً بمجرد الضغط.

---

## ⚙️ التعديل والتخصيص السريع (SITE_CONFIG)

يمكنك تعديل جميع بيانات الموقع من خلال ملف الإعدادات الموحد:  
`src/config/siteConfig.ts`

```typescript
export const SITE_CONFIG = {
  company: {
    nameAr: "دار النخبة للسياحة الفاخرة",
    nameEn: "ELITE TURKEY VIP LUXURY TRAVEL",
    sloganAr: "سوف ننطلق قريباً • تجربة سياحية بمفهوم جديد",
    tursabLicenseNumber: "TÜRSAB - 14920 (فئة أ)",
  },
  // تاريخ الإطلاق الرسمي المستهدف
  launchDate: "2026-11-20T12:00:00",

  // رقم الواتساب بدون أصفار أو إشارة + في البداية
  contact: {
    whatsappNumber: "905380000000",
    displayPhone: "+90 (538) 000 0000",
    email: "vip@eliteturkeyluxury.com",
  },
  // روابط التواصل الاجتماعي
  socialMedia: {
    whatsapp: "https://wa.me/905380000000",
    instagram: "https://instagram.com/eliteturkey_vip",
    telegram: "https://t.me/eliteturkeyvip",
    tiktok: "https://tiktok.com/@eliteturkey_vip",
  }
};
```

---

## 🚀 النشر على GitHub Pages

المشروع مُعد مسبقاً للنشر المباشر عبر أمر:
```bash
npm run build
```
الرابط المباشر لمشروعك على GitHub:  
[https://github.com/abdullahturkiya/turkey-vip-tourism](https://github.com/abdullahturkiya/turkey-vip-tourism)
