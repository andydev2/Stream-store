import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Chat from '@/models/Chat';

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
    }
    
    chat.updatedAt = new Date();
    await chat.save();

    return NextResponse.json(chat);
  } catch (error) {
    console.error('Error updating chat:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
