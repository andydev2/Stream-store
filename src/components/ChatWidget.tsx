"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface ChatWidgetProps {
  product: { id: string; name: string };
  onClose: () => void;
}

interface Message {
  _id?: string;
  sender: 'user' | 'admin';
  text: string;
  createdAt?: string;
}

export default function ChatWidget({ product, onClose }: ChatWidgetProps) {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    // Generate or retrieve session ID
    let sid = localStorage.getItem('chat_session_id');
    if (!sid) {
      sid = 'session_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('chat_session_id', sid);
    }
    setSessionId(sid);
    
    // Initial fetch
    fetchChat(sid);

    // Poll for new messages every 3 seconds
    const interval = setInterval(() => {
      fetchChat(sid);
    }, 3000);

    return () => clearInterval(interval);
  }, [product.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchChat = async (sid: string) => {
    try {
      const res = await fetch(`/api/chat?sessionId=${sid}&productId=${product.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.messages) {
          setMessages(data.messages);
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

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '350px',
      height: '500px',
      backgroundColor: 'var(--card-bg)',
      borderRadius: '20px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000,
      border: '1px solid rgba(255,255,255,0.1)',
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
            padding: '0.2rem 0.5rem'
          }}
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
        backgroundColor: 'rgba(0,0,0,0.02)'
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Cargando...</div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.sender === 'user' ? 'var(--primary)' : 'var(--card-bg)',
              color: msg.sender === 'user' ? '#1C5F5C' : 'var(--text-main)',
              padding: '0.8rem 1rem',
              borderRadius: '16px',
              borderBottomRightRadius: msg.sender === 'user' ? '4px' : '16px',
              borderBottomLeftRadius: msg.sender === 'admin' ? '4px' : '16px',
              maxWidth: '85%',
              border: msg.sender === 'admin' ? '1px solid rgba(255,255,255,0.1)' : 'none',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}>
              <div style={{ fontSize: '0.95rem', lineHeight: 1.4 }}>{msg.text}</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: '4px', textAlign: 'right' }}>
                {msg.sender === 'user' ? t('chat.user_title') : t('chat.admin_title')}
              </div>
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
