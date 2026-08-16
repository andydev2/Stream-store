import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Chat from '@/models/Chat';
import nodemailer from 'nodemailer';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { text, action } = await request.json();
    const params = await context.params;
    const chatId = params.id;

    if (!chatId) {
      return NextResponse.json({ error: 'Chat ID is required' }, { status: 400 });
    }

    await connectMongo();
    
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    if (action === 'close') {
      chat.status = 'closed';
    } else if (text) {
      chat.messages.push({ sender: 'admin', text });
      
      // Enviar correo al usuario si hay un email guardado y hay configuración SMTP
      if (chat.userEmail && process.env.SMTP_HOST && process.env.SMTP_USER) {
        try {
          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 465,
            secure: Number(process.env.SMTP_PORT) === 465,
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          });

            const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://tu-dominio.com';
            const logoUrl = `${appUrl}/logo.svg`;

            await transporter.sendMail({
              from: process.env.SMTP_FROM || `"Soporte" <${process.env.SMTP_USER}>`,
              to: chat.userEmail,
              subject: `Respuesta a tu solicitud: ${chat.productName || 'Soporte'}`,
              html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                  <div style="background: #1C5F5C; color: white; padding: 20px; text-align: center;">
                    <img src="${logoUrl}" alt="Logo" style="height: 40px; margin-bottom: 10px;" onerror="this.style.display='none'" />
                    <h2 style="margin: 0; font-size: 20px;">Tienes un nuevo mensaje de soporte</h2>
                  </div>
                  <div style="padding: 30px; background: #ffffff; color: #333333;">
                  <p style="font-size: 16px;">Hola,</p>
                  <p style="font-size: 16px;">Un administrador ha respondido a tu solicitud sobre <strong>${chat.productName || 'el producto'}</strong>.</p>
                  
                  <div style="background: #f1f5f9; border-left: 4px solid #3ED5CC; padding: 15px; margin: 25px 0; border-radius: 4px;">
                    <p style="margin: 0; font-size: 16px; font-style: italic;">"${text}"</p>
                  </div>
                  
                  <p style="font-size: 16px;">Entra a la página web para continuar con el chat y recibir tu recarga.</p>
                  
                  <div style="text-align: center; margin-top: 35px;">
                    <a href="${appUrl}" style="background: #3ED5CC; color: #1C5F5C; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 16px; display: inline-block;">Ir al chat</a>
                  </div>
                </div>
              </div>
            `
          });
          console.log(`Correo de notificación enviado a ${chat.userEmail}`);
        } catch (mailError) {
          console.error('Error enviando correo:', mailError);
        }
      }
    }
    
    chat.updatedAt = new Date();
    await chat.save();

    return NextResponse.json(chat);
  } catch (error) {
    console.error('Error updating chat:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const chatId = params.id;

    if (!chatId) {
      return NextResponse.json({ error: 'Chat ID is required' }, { status: 400 });
    }

    await connectMongo();
    
    const chat = await Chat.findByIdAndDelete(chatId);
    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting chat:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
