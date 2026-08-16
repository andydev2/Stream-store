"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSession } from 'next-auth/react';

interface ChatWidgetProps {
  product: { id: string; name: string };
  onClose: () => void;
  forceOpen?: number;
  isOpen?: boolean;
  onUnreadChange?: (hasUnread: boolean) => void;
}

interface Message {
  _id?: string;
  sender: 'user' | 'admin';
  text: string;
  createdAt?: string;
}

export default function ChatWidget({ product, onClose, forceOpen, isOpen = true, onUnreadChange }: ChatWidgetProps) {
  const { t } = useLanguage();
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [unreadAdminMessages, setUnreadAdminMessages] = useState(false);

  useEffect(() => {
    if (onUnreadChange) {
      onUnreadChange(unreadAdminMessages);
    }
  }, [unreadAdminMessages, onUnreadChange]);

  useEffect(() => {
    // Generate or retrieve session ID
    let sid = session?.user?.email;
    
    if (!sid) {
      sid = localStorage.getItem('chat_session_id');
      if (!sid) {
        sid = 'session_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('chat_session_id', sid);
      }
    }
    
    setSessionId(sid as string);
    
    // Initial fetch
    fetchChat(sid);

    // Poll for new messages every 3 seconds
    const interval = setInterval(() => {
      fetchChat(sid);
    }, 3000);

    return () => clearInterval(interval);
  }, [product.id, session?.user?.email]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);



  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const fetchChat = async (sid: string) => {
    try {
      const res = await fetch(`/api/chat?sessionId=${sid}&productId=${product.id}&_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.messages) {
          setMessages(prev => {
            // Check for new admin messages when closed
            if (!isOpen && data.messages.length > prev.length) {
              const lastMessage = data.messages[data.messages.length - 1];
              if (lastMessage.sender === 'admin') {
                setUnreadAdminMessages(true);
              }
            }
            return data.messages;
          });
        } else if (messages.length === 0) {
          // If no chat exists yet, auto-send first message
          await startChat(sid);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching chat', error);
      setLoading(false);
    }
  };

  const startChat = async (sid: string) => {
    const text = `Hola, me interesa la recarga de ${product.name}.`;
    await sendMessage(text, sid);
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText('');
    
    // Optimistic UI update
    setMessages(prev => [...prev, { sender: 'user', text }]);
    
    await sendMessage(text, sessionId);
  };

  const sendMessage = async (text: string, sid: string) => {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sid,
          productId: product.id,
          productName: product.name,
          userEmail: session?.user?.email || undefined,
          userName: session?.user?.name || undefined,
          text
        })
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Error sending message', error);
    }
  };

  // Eliminar el render del minimized widget, eso lo maneja GlobalChatWidget ahora
  return (
    <div style={{
      position: 'fixed',
      bottom: '100px', // por encima del FAB
      right: '20px',
      width: '350px',
      maxWidth: 'calc(100vw - 40px)', // Para celulares
      height: '500px',
      maxHeight: 'calc(100vh - 120px)', // Para no tapar la pantalla
      backgroundColor: 'var(--background)', // Fondo súper sólido
      borderRadius: '20px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
      display: isOpen ? 'flex' : 'none',
      flexDirection: 'column',
      zIndex: 10000,
      border: '1px solid var(--border)',
      overflow: 'hidden',
      animation: 'slideUp 0.3s ease-out'
    }}>
      {/* Header */}
      <div style={{
        padding: '1rem',
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
        color: '#1C5F5C',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontWeight: 'bold'
      }}>
        <span>{t('chat.title')} - {product.name}</span>
        <button 
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#1C5F5C',
            cursor: 'pointer',
            fontSize: '1.2rem',
            padding: '0.2rem 0.5rem',
            marginRight: '0.5rem'
          }}
          title="Minimizar"
        >
          _
        </button>
        <button 
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#1C5F5C',
            cursor: 'pointer',
            fontSize: '1.2rem',
            padding: '0.2rem 0.5rem'
          }}
          title="Minimizar chat"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="hide-scrollbar" style={{
        flex: 1,
        padding: '1rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
        backgroundColor: 'var(--background)' // Usar fondo sólido real de la paleta
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Cargando...</div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.sender === 'user' ? 'var(--primary)' : (msg.text === '$$PAYMENT_BUTTON$$' ? 'transparent' : 'var(--card-bg)'),
              color: msg.sender === 'user' ? '#1C5F5C' : 'var(--text-main)',
              padding: msg.text === '$$PAYMENT_BUTTON$$' ? '0' : '0.8rem 1rem',
              borderRadius: '16px',
              borderBottomRightRadius: msg.sender === 'user' ? '4px' : '16px',
              borderBottomLeftRadius: msg.sender === 'admin' ? '4px' : '16px',
              maxWidth: msg.text === '$$PAYMENT_BUTTON$$' ? '100%' : '85%',
              border: (msg.sender === 'admin' && msg.text !== '$$PAYMENT_BUTTON$$') ? '1px solid rgba(255,255,255,0.1)' : 'none',
              boxShadow: msg.text === '$$PAYMENT_BUTTON$$' ? 'none' : '0 2px 5px rgba(0,0,0,0.05)'
            }}>
              {msg.text === '$$PAYMENT_BUTTON$$' ? (
                <div style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  padding: '1.2rem',
                  borderRadius: '16px',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.8rem',
                  alignItems: 'center',
                  width: '100%'
                }}>
                  <div style={{ color: 'white', fontWeight: 'bold', textAlign: 'center', fontSize: '0.9rem' }}>
                    Recarga Aprobada
                  </div>
                  <button
                    onClick={async () => {
                      const btn = document.getElementById(`pay-btn-${idx}`);
                      if (btn) btn.innerHTML = 'Procesando...';
                      try {
                        // Fetch product details to get the exact price
                        const prodRes = await fetch(`/api/products/${product.id}`);
                        if (!prodRes.ok) throw new Error('Error fetching product');
                        const prodData = await prodRes.json();
                        
                        const res = await fetch('/api/checkout', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            items: [{
                              name: product.name,
                              price: prodData.price || 0,
                              quantity: 1
                            }]
                          })
                        });
                        const data = await res.json();
                        if (data.url) {
                          window.location.href = data.url;
                        }
                      } catch (e) {
                        console.error('Error during checkout', e);
                        if (btn) btn.innerHTML = 'Error. Intentar de nuevo';
                      }
                    }}
                    id={`pay-btn-${idx}`}
                    style={{
                      background: 'white',
                      color: '#059669',
                      border: 'none',
                      padding: '0.8rem 1.5rem',
                      borderRadius: '25px',
                      fontWeight: 'bold',
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      width: '100%',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      transition: 'transform 0.1s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    💳 Pagar con Tarjeta
                  </button>
                </div>
              ) : (
                <div style={{ fontSize: '0.95rem', lineHeight: 1.4 }}>{msg.text}</div>
              )}
              {msg.text !== '$$PAYMENT_BUTTON$$' && (
                <div style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: '4px', textAlign: 'right' }}>
                  {msg.sender === 'user' ? t('chat.user_title') : t('chat.admin_title')}
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '1rem',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        gap: '0.5rem',
        backgroundColor: 'var(--card-bg)'
      }}>
        <input 
          type="text" 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={t('chat.placeholder')}
          style={{
            flex: 1,
            padding: '0.8rem 1rem',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.03)',
            color: 'var(--text-main)',
            outline: 'none'
          }}
        />
        <button 
          onClick={handleSend}
          disabled={!inputText.trim()}
          style={{
            background: 'var(--primary)',
            color: '#1C5F5C',
            border: 'none',
            borderRadius: '50%',
            width: '45px',
            height: '45px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: inputText.trim() ? 'pointer' : 'not-allowed',
            opacity: inputText.trim() ? 1 : 0.5
          }}
        >
          ➤
        </button>
      </div>
      
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
