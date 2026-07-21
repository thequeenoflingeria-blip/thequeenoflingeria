'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/lib/i18n/routing';
import { FaInstagram, FaFacebookF, FaSnapchatGhost, FaTiktok, FaWhatsapp } from 'react-icons/fa';

const socialLinks = [
  {
    name: 'Instagram',
    href: '#',
    icon: <FaInstagram className="w-5 h-5" />
  },
  {
    name: 'Facebook',
    href: '#',
    icon: <FaFacebookF className="w-4 h-4" />
  },
  {
    name: 'Snapchat',
    href: '#',
    icon: <FaSnapchatGhost className="w-5 h-5" />
  },
  {
    name: 'TikTok',
    href: '#',
    icon: <FaTiktok className="w-4 h-4" />
  },
  {
    name: 'WhatsApp',
    href: '#',
    icon: <FaWhatsapp className="w-5 h-5" />
  },
];

export default function Footer() {
  const language = useLocale().toUpperCase();
  const isRTL = language === 'AR';

  return (
    <footer className="bg-brand-hotpink text-white pt-14 pb-8 mt-16 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-white/20" />
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Brand */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight lowercase text-white mb-2" 
            style={{ fontFamily: "'Playfair Display', serif" }}>
            the queen of lingerie
          </h2>
          <p className="text-white/80 text-sm font-light">
            {isRTL ? 'الأناقة والجمال في كل تفصيل' : 'Elegance & beauty in every detail'}
          </p>
        </div>

        {/* Social Icons */}
        <div className={`flex items-center justify-center gap-4 sm:gap-5 mb-10 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {socialLinks.map((social) => (
            <a 
              key={social.name}
              href={social.href} 
              aria-label={social.name}
              className="w-12 h-12 bg-white/20 hover:bg-white/30 border border-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-sm"
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 mb-8" />

        {/* Links */}
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-white/80 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          <div className={`flex flex-wrap justify-center gap-4 sm:gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Link href="/terms" className="hover:text-white transition-colors hover:underline underline-offset-4" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
              {language === 'AR' ? 'الشروط والأحكام' : 'Terms & Conditions'}
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors hover:underline underline-offset-4" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
              {language === 'AR' ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </Link>
            <Link href="/shop" className="hover:text-white transition-colors hover:underline underline-offset-4" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
              {language === 'AR' ? 'المتجر' : 'Shop'}
            </Link>
          </div>
          <span className="text-[11px] text-white/70" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
            © {new Date().getFullYear()} The Queen of Lingerie. {language === 'AR' ? 'جميع الحقوق محفوظة.' : 'All Rights Reserved.'}
          </span>
        </div>
      </div>
    </footer>
  );
}
