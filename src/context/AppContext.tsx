import React, { createContext, useContext, useState, useEffect } from 'react';
import { TourismService, Review, SocialLink, AdminUser, SiteSettings, HospitalityStandard, ThemeMode } from '../types';
import { INITIAL_SERVICES, INITIAL_REVIEWS, INITIAL_SOCIAL_LINKS, INITIAL_SITE_SETTINGS, INITIAL_STANDARDS } from '../data/initialData';
import { getSupabaseClient, resetSupabaseClient } from '../lib/supabase';

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
  const [globalLoadingText, setGlobalLoadingText] = useState<string>('جاري معالجة البيانات سحابياً...');

  const startGlobalLoading = (text = 'جاري المعالجة والمزامنة سحابياً...') => {
    setGlobalLoadingText(text);
    setIsGlobalLoading(true);
  };

  const stopGlobalLoading = () => {
    setIsGlobalLoading(false);
  };

  // Royal Theme Mode: 'dark' (Deep Royal Obsidian) | 'light' (Royal Pearl / Ivory & Gold)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('ELITE_TURKEY_THEME') as ThemeMode;
      if (cached === 'light' || cached === 'dark') return cached;
    }
    return 'dark';
  });

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      if (typeof window !== 'undefined') {
        localStorage.setItem('ELITE_TURKEY_THEME', next);
      }
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
      const cached = localStorage.getItem('ELITE_TURKEY_SETTINGS');
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
      const cached = localStorage.getItem('ELITE_TURKEY_STANDARDS');
      if (cached) return JSON.parse(cached);
    } catch (e) {
      console.warn('Failed to parse cached standards:', e);
    }
    return INITIAL_STANDARDS;
  });

  // Services
  const [services, setServices] = useState<TourismService[]>(() => {
    try {
      const cached = localStorage.getItem('ELITE_TURKEY_SERVICES');
      if (cached) return JSON.parse(cached);
    } catch (e) {
      console.warn('Failed to parse cached services:', e);
    }
    return INITIAL_SERVICES;
  });

  // Reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const cached = localStorage.getItem('ELITE_TURKEY_REVIEWS');
      if (cached) return JSON.parse(cached);
    } catch (e) {
      console.warn('Failed to parse cached reviews:', e);
    }
    return INITIAL_REVIEWS;
  });

  // Social Links
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(() => {
    try {
      const cached = localStorage.getItem('ELITE_TURKEY_SOCIALS');
      if (cached) return JSON.parse(cached);
    } catch (e) {
      console.warn('Failed to parse cached social links:', e);
    }
    return INITIAL_SOCIAL_LINKS;
  });

  // Admin user
  const [adminUser, setAdminUser] = useState<AdminUser>(() => {
    try {
      const cached = localStorage.getItem('ELITE_TURKEY_ADMIN');
      if (cached) return JSON.parse(cached);
    } catch (e) {
      console.warn('Failed to parse cached admin user:', e);
    }
    return { email: '', isAuthenticated: false, isDemo: false };
  });

  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(true);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('ELITE_TURKEY_SETTINGS', JSON.stringify(siteSettings));
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem('ELITE_TURKEY_STANDARDS', JSON.stringify(standards));
  }, [standards]);

  useEffect(() => {
    localStorage.setItem('ELITE_TURKEY_SERVICES', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('ELITE_TURKEY_REVIEWS', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('ELITE_TURKEY_SOCIALS', JSON.stringify(socialLinks));
  }, [socialLinks]);

  useEffect(() => {
    localStorage.setItem('ELITE_TURKEY_ADMIN', JSON.stringify(adminUser));
  }, [adminUser]);

  // Initial Supabase Sync & Auto-Seed
  useEffect(() => {
    const syncSupabase = async () => {
      const client = getSupabaseClient();
      if (!client) {
        setIsSupabaseConnected(false);
        return;
      }

      try {
        // 1. Check services
        const { data: srvData, error: srvErr } = await client.from('services').select('*');
        if (!srvErr) {
          setIsSupabaseConnected(true);
          if (srvData && srvData.length > 0) {
            // Map db snake_case to camelCase
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
          } else {
            // Seed initial services to Supabase so it has full data
            for (const s of INITIAL_SERVICES) {
              await client.from('services').insert({
                id: s.id,
                title: s.title,
                english_title: s.englishTitle,
                description: s.description,
                price: s.price,
                currency: s.currency,
                badge: s.badge,
                image_url: s.imageUrl,
                destination: s.destination,
                features: s.features,
              });
            }
          }
        }

        // 2. Check reviews
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
        } else if (!revErr && (!revData || revData.length === 0)) {
          // Seed reviews
          for (const r of INITIAL_REVIEWS) {
            await client.from('reviews').insert({
              id: r.id,
              service_id: r.serviceId,
              author_name: r.authorName,
              location: r.location,
              rating: r.rating,
              comment: r.comment,
              status: r.status,
            });
          }
        }

        // 3. Check social links
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
        } else if (!socErr && (!socData || socData.length === 0)) {
          for (const l of INITIAL_SOCIAL_LINKS) {
            await client.from('social_links').insert({
              id: l.id,
              platform: l.platform,
              label: l.label,
              url: l.url,
              is_active: l.isActive,
            });
          }
        }
        // 4. Check & verify cached admin user status against Supabase admin_users table
        if (adminUser.isAuthenticated && adminUser.email) {
          const { data: adminCheck, error: adminErr } = await client
            .from('admin_users')
            .select('email')
            .eq('email', adminUser.email.trim().toLowerCase())
            .maybeSingle();

          if (!adminErr && !adminCheck) {
            // Admin email was deleted or changed in Supabase database!
            // Invalidate local cached admin session so user is forced to re-login with active Supabase credentials.
            console.info('Admin user email no longer exists in Supabase database. Logging out cached session.');
            setAdminUser({ email: '', isAuthenticated: false, isDemo: false });
            localStorage.removeItem('ELITE_TURKEY_ADMIN');
          }
        }
      } catch (err) {
        console.warn('Initial Supabase sync check:', err);
      }
    };

    syncSupabase();
  }, [adminUser.isAuthenticated, adminUser.email]);

  // Update Site Settings
  const updateSiteSettings = async (updates: Partial<SiteSettings>) => {
    startGlobalLoading('جاري حفظ وتطبيق إعدادات الموقع...');
    setSiteSettings((prev) => ({ ...prev, ...updates }));

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('site_settings').upsert({
          id: 'primary',
          name_ar: updates.nameAr || siteSettings.nameAr,
          name_en: updates.nameEn || siteSettings.nameEn,
          slogan_ar: updates.sloganAr || siteSettings.sloganAr,
          logo_type: updates.logoType || siteSettings.logoType,
          logo_icon: updates.logoIcon || siteSettings.logoIcon,
          logo_image_url: updates.logoImageUrl || siteSettings.logoImageUrl,
          tursab_license: updates.tursabLicense || siteSettings.tursabLicense,
          headquarters: updates.headquarters || siteSettings.headquarters,
          updated_at: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('Supabase site_settings upsert skipped:', e);
      }
    }
    stopGlobalLoading();
    showToast('تم حفظ وتحديث إعدادات هوية وواجهة الموقع بنجاح', 'success');
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
        await client.from('hospitality_standards').insert({
          id: newStd.id,
          title: newStd.title,
          description: newStd.description,
          icon: newStd.icon,
        });
      } catch (e) {
        console.warn('Supabase standards insert skipped:', e);
      }
    }
    stopGlobalLoading();
    showToast('تمت إضافة معيار الضيافة الملكية الجديد بنجاح', 'success');
  };

  const updateStandard = async (id: string, updates: Partial<HospitalityStandard>) => {
    startGlobalLoading('جاري تحديث بيانات معيار الضيافة...');
    setStandards((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('hospitality_standards').update(updates).eq('id', id);
      } catch (e) {
        console.warn('Supabase standards update skipped:', e);
      }
    }
    stopGlobalLoading();
    showToast('تم تحديث بيانات المعيار بنجاح', 'success');
  };

  const deleteStandard = async (id: string) => {
    startGlobalLoading('جاري إزالة المعيار...');
    setStandards((prev) => prev.filter((s) => s.id !== id));

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('hospitality_standards').delete().eq('id', id);
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
        await client.from('services').insert({
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
      } catch (err) {
        console.warn('Supabase sync skipped', err);
      }
    }
    stopGlobalLoading();
    showToast('تمت إضافة الخدمة السياحية الفاخرة بنجاح إلى القائمة', 'success');
  };

  const updateService = async (id: string, updates: Partial<TourismService>) => {
    startGlobalLoading('جاري حفظ تعديلات الخدمة...');
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));

    const client = getSupabaseClient();
    if (client) {
      try {
        const mappedUpdates: Record<string, unknown> = {};
        if (updates.title) mappedUpdates.title = updates.title;
        if (updates.englishTitle) mappedUpdates.english_title = updates.englishTitle;
        if (updates.description) mappedUpdates.description = updates.description;
        if (updates.price) mappedUpdates.price = updates.price;
        if (updates.currency) mappedUpdates.currency = updates.currency;
        if (updates.badge) mappedUpdates.badge = updates.badge;
        if (updates.imageUrl) mappedUpdates.image_url = updates.imageUrl;
        if (updates.destination) mappedUpdates.destination = updates.destination;
        if (updates.features) mappedUpdates.features = updates.features;

        await client.from('services').update(mappedUpdates).eq('id', id);
      } catch (err) {
        console.warn('Supabase update skipped', err);
      }
    }
    stopGlobalLoading();
    showToast('تم تحديث تفاصيل الخدمة السياحية بنجاح', 'success');
  };

  const deleteService = async (id: string) => {
    startGlobalLoading('جاري حذف الخدمة...');
    setServices((prev) => prev.filter((s) => s.id !== id));
    setReviews((prev) => prev.filter((r) => r.serviceId !== id));

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('services').delete().eq('id', id);
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
        await client.from('reviews').insert({
          id: newReview.id,
          service_id: newReview.serviceId,
          author_name: newReview.authorName,
          location: newReview.location,
          rating: newReview.rating,
          comment: newReview.comment,
          status: 'pending',
        });
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
        await client.from('reviews').update({ status: 'approved' }).eq('id', id);
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
        await client.from('reviews').update({ status: 'rejected' }).eq('id', id);
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
        await client.from('reviews').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete review skipped', err);
      }
    }
    stopGlobalLoading();
    showToast('تم حذف التقييم نهائياً بنجاح', 'info');
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
        await client.from('social_links').update(updates).eq('id', id);
      } catch (err) {
        console.warn('Supabase update social link skipped', err);
      }
    }
    stopGlobalLoading();
    showToast('تم تحديث تفاصيل قناة التواصل بنجاح', 'success');
  };

  const addSocialLink = async (linkData: Omit<SocialLink, 'id'>) => {
    startGlobalLoading('جاري إضافة قناة التواصُل...');
    const newLink: SocialLink = {
      ...linkData,
      id: 'soc-' + Date.now(),
    };
    setSocialLinks((prev) => [...prev, newLink]);

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('social_links').insert(newLink);
      } catch (err) {
        console.warn('Supabase add social link skipped', err);
      }
    }
    stopGlobalLoading();
    showToast('تمت إضافة قناة التواصل الجديدة بنجاح', 'success');
  };

  const deleteSocialLink = async (id: string) => {
    startGlobalLoading('جاري إزالة القناة...');
    setSocialLinks((prev) => prev.filter((l) => l.id !== id));

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('social_links').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete social link skipped', err);
      }
    }
    stopGlobalLoading();
    showToast('تمت إزالة قناة التواصل بنجاح', 'info');
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
    return localStorage.getItem('ELITE_TURKEY_ADMIN_PASSWORD') || 'Admin@2025';
  };

  // Dynamic Admin Auth Actions: Dynamically queries admin_users table in Supabase
  const loginAdmin = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanEmail || !cleanPass) {
      showToast('يرجى إدخال البريد الإلكتروني وكلمة المرور', 'error');
      return { success: false, error: 'يرجى إدخال البريد الإلكتروني وكلمة المرور' };
    }

    startGlobalLoading('جاري التحقق من بيانات الدخول مع قاعدة البيانات الملكية...');

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
            showToast('أهلاً بك! تم تسجيل الدخول بنجاح إلى لوحة التحكم الملكية', 'success');
            return { success: true };
          } else {
            stopGlobalLoading();
            showToast('كلمة المرور غير صحيحة لحساب المدير', 'error');
            return { success: false, error: 'كلمة المرور غير صحيحة لحساب المدير في قاعدة البيانات' };
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
      error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى التأكد من تسجيل الحساب في جدول admin_users في Supabase.' 
    };
  };

  const updateAdminPassword = async (oldPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (!newPassword || newPassword.trim().length < 6) {
      showToast('يجب أن تتكون كلمة المرور الجديدة من 6 أحرف على الأقل', 'error');
      return { success: false, error: 'يجب أن تتكون كلمة المرور الجديدة من 6 أحرف على الأقل' };
    }

    startGlobalLoading('جاري تحديث كلمة المرور سحابياً...');
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

    localStorage.setItem('ELITE_TURKEY_ADMIN_PASSWORD', newPassword.trim());
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
