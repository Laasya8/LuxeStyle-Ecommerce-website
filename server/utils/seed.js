import 'dotenv/config';
import mongoose from 'mongoose';
import Category from '../models/Category.js';
import Brand from '../models/Brand.js';
import Product from '../models/Product.js';
import { slugify } from './slugify.js';

const img = (seed, w = 800, h = 1000) => ({
  url: `https://picsum.photos/seed/${seed}/${w}/${h}`,
  publicId: seed,
});

const unsplash = (photoId) => ({
  url: `https://images.unsplash.com/photo-${photoId}?w=800&h=1000&fit=crop`,
  publicId: photoId,
});

const PRODUCT_PHOTOS = {
  'Classic Oxford Shirt': '1596755094514-f87e34085b2c',
  'Relaxed Fit Tee': '1521572163474-6864f9cf17ab',
  'Wool Blend Overcoat': '1591047139829-d91aecb6caea',
  'Silk Wrap Dress': '1595777457583-95e059d581b8',
  'Tailored Blazer': '1594938298603-c8148c4dae35',
  'Cashmere Knit Sweater': '1434389677669-e08b4cac3105',
  'Runner Sneakers': '1600185365483-26d7a4cc7519',
  'Leather Chelsea Boots': '1608256246200-53e635b5b65f',
  'Canvas Slip-Ons': '1595950653106-6c9ebd614d3a',
  'Structured Tote Bag': '1584917865442-de89df76afd3',
  'Minimalist Analog Watch': '1523275335684-37898b6baf30',
  'Full-Grain Leather Belt': '1624222247344-550fb60583dc',
};

const CATEGORIES = [
  { name: "Men's Clothing", description: 'Shirts, tees, jackets and more for men.' },
  { name: "Women's Clothing", description: 'Dresses, tops and outerwear for women.' },
  { name: 'Footwear', description: 'Sneakers, boots and sandals.' },
  { name: 'Accessories', description: 'Bags, belts, watches and more.' },
];

const BRANDS = [
  { name: 'Luxe Basics', description: 'Everyday essentials, elevated.' },
  { name: 'Aria Studio', description: 'Contemporary womenswear.' },
  { name: 'Northline', description: 'Performance footwear.' },
  { name: 'Velora', description: 'Premium accessories.' },
];

const PRODUCTS = [
  {
    name: 'Classic Oxford Shirt',
    category: "Men's Clothing",
    brand: 'Luxe Basics',
    price: 2499,
    discountPrice: 1999,
    stock: 40,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Sky Blue'],
    featured: true,
    trending: true,
    description: 'A tailored cotton oxford shirt built for both the office and evenings out.',
  },
  {
    name: 'Relaxed Fit Tee',
    category: "Men's Clothing",
    brand: 'Luxe Basics',
    price: 899,
    stock: 100,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Grey', 'Navy'],
    trending: true,
    description: 'Soft, breathable cotton tee with a relaxed everyday fit.',
  },
  {
    name: 'Wool Blend Overcoat',
    category: "Men's Clothing",
    brand: 'Northline',
    price: 7999,
    discountPrice: 6499,
    stock: 15,
    sizes: ['M', 'L', 'XL'],
    colors: ['Charcoal'],
    featured: true,
    description: 'A structured wool-blend overcoat for cold-weather layering.',
  },
  {
    name: 'Silk Wrap Dress',
    category: "Women's Clothing",
    brand: 'Aria Studio',
    price: 4599,
    stock: 25,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Emerald', 'Black'],
    featured: true,
    trending: true,
    description: 'A fluid silk wrap dress that transitions effortlessly from day to night.',
  },
  {
    name: 'Tailored Blazer',
    category: "Women's Clothing",
    brand: 'Aria Studio',
    price: 5299,
    discountPrice: 4299,
    stock: 20,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Beige', 'Black'],
    description: 'A sharply tailored blazer that anchors any outfit.',
  },
  {
    name: 'Cashmere Knit Sweater',
    category: "Women's Clothing",
    brand: 'Luxe Basics',
    price: 3899,
    stock: 30,
    sizes: ['S', 'M', 'L'],
    colors: ['Cream', 'Rose'],
    trending: true,
    description: 'A cloud-soft cashmere sweater for everyday warmth and comfort.',
  },
  {
    name: 'Runner Sneakers',
    category: 'Footwear',
    brand: 'Northline',
    price: 4999,
    discountPrice: 3999,
    stock: 60,
    sizes: ['UK6', 'UK7', 'UK8', 'UK9', 'UK10'],
    colors: ['White', 'Black'],
    featured: true,
    trending: true,
    description: 'Lightweight everyday sneakers with responsive cushioning.',
  },
  {
    name: 'Leather Chelsea Boots',
    category: 'Footwear',
    brand: 'Northline',
    price: 6499,
    stock: 25,
    sizes: ['UK7', 'UK8', 'UK9', 'UK10'],
    colors: ['Tan', 'Black'],
    description: 'Handcrafted leather Chelsea boots for a polished finish.',
  },
  {
    name: 'Canvas Slip-Ons',
    category: 'Footwear',
    brand: 'Luxe Basics',
    price: 1799,
    stock: 50,
    sizes: ['UK6', 'UK7', 'UK8', 'UK9'],
    colors: ['Navy', 'Grey'],
    description: 'Easy slip-on canvas shoes for warm-weather days.',
  },
  {
    name: 'Structured Tote Bag',
    category: 'Accessories',
    brand: 'Velora',
    price: 3299,
    discountPrice: 2799,
    stock: 35,
    colors: ['Tan', 'Black'],
    featured: true,
    description: 'A structured leather tote with room for a laptop and daily essentials.',
  },
  {
    name: 'Minimalist Analog Watch',
    category: 'Accessories',
    brand: 'Velora',
    price: 5999,
    stock: 20,
    colors: ['Silver', 'Rose Gold'],
    trending: true,
    description: 'A clean-faced analog watch with a genuine leather strap.',
  },
  {
    name: 'Full-Grain Leather Belt',
    category: 'Accessories',
    brand: 'Velora',
    price: 1499,
    stock: 45,
    colors: ['Brown', 'Black'],
    description: 'A durable full-grain leather belt with a brushed steel buckle.',
  },
];

const run = async () => {
  if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('<username>')) {
    console.error('[seed] MONGODB_URI is not set in server/.env — aborting.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log(`[seed] Connected: ${mongoose.connection.host}`);

  await Promise.all([Category.deleteMany({}), Brand.deleteMany({}), Product.deleteMany({})]);
  console.log('[seed] Cleared existing categories, brands, and products.');

  const categoryDocs = await Category.insertMany(
    CATEGORIES.map((c) => ({ ...c, slug: slugify(c.name), image: img(`cat-${slugify(c.name)}`) }))
  );
  const categoryByName = Object.fromEntries(categoryDocs.map((c) => [c.name, c]));

  const brandDocs = await Brand.insertMany(
    BRANDS.map((b) => ({ ...b, slug: slugify(b.name), logo: img(`brand-${slugify(b.name)}`, 200, 200) }))
  );
  const brandByName = Object.fromEntries(brandDocs.map((b) => [b.name, b]));

  const productDocs = PRODUCTS.map((p, i) => ({
    ...p,
    slug: slugify(p.name),
    sku: `LX-${String(i + 1).padStart(4, '0')}`,
    category: categoryByName[p.category]._id,
    brand: brandByName[p.brand]._id,
    images: [unsplash(PRODUCT_PHOTOS[p.name])],
  }));
  await Product.insertMany(productDocs);

  console.log(
    `[seed] Inserted ${categoryDocs.length} categories, ${brandDocs.length} brands, ${productDocs.length} products.`
  );
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error('[seed] Failed:', err);
  process.exit(1);
});
