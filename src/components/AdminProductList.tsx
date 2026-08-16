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
  const [inventoryError, setInventoryError] = useState('');

  // Delete Modal State
  const [productToDelete, setProductToDelete] = useState<{id: string, name: string} | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const fetchProductsSilently = async () => {
    try {
      const res = await fetch('/api/products');
      const result = await res.json();
      if (result.success) {
        setProducts(result.data);
      }
    } catch (err) {}
  };

  const confirmDeleteProduct = (id: string, name: string) => {
    setProductToDelete({ id, name });
  };

  const executeDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/products/${productToDelete.id}`, {
        method: 'DELETE',
      });
      const result = await res.json();

      if (res.ok && result.success) {
        setProductToDelete(null);
        fetchProducts(); // Recargar lista
      } else {
        alert('Error: ' + result.error);
      }
    } catch (err) {
      alert('Error de red al eliminar el producto');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenInventoryModal = (id: string, name: string) => {
    setSelectedProduct({ id, name });
    setAccountsText('');
    setIsModalOpen(true);
  };

  const handleSaveInventory = async () => {
    if (!selectedProduct) return;
    setInventoryError('');
    
    // Separar por líneas y quitar vacías
    const rawAccounts = accountsText.split('\n').map(a => a.trim()).filter(a => a !== '');
    
    if (rawAccounts.length === 0) {
      setInventoryError('Por favor, ingresa al menos una cuenta.');
      return;
    }

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}:.+$/;
    for (const line of rawAccounts) {
      if (!emailRegex.test(line)) {
        setInventoryError(`Error de formato en: "${line}" (Usa correo@valido.com:contraseña)`);
        return;
      }
    }

    const accounts = rawAccounts;

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

  const handleAddRechargeStock = async (id: string) => {
    try {
      // Optimistic UI update
      setProducts(prev => prev.map(p => {
        const pId = p.id || p._id;
        if (pId === id && p.stock !== undefined) {
          return { ...p, stock: p.stock + 1 };
        }
        return p;
      }));

      const dummyAccount = `recarga_${Math.random().toString(36).substring(2,8).toUpperCase()}:diamantes`;
      const res = await fetch(`/api/products/${id}/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accounts: [dummyAccount] }),
      });
      if (res.ok) fetchProductsSilently();
    } catch (err) {
      alert('Error de red al agregar stock');
    }
  };

  if (loading) return <div style={{ marginTop: '2rem', textAlign: 'center' }}>Cargando catálogo...</div>;
  if (error) return <div style={{ marginTop: '2rem', color: 'red', textAlign: 'center' }}>{error}</div>;

  return (
    <>
      <div style={{ background: 'var(--card-bg)', padding: 'clamp(1rem, 3vw, 2rem)', borderRadius: '12px', border: '1px solid var(--border)', marginTop: '2rem', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', color: 'var(--text-main)' }}>Catálogo Actual ({products.length})</h3>
          <button onClick={fetchProducts} className="btn" style={{ padding: '0.5rem 1rem', background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1' }}>
            ↻ Actualizar
          </button>
        </div>

        {products.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No hay productos en la base de datos.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {products.map((product) => (
              <div key={product.id || product._id} style={{ 
                display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', 
                padding: '1rem', background: 'var(--search-bg)', borderRadius: '12px', border: '1px solid var(--border)', gap: '1rem' 
              }}>
                {/* Info principal */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1 1 250px' }}>
                  <div style={{ width: '40px', height: '40px', background: product.color || '#ccc', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '1rem', flexShrink: 0 }}>
                    {product.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '1.1rem' }}>{product.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'capitalize' }}>
                      {product.category.replace('_', ' ')}
                    </div>
                  </div>
                </div>

                {/* Precio y Stock */}
                <div style={{ display: 'flex', gap: '2rem', flex: '1 1 150px' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Precio</div>
                    <div style={{ color: '#1C5F5C', fontWeight: '700' }}>${product.price}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Stock</div>
                    <div style={{ color: product.stock > 0 ? '#16a34a' : '#dc2626', fontWeight: '800' }}>
                      {product.stock !== undefined ? `${product.stock} disp.` : 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div style={{ display: 'flex', gap: '0.5rem', flex: '1 1 100%', justifyContent: 'flex-end' }}>
                  {product.category === 'recharges' || product.category === 'free_fire' ? (
                    <button 
                      onClick={() => handleAddRechargeStock(product.id || product._id)}
                      style={{ background: '#dcfce7', color: '#166534', border: 'none', padding: '0.6rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '800', flex: 1, maxWidth: '150px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      title="Agregar +1 al stock"
                    >
                      +
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleOpenInventoryModal(product.id || product._id, product.name)}
                      style={{ background: '#dbeafe', color: '#2563eb', border: 'none', padding: '0.6rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', flex: 1, maxWidth: '150px' }}
                    >
                      Inventario
                    </button>
                  )}
                  <button 
                    onClick={() => confirmDeleteProduct(product.id || product._id, product.name)}
                    style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '0.6rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', flex: 1, maxWidth: '150px' }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
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
            
            {inventoryError && (
              <div style={{ padding: '0.75rem', marginBottom: '1.5rem', borderRadius: '8px', background: '#fee2e2', color: '#991b1b', fontSize: '0.9rem', border: '1px solid #fecaca' }}>
                {inventoryError}
              </div>
            )}

            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-main)' }}>
              Cuentas / Stock a Añadir
            </label>
            
            <div style={{ background: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
              
              {/* Input manual */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <input 
                  id="modal-email"
                  type="email" 
                  placeholder="Correo de la cuenta..." 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--search-bg)', color: 'var(--text-main)', flex: '1 1 200px' }} 
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      document.getElementById('modal-password')?.focus();
                    }
                  }}
                />
                <input 
                  id="modal-password"
                  type="text" 
                  placeholder="Contraseña..." 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--search-bg)', color: 'var(--text-main)', flex: '1 1 150px' }} 
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      document.getElementById('btn-modal-add')?.click();
                    }
                  }}
                />
                <button 
                  id="btn-modal-add"
                  type="button"
                  onClick={() => {
                    const emailInput = document.getElementById('modal-email') as HTMLInputElement;
                    const passInput = document.getElementById('modal-password') as HTMLInputElement;
                    if (emailInput.value && passInput.value) {
                      const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
                      if (!emailRegex.test(emailInput.value)) {
                        setInventoryError(`Error: El correo "${emailInput.value}" no es válido.`);
                        return;
                      }
                      const newLine = `${emailInput.value}:${passInput.value}`;
                      const currentAccounts = accountsText ? accountsText.split('\n') : [];
                      if (!currentAccounts.includes(newLine)) {
                        setAccountsText(accountsText ? accountsText + '\n' + newLine : newLine);
                        emailInput.value = '';
                        passInput.value = '';
                        setInventoryError('');
                        emailInput.focus();
                      }
                    }
                  }}
                  style={{ background: 'var(--primary)', color: '#1C5F5C', border: 'none', padding: '0 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                >
                  + Añadir
                </button>
              </div>

              {/* Visualización de cuentas añadidas */}
              {accountsText && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '150px', overflowY: 'auto', marginBottom: '1rem' }}>
                  {accountsText.split('\n').filter(l => l.trim() !== '').map((line, idx) => {
                    const [email, pass] = line.split(':');
                    return (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--card-bg)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                        <div>
                          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{email}</span>
                          <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>({pass})</span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => {
                            const lines = accountsText.split('\n').filter(l => l.trim() !== '');
                            lines.splice(idx, 1);
                            setAccountsText(lines.join('\n'));
                          }}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.2rem' }}
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Opcional para pegar múltiples */}
              <details style={{ marginTop: '0.5rem' }}>
                <summary style={{ fontSize: '0.85rem', color: 'var(--text-muted)', cursor: 'pointer', userSelect: 'none' }}>
                  O pegar lista masiva (correo:contraseña)
                </summary>
                <textarea 
                  rows={4}
                  value={accountsText}
                  onChange={(e) => setAccountsText(e.target.value)}
                  placeholder="cliente1@gmail.com:pass123&#10;cliente2@gmail.com:pass456"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--search-bg)', color: 'var(--text-main)', marginTop: '0.5rem', fontFamily: 'monospace' }}
                ></textarea>
              </details>
            </div>
            
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

      {/* Modal de Confirmación de Eliminación */}
      {productToDelete && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '400px', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', background: '#fee2e2', color: '#dc2626', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.5rem auto' }}>
              ⚠️
            </div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: 'var(--text-main)' }}>¿Eliminar Producto?</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.5 }}>
              Estás a punto de eliminar <strong>{productToDelete.name}</strong>. Esta acción borrará el producto de la tienda y no se puede deshacer.
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button 
                onClick={() => setProductToDelete(null)}
                disabled={isDeleting}
                style={{ padding: '0.75rem 1.5rem', background: '#f1f5f9', color: '#334155', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, flex: 1 }}
              >
                Cancelar
              </button>
              <button 
                onClick={executeDelete}
                disabled={isDeleting}
                style={{ padding: '0.75rem 1.5rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, flex: 1 }}
              >
                {isDeleting ? 'Borrando...' : 'Sí, Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
