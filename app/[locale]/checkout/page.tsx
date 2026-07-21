'use client';

import { useLocale } from 'next-intl';
import { useRouter, Link } from '@/lib/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, MapPin, Package, Truck, CheckCircle2, Store, HeartHandshake, PartyPopper } from 'lucide-react';
import { useCart } from '@/components/CartProvider';
import { products } from '@/lib/data';
import { useState, useEffect } from 'react';
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
  const { items, cartTotal, cartCount, clearCart } = useCart();
  
  const [deliveryType, setDeliveryType] = useState<'desk' | 'home'>('home');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If cart is empty and not in success state, might want to redirect, but we let user see it anyway or we can disable submit.

  const shipping = deliveryType === 'home' ? 800 : 500; // Example DZD shipping cost
  const total = cartTotal + (cartCount > 0 ? shipping : 0);

  const inputClass = `w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-brand-hotpink focus:ring-2 focus:ring-brand-hotpink/10 transition-all font-medium text-gray-800 text-sm placeholder:text-gray-300 ${isRTL ? 'text-right' : 'text-left'}`;

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      clearCart();
      fireConfetti();
    }, 1500);
  };

  const fireConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-pinkishwhite/30 via-white to-white flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <motion.div 
          initial={{ opacity: 0, scale: 0 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 1, type: 'spring' }}
          className="absolute -top-32 -left-32 w-96 h-96 bg-brand-pink/20 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 1, type: 'spring', delay: 0.2 }}
          className="absolute -bottom-32 -right-32 w-96 h-96 bg-brand-hotpink/10 rounded-full blur-3xl pointer-events-none"
        />

        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
          className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl shadow-brand-hotpink/10 text-center max-w-lg w-full relative z-10 border border-brand-pink/20"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-24 h-24 bg-gradient-to-br from-brand-darkred to-brand-hotpink rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-hotpink/30"
          >
            <PartyPopper className="w-12 h-12 text-white" />
          </motion.div>

          <h2 className="text-3xl font-black text-brand-darkred mb-4" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : "'Playfair Display', serif" }}>
            {language === 'AR' ? 'تهانينا! تم استلام طلبك بنجاح' : 'Order Received Successfully!'}
          </h2>
          
          <p className="text-gray-600 font-medium mb-8 text-lg" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
            {language === 'AR' 
              ? 'نحن سعيدون جداً باختيارك لنا. سوف يتم الاتصال بك قريباً لتأكيد الطلب وترتيب التوصيل.' 
              : 'We are so happy you chose us. You will be contacted soon to confirm your order and arrange delivery.'}
          </p>

          <div className="bg-brand-pinkishwhite/50 rounded-2xl p-5 mb-8 border border-brand-pink/20">
            <h3 className="font-bold text-brand-darkred mb-2" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
              {language === 'AR' ? 'رقم طلبك' : 'Order Number'}
            </h3>
            <p className="text-2xl font-black text-gray-800 tracking-widest">
              #{Math.floor(Math.random() * 90000) + 10000}
            </p>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/')}
            className="w-full bg-brand-darkred text-white py-4 font-bold rounded-xl shadow-md hover:bg-[#880e4f] transition-colors text-base"
            style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}
          >
            {language === 'AR' ? 'العودة للتسوق' : 'Continue Shopping'}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfafb]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 max-w-7xl">
        
        {/* Back button */}
        <motion.button 
          initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className={`flex items-center gap-2 text-gray-400 hover:text-brand-darkred mb-8 transition-colors group ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          {isRTL ? <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> : <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />}
          <span className="font-medium text-sm" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
            {language === 'AR' ? 'العودة للسلة' : 'Back to Cart'}
          </span>
        </motion.button>

        <div className={`flex flex-col lg:flex-row gap-8 lg:gap-12 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
          
          {/* Form Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full lg:w-3/5 order-2 lg:order-1 space-y-8"
          >
            <h1 className="text-3xl lg:text-4xl font-black text-brand-darkred mb-2" 
              style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : "'Playfair Display', serif" }}>
              {language === 'AR' ? 'إتمام الطلب' : 'Checkout'}
            </h1>
            <p className="text-gray-500 mb-8 font-medium" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
              {language === 'AR' ? 'الرجاء إدخال بياناتك بعناية لضمان وصول طلبك بسرعة.' : 'Please enter your details carefully to ensure fast delivery.'}
            </p>

            <div className="space-y-6">
              {/* Contact Details */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.03)] border border-brand-pink/10">
                <h2 className="text-lg font-bold text-brand-darkred mb-6 flex items-center gap-3" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                  <span className="w-8 h-8 bg-brand-pinkishwhite text-brand-darkred rounded-full flex items-center justify-center text-sm font-black flex-shrink-0">1</span>
                  {language === 'AR' ? 'المعلومات الشخصية' : 'Personal Info'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={`block text-sm font-bold text-gray-600 mb-2 ${isRTL ? 'text-right' : ''}`} style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                      {language === 'AR' ? 'الاسم الأول' : 'First Name'}
                    </label>
                    <input type="text" className={inputClass} dir={isRTL ? 'rtl' : 'ltr'} />
                  </div>
                  <div>
                    <label className={`block text-sm font-bold text-gray-600 mb-2 ${isRTL ? 'text-right' : ''}`} style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                      {language === 'AR' ? 'اللقب' : 'Last Name'}
                    </label>
                    <input type="text" className={inputClass} dir={isRTL ? 'rtl' : 'ltr'} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-bold text-gray-600 mb-2 ${isRTL ? 'text-right' : ''}`} style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                      {language === 'AR' ? 'رقم الهاتف' : 'Phone Number'}
                    </label>
                    <input type="tel" className={inputClass} dir="ltr" placeholder="05XX XXX XXX" />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.03)] border border-brand-pink/10">
                <h2 className="text-lg font-bold text-brand-darkred mb-6 flex items-center gap-3" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                  <span className="w-8 h-8 bg-brand-pinkishwhite text-brand-darkred rounded-full flex items-center justify-center text-sm font-black flex-shrink-0">2</span>
                  {language === 'AR' ? 'التوصيل والعنوان' : 'Delivery Address'}
                </h2>

                {/* Delivery Type */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <button
                    onClick={() => setDeliveryType('home')}
                    className={`relative flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border-2 transition-all ${deliveryType === 'home' ? 'border-brand-darkred bg-brand-pinkishwhite/30' : 'border-gray-100 hover:border-brand-pink'}`}
                  >
                    <Truck className={`w-8 h-8 ${deliveryType === 'home' ? 'text-brand-darkred' : 'text-gray-400'}`} />
                    <span className={`font-bold ${deliveryType === 'home' ? 'text-brand-darkred' : 'text-gray-500'}`} style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                      {language === 'AR' ? 'توصيل للمنزل' : 'Home Delivery'}
                    </span>
                    {deliveryType === 'home' && <CheckCircle2 className="w-5 h-5 text-brand-darkred absolute top-3 right-3" />}
                  </button>
                  <button
                    onClick={() => setDeliveryType('desk')}
                    className={`relative flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border-2 transition-all ${deliveryType === 'desk' ? 'border-brand-darkred bg-brand-pinkishwhite/30' : 'border-gray-100 hover:border-brand-pink'}`}
                  >
                    <Store className={`w-8 h-8 ${deliveryType === 'desk' ? 'text-brand-darkred' : 'text-gray-400'}`} />
                    <span className={`font-bold ${deliveryType === 'desk' ? 'text-brand-darkred' : 'text-gray-500'}`} style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                      {language === 'AR' ? 'توصيل للمكتب (Stop Desk)' : 'Stop Desk'}
                    </span>
                    {deliveryType === 'desk' && <CheckCircle2 className="w-5 h-5 text-brand-darkred absolute top-3 right-3" />}
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className={`block text-sm font-bold text-gray-600 mb-2 ${isRTL ? 'text-right' : ''}`} style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                      {language === 'AR' ? 'الولاية' : 'Province'}
                    </label>
                    <select className={`${inputClass} appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23b0bec5%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat ${isRTL ? 'bg-[position:1rem_center]' : 'bg-[position:calc(100%-1rem)_center]'} bg-[length:0.7rem]`}>
                      <option value="">{language === 'AR' ? 'اختر الولاية' : 'Select Province'}</option>
                      {algerianWilayas.map((w, i) => <option key={i} value={w}>{w}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-bold text-gray-600 mb-2 ${isRTL ? 'text-right' : ''}`} style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                      {language === 'AR' ? 'العنوان التفصيلي / البلدية' : 'Full Address / Commune'}
                    </label>
                    <input type="text" placeholder={language === 'AR' ? 'اكتب عنوانك بالتفصيل (البلدية، الشارع، رقم المنزل...)' : 'Enter detailed address...'} className={inputClass} dir={isRTL ? 'rtl' : 'ltr'} />
                  </div>
                </div>

                {/* Shipping Note */}
                <div className="mt-6 bg-blue-50/50 rounded-2xl p-4 flex gap-4 items-start border border-blue-100">
                  <div className="bg-blue-100 p-2 rounded-full flex-shrink-0 mt-0.5">
                    <HeartHandshake className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className={isRTL ? 'text-right' : ''}>
                    <h4 className="text-sm font-bold text-blue-900 mb-1" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                      {language === 'AR' ? 'ملاحظة حول أسعار الشحن' : 'Shipping Note'}
                    </h4>
                    <p className="text-xs text-blue-700/80 leading-relaxed font-medium" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                      {language === 'AR' 
                        ? 'نود التوضيح أن أسعار الشحن ليست هامش ربح لنا. نحن نحرص دائماً على التعاقد مع أفضل شركات التوصيل لتوفير أرخص وأسرع خدمة لضمان وصول طلبك بأمان وفي أبهى حلة.'
                        : 'Please note that shipping prices are not our profit margin. We always contract with the best delivery companies to provide the cheapest and fastest service.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.03)] border border-brand-pink/10">
                <h2 className="text-lg font-bold text-brand-darkred mb-6 flex items-center gap-3" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                  <span className="w-8 h-8 bg-brand-pinkishwhite text-brand-darkred rounded-full flex items-center justify-center text-sm font-black flex-shrink-0">3</span>
                  {language === 'AR' ? 'طريقة الدفع' : 'Payment Method'}
                </h2>

                <div className={`flex items-center gap-4 p-5 rounded-2xl border-2 border-brand-darkred bg-brand-pinkishwhite/30 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-12 h-12 rounded-full bg-brand-darkred flex items-center justify-center flex-shrink-0 shadow-inner">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div className={isRTL ? 'text-right' : ''}>
                    <p className="font-bold text-brand-darkred text-base" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                      {language === 'AR' ? 'الدفع عند الاستلام فقط' : 'Cash on Delivery ONLY'}
                    </p>
                    <p className="text-sm text-brand-darkred/70 mt-1 font-medium" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                      {language === 'AR' ? 'لن تدفعي أي شيء حتى يصلك الطلب لباب منزلك.' : 'You will not pay anything until you receive your order.'}
                    </p>
                  </div>
                  <CheckCircle2 className={`w-6 h-6 text-brand-darkred ${isRTL ? 'mr-auto' : 'ml-auto'}`} />
                </div>
              </div>

            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div 
            initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="w-full lg:w-2/5 order-1 lg:order-2"
          >
            <div className="bg-white rounded-3xl p-6 sm:p-8 sticky top-28 shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-brand-pink/20 overflow-hidden">
              <div className="absolute top-0 start-0 w-full h-1.5 bg-gradient-to-r from-brand-darkred to-brand-hotpink" />
              
              <h2 className="text-xl font-black text-gray-900 mb-6 pt-2" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : "'Playfair Display', serif" }}>
                {language === 'AR' ? 'ملخص الطلب' : 'Order Summary'}
              </h2>
              
              {/* Cart Items in Summary */}
              {items.length > 0 ? (
                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item, idx) => {
                    const product = products.find(p => p.id === item.productId);
                    if (!product) return null;
                    return (
                      <div key={idx} className={`flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className="relative">
                          <img src={product.image} alt={product.name} className="w-16 h-20 object-cover rounded-xl flex-shrink-0 shadow-sm" />
                          <span className="absolute -top-2 -end-2 w-6 h-6 bg-brand-darkred text-white text-xs font-bold flex items-center justify-center rounded-full shadow-md border-2 border-white">
                            {item.quantity}
                          </span>
                        </div>
                        <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
                          <p className="text-sm font-bold text-gray-800 line-clamp-2" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>{product.name}</p>
                          <p className="text-xs text-gray-500 mt-1 font-medium bg-gray-100 inline-block px-2 py-0.5 rounded-md">{item.selectedSize} · {item.selectedColor}</p>
                        </div>
                        <span className="font-black text-sm text-brand-darkred flex-shrink-0">{((product.price * item.quantity)*150).toFixed(0)} DZD</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400 font-medium" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                  {language === 'AR' ? 'السلة فارغة' : 'Cart is empty'}
                </div>
              )}

              {/* Totals */}
              <div className="bg-gray-50 rounded-2xl p-5 space-y-4">
                <div className={`flex justify-between items-center text-sm font-bold text-gray-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                    {language === 'AR' ? `المنتجات (${cartCount})` : `Items (${cartCount})`}
                  </span>
                  <span className="text-gray-700">{(cartTotal*150).toFixed(0)} DZD</span>
                </div>
                <div className={`flex justify-between items-center text-sm font-bold text-gray-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                    {language === 'AR' ? 'الشحن والتوصيل' : 'Shipping'}
                  </span>
                  <span className="text-gray-700">{cartCount > 0 ? shipping : 0} DZD</span>
                </div>
                
                <div className={`flex justify-between items-center border-t border-gray-200 pt-4 mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="font-black text-gray-900 text-lg" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                    {language === 'AR' ? 'المجموع النهائي' : 'Total'}
                  </span>
                  <span className="text-3xl font-black text-brand-darkred">
                    {((cartTotal*150) + (cartCount > 0 ? shipping : 0)).toFixed(0)} DZD
                  </span>
                </div>
              </div>

              {/* Confirm Button */}
              <motion.button 
                whileTap={{ scale: 0.98 }}
                whileHover={{ scale: 1.01 }}
                onClick={handleSubmit}
                disabled={cartCount === 0 || isSubmitting}
                className={`w-full mt-6 py-5 font-black rounded-2xl shadow-[0_10px_20px_rgba(160,18,72,0.2)] text-base flex items-center justify-center gap-3 transition-all relative overflow-hidden ${cartCount === 0 ? 'bg-gray-300 text-white cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-brand-darkred to-brand-hotpink text-white hover:opacity-95'}`}
                style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <PartyPopper className="w-5 h-5" />
                    {language === 'AR' ? 'إتمام الطلب بنجاح' : 'Confirm Order'}
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
