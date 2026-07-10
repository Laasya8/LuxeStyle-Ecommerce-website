import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../services/api.js';
import { Spinner } from '../../components/ui/Spinner.jsx';
import { ORDER_STATUSES, ORDER_STATUS_STYLES } from '../../utils/constants.js';

export const AdminOrders = () => {
  const [orders, setOrders] = useState(null);

  const load = () => api.get('/orders/admin/all').then((res) => setOrders(res.data.data));

  useEffect(() => {
    load();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      toast.success('Order status updated');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!orders) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-ink-900 dark:text-white">Manage Orders</h1>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-ink-200 text-ink-400 dark:border-ink-800">
            <th className="py-2">Order</th>
            <th className="py-2">Customer</th>
            <th className="py-2">Total</th>
            <th className="py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id} className="border-b border-ink-100 dark:border-ink-900">
              <td className="py-2">#{o._id.slice(-8).toUpperCase()}</td>
              <td className="py-2">{o.user?.name || 'Unknown'}</td>
              <td className="py-2">₹{o.totalAmount}</td>
              <td className="py-2">
                <select
                  value={o.orderStatus}
                  onChange={(e) => handleStatusChange(o._id, e.target.value)}
                  className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${ORDER_STATUS_STYLES[o.orderStatus]}`}
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
