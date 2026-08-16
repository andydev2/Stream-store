import mongoose, { Schema, Document, Model } from 'mongoose';

interface IAccount {
  credentials: string;
  isSold: boolean;
}

interface IProduct extends Document {
  id: string; // We'll keep the string ID for backward compatibility with the old data structure
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  price: number;
  icon: string;
  color: string;
  category: 'streaming' | 'ai' | 'music' | 'games' | 'free_fire' | 'recharges';
  details?: string[];
  detailsEn?: string[];
  images?: string[];
  accounts?: IAccount[];
}

const AccountSchema: Schema = new Schema({
  credentials: { type: String, required: true },
  isSold: { type: Boolean, default: false }
}, { _id: true, timestamps: true });

const ProductSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  nameEn: { type: String },
  description: { type: String, required: true },
  descriptionEn: { type: String },
  price: { type: Number, required: true },
  icon: { type: String },
  color: { type: String, default: '#000000' },
  category: { 
    type: String, 
    required: true, 
    enum: ['streaming', 'ai', 'music', 'games', 'free_fire', 'recharges'] 
  },
  details: { type: [String] },
  detailsEn: { type: [String] },
  images: { type: [String] },
  accounts: { type: [AccountSchema], default: [] },
}, {
  timestamps: true,
});

// We need to export this way to avoid redefining the model in Next.js fast-refresh development mode
const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
