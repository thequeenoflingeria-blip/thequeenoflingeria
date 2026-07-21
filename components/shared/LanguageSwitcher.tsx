'use client';

import { usePathname, useRouter } from '@/lib/i18n/routing';
import { useLocale } from 'next-intl';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const nextLocale = locale === 'ar' ? 'en' : 'ar';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-1 rounded-full border border-border hover:border-border-bright transition-colors text-sm font-semibold tracking-widest uppercase text-cream"
    >
      {locale === 'ar' ? 'EN' : 'عربي'}
    </button>
  );
}
