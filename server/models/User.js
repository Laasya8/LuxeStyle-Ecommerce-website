import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    label: { type: String, default: 'Home' },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true, default: 'India' },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true, timestamps: true }
);

const cartItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    savedForLater: { type: Boolean, default: false },
  },
  { _id: true, timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    avatar: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    addresses: [addressSchema],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    cart: [cartItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
