import Brand from '../models/Brand.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { slugify } from '../utils/slugify.js';

export const getBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find({ isActive: true }).sort({ name: 1 });
  res.json(new ApiResponse(200, brands));
});

export const getBrandBySlug = asyncHandler(async (req, res) => {
  const brand = await Brand.findOne({ slug: req.params.slug });
  if (!brand) throw new ApiError(404, 'Brand not found');
  res.json(new ApiResponse(200, brand));
});

export const createBrand = asyncHandler(async (req, res) => {
  const { name, description, logo } = req.body;
  if (!name) throw new ApiError(400, 'name is required');

  const brand = await Brand.create({
    name,
    slug: slugify(name),
    description,
    logo,
  });

  res.status(201).json(new ApiResponse(201, brand, 'Brand created'));
});

export const updateBrand = asyncHandler(async (req, res) => {
  const { name, description, logo, isActive } = req.body;
  const update = { description, logo, isActive };
  if (name) {
    update.name = name;
    update.slug = slugify(name);
  }

  const brand = await Brand.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidators: true,
  });
  if (!brand) throw new ApiError(404, 'Brand not found');

  res.json(new ApiResponse(200, brand, 'Brand updated'));
});

export const deleteBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findByIdAndDelete(req.params.id);
  if (!brand) throw new ApiError(404, 'Brand not found');
  res.json(new ApiResponse(200, null, 'Brand deleted'));
});
