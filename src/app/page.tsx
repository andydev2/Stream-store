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
    return allProducts.filter(p => {
      const matchesSearch = searchQuery === '' || 
                            p.name.toLowerCase().includes(searchQuery) || 
                            p.description.toLowerCase().includes(searchQuery);
      const matchesCategory = activeCategory === 'all' || p.category.toLowerCase() === activeCategory;
      return matchesSearch && matchesCategory;
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
      </div>

      <div className={styles.grid}>
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            Cargando productos...
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
            Ver más
          </button>
        </div>
      )}

      <section id="referencias" style={{ marginTop: '6rem', width: '100%', maxWidth: '1000px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '3rem', color: 'var(--text-main)' }}>
          {t('ref.title')}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          <img 
            src="/testimonial_1.jpg" 
            alt="Testimonio de cliente 1" 
            style={{ width: '100%', borderRadius: 'var(--radius)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} 
          />
          <img 
            src="/testimonial_2.jpg" 
            alt="Testimonio de cliente 2" 
            style={{ width: '100%', borderRadius: 'var(--radius)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} 
          />
        </div>
      </section>

      <div style={{ width: '100%', marginBottom: '4rem' }}>
        <ReviewSection />
      </div>
    </main>
  );
}
