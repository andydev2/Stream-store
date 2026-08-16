import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Chat from '@/models/Chat';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const productId = searchParams.get('productId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    await connectMongo();

    const query: any = { sessionId };
    if (productId) {
      query.productId = productId;
    }

    // Get the most recent chat for this session/product
    const chat = await Chat.findOne(query).sort({ createdAt: -1 });

    return NextResponse.json(chat || null);
  } catch (error) {
    console.error('Error fetching chat:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { sessionId, productId, productName, text, userEmail } = await request.json();

    if (!sessionId || !productId || !text) {
      return NextResponse.json({ success: false, error: 'Faltan datos' }, { status: 400 });
    }

    await connectMongo();

    // Find if there's an open chat for this session (and product if specified)
    const query: any = { sessionId, status: 'open' };
    if (productId) {
      query.productId = productId;
    }

    let chat = await Chat.findOne(query).sort({ createdAt: -1 });

    if (!chat) {
      if (!productId) {
        return NextResponse.json({ error: 'Product ID is required for a new chat' }, { status: 400 });
      }
      
      // Create new chat
      chat = await Chat.create({
        sessionId,
        productId,
        productName,
        userEmail,
        messages: [{ sender: 'user', text }]
      });
    } else {
      // Add message to existing chat
      chat.messages.push({ sender: 'user', text });
      chat.updatedAt = new Date();
    }

    await chat.save();
    return NextResponse.json(chat);
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
