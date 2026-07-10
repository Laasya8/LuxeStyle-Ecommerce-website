import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { Spinner } from '../components/ui/Spinner.jsx';
import { Button } from '../components/ui/Button.jsx';
import { ORDER_STATUS_STYLES } from '../utils/constants.js';

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/orders')
      .then((res) => setOrders(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container-page flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl font-semibold text-ink-900 dark:text-white">No orders yet</h1>
        <Button as={Link} to="/products">
          Start shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <h1 className="mb-6 text-2xl font-semibold text-ink-900 dark:text-white">My Orders</h1>
      <ul className="space-y-4">
        {orders.map((order) => (
          <li key={order._id}>
            <Link
              to={`/orders/${order._id}`}
              className="flex items-center justify-between rounded-2xl border border-ink-200 p-4 transition hover:border-ink-400 dark:border-ink-800 dark:hover:border-ink-600"
            >
              <div>
                <p className="text-sm font-medium text-ink-900 dark:text-white">
                  Order #{order._id.slice(-8).toUpperCase()}
                </p>
                <p className="text-xs text-ink-500">
                  {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} item(s)
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold">₹{order.totalAmount}</span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${ORDER_STATUS_STYLES[order.orderStatus]}`}
                >
                  {order.orderStatus}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
