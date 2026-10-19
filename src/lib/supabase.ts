import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default Supabase project credentials provided by the user
export const DEFAULT_SUPABASE_URL = 'https://lxltvxpxngzbljwiznfd.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4bHR2eHB4bmd6Ymxqd2l6bmZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzNDY0NDAsImV4cCI6MjEwNzkyMjQ0MH0.A7WystLsbxB6n57VdisUFcYEanopQy0VpeuvvhqtycE';

// Read from env, localStorage or default
export const getActiveSupabaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('CUSTOM_SUPABASE_URL');
    if (custom) return custom;
  }
  return import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
};

export const getActiveSupabaseAnonKey = (): string => {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('CUSTOM_SUPABASE_ANON_KEY');
    if (custom) return custom;
  }
  return import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;
};

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (client) return client;

  const url = getActiveSupabaseUrl();
  const key = getActiveSupabaseAnonKey();

  if (url && key && url.startsWith('http')) {
    try {
      client = createClient(url, key);
      return client;
    } catch (e) {
      console.warn('Supabase initialization failed:', e);
      return null;
    }
  }
  return null;
}

export function resetSupabaseClient(url: string, key: string) {
  if (typeof window !== 'undefined') {
    if (url && key) {
      localStorage.setItem('CUSTOM_SUPABASE_URL', url.trim());
      localStorage.setItem('CUSTOM_SUPABASE_ANON_KEY', key.trim());
    } else {
      localStorage.removeItem('CUSTOM_SUPABASE_URL');
      localStorage.removeItem('CUSTOM_SUPABASE_ANON_KEY');
    }
  }
  client = null;
  return getSupabaseClient();
}

/**
 * جاهز للنسخ في محرر SQL في Supabase
 */
export const SUPABASE_SQL_SCHEMA = `-- ==============================================================================
-- دار النخبة للسياحة الفاخرة في تركيا | ELITE TURKEY VIP LUXURY TRAVEL
-- سكربت قاعدة البيانات الكاملة في Supabase (شامل الجداول، الحقول، والمصادقة)
-- ==============================================================================

-- 1. جدول الخدمات والجولات السياحية الفاخرة (services)
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    english_title TEXT,
    description TEXT NOT NULL,
    price NUMERIC NOT NULL,
    currency TEXT DEFAULT 'USD',
    badge TEXT DEFAULT 'VIP',
    image_url TEXT NOT NULL,
    destination TEXT NOT NULL,
    features JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. جدول تقييمات وتعليقات الضيوف مع حالة التدقيق والمراجعة (reviews)
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    service_id TEXT,
    author_name TEXT NOT NULL,
    location TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT NOT NULL,
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. جدول قنوات وروابط التواصل الاجتماعي والواتساب المخصص (social_links)
CREATE TABLE IF NOT EXISTS public.social_links (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    platform TEXT NOT NULL,
    label TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    badge TEXT,
    action_text TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- تحديث الحقول في حال كان جدول social_links منشأ مسبقاً
ALTER TABLE public.social_links ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.social_links ADD COLUMN IF NOT EXISTS badge TEXT;
ALTER TABLE public.social_links ADD COLUMN IF NOT EXISTS action_text TEXT;

-- 4. جدول إعدادات الموقع، الهيدر، الهيرو وحاوية التواصل الكاملة (site_settings)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'primary',
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slogan_ar TEXT,
    logo_type TEXT DEFAULT 'icon',
    logo_icon TEXT DEFAULT 'crown',
    logo_image_url TEXT,
    tursab_license TEXT,
    headquarters TEXT,
    
    -- تخصيص واجهة وقسم الهيرو
    hero_headline TEXT,
    hero_subtitle TEXT,
    hero_badge_text TEXT,
    hero_badge_visible BOOLEAN DEFAULT true,
    hero_primary_cta_text TEXT,
    hero_primary_cta_custom_url TEXT,
    hero_primary_cta_visible BOOLEAN DEFAULT true,
    hero_secondary_cta_text TEXT,
    hero_secondary_cta_link TEXT,
    hero_secondary_cta_visible BOOLEAN DEFAULT true,
    hero_background_image TEXT,
    hero_background_opacity NUMERIC DEFAULT 0.38,
    hero_trust_text_1 TEXT,
    hero_trust_text_2 TEXT,
    hero_trust_text_3 TEXT,
    hero_trust_bar_visible BOOLEAN DEFAULT true,
    
    -- تخصيص حاوية طرق التواصل بالكامل
    contact_badge_text TEXT,
    contact_badge_visible BOOLEAN DEFAULT true,
    contact_title TEXT,
    contact_subtitle TEXT,
    contact_whats_app_number TEXT,
    contact_whats_app_default_message TEXT,
    contact_whats_app_title TEXT,
    contact_whats_app_badge TEXT,
    contact_whats_app_description TEXT,
    contact_whats_app_button_text TEXT,
    contact_whats_app_visible BOOLEAN DEFAULT true,
    contact_trust_bar_visible BOOLEAN DEFAULT true,
    contact_license_text TEXT,
    contact_support_hours TEXT,
    contact_headquarters_text TEXT,
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- تحديث حقول جدول site_settings في حال كان منشأ مسبقاً
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS hero_headline TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS hero_subtitle TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS hero_badge_text TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS hero_badge_visible BOOLEAN DEFAULT true;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS hero_primary_cta_text TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS hero_primary_cta_custom_url TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS hero_primary_cta_visible BOOLEAN DEFAULT true;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS hero_secondary_cta_text TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS hero_secondary_cta_link TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS hero_secondary_cta_visible BOOLEAN DEFAULT true;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS hero_background_image TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS hero_background_opacity NUMERIC DEFAULT 0.38;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS hero_trust_text_1 TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS hero_trust_text_2 TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS hero_trust_text_3 TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS hero_trust_bar_visible BOOLEAN DEFAULT true;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS contact_badge_text TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS contact_badge_visible BOOLEAN DEFAULT true;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS contact_title TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS contact_subtitle TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS contact_whats_app_number TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS contact_whats_app_default_message TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS contact_whats_app_title TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS contact_whats_app_badge TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS contact_whats_app_description TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS contact_whats_app_button_text TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS contact_whats_app_visible BOOLEAN DEFAULT true;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS contact_trust_bar_visible BOOLEAN DEFAULT true;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS contact_license_text TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS contact_support_hours TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS contact_headquarters_text TEXT;

-- 5. جدول معايير الضيافة الملكية (hospitality_standards)
CREATE TABLE IF NOT EXISTS public.hospitality_standards (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT DEFAULT 'award',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. جدول مدراء لوحة التحكم المعتمدين في قاعدة البيانات (admin_users)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إضافة حساب المدير المعتمد افتراضياً (يمكن تغييره من لوحة التحكم)
INSERT INTO public.admin_users (email, password, name, role)
VALUES ('admin@eliteturkey.com', 'Admin@2025', 'المدير التنفيذي', 'admin')
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.admin_users (email, password, name, role)
VALUES ('3lishops@gmail.com', 'admin123456', 'مدير النظام', 'superadmin')
ON CONFLICT (email) DO NOTHING;

-- 7. تفعيل Row Level Security (RLS)
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospitality_standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 8. سياسات الأمان للقراءة العامة (Public Access)
DROP POLICY IF EXISTS "Public Read Services" ON public.services;
CREATE POLICY "Public Read Services" ON public.services FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Approved Reviews" ON public.reviews;
CREATE POLICY "Public Read Approved Reviews" ON public.reviews FOR SELECT USING (status = 'approved');

DROP POLICY IF EXISTS "Public Insert Pending Reviews" ON public.reviews;
CREATE POLICY "Public Insert Pending Reviews" ON public.reviews FOR INSERT WITH CHECK (status = 'pending');

DROP POLICY IF EXISTS "Public Read Social Links" ON public.social_links;
CREATE POLICY "Public Read Social Links" ON public.social_links FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public Read Settings" ON public.site_settings;
CREATE POLICY "Public Read Settings" ON public.site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Standards" ON public.hospitality_standards;
CREATE POLICY "Public Read Standards" ON public.hospitality_standards FOR SELECT USING (true);

-- 9. سياسات الصلاحية الكاملة للعمليات
DROP POLICY IF EXISTS "Admin Full Services" ON public.services;
CREATE POLICY "Admin Full Services" ON public.services FOR ALL USING (true);

DROP POLICY IF EXISTS "Admin Full Reviews" ON public.reviews;
CREATE POLICY "Admin Full Reviews" ON public.reviews FOR ALL USING (true);

DROP POLICY IF EXISTS "Admin Full Socials" ON public.social_links;
CREATE POLICY "Admin Full Socials" ON public.social_links FOR ALL USING (true);

DROP POLICY IF EXISTS "Admin Full Settings" ON public.site_settings;
CREATE POLICY "Admin Full Settings" ON public.site_settings FOR ALL USING (true);

DROP POLICY IF EXISTS "Admin Full Standards" ON public.hospitality_standards;
CREATE POLICY "Admin Full Standards" ON public.hospitality_standards FOR ALL USING (true);

DROP POLICY IF EXISTS "Admin Users Access" ON public.admin_users;
CREATE POLICY "Admin Users Access" ON public.admin_users FOR ALL USING (true);
`;
