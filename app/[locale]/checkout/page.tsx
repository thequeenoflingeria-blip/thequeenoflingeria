'use client';

import { useLocale } from 'next-intl';
import { useRouter } from '@/lib/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Package, Truck, CheckCircle2, Store, HeartHandshake, PartyPopper, Trash2, Plus, Minus, AlertCircle, Sparkles, Heart, Star } from 'lucide-react';
import { useCart } from '@/components/CartProvider';
import { products } from '@/lib/data';
import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

const algerianWilayas = [
  "1. أدرار", "2. الشلف", "3. الأغواط", "4. أم البواقي", "5. باتنة", "6. بجاية", "7. بسكرة", "8. بشار", 
  "9. البليدة", "10. البويرة", "11. تمنراست", "12. تبسة", "13. تلمسان", "14. تيارت", "15. تيزي وزو", "16. الجزائر", 
  "17. الجلفة", "18. جيجل", "19. سطيف", "20. سعيدة", "21. سكيكدة", "22. سيدي بلعباس", "23. عنابة", "24. قالمة", 
  "25. قسنطينة", "26. المدية", "27. مستغانم", "28. المسيلة", "29. معسكر", "30. ورقلة", "31. وهران", "32. البيض", 
  "33. إليزي", "34. برج بوعريريج", "35. بومرداس", "36. الطارف", "37. تندوف", "38. تيسمسيلت", "39. الوادي", "40. خنشلة", 
  "41. سوق أهراس", "42. تيبازة", "43. ميلة", "44. عين الدفلى", "45. النعامة", "46. عين تموشنت", "47. غرداية", "48. غليزان", 
  "49. تيميمون", "50. برج باجي مختار", "51. أولاد جلال", "52. بني عباس", "53. عين صالح", "54. عين قزام", "55. تقرت", 
  "56. جانت", "57. المغير", "58. المنيعة"
];

export default function CheckoutPage() {
  const language = useLocale().toUpperCase();
  const isRTL = language === 'AR';
  const router = useRouter();
  const { items, cartTotal, cartCount, clearCart, updateQuantity, removeFromCart } = useCart();
  
  const [deliveryType, setDeliveryType] = useState<'desk' | 'home'>('home');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    wilaya: '',
    address: '',
  });

  const shipping = deliveryType === 'home' ? 800 : 500;

  const inputClass = (field: string) => `w-full bg-white border ${errors[field] ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200'} rounded-xl px-4 py-3.5 focus:outline-none focus:border-brand-hotpink focus:ring-2 focus:ring-brand-hotpink/10 transition-all font-medium text-gray-800 text-sm placeholder:text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.firstName.trim()) newErrors.firstName = isRTL ? 'مطلوب' : 'Required';
    if (!form.lastName.trim()) newErrors.lastName = isRTL ? 'مطلوب' : 'Required';
    if (!form.phone.trim() || form.phone.length < 9) newErrors.phone = isRTL ? 'رقم غير صحيح' : 'Invalid number';
    if (!form.wilaya) newErrors.wilaya = isRTL ? 'اختر الولاية' : 'Select province';
    if (!form.address.trim()) newErrors.address = isRTL ? 'مطلوب' : 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (cartCount === 0) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      clearCart();
      fireConfetti();
      playSuccessSound();
    }, 1500);
  };

  const playSuccessSound = () => {
    try {
      // Using a generic success chime sound effect
      const audio = new Audio('https://cdn.pixabay.com/download/audio/2021/08/04/audio_bb630cc098.mp3?filename=success-1-6297.mp3');
      audio.volume = 0.6;
      audio.play().catch(e => console.log('Audio error:', e));
    } catch(e) {}
  };

  const fireConfetti = () => {
    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;
    const colors = ['#ff4081', '#c62828', '#ff80ab', '#ffffff', '#f8bbd0'];

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 60 * (timeLeft / duration);
      confetti({
        particleCount,
        spread: 120,
        colors,
        origin: { x: Math.random() * 0.3, y: Math.random() - 0.2 },
        startVelocity: 40,
        gravity: 0.8,
        shapes: ['circle', 'square'],
      });
      confetti({
        particleCount,
        spread: 120,
        colors,
        origin: { x: 0.7 + Math.random() * 0.3, y: Math.random() - 0.2 },
        startVelocity: 40,
        gravity: 0.8,
        shapes: ['circle', 'square'],
      });
    }, 200);
  };

  // ─── SUCCESS SCREEN ────────────────────────────────────────────────
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fff0f5] via-white to-[#fff8f9] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Floating background shapes */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0, rotate: 0 }}
            animate={{ opacity: [0, 0.15, 0.1], scale: [0, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ delay: i * 0.15, duration: 1.5, ease: 'easeOut' }}
            className="absolute rounded-full bg-brand-hotpink pointer-events-none"
            style={{
              width: `${60 + i * 20}px`,
              height: `${60 + i * 20}px`,
              top: `${10 + i * 10}%`,
              left: i % 2 === 0 ? `${5 + i * 8}%` : undefined,
              right: i % 2 !== 0 ? `${5 + i * 8}%` : undefined,
              filter: 'blur(40px)',
            }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 60 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, type: 'spring', bounce: 0.45 }}
          className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl shadow-brand-hotpink/20 text-center max-w-md w-full relative z-10 border border-brand-pink/30 overflow-hidden"
        >
          {/* Top ribbon */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-darkred via-brand-hotpink to-brand-darkred" />

          {/* Animated icon */}
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.6, type: 'spring', bounce: 0.5 }}
            className="w-28 h-28 bg-gradient-to-br from-brand-darkred to-brand-hotpink rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-brand-hotpink/40 relative"
          >
            <PartyPopper className="w-14 h-14 text-white" />
            {/* Sparkle dots */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                transition={{ delay: 0.6 + i * 0.1, duration: 0.8, repeat: Infinity, repeatDelay: 2 }}
                className="absolute w-3 h-3 bg-yellow-300 rounded-full"
                style={{
                  top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 50}%`,
                  left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 60}%`,
                }}
              />
            ))}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-2xl sm:text-3xl font-black text-brand-darkred mb-3"
            style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : "'Playfair Display', serif" }}
          >
            {language === 'AR' ? '🎉 تم استلام طلبك!' : '🎉 Order Received!'}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="text-gray-500 font-medium mb-6 text-sm leading-relaxed"
            style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}
          >
            {language === 'AR'
              ? 'شكراً لك ❤️ سيتم التواصل معك قريباً لتأكيد الطلب وترتيب التوصيل.'
              : 'Thank you ❤️ We will contact you soon to confirm your order and arrange delivery.'}
          </motion.p>

          {/* Order number box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-brand-pinkishwhite to-white rounded-2xl p-4 mb-6 border border-brand-pink/30"
          >
            <p className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">
              {language === 'AR' ? 'رقم طلبك' : 'Order Number'}
            </p>
            <p className="text-3xl font-black text-brand-darkred tracking-widest">
              #{Math.floor(Math.random() * 90000) + 10000}
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex justify-center gap-4 mb-8 text-xs text-gray-500 font-medium"
          >
            {[
              { icon: '📦', label: language === 'AR' ? 'تغليف مميز' : 'Premium packing' },
              { icon: '🚚', label: language === 'AR' ? 'توصيل سريع' : 'Fast delivery' },
              { icon: '💰', label: language === 'AR' ? 'دفع عند الاستلام' : 'Cash on delivery' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/')}
            className="w-full bg-gradient-to-r from-brand-darkred to-brand-hotpink text-white py-4 font-black rounded-2xl shadow-lg shadow-brand-hotpink/30 hover:opacity-95 transition-all text-sm"
            style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}
          >
            {language === 'AR' ? '🛍️ مواصلة التسوق' : '🛍️ Continue Shopping'}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ─── CHECKOUT FORM ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#fdfafb]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12 max-w-5xl">

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className={`flex items-center gap-2 text-gray-400 hover:text-brand-darkred mb-6 transition-colors group ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          <span className="font-medium text-sm" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
            {language === 'AR' ? 'العودة' : 'Back'}
          </span>
        </motion.button>

        <div className={`flex flex-col lg:flex-row gap-6 lg:gap-10 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>

          {/* ── LEFT: FORM ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full lg:w-3/5 space-y-5 order-1"
          >
            <div>
              <h1 className="text-2xl lg:text-3xl font-black text-brand-darkred"
                style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : "'Playfair Display', serif" }}>
                {language === 'AR' ? 'إتمام الطلب' : 'Checkout'}
              </h1>
              <p className="text-gray-400 text-sm mt-1" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                {language === 'AR' ? 'أدخل بياناتك لضمان وصول طلبك بسرعة' : 'Enter your details to ensure fast delivery'}
              </p>
            </div>

            {/* 1. Personal Info */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100">
              <h2 className="text-base font-black text-brand-darkred mb-4 flex items-center gap-2"
                style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                <span className="w-7 h-7 bg-brand-pinkishwhite text-brand-darkred rounded-full flex items-center justify-center text-xs font-black">1</span>
                {language === 'AR' ? 'المعلومات الشخصية' : 'Personal Info'}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-bold text-gray-500 mb-1.5 ${isRTL ? 'text-right' : ''}`}>
                    {language === 'AR' ? 'الاسم الأول' : 'First Name'} <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={e => { setForm(f => ({ ...f, firstName: e.target.value })); setErrors(er => ({ ...er, firstName: '' })); }}
                    className={inputClass('firstName')}
                    placeholder={language === 'AR' ? 'أدخل اسمك' : 'Your first name'}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                  {errors.firstName && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.firstName}</p>}
                </div>
                <div>
                  <label className={`block text-xs font-bold text-gray-500 mb-1.5 ${isRTL ? 'text-right' : ''}`}>
                    {language === 'AR' ? 'اللقب' : 'Last Name'} <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={e => { setForm(f => ({ ...f, lastName: e.target.value })); setErrors(er => ({ ...er, lastName: '' })); }}
                    className={inputClass('lastName')}
                    placeholder={language === 'AR' ? 'أدخل لقبك' : 'Your last name'}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                  {errors.lastName && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.lastName}</p>}
                </div>
                <div className="col-span-2">
                  <label className={`block text-xs font-bold text-gray-500 mb-1.5 ${isRTL ? 'text-right' : ''}`}>
                    {language === 'AR' ? 'رقم الهاتف' : 'Phone Number'} <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => { setForm(f => ({ ...f, phone: e.target.value })); setErrors(er => ({ ...er, phone: '' })); }}
                    className={inputClass('phone')}
                    placeholder="05XX XXX XXX"
                    dir="ltr"
                  />
                  {errors.phone && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* 2. Delivery */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100">
              <h2 className="text-base font-black text-brand-darkred mb-4 flex items-center gap-2"
                style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                <span className="w-7 h-7 bg-brand-pinkishwhite text-brand-darkred rounded-full flex items-center justify-center text-xs font-black">2</span>
                {language === 'AR' ? 'عنوان التوصيل' : 'Delivery Address'}
              </h2>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { type: 'home' as const, icon: Truck, label: language === 'AR' ? 'توصيل للمنزل' : 'Home Delivery', price: '800' },
                  { type: 'desk' as const, icon: Store, label: language === 'AR' ? 'Stop Desk' : 'Stop Desk', price: '500' },
                ].map(opt => (
                  <button
                    key={opt.type}
                    onClick={() => setDeliveryType(opt.type)}
                    className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${deliveryType === opt.type ? 'border-brand-darkred bg-brand-pinkishwhite/40' : 'border-gray-100 hover:border-brand-pink/50'}`}
                  >
                    <opt.icon className={`w-6 h-6 ${deliveryType === opt.type ? 'text-brand-darkred' : 'text-gray-400'}`} />
                    <span className={`text-xs font-bold ${deliveryType === opt.type ? 'text-brand-darkred' : 'text-gray-500'}`}
                      style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>{opt.label}</span>
                    <span className={`text-xs ${deliveryType === opt.type ? 'text-brand-hotpink' : 'text-gray-400'}`}>{opt.price} DZD</span>
                    {deliveryType === opt.type && <CheckCircle2 className="w-4 h-4 text-brand-darkred absolute top-2 right-2" />}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <div>
                  <label className={`block text-xs font-bold text-gray-500 mb-1.5 ${isRTL ? 'text-right' : ''}`}>
                    {language === 'AR' ? 'الولاية' : 'Province'} <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={form.wilaya}
                    onChange={e => { setForm(f => ({ ...f, wilaya: e.target.value })); setErrors(er => ({ ...er, wilaya: '' })); }}
                    className={inputClass('wilaya') + ' cursor-pointer'}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    <option value="">{language === 'AR' ? '-- اختر الولاية --' : '-- Select Province --'}</option>
                    {algerianWilayas.map((w, i) => <option key={i} value={w}>{w}</option>)}
                  </select>
                  {errors.wilaya && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.wilaya}</p>}
                </div>
                <div>
                  <label className={`block text-xs font-bold text-gray-500 mb-1.5 ${isRTL ? 'text-right' : ''}`}>
                    {language === 'AR' ? 'العنوان التفصيلي' : 'Full Address'} <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={e => { setForm(f => ({ ...f, address: e.target.value })); setErrors(er => ({ ...er, address: '' })); }}
                    className={inputClass('address')}
                    placeholder={language === 'AR' ? 'البلدية، الشارع، رقم المنزل...' : 'Street, building, commune...'}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                  {errors.address && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.address}</p>}
                </div>
              </div>

              <div className="mt-4 bg-blue-50 rounded-xl p-3 flex gap-3 items-start border border-blue-100">
                <HeartHandshake className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-600 leading-relaxed font-medium"
                  style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                  {language === 'AR'
                    ? 'أسعار الشحن ليست ربحاً لنا. نتعاقد مع أفضل شركات التوصيل لأسرع وأرخص خدمة.'
                    : 'Shipping prices are not our profit. We partner with the best couriers for the fastest and cheapest service.'}
                </p>
              </div>
            </div>

            {/* 3. Payment */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100">
              <h2 className="text-base font-black text-brand-darkred mb-3 flex items-center gap-2"
                style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                <span className="w-7 h-7 bg-brand-pinkishwhite text-brand-darkred rounded-full flex items-center justify-center text-xs font-black">3</span>
                {language === 'AR' ? 'طريقة الدفع' : 'Payment Method'}
              </h2>
              <div className={`flex items-center gap-4 p-4 rounded-2xl border-2 border-brand-darkred bg-brand-pinkishwhite/30 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-10 h-10 rounded-full bg-brand-darkred flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div className={isRTL ? 'text-right' : ''}>
                  <p className="font-black text-brand-darkred text-sm" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                    {language === 'AR' ? 'الدفع عند الاستلام فقط' : 'Cash on Delivery ONLY'}
                  </p>
                  <p className="text-xs text-brand-darkred/60 mt-0.5 font-medium" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                    {language === 'AR' ? 'لن تدفعي شيئاً حتى يصلك طلبك.' : 'You pay nothing until your order arrives.'}
                  </p>
                </div>
                <CheckCircle2 className={`w-5 h-5 text-brand-darkred ${isRTL ? 'mr-auto' : 'ml-auto'}`} />
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT: ORDER SUMMARY ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="w-full lg:w-2/5 order-2"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden lg:sticky lg:top-28">
              <div className="h-1.5 bg-gradient-to-r from-brand-darkred to-brand-hotpink" />
              <div className="p-5 sm:p-6">
                <h2 className="text-lg font-black text-gray-900 mb-4"
                  style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : "'Playfair Display', serif" }}>
                  {language === 'AR' ? 'ملخص الطلب' : 'Order Summary'}
                </h2>

                {/* Items */}
                {items.length > 0 ? (
                  <div className="space-y-3 mb-5 max-h-72 overflow-y-auto">
                    {items.map((item, idx) => {
                      const product = products.find(p => p.id === item.productId);
                      if (!product) return null;
                      return (
                        <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-20 object-cover rounded-lg flex-shrink-0 shadow-sm"
                          />
                          <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : ''}`}>
                            <p className="text-xs font-bold text-gray-800 line-clamp-2 leading-tight mb-1">{product.name}</p>
                            <p className="text-[10px] text-gray-400 bg-gray-200 inline-block px-2 py-0.5 rounded-full mb-2">
                              {item.selectedSize} · {item.selectedColor}
                            </p>
                            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <button onClick={() => updateQuantity(product.id, Math.max(1, item.quantity - 1))}
                                className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100">
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="font-bold text-xs w-4 text-center">{item.quantity}</span>
                              <button onClick={() => updateQuantity(product.id, item.quantity + 1)}
                                className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100">
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <button onClick={() => removeFromCart(product.id)}
                              className="p-1 text-gray-300 hover:text-red-400 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-black text-xs text-brand-darkred whitespace-nowrap">
                              {(product.price * item.quantity * 150).toFixed(0)} DZD
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p className="text-sm font-medium" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                      {language === 'AR' ? 'السلة فارغة' : 'Cart is empty'}
                    </p>
                  </div>
                )}

                {/* Totals */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-2.5 mb-4">
                  <div className={`flex justify-between text-xs font-semibold text-gray-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                      {language === 'AR' ? `المنتجات (${cartCount})` : `Items (${cartCount})`}
                    </span>
                    <span>{(cartTotal * 150).toFixed(0)} DZD</span>
                  </div>
                  <div className={`flex justify-between text-xs font-semibold text-gray-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                      {language === 'AR' ? 'الشحن' : 'Shipping'}
                    </span>
                    <span>{cartCount > 0 ? shipping : 0} DZD</span>
                  </div>
                  <div className={`flex justify-between items-center border-t border-gray-200 pt-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="font-black text-gray-900 text-sm" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                      {language === 'AR' ? 'المجموع' : 'Total'}
                    </span>
                    <span className="text-2xl font-black text-brand-darkred">
                      {((cartTotal * 150) + (cartCount > 0 ? shipping : 0)).toFixed(0)} DZD
                    </span>
                  </div>
                </div>

                {/* CONFIRM BUTTON - always at bottom of summary */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={handleSubmit}
                  disabled={cartCount === 0 || isSubmitting}
                  className={`w-full py-4 font-black rounded-2xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                    cartCount === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-r from-brand-darkred to-brand-hotpink text-white shadow-brand-hotpink/30 hover:opacity-95'
                  }`}
                  style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <PartyPopper className="w-5 h-5" />
                      {language === 'AR' ? 'تأكيد الطلب' : 'Confirm Order'}
                    </>
                  )}
                </motion.button>

                {cartCount === 0 && (
                  <p className="text-center text-xs text-gray-400 mt-2 font-medium"
                    style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                    {language === 'AR' ? 'أضف منتجات للسلة أولاً' : 'Add items to your cart first'}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
