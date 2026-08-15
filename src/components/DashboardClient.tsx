"use client";

import { useLanguage } from "@/context/LanguageContext";
import AdminProductForm from "@/components/AdminProductForm";
import AdminProductList from "@/components/AdminProductList";
import { signOut } from "next-auth/react";

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
            <h1 style={{ fontSize: '2.5rem', color: '#111' }}>¡Hola, {user.name}!</h1>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>{user.email}</p>
          </div>
        </div>
        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}
        >
          {t('dashboard.logout')}
        </button>
      </div>

      <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
        {t('dashboard.purchases')}
      </h2>
      
      <div style={{ background: '#fff', padding: '3rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center', marginBottom: '3rem' }}>
        <p style={{ color: '#666', fontSize: '1.2rem', marginBottom: '1rem' }}>
          {t('dashboard.purchases.empty')}
        </p>
        <a href="/" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '20px', textDecoration: 'none', color: 'white', background: 'var(--primary)', display: 'inline-block', fontWeight: 'bold' }}>
          {t('nav.catalog')}
        </a>
      </div>

      {isAdmin && (
        <>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', color: '#dc2626' }}>
            {t('dashboard.admin')}
          </h2>
          <AdminProductForm />
          <AdminProductList />
        </>
      )}
    </div>
  );
}
