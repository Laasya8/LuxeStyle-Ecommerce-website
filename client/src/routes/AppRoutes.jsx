import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout.jsx';
import { AdminLayout } from '../layouts/AdminLayout.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { AdminRoute } from './AdminRoute.jsx';

import { Home } from '../pages/Home.jsx';
import { Products } from '../pages/Products.jsx';
import { ProductDetails } from '../pages/ProductDetails.jsx';
import { Cart } from '../pages/Cart.jsx';
import { Wishlist } from '../pages/Wishlist.jsx';
import { Checkout } from '../pages/Checkout.jsx';
import { Orders } from '../pages/Orders.jsx';
import { OrderDetails } from '../pages/OrderDetails.jsx';
import { Profile } from '../pages/Profile.jsx';
import { NotFound } from '../pages/NotFound.jsx';

import { AdminDashboard } from '../pages/admin/Dashboard.jsx';
import { AdminProducts } from '../pages/admin/Products.jsx';
import { AdminCategories } from '../pages/admin/Categories.jsx';
import { AdminBrands } from '../pages/admin/Brands.jsx';
import { AdminOrders } from '../pages/admin/Orders.jsx';
import { AdminCustomers } from '../pages/admin/Customers.jsx';
import { AdminReviews } from '../pages/admin/Reviews.jsx';
import { AdminInventory } from '../pages/admin/Inventory.jsx';
import { AdminReports } from '../pages/admin/Reports.jsx';

export const AppRoutes = () => (
  <Routes>
    <Route element={<MainLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:slug" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/wishlist" element={<Wishlist />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Route>

    <Route element={<AdminRoute />}>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="brands" element={<AdminBrands />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="inventory" element={<AdminInventory />} />
        <Route path="reports" element={<AdminReports />} />
      </Route>
    </Route>
  </Routes>
);
