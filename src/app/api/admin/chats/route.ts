import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Chat from '@/models/Chat';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectMongo();
    
    // Get all chats, ordered by recently updated
    const chats = await Chat.find().sort({ updatedAt: -1 });

    return NextResponse.json(chats);
  } catch (error) {
    console.error('Error fetching admin chats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
