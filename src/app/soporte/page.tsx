"use client";

export default function Soporte() {
  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#111' }}>Centro de Soporte</h1>
      <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '3rem' }}>
        Estamos aquí para ayudarte con cualquier duda sobre tu suscripción.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Preguntas Frecuentes</h2>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li>
              <strong>¿Cuánto tarda en llegar mi cuenta?</strong>
              <p style={{ color: '#666', marginTop: '0.25rem' }}>La entrega es inmediata tras confirmar el pago.</p>
            </li>
            <li>
              <strong>¿Puedo compartir mi cuenta?</strong>
              <p style={{ color: '#666', marginTop: '0.25rem' }}>Depende del plan que hayas comprado. Lee la descripción del producto.</p>
            </li>
            <li>
              <strong>¿Qué pasa si la cuenta deja de funcionar?</strong>
              <p style={{ color: '#666', marginTop: '0.25rem' }}>Ofrecemos garantía durante todo el periodo contratado. Contáctanos y la reemplazaremos.</p>
            </li>
          </ul>
        </div>

        <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Contáctanos</h2>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Email</label>
              <input type="email" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Mensaje</label>
              <textarea rows={4} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc' }} />
            </div>
            <button className="btn btn-primary" type="button" onClick={() => alert('Mensaje enviado (simulación)')}>
              Enviar Mensaje
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
