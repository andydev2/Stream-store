import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { allProducts } from '@/data/products';

export async function GET() {
  try {
    await dbConnect();
    
    // Check if products already exist
    const count = await Product.countDocuments();
    if (count > 0) {
      return NextResponse.json({ message: 'Base de datos ya está poblada.', count });
    }

    // Insert initial products
    await Product.insertMany(allProducts);

    return NextResponse.json({ success: true, message: 'Productos iniciales insertados con éxito.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
