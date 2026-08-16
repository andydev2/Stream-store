import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { X, CreditCard, Mail, Lock, ShieldCheck, CheckCircle } from 'lucide-react';

type CheckoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  cartTotal: number;
  onConfirmPayment: () => Promise<void>;
};

export default function CheckoutModal({ isOpen, onClose, cartTotal, onConfirmPayment }: CheckoutModalProps) {
  const { t } = useLanguage();
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    
    // Simulate payment processing delay
    setTimeout(async () => {
      try {
        await onConfirmPayment();
        setStep('success');
      } catch (err) {
        setStep('form');
        alert(t('checkout.error'));
      }
    }, 2000);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        background: 'var(--card-bg)',
        width: '100%', maxWidth: '450px',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Header */}
        <div style={{ padding: '1.5rem 1.5rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={20} color="var(--primary)" />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 700 }}>{t('checkout.title')}</h3>
          </div>
          {step === 'form' && (
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <X size={24} />
            </button>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem' }}>
          {step === 'form' && (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ textAlign: 'center', margin: '0.5rem 0 1rem 0' }}>
                <p style={{ color: 'var(--text-muted)', margin: '0 0 0.5rem 0' }}>{t('checkout.total')}</p>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>${cartTotal.toFixed(2)}</div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 600 }}>{t('checkout.email')}</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('checkout.email.placeholder')}
                    style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--search-bg)', color: 'var(--text-main)', fontSize: '1rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 600 }}>{t('checkout.method')}</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    style={{ 
                      flex: 1, padding: '1rem', borderRadius: '12px', border: `2px solid ${paymentMethod === 'card' ? 'var(--primary)' : 'var(--border)'}`, 
                      background: paymentMethod === 'card' ? 'rgba(62, 213, 204, 0.05)' : 'transparent',
                      color: paymentMethod === 'card' ? 'var(--primary)' : 'var(--text-muted)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600
                    }}
                  >
                    <CreditCard size={24} /> {t('checkout.card')}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    style={{ 
                      flex: 1, padding: '1rem', borderRadius: '12px', border: `2px solid ${paymentMethod === 'paypal' ? '#0070ba' : 'var(--border)'}`, 
                      background: paymentMethod === 'paypal' ? 'rgba(0, 112, 186, 0.05)' : 'transparent',
                      color: paymentMethod === 'paypal' ? '#0070ba' : 'var(--text-muted)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/></svg>
                    PayPal
                  </button>
                </div>
              </div>

              {paymentMethod === 'card' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'fadeIn 0.3s ease' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 600 }}>{t('checkout.card.number')}</label>
                    <input type="text" placeholder="0000 0000 0000 0000" maxLength={19} required style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--search-bg)', color: 'var(--text-main)', fontSize: '1rem', letterSpacing: '1px' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 600 }}>{t('checkout.card.expiry')}</label>
                      <input type="text" placeholder="MM/AA" maxLength={5} required style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--search-bg)', color: 'var(--text-main)', fontSize: '1rem' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 600 }}>{t('checkout.card.cvv')}</label>
                      <input type="text" placeholder="123" maxLength={4} required style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--search-bg)', color: 'var(--text-main)', fontSize: '1rem' }} />
                    </div>
                  </div>
                </div>
              )}

              <button 
                type="submit"
                style={{ 
                  marginTop: '1rem', width: '100%', padding: '1.2rem', 
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', 
                  color: '#1C5F5C', border: 'none', borderRadius: '16px', 
                  fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer',
                  boxShadow: '0 10px 20px rgba(62, 213, 204, 0.2)',
                  display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem'
                }}
              >
                {t('checkout.pay_btn')} ${cartTotal.toFixed(2)}
              </button>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                <ShieldCheck size={16} /> {t('checkout.secure')}
              </div>
            </form>
          )}

          {step === 'processing' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', gap: '1.5rem', animation: 'fadeIn 0.3s ease' }}>
              <div className="spinner" style={{ width: '60px', height: '60px', border: '4px solid rgba(62, 213, 204, 0.2)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>{t('checkout.processing.title')}</h3>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>{t('checkout.processing.desc')}</p>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', gap: '1rem', animation: 'fadeIn 0.3s ease' }}>
              <div style={{ width: '80px', height: '80px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', marginBottom: '1rem' }}>
                <CheckCircle size={48} />
              </div>
              <h3 style={{ fontSize: '1.6rem', color: 'var(--text-main)', margin: 0, fontWeight: 800 }}>{t('checkout.success.title')}</h3>
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', margin: '0 0 2rem 0', lineHeight: 1.5 }}>
                {t('checkout.success.desc')}
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
