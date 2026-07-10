import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getOverview = asyncHandler(async (req, res) => {
  const [totalOrders, totalCustomers, totalProducts, revenueAgg, recentOrders, lowStockProducts] =
    await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Product.countDocuments(),
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email'),
      Product.find({ stock: { $lte: 5 }, isActive: true }).select('name stock sku').limit(5),
    ]);

  res.json(
    new ApiResponse(200, {
      totalOrders,
      totalCustomers,
      totalProducts,
      totalRevenue: revenueAgg[0]?.total || 0,
      recentOrders,
      lowStockProducts,
    })
  );
});

export const getCustomers = asyncHandler(async (req, res) => {
  const customers = await User.find({ role: 'user' }).sort({ createdAt: -1 });
  res.json(new ApiResponse(200, customers));
});

export const getReports = asyncHandler(async (req, res) => {
  const [ordersByStatus, topProducts, revenueAgg] = await Promise.all([
    Order.aggregate([{ $group: { _id: '$orderStatus', count: { $sum: 1 } } }]),
    Product.find().sort({ soldCount: -1 }).select('name soldCount stock').limit(5),
    Order.aggregate([
      { $match: { orderStatus: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' }, orders: { $sum: 1 } } },
    ]),
  ]);

  res.json(
    new ApiResponse(200, {
      ordersByStatus,
      topProducts,
      totalRevenue: revenueAgg[0]?.total || 0,
      totalOrders: revenueAgg[0]?.orders || 0,
    })
  );
});
