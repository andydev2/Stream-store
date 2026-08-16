"use client";

import React, { useState, useEffect } from 'react';
import ChatWidget from './ChatWidget';
import { useTheme } from 'next-themes';
import { useSession } from 'next-auth/react';
import { MessageCircle, Sun, Moon, Plus, ShieldAlert } from 'lucide-react';
import MiniAdminChatList from './MiniAdminChatList';

export default function GlobalChatWidget({ isAdmin = false }: { isAdmin?: boolean }) {
  const [product, setProduct] = useState<{ id: string; name: string } | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadAdminMessages, setUnreadAdminMessages] = useState(false);
  
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
    const handleOpenChat = (e: CustomEvent<{ id: string; name: string }>) => {
      if (!isAdmin) {
        setProduct(e.detail);
      }
      setIsOpen(true);
      setMenuOpen(false);
    };

    window.addEventListener('open-chat' as any, handleOpenChat);

    return () => {
      window.removeEventListener('open-chat' as any, handleOpenChat);
    };
  }, []);

  const handleToggleChat = () => {
    if (!isAdmin && !isOpen && !product) {
      setProduct({ id: 'soporte', name: 'Atención al Cliente' });
    }
    setIsOpen(!isOpen);
    setMenuOpen(false);
    if (!isOpen) setUnreadAdminMessages(false);
  };

  if (!mounted) return null;

  return (
    <>
      {/* Floating Action Menu */}
      <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        
        {/* Secondary Buttons (Theme & Chat) */}
        <div style={{ 
          display: 'flex', flexDirection: 'column', gap: '1rem', 
          opacity: menuOpen ? 1 : 0, 
          transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}>
          {/* Theme Button */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            style={{ 
              background: 'var(--card-bg)', color: 'var(--primary)', border: '1px solid var(--border)',
              width: '48px', height: '48px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
            }}
            title="Cambiar Tema"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Chat / Admin Button */}
          <button
            onClick={handleToggleChat}
            style={{ 
              background: 'var(--card-bg)', color: 'var(--primary)', border: '1px solid var(--border)',
              width: '48px', height: '48px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)', position: 'relative'
            }}
            title={isAdmin ? "Panel Admin" : "Soporte"}
          >
            {isAdmin ? <ShieldAlert size={20} /> : <MessageCircle size={20} />}
            {!isAdmin && unreadAdminMessages && !isOpen && (
              <span style={{
                position: 'absolute', top: '-4px', right: '-4px',
                width: '12px', height: '12px', borderRadius: '50%',
                backgroundColor: '#ef4444', border: '2px solid var(--bg-main)'
              }} />
            )}
          </button>
        </div>

        {/* Main FAB */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ 
            background: 'var(--primary)', color: '#1C5F5C', border: 'none',
            width: '64px', height: '64px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(62, 213, 204, 0.4)',
            transition: 'transform 0.3s ease',
            transform: menuOpen ? 'rotate(45deg)' : 'rotate(0deg)'
          }}
          className={!isAdmin && unreadAdminMessages && !isOpen && !menuOpen ? 'fab-unread' : ''}
        >
          <Plus size={32} />
          {!isAdmin && unreadAdminMessages && !isOpen && !menuOpen && (
            <span style={{
              position: 'absolute', top: '0', right: '0',
              width: '16px', height: '16px', borderRadius: '50%',
              backgroundColor: '#ef4444', border: '3px solid var(--bg-main)'
            }} />
          )}
        </button>
      </div>

      <style>{`
        @keyframes ring-bounce {
          0% { transform: rotate(0deg) scale(1); }
          15% { transform: rotate(-15deg) scale(1.1); }
          30% { transform: rotate(15deg) scale(1.1); }
          45% { transform: rotate(-15deg) scale(1.1); }
          60% { transform: rotate(15deg) scale(1.1); }
          75% { transform: rotate(-15deg) scale(1.1); }
          100% { transform: rotate(0deg) scale(1); }
        }
        .fab-unread {
          animation: ring-bounce 1.5s infinite;
        }
      `}</style>

      {/* Chat Window / Mini Admin Dashboard */}
      {isAdmin ? (
        isOpen && <MiniAdminChatList onClose={() => setIsOpen(false)} />
      ) : (
        product && (
          <ChatWidget 
            product={product} 
            isOpen={isOpen}
            onClose={() => setIsOpen(false)} 
            forceOpen={Date.now()}
            onUnreadChange={setUnreadAdminMessages}
          />
        )
      )}
    </>
  );
}
