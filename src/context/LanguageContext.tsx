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
    'nav.about': 'Sobre Mí',
    'nav.support': 'Soporte',
    'nav.login': 'Entrar',
    'nav.dashboard': 'Mi Panel',
    'hero.title': 'Ahorra hasta 85% en IA, streaming y juegos premium.',
    'hero.desc': 'Inauguramos nuestra nueva tienda web con el respaldo de 5 años de experiencia vendiendo cuentas premium de streaming y juegos. Compra con total seguridad y recibe acceso inmediato.',
    'cat.all': 'Todo',
    'cat.streaming': 'Streaming',
    'cat.ai': 'IA',
    'cat.music': 'Música',
    'cat.games': 'Juegos',
    'cat.recharges': 'Diamantes de Free Fire',
    'empty.search': 'No se encontraron productos para tu búsqueda.',
    'why.title': '¿Por qué elegirnos?',
    'why.exp.title': '5 Años de Experiencia',
    'why.exp.desc': 'Hemos brindado servicio a miles de clientes a través de redes sociales, ahora con tienda web oficial.',
    'why.delivery.title': 'Entrega Inmediata',
    'why.delivery.desc': 'Recibe tu cuenta y credenciales automáticamente tras tu pago.',
    'why.warranty.title': 'Garantía Total',
    'why.warranty.desc': 'Cuentas 100% legales y garantizadas durante todo tu periodo.',
    'why.support.title': 'Soporte Dedicado',
    'why.support.desc': 'Atención personalizada para resolver cualquier inconveniente rápidamente.',
    'about.title': 'Sobre Mí',
    'about.subtitle': 'De las redes a tu pantalla',
    'about.desc1': '¡Hola! Soy Diego, y durante los últimos 5 años me he dedicado a acercar el mejor entretenimiento digital a miles de personas.',
    'about.desc2': 'Lo que empezó como ventas a través de redes, hoy evoluciona en esta plataforma oficial para brindarte mayor seguridad y comodidad. Mi compromiso sigue siendo el mismo: cuentas legales, precios accesibles y garantía total.',
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
    'product.verify_id': 'Chat para recargar',
    'chat.title': 'Chat de Soporte',
    'chat.placeholder': 'Escribe tu mensaje...',
    'chat.send': 'Enviar',
    'chat.admin_title': 'Admin',
    'chat.user_title': 'Tú',
  },
  EN: {
    'nav.search': 'Discover your next subscription...',
    'nav.catalog': 'Catalog',
    'nav.about': 'About Me',
    'nav.support': 'Support',
    'nav.login': 'Login',
    'nav.dashboard': 'My Dashboard',
    'hero.title': 'Save up to 85% on premium AI, streaming, and gaming.',
    'hero.desc': 'Opening our new web store backed by 5 years of experience selling premium streaming and gaming accounts. Shop securely and get instant access.',
    'cat.all': 'All',
    'cat.streaming': 'Streaming',
    'cat.ai': 'AI',
    'cat.music': 'Music',
    'cat.games': 'Games',
    'cat.recharges': 'Free Fire Diamonds',
    'empty.search': 'No products found for your search.',
    'why.title': 'Why Choose Us?',
    'why.exp.title': '5 Years of Experience',
    'why.exp.desc': 'We have served thousands of customers through social media, now with an official web store.',
    'why.delivery.title': 'Instant Delivery',
    'why.delivery.desc': 'Receive your account and credentials automatically after payment.',
    'why.warranty.title': 'Total Warranty',
    'why.warranty.desc': '100% legal accounts guaranteed throughout your subscription period.',
    'why.support.title': 'Dedicated Support',
    'why.support.desc': 'Personalized attention to resolve any issues quickly.',
    'about.title': 'About Me',
    'about.subtitle': 'From social media to your screen',
    'about.desc1': 'Hello! I am Diego, and for the past 5 years I have dedicated myself to bringing the best digital entertainment to thousands of people.',
    'about.desc2': 'What started as sales through social networks, today evolves into this official platform to provide greater security and comfort. My commitment remains the same: legal accounts, affordable prices, and total warranty.',
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
    'product.verify_id': 'Chat to Recharge',
    'chat.title': 'Support Chat',
    'chat.placeholder': 'Type your message...',
    'chat.send': 'Send',
    'chat.admin_title': 'Admin',
    'chat.user_title': 'You',
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
