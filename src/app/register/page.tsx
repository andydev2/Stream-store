"use client";

import Link from "next/link";

export default function Register() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ background: '#fff', padding: '3rem', borderRadius: '12px', border: '1px solid var(--border)', width: '100%', maxWidth: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#111', textAlign: 'center' }}>Crear Cuenta</h1>
        <p style={{ color: '#666', marginBottom: '2rem', textAlign: 'center' }}>Regístrate para guardar tus suscripciones</p>
        
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Nombre Completo</label>
            <input type="text" aria-label="Nombre completo" placeholder="Ej. Juan Pérez" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc' }} required />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Correo Electrónico</label>
            <input type="email" aria-label="Correo electrónico" placeholder="tu@correo.com" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc' }} required />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Contraseña</label>
            <input type="password" aria-label="Contraseña" placeholder="••••••••" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc' }} required />
          </div>
          
          <button className="btn btn-primary" type="button" onClick={() => alert('Para que este registro funcione de verdad y guarde tus datos, debemos aprobar y configurar la Base de Datos.')} style={{ marginTop: '1rem' }}>
            Registrarse
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', color: '#666' }}>
          ¿Ya tienes cuenta? <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Inicia Sesión</Link>
        </p>
      </div>
    </div>
  );
}
