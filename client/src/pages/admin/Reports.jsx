import { useEffect, useState } from 'react';
import { api } from '../../services/api.js';
import { Spinner } from '../../components/ui/Spinner.jsx';

export const AdminReports = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/dashboard/reports').then((res) => setData(res.data.data));
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
      <h1 className="mb-6 text-2xl font-semibold text-ink-900 dark:text-white">Reports</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-ink-200 bg-white p-5 dark:border-ink-800 dark:bg-ink-950">
          <h2 className="mb-3 font-semibold text-ink-900 dark:text-white">Orders by Status</h2>
          <ul className="space-y-2 text-sm">
            {data.ordersByStatus.map((s) => (
              <li key={s._id} className="flex justify-between capitalize">
                <span>{s._id}</span>
                <span>{s.count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-ink-200 bg-white p-5 dark:border-ink-800 dark:bg-ink-950">
          <h2 className="mb-3 font-semibold text-ink-900 dark:text-white">Top Products</h2>
          <ul className="space-y-2 text-sm">
            {data.topProducts.map((p) => (
              <li key={p._id} className="flex justify-between">
                <span>{p.name}</span>
                <span>{p.soldCount} sold</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-ink-200 bg-white p-5 dark:border-ink-800 dark:bg-ink-950">
        <p className="text-sm text-ink-500">Total Revenue</p>
        <p className="text-2xl font-semibold text-ink-900 dark:text-white">
          ₹{data.totalRevenue.toLocaleString()}
        </p>
        <p className="mt-2 text-sm text-ink-500">{data.totalOrders} orders</p>
      </div>
    </div>
  );
};
