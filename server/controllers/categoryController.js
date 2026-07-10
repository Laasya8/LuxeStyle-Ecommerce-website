import Category from '../models/Category.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { slugify } from '../utils/slugify.js';

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ name: 1 });
  res.json(new ApiResponse(200, categories));
});

export const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });
  if (!category) throw new ApiError(404, 'Category not found');
  res.json(new ApiResponse(200, category));
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name, description, image, featured } = req.body;
  if (!name) throw new ApiError(400, 'name is required');

  const category = await Category.create({
    name,
    slug: slugify(name),
    description,
    image,
    featured,
  });

  res.status(201).json(new ApiResponse(201, category, 'Category created'));
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { name, description, image, featured, isActive } = req.body;
  const update = { description, image, featured, isActive };
  if (name) {
    update.name = name;
    update.slug = slugify(name);
  }

  const category = await Category.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidators: true,
  });
  if (!category) throw new ApiError(404, 'Category not found');

  res.json(new ApiResponse(200, category, 'Category updated'));
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw new ApiError(404, 'Category not found');
  res.json(new ApiResponse(200, null, 'Category deleted'));
});
