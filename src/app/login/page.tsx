"use client";

import Link from "next/link";

export default function Login() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ background: '#fff', padding: '3rem', borderRadius: '12px', border: '1px solid #e2e8f0', width: '100%', maxWidth: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#111', textAlign: 'center' }}>Bienvenido de nuevo</h1>
        <p style={{ color: '#666', marginBottom: '2rem', textAlign: 'center' }}>Inicia sesión en tu cuenta</p>
        
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Correo Electrónico</label>
            <input type="email" placeholder="tu@correo.com" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc' }} required />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Contraseña</label>
            <input type="password" placeholder="••••••••" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc' }} required />
          </div>
          
          <button className="btn btn-primary" type="button" onClick={() => alert('Para procesar el inicio de sesión, necesitamos configurar la Base de Datos.')} style={{ marginTop: '1rem' }}>
            Iniciar Sesión
          </button>
        </form>

        <div style={{ margin: '2rem 0', display: 'flex', alignItems: 'center', textAlign: 'center', color: '#94a3b8' }}>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
          <span style={{ padding: '0 10px', fontSize: '0.9rem' }}>O continúa con</span>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
        </div>

        <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => alert('Recuerda que para Google necesitamos las credenciales en Google Cloud')}>
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '20px', marginRight: '10px' }} />
          Google
        </button>

        <p style={{ textAlign: 'center', marginTop: '2rem', color: '#666' }}>
          ¿No tienes cuenta? <Link href="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Regístrate</Link>
        </p>
      </div>
    </div>
  );
}
