import React from 'react';
import { Crown, MapPin, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';

export const Footer: React.FC = () => {
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
                  {SITE_CONFIG.company.nameAr}
                </span>
                <span className="text-xs font-mono text-slate-500 tracking-wider">
                  {SITE_CONFIG.company.nameEn}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
              {SITE_CONFIG.company.subSloganAr}. متخصصون في تصميم برامج السياحة الراقية للنخبة والعائلات الراغبة في الخصوصية والتميز.
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
            جميع الحقوق محفوظة © {new Date().getFullYear()} {SITE_CONFIG.company.nameAr}.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>الصفحة التمهيدية الرسمية</span>
            <span>•</span>
            <span className="text-amber-400/80">VIP Concierge Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
