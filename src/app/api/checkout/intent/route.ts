import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe((process.env.STRIPE_SECRET_KEY || '').trim(), {
  apiVersion: '2022-11-15' as any, // fallback para compatibilidad con tipos viejos de Stripe si existieran
});

export async function POST(request: Request) {
  try {
    const { items } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    // Calcular el total en el backend para evitar manipulaciones en el cliente
    const totalAmount = items.reduce((total: number, item: any) => {
      return total + (item.price * item.quantity);
    }, 0);

    // Stripe procesa montos en centavos (ej: $10.00 = 1000)
    const amountInCents = Math.round(totalAmount * 100);

    // Crear el PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        cartItems: JSON.stringify(items.map((i: any) => ({ id: i.id, q: i.quantity }))),
      }
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error("Error creating PaymentIntent:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
