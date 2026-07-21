'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { products } from '@/lib/data';

type CartItem = {
  productId: number;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('queen-cart');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('queen-cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(p => p.productId === item.productId && p.selectedColor === item.selectedColor && p.selectedSize === item.selectedSize);
      if (existing) {
        return prev.map(p => 
          p === existing ? { ...p, quantity: p.quantity + item.quantity } : p
        );
      }
      return [...prev, item];
    });
    window.dispatchEvent(new CustomEvent('cart-updated'));
  };

  const removeFromCart = (productId: number) => {
    setItems(prev => prev.filter(p => p.productId !== productId));
  };

  const updateQuantity = (productId: number, qty: number) => {
    setItems(prev => prev.map(p => p.productId === productId ? { ...p, quantity: qty } : p));
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  
  const cartTotal = items.reduce((acc, item) => {
    const p = products.find(prod => prod.id === item.productId);
    return acc + (p?.price || 0) * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
