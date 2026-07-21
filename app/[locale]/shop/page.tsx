'use client';

import { useState, Suspense } from 'react';
import { products } from '@/lib/data';
import { Heart, ShoppingBag, ChevronRight, ChevronLeft, Check, Sparkles } from 'lucide-react';
import { useLocale } from 'next-intl';
import { Link, useRouter } from '@/lib/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/components/CartProvider';

function ShopContent() {
  const language = useLocale().toUpperCase();
  const isRTL = language === 'AR';
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());
  const { addToCart } = useCart();
  
  // Always show products, filter when there's a query
  let displayProducts = products;
  if (searchQuery.trim()) {
    displayProducts = displayProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }

  const handleAddToCart = (productId: number) => {
    addToCart({ productId, quantity: 1, selectedColor: 'Default', selectedSize: 'M' });
    setAddedIds(prev => new Set(prev).add(productId));
    setTimeout(() => {
      setAddedIds(prev => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }, 2000);
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } }
  };

  const item = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 26 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-pinkishwhite/30 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        {/* Back button */}
        <motion.button 
          initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className={`flex items-center gap-2 text-gray-400 hover:text-brand-darkred mb-8 transition-colors group ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          {isRTL ? <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> : <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />}
          <span className="font-medium text-sm" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
            {language === 'AR' ? 'رجوع' : 'Back'}
          </span>
        </motion.button>

        {/* Header with search - single search bar only */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Sparkles className="w-5 h-5 text-brand-hotpink" />
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-brand-darkred" 
                style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : "'Playfair Display', serif", fontStyle: isRTL ? 'normal' : 'italic' }}>
                {language === 'AR' ? 'المتجر' : 'Shop'}
              </h1>
            </div>
            <p className="text-gray-400 text-sm mt-1 ms-8" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
              {displayProducts.length} {language === 'AR' ? 'منتج' : 'products'}
            </p>
          </motion.div>
        </div>

        {/* Products grid - always show */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={searchQuery}
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5"
          >
            {displayProducts.length > 0 ? displayProducts.map((product, idx) => {
              const isAdded = addedIds.has(product.id);
              return (
                <motion.div variants={item} key={`${product.id}-${idx}`} className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-50">
                  <Link 
                    href={`/product/${product.id}`}
                    className="relative aspect-[3/4] overflow-hidden bg-brand-pinkishwhite/40 block"
                  >
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    />
                    {product.originalPrice && (
                      <div className="absolute top-2.5 start-2.5 bg-brand-hotpink text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% {language === 'AR' ? 'خصم' : 'OFF'}
                      </div>
                    )}
                    <button 
                      onClick={(e) => e.preventDefault()}
                      className="absolute top-2.5 end-2.5 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 shadow-sm text-gray-400 hover:text-brand-hotpink opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                  
                  <div className={`flex flex-col flex-1 p-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <Link 
                      href={`/product/${product.id}`}
                      className="text-[13px] text-gray-700 font-semibold line-clamp-2 hover:text-brand-darkred transition-colors leading-snug"
                      style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}
                    >
                      {product.name}
                    </Link>
                    <div className={`mt-1.5 flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                      <span className="text-brand-darkred font-bold text-sm">£{product.price.toFixed(2)}</span>
                      {product.originalPrice && (
                        <span className="text-gray-300 text-xs line-through">£{product.originalPrice.toFixed(2)}</span>
                      )}
                    </div>
                    
                    <div className="mt-3">
                      <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => { e.preventDefault(); handleAddToCart(product.id); }}
                        className={`w-full font-bold py-2.5 text-[11px] transition-all flex items-center justify-center gap-1.5 rounded-xl ${
                          isAdded 
                            ? 'bg-green-500 text-white shadow-md shadow-green-200' 
                            : 'bg-brand-pinkishwhite border border-brand-darkred/30 text-brand-darkred hover:bg-brand-darkred hover:text-white hover:border-brand-darkred hover:shadow-md hover:shadow-brand-darkred/20'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                              {language === 'AR' ? 'تمت الإضافة' : 'Added!'}
                            </span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                              {language === 'AR' ? 'أضف للسلة' : 'Add to Bag'}
                            </span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            }) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-24 text-center"
              >
                <div className="w-20 h-20 bg-brand-pinkishwhite rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8 text-brand-hotpink" strokeWidth={1.5} />
                </div>
                <p className="text-gray-500 font-medium text-lg" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                  {language === 'AR' ? 'لم يتم العثور على أي منتج' : 'No products found'}
                </p>
                <p className="text-gray-300 text-sm mt-1" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                  {language === 'AR' ? 'جربي كلمة بحث أخرى' : 'Try a different search term'}
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-brand-pinkishwhite/30 to-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-3 border-brand-hotpink border-t-transparent rounded-full animate-spin" />
          <p className="text-brand-darkred font-medium text-sm">Loading...</p>
        </div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
