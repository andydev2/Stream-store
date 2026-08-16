import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="container" style={{ padding: '4rem 5%', maxWidth: '900px', margin: '0 auto', color: 'var(--text-main)' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--primary)', fontWeight: 800 }}>Política de Privacidad</h1>
      
      <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border)', lineHeight: 1.8 }}>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
          En Diego Ventas, nos tomamos muy en serio la privacidad y protección de los datos personales de nuestros clientes. Esta Política de Privacidad describe cómo recopilamos, utilizamos y protegemos tu información.
        </p>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>1. Información que Recopilamos</h2>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
          Para ofrecer nuestros servicios, recopilamos la siguiente información personal: <br/>
          - <strong>Datos de contacto:</strong> Nombre, dirección de correo electrónico (a través del inicio de sesión con Google).<br/>
          - <strong>Datos de transacciones:</strong> Comprobantes de transferencia bancaria, identificadores de pago de PayPal.<br/>
          - <strong>Datos de la cuenta:</strong> Historial de compras y registros del chat de soporte técnico.
        </p>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>2. Uso de la Información</h2>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
          Utilizamos tu información exclusivamente para:<br/>
          - Procesar y entregar tus pedidos digitales de manera rápida y segura.<br/>
          - Brindarte soporte técnico y servicio al cliente a través de nuestro chat interno.<br/>
          - Notificarte sobre el estado de tu compra o verificación de tu pago.
        </p>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>3. Protección de Datos (Seguridad)</h2>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
          Implementamos medidas de seguridad avanzadas para mantener tu información personal a salvo. No almacenamos datos de tarjetas de crédito o débito en nuestros servidores, ya que utilizamos proveedores de pago externos (PayPal, Stripe) que manejan esta información bajo estrictos protocolos de seguridad (PCI-DSS).
        </p>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>4. Compartir Información con Terceros</h2>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
          Diego Ventas <strong>NUNCA</strong> vende, alquila o comercializa tu información personal a terceros. Solo compartiremos datos estrictamente necesarios con plataformas procesadoras de pagos (como PayPal) para poder autorizar la transacción.
        </p>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>5. Retención de Datos</h2>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
          Mantendremos la información de tus pedidos y compras en nuestra base de datos para que puedas acceder al historial y a las contraseñas de los productos que adquiriste en cualquier momento desde tu panel de usuario.
        </p>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>6. Contacto</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Si tienes alguna pregunta sobre esta Política de Privacidad, no dudes en contactarnos a través de la sección de soporte.
        </p>
      </div>
    </div>
  );
}
