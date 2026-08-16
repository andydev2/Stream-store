"use client";

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function TermsPage() {
  const { t } = useLanguage();

  return (
    <div className="container" style={{ padding: '4rem 5%', maxWidth: '900px', margin: '0 auto', color: 'var(--text-main)' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--primary)', fontWeight: 800 }}>{t('terms.title')}</h1>
      
      <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border)', lineHeight: 1.8 }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>{t('terms.1.title')}</h2>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
          {t('terms.1.desc')}
        </p>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>{t('terms.2.title')}</h2>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
          {t('terms.2.desc')}
        </p>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#ef4444' }}>{t('terms.3.title')}</h2>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)', background: 'rgba(239, 68, 68, 0.05)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #ef4444' }}>
          {t('terms.3.desc')}
        </p>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>{t('terms.4.title')}</h2>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
          {t('terms.4.desc')}
        </p>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>{t('terms.5.title')}</h2>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
          {t('terms.5.desc')}
        </p>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>{t('terms.6.title')}</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          {t('terms.6.desc')}
        </p>
      </div>
    </div>
  );
}
