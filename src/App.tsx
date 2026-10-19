/**
 * ==============================================================================
 * بوابـة تركيـا الفـاخرة | ELITE TURKEY VIP LUXURY TRAVEL
 * ==============================================================================
 * تطبيق سياحي فاخر متكامل يجمع بين:
 * 1. صفحة هبوط تفاعلية ثلاثية الأبعاد (Interactive 3D Landing Page)
 * 2. لوحة تحكم كاملة للمدير (Single-Admin Dashboard with 3 Clean Modules)
 * 3. نظام تقييمات خاضع للمراجعة والتدقيق الصارم (Strict Moderated Reviews)
 * 4. تكامل سحابي مع Supabase + وضع معاينة محلي فوري (Instant Fallback Store)
 * 5. دعم كامل للتنقل عبر الهاش (#/ و #/admin) للعمل بسلاسة على GitHub Pages وفي Google AI Studio.
 * ==============================================================================
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './components/LandingPage';
import { AdminDashboard } from './components/AdminDashboard/AdminDashboard';
import { AdminLogin } from './components/AdminDashboard/AdminLogin';

import { RoyalLuxurySplashLoader } from './components/RoyalLuxurySplashLoader';

function MainAppRouter() {
  const {
    currentRoute,
    adminUser,
    theme,
    isInitialDataLoading,
    loadingStageText,
    loadingProgressPercent,
    siteSettings,
  } = useApp();

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 ${
      theme === 'light' 
        ? 'bg-[#FAF7F2] text-slate-900 selection:bg-amber-400/40 selection:text-amber-950' 
        : 'bg-[#060A16] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200'
    }`}>
      {/* 1. Real Royal Luxury Database Splash Loader (Guards against flashing stale/cached data) */}
      <AnimatePresence>
        {isInitialDataLoading && (
          <RoyalLuxurySplashLoader
            key="royal-luxury-splash"
            theme={theme}
            stageText={loadingStageText}
            progressPercent={loadingProgressPercent}
            brandName={siteSettings.nameAr || 'عبد الله في تركيا'}
            brandSubtitle={siteSettings.sloganAr || 'للخدمات السياحية والعقارية في تركيا'}
          />
        )}
      </AnimatePresence>

      {/* 2. Main App Router (Only rendered when live database data is retrieved) */}
      {!isInitialDataLoading && (
        <AnimatePresence mode="wait">
          {currentRoute === 'admin' ? (
            <motion.div
              key="admin-route"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full min-h-screen"
            >
              {adminUser.isAuthenticated ? <AdminDashboard /> : <AdminLogin />}
            </motion.div>
          ) : (
            <motion.div
              key="landing-route"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="w-full min-h-screen"
            >
              <LandingPage />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppRouter />
    </AppProvider>
  );
}
