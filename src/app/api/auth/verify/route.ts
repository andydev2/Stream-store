import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ success: false, error: 'Faltan datos' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ success: false, error: 'Usuario no encontrado' }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ success: false, error: 'La cuenta ya está verificada' }, { status: 400 });
    }

    if (user.verificationCode !== code) {
      return NextResponse.json({ success: false, error: 'Código incorrecto' }, { status: 400 });
    }

    if (user.verificationCodeExpiresAt && new Date() > user.verificationCodeExpiresAt) {
      return NextResponse.json({ success: false, error: 'El código ha expirado' }, { status: 400 });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpiresAt = undefined;
    await user.save();

    return NextResponse.json({ success: true, message: 'Cuenta verificada exitosamente' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
