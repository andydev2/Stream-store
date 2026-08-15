import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { getServerSession } from "next-auth/next";

export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({}).lean();
    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    // Verificar que el usuario es administrador
    const session = await getServerSession();
    if (!session || !session.user || session.user.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ success: false, error: 'No autorizado. Solo el administrador puede crear productos.' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    
    // Generamos un id simple si no viene uno
    if (!body.id) {
      body.id = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    const product = await Product.create(body);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
