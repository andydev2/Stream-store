export type Product = {
  id: string;
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  price: number;
  icon: string;
  color: string;
  category: 'streaming' | 'ai' | 'music' | 'games' | 'recharges';
  details?: string[];
  detailsEn?: string[];
  images?: string[];
  stock?: number;
  requiresIdVerification?: boolean;
};

export const allProducts: Product[] = [
  { 
    id: 'netflix', 
    name: 'Netflix Premium', 
    description: 'Acceso a pantallas 4K UHD. Disfruta del mejor catálogo de series y películas sin interrupciones.', 
    descriptionEn: 'Access to 4K UHD screens. Enjoy the best catalog of series and movies without interruptions.',
    price: 4.99, 
    icon: 'N', 
    color: '#E50914',
    category: 'streaming',
    details: ['1 Pantalla Premium 4K', 'Descargas offline', 'Garantía 30 días', 'Soporte 24/7'],
    detailsEn: ['1 Premium 4K Screen', 'Offline downloads', '30-day warranty', '24/7 Support'],
    images: ['/netflix_1.jpg', '/netflix_2.jpg']
  },
  { 
    id: 'spotify', 
    name: 'Spotify Premium', 
    description: 'Música sin anuncios, modo offline y la mejor calidad de audio para tus playlists favoritas.', 
    descriptionEn: 'Ad-free music, offline mode, and the best audio quality for your favorite playlists.',
    price: 2.99, 
    icon: 'S', 
    color: '#1DB954',
    category: 'music',
    details: ['Cuenta individual premium', 'Sin anuncios', 'Descarga de canciones', 'Audio alta calidad'],
    detailsEn: ['Premium individual account', 'Ad-free', 'Song downloads', 'High quality audio']
  },
  { 
    id: 'chatgpt', 
    name: 'ChatGPT Plus', 
    description: 'Acceso a GPT-4, respuestas más rápidas y disponibilidad incluso en alta demanda.', 
    descriptionEn: 'Access to GPT-4, faster responses, and availability even during high demand.',
    price: 8.99, 
    icon: 'AI', 
    color: '#10A37F',
    category: 'ai',
    details: ['Acceso garantizado a GPT-4', 'Análisis avanzado de datos', 'Plugins habilitados', 'Garantía completa'],
    detailsEn: ['Guaranteed access to GPT-4', 'Advanced data analysis', 'Plugins enabled', 'Full warranty']
  },
  { 
    id: 'youtube', 
    name: 'YouTube Premium', 
    description: 'Videos sin anuncios, reproducción en segundo plano y acceso a YouTube Music.', 
    descriptionEn: 'Ad-free videos, background playback, and access to YouTube Music.',
    price: 3.49, 
    icon: 'Y', 
    color: '#FF0000',
    category: 'streaming',
    details: ['Sin publicidad', 'Reproducción en segundo plano', 'YouTube Music incluido'],
    detailsEn: ['Ad-free', 'Background playback', 'YouTube Music included']
  },
  { 
    id: 'freefire', 
    name: 'Free Fire - Diamantes & Evo', 
    nameEn: 'Free Fire - Diamonds & Evo',
    description: 'Cuenta con 5000 diamantes y 3 armas evolutivas al máximo.', 
    descriptionEn: 'Account with 5000 diamonds and 3 maxed out evolutionary weapons.',
    price: 24.99, 
    icon: 'FF', 
    color: 'var(--secondary)',
    category: 'games',
    details: ['Nivel de la cuenta: 50+', '5000 Diamantes disponibles en la cuenta', 'MP40 Cobra y AK Dragón al máximo nivel', 'Múltiples personajes desbloqueados', 'Garantía de recuperación de 100% segura'],
    detailsEn: ['Account level: 50+', '5000 Diamonds available in the account', 'MP40 Cobra and AK Dragon at max level', 'Multiple characters unlocked', '100% safe recovery warranty'],
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
    descriptionEn: 'Enjoy the best HBO series, Warner Bros movies, and the DC universe in 4K.',
    price: 3.99, 
    icon: 'M', 
    color: '#002BE7',
    category: 'streaming',
    details: ['1 Pantalla 4K', 'Perfiles personalizados', 'Garantía 30 días'],
    detailsEn: ['1 4K Screen', 'Custom profiles', '30-day warranty']
  },
  { 
    id: 'disneyplus', 
    name: 'Disney+ Premium', 
    description: 'Todo el contenido de Disney, Pixar, Marvel, Star Wars y National Geographic en un solo lugar.', 
    descriptionEn: 'All Disney, Pixar, Marvel, Star Wars, and National Geographic content in one place.',
    price: 4.49, 
    icon: 'D+', 
    color: '#00146B',
    category: 'streaming',
    details: ['1 Pantalla Premium 4K', 'Descargas para ver offline', 'Garantía 30 días'],
    detailsEn: ['1 Premium 4K Screen', 'Downloads for offline viewing', '30-day warranty']
  },
  { 
    id: 'canva', 
    name: 'Canva Pro', 
    description: 'Diseña como un profesional con acceso a todas las herramientas premium, plantillas y la nueva IA de Canva.', 
    descriptionEn: 'Design like a pro with access to all premium tools, templates, and the new Canva AI.',
    price: 2.49, 
    icon: 'C', 
    color: '#00C4CC',
    category: 'ai',
    details: ['Cuenta Pro privada', 'Herramientas mágicas de IA', 'Almacenamiento en la nube', 'Garantía 30 días'],
    detailsEn: ['Private Pro account', 'Magic AI tools', 'Cloud storage', '30-day warranty']
  },
  { 
    id: 'valorant', 
    name: 'Valorant - 2050 VP', 
    description: 'Recarga 2050 Valorant Points directo a tu cuenta de Riot Games de forma segura.', 
    descriptionEn: 'Recharge 2050 Valorant Points directly to your Riot Games account securely.',
    price: 19.99, 
    icon: 'V', 
    color: '#FF4655',
    category: 'games',
    details: ['Carga directa a tu Riot ID', 'VP utilizables para Pase de Batalla o Skins', 'Proceso 100% legal y seguro'],
    detailsEn: ['Direct charge to your Riot ID', 'VP usable for Battle Pass or Skins', '100% legal and safe process']
  },
  { 
    id: 'xbox', 
    name: 'Xbox Game Pass Ultimate', 
    description: 'Cientos de juegos de alta calidad en consola, PC y la nube, más multijugador online.', 
    descriptionEn: 'Hundreds of high-quality games on console, PC, and cloud, plus online multiplayer.',
    price: 9.99, 
    icon: 'X', 
    color: '#107C10',
    category: 'games',
    details: ['Suscripción Ultimate 1 Mes', 'EA Play incluido', 'Juegos en la nube (xCloud)', 'Garantía de activación'],
    detailsEn: ['1 Month Ultimate Subscription', 'EA Play included', 'Cloud gaming (xCloud)', 'Activation warranty']
  },
  { 
    id: 'applemusic', 
    name: 'Apple Music', 
    description: 'Millones de canciones en Audio Espacial y sin anuncios para todos tus dispositivos.', 
    descriptionEn: 'Millions of songs in Spatial Audio and ad-free for all your devices.',
    price: 3.49, 
    icon: 'A', 
    color: '#FA243C',
    category: 'music',
    details: ['Audio Lossless', 'Audio Espacial con Dolby Atmos', 'Sin anuncios', 'Suscripción privada'],
    detailsEn: ['Lossless Audio', 'Spatial Audio with Dolby Atmos', 'Ad-free', 'Private subscription']
  },
  { 
    id: 'ff-1188', 
    name: 'Free Fire - 1188 Diamantes', 
    nameEn: 'Free Fire - 1188 Diamonds',
    description: 'Recarga de 1188 diamantes directamente a tu cuenta mediante ID.', 
    descriptionEn: 'Recharge 1188 diamonds directly to your account via ID.',
    price: 8.50, 
    icon: '💎', 
    color: '#FFB800',
    category: 'recharges',
    requiresIdVerification: true,
    details: ['Recarga mediante Player ID', 'Requiere verificación del Admin', 'Proceso 100% legal y seguro'],
    detailsEn: ['Recharge via Player ID', 'Requires Admin verification', '100% legal and safe process']
  },
  { 
    id: 'ff-2398', 
    name: 'Free Fire - 2398 Diamantes', 
    nameEn: 'Free Fire - 2398 Diamonds',
    description: 'Recarga de 2398 diamantes directamente a tu cuenta mediante ID.', 
    descriptionEn: 'Recharge 2398 diamonds directly to your account via ID.',
    price: 16.50, 
    icon: '💎', 
    color: '#FF9500',
    category: 'recharges',
    requiresIdVerification: true,
    details: ['Recarga mediante Player ID', 'Requiere verificación del Admin', 'Proceso 100% legal y seguro'],
    detailsEn: ['Recharge via Player ID', 'Requires Admin verification', '100% legal and safe process']
  },
  { 
    id: 'ff-6160', 
    name: 'Free Fire - 6160 Diamantes', 
    nameEn: 'Free Fire - 6160 Diamonds',
    description: 'Recarga de 6160 diamantes directamente a tu cuenta mediante ID.', 
    descriptionEn: 'Recharge 6160 diamonds directly to your account via ID.',
    price: 38.50, 
    icon: '💎', 
    color: '#FF6F00',
    category: 'recharges',
    requiresIdVerification: true,
    details: ['Recarga mediante Player ID', 'Requiere verificación del Admin', 'Proceso 100% legal y seguro'],
    detailsEn: ['Recharge via Player ID', 'Requires Admin verification', '100% legal and safe process']
  }
];
