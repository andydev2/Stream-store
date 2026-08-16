"use client";

import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect } from 'react';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  color: string;
  stock?: number;
  details?: string[];
  images?: string[];
  requiresIdVerification?: boolean;
};

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (isModalOpen) {
      const count = parseInt(document.body.dataset.modalCount || '0') + 1;
      document.body.dataset.modalCount = count.toString();
      document.body.style.setProperty('overflow', 'hidden', 'important');
      document.documentElement.style.setProperty('overflow', 'hidden', 'important');

      return () => {
        const newCount = Math.max(0, parseInt(document.body.dataset.modalCount || '0') - 1);
        document.body.dataset.modalCount = newCount.toString();
        if (newCount === 0) {
          document.body.style.overflow = '';
          document.documentElement.style.overflow = '';
        }
      };
    }
  }, [isModalOpen]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que abra el modal
    addToCart(product);
  };

  const handleVerifyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = encodeURIComponent(`Hola, necesito verificar mi ID para una recarga de ${product.name}`);
    window.open(`https://wa.me/1234567890?text=${text}`, '_blank');
  };

  const hasStock = product.stock !== undefined ? product.stock > 0 : true;

  return (
    <>
      <div 
        style={{
          background: 'var(--card-bg)',
          borderRadius: 'var(--radius)',
          padding: '2rem',
          boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          border: '1px solid rgba(0,0,0,0.02)',
          position: 'relative',
          overflow: 'hidden',
          opacity: hasStock ? 1 : 0.6,
        }}
        onMouseEnter={(e) => {
          if (!hasStock) return;
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(62, 213, 204, 0.15)';
        }}
        onMouseLeave={(e) => {
          if (!hasStock) return;
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.06)';
        }}
      >
        {/* Decorative Gradient Blob */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '150px',
          height: '150px',
          background: `radial-gradient(circle, ${product.color}40 0%, transparent 70%)`,
          borderRadius: '50%',
          zIndex: 0
        }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              width: '56px', height: '56px', borderRadius: '16px', 
              background: product.color, color: 'white', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontWeight: 800, fontSize: '1.8rem',
              boxShadow: `0 8px 20px ${product.color}40`
            }}>
              {product.icon}
            </div>
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>{product.name}</h3>
              <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.1rem' }}>
                ${product.price.toFixed(2)} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>{t('product.month')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stock Indicator */}
        <div style={{ zIndex: 1, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: hasStock ? '#16a34a' : '#dc2626', background: hasStock ? '#dcfce7' : '#fee2e2', padding: '0.3rem 0.6rem', borderRadius: '20px', width: 'fit-content' }}>
          {hasStock ? `🟢 ${product.stock} ${t('product.stock.available')}` : `🔴 ${t('product.stock.out')}`}
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, zIndex: 1, flex: 1 }}>
          {product.description}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', zIndex: 1, marginTop: 'auto' }}>
          <button 
            disabled={!hasStock}
            style={{ 
              background: 'transparent', 
              color: hasStock ? 'var(--text-muted)' : '#cbd5e1', 
              border: `2px solid ${hasStock ? '#e2e8f0' : '#f1f5f9'}`, 
              padding: '0.75rem', 
              borderRadius: '16px', 
              fontWeight: 700, 
              cursor: hasStock ? 'pointer' : 'not-allowed',
              fontSize: '1rem',
              transition: 'all 0.2s'
            }}
            onClick={(e) => { 
              e.stopPropagation(); 
              if (hasStock) setIsModalOpen(true); 
            }}
            onMouseEnter={(e) => { if (hasStock) { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; } }}
            onMouseLeave={(e) => { if (hasStock) { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#475569'; } }}
          >
            {t('product.details')}
          </button>
          
          <button 
            disabled={!hasStock && !product.requiresIdVerification}
            style={{ 
              background: (hasStock || product.requiresIdVerification) ? 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' : '#cbd5e1', 
              color: '#1C5F5C', border: 'none', padding: '1rem', borderRadius: '16px', 
              fontWeight: 700, 
              cursor: (hasStock || product.requiresIdVerification) ? 'pointer' : 'not-allowed',
              fontSize: '1.1rem',
              boxShadow: (hasStock || product.requiresIdVerification) ? '0 4px 15px rgba(62, 213, 204, 0.3)' : 'none',
              transition: 'transform 0.2s'
            }}
            onClick={product.requiresIdVerification ? handleVerifyId : handleAddToCart}
            onMouseDown={(e) => { if (hasStock || product.requiresIdVerification) e.currentTarget.style.transform = 'scale(0.98)' }}
            onMouseUp={(e) => { if (hasStock || product.requiresIdVerification) e.currentTarget.style.transform = 'scale(1)' }}
          >
            {product.requiresIdVerification ? t('product.verify_id') : (hasStock ? t('cart.add') : t('product.stock.none'))}
          </button>
        </div>
      </div>

      {/* Modal de Detalles */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, 
          padding: '6rem 1rem 2rem 1rem' /* Mayor padding superior para no tocar la navbar */
        }} onClick={() => { setIsModalOpen(false); setCurrentImage(0); }}>
          <div style={{
            background: 'var(--card-bg)',
            borderRadius: '24px',
            width: '100%', maxWidth: '500px',
            position: 'relative',
            animation: 'fadeInUp 0.3s ease',
            overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
            maxHeight: '85vh'
          }} onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => { setIsModalOpen(false); setCurrentImage(0); }}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', cursor: 'pointer', color: 'white', zIndex: 10 }}
            >
              ✕
            </button>

            {/* Carousel Header */}
            {product.images && product.images.length > 0 ? (
              <div style={{ position: 'relative', width: '100%', height: '250px', backgroundColor: '#000', flexShrink: 0 }}>
                <img 
                  src={product.images[currentImage]} 
                  alt={`${product.name} screenshot ${currentImage + 1}`} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {product.images.length > 1 && (
                  <>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setCurrentImage(prev => prev === 0 ? product.images!.length - 1 : prev - 1); }}
                      style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}
                    >
                      ❮
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setCurrentImage(prev => prev === product.images!.length - 1 ? 0 : prev + 1); }}
                      style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}
                    >
                      ❯
                    </button>
                    <div style={{ position: 'absolute', bottom: '10px', left: '0', right: '0', display: 'flex', justifyContent: 'center', gap: '6px' }}>
                      {product.images.map((_: string, idx: number) => (
                        <div key={idx} style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: idx === currentImage ? 'white' : 'rgba(255,255,255,0.4)', transition: 'background-color 0.2s' }} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div style={{ padding: '2.5rem 2.5rem 0 2.5rem', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexShrink: 0 }}>
                <div style={{ 
                  width: '64px', height: '64px', borderRadius: '16px', 
                  background: product.color, color: 'white', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  fontWeight: 800, fontSize: '2rem',
                  boxShadow: `0 8px 20px ${product.color}40`
                }}>
                  {product.icon}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--text-main)', fontWeight: 800 }}>{product.name}</h2>
                </div>
              </div>
            )}

            <div className="hide-scrollbar" style={{ padding: product.images ? '1.5rem 2.5rem 2.5rem 2.5rem' : '0 2.5rem 2.5rem 2.5rem', overflowY: 'auto', flex: 1 }}>
              {product.images && (
                 <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.8rem', color: 'var(--text-main)', fontWeight: 800 }}>{product.name}</h2>
              )}
              
              <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.6rem', marginBottom: '1.5rem' }}>
                ${product.price.toFixed(2)}
              </div>

              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
                {product.description}
              </p>

              {product.details && product.details.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>{t('modal.includes')}</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {product.details.map((detail, idx) => (
                      <li key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', color: 'var(--text-muted)' }}>
                        <span style={{ color: 'var(--secondary)' }}>✓</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button 
                disabled={!hasStock && !product.requiresIdVerification}
                style={{ 
                  background: (hasStock || product.requiresIdVerification) ? 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' : '#cbd5e1', 
                  color: '#1C5F5C', border: 'none', padding: '1rem', borderRadius: '16px', 
                  fontWeight: 700, cursor: (hasStock || product.requiresIdVerification) ? 'pointer' : 'not-allowed', fontSize: '1.2rem', width: '100%',
                  boxShadow: (hasStock || product.requiresIdVerification) ? '0 4px 15px rgba(62, 213, 204, 0.3)' : 'none'
                }}
                onClick={(e) => { 
                  if (product.requiresIdVerification) {
                    handleVerifyId(e);
                  } else if (hasStock) {
                    handleAddToCart(e); 
                    setIsModalOpen(false); 
                    setCurrentImage(0); 
                  }
                }}
              >
                {product.requiresIdVerification ? t('product.verify_id') : (hasStock ? t('cart.add') : t('product.stock.none'))}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
