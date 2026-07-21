'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Search, ShoppingBag, Menu, Globe, X, Trash2, Plus, Minus, ChevronDown } from 'lucide-react';
import { useLocale } from 'next-intl';
import { Link, useRouter, usePathname } from '@/lib/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/components/CartProvider';
import { products } from '@/lib/data';
import { sanityClient } from '@/lib/sanity';

const playPopSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch(e) {}
};

interface Category {
  _id: string;
  title: string;
  titleAr: string;
  slug: { current: string };
}

export default function Navbar() {
  const language = useLocale().toUpperCase() as 'EN' | 'AR';
  const isRTL = language === 'AR';
  const router = useRouter();
  const pathname = usePathname();
  
  const { items, cartCount, cartTotal, removeFromCart, updateQuantity } = useCart();
  
  const setLanguage = (lang: string) => {
    router.replace(pathname, { locale: lang.toLowerCase() });
  };

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartShake, setCartShake] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isCatMenuOpen, setIsCatMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const langMenuRef = useRef<HTMLDivElement>(null);
  const catMenuRef = useRef<HTMLDivElement>(null);

  // Fetch categories from Sanity
  useEffect(() => {
    sanityClient
      .fetch<Category[]>(`*[_type == "category"] | order(order asc) { _id, title, titleAr, slug }`)
      .then((data) => setCategories(data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
      if (catMenuRef.current && !catMenuRef.current.contains(event.target as Node)) {
        setIsCatMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleCartUpdate = () => {
      setCartShake(true);
      setCartBounce(true);
      playPopSound();
      setTimeout(() => setCartShake(false), 600);
      setTimeout(() => setCartBounce(false), 400);
    };
    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, []);

  const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  const scrollToSale = () => {
    const saleSection = document.getElementById('sale-section');
    if (saleSection) {
      saleSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push('/shop?filter=sale');
    }
  };

  const scrollToNewArrivals = () => {
    const newSection = document.getElementById('new-arrivals-section');
    if (newSection) {
      newSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push('/shop?filter=new');
    }
  };

  const handleLanguageSelect = (lang: string) => {
    setLanguage(lang);
    setIsLangMenuOpen(false);
  };

  return (
    <>
      <header className="w-full bg-brand-pinkishwhite sticky top-0 z-40 shadow-[0_2px_20px_rgba(194,24,91,0.08)]">
        <div className="border-b border-brand-pink/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:h-[72px]">
              
              {/* Left side: Mobile Menu & Search */}
              <div className={`flex items-center gap-2 sm:gap-4 lg:hidden w-auto ${isRTL ? 'order-3' : 'order-1'}`}>
                <button onClick={() => setIsMenuOpen(true)} className="p-1.5 text-brand-darkred hover:text-brand-hotpink transition-colors rounded-full hover:bg-brand-pinkishwhite/50">
                  <Menu className="w-6 h-6" />
                </button>
                <button onClick={() => setIsMenuOpen(true)} className="p-1.5 text-brand-darkred hover:text-brand-hotpink transition-colors rounded-full hover:bg-brand-pinkishwhite/50">
                  <Search className="w-5 h-5" />
                </button>
              </div>

              {/* Logo */}
              <div className={`flex justify-center flex-1 lg:flex-none ${isRTL ? 'order-2' : 'order-2'}`}>
                <Link href="/" className="text-[15px] sm:text-xl lg:text-2xl font-black tracking-tight lowercase whitespace-nowrap px-1 text-brand-darkred hover:text-brand-hotpink transition-colors" 
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                  the queen of lingerie
                </Link>
              </div>

              {/* Desktop Search Bar */}
              <div className="hidden lg:flex flex-1 items-center justify-center max-w-2xl px-8">
                <div className="w-full relative group">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                    placeholder={language === 'AR' ? 'ابحث عن المنتجات والماركات...' : 'Search Products and Brands...'} 
                    className="w-full bg-brand-pinkishwhite/40 border border-brand-pink/20 rounded-full py-2.5 ps-12 pe-5 text-sm focus:bg-white focus:border-brand-hotpink focus:outline-none transition-all placeholder:text-gray-400 font-medium shadow-sm focus:shadow-md"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                  <Search className="w-4.5 h-4.5 text-brand-hotpink/60 absolute top-1/2 -translate-y-1/2 start-4" />
                </div>
              </div>

              {/* Right Icons */}
              <div className={`flex items-center gap-3 sm:gap-4 w-auto text-gray-800 justify-end ${isRTL ? 'order-1' : 'order-3'}`}>
                
                {/* Language Selector */}
                <div className="relative hidden lg:block" ref={langMenuRef}>
                  <button 
                    onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} 
                    className="p-1.5 flex items-center justify-center transition-colors hover:text-brand-hotpink text-brand-darkred rounded-full hover:bg-brand-pinkishwhite/50"
                  >
                    <Globe className="w-[20px] h-[20px]" strokeWidth={1.5} />
                  </button>
                  
                  <AnimatePresence>
                    {isLangMenuOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full mt-2 w-36 bg-white border border-brand-pink/20 shadow-xl rounded-2xl py-2 z-[100] end-0 overflow-hidden"
                      >
                        {[
                          { code: 'EN', label: 'English', flag: '🇬🇧' },
                          { code: 'AR', label: 'العربية', flag: '🇸🇦' }
                        ].map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => handleLanguageSelect(lang.code)}
                            className={`w-full px-4 py-2.5 text-[13px] hover:bg-brand-pinkishwhite/50 transition-colors flex items-center gap-2.5 ${language === lang.code ? 'text-brand-hotpink font-bold' : 'text-gray-600 font-medium'}`}
                          >
                            <span>{lang.flag}</span>
                            <span>{lang.label}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Cart */}
                <motion.button 
                  onClick={() => setIsCartOpen(true)} 
                  className="p-1.5 relative hover:text-brand-hotpink transition-colors text-brand-darkred rounded-full hover:bg-brand-pinkishwhite/50"
                  animate={cartShake ? { 
                    rotate: [-8, 8, -8, 8, -5, 5, 0],
                    x: [-2, 2, -2, 2, 0]
                  } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <ShoppingBag className="w-[22px] h-[22px]" strokeWidth={1.5} />
                  <AnimatePresence>
                    {cartCount > 0 && (
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={cartBounce ? { scale: [1, 1.5, 1] } : { scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="absolute -top-1 -end-1 w-4 h-4 bg-brand-hotpink text-white text-[9px] font-bold flex items-center justify-center rounded-full shadow-sm"
                      >
                        {cartCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation Links */}
        <div className="hidden lg:block border-b border-brand-pink/10 bg-brand-pinkishwhite">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <nav className={`flex items-center justify-center gap-6 xl:gap-8 h-[48px] overflow-x-auto scrollbar-hide ${isRTL ? 'flex-row-reverse' : ''}`}>
              
              {/* الأقسام - dropdown */}
              <div className="relative" ref={catMenuRef}>
                <button
                  onClick={() => setIsCatMenuOpen(!isCatMenuOpen)}
                  className={`flex items-center gap-1 text-[12px] xl:text-[13px] whitespace-nowrap text-brand-darkred font-bold ${isRTL ? '' : 'uppercase tracking-[0.12em]'} hover:text-brand-hotpink transition-colors`}
                >
                  {language === 'AR' ? 'الأقسام' : 'CATEGORIES'}
                  <ChevronDown className={`w-3 h-3 transition-transform ${isCatMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {isCatMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className={`absolute top-full mt-3 w-52 bg-white border border-brand-pink/10 shadow-2xl rounded-2xl py-2 z-[100] overflow-hidden ${isRTL ? 'right-0' : 'left-0'}`}
                    >
                      {categories.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-400">جاري التحميل...</div>
                      ) : (
                        categories.map((cat) => (
                          <Link
                            key={cat._id}
                            href={`/shop?category=${cat.slug.current}` as any}
                            onClick={() => setIsCatMenuOpen(false)}
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-pinkishwhite hover:text-brand-hotpink transition-colors font-medium"
                          >
                            {language === 'AR' ? cat.titleAr : cat.title}
                          </Link>
                        ))
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* المتجر */}
              <Link 
                href="/shop" 
                className={`text-[12px] xl:text-[13px] whitespace-nowrap text-brand-darkred font-bold ${isRTL ? '' : 'uppercase tracking-[0.12em]'} hover:text-brand-hotpink transition-colors relative after:absolute after:bottom-[-14px] after:start-0 after:w-full after:h-[2px] after:bg-brand-hotpink after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300`}
              >
                {language === 'AR' ? 'المتجر' : 'SHOP'}
              </Link>

              {/* تخفيضات - يسكرول للأسفل */}
              <button
                onClick={scrollToSale}
                className={`text-[12px] xl:text-[13px] whitespace-nowrap font-bold text-red-500 ${isRTL ? '' : 'uppercase tracking-[0.12em]'} hover:text-red-600 transition-colors relative after:absolute after:bottom-[-14px] after:start-0 after:w-full after:h-[2px] after:bg-red-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300`}
              >
                {language === 'AR' ? 'تخفيضات 🔥' : 'SALE 🔥'}
              </button>

              {/* وصل حديثاً */}
              <button
                onClick={scrollToNewArrivals}
                className={`text-[12px] xl:text-[13px] whitespace-nowrap font-medium text-gray-600 ${isRTL ? '' : 'uppercase tracking-[0.12em]'} hover:text-brand-hotpink transition-colors relative after:absolute after:bottom-[-14px] after:start-0 after:w-full after:h-[2px] after:bg-brand-hotpink after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300`}
              >
                {language === 'AR' ? 'وصل حديثاً ✨' : 'New In ✨'}
              </button>

              {/* دوبياس | ديزابيي | لينويزات | ليشورت */}
              {['doubleas', 'desabe', 'linwizat', 'lyshort'].map((slug) => {
                const cat = categories.find(c => c.slug?.current === slug);
                if (!cat) return null;
                return (
                  <Link
                    key={slug}
                    href={`/shop?category=${slug}` as any}
                    className={`text-[12px] xl:text-[13px] whitespace-nowrap font-medium text-gray-600 ${isRTL ? '' : 'uppercase tracking-[0.12em]'} hover:text-brand-hotpink transition-colors relative after:absolute after:bottom-[-14px] after:start-0 after:w-full after:h-[2px] after:bg-brand-hotpink after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300`}
                  >
                    {language === 'AR' ? cat.titleAr : cat.title}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Premium Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm" 
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className={`fixed top-0 bottom-0 ${isRTL ? 'start-0' : 'end-0'} h-screen w-[92vw] sm:w-[400px] bg-white z-[70] shadow-2xl flex flex-col m-0 rounded-none`}
            >
              {/* Cart Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-brand-darkred to-brand-hotpink">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-white" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : "'Montserrat', sans-serif" }}>
                    {language === 'AR' ? `حقيبتي (${cartCount})` : `My Bag (${cartCount})`}
                  </h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center px-6 py-12">
                    <motion.div 
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="w-24 h-24 bg-brand-pinkishwhite rounded-full flex items-center justify-center mb-6"
                    >
                      <ShoppingBag className="w-10 h-10 text-brand-hotpink" strokeWidth={1.5} />
                    </motion.div>
                    <p className="text-xl text-brand-darkred font-bold mb-2" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : "'Playfair Display', serif", fontStyle: isRTL ? 'normal' : 'italic' }}>
                      {language === 'AR' ? 'حقيبتك فارغة' : 'Your bag is empty'}
                    </p>
                    <p className="text-gray-400 text-sm mb-8">{language === 'AR' ? 'أضيفي منتجاتك المفضلة' : 'Add your favourite items'}</p>
                    <Link 
                      href="/shop"
                      onClick={() => setIsCartOpen(false)} 
                      className="w-full max-w-[220px] block text-center bg-brand-darkred text-white font-bold py-3.5 text-sm hover:bg-brand-hotpink transition-all shadow-lg hover:shadow-xl rounded-full"
                    >
                      {language === 'AR' ? 'تسوقي الآن' : 'Shop Now'}
                    </Link>
                  </div>
                ) : (
                  <div className="p-4 flex flex-col gap-3">
                    {items.map((item, idx) => {
                      const product = products.find(p => p.id === item.productId);
                      if (!product) return null;
                      return (
                        <motion.div 
                          initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          key={`${item.productId}-${idx}`} 
                          className="flex gap-3 bg-white p-3.5 rounded-2xl shadow-sm border border-gray-50 relative group hover:border-brand-pink/20 transition-colors"
                        >
                          <div className="relative flex-shrink-0">
                            <img src={product.image} alt={product.name} className="w-[72px] h-[88px] object-cover rounded-xl" />
                          </div>
                          <div className="flex-1 flex flex-col min-w-0">
                            <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug">{product.name}</h3>
                            <div className="text-xs text-gray-400 mt-0.5 flex gap-1 flex-wrap">
                              {item.selectedColor && <span className="bg-gray-50 px-2 py-0.5 rounded-full">{item.selectedColor}</span>}
                              {item.selectedSize && <span className="bg-gray-50 px-2 py-0.5 rounded-full">{item.selectedSize}</span>}
                            </div>
                            <div className="mt-auto flex items-center justify-between pt-2">
                              <span className="font-bold text-brand-darkred">£{product.price.toFixed(2)}</span>
                              <div className="flex items-center gap-2 bg-brand-pinkishwhite/60 rounded-full px-1 py-0.5">
                                <button onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))} className="w-6 h-6 flex items-center justify-center text-brand-darkred hover:text-brand-hotpink hover:bg-white rounded-full transition-colors">
                                  <Minus className="w-3 h-3"/>
                                </button>
                                <span className="text-xs font-bold w-4 text-center text-gray-700">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center text-brand-darkred hover:text-brand-hotpink hover:bg-white rounded-full transition-colors">
                                  <Plus className="w-3 h-3"/>
                                </button>
                              </div>
                            </div>
                          </div>
                          <button onClick={() => removeFromCart(item.productId)} className="absolute top-2 end-2 w-6 h-6 flex items-center justify-center text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all bg-white rounded-full shadow-sm">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {items.length > 0 && (
                <div className="border-t border-gray-100 bg-white">
                  <div className="px-5 pt-4 pb-2 space-y-2">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{language === 'AR' ? 'المنتجات' : 'Subtotal'}</span>
                      <span className="font-semibold text-gray-700">£{cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{language === 'AR' ? 'الشحن' : 'Shipping'}</span>
                      <span className="text-brand-hotpink font-semibold text-xs">{language === 'AR' ? 'يُحسب عند الطلب' : 'Calculated at checkout'}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-dashed border-gray-100 pt-3 mt-1">
                      <span className="font-bold text-gray-800 text-sm">{language === 'AR' ? 'المجموع' : 'Total'}</span>
                      <span className="text-2xl font-black text-brand-darkred">£{cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="px-5 pb-5">
                    <Link 
                      href="/checkout" 
                      onClick={() => setIsCartOpen(false)} 
                      className="block w-full text-center bg-gradient-to-r from-brand-darkred to-brand-hotpink text-white font-bold py-4 text-sm hover:opacity-90 transition-all shadow-lg shadow-brand-hotpink/30 rounded-2xl mt-3"
                    >
                      {language === 'AR' ? 'إتمام الطلب' : 'Checkout'}
                    </Link>
                    <button onClick={() => setIsCartOpen(false)} className="w-full text-center text-gray-400 text-sm font-medium py-2.5 hover:text-gray-600 transition-colors">
                      {language === 'AR' ? 'متابعة التسوق' : 'Continue Shopping'}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[60] lg:hidden backdrop-blur-sm" 
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className={`fixed top-0 bottom-0 ${isRTL ? 'end-0' : 'start-0'} h-screen w-[85vw] max-w-[320px] bg-white z-[70] shadow-2xl flex flex-col lg:hidden m-0 rounded-none`}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-brand-pinkishwhite bg-gradient-to-r from-brand-darkred to-brand-hotpink">
                <h2 className="text-lg font-bold text-white" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : "'Montserrat', sans-serif" }}>
                  {language === 'AR' ? 'القائمة' : 'MENU'}
                </h2>
                <button onClick={() => setIsMenuOpen(false)} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 border-b border-gray-50">
                  <div className="w-full relative">
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearch}
                      placeholder={language === 'AR' ? 'بحث...' : 'Search...'} 
                      className="w-full bg-brand-pinkishwhite/50 border border-brand-pink/20 rounded-full py-2.5 ps-10 pe-4 text-sm focus:outline-none focus:border-brand-hotpink"
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                    <Search className="w-4 h-4 text-brand-hotpink/60 absolute top-1/2 -translate-y-1/2 start-3" />
                  </div>
                </div>
                
                <div className="flex flex-col">
                  {/* Static links */}
                  <Link href="/shop" onClick={() => setIsMenuOpen(false)}
                    className="flex items-center py-4 px-5 border-b border-gray-50 hover:bg-brand-pinkishwhite/30 transition-colors">
                    <span className="text-[15px] font-semibold text-gray-700" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                      {language === 'AR' ? 'المتجر' : 'SHOP'}
                    </span>
                  </Link>
                  
                  <button onClick={() => { scrollToSale(); setIsMenuOpen(false); }}
                    className="flex items-center py-4 px-5 border-b border-gray-50 hover:bg-brand-pinkishwhite/30 transition-colors text-start">
                    <span className="text-[15px] font-semibold text-red-500" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                      {language === 'AR' ? 'تخفيضات 🔥' : 'SALE 🔥'}
                    </span>
                  </button>

                  <button onClick={() => { scrollToNewArrivals(); setIsMenuOpen(false); }}
                    className="flex items-center py-4 px-5 border-b border-gray-50 hover:bg-brand-pinkishwhite/30 transition-colors text-start">
                    <span className="text-[15px] font-semibold text-gray-700" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                      {language === 'AR' ? 'وصل حديثاً ✨' : 'New In ✨'}
                    </span>
                  </button>

                  {/* Dynamic categories */}
                  {categories.length > 0 && (
                    <>
                      <div className="px-5 pt-4 pb-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                          {language === 'AR' ? 'الأقسام' : 'CATEGORIES'}
                        </span>
                      </div>
                      {categories.map((cat) => (
                        <Link key={cat._id} href={`/shop?category=${cat.slug.current}` as any} onClick={() => setIsMenuOpen(false)}
                          className="flex items-center py-3 px-5 border-b border-gray-50 hover:bg-brand-pinkishwhite/30 transition-colors">
                          <span className="text-[14px] font-medium text-gray-600" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                            {language === 'AR' ? cat.titleAr : cat.title}
                          </span>
                        </Link>
                      ))}
                    </>
                  )}
                  
                  {/* Language */}
                  <div className="py-5 px-5 border-b border-gray-50">
                    <span className="font-bold text-sm text-gray-500 mb-3 block" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                      {language === 'AR' ? 'اللغة' : 'LANGUAGE'}
                    </span>
                    <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                      {[{ code: 'EN', label: 'English', flag: '🇬🇧' }, { code: 'AR', label: 'العربية', flag: '🇸🇦' }].map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => { handleLanguageSelect(lang.code); setIsMenuOpen(false); }}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${language === lang.code ? 'bg-brand-hotpink text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-brand-pinkishwhite'}`}
                        >
                          <span>{lang.flag}</span>
                          <span>{lang.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
