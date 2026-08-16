"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Trash2 } from 'lucide-react';

export default function MiniAdminChatList({ onClose }: { onClose: () => void }) {
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

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
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChatToDelete(id);
  };

  const confirmDeleteChat = async () => {
    if (!chatToDelete) return;
    try {
      const res = await fetch(`/api/admin/chats/${chatToDelete}`, { method: 'DELETE' });
      if (res.ok) {
        setChats(prev => prev.filter(c => c._id !== chatToDelete));
        if (selectedChatId === chatToDelete) setSelectedChatId(null);
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    } finally {
      setChatToDelete(null);
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
      console.error('Error closing chat:', error);
    }
  };

  const selectedChat = chats.find(c => c._id === selectedChatId);

  useEffect(() => {
    if (selectedChat) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChat?.messages?.length]);

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedChatId) return;
    const text = replyText;
    setReplyText('');

    // Optimistic update
    setChats(prev => prev.map(c => {
      if (c._id === selectedChatId) {
        return {
          ...c,
          messages: [...(c.messages || []), { sender: 'admin', text, createdAt: new Date().toISOString() }]
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
      {selectedChatId ? (
        <>
          <div style={{
            padding: '1rem', background: 'var(--primary)', color: '#1C5F5C',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            fontWeight: 'bold', borderBottom: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button 
                onClick={() => setSelectedChatId(null)}
                style={{ background: 'none', border: 'none', color: '#1C5F5C', fontSize: '1.2rem', cursor: 'pointer', padding: '0 0.5rem 0 0' }}
              >
                ←
              </button>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                {selectedChat?.productName || 'Chat'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {selectedChat?.status === 'open' && (
                <button 
                  onClick={() => handleCloseChat(selectedChat._id)}
                  style={{ background: '#ef4444', border: 'none', color: 'white', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.2rem 0.5rem', borderRadius: '8px', cursor: 'pointer' }}
                >
                  {t('admin.chats.close_chat')}
                </button>
              )}
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#1C5F5C', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>
          </div>
          
          {/* Messages */}
          <div className="hide-scrollbar" style={{ flex: 1, padding: '1rem', overflowY: 'auto', overscrollBehavior: 'contain', display: 'flex', flexDirection: 'column', gap: '0.8rem', backgroundColor: 'var(--bg-main)' }}>
            {selectedChat?.messages?.map((msg: any, idx: number) => (
              <div key={idx} style={{
                alignSelf: msg.sender === 'admin' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.sender === 'admin' ? 'var(--primary)' : 'var(--card-bg)',
                color: msg.sender === 'admin' ? '#1C5F5C' : 'var(--text-main)',
                padding: '0.8rem 1rem',
                borderRadius: '16px',
                borderBottomRightRadius: msg.sender === 'admin' ? '4px' : '16px',
                borderBottomLeftRadius: msg.sender === 'user' ? '4px' : '16px',
                maxWidth: '85%',
                border: msg.sender === 'user' ? '1px solid rgba(0,0,0,0.05)' : 'none',
                boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
              }}>
                {msg.text === '$$PAYMENT_BUTTON$$' ? (
                  <div style={{ fontStyle: 'italic', opacity: 0.8, fontSize: '0.85rem' }}>
                    [{t('admin.chats.payment_button_label')}]
                  </div>
                ) : (
                  <div style={{ fontSize: '0.95rem', lineHeight: 1.4 }}>{msg.text}</div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Reply Input */}
          {selectedChat?.status === 'open' ? (
            <div style={{ padding: '0.8rem', borderTop: '1px solid var(--border)', backgroundColor: 'var(--card-bg)' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', overflowX: 'auto', paddingBottom: '0.3rem' }} className="hide-scrollbar">
                <button 
                  onClick={() => setReplyText('$$PAYMENT_BUTTON$$')}
                  style={{ whiteSpace: 'nowrap', padding: '0.3rem 0.6rem', fontSize: '0.75rem', borderRadius: '15px', border: 'none', backgroundColor: '#eab308', color: '#fff', cursor: 'pointer' }}
                >
                  💰 {t('admin.chats.btn_payment')}
                </button>
                <button 
                  onClick={() => setReplyText(t('admin.chats.reply_ask_id'))}
                  style={{ whiteSpace: 'nowrap', padding: '0.3rem 0.6rem', fontSize: '0.75rem', borderRadius: '15px', border: '1px solid var(--primary)', backgroundColor: 'transparent', color: 'var(--text-main)', cursor: 'pointer' }}
                >
                  {t('admin.chats.btn_ask_id')}
                </button>
                <button 
                  onClick={() => setReplyText(t('admin.chats.reply_id_verified'))}
                  style={{ whiteSpace: 'nowrap', padding: '0.3rem 0.6rem', fontSize: '0.75rem', borderRadius: '15px', border: '1px solid var(--primary)', backgroundColor: 'transparent', color: 'var(--text-main)', cursor: 'pointer' }}
                >
                  {t('admin.chats.btn_id_verified')}
                </button>
                <button 
                  onClick={() => setReplyText(t('admin.chats.reply_processing'))}
                  style={{ whiteSpace: 'nowrap', padding: '0.3rem 0.6rem', fontSize: '0.75rem', borderRadius: '15px', border: '1px solid var(--primary)', backgroundColor: 'transparent', color: 'var(--text-main)', cursor: 'pointer' }}
                >
                  {t('admin.chats.btn_processing')}
                </button>
                <button 
                  onClick={() => setReplyText(t('admin.chats.reply_completed'))}
                  style={{ whiteSpace: 'nowrap', padding: '0.3rem 0.6rem', fontSize: '0.75rem', borderRadius: '15px', border: '1px solid var(--primary)', backgroundColor: 'transparent', color: 'var(--text-main)', cursor: 'pointer' }}
                >
                  {t('admin.chats.btn_completed')}
                </button>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                  placeholder={t('admin.chats.reply_placeholder')}
                  style={{
                    flex: 1, padding: '0.6rem 0.8rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text-main)', outline: 'none'
                  }}
                />
                <button 
                  onClick={handleSendReply}
                  disabled={!replyText.trim()}
                  style={{
                    background: 'var(--primary)', color: '#1C5F5C', border: 'none', borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: replyText.trim() ? 'pointer' : 'not-allowed', opacity: replyText.trim() ? 1 : 0.5
                  }}
                >
                  ➤
                </button>
              </div>
            </div>
          ) : (
            <div style={{ padding: '0.8rem', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'var(--card-bg)', fontSize: '0.9rem', borderTop: '1px solid var(--border)' }}>
              {t('admin.chats.closed_status')}
            </div>
          )}
        </>
      ) : (
        <>
          <div style={{
            padding: '1rem', background: 'var(--primary)', color: '#1C5F5C',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            fontWeight: 'bold', borderBottom: '1px solid var(--border)'
          }}>
            <span>{t('admin.chats.active')}</span>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#1C5F5C', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
          </div>
          <div className="hide-scrollbar" style={{ flex: 1, overflowY: 'auto', overscrollBehavior: 'contain', padding: '0.5rem', backgroundColor: 'var(--background)' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>{t('admin.chats.loading')}</div>
            ) : chats.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>{t('admin.chats.empty')}</div>
            ) : (
              chats.map(chat => (
                <div key={chat._id} style={{
                  padding: '1rem', borderBottom: '1px solid var(--border)',
                  cursor: 'pointer', transition: 'background 0.2s',
                  backgroundColor: 'var(--card-bg)', borderRadius: '12px', marginBottom: '0.5rem'
                }} onClick={() => setSelectedChatId(chat._id)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong style={{ color: 'var(--foreground)' }}>{chat.productName || 'Soporte'}</strong>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.8rem', color: chat.status === 'open' ? '#10b981' : 'var(--text-muted)' }}>
                        {chat.status === 'open' ? t('admin.chats.status_open') : t('admin.chats.status_closed')}
                      </span>
                      {chat.status === 'closed' && (
                        <button 
                          onClick={(e) => handleDeleteClick(chat._id, e)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.2rem' }}
                          title="Eliminar chat"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {chat.userEmail || chat.userName || 'Usuario anónimo'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem', opacity: 0.7 }}>
                    {t('admin.chats.click_to_view')}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Delete Confirmation Overlay */}
      {chatToDelete && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(3px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 10001, padding: '1rem', borderRadius: '20px'
        }}>
          <div style={{
            background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '16px',
            textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            border: '1px solid var(--border)', width: '100%', maxWidth: '280px',
            animation: 'slideUp 0.2s ease-out'
          }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <Trash2 size={24} />
            </div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)', fontSize: '1.1rem' }}>
              {t('admin.chats.delete_title')}
            </h4>
            <p style={{ margin: '0 0 1.5rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              {t('admin.chats.delete_desc')}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <button 
                onClick={(e) => { e.stopPropagation(); setChatToDelete(null); }}
                style={{ flex: 1, padding: '0.6rem', background: 'transparent', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-main)', cursor: 'pointer', fontWeight: 'bold' }}
              >
                {t('admin.chats.delete_cancel')}
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); confirmDeleteChat(); }}
                style={{ flex: 1, padding: '0.6rem', background: '#ef4444', border: 'none', borderRadius: '10px', color: 'white', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(239, 68, 68, 0.3)' }}
              >
                {t('admin.chats.delete_confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
