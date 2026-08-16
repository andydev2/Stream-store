import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage {
  _id?: string;
  sender: 'user' | 'admin';
  text: string;
  createdAt?: Date;
}

export interface IChat extends Document {
  sessionId: string;
  productId: string;
  productName?: string;
  userEmail?: string;
  userName?: string;
  status: 'open' | 'closed';
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema({
  sender: { type: String, enum: ['user', 'admin'], required: true },
  text: { type: String, required: true },
}, { timestamps: true });

const ChatSchema = new Schema({
  sessionId: { type: String, required: true },
  productId: { type: String, required: true },
  productName: { type: String },
  userEmail: { type: String },
  userName: { type: String },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  messages: { type: [MessageSchema], default: [] }
}, {
  timestamps: true,
});

// Index to quickly find chats by session
ChatSchema.index({ sessionId: 1 });

const Chat: Model<IChat> = mongoose.models.Chat || mongoose.model<IChat>('Chat', ChatSchema);

export default Chat;
