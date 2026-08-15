"use client";

import { useState, useEffect } from 'react';

export default function AdminProductList() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products');
      const result = await res.json();
      if (result.success) {
        setProducts(result.data);
      } else {
        setError('Error al cargar productos');
      }
    } catch (err) {
      setError('Error de red');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      const result = await res.json();

      if (res.ok && result.success) {
        alert('Producto eliminado');
        fetchProducts(); // Recargar lista
      } else {
        alert('Error: ' + result.error);
      }
    } catch (err) {
      alert('Error de red al eliminar el producto');
    }
  };

  if (loading) return <div style={{ marginTop: '2rem', textAlign: 'center' }}>Cargando catálogo...</div>;
  if (error) return <div style={{ marginTop: '2rem', color: 'red', textAlign: 'center' }}>{error}</div>;

  return (
    <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', color: '#111' }}>Catálogo Actual ({products.length})</h3>
        <button onClick={fetchProducts} className="btn" style={{ padding: '0.5rem 1rem', background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1' }}>
          ↻ Actualizar
        </button>
      </div>

      {products.length === 0 ? (
        <p style={{ color: '#666' }}>No hay productos en la base de datos.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '1rem 0.5rem', color: '#64748b' }}>Producto</th>
                <th style={{ padding: '1rem 0.5rem', color: '#64748b' }}>Categoría</th>
                <th style={{ padding: '1rem 0.5rem', color: '#64748b' }}>Precio</th>
                <th style={{ padding: '1rem 0.5rem', color: '#64748b', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id || product._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '1rem 0.5rem', fontWeight: '500' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '30px', height: '30px', background: product.color || '#ccc', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '0.8rem' }}>
                        {product.icon}
                      </div>
                      {product.name}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 0.5rem', color: '#64748b', textTransform: 'capitalize' }}>
                    {product.category.replace('_', ' ')}
                  </td>
                  <td style={{ padding: '1rem 0.5rem', color: '#0f172a' }}>
                    ${product.price}
                  </td>
                  <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                    <button 
                      onClick={() => handleDelete(product.id || product._id, product.name)}
                      style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
