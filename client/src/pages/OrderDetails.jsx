import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { Spinner } from '../components/ui/Spinner.jsx';
import { Button } from '../components/ui/Button.jsx';
import { ORDER_STATUS_STYLES } from '../utils/constants.js';

export const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then((res) => setOrder(res.data.data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container-page flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl font-semibold text-ink-900 dark:text-white">Order not found</h1>
        <Button as={Link} to="/orders">
          Back to orders
        </Button>
      </div>
    );
  }

  const { shippingAddress } = order;

  return (
    <div className="container-page py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-ink-900 dark:text-white">
          Order #{order._id.slice(-8).toUpperCase()}
        </h1>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${ORDER_STATUS_STYLES[order.orderStatus]}`}
        >
          {order.orderStatus}
        </span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <h2 className="mb-3 text-sm font-semibold text-ink-900 dark:text-white">Timeline</h2>
          <ol className="mb-8 space-y-2">
            {order.statusHistory.map((h, i) => (
              <li key={i} className="flex items-center gap-3 text-sm">
                <span className="h-2 w-2 rounded-full bg-brand-500" />
                <span className="capitalize text-ink-700 dark:text-ink-300">{h.status}</span>
                <span className="text-xs text-ink-400">
                  {new Date(h.changedAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ol>

          <h2 className="mb-3 text-sm font-semibold text-ink-900 dark:text-white">Items</h2>
          <ul className="divide-y divide-ink-200 dark:divide-ink-800">
            {order.items.map((item) => (
              <li key={item.product} className="flex items-center gap-4 py-3">
                <img src={item.image} alt={item.name} className="h-16 w-14 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink-900 dark:text-white">{item.name}</p>
                  <p className="text-xs text-ink-500">Qty: {item.quantity}</p>
                </div>
                <span className="text-sm">₹{item.price * item.quantity}</span>
              </li>
            ))}
          </ul>
        </div>

        <aside className="h-fit space-y-6">
          <div className="rounded-2xl border border-ink-200 p-6 dark:border-ink-800">
            <h2 className="font-semibold text-ink-900 dark:text-white">Shipping Address</h2>
            <p className="mt-2 text-sm text-ink-600 dark:text-ink-300">
              {shippingAddress.fullName}
              <br />
              {shippingAddress.line1}
              {shippingAddress.line2 && <>, {shippingAddress.line2}</>}
              <br />
              {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
              <br />
              {shippingAddress.country}
              <br />
              {shippingAddress.phone}
            </p>
          </div>

          <div className="rounded-2xl border border-ink-200 p-6 dark:border-ink-800">
            <h2 className="font-semibold text-ink-900 dark:text-white">Payment</h2>
            <div className="mt-2 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-500">Subtotal</span>
                <span>₹{order.itemsPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-500">Shipping</span>
                <span>{order.shippingPrice === 0 ? 'Free' : `₹${order.shippingPrice}`}</span>
              </div>
              <div className="flex justify-between font-semibold text-ink-900 dark:text-white">
                <span>Total</span>
                <span>₹{order.totalAmount}</span>
              </div>
              <p className="pt-2 text-xs text-ink-500">
                {order.paymentMethod} · {order.paymentStatus}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
