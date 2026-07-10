import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { api } from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';
import { Button } from '../components/ui/Button.jsx';

const FIELDS = [
  { name: 'fullName', label: 'Full Name' },
  { name: 'phone', label: 'Phone' },
  { name: 'line1', label: 'Address Line 1' },
  { name: 'line2', label: 'Address Line 2 (optional)', optional: true },
  { name: 'city', label: 'City' },
  { name: 'state', label: 'State' },
  { name: 'postalCode', label: 'Postal Code' },
];

export const Checkout = () => {
  const { activeItems, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { country: 'India' } });

  if (activeItems.length === 0) {
    return (
      <div className="container-page flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl font-semibold text-ink-900 dark:text-white">Your cart is empty</h1>
        <Button as={Link} to="/products">
          Continue shopping
        </Button>
      </div>
    );
  }

  const shippingPrice = subtotal >= 2000 ? 0 : 99;

  const onSubmit = async (shippingAddress) => {
    setPlacing(true);
    try {
      const items = activeItems.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
      }));
      const res = await api.post('/orders', { items, shippingAddress });
      clearCart();
      toast.success('Order placed!');
      navigate(`/orders/${res.data.data._id}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="container-page py-10">
      <h1 className="mb-6 text-2xl font-semibold text-ink-900 dark:text-white">Checkout</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {FIELDS.map((field) => (
            <div key={field.name}>
              <label className="mb-1 block text-sm font-medium text-ink-700 dark:text-ink-300">
                {field.label}
              </label>
              <input
                {...register(field.name, { required: !field.optional })}
                className="w-full rounded-lg border border-ink-300 px-3 py-2 text-sm dark:border-ink-700 dark:bg-ink-800"
              />
              {errors[field.name] && (
                <p className="mt-1 text-xs text-red-500">This field is required</p>
              )}
            </div>
          ))}
          <Button type="submit" loading={placing} className="w-full">
            Place Order (Cash on Delivery)
          </Button>
        </form>

        <aside className="h-fit rounded-2xl border border-ink-200 p-6 dark:border-ink-800">
          <h2 className="font-semibold text-ink-900 dark:text-white">Order Summary</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {activeItems.map((item) => (
              <li key={item.product._id} className="flex justify-between">
                <span className="text-ink-600 dark:text-ink-300">
                  {item.product.name} × {item.quantity}
                </span>
                <span>₹{(item.product.discountPrice || item.product.price) * item.quantity}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 border-t border-ink-200 pt-4 text-sm dark:border-ink-800">
            <div className="flex justify-between">
              <span className="text-ink-500">Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-500">Shipping</span>
              <span>{shippingPrice === 0 ? 'Free' : `₹${shippingPrice}`}</span>
            </div>
            <div className="flex justify-between font-semibold text-ink-900 dark:text-white">
              <span>Total</span>
              <span>₹{(subtotal + shippingPrice).toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
