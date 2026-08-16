"use client";

import { useState, useEffect, useMemo } from 'react';
import styles from './page.module.css';
import ProductCard from '../components/ProductCard';
import ReviewSection from '../components/ReviewSection';
import { useLanguage } from '../context/LanguageContext';
import { Product as ProductType } from '../data/products';

const categories = [
  { id: 'all', labelKey: 'cat.all', icon: '⊞' },
  { id: 'streaming', labelKey: 'cat.streaming', icon: '🎬' },
  { id: 'ai', labelKey: 'cat.ai', icon: '🤖' },
  { id: 'music', labelKey: 'cat.music', icon: '🎵' },
  { id: 'games', labelKey: 'cat.games', icon: '🎮' },
];

export default function Home() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [allProducts, setAllProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);

  // Reset pagination when search or category changes
  useEffect(() => {
    setVisibleCount(12);
  }, [searchQuery, activeCategory]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const json = await res.json();
        if (json.success) {
          setAllProducts(json.data);
        }
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleSearch = () => {
      const params = new URLSearchParams(window.location.search);
      setSearchQuery(params.get('q')?.toLowerCase() || '');
    };

    window.addEventListener('searchChanged', handleSearch);
    handleSearch();

    return () => window.removeEventListener('searchChanged', handleSearch);
  }, []);

  const filteredProducts = useMemo(() => {
    const filtered = allProducts.filter(p => {
      const matchesSearch = searchQuery === '' || 
                            p.name.toLowerCase().includes(searchQuery) || 
                            p.description.toLowerCase().includes(searchQuery);
      const matchesCategory = activeCategory === 'all' || p.category.toLowerCase() === activeCategory;
      return matchesSearch && matchesCategory;
    });

    return filtered.sort((a, b) => {
      const aStock = a.stock || 0;
      const bStock = b.stock || 0;
      
      if (aStock > 0 && bStock === 0) return -1;
      if (aStock === 0 && bStock > 0) return 1;
      return 0; // Keep relative order otherwise
    });
  }, [searchQuery, activeCategory, allProducts]);

  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <h1 className={styles.title}>{t('hero.title')}</h1>
        <p className={styles.description}>
          {t('hero.desc')}
        </p>

        {/* Categories Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginTop: '3rem',
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 10
        }}>
          {categories.map((cat, i) => {
            const isActive = activeCategory === cat.id;
            return (
              <button 
                key={cat.id} 
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  background: isActive ? 'var(--card-bg)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  border: '1px solid',
                  borderColor: isActive ? 'var(--primary)' : 'var(--border)',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '20px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.4rem',
                  minWidth: '90px',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isActive ? '0 8px 25px rgba(62, 213, 204, 0.2)' : 'none',
                  transform: isActive ? 'translateY(-5px)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.color = 'var(--text-main)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.color = 'var(--text-muted)';
                    e.currentTarget.style.transform = 'none';
                  }
                }}
              >
                <div style={{ fontSize: '1.8rem', filter: isActive ? 'drop-shadow(0 2px 8px rgba(62, 213, 204, 0.4))' : 'none', transition: 'all 0.3s' }}>
                  {cat.icon}
                </div>
                <span style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>{t(cat.labelKey)}</span>
              </button>
            );
          })}
        </div>

        {/* Elegant Wave Divider */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', overflow: 'hidden', lineHeight: 0, transform: 'translateY(1px)' }}>
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ position: 'relative', display: 'block', width: 'calc(100% + 1.3px)', height: 'clamp(30px, 6vw, 70px)' }}>
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,123.63,196.36,108.92c57.5-13.06,108.68-35.32,166.42-45.74z" fill="var(--background)"></path>
          </svg>
        </div>
      </div>

      <div className={styles.grid} style={{ marginTop: '2rem' }}>
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            {t('catalog.loading')}
          </div>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.slice(0, visibleCount).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            {t('empty.search')}
          </div>
        )}
      </div>

      {filteredProducts.length > visibleCount && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem', width: '100%', zIndex: 10, position: 'relative' }}>
          <button 
            className="btn btn-primary"
            onClick={() => setVisibleCount(filteredProducts.length)}
            style={{ 
              padding: '1rem 3rem', 
              borderRadius: '30px', 
              fontSize: '1.2rem',
              boxShadow: '0 8px 25px rgba(62, 213, 204, 0.4)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
          >
            {t('catalog.load_more')}
          </button>
        </div>
      )}

      {/* Why Choose Us Section */}
      <section style={{ width: '100%', maxWidth: '1200px', padding: '0 1rem', marginTop: '6rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '3rem', color: 'var(--text-main)', fontWeight: 900, letterSpacing: '-1px' }}>
          {t('why.title')}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          {/* Card 1 */}
          <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '1rem', fontWeight: 800 }}>{t('why.exp.title')}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{t('why.exp.desc')}</p>
          </div>
          {/* Card 2 */}
          <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '1rem', fontWeight: 800 }}>{t('why.delivery.title')}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{t('why.delivery.desc')}</p>
          </div>
          {/* Card 3 */}
          <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛡️</div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '1rem', fontWeight: 800 }}>{t('why.warranty.title')}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{t('why.warranty.desc')}</p>
          </div>
          {/* Card 4 */}
          <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎧</div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '1rem', fontWeight: 800 }}>{t('why.support.title')}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{t('why.support.desc')}</p>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section id="sobre-mi" style={{ width: '100%', maxWidth: '1000px', padding: '0 1rem', marginTop: '6rem' }}>
        <div style={{ background: 'var(--card-bg)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden', display: 'flex', flexWrap: 'wrap', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
          <div style={{ flex: '1 1 400px', padding: 'clamp(2rem, 5vw, 4rem)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h4 style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              {t('about.subtitle')}
            </h4>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', color: 'var(--text-main)', marginBottom: '1.5rem', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-1px' }}>
              {t('about.title')}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: 1.7 }}>
              {t('about.desc1')}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.7 }}>
              {t('about.desc2')}
            </p>
          </div>
          <div style={{ flex: '1 1 300px', minHeight: '350px', background: 'url(https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80) center/cover' }}>
            {/* Image Placeholder */}
          </div>
        </div>
      </section>

      <div style={{ width: '100%', marginTop: '8rem', marginBottom: '4rem' }}>
        <ReviewSection />
      </div>
    </main>
  );
}
