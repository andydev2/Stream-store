"use client";

import { useState, useEffect } from 'react';

export default function AdminProductList() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{id: string, name: string} | null>(null);
  const [accountsText, setAccountsText] = useState('');
  const [savingInventory, setSavingInventory] = useState(false);

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

  const handleOpenInventoryModal = (id: string, name: string) => {
    setSelectedProduct({ id, name });
    setAccountsText('');
    setIsModalOpen(true);
  };

  const handleSaveInventory = async () => {
    if (!selectedProduct) return;
    
    // Separar por líneas y quitar vacías
    const accounts = accountsText.split('\n').map(a => a.trim()).filter(a => a !== '');
    
    if (accounts.length === 0) {
      alert('Por favor, ingresa al menos una cuenta.');
      return;
    }

    try {
      setSavingInventory(true);
      const res = await fetch(`/api/products/${selectedProduct.id}/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accounts }),
      });
      const result = await res.json();

      if (res.ok && result.success) {
        alert(result.message);
        setIsModalOpen(false);
        fetchProducts(); // Update stock count
      } else {
        alert('Error: ' + result.error);
      }
    } catch (err) {
      alert('Error de red al guardar inventario');
    } finally {
      setSavingInventory(false);
    }
  };

  if (loading) return <div style={{ marginTop: '2rem', textAlign: 'center' }}>Cargando catálogo...</div>;
  if (error) return <div style={{ marginTop: '2rem', color: 'red', textAlign: 'center' }}>{error}</div>;

  return (
    <>
      <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)', marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>Catálogo Actual ({products.length})</h3>
          <button onClick={fetchProducts} className="btn" style={{ padding: '0.5rem 1rem', background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1' }}>
            ↻ Actualizar
          </button>
        </div>

        {products.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No hay productos en la base de datos.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>Producto</th>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>Categoría</th>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>Precio</th>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>Stock</th>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)', textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id || product._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem 0.5rem', fontWeight: '500' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '30px', height: '30px', background: product.color || '#ccc', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '0.8rem' }}>
                          {product.icon}
                        </div>
                        {product.name}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                      {product.category.replace('_', ' ')}
                    </td>
                    <td style={{ padding: '1rem 0.5rem', color: '#1C5F5C' }}>
                      ${product.price}
                    </td>
                    <td style={{ padding: '1rem 0.5rem', color: product.stock > 0 ? '#16a34a' : '#dc2626', fontWeight: 'bold' }}>
                      {product.stock !== undefined ? `${product.stock} disp.` : 'N/A'}
                    </td>
                    <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                      <button 
                        onClick={() => handleOpenInventoryModal(product.id || product._id, product.name)}
                        style={{ background: '#dbeafe', color: '#2563eb', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', marginRight: '0.5rem' }}
                      >
                        Inventario
                      </button>
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

      {/* Modal de Inventario */}
      {isModalOpen && selectedProduct && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '500px' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Añadir Stock</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Agregando cuentas a: <strong>{selectedProduct.name}</strong></p>
            
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#333' }}>
              Pega los datos de las cuentas (Una cuenta por línea)
            </label>
            <textarea 
              rows={8}
              value={accountsText}
              onChange={(e) => setAccountsText(e.target.value)}
              placeholder="correo1@gmail.com:contraseña1&#10;correo2@gmail.com:contraseña2"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '1.5rem', fontFamily: 'monospace' }}
            ></textarea>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button 
                onClick={() => setIsModalOpen(false)}
                disabled={savingInventory}
                style={{ padding: '0.75rem 1.5rem', background: '#f1f5f9', color: '#334155', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveInventory}
                disabled={savingInventory}
                style={{ padding: '0.75rem 1.5rem', background: 'var(--primary)', color: '#1C5F5C', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
              >
                {savingInventory ? 'Guardando...' : 'Guardar Cuentas'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
