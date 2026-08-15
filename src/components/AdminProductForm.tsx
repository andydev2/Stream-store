"use client";

import { useState } from 'react';

export default function AdminProductForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const formData = new FormData(e.currentTarget);
    const productData = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: Number(formData.get('price')),
      icon: formData.get('icon'),
      color: formData.get('color'),
      category: formData.get('category'),
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      const result = await res.json();
      if (res.ok) {
        setMessage('¡Producto agregado con éxito!');
        (e.target as HTMLFormElement).reset();
      } else {
        setMessage('Error: ' + result.error);
      }
    } catch (err: any) {
      setMessage('Error de red al agregar producto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '2rem' }}>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#111' }}>Administración: Añadir Producto</h3>
      
      {message && (
        <div style={{ padding: '1rem', marginBottom: '1.5rem', borderRadius: '8px', background: message.includes('Error') ? '#fee2e2' : '#dcfce7', color: message.includes('Error') ? '#991b1b' : '#166534' }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Nombre del Producto</label>
          <input required name="name" type="text" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc' }} />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Descripción</label>
          <textarea required name="description" rows={3} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc' }}></textarea>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Precio (USD)</label>
            <input required name="price" type="number" step="0.01" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc' }} />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Categoría</label>
            <select required name="category" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc' }}>
              <option value="streaming">Streaming</option>
              <option value="ai">IA</option>
              <option value="music">Música</option>
              <option value="games">Juegos</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Icono (Texto corto Ej: N, AI)</label>
            <input required name="icon" type="text" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc' }} />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Color (Hexadecimal Ej: #E50914)</label>
            <input required name="color" type="text" defaultValue="#000000" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc' }} />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          {loading ? 'Guardando...' : 'Guardar Producto'}
        </button>
      </form>
    </div>
  );
}
