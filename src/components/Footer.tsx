"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
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
          <h4 style={{ color: 'var(--text-main)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{t('footer.payment_methods')}</h4>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ background: 'var(--background)', padding: '0.5rem', borderRadius: '8px' }}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" style={{ height: '20px' }} />
            </div>
            <div style={{ background: 'var(--background)', padding: '0.5rem 0.8rem', borderRadius: '8px', display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fbc02d' }}>Pichincha</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#e91e63' }}>Guayaquil</span>
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
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {/* Social Icons */}
          <a href="https://wa.me/593990730162" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', transition: 'color 0.2s', display: 'flex' }} onMouseEnter={(e) => e.currentTarget.style.color = '#25D366'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
            <MessageCircle size={24} />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', transition: 'color 0.2s', display: 'flex' }} onMouseEnter={(e) => e.currentTarget.style.color = '#E1306C'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', transition: 'color 0.2s', display: 'flex' }} onMouseEnter={(e) => e.currentTarget.style.color = '#1877F2'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
