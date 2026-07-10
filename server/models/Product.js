import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    images: { type: [imageSchema], validate: (v) => v.length > 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
    sizes: [{ type: String }],
    colors: [{ type: String }],
    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    soldCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ soldCount: -1 });

productSchema.virtual('discountPercent').get(function () {
  if (!this.discountPrice || this.discountPrice >= this.price) return 0;
  return Math.round(((this.price - this.discountPrice) / this.price) * 100);
});

productSchema.virtual('inStock').get(function () {
  return this.stock > 0;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

export default mongoose.model('Product', productSchema);
