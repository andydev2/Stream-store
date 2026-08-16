"use client";

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <div className="container" style={{ padding: '4rem 5%', maxWidth: '900px', margin: '0 auto', color: 'var(--text-main)' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--primary)', fontWeight: 800 }}>{t('privacy.title')}</h1>
      
      <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border)', lineHeight: 1.8 }}>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
          {t('privacy.desc')}
        </p>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>{t('privacy.1.title')}</h2>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)', whiteSpace: 'pre-wrap' }}>
          {t('privacy.1.desc')}
        </p>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>{t('privacy.2.title')}</h2>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)', whiteSpace: 'pre-wrap' }}>
          {t('privacy.2.desc')}
        </p>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>{t('privacy.3.title')}</h2>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
          {t('privacy.3.desc')}
        </p>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>{t('privacy.4.title')}</h2>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
          {t('privacy.4.desc')}
        </p>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>{t('privacy.5.title')}</h2>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
          {t('privacy.5.desc')}
        </p>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>{t('privacy.6.title')}</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          {t('privacy.6.desc')}
        </p>
      </div>
    </div>
  );
}
