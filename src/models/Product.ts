import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  id: string; // We'll keep the string ID for backward compatibility with the old data structure
  name: string;
  description: string;
  price: number;
  icon: string;
  color: string;
  category: 'streaming' | 'ai' | 'music' | 'games';
  details?: string[];
  images?: string[];
}

const ProductSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  icon: { type: String, required: true },
  color: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['streaming', 'ai', 'music', 'games'] 
  },
  details: { type: [String] },
  images: { type: [String] },
}, {
  timestamps: true,
});

// We need to export this way to avoid redefining the model in Next.js fast-refresh development mode
const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
