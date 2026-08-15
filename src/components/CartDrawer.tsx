"use client";

import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { X, Trash2, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";

export default function CartDrawer() {
  const { cart, removeFromCart, isCartOpen, setIsCartOpen, cartTotal } = useCart();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isCartOpen) {
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
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    
    try {
      // Create a mock payment ID
      const mockPaymentId = `PAY-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart, paymentId: mockPaymentId }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Clear cart manually (or we need a clearCart function in context)
        cart.forEach(item => removeFromCart(item.id));
        alert("¡Pago exitoso! Tus cuentas han sido asignadas en tu Dashboard.");
        setIsCartOpen(false);
        window.location.href = '/dashboard';
      } else {
        alert(data.error || "Hubo un error al procesar la orden");
      }
    } catch (error) {
      console.error(error);
      alert("Hubo un error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay Background */}
      <div 
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(4px)',
          zIndex: 99,
          animation: 'fadeIn 0.3s ease'
        }}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '100%', maxWidth: '400px',
        backgroundColor: 'var(--card-bg)',
        zIndex: 100,
        boxShadow: '-5px 0 30px rgba(0,0,0,0.1)',
        display: 'flex', flexDirection: 'column',
        animation: 'slideInRight 0.3s ease'
      }}>
        
        {/* Header */}
        <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <ShoppingCart /> {t('cart.title')}
          </h2>
          <button 
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}
            onClick={() => setIsCartOpen(false)}
          >
            <X size={28} color="var(--text-muted)" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="hide-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '3rem' }}>
              <ShoppingCart size={64} opacity={0.2} style={{ margin: '0 auto 1rem auto' }} />
              <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>{t('cart.empty')}</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: 'var(--search-bg)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: item.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>{item.name}</h4>
                  <div style={{ color: 'var(--primary)', fontWeight: 600 }}>${item.price.toFixed(2)} <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 400 }}>x {item.quantity}</span></div>
                </div>
                <button 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff4757', padding: '0.5rem' }}
                  onClick={() => removeFromCart(item.id)}
                  title="Eliminar"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', backgroundColor: 'var(--search-bg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 800 }}>
              <span style={{ color: 'var(--text-main)' }}>{t('cart.subtotal')}</span>
              <span style={{ color: 'var(--primary)' }}>${cartTotal.toFixed(2)}</span>
            </div>
            
            <button 
              onClick={handleCheckout}
              disabled={loading}
              style={{ 
                width: '100%', padding: '1rem', 
                backgroundColor: 'var(--primary)', color: '#1C5F5C', 
                border: 'none', borderRadius: '12px', 
                fontWeight: 700, fontSize: '1.1rem', cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? "Procesando..." : "Finalizar Compra"}
            </button>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
              El cobro se simulará con propósitos de prueba
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}
