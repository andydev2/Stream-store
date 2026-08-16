import React from 'react';

export default function TermsPage() {
  return (
    <div className="container" style={{ padding: '4rem 5%', maxWidth: '900px', margin: '0 auto', color: 'var(--text-main)' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--primary)', fontWeight: 800 }}>Términos y Condiciones</h1>
      
      <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border)', lineHeight: 1.8 }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>1. Aceptación de los Términos</h2>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
          Al acceder y realizar compras en Diego Ventas, aceptas estar sujeto a estos Términos y Condiciones. Si no estás de acuerdo con alguna parte de estos términos, te pedimos que no utilices nuestros servicios.
        </p>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>2. Descripción del Servicio</h2>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
          Diego Ventas ofrece la venta de cuentas y perfiles digitales para plataformas de streaming, inteligencia artificial, videojuegos y otros servicios digitales. Todos los productos están sujetos a disponibilidad de inventario.
        </p>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#ef4444' }}>3. Política de Cero Reembolsos (IMPORTANTE)</h2>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)', background: 'rgba(239, 68, 68, 0.05)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #ef4444' }}>
          Debido a la naturaleza digital de nuestros productos y para evitar el uso indebido de las cuentas, <strong>NO SE ACEPTAN REEMBOLSOS, CAMBIOS NI DEVOLUCIONES</strong> bajo ninguna circunstancia una vez que las credenciales de la cuenta han sido entregadas al cliente. Te recomendamos revisar cuidadosamente tu pedido antes de realizar el pago.
        </p>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>4. Garantía Limitada</h2>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
          Ofrecemos garantía únicamente en caso de que las credenciales entregadas no funcionen en el momento exacto de la entrega. El cliente debe notificar inmediatamente al soporte. La garantía no cubre bloqueos por mal uso, cambio de contraseñas no autorizados, o compartir cuentas a terceros.
        </p>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>5. Uso Permitido</h2>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
          Está estrictamente prohibido alterar los datos de la cuenta (correo, contraseña, perfiles o métodos de pago) a menos que se indique explícitamente que la cuenta es de propiedad total. El incumplimiento de esta norma resultará en la suspensión inmediata del servicio sin derecho a reclamo o reembolso.
        </p>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>6. Cambios en los Términos</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigencia inmediatamente después de su publicación en el sitio web.
        </p>
      </div>
    </div>
  );
}
