import React from 'react';
import { Crown, Compass, Star, Shield, Gem } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SiteLogoProps {
  className?: string;
  iconClassName?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SiteLogo: React.FC<SiteLogoProps> = ({ 
  className = '', 
  iconClassName = '',
  size = 'md' 
}) => {
  const { siteSettings } = useApp();

  const sizeClasses = {
    sm: 'h-8 w-8 rounded-lg',
    md: 'h-10 w-10 sm:h-11 sm:w-11 rounded-xl',
    lg: 'h-14 w-14 rounded-2xl',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5 sm:h-6 sm:w-6',
    lg: 'h-7 w-7',
  };

  if (siteSettings.logoType === 'image' && siteSettings.logoImageUrl) {
    return (
      <div className={`overflow-hidden flex items-center justify-center p-0.5 rounded-xl border border-amber-400/30 bg-slate-950 ${sizeClasses[size]} ${className}`}>
        <img
          src={siteSettings.logoImageUrl}
          alt={siteSettings.nameAr}
          className="h-full w-full object-contain"
        />
      </div>
    );
  }

  const renderIcon = () => {
    const isize = iconSizes[size];
    switch (siteSettings.logoIcon) {
      case 'diamond':
        return <Gem className={`${isize} text-amber-300 ${iconClassName}`} />;
      case 'compass':
        return <Compass className={`${isize} text-amber-300 ${iconClassName}`} />;
      case 'star':
        return <Star className={`${isize} text-amber-300 ${iconClassName}`} />;
      case 'shield':
        return <Shield className={`${isize} text-amber-300 ${iconClassName}`} />;
      case 'crown':
      default:
        return <Crown className={`${isize} text-amber-300 ${iconClassName}`} />;
    }
  };

  return (
    <div className={`bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-[1px] shadow-[0_0_15px_rgba(212,175,55,0.3)] shrink-0 ${sizeClasses[size]} ${className}`}>
      <div className="h-full w-full rounded-[inherit] bg-slate-950 flex items-center justify-center">
        {renderIcon()}
      </div>
    </div>
  );
};
