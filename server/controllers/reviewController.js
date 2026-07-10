import Review from '../models/Review.js';
import Product from '../models/Product.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const recomputeRating = async (productId) => {
  const reviews = await Review.find({ product: productId, approved: true });
  const count = reviews.length;
  const average = count ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;
  await Product.findByIdAndUpdate(productId, { ratings: { average, count } });
};

export const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId, approved: true })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 });
  res.json(new ApiResponse(200, reviews));
});

export const createReview = asyncHandler(async (req, res) => {
  const { rating, title, comment } = req.body;
  if (!rating || !comment) throw new ApiError(400, 'rating and comment are required');

  const review = await Review.create({
    user: req.user._id,
    product: req.params.productId,
    rating,
    title,
    comment,
  });
  await review.populate('user', 'name avatar');

  const product = await Product.findById(req.params.productId);
  if (product) {
    product.reviews.push(review._id);
    await product.save();
  }
  await recomputeRating(req.params.productId);

  res.status(201).json(new ApiResponse(201, review, 'Review submitted'));
});

export const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new ApiError(404, 'Review not found');
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to edit this review');
  }

  const { rating, title, comment, approved } = req.body;
  if (rating !== undefined) review.rating = rating;
  if (title !== undefined) review.title = title;
  if (comment !== undefined) review.comment = comment;
  if (approved !== undefined && req.user.role === 'admin') review.approved = approved;

  await review.save();
  await recomputeRating(review.product);

  res.json(new ApiResponse(200, review, 'Review updated'));
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new ApiError(404, 'Review not found');
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to delete this review');
  }

  await review.deleteOne();
  await Product.findByIdAndUpdate(review.product, { $pull: { reviews: review._id } });
  await recomputeRating(review.product);

  res.json(new ApiResponse(200, null, 'Review deleted'));
});

export const getAllReviewsAdmin = asyncHandler(async (req, res) => {
  const reviews = await Review.find()
    .populate('user', 'name email')
    .populate('product', 'name slug')
    .sort({ createdAt: -1 });
  res.json(new ApiResponse(200, reviews));
});
