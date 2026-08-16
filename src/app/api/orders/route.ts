import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export const dynamic = 'force-dynamic';

import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";
import { Order } from "@/models/Order";

// GET /api/orders
// Returns all orders for the currently authenticated user
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    await connectToDatabase();
    
    // Find orders for this user
    const orders = await Order.find({ userEmail: session.user.email }).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 });
  }
}

// POST /api/orders
// Called after successful payment. Assigns an account to the user.
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { items, paymentId, paymentGateway } = body; // items = [{ id, quantity }] from cart

    if (!items || items.length === 0 || !paymentId || !paymentGateway) {
      return NextResponse.json({ success: false, error: "Faltan datos de la orden o pago" }, { status: 400 });
    }

    // Verify payment based on gateway
    if (paymentGateway === 'stripe') {
      const Stripe = require('stripe');
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
      if (paymentIntent.status !== 'succeeded') {
        return NextResponse.json({ success: false, error: "El pago en Stripe no fue exitoso." }, { status: 400 });
      }
    } else if (paymentGateway === 'paypal') {
      const paypalUrl = process.env.NODE_ENV === 'production' 
        ? 'https://api-m.paypal.com' 
        : 'https://api-m.sandbox.paypal.com';
        
      const tokenRes = await fetch(`${paypalUrl}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Accept-Language': 'en_US',
          'Authorization': `Basic ${Buffer.from(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID + ':' + process.env.PAYPAL_SECRET).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
      });
      
      const tokenData = await tokenRes.json();
      if (!tokenData.access_token) {
        throw new Error("No se pudo obtener el token de PayPal");
      }

      // Capture the order
      const captureRes = await fetch(`${paypalUrl}/v2/checkout/orders/${paymentId}/capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenData.access_token}`
        }
      });
      
      const captureData = await captureRes.json();
      if (captureData.status !== 'COMPLETED') {
        return NextResponse.json({ success: false, error: "El pago en PayPal no pudo ser capturado." }, { status: 400 });
      }
    } else {
      return NextResponse.json({ success: false, error: "Gateway de pago no soportado" }, { status: 400 });
    }

    await connectToDatabase();
    
    const createdOrders = [];

    // Process each item in the cart
    for (const item of items) {
      const product = await Product.findOne({ id: item.id });
      
      if (!product) continue;

      // We need to fulfill 'quantity' accounts for this product
      for (let i = 0; i < item.quantity; i++) {
        // Find an unsold account
        if (!product.accounts) product.accounts = [];
        const accountIndex = product.accounts.findIndex((acc: any) => acc.isSold === false);
        
        if (accountIndex === -1) {
          console.warn(`Out of stock for product ${product.id} during checkout processing`);
          continue; // Ideally, we should refund or notify admin, but for now we skip
        }

        const accountToSell = product.accounts[accountIndex] as any;
        
        // Mark as sold
        product.accounts[accountIndex].isSold = true;
        
        // Split credentials into username/password if possible
        const creds = accountToSell.credentials || "";
        const [username, ...passParts] = creds.includes(':') ? creds.split(':') : [creds, ""];
        const password = passParts.join(':') || "N/A";
        
        // Create the order record
        const newOrder = await Order.create({
          userEmail: session.user.email,
          productId: product.id,
          productName: product.name,
          productCategory: product.category,
          accountId: accountToSell._id ? accountToSell._id.toString() : Date.now().toString(),
          accountUsername: username || "N/A",
          accountPassword: password || "N/A",
          price: product.price,
          paymentId: paymentId
        });

        createdOrders.push(newOrder);
      }
      
      // Save the updated product with the newly sold accounts
      await product.save();
    }

    return NextResponse.json({ success: true, message: "Orden procesada exitosamente", data: createdOrders });
  } catch (error) {
    console.error("Error processing order:", error);
    return NextResponse.json({ success: false, error: "Error al procesar la orden" }, { status: 500 });
  }
}
