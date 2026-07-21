import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/lib/i18n/routing';

export const metadata = {
  title: 'Your Cart | The Queen of Lingerie',
};

export default async function CartPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  return (
    <div className="container mx-auto px-4 py-12 min-h-[80vh]">
      <h1 className="text-3xl font-serif text-gold mb-12">Your Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          {/* Cart Items Placeholder */}
          <div className="glass-card p-12 text-center flex flex-col items-center justify-center min-h-[300px] border border-border">
            <p className="text-cream-dim mb-6 text-lg">Your cart is currently empty.</p>
            <Link 
              href="/shop" 
              className="px-8 py-3 bg-primary-soft border border-gold text-gold hover:bg-gold hover:text-primary transition-all duration-300 font-bold tracking-widest text-sm uppercase"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        <div className="lg:col-span-1">
          {/* Order Summary */}
          <div className="glass-card p-8 border border-border sticky top-32">
            <h2 className="text-xl font-serif text-cream mb-6 border-b border-border pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between text-cream-dim">
                <span>Subtotal</span>
                <span>SAR 0.00</span>
              </div>
              <div className="flex justify-between text-cream-dim">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-gold font-bold pt-4 border-t border-border text-lg">
                <span>Total</span>
                <span>SAR 0.00</span>
              </div>
            </div>

            <Link 
              href="/checkout"
              className="w-full block text-center px-6 py-4 bg-gold hover:bg-gold-bright text-primary font-bold tracking-widest uppercase text-sm transition-colors duration-300 opacity-50 cursor-not-allowed pointer-events-none"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
