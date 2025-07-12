"use client";

import { createContext, useContext, useEffect, useState } from 'react';

type CartItem = {
  id: number;
  product_id: number;
  quantity: number;
  products: {
    id: number;
    title: string;
    image: string | null;
    stock: number;
    price: number;
  };
};

type Cart = {
  id: string;
  cart_items: CartItem[];
};

type CartContextType = {
  cart: Cart | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/cart');
      const data = await response.json();
      setCart(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('An unknown error occurred'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ cart, isLoading, error, refetch: fetchCart }}>
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