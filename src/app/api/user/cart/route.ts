import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ cart: user.cart || [] });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { cart } = await req.json();

    if (!Array.isArray(cart)) {
      return NextResponse.json({ error: 'Formato de carrito inválido' }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: { cart } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, cart: user.cart });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
