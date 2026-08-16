export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  color: string;
  category: 'streaming' | 'ai' | 'music' | 'games';
  details?: string[];
  images?: string[];
  stock?: number;
  requiresIdVerification?: boolean;
};

export const allProducts: Product[] = [
  { 
    id: 'netflix', 
    name: 'Netflix Premium', 
    description: 'Acceso a pantallas 4K UHD. Disfruta del mejor catálogo de series y películas sin interrupciones.', 
    price: 4.99, 
    icon: 'N', 
    color: '#E50914',
    category: 'streaming',
    details: ['1 Pantalla Premium 4K', 'Descargas offline', 'Garantía 30 días', 'Soporte 24/7'],
    images: ['/netflix_1.jpg', '/netflix_2.jpg']
  },
  { 
    id: 'spotify', 
    name: 'Spotify Premium', 
    description: 'Música sin anuncios, modo offline y la mejor calidad de audio para tus playlists favoritas.', 
    price: 2.99, 
    icon: 'S', 
    color: '#1DB954',
    category: 'music',
    details: ['Cuenta individual premium', 'Sin anuncios', 'Descarga de canciones', 'Audio alta calidad']
  },
  { 
    id: 'chatgpt', 
    name: 'ChatGPT Plus', 
    description: 'Acceso a GPT-4, respuestas más rápidas y disponibilidad incluso en alta demanda.', 
    price: 8.99, 
    icon: 'AI', 
    color: '#10A37F',
    category: 'ai',
    details: ['Acceso garantizado a GPT-4', 'Análisis avanzado de datos', 'Plugins habilitados', 'Garantía completa']
  },
  { 
    id: 'youtube', 
    name: 'YouTube Premium', 
    description: 'Videos sin anuncios, reproducción en segundo plano y acceso a YouTube Music.', 
    price: 3.49, 
    icon: 'Y', 
    color: '#FF0000',
    category: 'streaming',
    details: ['Sin publicidad', 'Reproducción en segundo plano', 'YouTube Music incluido']
  },
  { 
    id: 'freefire', 
    name: 'Free Fire - Diamantes & Evo', 
    description: 'Cuenta con 5000 diamantes y 3 armas evolutivas al máximo.', 
    price: 24.99, 
    icon: 'FF', 
    color: 'var(--secondary)',
    category: 'games',
    details: ['Nivel de la cuenta: 50+', '5000 Diamantes disponibles en la cuenta', 'MP40 Cobra y AK Dragón al máximo nivel', 'Múltiples personajes desbloqueados', 'Garantía de recuperación de 100% segura'],
    images: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ]
  },
  { 
    id: 'hbomax', 
    name: 'Max (HBO) Premium', 
    description: 'Disfruta de las mejores series de HBO, películas de Warner Bros y el universo DC en 4K.', 
    price: 3.99, 
    icon: 'M', 
    color: '#002BE7',
    category: 'streaming',
    details: ['1 Pantalla 4K', 'Perfiles personalizados', 'Garantía 30 días']
  },
  { 
    id: 'disneyplus', 
    name: 'Disney+ Premium', 
    description: 'Todo el contenido de Disney, Pixar, Marvel, Star Wars y National Geographic en un solo lugar.', 
    price: 4.49, 
    icon: 'D+', 
    color: '#00146B',
    category: 'streaming',
    details: ['1 Pantalla Premium 4K', 'Descargas para ver offline', 'Garantía 30 días']
  },
  { 
    id: 'canva', 
    name: 'Canva Pro', 
    description: 'Diseña como un profesional con acceso a todas las herramientas premium, plantillas y la nueva IA de Canva.', 
    price: 2.49, 
    icon: 'C', 
    color: '#00C4CC',
    category: 'ai',
    details: ['Cuenta Pro privada', 'Herramientas mágicas de IA', 'Almacenamiento en la nube', 'Garantía 30 días']
  },
  { 
    id: 'valorant', 
    name: 'Valorant - 2050 VP', 
    description: 'Recarga 2050 Valorant Points directo a tu cuenta de Riot Games de forma segura.', 
    price: 19.99, 
    icon: 'V', 
    color: '#FF4655',
    category: 'games',
    details: ['Carga directa a tu Riot ID', 'VP utilizables para Pase de Batalla o Skins', 'Proceso 100% legal y seguro']
  },
  { 
    id: 'xbox', 
    name: 'Xbox Game Pass Ultimate', 
    description: 'Cientos de juegos de alta calidad en consola, PC y la nube, más multijugador online.', 
    price: 9.99, 
    icon: 'X', 
    color: '#107C10',
    category: 'games',
    details: ['Suscripción Ultimate 1 Mes', 'EA Play incluido', 'Juegos en la nube (xCloud)', 'Garantía de activación']
  },
  { 
    id: 'applemusic', 
    name: 'Apple Music', 
    description: 'Millones de canciones en Audio Espacial y sin anuncios para todos tus dispositivos.', 
    price: 3.49, 
    icon: 'A', 
    color: '#FA243C',
    category: 'music',
    details: ['Audio Lossless', 'Audio Espacial con Dolby Atmos', 'Sin anuncios', 'Suscripción privada']
  },
  { 
    id: 'freefire-recharge', 
    name: 'Free Fire - Recarga 1060 Diamantes', 
    description: 'Recarga de 1060 diamantes directamente a tu cuenta mediante ID.', 
    price: 9.99, 
    icon: '💎', 
    color: '#FFB800',
    category: 'games',
    requiresIdVerification: true,
    details: ['Recarga mediante Player ID', 'Requiere verificación del Admin', 'Proceso 100% legal y seguro']
  },
  { 
    id: 'fortnite-recharge', 
    name: 'Fortnite - Recarga 1000 Pavos', 
    description: 'Recarga de 1000 Pavos (V-Bucks) directamente a tu cuenta de Epic Games.', 
    price: 8.99, 
    icon: '⛏️', 
    color: '#0078F2',
    category: 'games',
    requiresIdVerification: true,
    details: ['Recarga mediante ID/Tag', 'Requiere verificación del Admin', 'Proceso 100% legal y seguro']
  }
];
