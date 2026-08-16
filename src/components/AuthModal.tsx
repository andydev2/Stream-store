"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const [mode, setMode] = useState<'login' | 'register' | 'verify'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    window.addEventListener('open-auth-modal', handleOpen);
    window.addEventListener('close-auth-modal', handleClose);

    return () => {
      window.removeEventListener('open-auth-modal', handleOpen);
      window.removeEventListener('close-auth-modal', handleClose);
    };
  }, []);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      setIsOpen(false);
      router.refresh();
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al registrarse');
      }

      setMode('verify');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Código inválido');
      }

      const loginRes = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (loginRes?.error) {
        setError(loginRes.error);
        setLoading(false);
      } else {
        setIsOpen(false);
        router.refresh();
      }

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: '1rem',
      animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{ 
        background: 'var(--card-bg)', padding: '2.5rem 2rem', borderRadius: '24px', 
        border: '1px solid var(--border)', width: '100%', maxWidth: '400px', 
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative'
      }}>
        <button onClick={() => setIsOpen(false)} style={{
          position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none',
          fontSize: '1.5rem', color: 'var(--text-muted)', cursor: 'pointer'
        }}>×</button>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: 'white', boxShadow: '0 8px 20px rgba(62, 213, 204, 0.4)' }}>
            🔒
          </div>
        </div>

        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.2rem', color: 'var(--text-main)', textAlign: 'center', fontWeight: 800 }}>
          {mode === 'verify' ? 'Verifica tu Correo' : mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
          {mode === 'verify' ? 'Ingresa el código enviado al correo' : 'Para comprar o usar el soporte necesitas una cuenta'}
        </p>

        {error && (
          <div style={{ background: '#fee2e2', color: '#ef4444', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem', border: '1px solid #fca5a5' }}>
            {error}
          </div>
        )}

        <form onSubmit={mode === 'login' ? handleLogin : mode === 'register' ? handleRegister : handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {(mode === 'login' || mode === 'register') && (
            <>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, color: 'var(--text-main)', fontSize: '0.85rem' }}>Correo Electrónico</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--search-bg)', color: 'var(--text-main)', outline: 'none' }} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, color: 'var(--text-main)', fontSize: '0.85rem' }}>Contraseña</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--search-bg)', color: 'var(--text-main)', outline: 'none' }} required />
              </div>
            </>
          )}

          {mode === 'verify' && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, color: 'var(--text-main)', fontSize: '0.85rem', textAlign: 'center' }}>Código de 6 dígitos</label>
              <input type="text" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))} placeholder="000000" style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--primary)', background: 'var(--search-bg)', color: 'var(--primary)', textAlign: 'center', fontSize: '1.2rem', letterSpacing: '4px', fontWeight: 'bold', outline: 'none' }} required />
            </div>
          )}
          
          <button type="submit" disabled={loading} style={{ marginTop: '0.5rem', background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', color: '#1C5F5C', padding: '0.8rem', borderRadius: '10px', border: 'none', fontWeight: 800, fontSize: '0.95rem', cursor: loading ? 'wait' : 'pointer', transition: 'transform 0.2s', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Procesando...' : mode === 'login' ? 'Entrar' : mode === 'register' ? 'Registrarse' : 'Verificar'}
          </button>
        </form>

        {(mode === 'login' || mode === 'register') && (
          <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {mode === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
            <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', padding: 0 }}>
              {mode === 'login' ? 'Regístrate' : 'Inicia Sesión'}
            </button>
          </div>
        )}

        <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
          <span style={{ padding: '0 10px', fontSize: '0.8rem' }}>o ingresar por</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
        </div>

        <button onClick={() => signIn('google', { callbackUrl: '/' })} style={{ width: '100%', padding: '0.7rem', background: 'var(--search-bg)', border: '1px solid var(--border)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer' }}>
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '18px' }} />
          Google
        </button>
      </div>
    </div>
  );
}
