'use client';
import { useLocale } from 'next-intl';
import { products } from '@/lib/data';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { Link } from '@/lib/i18n/routing';
import { motion } from 'framer-motion';
import { useCart } from '@/components/CartProvider';
import { useState } from 'react';

export default function ProductCarousel({ 
  title = "Trending Now",
  startIndex = 0
}: { 
  title?: string;
  startIndex?: number;
}) {
  const language = useLocale().toUpperCase();
  const isRTL = language === 'AR';
  const { addToCart } = useCart();
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());

  const trendingLinks = language === 'AR' 
    ? ['الأساسيات', 'وصل حديثاً', 'شورتات', 'فساتين']
    : ['Heatwave Essentials', 'New Arrivals', 'Jorts & Bermudas', 'Dresses'];

  const allProducts = [...products, ...products, ...products]; 
  const displayProducts = allProducts.slice(startIndex, startIndex + 4);

  const handleAddToCart = (productId: number) => {
    addToCart({ productId, quantity: 1, selectedSize: 'M', selectedColor: 'Default' });
    setAddedIds(prev => new Set(prev).add(productId));
    setTimeout(() => {
      setAddedIds(prev => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }, 1500);
  };

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
        
        <div className={`hidden sm:flex flex-wrap items-center gap-4 lg:gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
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
        className="flex gap-3 lg:gap-6 overflow-x-auto snap-x snap-mandatory pb-4" 
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {displayProducts.map((product, idx) => (
          <motion.div 
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
            }}
            key={`${product.id}-${idx}`} 
            className="w-[38vw] min-w-[38vw] sm:w-[32vw] sm:min-w-[32vw] md:w-[26vw] md:min-w-[26vw] lg:w-[20vw] lg:min-w-[20vw] flex-shrink-0 snap-start group relative flex flex-col"
          >
            <Link 
              href="/shop"
              className="relative aspect-[3/4] overflow-hidden bg-brand-pinkishwhite mb-2 cursor-pointer block rounded-lg"
            >
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {product.badge && (
                <span className="absolute top-2 left-2 bg-brand-darkred text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">
                  {product.badge}
                </span>
              )}
              <button 
                onClick={(e) => e.preventDefault()}
                className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'} p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-brand-hotpink bg-white/80 shadow-sm`}
              >
                <Heart className="w-4 h-4" />
              </button>
            </Link>
            
            <div className={`flex flex-col flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
              <p className="text-xs text-gray-700 font-semibold line-clamp-2 px-0.5 leading-snug min-h-[2rem]">
                {product.name}
              </p>
              <div className={`mt-1 flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                <span className="text-brand-darkred font-black text-sm">{(product.price * 150).toFixed(0)} DZD</span>
                {product.originalPrice && (
                  <span className="text-gray-400 text-xs line-through">{(product.originalPrice * 150).toFixed(0)}</span>
                )}
              </div>
              
              <div className="mt-2">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAddToCart(product.id)}
                  className={`w-full font-bold uppercase tracking-widest py-2 text-[10px] rounded-md flex items-center justify-center gap-1.5 transition-all duration-300 ${
                    addedIds.has(product.id)
                      ? 'bg-green-500 text-white border border-green-500'
                      : 'bg-white border border-brand-darkred text-brand-darkred hover:bg-brand-darkred hover:text-white'
                  }`}
                >
                  {addedIds.has(product.id) ? (
                    <>
                      <Check className="w-3 h-3" />
                      {language === 'AR' ? 'تمت الإضافة!' : 'Added!'}
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3 h-3" />
                      {language === 'AR' ? 'أضف للسلة' : 'Add to Cart'}
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
