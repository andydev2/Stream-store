"use client";

import { useLanguage } from '../../context/LanguageContext';
import { Mail, MessageCircle, HelpCircle } from 'lucide-react';

export default function SupportPage() {
  const { t } = useLanguage();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--background)', padding: '4rem 5%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '1rem', letterSpacing: '-1px' }}>
          {t('nav.support')}
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Estamos aquí para ayudarte. Encuentra respuestas rápidas o contáctanos directamente a través de nuestros canales de atención.
        </p>
      </div>

      {/* Cards de Contacto */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', width: '100%', maxWidth: '1000px', marginBottom: '4rem' }}>
        
        {/* WhatsApp */}
        <div style={{ 
          backgroundColor: 'var(--card-bg)', borderRadius: '24px', padding: '2rem', 
          boxShadow: '0 10px 40px rgba(0,0,0,0.05)', textAlign: 'center',
          transition: 'transform 0.3s ease', cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ width: '60px', height: '60px', backgroundColor: '#25D366', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', color: 'white' }}>
            <MessageCircle size={32} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Soporte por WhatsApp</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            Respuestas rápidas para problemas con tus cuentas, pagos o acceso.
          </p>
          <button style={{ 
            backgroundColor: '#25D366', color: 'white', border: 'none', padding: '0.8rem 1.5rem', 
            borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', width: '100%'
          }}>
            Enviar Mensaje
          </button>
        </div>

        {/* Correo Electrónico */}
        <div style={{ 
          backgroundColor: 'var(--card-bg)', borderRadius: '24px', padding: '2rem', 
          boxShadow: '0 10px 40px rgba(0,0,0,0.05)', textAlign: 'center',
          transition: 'transform 0.3s ease', cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ width: '60px', height: '60px', backgroundColor: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', color: 'white' }}>
            <Mail size={32} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Correo Electrónico</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            Escríbenos para dudas generales, facturación o consultas de negocios.
          </p>
          <button style={{ 
            backgroundColor: 'var(--primary)', color: '#0f172a', border: 'none', padding: '0.8rem 1.5rem', 
            borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', width: '100%'
          }}>
            soporte@diegoventas.com
          </button>
        </div>

      </div>

      {/* Preguntas Frecuentes (FAQ) */}
      <div style={{ width: '100%', maxWidth: '800px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HelpCircle color="var(--primary)" /> Preguntas Frecuentes
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            {
              q: "¿Cómo recibo mi cuenta después de pagar?",
              a: "Inmediatamente después de que se confirme el pago a través de PayPal o Tarjeta de crédito, enviaremos los datos de acceso (correo y contraseña) al correo electrónico que proporcionaste durante la compra."
            },
            {
              q: "¿Tienen garantía las cuentas?",
              a: "Sí. Ofrecemos garantía durante todo el periodo que hayas contratado. Si la cuenta presenta problemas, contacta a nuestro soporte de WhatsApp y te daremos un reemplazo rápido."
            },
            {
              q: "¿Puedo cambiar la contraseña de las cuentas?",
              a: "Depende del producto. Algunas cuentas son compartidas para ofrecer el mejor precio (no se debe cambiar la clave), pero otras cuentas como las de Free Fire son 100% tuyas y puedes cambiar todos los datos de acceso."
            }
          ].map((faq, index) => (
            <div key={index} style={{ backgroundColor: 'var(--card-bg)', padding: '1.5rem', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>{faq.q}</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
