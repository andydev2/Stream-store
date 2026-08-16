import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string; // Optional because Google users might not have a password
  isVerified: boolean;
  verificationCode?: string;
  verificationCodeExpiresAt?: Date;
  provider: 'credentials' | 'google';
  role: 'user' | 'admin';
}

const CartItemSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  nameEn: { type: String },
  description: { type: String },
  price: { type: Number, required: true },
  icon: { type: String },
  color: { type: String },
  quantity: { type: Number, default: 1 },
  details: [{ type: String }],
  images: [{ type: String }],
}, { _id: false });

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String },
  verificationCodeExpiresAt: { type: Date },
  provider: { type: String, enum: ['credentials', 'google'], default: 'credentials' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  cart: { type: [CartItemSchema], default: [] },
}, {
  timestamps: true,
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
