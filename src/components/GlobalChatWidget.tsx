"use client";

import React, { useState, useEffect } from 'react';
import ChatWidget from './ChatWidget';

export default function GlobalChatWidget() {
  const [product, setProduct] = useState<{ id: string; name: string }>({ id: 'soporte', name: 'Atención al Cliente' });
  const [forceOpen, setForceOpen] = useState(0);

  useEffect(() => {
    // Escuchar eventos para abrir el chat desde botones específicos
    const handleOpenChat = (e: CustomEvent<{ id: string; name: string }>) => {
      setProduct(e.detail);
      setForceOpen(Date.now()); // Forzar a que se abra (des-minimice)
    };

    window.addEventListener('open-chat' as any, handleOpenChat);

    return () => {
      window.removeEventListener('open-chat' as any, handleOpenChat);
    };
  }, []);

  return (
    <ChatWidget 
      product={product} 
      onClose={() => {}} 
      forceOpen={forceOpen} 
    />
  );
}
