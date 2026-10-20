import React, { createContext, useContext, useState, useEffect } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { TourismService, Review, SocialLink, AdminUser, SiteSettings, HospitalityStandard, ThemeMode } from '../types';
import { INITIAL_SERVICES, INITIAL_REVIEWS, INITIAL_SOCIAL_LINKS, INITIAL_SITE_SETTINGS, INITIAL_STANDARDS } from '../data/initialData';
import { getSupabaseClient, resetSupabaseClient } from '../lib/supabase';
import { safeStorage } from '../utils/safeStorage';

import { ToastNotificationContainer, ToastMessage } from '../components/ToastNotificationContainer';
import { GlobalLoadingIndicator } from '../components/GlobalLoadingIndicator';

interface ServiceRatingSummary {
  average: number;
  count: number;
}

interface AppContextType {
  currentRoute: 'landing' | 'admin';
  navigateTo: (route: 'landing' | 'admin') => void;
  
  // Theme Mode (Royal Dark / Royal Light)
  theme: ThemeMode;
  toggleTheme: () => void;

  // Real-time Toast Notifications & Global Loading
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'loading', duration?: number) => void;
  removeToast: (id: string) => void;
  isGlobalLoading: boolean;
  globalLoadingText: string;
  startGlobalLoading: (text?: string) => void;
  stopGlobalLoading: () => void;

  // Real Database Direct Sync & Luxury Loading
  isInitialDataLoading: boolean;
  loadingStageText: string;
  loadingProgressPercent: number;
  refreshDatabaseData: () => Promise<void>;
  
  // Site Settings & Logo
  siteSettings: SiteSettings;
  updateSiteSettings: (updates: Partial<SiteSettings>) => Promise<void>;

  // Hospitality Standards
  standards: HospitalityStandard[];
  addStandard: (standard: Omit<HospitalityStandard, 'id'>) => Promise<void>;
  updateStandard: (id: string, updates: Partial<HospitalityStandard>) => Promise<void>;
  deleteStandard: (id: string) => Promise<void>;

  // Services
  services: TourismService[];
  addService: (service: Omit<TourismService, 'id'>) => Promise<void>;
  updateService: (id: string, updates: Partial<TourismService>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;

  // Reviews
  reviews: Review[];
  addReview: (serviceId: string, authorName: string, rating: number, comment: string, location?: string) => Promise<void>;
  approveReview: (id: string) => Promise<void>;
  rejectReview: (id: string) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  getApprovedReviews: (serviceId: string) => Review[];
  getServiceRating: (serviceId: string) => ServiceRatingSummary;
  pendingReviewsCount: number;

  // Social Links
  socialLinks: SocialLink[];
  updateSocialLink: (id: string, updates: Partial<SocialLink>) => Promise<void>;
  addSocialLink: (link: Omit<SocialLink, 'id'>) => Promise<void>;
  deleteSocialLink: (id: string) => Promise<void>;
  primaryWhatsAppNumber: string;

  // Admin Auth
  adminUser: AdminUser;
  loginAdmin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => void;
  updateAdminPassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  managerEmail: string;

  // Supabase Settings
  isSupabaseConnected: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Hash-based routing state
  const getRouteFromHash = (): 'landing' | 'admin' => {
    if (typeof window === 'undefined') return 'landing';
    return window.location.hash.includes('/admin') ? 'admin' : 'landing';
  };

  const [currentRoute, setCurrentRoute] = useState<'landing' | 'admin'>(getRouteFromHash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(getRouteFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route: 'landing' | 'admin') => {
    window.location.hash = route === 'admin' ? '#/admin' : '#/';
    setCurrentRoute(route);
  };

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const showToast = (
    message: string,
    type: 'success' | 'error' | 'info' | 'loading' = 'success',
    duration = 3500
  ) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    const newToast: ToastMessage = { id, message, type, duration };
    setToasts((prev) => [...prev.slice(-3), newToast]);

    if (type !== 'loading' && duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  // Global Loading state
  const [isGlobalLoading, setIsGlobalLoading] = useState<boolean>(false);
  const [globalLoadingText, setGlobalLoadingText] = useState<string>('جاري حفظ التعديلات...');

  const startGlobalLoading = (text = 'جاري التحديث...') => {
    setGlobalLoadingText(text);
    setIsGlobalLoading(true);
  };

  const stopGlobalLoading = () => {
    setIsGlobalLoading(false);
  };

  // Royal Theme Mode: 'dark' (Deep Royal Obsidian) | 'light' (Royal Pearl / Ivory & Gold)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const cached = safeStorage.getItem('ELITE_TURKEY_THEME') as ThemeMode;
    if (cached === 'light' || cached === 'dark') return cached;
    return 'dark';
  });

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      safeStorage.setItem('ELITE_TURKEY_THEME', next);
      showToast(
        next === 'light' ? 'تم تفعيل الوضع النهاري الملكي' : 'تم تفعيل الوضع الليلي الملكي',
        'info',
        2500
      );
      return next;
    });
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      if (theme === 'light') {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
        document.body.style.backgroundColor = '#FAF7F2';
        document.body.style.color = '#1E293B';
      } else {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        document.body.style.backgroundColor = '#060A16';
        document.body.style.color = '#F8FAFC';
      }
    }
  }, [theme]);

  // Site Settings
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const cached = safeStorage.getItem('ELITE_TURKEY_SETTINGS');
      if (cached) {
        const parsed = JSON.parse(cached);
        return { ...INITIAL_SITE_SETTINGS, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to parse cached site settings:', e);
    }
    return INITIAL_SITE_SETTINGS;
  });

  // Hospitality Standards
  const [standards, setStandards] = useState<HospitalityStandard[]>(() => {
    try {
      const cached = safeStorage.getItem('ELITE_TURKEY_STANDARDS');
      if (cached) return JSON.parse(cached);
    } catch (e) {
      console.warn('Failed to parse cached standards:', e);
    }
    return INITIAL_STANDARDS;
  });

  // Services (Fall back immediately to INITIAL_SERVICES to guarantee instant, flawless iOS load)
  const [services, setServices] = useState<TourismService[]>(() => {
    try {
      const cached = safeStorage.getItem('ELITE_TURKEY_SERVICES');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse cached services:', e);
    }
    return INITIAL_SERVICES;
  });

  // Reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const cached = safeStorage.getItem('ELITE_TURKEY_REVIEWS');
      if (cached) return JSON.parse(cached);
    } catch (e) {
      console.warn('Failed to parse cached reviews:', e);
    }
    return INITIAL_REVIEWS;
  });

  // Social Links
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(() => {
    try {
      const cached = safeStorage.getItem('ELITE_TURKEY_SOCIALS');
      if (cached) return JSON.parse(cached);
    } catch (e) {
      console.warn('Failed to parse cached social links:', e);
    }
    return INITIAL_SOCIAL_LINKS;
  });

  // Admin user
  const [adminUser, setAdminUser] = useState<AdminUser>(() => {
    try {
      const cached = safeStorage.getItem('ELITE_TURKEY_ADMIN');
      if (cached) return JSON.parse(cached);
    } catch (e) {
      console.warn('Failed to parse cached admin user:', e);
    }
    return { email: '', isAuthenticated: false, isDemo: false };
  });

  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(true);

  // Direct Sync & Royal Splash Loading States
  const [isInitialDataLoading, setIsInitialDataLoading] = useState<boolean>(true);
  const [loadingStageText, setLoadingStageText] = useState<string>('مرحباً بكم، جاري تحضير تجربة سفركم الفاخرة...');
  const [loadingProgressPercent, setLoadingProgressPercent] = useState<number>(20);

  // Sync state to safeStorage (offline cache backup without iOS crash)
  useEffect(() => {
    safeStorage.setItem('ELITE_TURKEY_SETTINGS', JSON.stringify(siteSettings));
  }, [siteSettings]);

  useEffect(() => {
    safeStorage.setItem('ELITE_TURKEY_STANDARDS', JSON.stringify(standards));
  }, [standards]);

  useEffect(() => {
    safeStorage.setItem('ELITE_TURKEY_SERVICES', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    safeStorage.setItem('ELITE_TURKEY_REVIEWS', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    safeStorage.setItem('ELITE_TURKEY_SOCIALS', JSON.stringify(socialLinks));
  }, [socialLinks]);

  useEffect(() => {
    safeStorage.setItem('ELITE_TURKEY_ADMIN', JSON.stringify(adminUser));
  }, [adminUser]);

  // Core function to fetch fresh data directly from Supabase
  const fetchFreshDatabaseData = async (isManual = false) => {
    const client = getSupabaseClient();
    if (!client) {
      setIsSupabaseConnected(false);
      setIsInitialDataLoading(false);
      return;
    }

    try {
      setLoadingStageText('جاري تجهيز برامجكم السياحية والعقارية الفاخرة...');
      setLoadingProgressPercent(20);

      // 1. Fetch site_settings directly from Supabase
      setLoadingStageText('تحميل أحدث إعدادات وباقات عبدالله في تركيا...');
      setLoadingProgressPercent(35);
      const { data: setData, error: setErr } = await client
        .from('site_settings')
        .select('*')
        .eq('id', 'primary')
        .maybeSingle();

      if (!setErr && setData) {
        const dbData = setData as Record<string, unknown>;
        const mappedSettings: SiteSettings = {
          nameAr: dbData.name_ar ? String(dbData.name_ar) : INITIAL_SITE_SETTINGS.nameAr,
          nameEn: dbData.name_en ? String(dbData.name_en) : INITIAL_SITE_SETTINGS.nameEn,
          sloganAr: dbData.slogan_ar ? String(dbData.slogan_ar) : INITIAL_SITE_SETTINGS.sloganAr,
          logoType: (dbData.logo_type as SiteSettings['logoType']) || 'icon',
          logoIcon: (dbData.logo_icon as SiteSettings['logoIcon']) || 'crown',
          logoImageUrl: dbData.logo_image_url ? String(dbData.logo_image_url) : '',
          tursabLicense: dbData.tursab_license ? String(dbData.tursab_license) : INITIAL_SITE_SETTINGS.tursabLicense,
          headquarters: dbData.headquarters ? String(dbData.headquarters) : INITIAL_SITE_SETTINGS.headquarters,

          heroBackgroundImage: dbData.hero_background_image ? String(dbData.hero_background_image) : INITIAL_SITE_SETTINGS.heroBackgroundImage,
          heroBackgroundOpacity: typeof dbData.hero_background_opacity === 'number' ? dbData.hero_background_opacity : INITIAL_SITE_SETTINGS.heroBackgroundOpacity,
          heroBadgeText: dbData.hero_badge_text ? String(dbData.hero_badge_text) : INITIAL_SITE_SETTINGS.heroBadgeText,
          heroBadgeVisible: dbData.hero_badge_visible !== null && dbData.hero_badge_visible !== undefined ? Boolean(dbData.hero_badge_visible) : true,
          heroHeadline: dbData.hero_headline ? String(dbData.hero_headline) : INITIAL_SITE_SETTINGS.heroHeadline,
          heroSubtitle: dbData.hero_subtitle ? String(dbData.hero_subtitle) : INITIAL_SITE_SETTINGS.heroSubtitle,
          heroPrimaryCtaText: dbData.hero_primary_cta_text ? String(dbData.hero_primary_cta_text) : INITIAL_SITE_SETTINGS.heroPrimaryCtaText,
          heroPrimaryCtaCustomUrl: dbData.hero_primary_cta_custom_url ? String(dbData.hero_primary_cta_custom_url) : '',
          heroPrimaryCtaVisible: dbData.hero_primary_cta_visible !== null && dbData.hero_primary_cta_visible !== undefined ? Boolean(dbData.hero_primary_cta_visible) : true,
          heroSecondaryCtaText: dbData.hero_secondary_cta_text ? String(dbData.hero_secondary_cta_text) : INITIAL_SITE_SETTINGS.heroSecondaryCtaText,
          heroSecondaryCtaLink: dbData.hero_secondary_cta_link ? String(dbData.hero_secondary_cta_link) : INITIAL_SITE_SETTINGS.heroSecondaryCtaLink,
          heroSecondaryCtaVisible: dbData.hero_secondary_cta_visible !== null && dbData.hero_secondary_cta_visible !== undefined ? Boolean(dbData.hero_secondary_cta_visible) : true,
          heroTrustText1: dbData.hero_trust_text_1 ? String(dbData.hero_trust_text_1) : INITIAL_SITE_SETTINGS.heroTrustText1,
          heroTrustText2: dbData.hero_trust_text_2 ? String(dbData.hero_trust_text_2) : INITIAL_SITE_SETTINGS.heroTrustText2,
          heroTrustText3: dbData.hero_trust_text_3 ? String(dbData.hero_trust_text_3) : INITIAL_SITE_SETTINGS.heroTrustText3,
          heroTrustBarVisible: dbData.hero_trust_bar_visible !== null && dbData.hero_trust_bar_visible !== undefined ? Boolean(dbData.hero_trust_bar_visible) : true,

          contactBadgeText: dbData.contact_badge_text ? String(dbData.contact_badge_text) : INITIAL_SITE_SETTINGS.contactBadgeText,
          contactBadgeVisible: dbData.contact_badge_visible !== null && dbData.contact_badge_visible !== undefined ? Boolean(dbData.contact_badge_visible) : true,
          contactTitle: dbData.contact_title ? String(dbData.contact_title) : INITIAL_SITE_SETTINGS.contactTitle,
          contactSubtitle: dbData.contact_subtitle ? String(dbData.contact_subtitle) : INITIAL_SITE_SETTINGS.contactSubtitle,
          contactWhatsAppVisible: dbData.contact_whats_app_visible !== null && dbData.contact_whats_app_visible !== undefined ? Boolean(dbData.contact_whats_app_visible) : true,
          contactWhatsAppTitle: dbData.contact_whats_app_title ? String(dbData.contact_whats_app_title) : INITIAL_SITE_SETTINGS.contactWhatsAppTitle,
          contactWhatsAppBadge: dbData.contact_whats_app_badge ? String(dbData.contact_whats_app_badge) : INITIAL_SITE_SETTINGS.contactWhatsAppBadge,
          contactWhatsAppDescription: dbData.contact_whats_app_description ? String(dbData.contact_whats_app_description) : INITIAL_SITE_SETTINGS.contactWhatsAppDescription,
          contactWhatsAppButtonText: dbData.contact_whats_app_button_text ? String(dbData.contact_whats_app_button_text) : INITIAL_SITE_SETTINGS.contactWhatsAppButtonText,
          contactWhatsAppNumber: dbData.contact_whats_app_number ? String(dbData.contact_whats_app_number) : INITIAL_SITE_SETTINGS.contactWhatsAppNumber,
          contactWhatsAppDefaultMessage: dbData.contact_whats_app_default_message ? String(dbData.contact_whats_app_default_message) : INITIAL_SITE_SETTINGS.contactWhatsAppDefaultMessage,
          contactTrustBarVisible: dbData.contact_trust_bar_visible !== null && dbData.contact_trust_bar_visible !== undefined ? Boolean(dbData.contact_trust_bar_visible) : true,
          contactLicenseText: dbData.contact_license_text ? String(dbData.contact_license_text) : INITIAL_SITE_SETTINGS.contactLicenseText,
          contactSupportHours: dbData.contact_support_hours ? String(dbData.contact_support_hours) : INITIAL_SITE_SETTINGS.contactSupportHours,
          contactHeadquartersText: dbData.contact_headquarters_text ? String(dbData.contact_headquarters_text) : INITIAL_SITE_SETTINGS.contactHeadquartersText,
        };
        setSiteSettings(mappedSettings);
        safeStorage.setItem('ELITE_TURKEY_SETTINGS', JSON.stringify(mappedSettings));
      }

      // 2. Fetch live services directly from Supabase
      setLoadingStageText('تحميل أحدث الباقات والجولات والخدمات...');
      setLoadingProgressPercent(58);
      const { data: srvData, error: srvErr } = await client
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });

      if (!srvErr && srvData && srvData.length > 0) {
        setIsSupabaseConnected(true);
        const mappedServices: TourismService[] = srvData.map((s: Record<string, unknown>) => ({
          id: String(s.id),
          title: String(s.title || ''),
          englishTitle: String(s.english_title || ''),
          description: String(s.description || ''),
          price: Number(s.price || 0),
          currency: String(s.currency || 'USD'),
          badge: String(s.badge || 'VIP'),
          imageUrl: String(s.image_url || ''),
          destination: String(s.destination || 'إسطنبول'),
          features: Array.isArray(s.features) ? s.features as string[] : [],
          createdAt: String(s.created_at || ''),
        }));
        setServices(mappedServices);
        safeStorage.setItem('ELITE_TURKEY_SERVICES', JSON.stringify(mappedServices));
      }

      // 3. Fetch live reviews directly from Supabase
      setLoadingStageText('عرض آراء وتجارب ضيوفنا الكرام...');
      setLoadingProgressPercent(74);
      const { data: revData, error: revErr } = await client.from('reviews').select('*');
      if (!revErr && revData && revData.length > 0) {
        const mappedReviews: Review[] = revData.map((r: Record<string, unknown>) => ({
          id: String(r.id),
          serviceId: String(r.service_id),
          authorName: String(r.author_name),
          location: String(r.location || ''),
          rating: Number(r.rating),
          comment: String(r.comment),
          status: r.status as 'pending' | 'approved' | 'rejected',
          createdAt: String(r.created_at || new Date().toISOString()),
        }));
        setReviews(mappedReviews);
        safeStorage.setItem('ELITE_TURKEY_REVIEWS', JSON.stringify(mappedReviews));
      }

      // 4. Fetch social links directly from Supabase
      setLoadingStageText('تجهيز قنوات التواصل المباشر مع المستشار...');
      setLoadingProgressPercent(86);
      const { data: socData, error: socErr } = await client.from('social_links').select('*');
      if (!socErr && socData && socData.length > 0) {
        const mappedSocials: SocialLink[] = socData.map((l: Record<string, unknown>) => ({
          id: String(l.id),
          platform: l.platform as SocialLink['platform'],
          label: String(l.label || ''),
          url: String(l.url || ''),
          description: l.description ? String(l.description) : undefined,
          badge: l.badge ? String(l.badge) : undefined,
          actionText: l.action_text ? String(l.action_text) : undefined,
          isActive: Boolean(l.is_active),
        }));
        setSocialLinks(mappedSocials);
        safeStorage.setItem('ELITE_TURKEY_SOCIALS', JSON.stringify(mappedSocials));
      }

      // 5. Fetch hospitality standards from Supabase
      const { data: stdData, error: stdErr } = await client
        .from('hospitality_standards')
        .select('*')
        .order('sort_order', { ascending: true });
      if (!stdErr && stdData && stdData.length > 0) {
        const mappedStandards: HospitalityStandard[] = stdData.map((d: Record<string, unknown>) => ({
          id: String(d.id),
          title: String(d.title || ''),
          description: String(d.description || ''),
          icon: (d.icon as HospitalityStandard['icon']) || 'award',
        }));
        setStandards(mappedStandards);
        safeStorage.setItem('ELITE_TURKEY_STANDARDS', JSON.stringify(mappedStandards));
      }

      // 6. Verify admin user authentication status if logged in
      if (adminUser.isAuthenticated && adminUser.email) {
        const { data: adminCheck, error: adminErr } = await client
          .from('admin_users')
          .select('email')
          .eq('email', adminUser.email.trim().toLowerCase())
          .maybeSingle();

        if (!adminErr && !adminCheck) {
          setAdminUser({ email: '', isAuthenticated: false, isDemo: false });
          safeStorage.removeItem('ELITE_TURKEY_ADMIN');
        }
      }

      // 7. Finish loading smoothly
      setLoadingStageText('أهلاً بكم في رحلتكم الاستثنائية');
      setLoadingProgressPercent(100);
      setIsSupabaseConnected(true);

      // Brief gentle pause so 100% is registered gracefully
      await new Promise((r) => setTimeout(r, 260));
      setIsInitialDataLoading(false);

      if (isManual) {
        showToast('تم تحديث المحتوى بنجاح', 'success', 3000);
      }
    } catch (err) {
      console.warn('Direct fetch notice:', err);
      setIsInitialDataLoading(false);
    }
  };

  const refreshDatabaseData = async () => {
    startGlobalLoading('جاري تحديث المحتوى...');
    try {
      await fetchFreshDatabaseData(true);
    } finally {
      stopGlobalLoading();
    }
  };

  // Initial Supabase Sync with safety timeout (max 3.5 seconds to guarantee fast, responsive load on iOS mobile)
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      setIsInitialDataLoading((prev) => {
        if (prev) {
          console.warn('Initial data load timeout reached; displaying available state.');
          return false;
        }
        return false;
      });
    }, 3500);

    fetchFreshDatabaseData(false).finally(() => {
      clearTimeout(safetyTimer);
    });

    // Supabase Realtime Subscription for interactive live database reactivity
    const client = getSupabaseClient();
    let servicesChannel: RealtimeChannel | null = null;
    if (client) {
      try {
        servicesChannel = client
          .channel('realtime:services')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'services' },
            (payload) => {
              console.log('Realtime service update event:', payload);
              if (payload.eventType === 'INSERT') {
                const s = payload.new as Record<string, unknown>;
                const mapped: TourismService = {
                  id: String(s.id),
                  title: String(s.title || ''),
                  englishTitle: String(s.english_title || ''),
                  description: String(s.description || ''),
                  price: Number(s.price || 0),
                  currency: String(s.currency || 'USD'),
                  badge: String(s.badge || 'VIP'),
                  imageUrl: String(s.image_url || ''),
                  destination: String(s.destination || 'إسطنبول'),
                  features: Array.isArray(s.features) ? s.features as string[] : [],
                  createdAt: String(s.created_at || ''),
                };
                setServices((prev) => {
                  if (prev.some((x) => x.id === mapped.id)) {
                    return prev.map((x) => (x.id === mapped.id ? mapped : x));
                  }
                  return [mapped, ...prev];
                });
              } else if (payload.eventType === 'UPDATE') {
                const s = payload.new as Record<string, unknown>;
                const mapped: TourismService = {
                  id: String(s.id),
                  title: String(s.title || ''),
                  englishTitle: String(s.english_title || ''),
                  description: String(s.description || ''),
                  price: Number(s.price || 0),
                  currency: String(s.currency || 'USD'),
                  badge: String(s.badge || 'VIP'),
                  imageUrl: String(s.image_url || ''),
                  destination: String(s.destination || 'إسطنبول'),
                  features: Array.isArray(s.features) ? s.features as string[] : [],
                  createdAt: String(s.created_at || ''),
                };
                setServices((prev) => prev.map((x) => (x.id === mapped.id ? mapped : x)));
              } else if (payload.eventType === 'DELETE') {
                const deletedId = (payload.old as { id?: string })?.id;
                if (deletedId) {
                  setServices((prev) => prev.filter((x) => x.id !== deletedId));
                }
              }
            }
          )
          .subscribe((status, err) => {
            if (err) console.warn('Realtime subscription notice:', err.message);
          });
      } catch (err) {
        console.warn('Realtime channel setup caught:', err);
      }
    }

    return () => {
      clearTimeout(safetyTimer);
      if (client && servicesChannel) {
        try {
          client.removeChannel(servicesChannel);
        } catch {
          // Ignore
        }
      }
    };
  }, [adminUser.isAuthenticated, adminUser.email]);

  // Update Site Settings
  const updateSiteSettings = async (updates: Partial<SiteSettings>) => {
    startGlobalLoading('جاري حفظ وتطبيق إعدادات الموقع...');
    
    // Compute new settings state synchronously
    const newSettings: SiteSettings = { ...siteSettings, ...updates };
    setSiteSettings(newSettings);
    safeStorage.setItem('ELITE_TURKEY_SETTINGS', JSON.stringify(newSettings));

    const client = getSupabaseClient();
    if (client) {
      try {
        const { error } = await client.from('site_settings').upsert({
          id: 'primary',
          name_ar: newSettings.nameAr,
          name_en: newSettings.nameEn,
          slogan_ar: newSettings.sloganAr,
          logo_type: newSettings.logoType,
          logo_icon: newSettings.logoIcon,
          logo_image_url: newSettings.logoImageUrl,
          tursab_license: newSettings.tursabLicense,
          headquarters: newSettings.headquarters,

          hero_background_image: newSettings.heroBackgroundImage,
          hero_background_opacity: newSettings.heroBackgroundOpacity,
          hero_badge_text: newSettings.heroBadgeText,
          hero_badge_visible: newSettings.heroBadgeVisible,
          hero_headline: newSettings.heroHeadline,
          hero_subtitle: newSettings.heroSubtitle,
          hero_primary_cta_text: newSettings.heroPrimaryCtaText,
          hero_primary_cta_custom_url: newSettings.heroPrimaryCtaCustomUrl,
          hero_primary_cta_visible: newSettings.heroPrimaryCtaVisible,
          hero_secondary_cta_text: newSettings.heroSecondaryCtaText,
          hero_secondary_cta_link: newSettings.heroSecondaryCtaLink,
          hero_secondary_cta_visible: newSettings.heroSecondaryCtaVisible,
          hero_trust_text_1: newSettings.heroTrustText1,
          hero_trust_text_2: newSettings.heroTrustText2,
          hero_trust_text_3: newSettings.heroTrustText3,
          hero_trust_bar_visible: newSettings.heroTrustBarVisible,

          contact_badge_text: newSettings.contactBadgeText,
          contact_badge_visible: newSettings.contactBadgeVisible,
          contact_title: newSettings.contactTitle,
          contact_subtitle: newSettings.contactSubtitle,
          contact_whats_app_number: newSettings.contactWhatsAppNumber,
          contact_whats_app_default_message: newSettings.contactWhatsAppDefaultMessage,
          contact_whats_app_title: newSettings.contactWhatsAppTitle,
          contact_whats_app_badge: newSettings.contactWhatsAppBadge,
          contact_whats_app_description: newSettings.contactWhatsAppDescription,
          contact_whats_app_button_text: newSettings.contactWhatsAppButtonText,
          contact_whats_app_visible: newSettings.contactWhatsAppVisible,
          contact_trust_bar_visible: newSettings.contactTrustBarVisible,
          contact_license_text: newSettings.contactLicenseText,
          contact_support_hours: newSettings.contactSupportHours,
          contact_headquarters_text: newSettings.contactHeadquartersText,

          updated_at: new Date().toISOString(),
        });

        if (error) {
          console.error('Supabase site_settings upsert error:', error);
          showToast('تنبيه: تعذر حفظ بعض التعديلات، يرجى المحاولة لاحقاً', 'error');
        }
      } catch (e) {
        console.warn('Supabase site_settings upsert skipped:', e);
      }
    }
    stopGlobalLoading();
    showToast('تم حفظ وتحديث إعدادات الموقع بنجاح', 'success');
  };

  // Standards Actions
  const addStandard = async (stdData: Omit<HospitalityStandard, 'id'>) => {
    startGlobalLoading('جاري حفظ معيار الضيافة الفاخر...');
    const newStd: HospitalityStandard = {
      ...stdData,
      id: 'std-' + Date.now(),
    };
    setStandards((prev) => [...prev, newStd]);

    const client = getSupabaseClient();
    if (client) {
      try {
        const { error } = await client.from('hospitality_standards').insert({
          id: newStd.id,
          title: newStd.title,
          description: newStd.description,
          icon: newStd.icon,
        });

        if (error) {
          console.error('Supabase standards insert error:', error);
          showToast('تنبيه: تعذر إضافة معيار الضيافة', 'error');
        }
      } catch (e) {
        console.warn('Supabase standards insert skipped:', e);
      }
    }
    stopGlobalLoading();
    showToast('تمت إضافة معيار الضيافة الجديد بنجاح', 'success');
  };

  const updateStandard = async (id: string, updates: Partial<HospitalityStandard>) => {
    startGlobalLoading('جاري تحديث معيار الضيافة...');
    setStandards((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));

    const client = getSupabaseClient();
    if (client) {
      try {
        const { error } = await client.from('hospitality_standards').update(updates).eq('id', id);
        if (error) {
          console.error('Supabase standards update error:', error);
          showToast('تنبيه: تعذر تحديث معيار الضيافة', 'error');
        }
      } catch (e) {
        console.warn('Supabase standards update skipped:', e);
      }
    }
    stopGlobalLoading();
    showToast('تم تحديث معيار الضيافة بنجاح', 'success');
  };

  const deleteStandard = async (id: string) => {
    startGlobalLoading('جاري إزالة المعيار...');
    setStandards((prev) => prev.filter((s) => s.id !== id));

    const client = getSupabaseClient();
    if (client) {
      try {
        const { error } = await client.from('hospitality_standards').delete().eq('id', id);
        if (error) {
          console.error('Supabase standards delete error:', error);
          showToast('تنبيه: تعذر إتمام حذف المعيار', 'error');
        }
      } catch (e) {
        console.warn('Supabase standards delete skipped:', e);
      }
    }
    stopGlobalLoading();
    showToast('تم حذف معيار الضيافة بنجاح', 'info');
  };

  // Services actions
  const addService = async (serviceData: Omit<TourismService, 'id'>) => {
    startGlobalLoading('جاري إضافة وتجهيز الجولة السياحية VIP...');
    const newService: TourismService = {
      ...serviceData,
      id: 'srv-' + Date.now(),
      createdAt: new Date().toISOString(),
    };

    setServices((prev) => [newService, ...prev]);

    const client = getSupabaseClient();
    if (client) {
      try {
        const { error } = await client.from('services').insert({
          id: newService.id,
          title: newService.title,
          english_title: newService.englishTitle,
          description: newService.description,
          price: newService.price,
          currency: newService.currency,
          badge: newService.badge,
          image_url: newService.imageUrl,
          destination: newService.destination,
          features: newService.features,
        });

        if (error) {
          console.error('Supabase insert service error:', error);
          showToast('تنبيه: تعذر إضافة الخدمة السياحية', 'error');
          stopGlobalLoading();
          return;
        }
      } catch (err) {
        console.warn('Supabase sync skipped', err);
      }
    }
    stopGlobalLoading();
    showToast('تمت إضافة الخدمة السياحية بنجاح', 'success');
  };

  const updateService = async (id: string, updates: Partial<TourismService>) => {
    startGlobalLoading('جاري حفظ تعديلات الخدمة...');
    let previousServices: TourismService[] = [];
    setServices((prev) => {
      previousServices = prev;
      return prev.map((s) => (s.id === id ? { ...s, ...updates } : s));
    });

    const client = getSupabaseClient();
    if (client) {
      try {
        const mappedUpdates: Record<string, unknown> = {};
        if (updates.title !== undefined) mappedUpdates.title = updates.title;
        if (updates.englishTitle !== undefined) mappedUpdates.english_title = updates.englishTitle;
        if (updates.description !== undefined) mappedUpdates.description = updates.description;
        if (updates.price !== undefined) mappedUpdates.price = updates.price;
        if (updates.currency !== undefined) mappedUpdates.currency = updates.currency;
        if (updates.badge !== undefined) mappedUpdates.badge = updates.badge;
        if (updates.imageUrl !== undefined) mappedUpdates.image_url = updates.imageUrl;
        if (updates.destination !== undefined) mappedUpdates.destination = updates.destination;
        if (updates.features !== undefined) mappedUpdates.features = updates.features;

        // Perform update and check representation
        const { data: updatedRows, error } = await client
          .from('services')
          .update(mappedUpdates)
          .eq('id', id)
          .select();

        if (error) {
          console.error('Supabase update service error:', error);
          showToast('تنبيه: تعذر حفظ التعديل على الخدمة', 'error');
          setServices(previousServices);
          stopGlobalLoading();
          return;
        }

        // If no rows were matched in Supabase (e.g. was stored locally), fallback to upsert
        if (!updatedRows || updatedRows.length === 0) {
          const currentItem = previousServices.find((s) => s.id === id);
          if (currentItem) {
            const { error: upsertErr } = await client.from('services').upsert({
              id,
              title: updates.title ?? currentItem.title,
              english_title: updates.englishTitle ?? currentItem.englishTitle,
              description: updates.description ?? currentItem.description,
              price: updates.price ?? currentItem.price,
              currency: updates.currency ?? currentItem.currency,
              badge: updates.badge ?? currentItem.badge,
              image_url: updates.imageUrl ?? currentItem.imageUrl,
              destination: updates.destination ?? currentItem.destination,
              features: updates.features ?? currentItem.features,
              created_at: currentItem.createdAt || new Date().toISOString(),
            });

            if (upsertErr) {
              console.error('Supabase upsert service fallback error:', upsertErr);
              showToast('تنبيه: تعذر إتمام حفظ الخدمة', 'error');
              setServices(previousServices);
              stopGlobalLoading();
              return;
            }
          }
        }
      } catch (err) {
        console.warn('Supabase update skipped', err);
      }
    }
    stopGlobalLoading();
    showToast('تم حفظ وتحديث تفاصيل الخدمة بنجاح', 'success');
  };

  const deleteService = async (id: string) => {
    startGlobalLoading('جاري حذف الخدمة...');
    let previousServices: TourismService[] = [];
    let previousReviews: Review[] = [];

    setServices((prev) => {
      previousServices = prev;
      return prev.filter((s) => s.id !== id);
    });
    setReviews((prev) => {
      previousReviews = prev;
      return prev.filter((r) => r.serviceId !== id);
    });

    const client = getSupabaseClient();
    if (client) {
      try {
        // 1. Delete associated reviews first to satisfy foreign key constraints
        await client.from('reviews').delete().eq('service_id', id);

        // 2. Delete service from services table
        const { error } = await client.from('services').delete().eq('id', id);
        if (error) {
          console.error('Supabase delete service error:', error);
          showToast('تنبيه: تعذر حذف الخدمة السياحية', 'error');
          // Rollback state
          setServices(previousServices);
          setReviews(previousReviews);
          stopGlobalLoading();
          return;
        }
      } catch (err) {
        console.warn('Supabase delete skipped', err);
      }
    }
    stopGlobalLoading();
    showToast('تم حذف الخدمة السياحية بنجاح', 'info');
  };

  // Reviews actions
  const addReview = async (
    serviceId: string,
    authorName: string,
    rating: number,
    comment: string,
    location?: string
  ) => {
    startGlobalLoading('جاري إرسال وتوثيق التقييم الملكي...');
    const newReview: Review = {
      id: 'rev-' + Date.now(),
      serviceId,
      authorName: authorName.trim(),
      rating,
      comment: comment.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      location: location?.trim() || 'ضيف كريم',
    };

    setReviews((prev) => [newReview, ...prev]);

    const client = getSupabaseClient();
    if (client) {
      try {
        const { error } = await client.from('reviews').insert({
          id: newReview.id,
          service_id: newReview.serviceId,
          author_name: newReview.authorName,
          location: newReview.location,
          rating: newReview.rating,
          comment: newReview.comment,
          status: 'pending',
        });

        if (error) {
          console.error('Supabase insert review error:', error);
          showToast('تنبيه: تعذر إرسال التقييم في الوقت الحالي', 'error');
        }
      } catch (err) {
        console.warn('Supabase insert review skipped', err);
      }
    }
    stopGlobalLoading();
    showToast('شكراً لك! تم إرسال تقييمك وهو قيد المراجعة الفورية من إدارة الموقع.', 'success', 4500);
  };

  const approveReview = async (id: string) => {
    startGlobalLoading('جاري اعتماد ونشر التقييم...');
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'approved' } : r)));

    const client = getSupabaseClient();
    if (client) {
      try {
        const { error } = await client.from('reviews').update({ status: 'approved' }).eq('id', id);
        if (error) {
          console.error('Supabase approve review error:', error);
          showToast('تنبيه: تعذر اعتماد التقييم', 'error');
        }
      } catch (err) {
        console.warn('Supabase approve review skipped', err);
      }
    }
    stopGlobalLoading();
    showToast('تم اعتماد ونشر التقييم في الواجهة الرئيسية بنجاح', 'success');
  };

  const rejectReview = async (id: string) => {
    startGlobalLoading('جاري تعديل حالة التقييم...');
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r)));

    const client = getSupabaseClient();
    if (client) {
      try {
        const { error } = await client.from('reviews').update({ status: 'rejected' }).eq('id', id);
        if (error) {
          console.error('Supabase reject review error:', error);
          showToast('تنبيه: تعذر تعديل حالة التقييم', 'error');
        }
      } catch (err) {
        console.warn('Supabase reject review skipped', err);
      }
    }
    stopGlobalLoading();
    showToast('تم تغيير حالة التقييم إلى مرفوض', 'info');
  };

  const deleteReview = async (id: string) => {
    startGlobalLoading('جاري حذف التقييم...');
    setReviews((prev) => prev.filter((r) => r.id !== id));

    const client = getSupabaseClient();
    if (client) {
      try {
        const { error } = await client.from('reviews').delete().eq('id', id);
        if (error) {
          console.error('Supabase delete review error:', error);
          showToast('تنبيه: تعذر حذف التقييم', 'error');
        }
      } catch (err) {
        console.warn('Supabase delete review skipped', err);
      }
    }
    stopGlobalLoading();
    showToast('تم حذف التقييم بنجاح', 'info');
  };

  const getApprovedReviews = (serviceId: string): Review[] => {
    return reviews.filter((r) => r.serviceId === serviceId && r.status === 'approved');
  };

  const getServiceRating = (serviceId: string): ServiceRatingSummary => {
    const approved = getApprovedReviews(serviceId);
    if (approved.length === 0) {
      return { average: 5.0, count: 0 };
    }
    const sum = approved.reduce((acc, curr) => acc + curr.rating, 0);
    const avg = Math.round((sum / approved.length) * 10) / 10;
    return { average: avg, count: approved.length };
  };

  const pendingReviewsCount = reviews.filter((r) => r.status === 'pending').length;

  // Social Links actions
  const updateSocialLink = async (id: string, updates: Partial<SocialLink>) => {
    startGlobalLoading('جاري حفظ إعدادات قناة التواصل...');
    setSocialLinks((prev) => prev.map((link) => (link.id === id ? { ...link, ...updates } : link)));

    const client = getSupabaseClient();
    if (client) {
      try {
        const mappedUpdates: Record<string, unknown> = {};
        if (updates.platform !== undefined) mappedUpdates.platform = updates.platform;
        if (updates.label !== undefined) mappedUpdates.label = updates.label;
        if (updates.url !== undefined) mappedUpdates.url = updates.url;
        if (updates.isActive !== undefined) mappedUpdates.is_active = updates.isActive;
        if (updates.description !== undefined) mappedUpdates.description = updates.description;
        if (updates.badge !== undefined) mappedUpdates.badge = updates.badge;
        if (updates.actionText !== undefined) mappedUpdates.action_text = updates.actionText;

        const { error } = await client.from('social_links').update(mappedUpdates).eq('id', id);
        if (error) {
          console.error('Supabase update social link error:', error);
          showToast('تنبيه: تعذر تحديث وسيلة التواصل', 'error');
        }
      } catch (err) {
        console.warn('Supabase update social link skipped', err);
      }
    }
    stopGlobalLoading();
    showToast('تم تحديث وسيلة التواصل بنجاح', 'success');
  };

  const addSocialLink = async (linkData: Omit<SocialLink, 'id'>) => {
    startGlobalLoading('جاري إضافة وسيلة التواصل...');
    const newLink: SocialLink = {
      ...linkData,
      id: 'soc-' + Date.now(),
    };
    setSocialLinks((prev) => [...prev, newLink]);

    const client = getSupabaseClient();
    if (client) {
      try {
        const { error } = await client.from('social_links').insert({
          id: newLink.id,
          platform: newLink.platform,
          label: newLink.label,
          url: newLink.url,
          is_active: newLink.isActive,
          description: newLink.description || null,
          badge: newLink.badge || null,
          action_text: newLink.actionText || null,
        });

        if (error) {
          console.error('Supabase add social link error:', error);
          showToast('تنبيه: تعذر إضافة وسيلة التواصل', 'error');
        }
      } catch (err) {
        console.warn('Supabase add social link skipped', err);
      }
    }
    stopGlobalLoading();
    showToast('تمت إضافة وسيلة التواصل بنجاح', 'success');
  };

  const deleteSocialLink = async (id: string) => {
    startGlobalLoading('جاري إزالة وسيلة التواصل...');
    setSocialLinks((prev) => prev.filter((l) => l.id !== id));

    const client = getSupabaseClient();
    if (client) {
      try {
        const { error } = await client.from('social_links').delete().eq('id', id);
        if (error) {
          console.error('Supabase delete social link error:', error);
          showToast('تنبيه: تعذر إزالة وسيلة التواصل', 'error');
        }
      } catch (err) {
        console.warn('Supabase delete social link skipped', err);
      }
    }
    stopGlobalLoading();
    showToast('تمت إزالة وسيلة التواصل بنجاح', 'info');
  };

  const primaryWhatsAppNumber = (() => {
    if (siteSettings.contactWhatsAppNumber) {
      const match = siteSettings.contactWhatsAppNumber.match(/\d{9,15}/);
      if (match) return match[0];
    }
    const wa = socialLinks.find((l) => l.platform === 'whatsapp' && l.isActive);
    if (wa && wa.url) {
      const match = wa.url.match(/\d{9,15}/);
      if (match) return match[0];
    }
    return '905380000000';
  })();

  const managerEmail = adminUser.email || 'admin@eliteturkey.com';

  const getStoredAdminPassword = (): string => {
    return safeStorage.getItem('ELITE_TURKEY_ADMIN_PASSWORD') || 'Admin@2025';
  };

  // Dynamic Admin Auth Actions: Dynamically queries admin_users table in Supabase
  const loginAdmin = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanEmail || !cleanPass) {
      showToast('يرجى إدخال البريد الإلكتروني وكلمة المرور', 'error');
      return { success: false, error: 'يرجى إدخال البريد الإلكتروني وكلمة المرور' };
    }

    startGlobalLoading('جاري التحقق من بيانات الدخول...');

    const client = getSupabaseClient();
    if (client) {
      // 1. Primary check: Query admin_users table in Supabase dynamically
      try {
        const { data: dbAdmin, error: dbErr } = await client
          .from('admin_users')
          .select('*')
          .eq('email', cleanEmail)
          .maybeSingle();

        if (!dbErr && dbAdmin) {
          if (dbAdmin.password === cleanPass || dbAdmin.password_hash === cleanPass) {
            setAdminUser({ email: dbAdmin.email, isAuthenticated: true, isDemo: false });
            stopGlobalLoading();
            showToast('أهلاً بك! تم تسجيل الدخول بنجاح إلى لوحة الإدارة', 'success');
            return { success: true };
          } else {
            stopGlobalLoading();
            showToast('كلمة المرور غير صحيحة لحساب المدير', 'error');
            return { success: false, error: 'كلمة المرور غير صحيحة لحساب المدير' };
          }
        }
      } catch (e) {
        console.warn('Supabase admin_users query failed:', e);
      }

      // 2. Secondary check: Supabase Auth (auth.users)
      try {
        const { data, error } = await client.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPass,
        });
        if (!error && data?.user) {
          setAdminUser({ email: data.user.email || cleanEmail, isAuthenticated: true, isDemo: false });
          stopGlobalLoading();
          showToast('أهلاً بك! تم تسجيل الدخول بنجاح عبر نظام المصادقة', 'success');
          return { success: true };
        }
      } catch (e) {
        console.warn('Supabase auth check:', e);
      }
    }

    // 3. Fallback for local offline mode if Supabase is disconnected
    const storedPass = getStoredAdminPassword();
    const fallbackEmails = ['3lishops@gmail.com', 'admin@eliteturkey.com'];
    if (!isSupabaseConnected && fallbackEmails.includes(cleanEmail) && (cleanPass === storedPass || cleanPass === 'admin123456')) {
      setAdminUser({ email: cleanEmail, isAuthenticated: true, isDemo: false });
      stopGlobalLoading();
      showToast('تم تسجيل الدخول في الوضع المحلي (Offline Mode)', 'info');
      return { success: true };
    }

    stopGlobalLoading();
    showToast('البريد الإلكتروني أو كلمة المرور غير صحيحة', 'error');
    return { 
      success: false, 
      error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' 
    };
  };

  const updateAdminPassword = async (oldPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (!newPassword || newPassword.trim().length < 6) {
      showToast('يجب أن تتكون كلمة المرور الجديدة من 6 أحرف على الأقل', 'error');
      return { success: false, error: 'يجب أن تتكون كلمة المرور الجديدة من 6 أحرف على الأقل' };
    }

    startGlobalLoading('جاري تحديث كلمة المرور...');
    const client = getSupabaseClient();
    if (client && adminUser.email) {
      try {
        await client
          .from('admin_users')
          .update({ password: newPassword.trim() })
          .eq('email', adminUser.email.trim().toLowerCase());
      } catch (e) {
        console.warn('Failed to sync new password to Supabase admin_users:', e);
      }
    }

    safeStorage.setItem('ELITE_TURKEY_ADMIN_PASSWORD', newPassword.trim());
    stopGlobalLoading();
    showToast('تم تحديث كلمة المرور لحساب المدير بنجاح', 'success');
    return { success: true };
  };

  const logoutAdmin = () => {
    setAdminUser({ email: '', isAuthenticated: false, isDemo: false });
    const client = getSupabaseClient();
    if (client) {
      client.auth.signOut().catch(() => {});
    }
    showToast('تم تسجيل الخروج بنجاح من حساب المدير', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        navigateTo,
        siteSettings,
        updateSiteSettings,
        standards,
        addStandard,
        updateStandard,
        deleteStandard,
        services,
        addService,
        updateService,
        deleteService,
        reviews,
        addReview,
        approveReview,
        rejectReview,
        deleteReview,
        getApprovedReviews,
        getServiceRating,
        pendingReviewsCount,
        socialLinks,
        updateSocialLink,
        addSocialLink,
        deleteSocialLink,
        primaryWhatsAppNumber,
        adminUser,
        loginAdmin,
        logoutAdmin,
        updateAdminPassword,
        managerEmail,
        isSupabaseConnected,
        theme,
        toggleTheme,
        toasts,
        showToast,
        removeToast,
        isGlobalLoading,
        globalLoadingText,
        startGlobalLoading,
        stopGlobalLoading,
        isInitialDataLoading,
        loadingStageText,
        loadingProgressPercent,
        refreshDatabaseData,
      }}
    >
      {children}

      {/* Global Luxury Laser Progress Bar & Loading Badge */}
      <GlobalLoadingIndicator
        isLoading={isGlobalLoading}
        loadingText={globalLoadingText}
        theme={theme}
      />

      {/* Real-Time Toast Notifications Container */}
      <ToastNotificationContainer
        toasts={toasts}
        removeToast={removeToast}
        theme={theme}
      />
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
