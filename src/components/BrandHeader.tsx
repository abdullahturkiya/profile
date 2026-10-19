import React from 'react';
import { Crown, MessageCircle } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';

interface BrandHeaderProps {
  onOpenInquiry: () => void;
}

export const BrandHeader: React.FC<BrandHeaderProps> = ({ onOpenInquiry }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-400/15 bg-[#060a16]/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 h-20">
        
        {/* Zone 1: Single Brand Wordmark Element */}
        <a href="#" className="flex items-center gap-3 whitespace-nowrap shrink-0 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-[1px] shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            <div className="h-full w-full rounded-xl bg-slate-950 flex items-center justify-center">
              <Crown className="h-5 w-5 text-amber-300 transition-transform group-hover:scale-110" />
            </div>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-lg sm:text-xl font-bold tracking-tight text-gold-gradient">
              {SITE_CONFIG.company.nameAr}
            </span>
            <span className="text-[10px] tracking-widest text-slate-400 uppercase font-mono">
              {SITE_CONFIG.company.nameEn}
            </span>
          </div>
        </a>

        {/* Zone 2: 4 Clean Single-Line Text Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a
            href="#hero"
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
          >
            الرئيسية
          </a>
          <a
            href="#services"
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
          >
            برامج الرفاهية
          </a>
          <a
            href="#standards"
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
          >
            معايير النخبة
          </a>
          <a
            href="#contact"
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
          >
            التواصل والمكتب
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenInquiry}
            className="inline-flex items-center gap-2 rounded-xl border border-amber-400/40 bg-gradient-to-r from-amber-400/20 to-amber-500/10 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold text-amber-200 transition-all hover:bg-amber-400/30 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(212,175,55,0.25)] whitespace-nowrap shrink-0"
          >
            <MessageCircle className="h-4 w-4 text-amber-300" />
            <span>طلب حجز VIP</span>
          </button>
        </div>

      </div>
    </header>
  );
};
