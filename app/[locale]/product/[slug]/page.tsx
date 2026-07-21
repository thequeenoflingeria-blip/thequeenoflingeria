'use client';
import { use } from 'react';
import { ShoppingBag, ChevronRight, ChevronLeft, Heart, Check, ShieldCheck, Truck, Star } from 'lucide-react';
import { useState } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from '@/lib/i18n/routing';
import { products } from '@/lib/data';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/components/CartProvider';

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const language = useLocale().toUpperCase();
  const isRTL = language === 'AR';
  const router = useRouter();
  const { addToCart } = useCart();
  
  const product = products.find(p => p.id.toString() === slug) || products[0];

  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [selectedColor, setSelectedColor] = useState<string>('Pink');
  const [isAdded, setIsAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const sizes = ['S', 'M', 'L', 'XL'];
  const colors = [
    { name: 'Pink', class: 'bg-brand-pink' },
    { name: 'Hot Pink', class: 'bg-brand-hotpink' },
    { name: 'Dark Red', class: 'bg-brand-darkred' },
    { name: 'White', class: 'bg-white border-2 border-gray-200 shadow-inner' },
  ];

  const handleAddToCart = () => {
    addToCart({ 
      productId: product.id, 
      quantity: 1, 
      selectedColor, 
      selectedSize 
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-pinkishwhite/30 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Back Button */}
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

        <div className={`flex flex-col md:flex-row gap-10 lg:gap-16 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
          
          {/* Product Image Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="w-full md:w-1/2"
          >
            <div className="aspect-[3/4] bg-brand-pinkishwhite/50 rounded-2xl overflow-hidden relative group shadow-sm border border-brand-pink/10">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {product.originalPrice && (
                <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} bg-white text-brand-darkred text-xs font-bold px-3 py-1 rounded-full shadow-sm`}>
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% {language === 'AR' ? 'خصم' : 'OFF'}
                </div>
              )}

              <button 
                onClick={() => setIsFavorite(!isFavorite)}
                className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 hover:scale-110 ${isFavorite ? 'text-brand-hotpink' : 'text-gray-400 hover:text-brand-hotpink'}`}
              >
                <Heart className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Thumbnail Gallery placeholder */}
            <div className={`flex gap-3 mt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i} className={`w-16 h-20 rounded-lg overflow-hidden border-2 cursor-pointer transition-colors ${i === 0 ? 'border-brand-darkred opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                  <img src={product.image} className="w-full h-full object-cover" alt="" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Product Info Section */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            className={`w-full md:w-1/2 flex flex-col ${isRTL ? 'text-right' : 'text-left'}`}
          >
            {/* Title & Reviews */}
            <motion.div variants={fadeInUp}>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-3 leading-tight" 
                style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : "'Playfair Display', serif" }}>
                {product.name}
              </h1>
              <div className={`flex items-center gap-4 mb-6 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                <div className={`flex items-center gap-1 text-yellow-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <span className="text-sm text-gray-400 underline cursor-pointer" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                  {language === 'AR' ? '4.9 (128 تقييم)' : '4.9 (128 reviews)'}
                </span>
              </div>
            </motion.div>
            
            {/* Price */}
            <motion.div variants={fadeInUp} className={`flex items-end gap-3 mb-8 pb-8 border-b border-gray-100 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
              <span className="text-4xl font-black text-brand-darkred">£{product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through mb-1">£{product.originalPrice.toFixed(2)}</span>
              )}
            </motion.div>

            {/* Description */}
            <motion.div variants={fadeInUp}>
              <p className="text-gray-500 font-medium leading-relaxed mb-8 text-sm md:text-base" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                {language === 'AR' 
                  ? 'صُنع هذا المنتج بعناية فائقة وتصميم يبرز الأنوثة. مثالي لإطلالة الصيف مع تفاصيل رائعة من الدانتيل الفاخر والحرير الناعم الذي يمنحك راحة لا مثيل لها طوال اليوم.'
                  : 'Crafted with the utmost care and designed to highlight your femininity. Perfect for a summer look with exquisite details of premium lace and soft silk that gives you unparalleled comfort all day long.'
                }
              </p>
            </motion.div>

            {/* Color Selection */}
            <motion.div variants={fadeInUp} className="mb-6 w-full">
              <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h3 className="text-sm font-bold text-gray-800" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                  {language === 'AR' ? 'اللون' : 'Color'}: <span className="text-gray-500 font-normal ml-1">{selectedColor}</span>
                </h3>
              </div>
              <div className={`flex gap-3 flex-wrap ${isRTL ? 'justify-end' : 'justify-start'}`}>
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`relative w-11 h-11 rounded-full ${color.class} transition-all duration-200 ${selectedColor === color.name ? 'ring-2 ring-offset-2 ring-brand-darkred scale-110' : 'hover:scale-110'}`}
                    title={color.name}
                  >
                    {selectedColor === color.name && (
                      <Check className={`absolute inset-0 m-auto w-5 h-5 ${color.name === 'White' ? 'text-black' : 'text-white'}`} strokeWidth={3} />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Size Selection */}
            <motion.div variants={fadeInUp} className="mb-10 w-full">
              <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h3 className="text-sm font-bold text-gray-800" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                  {language === 'AR' ? 'المقاس' : 'Size'}
                </h3>
                <button className="text-xs text-brand-darkred font-semibold hover:underline" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                  {language === 'AR' ? 'دليل المقاسات' : 'Size Guide'}
                </button>
              </div>
              <div className={`flex flex-wrap gap-3 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[4rem] h-12 rounded-xl text-sm font-bold transition-all duration-200 ${selectedSize === size ? 'bg-brand-darkred text-white shadow-md shadow-brand-darkred/20 border-transparent' : 'bg-white border border-gray-200 text-gray-700 hover:border-brand-darkred hover:text-brand-darkred'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Add to Cart Button */}
            <motion.div variants={fadeInUp} className="mb-8">
              <motion.button 
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className={`w-full py-4 px-8 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-3 shadow-lg ${isAdded ? 'bg-green-500 text-white shadow-green-500/30' : 'bg-gradient-to-r from-brand-darkred to-brand-hotpink text-white shadow-brand-hotpink/30 hover:opacity-95'}`}
                style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}
              >
                <AnimatePresence mode="wait">
                  {isAdded ? (
                    <motion.div key="added" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Check className="w-5 h-5" />
                      <span>{language === 'AR' ? 'تمت الإضافة بنجاح' : 'Added to Bag Successfully'}</span>
                    </motion.div>
                  ) : (
                    <motion.div key="add" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <ShoppingBag className="w-5 h-5" />
                      <span>{language === 'AR' ? 'إضافة إلى الحقيبة' : 'Add to Bag'}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>

            {/* Features list */}
            <motion.div variants={fadeInUp} className="bg-brand-pinkishwhite/40 rounded-xl p-5 space-y-4 border border-brand-pink/10">
              <div className={`flex items-center gap-3 text-sm text-gray-700 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                <Truck className="w-5 h-5 text-brand-hotpink flex-shrink-0" />
                <span style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                  {language === 'AR' ? 'توصيل مجاني للطلبات فوق 50£' : 'Free delivery on orders over £50'}
                </span>
              </div>
              <div className={`flex items-center gap-3 text-sm text-gray-700 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                <ShieldCheck className="w-5 h-5 text-brand-hotpink flex-shrink-0" />
                <span style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                  {language === 'AR' ? 'استرجاع مجاني خلال 14 يوم' : 'Free 14-day returns'}
                </span>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
