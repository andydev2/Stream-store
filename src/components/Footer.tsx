"use client";

import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer style={{
      backgroundColor: '#0f172a',
      color: '#e2e8f0',
      padding: '4rem 5% 2rem 5%',
      marginTop: 'auto',
      borderTop: '1px solid rgba(255,255,255,0.05)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '3rem',
        marginBottom: '3rem'
      }}>
        {/* Brand Col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img src="/logo.svg" alt="Logo" style={{ height: '40px', width: 'auto' }} />
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'white', letterSpacing: '-0.5px' }}>
              DV
            </div>
          </Link>
          <p style={{ color: '#94a3b8', lineHeight: 1.6, fontSize: '0.95rem' }}>
            {t('footer.desc')}
          </p>
        </div>

        {/* Links Col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{t('footer.links')}</h4>
          <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>{t('nav.catalog')}</Link>
          <Link href="/support" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>{t('nav.support')}</Link>
        </div>

        {/* Legal Col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{t('footer.legal')}</h4>
          <Link href="/terms" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>{t('footer.terms')}</Link>
          <Link href="/privacy" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>{t('footer.privacy')}</Link>
        </div>

        {/* Payment Methods */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Métodos de Pago</h4>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ background: 'white', padding: '0.5rem', borderRadius: '8px' }}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" style={{ height: '20px' }} />
            </div>
            <div style={{ background: 'white', padding: '0.5rem', borderRadius: '8px', display: 'flex', gap: '0.5rem' }}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" style={{ height: '20px' }} />
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" style={{ height: '14px', marginTop: '3px' }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ 
        maxWidth: '1200px', margin: '0 auto', 
        paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '1rem', color: '#64748b', fontSize: '0.9rem'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div>&copy; {new Date().getFullYear()} Diego Ventas. {t('footer.rights')}</div>
          <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            {t('footer.developed')} <a href="https://akira-itzt.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 700, transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>AKIRA</a>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {/* Social Icons (Placholders) */}
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'white'} onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}>Instagram</span>
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'white'} onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}>Twitter</span>
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'white'} onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}>Facebook</span>
        </div>
      </div>
    </footer>
  );
}
