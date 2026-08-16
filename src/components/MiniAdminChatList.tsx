"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function MiniAdminChatList({ onClose }: { onClose: () => void }) {
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChats = async () => {
    try {
      const res = await fetch('/api/admin/chats?_t=' + Date.now());
      if (res.ok) {
        const data = await res.json();
        setChats(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
    const interval = setInterval(fetchChats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'fixed', bottom: '100px', right: '20px',
      width: '350px', maxWidth: 'calc(100vw - 40px)',
      height: '500px', maxHeight: 'calc(100vh - 120px)',
      backgroundColor: 'var(--background)',
      borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
      display: 'flex', flexDirection: 'column',
      zIndex: 10000, border: '1px solid var(--border)',
      overflow: 'hidden', animation: 'slideUp 0.3s ease-out'
    }}>
      <div style={{
        padding: '1rem', background: 'var(--primary)', color: '#1C5F5C',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontWeight: 'bold', borderBottom: '1px solid var(--border)'
      }}>
        <span>Chats Activos</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#1C5F5C', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
      </div>
      <div className="hide-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '0.5rem', backgroundColor: 'var(--background)' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Cargando chats...</div>
        ) : chats.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No hay chats activos.</div>
        ) : (
          chats.map(chat => (
            <div key={chat._id} style={{
              padding: '1rem', borderBottom: '1px solid var(--border)',
              cursor: 'pointer', transition: 'background 0.2s',
              backgroundColor: 'var(--card-bg)', borderRadius: '12px', marginBottom: '0.5rem'
            }} onClick={() => window.location.href = '/dashboard'}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong style={{ color: 'var(--foreground)' }}>{chat.productName || 'Soporte'}</strong>
                <span style={{ fontSize: '0.8rem', color: chat.status === 'open' ? '#10b981' : 'var(--text-muted)' }}>
                  {chat.status === 'open' ? 'Abierto' : 'Cerrado'}
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {chat.userEmail || chat.userName || 'Usuario anónimo'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem', opacity: 0.7 }}>
                Clic para ir al dashboard completo
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
