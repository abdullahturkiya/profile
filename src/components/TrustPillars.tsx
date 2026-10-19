import React from 'react';
import { Award, Plane, Car, Headphones } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';

export const TrustPillars: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'award':
        return <Award className="h-6 w-6 text-amber-300" />;
      case 'plane':
        return <Plane className="h-6 w-6 text-amber-300" />;
      case 'car':
        return <Car className="h-6 w-6 text-amber-300" />;
      case 'headset':
      default:
        return <Headphones className="h-6 w-6 text-amber-300" />;
    }
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 my-16">
      <div className="rounded-3xl border border-amber-400/20 bg-gradient-to-b from-slate-900/60 to-[#060a16]/80 p-8 sm:p-10 backdrop-blur-xl">
        <div className="text-center mb-8">
          <span className="text-xs uppercase font-mono tracking-widest text-amber-400">
            THE ROYAL STANDARD
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-100 mt-1">
            لماذا يختار ضيوف النخبة دارنا السياحية؟
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SITE_CONFIG.trustPillars.map((pillar, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center p-5 rounded-2xl border border-amber-400/10 bg-slate-950/40 hover:border-amber-400/40 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="h-12 w-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
                {getIcon(pillar.icon)}
              </div>
              <h4 className="text-sm font-bold text-amber-200 mb-1.5">
                {pillar.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
