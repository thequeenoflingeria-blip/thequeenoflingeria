'use client';
import { useLocale } from 'next-intl';
import { products } from '@/lib/data';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from '@/lib/i18n/routing';
import { motion } from 'framer-motion';

export default function ProductCarousel({ 
  title = "Trending Now",
  startIndex = 0
}: { 
  title?: string;
  startIndex?: number;
}) {
  const language = useLocale().toUpperCase();
  const trendingLinks = language === 'AR' 
    ? ['الأساسيات', 'وصل حديثاً', 'شورتات', 'فساتين']
    : ['Heatwave Essentials', 'New Arrivals', 'Jorts & Bermudas', 'Dresses'];

  const allProducts = [...products, ...products, ...products]; 
  const displayProducts = allProducts.slice(startIndex, startIndex + 4);
  const isRTL = language === 'AR';

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      
      {/* Header Area */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-4 ${isRTL ? 'lg:flex-row-reverse text-right' : ''}`}
      >
        <div>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-2 uppercase">{title}</h3>
        </div>
        
        <div className={`flex flex-wrap items-center gap-4 lg:gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {trendingLinks.map((link, idx) => (
            <Link 
              key={link} 
              href="/shop" 
              className={`text-sm md:text-base font-light hover:underline underline-offset-4 ${
                idx === 0 ? 'text-[#a55269]' : 'text-gray-600'
              }`}
            >
              {link}
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Product Grid / Carousel */}
      <motion.div 
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
        className="flex gap-4 lg:gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide" 
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {displayProducts.map((product, idx) => (
          <motion.div 
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
            }}
            key={`${product.id}-${idx}`} 
            className="min-w-[60vw] sm:min-w-[40vw] md:min-w-[30vw] lg:min-w-[22vw] flex-1 snap-start group relative flex flex-col"
          >
            <Link 
              href="/shop"
              className="relative aspect-[3/4] overflow-hidden bg-brand-pinkishwhite mb-3 cursor-pointer block"
            >
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <button 
                onClick={(e) => e.preventDefault()}
                className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-brand-hotpink bg-brand-pinkishwhite shadow-sm`}
              >
                <Heart className="w-5 h-5" />
              </button>
            </Link>
            
            <div className={`flex flex-col flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Link 
                href="/shop"
                className="text-sm text-gray-700 font-medium truncate px-1 cursor-pointer hover:underline"
              >
                {product.name}
              </Link>
              <div className={`mt-1 flex items-center gap-2 px-1 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                <span className="text-brand-darkred font-bold">£{product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-gray-400 text-sm line-through">£{product.originalPrice.toFixed(2)}</span>
                )}
              </div>
              
              <div className="mt-auto pt-4">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.preventDefault();
                    // trigger cart shake here ideally
                    const event = new CustomEvent('add-to-cart');
                    window.dispatchEvent(event);
                  }}
                  className="w-full bg-brand-pinkishwhite border border-brand-darkred text-brand-darkred font-bold uppercase tracking-widest py-2.5 text-xs hover:bg-brand-darkred hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {language === 'AR' ? 'أضف للسلة' : 'Add to Cart'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
