"use client";

import { useState } from 'react';

export default function AdminProductForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('streaming');
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setImageBase64(null);
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("La imagen es muy pesada. Máximo 2MB.");
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const formData = new FormData(e.currentTarget);
    
    // Si seleccionó subir desde el dispositivo, usamos el base64. Si pegó una URL, usamos la URL.
    const fileInputUsed = !!imageBase64;
    const finalImageUrl = fileInputUsed ? imageBase64 : formData.get('imageUrl');

    const productData = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: Number(formData.get('price')),
      color: formData.get('color'),
      category: formData.get('category'),
      imageUrl: finalImageUrl,
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
        setSelectedCategory('streaming'); // reset category state
        setImageBase64(null);
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
    <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Añadir Nuevo Producto</h3>
      
      {message && (
        <div style={{ padding: '1rem', marginBottom: '1.5rem', borderRadius: '8px', background: message.includes('Error') ? '#fee2e2' : '#dcfce7', color: message.includes('Error') ? '#991b1b' : '#166534' }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Nombre del Producto</label>
          <input required name="name" type="text" placeholder="Ej: Cuenta de Free Fire" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }} />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Descripción</label>
          <textarea required name="description" rows={3} placeholder="Detalles de la cuenta o producto..." style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}></textarea>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Precio (USD)</label>
            <input required name="price" type="number" step="0.01" placeholder="Ej: 9.99" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }} />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Categoría</label>
            <select 
              required 
              name="category" 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--card-bg)' }}
            >
              <option value="streaming">Streaming</option>
              <option value="ai">Inteligencia Artificial</option>
              <option value="music">Música</option>
              <option value="games">Juegos (Gral)</option>
              <option value="free_fire">Juegos / Free Fire</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Color de Fondo</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <input required name="color" type="color" defaultValue="#E50914" style={{ width: '50px', height: '45px', padding: '0', border: 'none', borderRadius: '8px', cursor: 'pointer' }} title="Elige un color" />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>El icono se generará automáticamente con la primera letra.</span>
            </div>
          </div>
          
          {(selectedCategory === 'games' || selectedCategory === 'free_fire') && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Imagen (Opcional)</label>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px dashed var(--border)', background: 'var(--search-bg)' }} 
                />
                
                <span style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>O</span>
                
                <input 
                  name="imageUrl" 
                  type="url" 
                  disabled={!!imageBase64}
                  placeholder={imageBase64 ? "Archivo seleccionado (Ignorando URL)" : "Pegar URL externa..."} 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', opacity: imageBase64 ? 0.5 : 1 }} 
                />
              </div>
            </div>
          )}
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
          {loading ? 'Guardando...' : 'Guardar Producto'}
        </button>
      </form>
    </div>
  );
}
