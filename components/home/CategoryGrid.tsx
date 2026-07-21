'use client';
import { useLocale } from 'next-intl';
import { Link } from '@/lib/i18n/routing';
import { motion } from 'framer-motion';

export default function CategoryGrid() {
  const language = useLocale().toUpperCase();
  
  const categories = [
    {
      id: 1,
      name: language === 'AR' ? "وصل حديثاً" : "NEW IN",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 2,
      name: language === 'AR' ? "فساتين تحت 15£" : "DRESSES UNDER £15",
      image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 3,
      name: language === 'AR' ? "10£ وأقل" : "£10 & UNDER",
      image: "https://images.unsplash.com/photo-1550614000-4b95d4edfa25?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 4,
      name: language === 'AR' ? "ملابس سباحة تحت 15£" : "SWIM UNDER £15",
      image: "https://images.unsplash.com/photo-1563630381190-77c336ea545a?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 5,
      name: language === 'AR' ? "الأكثر مبيعاً" : "BEST SELLERS",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 6,
      name: language === 'AR' ? "ملابس نوم" : "NIGHTWEAR",
      image: "https://images.unsplash.com/photo-1512413914564-219d36e26715?auto=format&fit=crop&q=80&w=800"
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <section className="w-full mt-1 px-1 mb-12">
      <div className="container mx-auto text-center mb-8">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-black uppercase tracking-tight text-brand-darkred mt-12" 
          style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
        >
          {language === 'AR' ? 'الأقسام' : 'CATEGORIES'}
        </motion.h2>
      </div>
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-2 gap-2 w-full container mx-auto"
      >
        {categories.map((category) => (
          <motion.div key={category.id} variants={item}>
            <Link 
              href="/shop"
              className="group relative block aspect-[3/4] sm:aspect-[4/5] md:aspect-square overflow-hidden bg-brand-pinkishwhite cursor-pointer"
            >
              <img 
                src={category.image} 
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500"></div>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <span className="text-white font-medium text-lg md:text-xl xl:text-2xl text-center uppercase tracking-wider drop-shadow-md mb-2">
                  {category.name}
                </span>
                <span className="bg-white/20 backdrop-blur-md text-white border border-white/50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest opacity-0 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {language === 'AR' ? 'تسوق الآن' : 'Shop Now'}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
