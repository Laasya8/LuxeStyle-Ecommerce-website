import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true, default: 'India' },
  },
  { _id: false }
);

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [orderItemSchema], validate: (v) => v.length > 0 },
    shippingAddress: { type: shippingAddressSchema, required: true },
    paymentMethod: { type: String, enum: ['COD'], default: 'COD' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    orderStatus: { type: String, enum: ORDER_STATUSES, default: 'pending' },
    statusHistory: [
      {
        status: { type: String, enum: ORDER_STATUSES },
        changedAt: { type: Date, default: Date.now },
      },
    ],
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true, default: 0 },
    totalAmount: { type: Number, required: true },
    deliveredAt: { type: Date },
    cancelledAt: { type: Date },
  },
  { timestamps: true }
);

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });

export const ORDER_STATUS_VALUES = ORDER_STATUSES;
export default mongoose.model('Order', orderSchema);
