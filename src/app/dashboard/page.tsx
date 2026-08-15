import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import AdminProductForm from "@/components/AdminProductForm";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  const isAdmin = session.user?.email === process.env.ADMIN_EMAIL;

  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem' }}>
        <img 
          src={session.user?.image || ''} 
          alt="Avatar" 
          style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid var(--primary)' }} 
        />
        <div>
          <h1 style={{ fontSize: '2.5rem', color: '#111' }}>¡Hola, {session.user?.name}!</h1>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>{session.user?.email}</p>
        </div>
      </div>

      <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
        Mis Suscripciones
      </h2>
      
      <div style={{ background: '#fff', padding: '3rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
        <p style={{ color: '#666', fontSize: '1.2rem', marginBottom: '1rem' }}>
          Aún no tienes suscripciones activas.
        </p>
        <a href="/" className="btn btn-primary">Explorar Catálogo</a>
      </div>

      {isAdmin && <AdminProductForm />}
    </div>
  );
}
