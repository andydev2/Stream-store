"use client";

import { useState, useEffect } from 'react';

export default function AdminOrderList() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/orders');
      const result = await res.json();
      if (result.success) {
        setOrders(result.data);
      } else {
        setError('Error al cargar órdenes');
      }
    } catch (err) {
      setError('Error de red');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    if (!confirm(`¿Estás seguro de que quieres ${action === 'approve' ? 'APROBAR' : 'RECHAZAR'} esta orden?`)) return;
    
    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const result = await res.json();
      if (result.success) {
        fetchOrders();
      } else {
        alert("Error: " + result.error);
      }
    } catch (err) {
      alert("Error de red");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <div style={{ marginTop: '2rem', textAlign: 'center' }}>Cargando órdenes pendientes...</div>;
  if (error) return <div style={{ marginTop: '2rem', color: 'red', textAlign: 'center' }}>{error}</div>;

  return (
    <div style={{ background: 'var(--card-bg)', padding: 'clamp(1rem, 3vw, 2rem)', borderRadius: '12px', border: '1px solid var(--border)', marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>Transferencias Pendientes ({orders.length})</h3>
        <button onClick={fetchOrders} className="btn" style={{ padding: '0.5rem 1rem', background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1' }}>
          ↻ Actualizar
        </button>
      </div>

      {orders.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No hay transferencias pendientes de verificación.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map((order) => (
            <div key={order._id} style={{ padding: '1.5rem', background: 'var(--search-bg)', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div style={{ flex: '1 1 300px' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)', fontSize: '1.2rem' }}>{order.productName}</h4>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Comprador: <strong>{order.userEmail}</strong></div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Precio: <strong>${order.price}</strong></div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Fecha: {new Date(order.createdAt).toLocaleString()}</div>
                <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.05)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cuenta Reservada (Oculta al usuario):</div>
                  <div style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>{order.accountUsername} : {order.accountPassword}</div>
                </div>
              </div>

              <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 'bold' }}>Comprobante Adjunto:</div>
                {order.receiptBase64 ? (
                  <img 
                    src={order.receiptBase64} 
                    alt="Comprobante" 
                    style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', border: '2px solid var(--border)', objectFit: 'contain', background: '#000' }} 
                  />
                ) : (
                  <div style={{ color: '#ef4444' }}>Sin comprobante</div>
                )}
                
                <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                  <button 
                    onClick={() => handleAction(order._id, 'reject')}
                    disabled={processingId === order._id}
                    style={{ flex: 1, padding: '0.75rem', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Rechazar
                  </button>
                  <button 
                    onClick={() => handleAction(order._id, 'approve')}
                    disabled={processingId === order._id}
                    style={{ flex: 1, padding: '0.75rem', background: '#dcfce7', color: '#16a34a', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    {processingId === order._id ? 'Procesando...' : 'Aprobar Pago'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
