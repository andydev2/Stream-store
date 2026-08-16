import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Falta correo o contraseña' }, { status: 400 });
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.isVerified) {
        return NextResponse.json({ success: false, error: 'Este correo ya está registrado' }, { status: 400 });
      }
      // If user exists but not verified, we can resend code or update password
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // Valid for 15 mins

    if (existingUser) {
      existingUser.password = hashedPassword;
      existingUser.verificationCode = verificationCode;
      existingUser.verificationCodeExpiresAt = expiresAt;
      await existingUser.save();
    } else {
      await User.create({
        email,
        password: hashedPassword,
        isVerified: false,
        verificationCode,
        verificationCodeExpiresAt: expiresAt,
        provider: 'credentials',
        role: email === process.env.ADMIN_EMAIL ? 'admin' : 'user'
      });
    }

    // Send email
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER || 'andyz1238@gmail.com',
          pass: process.env.EMAIL_PASS || 'tu-contraseña-de-aplicación-gmail',
        },
      });

      await transporter.sendMail({
        from: `"Diego Ventas" <${process.env.EMAIL_USER || 'andyz1238@gmail.com'}>`,
        to: email,
        subject: 'Código de Verificación - Diego Ventas',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center;">
            <h2 style="color: #3ED5CC;">Verifica tu correo electrónico</h2>
            <p>Gracias por registrarte. Usa el siguiente código de 6 dígitos para verificar tu cuenta:</p>
            <div style="background: #f4f4f4; padding: 15px; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 8px;">
              ${verificationCode}
            </div>
            <p>Este código expira en 15 minutos.</p>
          </div>
        `,
      });
    } catch (mailError) {
      console.error('Error enviando correo:', mailError);
      
      // If the email fails, we should rollback the verificationCode and throw an error
      if (existingUser) {
        existingUser.verificationCode = undefined;
        existingUser.verificationCodeExpiresAt = undefined;
        await existingUser.save();
      } else {
        await User.deleteOne({ email });
      }

      return NextResponse.json({ 
        success: false, 
        error: 'No se pudo enviar el correo de verificación. Por favor verifica las variables EMAIL_USER y EMAIL_PASS en tu servidor.' 
      }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Código de verificación enviado' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
