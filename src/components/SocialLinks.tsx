import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle, Instagram, Send, Video, Facebook, Youtube, Phone, Mail } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';

export const SocialLinks: React.FC = () => {
  const socials = [
    {
      name: 'واتساب VIP',
      englishName: 'WhatsApp',
      url: SITE_CONFIG.socialMedia.whatsapp,
      icon: <MessageCircle className="h-5 w-5" />,
      color: 'hover:text-emerald-400 hover:border-emerald-500/60 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]',
    },
    {
      name: 'انستغرام',
      englishName: 'Instagram',
      url: SITE_CONFIG.socialMedia.instagram,
      icon: <Instagram className="h-5 w-5" />,
      color: 'hover:text-pink-400 hover:border-pink-500/60 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]',
    },
    {
      name: 'تيليجرام',
      englishName: 'Telegram',
      url: SITE_CONFIG.socialMedia.telegram,
      icon: <Send className="h-5 w-5" />,
      color: 'hover:text-sky-400 hover:border-sky-500/60 hover:shadow-[0_0_20px_rgba(56,189,248,0.3)]',
    },
    {
      name: 'تيك توك',
      englishName: 'TikTok',
      url: SITE_CONFIG.socialMedia.tiktok,
      icon: <Video className="h-5 w-5" />,
      color: 'hover:text-amber-300 hover:border-amber-400/60 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]',
    },
    {
      name: 'فيسبوك',
      englishName: 'Facebook',
      url: SITE_CONFIG.socialMedia.facebook,
      icon: <Facebook className="h-5 w-5" />,
      color: 'hover:text-blue-400 hover:border-blue-500/60 hover:shadow-[0_0_20px_rgba(96,165,250,0.3)]',
    },
    {
      name: 'يوتيوب',
      englishName: 'YouTube',
      url: SITE_CONFIG.socialMedia.youtube,
      icon: <Youtube className="h-5 w-5" />,
      color: 'hover:text-red-400 hover:border-red-500/60 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]',
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center my-10">
      <div className="flex items-center gap-2 mb-4">
        <span className="h-[1px] w-10 bg-gradient-to-r from-transparent to-amber-400/40" />
        <span className="text-xs uppercase tracking-widest text-amber-300/80 font-medium">
          قنوات التواصل الرسمية لدار النخبة
        </span>
        <span className="h-[1px] w-10 bg-gradient-to-l from-transparent to-amber-400/40" />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        {socials.map((item, index) => (
          <motion.a
            key={item.englishName}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -5, scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className={`group relative flex items-center justify-center h-12 w-12 rounded-2xl border border-amber-400/20 bg-slate-900/80 text-slate-300 backdrop-blur-xl transition-all duration-300 ${item.color}`}
            title={item.name}
          >
            {item.icon}
          </motion.a>
        ))}

        {/* Direct Phone Call Button */}
        <motion.a
          href={`tel:${SITE_CONFIG.contact.whatsappNumber}`}
          whileHover={{ y: -5, scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="group relative flex items-center justify-center h-12 w-12 rounded-2xl border border-amber-400/20 bg-slate-900/80 text-slate-300 hover:text-amber-300 hover:border-amber-400/70 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] backdrop-blur-xl transition-all duration-300"
          title="اتصال هاتفي مباشر"
        >
          <Phone className="h-5 w-5" />
        </motion.a>

        {/* Direct Email Button */}
        <motion.a
          href={`mailto:${SITE_CONFIG.contact.email}`}
          whileHover={{ y: -5, scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="group relative flex items-center justify-center h-12 w-12 rounded-2xl border border-amber-400/20 bg-slate-900/80 text-slate-300 hover:text-amber-300 hover:border-amber-400/70 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] backdrop-blur-xl transition-all duration-300"
          title="مراسلة عبر البريد الإلكتروني"
        >
          <Mail className="h-5 w-5" />
        </motion.a>
      </div>
    </div>
  );
};
