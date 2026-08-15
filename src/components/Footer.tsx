"use client";

import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer style={{
      backgroundColor: 'var(--card-bg)',
      color: 'var(--text-main)',
      padding: '4rem 5% 2rem 5%',
      marginTop: 'auto',
      borderTop: '1px solid var(--border)'
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
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
              DV
            </div>
          </Link>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>
            {t('footer.desc')}
          </p>
        </div>

        {/* Links Col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ color: 'var(--text-main)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{t('footer.links')}</h4>
          <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>{t('nav.catalog')}</Link>
          <Link href="/support" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>{t('nav.support')}</Link>
        </div>

        {/* Legal Col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ color: 'var(--text-main)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{t('footer.legal')}</h4>
          <Link href="/terms" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>{t('footer.terms')}</Link>
          <Link href="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>{t('footer.privacy')}</Link>
        </div>

        {/* Payment Methods */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ color: 'var(--text-main)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Métodos de Pago</h4>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ background: 'var(--background)', padding: '0.5rem', borderRadius: '8px' }}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" style={{ height: '20px' }} />
            </div>
            <div style={{ background: 'var(--background)', padding: '0.5rem', borderRadius: '8px', display: 'flex', gap: '0.5rem' }}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" style={{ height: '20px' }} />
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" style={{ height: '14px', marginTop: '3px' }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ 
        maxWidth: '1200px', margin: '0 auto', 
        paddingTop: '2rem', borderTop: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div>&copy; {new Date().getFullYear()} Diego Ventas. {t('footer.rights')}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {t('footer.developed')} <a href="https://akira-itzt.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 700, transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>AKIRA</a>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {/* Social Icons (Placholders) */}
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-main)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>Instagram</span>
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-main)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>Twitter</span>
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-main)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>Facebook</span>
        </div>
      </div>
    </footer>
  );
}
