export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface TourismService {
  id: string;
  title: string;
  englishTitle: string;
  description: string;
  price: number;
  currency: string;
  badge: string;
  imageUrl: string;
  destination: string;
  features: string[];
  createdAt?: string;
}

export interface Review {
  id: string;
  serviceId: string;
  authorName: string;
  rating: number; // 1 to 5
  comment: string;
  status: ReviewStatus;
  createdAt: string;
  location?: string;
}

export type SocialPlatform = 'whatsapp' | 'instagram' | 'telegram' | 'tiktok' | 'facebook' | 'youtube' | 'phone' | 'x' | 'snapchat' | 'linkedin';

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  label: string;
  url: string;
  isActive: boolean;
  description?: string;
  badge?: string;
  actionText?: string;
}

export interface HospitalityStandard {
  id: string;
  title: string;
  description: string;
  icon: 'award' | 'plane' | 'car' | 'headset' | 'shield' | 'star' | 'clock' | 'heart';
}

export interface SiteSettings {
  nameAr: string;
  nameEn: string;
  sloganAr: string;
  logoType: 'icon' | 'image';
  logoIcon: 'crown' | 'diamond' | 'compass' | 'star' | 'shield';
  logoImageUrl: string;
  tursabLicense: string;
  headquarters: string;
  
  // تخصيص عناصر القسم الرئيسي (Hero Section)
  heroBackgroundImage?: string;
  heroBackgroundOpacity?: number; // 0.1 إلى 1.0 (الافتراضي 0.38)
  heroBadgeText?: string;
  heroBadgeVisible?: boolean;
  heroHeadline?: string;
  heroSubtitle?: string;
  heroPrimaryCtaText?: string;
  heroPrimaryCtaCustomUrl?: string;
  heroPrimaryCtaVisible?: boolean;
  heroSecondaryCtaText?: string;
  heroSecondaryCtaLink?: string;
  heroSecondaryCtaVisible?: boolean;
  heroTrustText1?: string;
  heroTrustText2?: string;
  heroTrustText3?: string;
  heroTrustBarVisible?: boolean;

  // تخصيص عناصر حاوية طرق التواصل بالكامل (Contact Methods Container)
  contactBadgeText?: string;
  contactBadgeVisible?: boolean;
  contactTitle?: string;
  contactSubtitle?: string;
  contactWhatsAppVisible?: boolean;
  contactWhatsAppTitle?: string;
  contactWhatsAppBadge?: string;
  contactWhatsAppDescription?: string;
  contactWhatsAppButtonText?: string;
  contactWhatsAppNumber?: string;
  contactWhatsAppDefaultMessage?: string;
  contactTrustBarVisible?: boolean;
  contactLicenseText?: string;
  contactSupportHours?: string;
  contactHeadquartersText?: string;
}

export interface AdminUser {
  email: string;
  isAuthenticated: boolean;
  isDemo: boolean;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
}

export type ThemeMode = 'dark' | 'light';
