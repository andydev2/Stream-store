"use client";

import { useState } from 'react';

export default function AdminProductForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('streaming');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [accountsText, setAccountsText] = useState('');

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

    // Validación estricta de cuentas
    let validAccounts: string[] = [];
    if (accountsText.trim()) {
      const lines = accountsText.split('\n').map(l => l.trim()).filter(l => l !== '');
      const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}:.+$/;
      
      for (const line of lines) {
        if (!emailRegex.test(line)) {
          setMessage(`Error: La cuenta "${line}" no tiene el formato correcto (correo@valido.com:contraseña)`);
          setLoading(false);
          return;
        }
        validAccounts.push(line);
      }
    }

    const formData = new FormData(e.currentTarget);
    const fileInputUsed = !!imageBase64;
    const finalImageUrl = fileInputUsed ? imageBase64 : formData.get('imageUrl');

    const productData = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: Number(formData.get('price')),
      color: formData.get('color'),
      category: formData.get('category'),
      imageUrl: finalImageUrl,
      accounts: validAccounts, // Enviar al backend
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
        setSelectedCategory('streaming'); 
        setImageBase64(null);
        setAccountsText('');
      } else {
        setMessage('Error: ' + result.error);
      }
    } catch (err: any) {
      setMessage('Error de red al agregar producto.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--search-bg)', color: 'var(--text-main)' };
  const labelStyle = { display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-main)' };

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
          <label style={labelStyle}>Nombre del Producto</label>
          <input required name="name" type="text" placeholder="Ej: Cuenta de Free Fire" style={inputStyle} />
        </div>
        
        <div>
          <label style={labelStyle}>Descripción</label>
          <textarea required name="description" rows={3} maxLength={400} placeholder="Detalles de la cuenta o producto... (Máx 400 caracteres)" style={{ ...inputStyle, resize: 'none' }}></textarea>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Precio (USD)</label>
            <input required name="price" type="number" step="0.01" placeholder="Ej: 9.99" style={inputStyle} />
          </div>
          
          <div>
            <label style={labelStyle}>Categoría</label>
            <select 
              required 
              name="category" 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={inputStyle}
            >
              <option value="streaming">Streaming</option>
              <option value="ai">Inteligencia Artificial</option>
              <option value="music">Música</option>
              <option value="games">Juegos (Gral)</option>
              <option value="free_fire">Juegos / Free Fire</option>
              <option value="recharges">Diamantes de Free Fire</option>
            </select>
          </div>
        </div>

        {(selectedCategory !== 'recharges' && selectedCategory !== 'free_fire' && selectedCategory !== 'streaming') && (
          <div>
            <label style={labelStyle}>Stock Inicial / Cuentas (Opcional)</label>
          <div style={{ background: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
            
            {/* Input manual */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <input 
                id="manual-email"
                type="email" 
                placeholder="Correo de la cuenta..." 
                style={{ ...inputStyle, flex: '1 1 200px', marginBottom: 0 }} 
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    document.getElementById('manual-password')?.focus();
                  }
                }}
              />
              <input 
                id="manual-password"
                type="text" 
                placeholder="Contraseña..." 
                style={{ ...inputStyle, flex: '1 1 150px', marginBottom: 0 }} 
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    document.getElementById('btn-add-account')?.click();
                  }
                }}
              />
              <button 
                id="btn-add-account"
                type="button"
                onClick={() => {
                  const emailInput = document.getElementById('manual-email') as HTMLInputElement;
                  const passInput = document.getElementById('manual-password') as HTMLInputElement;
                  if (emailInput.value && passInput.value) {
                    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
                    if (!emailRegex.test(emailInput.value)) {
                      setMessage(`Error: El correo "${emailInput.value}" no es válido.`);
                      return;
                    }
                    const newLine = `${emailInput.value}:${passInput.value}`;
                    const currentAccounts = accountsText ? accountsText.split('\n') : [];
                    if (!currentAccounts.includes(newLine)) {
                      setAccountsText(accountsText ? accountsText + '\n' + newLine : newLine);
                      emailInput.value = '';
                      passInput.value = '';
                      setMessage('');
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
                name="accounts" 
                rows={4} 
                value={accountsText}
                onChange={(e) => setAccountsText(e.target.value)}
                placeholder="cliente1@gmail.com:pass123&#10;cliente2@gmail.com:pass456" 
                style={{...inputStyle, fontFamily: 'monospace', marginTop: '0.5rem'}}
              ></textarea>
            </details>

            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Color de Fondo</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <input required name="color" type="color" defaultValue="#E50914" style={{ width: '50px', height: '45px', padding: '0', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }} title="Elige un color" />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>El icono se generará automáticamente.</span>
            </div>
          </div>
          
          {(selectedCategory === 'games' || selectedCategory === 'free_fire' || selectedCategory === 'recharges') && (
            <div>
              <label style={labelStyle}>Imagen (Opcional)</label>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px dashed var(--border)', background: 'var(--search-bg)', color: 'var(--text-main)' }} 
                />
                
                <span style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>O</span>
                
                <input 
                  name="imageUrl" 
                  type="url" 
                  disabled={!!imageBase64}
                  placeholder={imageBase64 ? "Archivo seleccionado (Ignorando URL)" : "Pegar URL externa..."} 
                  style={{ ...inputStyle, opacity: imageBase64 ? 0.5 : 1 }} 
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
