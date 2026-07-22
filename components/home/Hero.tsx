'use client';
import { useLocale } from 'next-intl';
import { motion, useMotionValue } from 'framer-motion';
import { useState } from 'react';

const sliderImages = [
  '/hero_images/upscalemedia-transformed.jpeg',
  '/hero_images/upscalemedia-transformed (1).jpeg',
  '/hero_images/upscalemedia-transformed (2).jpeg',
  '/hero_images/upscalemedia-transformed (3).jpeg',
  '/hero_images/upscalemedia-transformed (4).jpeg',
  '/hero_images/upscalemedia-transformed (5).jpeg',
  '/hero_images/upscalemedia-transformed (6).jpeg',
  '/hero_images/upscalemedia-transformed (7).jpeg',
  '/hero_images/upscalemedia-transformed (8).jpeg',
  '/hero_images/upscalemedia-transformed (9).jpeg',
  '/hero_images/upscalemedia-transformed (10).jpeg',
];

export default function Hero() {
  const language = useLocale().toUpperCase();
  const isRTL = language === 'AR';
  
  const [imgIndex, setImgIndex] = useState(0);

  const onDragEnd = (e: any, { offset }: any) => {
    const swipe = offset.x;
    const DRAG_BUFFER = 50;
    if (swipe <= -DRAG_BUFFER && imgIndex < sliderImages.length - 1) {
      setImgIndex(imgIndex + 1);
    } else if (swipe >= DRAG_BUFFER && imgIndex > 0) {
      setImgIndex(imgIndex - 1);
    }
  };

  const marqueeTexts = isRTL 
    ? ["توصيل مجاني للطلبات فوق 5000 د.ج", "أحدث صيحات الصيف", "جودة عالية بأسعار تنافسية", "دفع عند الاستلام", "تسوقي الآن وتألقي"]
    : ["Free delivery on orders over 5000 DZD", "Latest Summer Trends", "High Quality at Best Prices", "Cash on Delivery", "Shop Now & Shine"];

  return (
    <>
      <div className="relative w-full h-[45vh] sm:h-[60vh] lg:h-[85vh] bg-brand-pinkishwhite overflow-hidden group">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          animate={{ x: `-${imgIndex * 100}%` }}
          transition={{ type: "spring", mass: 3, stiffness: 400, damping: 50 }}
          onDragEnd={onDragEnd}
          className="flex w-full h-full items-center cursor-grab active:cursor-grabbing"
          dir="ltr"
        >
          {sliderImages.map((src, idx) => (
            <motion.div
              key={idx}
              style={{
                backgroundImage: `url("${src}")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              animate={{
                scale: imgIndex === idx ? 1 : 0.95,
              }}
              transition={{ type: "spring", mass: 3, stiffness: 400, damping: 50 }}
              className="w-full h-full shrink-0 relative"
            >
              <div className="absolute inset-0 bg-brand-darkred/20 mix-blend-multiply pointer-events-none"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-24 pointer-events-none items-start text-start">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white text-xl md:text-3xl font-bold mb-2 tracking-widest drop-shadow-md"
          >
            {language === 'AR' ? 'حتى' : 'UP TO'}
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white text-6xl md:text-8xl lg:text-[9rem] font-black tracking-tighter leading-[0.85] drop-shadow-lg mb-2" 
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            {language === 'AR' ? '60% خصم' : '60% OFF'}
          </motion.h2>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-white text-4xl md:text-6xl lg:text-7xl tracking-tight drop-shadow-md mt-4"
            style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
          >
            {language === 'AR' ? 'أزياء الصيف الرائعة' : 'summer styles'}
          </motion.h3>
        </div>
        
        {/* Dots Indicator */}
        <div className={`absolute bottom-6 left-0 right-0 flex justify-center gap-2 pointer-events-none ${isRTL ? 'flex-row-reverse' : ''}`}>
          {sliderImages.map((_, idx) => (
            <div 
              key={idx} 
              className={`w-2.5 h-2.5 rounded-full transition-colors ${idx === imgIndex ? 'bg-white' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </div>

      {/* Marquee Section */}
      <div className="w-full bg-brand-hotpink text-white py-3 overflow-hidden border-b-4 border-brand-darkred shadow-inner flex relative items-center">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 35,
          }}
          className="flex whitespace-nowrap items-center w-max"
        >
          {/* Repeat 12 times to ensure seamless infinite scroll without empty gaps */}
          {[...Array(12)].map((_, groupIdx) => (
            <div key={groupIdx} className={`flex items-center gap-8 px-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {marqueeTexts.map((text, idx) => (
                <div key={`${groupIdx}-${idx}`} className={`flex items-center gap-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-sm sm:text-base font-bold tracking-wide" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : 'inherit' }}>
                    {text}
                  </span>
                  <span className="text-white/40 font-black text-xl">·</span>
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </>
  );
}
