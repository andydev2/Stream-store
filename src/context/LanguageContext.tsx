"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ES' | 'EN';

type LanguageContextType = {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
};

const translations = {
  ES: {
    'nav.search': 'Descubre tu próxima suscripción...',
    'nav.catalog': 'Catálogo',
    'nav.support': 'Soporte',
    'nav.login': 'Entrar',
    'nav.dashboard': 'Mi Panel',
    'hero.title': 'Ahorra hasta 85% en IA, streaming y juegos premium.',
    'hero.desc': 'Con la confianza de más de 10M de usuarios en 150 países. Paga de forma segura y recibe tu cuenta inmediatamente.',
    'cat.all': 'Todo',
    'cat.streaming': 'Streaming',
    'cat.ai': 'IA',
    'cat.music': 'Música',
    'cat.games': 'Juegos',
    'empty.search': 'No se encontraron productos para tu búsqueda.',
    'ref.title': 'Referencias de Clientes Reales',
    'cart.add': 'Agregar al Carrito',
    'cart.title': 'Tu Carrito',
    'cart.empty': 'Tu carrito está vacío',
    'cart.subtotal': 'Subtotal',
    'cart.checkout.card': 'Pagar con Tarjeta',
    'cart.checkout.paypal': 'Pagar con PayPal',
    'modal.includes': '¿Qué incluye?',
    'product.month': '/ mes',
    'product.details': 'Ver más detalles',
    'product.stock.available': 'cuentas disponibles',
    'product.stock.out': 'Agotado',
    'product.stock.none': 'Sin Stock',
    'dashboard.purchases': 'Mis Compras',
    'dashboard.purchases.empty': 'Aún no tienes suscripciones activas. ¡Explora el catálogo!',
    'dashboard.admin': 'Panel de Administrador',
    'dashboard.logout': 'Cerrar Sesión',
    'footer.desc': 'Tu tienda de confianza para servicios digitales premium.',
    'footer.links': 'Enlaces',
    'footer.legal': 'Legales',
    'footer.terms': 'Términos y Condiciones',
    'footer.privacy': 'Política de Privacidad',
    'footer.rights': 'Todos los derechos reservados.',
    'footer.developed': 'Desarrollado por',
    'review.title': 'Opiniones de nuestros clientes',
    'review.leave': 'Dejar una opinión',
    'review.name': 'Tu nombre',
    'review.comment': 'Cuéntanos tu experiencia...',
    'review.submit': 'Publicar Opinión',
    'review.empty': 'Aún no hay opiniones. ¡Sé el primero en comentar!',
  },
  EN: {
    'nav.search': 'Discover your next subscription...',
    'nav.catalog': 'Catalog',
    'nav.support': 'Support',
    'nav.login': 'Login',
    'nav.dashboard': 'My Dashboard',
    'hero.title': 'Save up to 85% on premium AI, streaming, and gaming.',
    'hero.desc': 'Trusted by 10M+ users across 150+ countries. Pay securely and receive your account immediately.',
    'cat.all': 'All',
    'cat.streaming': 'Streaming',
    'cat.ai': 'AI',
    'cat.music': 'Music',
    'cat.games': 'Games',
    'empty.search': 'No products found for your search.',
    'ref.title': 'Real Customer References',
    'cart.add': 'Add to Cart',
    'cart.title': 'Your Cart',
    'cart.empty': 'Your cart is empty',
    'cart.subtotal': 'Subtotal',
    'cart.checkout.card': 'Pay with Card',
    'cart.checkout.paypal': 'Pay with PayPal',
    'modal.includes': 'What is included?',
    'product.month': '/ month',
    'product.details': 'View details',
    'product.stock.available': 'accounts available',
    'product.stock.out': 'Out of Stock',
    'product.stock.none': 'No Stock',
    'dashboard.purchases': 'My Purchases',
    'dashboard.purchases.empty': 'You have no active subscriptions yet. Explore our catalog!',
    'dashboard.admin': 'Admin Dashboard',
    'dashboard.logout': 'Logout',
    'footer.desc': 'Your trusted store for premium digital services.',
    'footer.links': 'Links',
    'footer.legal': 'Legal',
    'footer.terms': 'Terms & Conditions',
    'footer.privacy': 'Privacy Policy',
    'footer.rights': 'All rights reserved.',
    'footer.developed': 'Developed by',
    'review.title': 'Customer Reviews',
    'review.leave': 'Leave a review',
    'review.name': 'Your name',
    'review.comment': 'Tell us about your experience...',
    'review.submit': 'Post Review',
    'review.empty': 'No reviews yet. Be the first to comment!',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('ES');

  useEffect(() => {
    const savedLang = localStorage.getItem('lang') as Language;
    if (savedLang && (savedLang === 'ES' || savedLang === 'EN')) {
      setLanguage(savedLang);
    }
  }, []);

  const toggleLanguage = () => {
    setLanguage(prev => {
      const newLang = prev === 'ES' ? 'EN' : 'ES';
      localStorage.setItem('lang', newLang);
      return newLang;
    });
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['ES']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
