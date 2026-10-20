import React from 'react';
import { Crown, MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { siteSettings } = useApp();

  return (
    <footer id="contact" className="w-full border-t border-amber-400/15 bg-[#03060d] text-slate-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-right">
          
          {/* Col 1: Brand & TÜRSAB Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-[1px]">
                <div className="h-full w-full rounded-xl bg-slate-950 flex items-center justify-center">
                  <Crown className="h-5 w-5 text-amber-300" />
                </div>
              </div>
              <div>
                <span className="text-xl font-bold text-gold-gradient block">
                  {siteSettings.nameAr || 'عبد الله في تركيا'}
                </span>
                <span className="text-xs font-mono text-slate-500 tracking-wider">
                  {siteSettings.nameEn || 'Abdullah in Turkey'}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
              {siteSettings.sloganAr || 'للخدمات السياحية والعقارية في تركيا'}. متخصصون في تقديم أرقى الخدمات السياحية والعقارية والجولات الخاصة للعائلات الراغبة في الراحة والخصوصية والتميز.
            </p>

            <div className="flex items-center gap-2 pt-2 text-xs text-amber-300/90">
              <ShieldCheck className="h-4 w-4 text-amber-400" />
              <span>مرخص رسمياً: {SITE_CONFIG.company.tursabLicenseNumber}</span>
            </div>
          </div>

          {/* Col 2: Destinations */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              أبرز الوجهات الملكية
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#services" className="hover:text-amber-300 transition-colors">
                  إسطنبول ويخوت البوسفور
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-amber-300 transition-colors">
                  طرابزون والشمال التركي
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-amber-300 transition-colors">
                  كابادوكيا والمناطيد الخاصة
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-amber-300 transition-colors">
                  أنطاليا وفلل الساحل الفاخرة
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-amber-300 transition-colors">
                  بودروم وفتحية لرحلات الجوليت
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Office Coordinates */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              المكتب والتواصل المباشر
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{SITE_CONFIG.contact.officeAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-amber-400 shrink-0" />
                <span dir="ltr">{SITE_CONFIG.contact.displayPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-amber-400 shrink-0" />
                <span>{SITE_CONFIG.contact.email}</span>
              </div>
              <div className="flex items-center gap-2 text-amber-300/80">
                <Clock className="h-4 w-4 text-amber-400 shrink-0" />
                <span>{SITE_CONFIG.contact.workingHours}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-right">
          <p>
            جميع الحقوق محفوظة © {new Date().getFullYear()} {siteSettings.nameAr || 'عبد الله في تركيا'}.
          </p>
          <a
            href="https://alibuild.sbs"
            target="_blank"
            rel="noopener noreferrer"
            dir="rtl"
            className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-medium tracking-wide transition-all duration-300 group py-1 px-3 rounded-lg border border-amber-400/20 bg-slate-900/60 text-slate-300 hover:text-amber-200 hover:border-amber-400/50 shadow-[0_0_12px_rgba(212,175,55,0.08)]"
          >
            <span>تمت البرمجة بكل حب</span>
            <Heart className="h-3 w-3 text-rose-500 fill-rose-500 inline-block transition-transform duration-300 group-hover:scale-125" />
            <span>عن طريق</span>
            <span className="font-bold text-gold-gradient group-hover:underline underline-offset-4 transition-all">
              alibuild
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
};
