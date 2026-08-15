"use client";

import { useLanguage } from "@/context/LanguageContext";
import AdminProductForm from "@/components/AdminProductForm";
import AdminProductList from "@/components/AdminProductList";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { Key } from "lucide-react";

type DashboardClientProps = {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  isAdmin: boolean;
};

export default function DashboardClient({ user, isAdmin }: DashboardClientProps) {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        const json = await res.json();
        if (json.success) {
          setOrders(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <img 
            src={user.image || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"} 
            alt="Avatar" 
            style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid var(--primary)' }} 
          />
          <div>
            <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)' }}>¡Hola, {user.name}!</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{user.email}</p>
          </div>
        </div>
        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}
        >
          {t('dashboard.logout')}
        </button>
      </div>

      <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', color: 'var(--text-main)' }}>
        {t('dashboard.purchases')}
      </h2>
      
      {loadingOrders ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Cargando tus compras...</div>
      ) : orders.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {orders.map((order) => (
            <div key={order._id} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', margin: 0 }}>{order.productName}</h3>
                <span style={{ background: 'var(--primary)', color: '#0f172a', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>Activa</span>
              </div>
              <div style={{ background: 'var(--search-bg)', padding: '1rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Usuario:</span>
                  <strong style={{ color: 'var(--text-main)' }}>{order.accountUsername}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Contraseña:</span>
                  <strong style={{ color: 'var(--text-main)', letterSpacing: '1px' }}>{order.accountPassword}</strong>
                </div>
              </div>
              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Comprado el {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ background: 'var(--card-bg)', padding: '3rem', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '1rem' }}>
            {t('dashboard.purchases.empty')}
          </p>
          <a href="/" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '20px', textDecoration: 'none', color: '#0f172a', background: 'var(--primary)', display: 'inline-block', fontWeight: 'bold' }}>
            {t('nav.catalog')}
          </a>
        </div>
      )}

      {isAdmin && (
        <>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', color: '#dc2626' }}>
            {t('dashboard.admin')}
          </h2>
          <AdminProductForm />
          <AdminProductList />
        </>
      )}
    </div>
  );
}
