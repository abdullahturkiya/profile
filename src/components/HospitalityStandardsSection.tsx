import React from 'react';
import { Award, Plane, Car, Headphones, Shield, Star, Clock, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HospitalityStandardsSection: React.FC = () => {
  const { standards, theme } = useApp();

  const getStandardIcon = (iconName: string) => {
    const iconClass = "h-6 w-6 text-amber-400";
    switch (iconName) {
      case 'plane':
        return <Plane className={iconClass} />;
      case 'car':
        return <Car className={iconClass} />;
      case 'headset':
        return <Headphones className={iconClass} />;
      case 'shield':
        return <Shield className={iconClass} />;
      case 'star':
        return <Star className={iconClass} />;
      case 'clock':
        return <Clock className={iconClass} />;
      case 'heart':
        return <Heart className={iconClass} />;
      case 'award':
      default:
        return <Award className={iconClass} />;
    }
  };

  return (
    <section id="standards" className="w-full max-w-6xl mx-auto px-4 sm:px-6 my-20">
      <div className={`rounded-3xl border p-6 sm:p-10 md:p-12 backdrop-blur-xl transition-all duration-300 ${
        theme === 'light'
          ? 'border-slate-200 bg-white/95 shadow-[0_10px_35px_rgba(0,0,0,0.05)]'
          : 'border-amber-400/25 bg-gradient-to-b from-slate-900/80 to-[#060a16]/90'
      }`}>
        <div className="text-center mb-10">
          <span className={`text-xs uppercase font-mono tracking-widest font-bold ${
            theme === 'light' ? 'text-amber-700' : 'text-amber-500'
          }`}>
            THE ROYAL EXPERIENCE
          </span>
          <h3 className={`text-2xl sm:text-3xl font-extrabold mt-2 ${
            theme === 'light' ? 'text-slate-900' : 'text-slate-100'
          }`}>
            معايير الضيافة الملكية في كل خطوة من رحلتك
          </h3>
          <p className={`mt-2 text-xs sm:text-sm max-w-xl mx-auto ${
            theme === 'light' ? 'text-slate-600' : 'text-slate-400'
          }`}>
            نلتزم بأعلى مقاييس الفخامة والخصوصية لنقدم لك ولعائلتك تجربة استثنائية في تركيا.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {standards.map((std) => (
            <div
              key={std.id}
              className={`flex flex-col items-center text-center p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
                theme === 'light'
                  ? 'border-slate-200/90 bg-slate-50/80 hover:border-amber-400 hover:bg-white hover:shadow-md'
                  : 'border-amber-400/15 bg-slate-950/50 hover:border-amber-400/40 hover:bg-slate-900/70'
              }`}
            >
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 transition-transform ${
                theme === 'light'
                  ? 'bg-amber-50 border border-amber-200 text-amber-700'
                  : 'bg-amber-400/15 border border-amber-400/30 text-amber-500 shadow-[0_0_15px_rgba(212,175,55,0.15)]'
              }`}>
                {getStandardIcon(std.icon)}
              </div>
              <h4 className={`text-sm font-bold mb-1.5 ${
                theme === 'light' ? 'text-slate-900' : 'text-amber-200'
              }`}>
                {std.title}
              </h4>
              <p className={`text-xs leading-relaxed ${
                theme === 'light' ? 'text-slate-600' : 'text-slate-400'
              }`}>
                {std.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
