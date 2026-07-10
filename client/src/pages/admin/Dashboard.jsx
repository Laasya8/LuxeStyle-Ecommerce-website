import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api.js';
import { Spinner } from '../../components/ui/Spinner.jsx';

const StatCard = ({ label, value }) => (
  <div className="rounded-2xl border border-ink-200 bg-white p-5 dark:border-ink-800 dark:bg-ink-950">
    <p className="text-xs font-medium uppercase tracking-wide text-ink-400">{label}</p>
    <p className="mt-2 text-2xl font-semibold text-ink-900 dark:text-white">{value}</p>
  </div>
);

export const AdminDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/dashboard/overview').then((res) => setData(res.data.data));
  }, []);

  if (!data) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-ink-900 dark:text-white">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Revenue" value={`₹${data.totalRevenue.toLocaleString()}`} />
        <StatCard label="Orders" value={data.totalOrders} />
        <StatCard label="Customers" value={data.totalCustomers} />
        <StatCard label="Products" value={data.totalProducts} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-ink-200 bg-white p-5 dark:border-ink-800 dark:bg-ink-950">
          <h2 className="mb-3 font-semibold text-ink-900 dark:text-white">Recent Orders</h2>
          {data.recentOrders.length === 0 ? (
            <p className="text-sm text-ink-500">No orders yet.</p>
          ) : (
            <ul className="space-y-2">
              {data.recentOrders.map((o) => (
                <li key={o._id}>
                  <Link
                    to={`/admin/orders`}
                    className="flex justify-between text-sm hover:text-brand-600"
                  >
                    <span>{o.user?.name || 'Unknown'}</span>
                    <span>₹{o.totalAmount}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-ink-200 bg-white p-5 dark:border-ink-800 dark:bg-ink-950">
          <h2 className="mb-3 font-semibold text-ink-900 dark:text-white">Low Stock</h2>
          {data.lowStockProducts.length === 0 ? (
            <p className="text-sm text-ink-500">All products well stocked.</p>
          ) : (
            <ul className="space-y-2">
              {data.lowStockProducts.map((p) => (
                <li key={p._id} className="flex justify-between text-sm">
                  <span>{p.name}</span>
                  <span className="text-red-500">{p.stock} left</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
