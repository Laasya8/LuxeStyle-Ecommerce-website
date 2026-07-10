import Product from '../models/Product.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { slugify } from '../utils/slugify.js';

const SORT_OPTIONS = {
  newest: { createdAt: -1 },
  'price-asc': { price: 1 },
  'price-desc': { price: -1 },
  popular: { soldCount: -1 },
  rating: { 'ratings.average': -1 },
};

export const getProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 12,
    category,
    brand,
    minPrice,
    maxPrice,
    search,
    featured,
    trending,
    sort = 'newest',
  } = req.query;

  const filter = { isActive: true };
  if (category) filter.category = category;
  if (brand) filter.brand = brand;
  if (featured) filter.featured = featured === 'true';
  if (trending) filter.trending = trending === 'true';
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (search) filter.$text = { $search: search };

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit)));

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .populate('brand', 'name slug')
      .sort(SORT_OPTIONS[sort] || SORT_OPTIONS.newest)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Product.countDocuments(filter),
  ]);

  res.json(
    new ApiResponse(200, {
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    })
  );
});

export const searchProducts = asyncHandler(async (req, res) => {
  const { q = '' } = req.query;
  if (!q.trim()) return res.json(new ApiResponse(200, []));

  const products = await Product.find({
    isActive: true,
    name: { $regex: q, $options: 'i' },
  })
    .select('name slug images price discountPrice')
    .limit(8);

  res.json(new ApiResponse(200, products));
});

export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true })
    .populate('category', 'name slug')
    .populate('brand', 'name slug')
    .populate({ path: 'reviews', populate: { path: 'user', select: 'name avatar' } });

  if (!product) throw new ApiError(404, 'Product not found');

  res.json(new ApiResponse(200, product));
});

export const createProduct = asyncHandler(async (req, res) => {
  const { name, sku, ...rest } = req.body;
  if (!name) throw new ApiError(400, 'name is required');
  if (!sku) throw new ApiError(400, 'sku is required');

  const product = await Product.create({
    ...rest,
    name,
    sku,
    slug: slugify(name),
  });

  res.status(201).json(new ApiResponse(201, product, 'Product created'));
});

export const updateProduct = asyncHandler(async (req, res) => {
  const update = { ...req.body };
  if (update.name) update.slug = slugify(update.name);

  const product = await Product.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidators: true,
  });
  if (!product) throw new ApiError(404, 'Product not found');

  res.json(new ApiResponse(200, product, 'Product updated'));
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  res.json(new ApiResponse(200, null, 'Product deleted'));
});
