import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  ExternalLink, 
  LogOut, 
  Star, 
  Layers, 
  MessageSquare, 
  Share2, 
  MapPin, 
  Save, 
  MessageCircle, 
  Eye, 
  Award, 
  Palette, 
  Plane, 
  Car, 
  Headphones, 
  Shield, 
  Clock, 
  Heart,
  Gem,
  Compass,
  Crown,
  Sliders,
  ShieldCheck,
  Phone,
  Image as ImageIcon,
  Lock,
  Key,
  CheckCircle2,
  Globe,
  RotateCw
} from 'lucide-react';
import { TourismService, HospitalityStandard, SocialPlatform, SiteSettings } from '../../types';
import { useApp } from '../../context/AppContext';
import { SiteLogo } from '../SiteLogo';
import { ImageUploader } from '../ImageUploader';

// معالم تركيا الفاخرة المعتمدة للواجهة الرئيسية
const TURKEY_HERO_PRESETS = [
  {
    id: 'istanbul-sunset',
    title: 'إسطنبول ومضيق البوسفور',
    subtitle: 'غروب ذهبي ساحر وبرج الفتاة مع قوارب البوسفور',
    url: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1920&q=85',
  },
  {
    id: 'galata-golden-horn',
    title: 'برج غلاطة والقرن الذهبي',
    subtitle: 'بانوراما إسطنبول التاريخية وسحر أفق المدينة عند المغيب',
    url: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1920&q=85',
  },
  {
    id: 'ortakoy-bosphorus',
    title: 'جامع أورتاكوي وجسر البوسفور',
    subtitle: 'إطلالة معمارية عثمانية ملكية وجسر البوسفور المضاء',
    url: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1920&q=85',
  },
  {
    id: 'trabzon-nature',
    title: 'مرتفعات طرابزون وأوزنجول',
    subtitle: 'طبيعة خضراء ساحرة وجبال وضباب الشمال التركي',
    url: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=1920&q=85',
  },
  {
    id: 'hagia-sophia-grand',
    title: 'آيا صوفيا وميدان السلطان أحمد',
    subtitle: 'عراقة الإمبراطوريات العثمانية التاريخية وأضواء المآذن المهيبة',
    url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1920&q=85',
  },
  {
    id: 'oludeniz-blue-lagoon',
    title: 'ساحل أولودينيز والبحيرة الزرقاء',
    subtitle: 'المياه التركوازية البلورية وسحر الريفييرا التركية الفاخرة',
    url: 'https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?auto=format&fit=crop&w=1920&q=85',
  },
];

export const AdminDashboard: React.FC = () => {
  const {
    services,
    addService,
    updateService,
    deleteService,
    reviews,
    approveReview,
    rejectReview,
    deleteReview,
    pendingReviewsCount,
    socialLinks,
    updateSocialLink,
    addSocialLink,
    deleteSocialLink,
    standards,
    addStandard,
    updateStandard,
    deleteStandard,
    siteSettings,
    updateSiteSettings,
    logoutAdmin,
    updateAdminPassword,
    managerEmail,
    primaryWhatsAppNumber,
    navigateTo,
    adminUser,
    isSupabaseConnected,
    refreshDatabaseData,
  } = useApp();

  const [isAdminRefreshing, setIsAdminRefreshing] = useState(false);

  const handleAdminSync = async () => {
    setIsAdminRefreshing(true);
    try {
      await refreshDatabaseData();
    } finally {
      setIsAdminRefreshing(false);
    }
  };

  // Active Tab: services | reviews | standards | socials | branding | hero
  const [activeTab, setActiveTab] = useState<'services' | 'reviews' | 'standards' | 'socials' | 'branding' | 'hero'>('services');
  const [deletingServiceId, setDeletingServiceId] = useState<string | null>(null);

  // Reviews filter
  const [reviewFilter, setReviewFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  // Service Edit / Create Modal state
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceFormData, setServiceFormData] = useState({
    title: '',
    englishTitle: '',
    description: '',
    price: 500,
    currency: 'USD',
    badge: 'VIP',
    imageUrl: '',
    destination: 'إسطنبول',
    featuresString: '',
  });

  // Standards Edit / Create Modal state
  const [isStandardModalOpen, setIsStandardModalOpen] = useState(false);
  const [editingStandardId, setEditingStandardId] = useState<string | null>(null);
  const [standardFormData, setStandardFormData] = useState({
    title: '',
    description: '',
    icon: 'award' as HospitalityStandard['icon'],
  });

  // Branding & Hero Form State
  const [brandingForm, setBrandingForm] = useState({
    nameAr: siteSettings.nameAr || 'عبد الله في تركيا',
    nameEn: siteSettings.nameEn || 'Abdullah in Turkey',
    sloganAr: siteSettings.sloganAr || 'للخدمات السياحية والعقارية في تركيا',
    logoType: siteSettings.logoType || 'icon',
    logoIcon: siteSettings.logoIcon || 'crown',
    logoImageUrl: siteSettings.logoImageUrl || '',
    tursabLicense: siteSettings.tursabLicense || 'TÜRSAB - 14920 (فئة أ)',
    headquarters: siteSettings.headquarters || 'Istanbul, Turkey',
    heroBackgroundImage: siteSettings.heroBackgroundImage || 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1920&q=85',
    heroBackgroundOpacity: siteSettings.heroBackgroundOpacity ?? 0.38,
    heroBadgeText: siteSettings.heroBadgeText || 'للخدمات السياحية والعقارية في تركيا',
    heroBadgeVisible: siteSettings.heroBadgeVisible !== false,
    heroHeadline: siteSettings.heroHeadline || 'بساعدك في الخدمات السياحية والعقارية في تركيا',
    heroSubtitle: siteSettings.heroSubtitle || 'المهندس عبدالله - بساعدك في كل ما يخص الخدمات السياحية والعقارية، من حجز الفنادق وتنظيم الرحلات والبرامج السياحية، لحد مساعدتك في اختيار العقار المناسب والاستثمار في تركيا',
    heroPrimaryCtaText: siteSettings.heroPrimaryCtaText || 'تواصل معي عبر الواتساب',
    heroPrimaryCtaCustomUrl: siteSettings.heroPrimaryCtaCustomUrl || '',
    heroPrimaryCtaVisible: siteSettings.heroPrimaryCtaVisible !== false,
    heroSecondaryCtaText: siteSettings.heroSecondaryCtaText || 'استكشف باقات وخدمات VIP',
    heroSecondaryCtaLink: siteSettings.heroSecondaryCtaLink || '#services',
    heroSecondaryCtaVisible: siteSettings.heroSecondaryCtaVisible !== false,
    heroTrustText1: siteSettings.heroTrustText1 || 'TÜRSAB - 14920 (فئة أ)',
    heroTrustText2: siteSettings.heroTrustText2 || 'Istanbul',
    heroTrustText3: siteSettings.heroTrustText3 || 'متاح 24/7',
    heroTrustBarVisible: siteSettings.heroTrustBarVisible !== false,
  });
  const [brandingSaved, setBrandingSaved] = useState(false);

  // Sync brandingForm when siteSettings updates
  useEffect(() => {
    setBrandingForm({
      nameAr: siteSettings.nameAr || 'عبد الله في تركيا',
      nameEn: siteSettings.nameEn || 'Abdullah in Turkey',
      sloganAr: siteSettings.sloganAr || 'للخدمات السياحية والعقارية في تركيا',
      logoType: siteSettings.logoType || 'icon',
      logoIcon: siteSettings.logoIcon || 'crown',
      logoImageUrl: siteSettings.logoImageUrl || '',
      tursabLicense: siteSettings.tursabLicense || 'TÜRSAB - 14920 (فئة أ)',
      headquarters: siteSettings.headquarters || 'Istanbul, Turkey',
      heroBackgroundImage: siteSettings.heroBackgroundImage || 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1920&q=85',
      heroBackgroundOpacity: siteSettings.heroBackgroundOpacity ?? 0.38,
      heroBadgeText: siteSettings.heroBadgeText || 'للخدمات السياحية والعقارية في تركيا',
      heroBadgeVisible: siteSettings.heroBadgeVisible !== false,
      heroHeadline: siteSettings.heroHeadline || 'بساعدك في الخدمات السياحية والعقارية في تركيا',
      heroSubtitle: siteSettings.heroSubtitle || 'المهندس عبدالله - بساعدك في كل ما يخص الخدمات السياحية والعقارية، من حجز الفنادق وتنظيم الرحلات والبرامج السياحية، لحد مساعدتك في اختيار العقار المناسب والاستثمار في تركيا',
      heroPrimaryCtaText: siteSettings.heroPrimaryCtaText || 'تواصل معي عبر الواتساب',
      heroPrimaryCtaCustomUrl: siteSettings.heroPrimaryCtaCustomUrl || '',
      heroPrimaryCtaVisible: siteSettings.heroPrimaryCtaVisible !== false,
      heroSecondaryCtaText: siteSettings.heroSecondaryCtaText || 'استكشف باقات وخدمات VIP',
      heroSecondaryCtaLink: siteSettings.heroSecondaryCtaLink || '#services',
      heroSecondaryCtaVisible: siteSettings.heroSecondaryCtaVisible !== false,
      heroTrustText1: siteSettings.heroTrustText1 || 'TÜRSAB - 14920 (فئة أ)',
      heroTrustText2: siteSettings.heroTrustText2 || 'Istanbul',
      heroTrustText3: siteSettings.heroTrustText3 || 'متاح 24/7',
      heroTrustBarVisible: siteSettings.heroTrustBarVisible !== false,
    });
  }, [siteSettings]);

  // Contact Container Customization State (All Elements)
  const [contactForm, setContactForm] = useState({
    contactBadgeText: siteSettings.contactBadgeText || 'قنوات التواصل الرسمية الخاصة بنا',
    contactBadgeVisible: siteSettings.contactBadgeVisible !== false,
    contactTitle: siteSettings.contactTitle || 'تواصل مباشر مع مستشارك السياحي 24/7',
    contactSubtitle: siteSettings.contactSubtitle || 'اختر القناة المفضلة لديك وسيقوم فريق الكونسيرج بمتابعة كافة متطلبات رحلتك وتجهيز برنامجك الفاخر بدقة متناهية.',
    contactWhatsAppVisible: siteSettings.contactWhatsAppVisible !== false,
    contactWhatsAppTitle: siteSettings.contactWhatsAppTitle || 'واتساب تواصل مباشر',
    contactWhatsAppBadge: siteSettings.contactWhatsAppBadge || 'متواجد الآن',
    contactWhatsAppDescription: siteSettings.contactWhatsAppDescription || 'حجوزات الفنادق، الأكواخ، الجولات السياحية، وشراء العقارات في تركيا.',
    contactWhatsAppButtonText: siteSettings.contactWhatsAppButtonText || 'بدء المحادثة الفورية',
    contactWhatsAppNumber: siteSettings.contactWhatsAppNumber || primaryWhatsAppNumber || '905380000000',
    contactWhatsAppDefaultMessage: siteSettings.contactWhatsAppDefaultMessage || 'مرحباً، أود التواصل معكم من أجل الخدمات في تركيا.',
    contactTrustBarVisible: siteSettings.contactTrustBarVisible !== false,
    contactLicenseText: siteSettings.contactLicenseText || siteSettings.tursabLicense || 'TÜRSAB - 14920 (فئة أ)',
    contactSupportHours: siteSettings.contactSupportHours || 'خدمة عملاء وكونسيرج 24/7',
    contactHeadquartersText: siteSettings.contactHeadquartersText || siteSettings.headquarters || 'Istanbul, Turkey',
  });
  const [contactSaved, setContactSaved] = useState(false);

  useEffect(() => {
    setContactForm({
      contactBadgeText: siteSettings.contactBadgeText || 'قنوات التواصل الرسمية الخاصة بنا',
      contactBadgeVisible: siteSettings.contactBadgeVisible !== false,
      contactTitle: siteSettings.contactTitle || 'تواصل مباشر مع مستشارك السياحي 24/7',
      contactSubtitle: siteSettings.contactSubtitle || 'اختر القناة المفضلة لديك وسيقوم فريق الكونسيرج بمتابعة كافة متطلبات رحلتك وتجهيز برنامجك الفاخر بدقة متناهية.',
      contactWhatsAppVisible: siteSettings.contactWhatsAppVisible !== false,
      contactWhatsAppTitle: siteSettings.contactWhatsAppTitle || 'واتساب تواصل مباشر',
      contactWhatsAppBadge: siteSettings.contactWhatsAppBadge || 'متواجد الآن',
      contactWhatsAppDescription: siteSettings.contactWhatsAppDescription || 'حجوزات الفنادق، الأكواخ، الجولات السياحية، وشراء العقارات في تركيا.',
      contactWhatsAppButtonText: siteSettings.contactWhatsAppButtonText || 'بدء المحادثة الفورية',
      contactWhatsAppNumber: siteSettings.contactWhatsAppNumber || primaryWhatsAppNumber || '905380000000',
      contactWhatsAppDefaultMessage: siteSettings.contactWhatsAppDefaultMessage || 'مرحباً، أود التواصل معكم من أجل الخدمات في تركيا.',
      contactTrustBarVisible: siteSettings.contactTrustBarVisible !== false,
      contactLicenseText: siteSettings.contactLicenseText || siteSettings.tursabLicense || 'TÜRSAB - 14920 (فئة أ)',
      contactSupportHours: siteSettings.contactSupportHours || 'خدمة عملاء وكونسيرج 24/7',
      contactHeadquartersText: siteSettings.contactHeadquartersText || siteSettings.headquarters || 'Istanbul, Turkey',
    });
  }, [siteSettings, primaryWhatsAppNumber]);

  // New Social Link State (Full Rich Fields)
  const [newPlatform, setNewPlatform] = useState<SocialPlatform>('instagram');
  const [newSocialLabel, setNewSocialLabel] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');
  const [newSocialDescription, setNewSocialDescription] = useState('');
  const [newSocialBadge, setNewSocialBadge] = useState('OFFICIAL');
  const [newSocialActionText, setNewSocialActionText] = useState('زيارة القناة الرسمية');
  const [isAddingSocial, setIsAddingSocial] = useState(false);

  // Security Manager Password State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');

  // Editing existing social link state
  const [editingSocialId, setEditingSocialId] = useState<string | null>(null);

  // Contact sub-section filter tab
  const [contactSubTab, setContactSubTab] = useState<'all' | 'header' | 'whatsapp' | 'channels' | 'trust' | 'security'>('all');

  // Services Modal Handlers
  const handleOpenAddService = () => {
    setEditingServiceId(null);
    setServiceFormData({
      title: '',
      englishTitle: '',
      description: '',
      price: 500,
      currency: 'USD',
      badge: 'VIP',
      imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80',
      destination: 'إسطنبول',
      featuresString: 'يخت خاص 75 قدماً\nشيف تركي خاص\nاستقبال مرسيدس مايباخ VIP',
    });
    setIsServiceModalOpen(true);
  };

  const handleOpenEditService = (service: TourismService) => {
    setEditingServiceId(service.id);
    setServiceFormData({
      title: service.title,
      englishTitle: service.englishTitle || '',
      description: service.description,
      price: service.price,
      currency: service.currency,
      badge: service.badge,
      imageUrl: service.imageUrl,
      destination: service.destination,
      featuresString: (service.features || []).join('\n'),
    });
    setIsServiceModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    const features = serviceFormData.featuresString
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    if (editingServiceId) {
      await updateService(editingServiceId, {
        title: serviceFormData.title,
        englishTitle: serviceFormData.englishTitle,
        description: serviceFormData.description,
        price: Number(serviceFormData.price),
        currency: serviceFormData.currency,
        badge: serviceFormData.badge,
        imageUrl: serviceFormData.imageUrl,
        destination: serviceFormData.destination,
        features,
      });
    } else {
      await addService({
        title: serviceFormData.title,
        englishTitle: serviceFormData.englishTitle,
        description: serviceFormData.description,
        price: Number(serviceFormData.price),
        currency: serviceFormData.currency,
        badge: serviceFormData.badge,
        imageUrl: serviceFormData.imageUrl,
        destination: serviceFormData.destination,
        features,
      });
    }
    setIsServiceModalOpen(false);
  };

  // Standards Modal Handlers
  const handleOpenAddStandard = () => {
    setEditingStandardId(null);
    setStandardFormData({
      title: '',
      description: '',
      icon: 'award',
    });
    setIsStandardModalOpen(true);
  };

  const handleOpenEditStandard = (std: HospitalityStandard) => {
    setEditingStandardId(std.id);
    setStandardFormData({
      title: std.title,
      description: std.description,
      icon: std.icon,
    });
    setIsStandardModalOpen(true);
  };

  const handleSaveStandard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!standardFormData.title || !standardFormData.description) return;

    if (editingStandardId) {
      await updateStandard(editingStandardId, standardFormData);
    } else {
      await addStandard(standardFormData);
    }
    setIsStandardModalOpen(false);
  };

  // Branding Save Handler
  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSiteSettings(brandingForm);
    setBrandingSaved(true);
    setTimeout(() => setBrandingSaved(false), 3000);
  };

  // Contact Section Save Handler
  const handleSaveContactSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await updateSiteSettings(contactForm);
    setContactSaved(true);
    setTimeout(() => setContactSaved(false), 3000);
  };

  const handleAddSocialLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSocialLabel || !newSocialUrl) return;
    await addSocialLink({
      platform: newPlatform,
      label: newSocialLabel,
      url: newSocialUrl,
      description: newSocialDescription || undefined,
      badge: newSocialBadge || 'OFFICIAL',
      actionText: newSocialActionText || 'زيارة القناة الرسمية',
      isActive: true,
    });
    setNewSocialLabel('');
    setNewSocialUrl('');
    setNewSocialDescription('');
    setNewSocialBadge('OFFICIAL');
    setNewSocialActionText('زيارة القناة الرسمية');
    setIsAddingSocial(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeSuccess('');
    setPasswordChangeError('');
    if (!newPassword || newPassword.length < 6) {
      setPasswordChangeError('يجب أن تتكون كلمة المرور الجديدة من 6 أحرف على الأقل');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordChangeError('كلمتا المرور الجديدة غير متطابقتين');
      return;
    }
    const res = await updateAdminPassword(oldPassword, newPassword);
    if (!res.success) {
      setPasswordChangeError(res.error || 'فشل تغيير كلمة المرور');
    } else {
      setPasswordChangeSuccess('تم تحديث كلمة مرور المدير بنجاح.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordChangeSuccess(''), 5000);
    }
  };

  // Filtered reviews
  const filteredReviews = reviews.filter((r) => {
    if (reviewFilter === 'all') return true;
    return r.status === reviewFilter;
  });

  return (
    <div className="min-h-screen bg-[#060A16] text-slate-100 text-right pb-24">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 border-b border-amber-400/20 bg-slate-950/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Info with customizable SiteLogo */}
          <div className="flex items-center gap-3">
            <SiteLogo size="sm" />
            <div>
              <span className="text-base sm:text-lg font-bold text-gold-gradient block">
                {siteSettings.nameAr}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {adminUser.email || 'لوحة تحكم الإدارة'}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Direct Instant Content Refresh */}
            <button
              onClick={handleAdminSync}
              disabled={isAdminRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/20 transition-all"
              title="تحديث ومزامنة المحتوى"
            >
              <RotateCw className={`h-3.5 w-3.5 text-emerald-400 ${isAdminRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">تحديث المحتوى</span>
            </button>

            {/* View Site */}
            <button
              onClick={() => navigateTo('landing')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-400/10 text-amber-200 border border-amber-400/40 hover:bg-amber-400/20 transition-all"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>عرض الموقع</span>
            </button>

            {/* Logout */}
            <button
              onClick={logoutAdmin}
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 transition-all flex items-center gap-1.5"
              title="تسجيل الخروج"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Navigation Tabs - Compact, Horizontal Scrollable on Mobile, Responsive & Space Efficient */}
        <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-amber-400/20 max-w-4xl mx-auto mb-6 backdrop-blur-xl overflow-x-auto no-scrollbar flex-nowrap sm:flex-wrap justify-start sm:justify-center w-full">
          <button
            onClick={() => setActiveTab('services')}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 whitespace-nowrap ${
              activeTab === 'services'
                ? 'bg-gradient-to-r from-amber-400/25 to-amber-500/15 border border-amber-400/60 text-amber-200 shadow-[0_0_12px_rgba(212,175,55,0.2)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-300" />
            <span>الخدمات ({services.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all relative shrink-0 whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'bg-gradient-to-r from-amber-400/25 to-amber-500/15 border border-amber-400/60 text-amber-200 shadow-[0_0_12px_rgba(212,175,55,0.2)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-300" />
            <span>التعليقات</span>
            {pendingReviewsCount > 0 && (
              <span className="h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-amber-500 text-slate-950 text-[9px] sm:text-[10px] font-bold flex items-center justify-center">
                {pendingReviewsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('standards')}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 whitespace-nowrap ${
              activeTab === 'standards'
                ? 'bg-gradient-to-r from-amber-400/25 to-amber-500/15 border border-amber-400/60 text-amber-200 shadow-[0_0_12px_rgba(212,175,55,0.2)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-300" />
            <span>المعايير ({standards.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('socials')}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 whitespace-nowrap ${
              activeTab === 'socials'
                ? 'bg-gradient-to-r from-amber-400/25 to-amber-500/15 border border-amber-400/60 text-amber-200 shadow-[0_0_12px_rgba(212,175,55,0.2)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-300" />
            <span>طرق التواصل</span>
          </button>

          <button
            onClick={() => setActiveTab('hero')}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 whitespace-nowrap ${
              activeTab === 'hero'
                ? 'bg-gradient-to-r from-amber-400/25 to-amber-500/15 border border-amber-400/60 text-amber-200 shadow-[0_0_12px_rgba(212,175,55,0.2)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-300" />
            <span>واجهة Hero</span>
          </button>

          <button
            onClick={() => setActiveTab('branding')}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 whitespace-nowrap ${
              activeTab === 'branding'
                ? 'bg-gradient-to-r from-amber-400/25 to-amber-500/15 border border-amber-400/60 text-amber-200 shadow-[0_0_12px_rgba(212,175,55,0.2)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Palette className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-300" />
            <span>هوية الموقع</span>
          </button>
        </div>

        {/* ========================================================
            Tab 1: Services Management (CRUD)
           ======================================================== */}
        {activeTab === 'services' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-100">
                  قائمة الجولات والبرامج السياحية الفاخرة
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  يمكنك إضافة برامج جديدة، تعديل الأسعار، الوصف، والصور التي تظهر في الصفحة الرئيسية.
                </p>
              </div>

              <button
                onClick={handleOpenAddService}
                className="inline-flex items-center gap-2 rounded-xl py-2.5 px-5 font-bold text-slate-950 text-xs sm:text-sm transition-all hover:scale-[1.02] shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                style={{
                  background: 'linear-gradient(135deg, #FFF0B3 0%, #D4AF37 45%, #AA771C 80%, #F5DE93 100%)',
                }}
              >
                <Plus className="h-4 w-4" />
                <span>إضافة خدمة جديدة</span>
              </button>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {services.map((srv) => (
                  <motion.div
                    key={srv.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="rounded-2xl border border-amber-400/20 bg-slate-900/80 overflow-hidden flex flex-col justify-between"
                  >
                    <div className="relative h-44 w-full bg-slate-950">
                      <img
                        src={srv.imageUrl}
                        alt={srv.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute top-3 right-3 rounded-full bg-slate-950/80 px-2.5 py-1 text-[11px] font-bold text-amber-300 border border-amber-400/40">
                        {srv.badge}
                      </div>
                      <div className="absolute bottom-3 left-3 rounded-lg bg-slate-950/90 px-2.5 py-1 text-xs font-mono font-bold text-gold-gradient border border-amber-400/30">
                        ${srv.price} {srv.currency}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1 text-xs text-amber-300/80 mb-1">
                          <MapPin className="h-3 w-3" />
                          <span>{srv.destination}</span>
                        </div>
                        <h4 className="text-base font-bold text-slate-100">{srv.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                          {srv.description}
                        </p>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleOpenEditService(srv)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-amber-400/30 bg-amber-400/10 text-xs font-semibold text-amber-200 hover:bg-amber-400/20 transition-all"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          <span>تعديل</span>
                        </button>

                        {deletingServiceId === srv.id ? (
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={async () => {
                                await deleteService(srv.id);
                                setDeletingServiceId(null);
                              }}
                              className="px-2.5 py-2 rounded-xl border border-red-500 bg-red-600 text-white text-[11px] font-bold hover:bg-red-700 transition-all shadow-[0_0_10px_rgba(239,68,68,0.3)] whitespace-nowrap"
                            >
                              تأكيد الحذف
                            </button>
                            <button
                              onClick={() => setDeletingServiceId(null)}
                              className="px-2 py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 text-[11px] hover:bg-slate-700 transition-all whitespace-nowrap"
                            >
                              إلغاء
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeletingServiceId(srv.id)}
                            className="p-2 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                            title="حذف الخدمة"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ========================================================
            Tab 2: Reviews Moderation
           ======================================================== */}
        {activeTab === 'reviews' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-100">
                  إدارة وتدقيق تقييمات الضيوف
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  التقييمات الجديدة لا تظهر في الموقع حتى تضغط على "اعتماد". يمكنك الرفض أو الحذف في أي وقت.
                </p>
              </div>

              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800">
                <button
                  onClick={() => setReviewFilter('pending')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all relative ${
                    reviewFilter === 'pending'
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>قيد المراجعة</span>
                  {pendingReviewsCount > 0 && (
                    <span className="mr-1.5 px-1.5 py-0.2 rounded-full bg-slate-950 text-amber-300 text-[10px]">
                      {pendingReviewsCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setReviewFilter('approved')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    reviewFilter === 'approved'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  المعتمدة
                </button>

                <button
                  onClick={() => setReviewFilter('rejected')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    reviewFilter === 'rejected'
                      ? 'bg-red-500 text-slate-950'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  المرفوضة
                </button>

                <button
                  onClick={() => setReviewFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    reviewFilter === 'all'
                      ? 'bg-slate-700 text-slate-100'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  الكل ({reviews.length})
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredReviews.length === 0 ? (
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center text-slate-400 text-sm">
                    لا توجد تقييمات مطابقة لهذا الفلتر حالياً.
                  </div>
                ) : (
                  filteredReviews.map((rev) => {
                    const targetService = services.find((s) => s.id === rev.serviceId);
                    return (
                      <motion.div
                        key={rev.id}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.25 } }}
                        className={`rounded-2xl border p-5 sm:p-6 transition-all ${
                          rev.status === 'pending'
                            ? 'border-amber-400/40 bg-amber-500/[0.04]'
                            : rev.status === 'approved'
                            ? 'border-emerald-500/30 bg-emerald-500/[0.03]'
                            : 'border-red-500/25 bg-red-500/[0.03]'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-base font-bold text-slate-100">
                                {rev.authorName}
                              </span>
                              {rev.location && (
                                <span className="text-xs text-slate-400">
                                  ({rev.location})
                                </span>
                              )}
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                  rev.status === 'pending'
                                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                                    : rev.status === 'approved'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                    : 'bg-red-500/20 text-red-300 border border-red-500/40'
                                }`}
                              >
                                {rev.status === 'pending'
                                  ? 'قيد المراجعة'
                                  : rev.status === 'approved'
                                  ? 'معتمد ومنشور'
                                  : 'مرفوض ومخفي'}
                              </span>
                            </div>

                            <span className="text-xs text-amber-300/80 block mt-0.5">
                              الخدمة: {targetService?.title || rev.serviceId}
                            </span>
                          </div>

                          <div className="flex text-amber-400">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`h-4 w-4 ${
                                  s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-slate-600'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-800">
                          {rev.comment}
                        </p>

                        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <span className="text-slate-500 text-[11px] font-mono">
                            {new Date(rev.createdAt).toLocaleDateString('ar-EG')}
                          </span>

                          <div className="flex items-center gap-2">
                            {rev.status !== 'approved' && (
                              <button
                                onClick={() => approveReview(rev.id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 transition-all font-semibold"
                              >
                                <Check className="h-3.5 w-3.5" />
                                <span>اعتماد ونشر للجمهور</span>
                              </button>
                            )}

                            {rev.status !== 'rejected' && (
                              <button
                                onClick={() => rejectReview(rev.id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 transition-all font-semibold"
                              >
                                <X className="h-3.5 w-3.5" />
                                <span>رفض وإخفاء</span>
                              </button>
                            )}

                            <button
                              onClick={() => deleteReview(rev.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"
                              title="حذف نهائي"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>حذف</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ========================================================
            Tab 3: Hospitality Standards Management (CRUD)
           ======================================================== */}
        {activeTab === 'standards' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-100">
                  إدارة بطاقات معايير الضيافة الملكية
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  خصص نقاط الاعتماد والامتيازات التي تظهر في قسم "معايير الضيافة الملكية" على الصفحة الرئيسية.
                </p>
              </div>

              <button
                onClick={handleOpenAddStandard}
                className="inline-flex items-center gap-2 rounded-xl py-2.5 px-5 font-bold text-slate-950 text-xs sm:text-sm shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                style={{
                  background: 'linear-gradient(135deg, #FFF0B3 0%, #D4AF37 45%, #AA771C 80%, #F5DE93 100%)',
                }}
              >
                <Plus className="h-4 w-4" />
                <span>إضافة معيار جديد</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <AnimatePresence mode="popLayout">
                {standards.map((std) => (
                  <motion.div
                    key={std.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="rounded-2xl border border-amber-400/20 bg-slate-900/80 p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-10 w-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 mb-3">
                        <Award className="h-5 w-5" />
                      </div>
                      <h4 className="text-sm font-bold text-amber-200 mb-1">{std.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                        {std.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleOpenEditStandard(std)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl border border-amber-400/30 bg-amber-400/10 text-xs font-semibold text-amber-200 hover:bg-amber-400/20 transition-all"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        <span>تعديل</span>
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`هل أنت متأكد من حذف "${std.title}"؟`)) {
                            deleteStandard(std.id);
                          }
                        }}
                        className="p-1.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                        title="حذف"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ========================================================
            Tab 4: All Elements Contact Methods Customizer
           ======================================================== */}
        {activeTab === 'socials' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            {/* Top Toolbar */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-6 rounded-3xl border border-amber-400/30 bg-slate-900/90 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                    تخصيص كامل 100%
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    CONTACT PORTAL CUSTOMIZER
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-100">
                  تخصيص وإدارة حاوية طرق التواصل بالكامل
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  تحكم ملكي شامل بجميع عناصر ونصوص وشارات بطاقة الواتساب، قنوات التواصل الفردية، شريط المعلومات والترخيص، وأمان حساب المدير.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <button
                  type="button"
                  onClick={() => setIsAddingSocial(!isAddingSocial)}
                  className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 rounded-xl py-3 px-5 font-bold text-amber-300 border border-amber-400/30 bg-slate-950/80 hover:bg-amber-400/10 transition-all text-xs sm:text-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>إضافة قناة جديدة</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveContactSettings()}
                  className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 rounded-xl py-3 px-6 font-bold text-slate-950 text-xs sm:text-sm shadow-[0_0_20px_rgba(212,175,55,0.35)] transition-all hover:scale-[1.02]"
                  style={{
                    background: 'linear-gradient(135deg, #FFF0B3 0%, #D4AF37 45%, #AA771C 80%, #F5DE93 100%)',
                  }}
                >
                  <Save className="h-4 w-4" />
                  <span>حفظ كافة التخصيصات</span>
                </button>
              </div>
            </div>

            {/* Success notification banner */}
            <AnimatePresence>
              {contactSaved && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/15 text-emerald-300 flex items-center justify-between text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                    <span>تم حفظ وتحديث كافة عناصر وتخصيصات طرق التواصل بنجاح!</span>
                  </div>
                  <span className="text-xs text-emerald-400 font-mono">SAVED</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Section Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pb-1 border-b border-slate-800">
              <button
                type="button"
                onClick={() => setContactSubTab('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  contactSubTab === 'all'
                    ? 'bg-amber-400 text-slate-950 shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                عرض كل العناصر
              </button>
              <button
                type="button"
                onClick={() => setContactSubTab('header')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  contactSubTab === 'header'
                    ? 'bg-amber-400 text-slate-950 shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                رأس الحاوية والنصوص
              </button>
              <button
                type="button"
                onClick={() => setContactSubTab('whatsapp')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  contactSubTab === 'whatsapp'
                    ? 'bg-amber-400 text-slate-950 shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                بطاقة واتساب VIP المميزة
              </button>
              <button
                type="button"
                onClick={() => setContactSubTab('channels')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  contactSubTab === 'channels'
                    ? 'bg-amber-400 text-slate-950 shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                قنوات التواصل ({socialLinks.length})
              </button>
              <button
                type="button"
                onClick={() => setContactSubTab('trust')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  contactSubTab === 'trust'
                    ? 'bg-amber-400 text-slate-950 shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                شريط الموثوقية والمقر
              </button>
              <button
                type="button"
                onClick={() => setContactSubTab('security')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  contactSubTab === 'security'
                    ? 'bg-amber-400 text-slate-950 shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                أمان حساب المدير وكلمة المرور
              </button>
            </div>

            {/* =========================================================
                SECTION 1: Header & Greeting Texts Customization
               ========================================================= */}
            {(contactSubTab === 'all' || contactSubTab === 'header') && (
              <div className="rounded-3xl border border-amber-400/20 bg-slate-900/80 p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-100">
                        1. تخصيص رأس الحاوية والنصوص الترحيبية
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        الشارة العلوية، العنوان الرئيسي، والوصف التمهيدي لحاوية التواصل.
                      </p>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-amber-300">
                    <input
                      type="checkbox"
                      checked={contactForm.contactBadgeVisible}
                      onChange={(e) => setContactForm({ ...contactForm, contactBadgeVisible: e.target.checked })}
                      className="rounded accent-amber-400 h-4 w-4"
                    />
                    <span>إظهار شارة العنوان</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-amber-200 mb-1.5">
                      نص الشارة العلوية
                    </label>
                    <input
                      type="text"
                      value={contactForm.contactBadgeText}
                      onChange={(e) => setContactForm({ ...contactForm, contactBadgeText: e.target.value })}
                      placeholder="قنوات التواصل الرسمية لعبدالله في تركيا"
                      className="w-full rounded-xl border border-amber-400/25 bg-slate-950 px-4 py-2.5 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-amber-200 mb-1.5">
                      العنوان الرئيسي للحاوية
                    </label>
                    <input
                      type="text"
                      value={contactForm.contactTitle}
                      onChange={(e) => setContactForm({ ...contactForm, contactTitle: e.target.value })}
                      placeholder="تواصل ملكي مباشر مع مستشارك السياحي 24/7"
                      className="w-full rounded-xl border border-amber-400/25 bg-slate-950 px-4 py-2.5 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-amber-200 mb-1.5">
                      النص التعريفي والوصفي أسفل العنوان
                    </label>
                    <textarea
                      rows={2}
                      value={contactForm.contactSubtitle}
                      onChange={(e) => setContactForm({ ...contactForm, contactSubtitle: e.target.value })}
                      placeholder="اختر القناة المفضلة لديك وسيقوم فريق الكونسيرج بمتابعة كافة متطلبات رحلتك وتجهيز برنامجك الفاخر بدقة متناهية."
                      className="w-full rounded-xl border border-amber-400/25 bg-slate-950 px-4 py-2.5 text-xs text-slate-100 focus:border-amber-400 focus:outline-none leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================
                SECTION 2: VIP WhatsApp Featured Card Customization
               ========================================================= */}
            {(contactSubTab === 'all' || contactSubTab === 'whatsapp') && (
              <div className="rounded-3xl border border-emerald-500/30 bg-slate-900/80 p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <MessageCircle className="h-5 w-5 fill-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-100">
                        2. تخصيص بطاقة واتساب كونسيرج VIP المميزة
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        البطاقة البارزة التي تمنح الزائر إمكانية بدء محادثة فورية مسبقة التجهيز.
                      </p>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-emerald-400">
                    <input
                      type="checkbox"
                      checked={contactForm.contactWhatsAppVisible}
                      onChange={(e) => setContactForm({ ...contactForm, contactWhatsAppVisible: e.target.checked })}
                      className="rounded accent-emerald-500 h-4 w-4"
                    />
                    <span>تفعيل إظهار بطاقة الواتساب</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-emerald-300 mb-1.5">
                      عنوان بطاقة الواتساب
                    </label>
                    <input
                      type="text"
                      value={contactForm.contactWhatsAppTitle}
                      onChange={(e) => setContactForm({ ...contactForm, contactWhatsAppTitle: e.target.value })}
                      placeholder="واتساب كونسيرج VIP المباشر"
                      className="w-full rounded-xl border border-emerald-500/30 bg-slate-950 px-4 py-2.5 text-xs text-slate-100 focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-emerald-300 mb-1.5">
                      شارة الحالة والتواجد
                    </label>
                    <input
                      type="text"
                      value={contactForm.contactWhatsAppBadge}
                      onChange={(e) => setContactForm({ ...contactForm, contactWhatsAppBadge: e.target.value })}
                      placeholder="متواجد الآن"
                      className="w-full rounded-xl border border-emerald-500/30 bg-slate-950 px-4 py-2.5 text-xs text-slate-100 focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-emerald-300 mb-1.5">
                      نص زر بدء المحادثة
                    </label>
                    <input
                      type="text"
                      value={contactForm.contactWhatsAppButtonText}
                      onChange={(e) => setContactForm({ ...contactForm, contactWhatsAppButtonText: e.target.value })}
                      placeholder="بدء المحادثة الفورية"
                      className="w-full rounded-xl border border-emerald-500/30 bg-slate-950 px-4 py-2.5 text-xs text-slate-100 focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-emerald-300 mb-1.5">
                      رقم الواتساب المعتمد (مع كود الدولة)
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={contactForm.contactWhatsAppNumber}
                      onChange={(e) => setContactForm({ ...contactForm, contactWhatsAppNumber: e.target.value })}
                      placeholder="905380000000"
                      className="w-full rounded-xl border border-emerald-500/30 bg-slate-950 px-4 py-2.5 text-xs text-slate-100 text-left font-mono focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-emerald-300 mb-1.5">
                      وصف خدمة الواتساب المعروض
                    </label>
                    <input
                      type="text"
                      value={contactForm.contactWhatsAppDescription}
                      onChange={(e) => setContactForm({ ...contactForm, contactWhatsAppDescription: e.target.value })}
                      placeholder="حجوزات اليخوت، طائرات الهليكوبتر، سيارات مايباخ، وفلل البحر مع مستشارك الخاص."
                      className="w-full rounded-xl border border-emerald-500/30 bg-slate-950 px-4 py-2.5 text-xs text-slate-100 focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="block text-xs font-semibold text-emerald-300 mb-1.5">
                      نص الرسالة التلقائية الترحيبية المسبقة (تفتح في تطبيق الواتساب لدى العميل)
                    </label>
                    <input
                      type="text"
                      value={contactForm.contactWhatsAppDefaultMessage}
                      onChange={(e) => setContactForm({ ...contactForm, contactWhatsAppDefaultMessage: e.target.value })}
                      placeholder="مرحباً، أود التواصل مع الأستاذ عبدالله بخصوص الخدمات السياحية والعقارية في تركيا."
                      className="w-full rounded-xl border border-emerald-500/30 bg-slate-950 px-4 py-2.5 text-xs text-slate-100 focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================
                SECTION 3: Individual Social Channels Management
               ========================================================= */}
            {(contactSubTab === 'all' || contactSubTab === 'channels') && (
              <div className="rounded-3xl border border-amber-400/20 bg-slate-900/80 p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
                      <Share2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-100">
                        3. إدارة وتخصيص قنوات التواصل الفردية ({socialLinks.length} قنوات)
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        يمكنك تعديل الاسم، المنصة، الرابط، الوصف، الشارة، ونص الزر لكل قناة على حدة.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddingSocial(!isAddingSocial)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-amber-400/40 bg-amber-400/15 text-amber-200 text-xs font-bold hover:bg-amber-400/25 transition-all"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>{isAddingSocial ? 'إغلاق النموذج' : 'إضافة قناة جديدة'}</span>
                  </button>
                </div>

                {/* Add Social Form Drawer */}
                {isAddingSocial && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleAddSocialLink}
                    className="rounded-2xl border border-amber-400/40 bg-slate-950 p-6 space-y-4 shadow-[0_0_25px_rgba(212,175,55,0.15)]"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h5 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        <span>إضافة قناة أو وسيلة تواصل جديدة</span>
                      </h5>
                      <span className="text-[11px] text-slate-400">جميع الحقول قابلة للتخصيص الكامل</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-semibold">نوع المنصة</label>
                        <select
                          value={newPlatform}
                          onChange={(e) => setNewPlatform(e.target.value as SocialPlatform)}
                          className="w-full rounded-xl border border-amber-400/25 bg-slate-900 px-3 py-2.5 text-xs text-slate-100"
                        >
                          <option value="instagram">إنستغرام (Instagram)</option>
                          <option value="whatsapp">واتساب (WhatsApp)</option>
                          <option value="telegram">تيليجرام (Telegram)</option>
                          <option value="tiktok">تيك توك (TikTok)</option>
                          <option value="facebook">فيسبوك (Facebook)</option>
                          <option value="youtube">يوتيوب (YouTube)</option>
                          <option value="linkedin">لينكد إن (LinkedIn)</option>
                          <option value="x">منصة إكس / تويتر (X)</option>
                          <option value="snapchat">سناب شات (Snapchat)</option>
                          <option value="phone">هاتف مباشر (Phone)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-semibold">اسم وعنوان القناة</label>
                        <input
                          type="text"
                          required
                          placeholder="مثال: إنستغرام عبدالله في تركيا"
                          value={newSocialLabel}
                          onChange={(e) => setNewSocialLabel(e.target.value)}
                          className="w-full rounded-xl border border-amber-400/25 bg-slate-900 px-3 py-2.5 text-xs text-slate-100"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-semibold">الرابط المباشر (URL)</label>
                        <input
                          type="text"
                          required
                          dir="ltr"
                          placeholder="https://instagram.com/abdullahinturkey"
                          value={newSocialUrl}
                          onChange={(e) => setNewSocialUrl(e.target.value)}
                          className="w-full rounded-xl border border-amber-400/25 bg-slate-900 px-3 py-2.5 text-xs text-slate-100 text-left font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-semibold">الشارة المعروضة</label>
                        <input
                          type="text"
                          placeholder="مثال: OFFICIAL أو حساب موثق"
                          value={newSocialBadge}
                          onChange={(e) => setNewSocialBadge(e.target.value)}
                          className="w-full rounded-xl border border-amber-400/25 bg-slate-900 px-3 py-2.5 text-xs text-slate-100"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-semibold">نص زر الزيارة / الإجراء</label>
                        <input
                          type="text"
                          placeholder="مثال: زيارة الحساب الرسمي"
                          value={newSocialActionText}
                          onChange={(e) => setNewSocialActionText(e.target.value)}
                          className="w-full rounded-xl border border-amber-400/25 bg-slate-900 px-3 py-2.5 text-xs text-slate-100"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-semibold">الوصف الترويجي المعروض على البطاقة</label>
                        <input
                          type="text"
                          placeholder="مثال: تغطيات يومية حصرية لليخوت الملكية والفنادق الفاخرة."
                          value={newSocialDescription}
                          onChange={(e) => setNewSocialDescription(e.target.value)}
                          className="w-full rounded-xl border border-amber-400/25 bg-slate-900 px-3 py-2.5 text-xs text-slate-100"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setIsAddingSocial(false)}
                        className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
                      >
                        إضافة القناة وحفظها
                      </button>
                    </div>
                  </motion.form>
                )}

                {/* Social Links List with Complete Customization on Each Item */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {socialLinks.map((link) => (
                    <div
                      key={link.id}
                      className="rounded-2xl border border-amber-400/25 bg-slate-950/80 p-5 space-y-4 transition-all hover:border-amber-400/50 shadow-md"
                    >
                      {/* Top Header of Card */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
                            {link.platform === 'whatsapp' ? (
                              <MessageCircle className="h-5 w-5 text-emerald-400" />
                            ) : link.platform === 'phone' ? (
                              <Phone className="h-5 w-5 text-emerald-400" />
                            ) : (
                              <Share2 className="h-5 w-5 text-amber-300" />
                            )}
                          </div>
                          <div>
                            <span className="text-sm font-bold text-slate-100 block">
                              {link.label}
                            </span>
                            <span className="text-[10px] text-amber-400 font-mono uppercase">
                              {link.platform} • {link.badge || 'OFFICIAL'}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => updateSocialLink(link.id, { isActive: !link.isActive })}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                            link.isActive
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-slate-800 text-slate-500 border border-slate-700'
                          }`}
                        >
                          {link.isActive ? 'مفعل نشط' : 'معطل'}
                        </button>
                      </div>

                      {/* Editable Fields Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">اسم القناة المعروض:</label>
                          <input
                            type="text"
                            value={link.label}
                            onChange={(e) => updateSocialLink(link.id, { label: e.target.value })}
                            className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">المنصة:</label>
                          <select
                            value={link.platform}
                            onChange={(e) => updateSocialLink(link.id, { platform: e.target.value as SocialPlatform })}
                            className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
                          >
                            <option value="instagram">إنستغرام</option>
                            <option value="whatsapp">واتساب</option>
                            <option value="telegram">تيليجرام</option>
                            <option value="tiktok">تيك توك</option>
                            <option value="facebook">فيسبوك</option>
                            <option value="youtube">يوتيوب</option>
                            <option value="linkedin">لينكد إن</option>
                            <option value="x">إكس / تويتر</option>
                            <option value="snapchat">سناب شات</option>
                            <option value="phone">هاتف مباشر</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">الشارة المعروضة:</label>
                          <input
                            type="text"
                            value={link.badge || ''}
                            placeholder="OFFICIAL"
                            onChange={(e) => updateSocialLink(link.id, { badge: e.target.value })}
                            className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">نص زر الزيارة:</label>
                          <input
                            type="text"
                            value={link.actionText || ''}
                            placeholder="زيارة القناة الرسمية"
                            onChange={(e) => updateSocialLink(link.id, { actionText: e.target.value })}
                            className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] text-slate-400 mb-1">الرابط المباشر (URL):</label>
                          <input
                            type="text"
                            dir="ltr"
                            value={link.url}
                            onChange={(e) => updateSocialLink(link.id, { url: e.target.value })}
                            className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200 font-mono text-left focus:border-amber-400 focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] text-slate-400 mb-1">الوصف المعروض في البطاقة:</label>
                          <input
                            type="text"
                            value={link.description || ''}
                            placeholder="وصف ترويجي مختصر للخدمة أو القناة"
                            onChange={(e) => updateSocialLink(link.id, { description: e.target.value })}
                            className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1 font-semibold"
                        >
                          <span>اختبار الرابط</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`هل أنت متأكد من حذف وسيلة التواصل "${link.label}"؟`)) {
                              deleteSocialLink(link.id);
                            }
                          }}
                          className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>حذف القناة</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* =========================================================
                SECTION 4: Footer Trust & Information Strip Customization
               ========================================================= */}
            {(contactSubTab === 'all' || contactSubTab === 'trust') && (
              <div className="rounded-3xl border border-amber-400/20 bg-slate-900/80 p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-100">
                        4. تخصيص شريط الموثوقية والمقر وساعات الخدمة
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        الشريط السفلي الموثوق الذي يظهر داخل حاوية طرق التواصل.
                      </p>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-amber-300">
                    <input
                      type="checkbox"
                      checked={contactForm.contactTrustBarVisible}
                      onChange={(e) => setContactForm({ ...contactForm, contactTrustBarVisible: e.target.checked })}
                      className="rounded accent-amber-400 h-4 w-4"
                    />
                    <span>إظهار شريط الموثوقية</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-amber-200 mb-1.5">
                      نص الترخيص والاعتماد (TÜRSAB)
                    </label>
                    <input
                      type="text"
                      value={contactForm.contactLicenseText}
                      onChange={(e) => setContactForm({ ...contactForm, contactLicenseText: e.target.value })}
                      placeholder="TÜRSAB - 14920 (فئة أ)"
                      className="w-full rounded-xl border border-amber-400/25 bg-slate-950 px-4 py-2.5 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-amber-200 mb-1.5">
                      نص ساعات العمل والخدمة
                    </label>
                    <input
                      type="text"
                      value={contactForm.contactSupportHours}
                      onChange={(e) => setContactForm({ ...contactForm, contactSupportHours: e.target.value })}
                      placeholder="خدمة عملاء وكونسيرج 24/7"
                      className="w-full rounded-xl border border-amber-400/25 bg-slate-950 px-4 py-2.5 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-amber-200 mb-1.5">
                      نص المقر والعنوان
                    </label>
                    <input
                      type="text"
                      value={contactForm.contactHeadquartersText}
                      onChange={(e) => setContactForm({ ...contactForm, contactHeadquartersText: e.target.value })}
                      placeholder="Zorlu Center, Beşiktaş, Istanbul, Turkey"
                      className="w-full rounded-xl border border-amber-400/25 bg-slate-950 px-4 py-2.5 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================
                SECTION 5: Manager Account Security & Password
               ========================================================= */}
            {(contactSubTab === 'all' || contactSubTab === 'security') && (
              <div className="rounded-3xl border border-amber-500/30 bg-slate-900/90 p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="h-10 w-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-100">
                      5. أمان وحماية تسجيل الدخول لحساب المدير
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      لوحة التحكم محمية تماماً ومقتصرة على حساب المدير المعتمد.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-amber-400/25 bg-amber-400/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-6 w-6 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">
                        حساب المدير المعتمد:
                      </span>
                      <span className="text-sm font-mono text-amber-300 font-bold">
                        {managerEmail}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full font-bold">
                    حساب موثق ومحمي
                  </span>
                </div>

                {/* Password Change Form */}
                <form onSubmit={handleChangePassword} className="space-y-4 pt-2">
                  <h5 className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                    <Key className="h-4 w-4" />
                    <span>تغيير كلمة مرور المدير للوحة التحكم</span>
                  </h5>

                  {passwordChangeSuccess && (
                    <div className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span>{passwordChangeSuccess}</span>
                    </div>
                  )}

                  {passwordChangeError && (
                    <div className="p-3 rounded-xl border border-red-500/40 bg-red-500/10 text-red-300 text-xs font-bold">
                      {passwordChangeError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">كلمة المرور الحالية</label>
                      <input
                        type="password"
                        required
                        dir="ltr"
                        placeholder="••••••••"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-300 mb-1">كلمة المرور الجديدة (6 أحرف فأكثر)</label>
                      <input
                        type="password"
                        required
                        dir="ltr"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-300 mb-1">تأكيد كلمة المرور الجديدة</label>
                      <input
                        type="password"
                        required
                        dir="ltr"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl border border-amber-400/40 bg-amber-400/20 text-amber-200 hover:bg-amber-400/30 font-bold text-xs transition-all shadow-sm"
                    >
                      تحديث كلمة المرور
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Bottom floating Save Action */}
            <div className="sticky bottom-6 z-20 flex items-center justify-between p-4 rounded-2xl border border-amber-400/40 bg-slate-950/95 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
              <span className="text-xs text-slate-300 font-semibold hidden sm:inline">
                هل انتهيت من التعديلات؟ احفظ جميع التغييرات لتحديث الموقع فوراً.
              </span>
              <button
                type="button"
                onClick={() => handleSaveContactSettings()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl py-3 px-8 font-bold text-slate-950 text-xs sm:text-sm shadow-[0_0_20px_rgba(212,175,55,0.35)] transition-all hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, #FFF0B3 0%, #D4AF37 45%, #AA771C 80%, #F5DE93 100%)',
                }}
              >
                <Save className="h-4 w-4" />
                <span>حفظ كافة التخصيصات</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* ========================================================
            Tab 5: Site Branding & Logo (هوية وشعار الموقع)
           ======================================================== */}
        {activeTab === 'branding' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6 max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-100">
                  تخصيص هوية وشعار واسم الموقع
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  تعديل الاسم العربي، الاسم الإنجليزي بالأسفل، واختيار الشعار الأنسب للعلامة التجارية.
                </p>
              </div>

              {brandingSaved && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <Check className="h-3.5 w-3.5" />
                  <span>تم حفظ التعديلات بنجاح!</span>
                </div>
              )}
            </div>

            {/* Live Preview Box */}
            <div className="rounded-2xl border border-amber-400/30 bg-slate-950/80 p-5 backdrop-blur-xl">
              <span className="text-[11px] font-mono text-amber-300 uppercase block mb-3">
                معاينة حية لشعار واسم الموقع (Live Header Preview):
              </span>
              <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-800 bg-[#060a16]">
                <SiteLogo size="md" />
                <div className="flex flex-col text-right">
                  <span className="text-lg font-bold text-gold-gradient">
                    {brandingForm.nameAr || 'عبد الله في تركيا'}
                  </span>
                  <span className="text-[10px] tracking-widest text-slate-400 uppercase font-mono">
                    {brandingForm.nameEn || 'Abdullah in Turkey'}
                  </span>
                </div>
              </div>
            </div>

            {/* Branding Settings Form */}
            <form onSubmit={handleSaveBranding} className="rounded-2xl border border-amber-400/20 bg-slate-900/80 p-6 space-y-5">
              {/* Arabic Name */}
              <div>
                <label className="block text-xs font-semibold text-amber-200 mb-1.5">
                  اسم الموقع بالعربية (الرئيسي الكبير) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="عبد الله في تركيا"
                  value={brandingForm.nameAr}
                  onChange={(e) => setBrandingForm({ ...brandingForm, nameAr: e.target.value })}
                  className="w-full rounded-xl border border-amber-400/25 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-amber-400 focus:outline-none"
                />
              </div>

              {/* English Subtitle */}
              <div>
                <label className="block text-xs font-semibold text-amber-200 mb-1.5">
                  الاسم بالإنجليزية (السطر الصغير أسفل الاسم العربي) *
                </label>
                <input
                  type="text"
                  required
                  dir="ltr"
                  placeholder="Abdullah in Turkey"
                  value={brandingForm.nameEn}
                  onChange={(e) => setBrandingForm({ ...brandingForm, nameEn: e.target.value })}
                  className="w-full rounded-xl border border-amber-400/25 bg-slate-950 px-4 py-3 text-sm text-slate-100 font-mono text-left focus:border-amber-400 focus:outline-none"
                />
              </div>

              {/* Slogan */}
              <div>
                <label className="block text-xs font-semibold text-amber-200 mb-1.5">
                  الشعار اللفظي الترويجي (Slogan)
                </label>
                <input
                  type="text"
                  placeholder="خدمات كونسيرج سياحي فئة خمس نجوم في تركيا"
                  value={brandingForm.sloganAr}
                  onChange={(e) => setBrandingForm({ ...brandingForm, sloganAr: e.target.value })}
                  className="w-full rounded-xl border border-amber-400/25 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-amber-400 focus:outline-none"
                />
              </div>

              {/* Logo Type Selector */}
              <div>
                <label className="block text-xs font-semibold text-amber-200 mb-2">
                  نوع الشعار (Logo Type)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setBrandingForm({ ...brandingForm, logoType: 'icon' })}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                      brandingForm.logoType === 'icon'
                        ? 'border-amber-400 bg-amber-400/20 text-amber-200'
                        : 'border-slate-800 bg-slate-950 text-slate-400'
                    }`}
                  >
                    أيقونة ملكية مذهبة (Icon Emblem)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBrandingForm({ ...brandingForm, logoType: 'image' })}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                      brandingForm.logoType === 'image'
                        ? 'border-amber-400 bg-amber-400/20 text-amber-200'
                        : 'border-slate-800 bg-slate-950 text-slate-400'
                    }`}
                  >
                    صورة شعار مخصصة (Custom Image URL)
                  </button>
                </div>
              </div>

              {/* Icon Selector (if logoType === 'icon') */}
              {brandingForm.logoType === 'icon' ? (
                <div>
                  <label className="block text-xs font-semibold text-amber-200 mb-2">
                    اختر الأيقونة الملكية المناسبة لعلامتك:
                  </label>
                  <div className="grid grid-cols-5 gap-2.5">
                    {[
                      { id: 'crown', label: 'تاج ملكي', icon: <Crown className="h-5 w-5 text-amber-300" /> },
                      { id: 'diamond', label: 'ألماسة', icon: <Gem className="h-5 w-5 text-amber-300" /> },
                      { id: 'compass', label: 'بوصلة سفر', icon: <Compass className="h-5 w-5 text-amber-300" /> },
                      { id: 'star', label: 'نجمة ذهبية', icon: <Star className="h-5 w-5 text-amber-300" /> },
                      { id: 'shield', label: 'درع ثقة', icon: <Shield className="h-5 w-5 text-amber-300" /> },
                    ].map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() =>
                          setBrandingForm({
                            ...brandingForm,
                            logoIcon: item.id as SiteSettings['logoIcon'],
                          })
                        }
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                          brandingForm.logoIcon === item.id
                            ? 'border-amber-400 bg-amber-400/20 text-amber-200 shadow-[0_0_15px_rgba(212,175,55,0.25)]'
                            : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {item.icon}
                        <span className="text-[11px] mt-1.5">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Custom Image Logo Upload (if logoType === 'image') */
                <ImageUploader
                  label="صورة الشعار المخصصة (Logo Image)"
                  value={brandingForm.logoImageUrl}
                  onChange={(url) => setBrandingForm({ ...brandingForm, logoImageUrl: url })}
                  aspectRatio="square"
                  maxDimension={600}
                  helperText="يمكنك رفع ملف صورة مخصص للشعار مباشرة من جهازك (PNG أو JPG أو SVG شفاف)."
                  recommendedSize="512x512 بكسل بخلفية شفافة"
                />
              )}

              {/* License & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-amber-200 mb-1.5">
                    رقم ترخيص TÜRSAB الرسمي
                  </label>
                  <input
                    type="text"
                    value={brandingForm.tursabLicense}
                    onChange={(e) =>
                      setBrandingForm({ ...brandingForm, tursabLicense: e.target.value })
                    }
                    className="w-full rounded-xl border border-amber-400/25 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-amber-200 mb-1.5">
                    مقر الشركة والمكتب
                  </label>
                  <input
                    type="text"
                    value={brandingForm.headquarters}
                    onChange={(e) =>
                      setBrandingForm({ ...brandingForm, headquarters: e.target.value })
                    }
                    className="w-full rounded-xl border border-amber-400/25 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl py-3 px-8 font-bold text-slate-950 text-sm shadow-[0_0_20px_rgba(212,175,55,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #FFF0B3 0%, #D4AF37 45%, #AA771C 80%, #F5DE93 100%)',
                  }}
                >
                  <Save className="h-4 w-4" />
                  <span>حفظ هوية الموقع والشعار</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* ========================================================
            Tab 6: Hero Section & Turkey Background Customization (تخصيص الواجهة والخلفية)
           ======================================================== */}
        {activeTab === 'hero' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8 max-w-4xl mx-auto"
          >
            {/* Header info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2.5">
                  <Sparkles className="h-6 w-6 text-amber-400" />
                  <span>تخصيص الواجهة الرئيسية وخلفية تركيا (Hero Section)</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  تحكم كامل في صورة الخلفية التركية، شفافيتها، تلاشيها من الأسفل، الشارة العلوية، العنوان، أزرار الحجز، وشريط تراخيص الثقة.
                </p>
              </div>

              {brandingSaved && (
                <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                  <Check className="h-4 w-4" />
                  <span>تم حفظ تغييرات الواجهة بنجاح!</span>
                </div>
              )}
            </div>

            {/* LIVE HERO PREVIEW BOX */}
            <div className="rounded-3xl border border-amber-400/30 bg-slate-950/90 p-5 sm:p-7 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
              <div className="flex items-center justify-between border-b border-amber-400/20 pb-3 mb-6">
                <span className="text-xs font-mono text-amber-300 flex items-center gap-1.5 uppercase tracking-wider font-bold">
                  <Eye className="h-4 w-4" />
                  <span>معاينة حية للواجهة الرئيسية (Live Hero Preview):</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  تحديث فوري أثناء التعديل
                </span>
              </div>

              {/* Simulated Hero Viewport Container */}
              <div className="relative rounded-2xl overflow-hidden border border-amber-400/20 p-6 sm:p-10 text-center bg-[#060A16]">
                {/* Background with gradual bottom fade and opacity */}
                <div 
                  className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
                  style={{
                    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.88) 35%, rgba(0,0,0,0.45) 65%, rgba(0,0,0,0.1) 85%, rgba(0,0,0,0) 100%)',
                    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.88) 35%, rgba(0,0,0,0.45) 65%, rgba(0,0,0,0.1) 85%, rgba(0,0,0,0) 100%)',
                  }}
                >
                  <img
                    src={brandingForm.heroBackgroundImage || "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1920&q=85"}
                    alt="معاينة الخلفية"
                    className="h-full w-full object-cover object-center transition-all duration-300"
                    style={{
                      opacity: brandingForm.heroBackgroundOpacity,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#060A16]/30 via-transparent to-[#060A16]" />
                </div>

                {/* Badge preview */}
                {brandingForm.heroBadgeVisible && (
                  <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3.5 py-1 backdrop-blur-md mb-4 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                    <span className="h-2 w-2 rounded-full bg-amber-400"></span>
                    <span className="text-xs font-semibold text-amber-200">
                      {brandingForm.heroBadgeText || 'خدمات كونسيرج سياحي فئة خمس نجوم في تركيا'}
                    </span>
                    <Sparkles className="h-3 w-3 text-amber-300" />
                  </div>
                )}

                {/* Headline preview */}
                <h2 className="text-xl sm:text-3xl font-extrabold text-gold-gradient max-w-2xl mx-auto mb-3 leading-tight">
                  {brandingForm.heroHeadline || 'بساعدك في الخدمات السياحية والعقارية في تركيا'}
                </h2>

                {/* Subtitle preview */}
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-light leading-relaxed mb-6">
                  {brandingForm.heroSubtitle || 'نصمم رحلاتك الخاصة في إسطنبول، كابادوكيا، طرابزون وأنطاليا بأعلى درجات الرفاهية والخصوصية التامة.'}
                </p>

                {/* Buttons preview */}
                {(brandingForm.heroPrimaryCtaVisible || brandingForm.heroSecondaryCtaVisible) && (
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {brandingForm.heroPrimaryCtaVisible && (
                      <div
                        className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-bold text-slate-950 text-xs shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                        style={{
                          background: 'linear-gradient(135deg, #FFF0B3 0%, #D4AF37 45%, #AA771C 80%, #F5DE93 100%)',
                        }}
                      >
                        <MessageCircle className="h-3.5 w-3.5 fill-slate-950" />
                        <span>{brandingForm.heroPrimaryCtaText || 'احجز رحلتك الخاصة الآن عبر واتساب'}</span>
                      </div>
                    )}
                    {brandingForm.heroSecondaryCtaVisible && (
                      <div className="inline-flex items-center gap-1.5 rounded-xl border border-amber-400/40 bg-slate-900/80 px-4 py-2.5 font-semibold text-amber-100 text-xs">
                        <Compass className="h-3.5 w-3.5 text-amber-300" />
                        <span>{brandingForm.heroSecondaryCtaText || 'استكشف باقات VIP المتاحة'}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Trust bar preview */}
                {brandingForm.heroTrustBarVisible && (
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-slate-400 pt-3 border-t border-slate-800/80">
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                      <span>{brandingForm.heroTrustText1 || 'TÜRSAB - 14920 (فئة أ)'}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-amber-400" />
                      <span>{brandingForm.heroTrustText2 || 'Zorlu Center, Istanbul'}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-300">{brandingForm.heroTrustText3 || 'كونسيرج متاح 24/7'}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* HERO CUSTOMIZATION FORM */}
            <form onSubmit={handleSaveBranding} className="space-y-6">
              
              {/* SECTION 1: Turkey Scenic Background & Transparency */}
              <div className="rounded-3xl border border-amber-400/20 bg-slate-900/90 p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="h-10 w-10 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
                    <ImageIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-slate-100">
                      خلفية معالم تركيا والشفافية والتلاشي التدريجي
                    </h4>
                    <p className="text-xs text-slate-400">
                      اختر من مكتبة معالم تركيا الفاخرة المعتمدة أو ضع رابط صورتك، وتحكم بدقة في شفافيتها وتلاشيها من الأسفل.
                    </p>
                  </div>
                </div>

                {/* Presets Grid */}
                <div>
                  <label className="block text-xs font-semibold text-amber-200 mb-2.5">
                    اختر خلفية مميزة لمعالم تركيا الفاخرة (Presets):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {TURKEY_HERO_PRESETS.map((preset) => (
                      <button
                        type="button"
                        key={preset.id}
                        onClick={() =>
                          setBrandingForm({
                            ...brandingForm,
                            heroBackgroundImage: preset.url,
                          })
                        }
                        className={`group relative overflow-hidden rounded-2xl border text-right transition-all flex flex-col ${
                          brandingForm.heroBackgroundImage === preset.url
                            ? 'border-amber-400 shadow-[0_0_20px_rgba(212,175,55,0.35)] ring-2 ring-amber-400/50'
                            : 'border-slate-800 hover:border-slate-700 bg-slate-950'
                        }`}
                      >
                        <div className="h-28 w-full overflow-hidden relative">
                          <img
                            src={preset.url}
                            alt={preset.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                          {brandingForm.heroBackgroundImage === preset.url && (
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold flex items-center gap-1 shadow-md">
                              <Check className="h-3 w-3 stroke-[3]" />
                              <span>مفعلة</span>
                            </span>
                          )}
                        </div>
                        <div className="p-3">
                          <span className="text-xs font-bold text-slate-200 block group-hover:text-amber-300 transition-colors">
                            {preset.title}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5 line-clamp-1">
                            {preset.subtitle}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Image Upload for Hero Background */}
                <ImageUploader
                  label="رفع أو تغيير صورة خلفية الهيرو (Hero Background Image)"
                  value={brandingForm.heroBackgroundImage}
                  onChange={(url) => setBrandingForm({ ...brandingForm, heroBackgroundImage: url })}
                  aspectRatio="wide"
                  maxDimension={1920}
                  placeholderUrl="https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1920&q=85"
                  recommendedSize="1920x1080 بكسل عريضة فائقة الدقة"
                  helperText="يمكنك التقاط صورة أو رفعها مباشرة من جهازك أو هاتفك لتغطي واجهة الهيرو بالكامل."
                />

                {/* Opacity Slider */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-amber-200 flex items-center gap-2">
                      <Sliders className="h-4 w-4 text-amber-400" />
                      <span>درجة شفافية صورة الخلفية (Opacity):</span>
                    </label>
                    <span className="px-2.5 py-1 rounded-lg bg-amber-400/20 border border-amber-400/30 text-amber-300 font-mono text-xs font-bold">
                      {Math.round(brandingForm.heroBackgroundOpacity * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.10"
                    max="1.0"
                    step="0.02"
                    value={brandingForm.heroBackgroundOpacity}
                    onChange={(e) =>
                      setBrandingForm({
                        ...brandingForm,
                        heroBackgroundOpacity: parseFloat(e.target.value),
                      })
                    }
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>10% (شفافة جداً، تبرز النجوم وجزيئات الذهب)</span>
                    <span>100% (واضحة تماماً)</span>
                  </div>
                  <p className="text-[11px] text-amber-300/80 mt-1">
                    💡 ملاحظة: تم تطبيق تلاشٍ ناعم تدريجي من الأسفل (Gradual Bottom Gradient Mask) حتى تندمج الخلفية بسلاسة مع خلفية الموقع والمؤثرات التفاعلية.
                  </p>
                </div>
              </div>

              {/* SECTION 2: Top Badge Customization */}
              <div className="rounded-3xl border border-amber-400/20 bg-slate-900/90 p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-slate-100">
                        الشارة العلوية المضيئة (Hero Badge)
                      </h4>
                      <p className="text-xs text-slate-400">
                        الشارة المتحركة ذات النقطة النابضة أعلى العنوان الرئيسي.
                      </p>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={brandingForm.heroBadgeVisible}
                      onChange={(e) =>
                        setBrandingForm({ ...brandingForm, heroBadgeVisible: e.target.checked })
                      }
                      className="accent-amber-400 h-4 w-4 rounded"
                    />
                    <span className="text-xs font-semibold text-slate-300">إظهار الشارة</span>
                  </label>
                </div>

                {brandingForm.heroBadgeVisible && (
                  <div>
                    <label className="block text-xs font-semibold text-amber-200 mb-1.5">
                      نص الشارة العلوية:
                    </label>
                    <input
                      type="text"
                      value={brandingForm.heroBadgeText}
                      onChange={(e) =>
                        setBrandingForm({ ...brandingForm, heroBadgeText: e.target.value })
                      }
                      className="w-full rounded-xl border border-amber-400/25 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* SECTION 3: Hero Headline & Description */}
              <div className="rounded-3xl border border-amber-400/20 bg-slate-900/90 p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="h-10 w-10 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
                    <Crown className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-slate-100">
                      العنوان الملكي والنص التعريفي (Headline & Subtitle)
                    </h4>
                    <p className="text-xs text-slate-400">
                      العنوان المذهب الرئيسي والنص التوضيحي للخدمات الملكية.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-200 mb-1.5">
                    العنوان الرئيسي الفاخر (Hero Headline) *
                  </label>
                  <input
                    type="text"
                    required
                    value={brandingForm.heroHeadline}
                    onChange={(e) =>
                      setBrandingForm({ ...brandingForm, heroHeadline: e.target.value })
                    }
                    className="w-full rounded-xl border border-amber-400/25 bg-slate-950 px-4 py-3 text-sm font-bold text-slate-100 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-200 mb-1.5">
                    النص التعريفي والوصفي (Hero Subtitle)
                  </label>
                  <textarea
                    rows={3}
                    value={brandingForm.heroSubtitle}
                    onChange={(e) =>
                      setBrandingForm({ ...brandingForm, heroSubtitle: e.target.value })
                    }
                    className="w-full rounded-xl border border-amber-400/25 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-amber-400 focus:outline-none leading-relaxed"
                  />
                </div>
              </div>

              {/* SECTION 4: Call To Action Buttons */}
              <div className="rounded-3xl border border-amber-400/20 bg-slate-900/90 p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="h-10 w-10 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
                    <Compass className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-slate-100">
                      أزرار الدعوة للإجراء والحجز (CTA Buttons)
                    </h4>
                    <p className="text-xs text-slate-400">
                      تخصيص نصوص وروابط وإمكانية إظهار/إخفاء أزرار الحجز المباشر واستكشاف الباقات.
                    </p>
                  </div>
                </div>

                {/* Primary Button (WhatsApp) */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-emerald-400" />
                      <span>الزر الرئيسي (الذهبي المشع)</span>
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={brandingForm.heroPrimaryCtaVisible}
                        onChange={(e) =>
                          setBrandingForm({
                            ...brandingForm,
                            heroPrimaryCtaVisible: e.target.checked,
                          })
                        }
                        className="accent-amber-400 h-4 w-4 rounded"
                      />
                      <span className="text-xs text-slate-300">مفعل</span>
                    </label>
                  </div>

                  {brandingForm.heroPrimaryCtaVisible && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">
                          نص الزر الذهبي:
                        </label>
                        <input
                          type="text"
                          value={brandingForm.heroPrimaryCtaText}
                          onChange={(e) =>
                            setBrandingForm({
                              ...brandingForm,
                              heroPrimaryCtaText: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">
                          رابط مخصص للزر (اتركه فارغاً لربطه بواتساب تلقائياً):
                        </label>
                        <input
                          type="text"
                          dir="ltr"
                          placeholder="افتراضي: واتساب المستشار السياحي"
                          value={brandingForm.heroPrimaryCtaCustomUrl}
                          onChange={(e) =>
                            setBrandingForm({
                              ...brandingForm,
                              heroPrimaryCtaCustomUrl: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-100 font-mono text-left focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Secondary Button */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-2">
                      <Compass className="h-4 w-4 text-amber-300" />
                      <span>الزر الثانوي (الشفاف الفاخر)</span>
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={brandingForm.heroSecondaryCtaVisible}
                        onChange={(e) =>
                          setBrandingForm({
                            ...brandingForm,
                            heroSecondaryCtaVisible: e.target.checked,
                          })
                        }
                        className="accent-amber-400 h-4 w-4 rounded"
                      />
                      <span className="text-xs text-slate-300">مفعل</span>
                    </label>
                  </div>

                  {brandingForm.heroSecondaryCtaVisible && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">
                          نص الزر الثانوي:
                        </label>
                        <input
                          type="text"
                          value={brandingForm.heroSecondaryCtaText}
                          onChange={(e) =>
                            setBrandingForm({
                              ...brandingForm,
                              heroSecondaryCtaText: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">
                          وجهة الرابط (مثال: #services أو رابط خارجي):
                        </label>
                        <input
                          type="text"
                          dir="ltr"
                          placeholder="#services"
                          value={brandingForm.heroSecondaryCtaLink}
                          onChange={(e) =>
                            setBrandingForm({
                              ...brandingForm,
                              heroSecondaryCtaLink: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-100 font-mono text-left focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Hero CTAs Instant Save Bar */}
                <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-[11px] text-amber-200/80 text-center sm:text-right">
                    يتم الحفظ والتطبيق فوراً في قاعدة البيانات وتحديث أزرار الهيرو لجميع الزوار.
                  </span>
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl py-2.5 px-6 font-bold text-slate-950 text-xs shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>حفظ أزرار الهيرو في قاعدة البيانات</span>
                  </button>
                </div>
              </div>

              {/* SECTION 5: Trust Credentials Bar */}
              <div className="rounded-3xl border border-amber-400/20 bg-slate-900/90 p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-slate-100">
                        شريط تراخيص الثقة والمصداقية (Trust Bar)
                      </h4>
                      <p className="text-xs text-slate-400">
                        السطر السفلي داخل الواجهة لعرض الترخيص الرسمي والمقر والتوافر.
                      </p>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={brandingForm.heroTrustBarVisible}
                      onChange={(e) =>
                        setBrandingForm({
                          ...brandingForm,
                          heroTrustBarVisible: e.target.checked,
                        })
                      }
                      className="accent-amber-400 h-4 w-4 rounded"
                    />
                    <span className="text-xs font-semibold text-slate-300">إظهار شريط الثقة</span>
                  </label>
                </div>

                {brandingForm.heroTrustBarVisible && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-amber-200 mb-1.5 flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                        <span>عنصر 1: الترخيص الرسمي</span>
                      </label>
                      <input
                        type="text"
                        value={brandingForm.heroTrustText1}
                        onChange={(e) =>
                          setBrandingForm({
                            ...brandingForm,
                            heroTrustText1: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-amber-400/25 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-amber-200 mb-1.5 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-amber-400" />
                        <span>عنصر 2: المقر والمكتب</span>
                      </label>
                      <input
                        type="text"
                        value={brandingForm.heroTrustText2}
                        onChange={(e) =>
                          setBrandingForm({
                            ...brandingForm,
                            heroTrustText2: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-amber-400/25 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-amber-200 mb-1.5 flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5 text-emerald-400" />
                        <span>عنصر 3: كونسيرج والتوافر</span>
                      </label>
                      <input
                        type="text"
                        value={brandingForm.heroTrustText3}
                        onChange={(e) =>
                          setBrandingForm({
                            ...brandingForm,
                            heroTrustText3: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-amber-400/25 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Final Save Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl py-3.5 px-10 font-bold text-slate-950 text-sm sm:text-base shadow-[0_0_25px_rgba(212,175,55,0.35)] hover:shadow-[0_0_35px_rgba(212,175,55,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #FFF0B3 0%, #D4AF37 45%, #AA771C 80%, #F5DE93 100%)',
                  }}
                >
                  <Save className="h-4 w-4" />
                  <span>حفظ جميع إعدادات الواجهة الرئيسية</span>
                </button>
              </div>

            </form>
          </motion.div>
        )}

      </div>

      {/* Service Create / Edit Modal */}
      <AnimatePresence>
        {isServiceModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsServiceModalOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl rounded-3xl border border-amber-400/30 bg-slate-900 p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto text-right"
            >
              <button
                onClick={() => setIsServiceModalOpen(false)}
                className="absolute top-5 left-5 p-2 rounded-full border border-slate-700 text-slate-400 hover:text-amber-300"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-xl font-bold text-gold-gradient mb-4">
                {editingServiceId ? 'تعديل الخدمة السياحية' : 'إضافة خدمة سياحية جديدة'}
              </h3>

              <form onSubmit={handleSaveService} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-amber-200 mb-1">
                    اسم الخدمة باللغة العربية *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: رحلة يخت خاص في البوسفور"
                    value={serviceFormData.title}
                    onChange={(e) =>
                      setServiceFormData({ ...serviceFormData, title: e.target.value })
                    }
                    className="w-full rounded-xl border border-amber-400/25 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-amber-200 mb-1">
                      الاسم بالإنجليزية (English)
                    </label>
                    <input
                      type="text"
                      placeholder="Bosphorus Luxury Yacht"
                      value={serviceFormData.englishTitle}
                      onChange={(e) =>
                        setServiceFormData({ ...serviceFormData, englishTitle: e.target.value })
                      }
                      className="w-full rounded-xl border border-amber-400/25 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-amber-200 mb-1">
                      المدينة / الوجهة *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="إسطنبول، طرابزون، كابادوكيا..."
                      value={serviceFormData.destination}
                      onChange={(e) =>
                        setServiceFormData({ ...serviceFormData, destination: e.target.value })
                      }
                      className="w-full rounded-xl border border-amber-400/25 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-amber-200 mb-1">
                      السعر (بالدولار USD) *
                    </label>
                    <input
                      type="number"
                      required
                      value={serviceFormData.price}
                      onChange={(e) =>
                        setServiceFormData({ ...serviceFormData, price: Number(e.target.value) })
                      }
                      className="w-full rounded-xl border border-amber-400/25 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-amber-200 mb-1">
                      شارة التميز (Badge)
                    </label>
                    <input
                      type="text"
                      placeholder="VIP، الأكثر طلباً، ملكي..."
                      value={serviceFormData.badge}
                      onChange={(e) =>
                        setServiceFormData({ ...serviceFormData, badge: e.target.value })
                      }
                      className="w-full rounded-xl border border-amber-400/25 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100"
                    />
                  </div>
                </div>

                <ImageUploader
                  label="صورة الخدمة / الجولة السياحية الفاخرة *"
                  value={serviceFormData.imageUrl}
                  onChange={(url) =>
                    setServiceFormData({ ...serviceFormData, imageUrl: url })
                  }
                  aspectRatio="landscape"
                  maxDimension={1200}
                  recommendedSize="1200x800 بكسل"
                  helperText="اختر صورة عالية الدقة من جهازك أو هاتفك (لليخت، أو السيارة، أو الفندق)، أو ضع رابطاً خارجياً."
                />

                <div>
                  <label className="block text-xs font-semibold text-amber-200 mb-1">
                    الوصف التفصيلي *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="اكتب وصفاً جذاباً يعكس الفخامة ومستوى الرفاهية..."
                    value={serviceFormData.description}
                    onChange={(e) =>
                      setServiceFormData({ ...serviceFormData, description: e.target.value })
                    }
                    className="w-full rounded-xl border border-amber-400/25 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-200 mb-1">
                    المميزات (اكتب كل ميزة في سطر منفصل)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="يخت خاص 75 قدماً&#10;شيف تركي خاص&#10;سيارة مايباخ مع سائق"
                    value={serviceFormData.featuresString}
                    onChange={(e) =>
                      setServiceFormData({ ...serviceFormData, featuresString: e.target.value })
                    }
                    className="w-full rounded-xl border border-amber-400/25 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsServiceModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs text-slate-400 hover:text-slate-200"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl font-bold text-slate-950 text-xs shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                    style={{
                      background: 'linear-gradient(135deg, #FFF0B3 0%, #D4AF37 45%, #AA771C 80%, #F5DE93 100%)',
                    }}
                  >
                    حفظ الخدمة
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Standards Create / Edit Modal */}
      <AnimatePresence>
        {isStandardModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsStandardModalOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-3xl border border-amber-400/30 bg-slate-900 p-6 sm:p-8 shadow-2xl z-10 text-right"
            >
              <button
                onClick={() => setIsStandardModalOpen(false)}
                className="absolute top-5 left-5 p-2 rounded-full border border-slate-700 text-slate-400 hover:text-amber-300"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-xl font-bold text-gold-gradient mb-4">
                {editingStandardId ? 'تعديل معيار الضيافة الملكية' : 'إضافة معيار ضيافة جديد'}
              </h3>

              <form onSubmit={handleSaveStandard} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-amber-200 mb-1">
                    عنوان المعيار *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: استقبال Fast Track من باب الطائرة"
                    value={standardFormData.title}
                    onChange={(e) =>
                      setStandardFormData({ ...standardFormData, title: e.target.value })
                    }
                    className="w-full rounded-xl border border-amber-400/25 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-200 mb-1">
                    الوصف التوضيحي *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="اكتب شرحاً موجزاً للميزة أو الخدمة المقدمة..."
                    value={standardFormData.description}
                    onChange={(e) =>
                      setStandardFormData({ ...standardFormData, description: e.target.value })
                    }
                    className="w-full rounded-xl border border-amber-400/25 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-200 mb-1">
                    الأيقونة الرمزية
                  </label>
                  <select
                    value={standardFormData.icon}
                    onChange={(e) =>
                      setStandardFormData({
                        ...standardFormData,
                        icon: e.target.value as HospitalityStandard['icon'],
                      })
                    }
                    className="w-full rounded-xl border border-amber-400/25 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100"
                  >
                    <option value="award">شارة تقدير وترخيص (Award)</option>
                    <option value="plane">طيران واستقبال مطار (Plane)</option>
                    <option value="car">سيارات مرسيدس ومايباخ (Car)</option>
                    <option value="headset">خدمة عملاء وكونسيرج (Headset)</option>
                    <option value="shield">أمان وخصوصية (Shield)</option>
                    <option value="star">نجمة فندقية (Star)</option>
                    <option value="clock">خدمة 24 ساعة (Clock)</option>
                    <option value="heart">عناية خاصة وراحة (Heart)</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsStandardModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl font-bold text-slate-950 text-xs shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                    style={{
                      background: 'linear-gradient(135deg, #FFF0B3 0%, #D4AF37 45%, #AA771C 80%, #F5DE93 100%)',
                    }}
                  >
                    حفظ المعيار
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

      </AnimatePresence>

    </div>
  );
};
