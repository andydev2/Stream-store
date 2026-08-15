import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import { Product } from "@/models/Product";
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
    const { items, paymentId } = body; // items = [{ id, quantity }] from cart

    if (!items || items.length === 0 || !paymentId) {
      return NextResponse.json({ success: false, error: "Faltan datos de la orden o pago" }, { status: 400 });
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
        const accountIndex = product.accounts.findIndex((acc: any) => acc.isSold === false);
        
        if (accountIndex === -1) {
          console.warn(`Out of stock for product ${product.id} during checkout processing`);
          continue; // Ideally, we should refund or notify admin, but for now we skip
        }

        const accountToSell = product.accounts[accountIndex];
        
        // Mark as sold
        product.accounts[accountIndex].isSold = true;
        
        // Create the order record
        const newOrder = await Order.create({
          userEmail: session.user.email,
          productId: product.id,
          productName: product.name,
          accountId: accountToSell._id.toString(),
          accountUsername: accountToSell.username,
          accountPassword: accountToSell.password,
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
