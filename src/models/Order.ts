import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  productCategory: {
    type: String,
    default: 'streaming',
  },
  accountId: {
    type: String, // ID of the specific account assigned to this user
    required: true,
  },
  accountUsername: {
    type: String,
    required: true,
  },
  accountPassword: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  paymentId: {
    type: String,
    required: false,
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'paypal', 'transfer'],
    default: 'stripe',
  },
  status: {
    type: String,
    enum: ['completed', 'pending_verification'],
    default: 'completed',
  },
  receiptBase64: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
