'use client';

import { useLocale } from 'next-intl';
import { Link, useRouter } from '@/lib/i18n/routing';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const categories = [
  { id: 1, nameEn: 'Womens', nameAr: 'نسائي', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800', href: '/shop' },
  { id: 2, nameEn: 'Dresses', nameAr: 'فساتين', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=800', href: '/shop' },
  { id: 3, nameEn: 'Summer', nameAr: 'صيفي', image: 'https://images.unsplash.com/photo-1523359264871-6141444fa2f2?auto=format&fit=crop&q=80&w=800', href: '/shop' },
  { id: 4, nameEn: 'Accessories', nameAr: 'إكسسوارات', image: 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&q=80&w=800', href: '/shop' },
  { id: 5, nameEn: 'Beauty', nameAr: 'تجميل', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=800', href: '/shop' },
  { id: 6, nameEn: 'Sale', nameAr: 'تخفيضات', image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&q=80&w=800', href: '/shop' },
];

export default function CategoriesPage() {
  const language = useLocale().toUpperCase();
  const isRTL = language === 'AR';
  const router = useRouter();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <motion.button 
        initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-brand-darkred mb-8 transition-colors"
      >
        {isRTL ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        <span className="font-medium">
          {language === 'AR' ? 'رجوع' : 'Back'}
        </span>
      </motion.button>

      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-black uppercase tracking-tight text-brand-darkred text-center mb-12" 
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {language === 'AR' ? 'تسوقي حسب القسم' : 'Shop by Category'}
      </motion.h1>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {categories.map((category, idx) => (
          <motion.div variants={item} key={category.id}>
            <Link 
              href={category.href}
              className="relative h-[300px] md:h-[400px] flex items-center justify-center overflow-hidden group rounded-lg"
            >
              <img 
                src={category.image} 
                alt={language === 'AR' ? category.nameAr : category.nameEn}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
              
              <div className="relative z-10 text-center">
                <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-widest mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {language === 'AR' ? category.nameAr : category.nameEn}
                </h3>
                <span className="inline-block bg-white text-brand-darkred px-6 py-2 text-sm font-bold uppercase tracking-widest hover:bg-brand-darkred hover:text-white transition-colors cursor-pointer">
                  {language === 'AR' ? 'تسوقي الآن' : 'Shop Now'}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
