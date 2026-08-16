"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

type CartItem = {
  id: string;
  name: string;
  nameEn?: string;
  description: string;
  price: number;
  icon: string;
  color: string;
  quantity: number;
  details?: string[];
  images?: string[];
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  cartTotal: number;
  cartCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { data: session, status } = useSession();
  const [isInitialized, setIsInitialized] = useState(false);

  // Cargar carrito desde la base de datos al iniciar sesión o cargar la página
  useEffect(() => {
    const fetchCart = async () => {
      if (status === 'authenticated') {
        try {
          const res = await fetch('/api/user/cart');
          if (res.ok) {
            const data = await res.json();
            setCart(data.cart || []);
          }
        } catch (error) {
          console.error("Error fetching cart:", error);
        }
      } else if (status === 'unauthenticated') {
        setCart([]); // Limpiar carrito si no hay sesión
      }
      setIsInitialized(true);
    };

    fetchCart();
  }, [status]);

  // Guardar carrito en la base de datos cada vez que cambia
  useEffect(() => {
    if (isInitialized && status === 'authenticated') {
      const syncCart = async () => {
        try {
          await fetch('/api/user/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart })
          });
        } catch (error) {
          console.error("Error saving cart:", error);
        }
      };
      
      const timer = setTimeout(syncCart, 500); // Debounce de 500ms
      return () => clearTimeout(timer);
    }
  }, [cart, isInitialized, status]);

  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true); // Abrir el carrito automáticamente al añadir
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, isCartOpen, setIsCartOpen, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
