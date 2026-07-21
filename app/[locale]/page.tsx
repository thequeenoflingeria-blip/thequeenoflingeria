import Hero from '@/components/home/Hero';
import CategoryGrid from '@/components/home/CategoryGrid';
import ProductCarousel from '@/components/home/ProductCarousel';
import { getLocale } from 'next-intl/server';

export default async function Home() {
  const locale = await getLocale();
  const isAR = locale === 'ar';

  return (
    <>
      <Hero />
      <CategoryGrid />
      <ProductCarousel 
        title={isAR ? 'الرائج الآن' : 'Trending Now'} 
      />
      <div id="sale-section">
        <ProductCarousel 
          title={isAR ? '🔥 عروض وتخفيضات' : '🔥 Offers & Sale'} 
          startIndex={4}
        />
      </div>
      <div id="new-arrivals-section">
        <ProductCarousel 
          title={isAR ? '✨ وصل حديثاً' : '✨ New In'} 
          startIndex={0}
        />
      </div>
    </>
  );
}

