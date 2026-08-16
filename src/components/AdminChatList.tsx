"use client";

import React, { useState, useEffect, useRef } from 'react';

interface Message {
  _id?: string;
  sender: 'user' | 'admin';
  text: string;
  createdAt: string;
}

interface Chat {
  _id: string;
  sessionId: string;
  productId: string;
  productName?: string;
  userEmail?: string;
  userName?: string;
  status: 'open' | 'closed';
  messages: Message[];
  updatedAt: string;
}

export default function AdminChatList() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChats();
    // Poll for updates
    const interval = setInterval(() => {
      fetchChats();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const selectedChat = chats.find(c => c._id === selectedChatId);

  useEffect(() => {
    if (selectedChat) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChat?.messages.length]);

  const fetchChats = async () => {
    try {
      const res = await fetch(`/api/admin/chats?_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        setChats(data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin chats', error);
      setLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedChatId) return;

    const text = replyText;
    setReplyText('');

    // Optimistic update
    setChats(prev => prev.map(c => {
      if (c._id === selectedChatId) {
        return {
          ...c,
          messages: [...c.messages, { sender: 'admin', text, createdAt: new Date().toISOString() }]
        };
      }
      return c;
    }));

    try {
      const res = await fetch(`/api/admin/chats/${selectedChatId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      if (res.ok) {
        fetchChats();
      }
    } catch (error) {
      console.error('Error sending reply', error);
    }
  };

  const handleCloseChat = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/chats/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'close' })
      });
      if (res.ok) {
        fetchChats();
        if (selectedChatId === id) setSelectedChatId(null);
      }
    } catch (error) {
      console.error('Error closing chat', error);
    }
  };

  if (loading && chats.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Cargando chats...</div>;
  }

  return (
    <div className="admin-chat-container">
      {/* Sidebar - Chat List */}
      <div className={`admin-sidebar ${selectedChat ? 'hidden-on-mobile' : ''}`}>
        <div style={{ padding: '1rem', borderBottom: '1px solid rgba(0,0,0,0.05)', fontWeight: 'bold' }}>
          Chats Activos ({chats.filter(c => c.status === 'open').length})
        </div>
        <div className="hide-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
          {chats.map(chat => (
            <div 
              key={chat._id}
              onClick={() => setSelectedChatId(chat._id)}
              style={{
                padding: '1rem',
                borderBottom: '1px solid rgba(0,0,0,0.02)',
                cursor: 'pointer',
                backgroundColor: selectedChatId === chat._id ? 'rgba(62, 213, 204, 0.1)' : 'transparent',
                borderLeft: selectedChatId === chat._id ? '4px solid var(--primary)' : '4px solid transparent',
                opacity: chat.status === 'closed' ? 0.6 : 1
              }}
            >
              <div style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                {chat.productName || chat.productId}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].text : 'Sin mensajes'}
              </div>
              <div style={{ fontSize: '0.7rem', color: chat.status === 'open' ? '#16a34a' : 'var(--text-muted)', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>{chat.status === 'open' ? 'Abierto' : 'Cerrado'}</span>
                <span>{new Date(chat.updatedAt).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
          {chats.length === 0 && (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No hay chats registrados.
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      {selectedChat ? (
        <div className={`admin-main ${!selectedChat ? 'hidden-on-mobile' : ''}`}>
          {/* Chat Header */}
          <div style={{ padding: '1rem', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button 
                onClick={() => setSelectedChatId(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontSize: '1.2rem', cursor: 'pointer', padding: '0 0.5rem 0 0', display: 'flex' }}
                title="Volver a la lista"
              >
                ←
              </button>
              <div>
                <div style={{ fontWeight: 'bold' }}>{selectedChat.productName || selectedChat.productId}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Cliente: {selectedChat.userName ? `${selectedChat.userName} (${selectedChat.userEmail})` : (selectedChat.userEmail || 'Invitado')} | Sesión: {selectedChat.sessionId.substring(0, 10)}...
                </div>
              </div>
            </div>
            {selectedChat.status === 'open' && (
              <button 
                onClick={() => handleCloseChat(selectedChat._id)}
                style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}
              >
                Cerrar Chat
              </button>
            )}
          </div>

          {/* Messages */}
          <div className="hide-scrollbar" style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: 'var(--bg-main)' }}>
            {selectedChat.messages.map((msg, idx) => (
              <div key={idx} style={{
                alignSelf: msg.sender === 'admin' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.sender === 'admin' ? 'var(--primary)' : 'var(--card-bg)',
                color: msg.sender === 'admin' ? '#1C5F5C' : 'var(--text-main)',
                padding: '0.8rem 1.2rem',
                borderRadius: '16px',
                borderBottomRightRadius: msg.sender === 'admin' ? '4px' : '16px',
                borderBottomLeftRadius: msg.sender === 'user' ? '4px' : '16px',
                maxWidth: '70%',
                border: msg.sender === 'user' ? '1px solid rgba(0,0,0,0.05)' : 'none',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
              }}>
                {msg.text === '$$PAYMENT_BUTTON$$' ? (
                  <div style={{ fontStyle: 'italic', opacity: 0.8, fontSize: '0.9rem' }}>
                    [Botón de Pago enviado al cliente]
                  </div>
                ) : (
                  <div style={{ lineHeight: 1.5 }}>{msg.text}</div>
                )}
                <div style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: '5px', textAlign: 'right' }}>
                  {msg.sender === 'admin' ? 'Tú' : (selectedChat.userName || 'Usuario')} - {new Date(msg.createdAt).toLocaleTimeString()}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Reply Input */}
          {selectedChat.status === 'open' ? (
            <div style={{ padding: '1rem', borderTop: '1px solid rgba(0,0,0,0.05)', backgroundColor: 'var(--card-bg)' }}>
              {/* Quick Replies */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.8rem', overflowX: 'auto', paddingBottom: '0.5rem' }} className="hide-scrollbar">
                <button 
                  onClick={() => setReplyText('👋 Hola, claro que sí. Envíeme su ID del juego para verificar si aplica.')}
                  style={{ whiteSpace: 'nowrap', padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '20px', border: '1px solid var(--primary)', backgroundColor: 'transparent', color: 'var(--text-main)', cursor: 'pointer' }}
                >
                  Pedir ID
                </button>
                <button 
                  onClick={() => setReplyText('✅ Su ID ha sido verificado con éxito. Puede proceder con el pago.')}
                  style={{ whiteSpace: 'nowrap', padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '20px', border: '1px solid var(--primary)', backgroundColor: 'transparent', color: 'var(--text-main)', cursor: 'pointer' }}
                >
                  ID Verificado
                </button>
                <button 
                  onClick={() => setReplyText('⏳ Estamos procesando su recarga, por favor espere un momento.')}
                  style={{ whiteSpace: 'nowrap', padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '20px', border: '1px solid var(--primary)', backgroundColor: 'transparent', color: 'var(--text-main)', cursor: 'pointer' }}
                >
                  Procesando
                </button>
                <button 
                  onClick={() => setReplyText('🎉 ¡Su recarga ha sido completada con éxito! Disfrute su compra.')}
                  style={{ whiteSpace: 'nowrap', padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '20px', border: '1px solid var(--primary)', backgroundColor: 'transparent', color: 'var(--text-main)', cursor: 'pointer' }}
                >
                  Completada
                </button>
                <button 
                  onClick={() => {
                    setReplyText('$$PAYMENT_BUTTON$$');
                    // Automatically send it when clicking this specific button to avoid manual send
                    setTimeout(() => document.getElementById('btn-send-reply')?.click(), 50);
                  }}
                  style={{ whiteSpace: 'nowrap', padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '20px', border: 'none', backgroundColor: '#eab308', color: '#fff', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 5px rgba(234, 179, 8, 0.3)' }}
                  title="Generar botón de pago en el chat del cliente"
                >
                  💰 Generar Botón de Pago
                </button>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                  placeholder="Escribe una respuesta al usuario..."
                  style={{
                    flex: 1, padding: '1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--bg-main)', outline: 'none'
                  }}
                />
              <button 
                id="btn-send-reply"
                onClick={handleSendReply}
                disabled={!replyText.trim()}
                style={{
                  background: 'var(--primary)', color: '#1C5F5C', border: 'none', borderRadius: '12px', padding: '0 1.5rem', fontWeight: 'bold',
                  cursor: replyText.trim() ? 'pointer' : 'not-allowed', opacity: replyText.trim() ? 1 : 0.5
                }}
              >
                Enviar
              </button>
            </div>
            </div>
          ) : (
            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'var(--card-bg)', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
              Este chat ha sido cerrado.
            </div>
          )}
        </div>
      ) : (
        <div className={`admin-main ${!selectedChat ? 'hidden-on-mobile' : ''}`} style={{ alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', backgroundColor: 'var(--bg-main)' }}>
          Selecciona un chat de la lista para ver la conversación
        </div>
      )}
    </div>
  );
}
