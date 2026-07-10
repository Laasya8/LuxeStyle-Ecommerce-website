import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { Button } from '../components/ui/Button.jsx';

export const Cart = () => {
  const { activeItems, subtotal, updateQuantity, removeItem } = useCart();

  if (activeItems.length === 0) {
    return (
      <div className="container-page flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl font-semibold text-ink-900 dark:text-white">Your cart is empty</h1>
        <p className="text-sm text-ink-500 dark:text-ink-400">
          Browse the shop and items you add will show up here.
        </p>
        <Button as={Link} to="/products">
          Continue shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <h1 className="mb-6 text-2xl font-semibold text-ink-900 dark:text-white">Your Cart</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <ul className="divide-y divide-ink-200 dark:divide-ink-800">
          {activeItems.map((item) => (
            <li key={item.product._id} className="flex items-center gap-4 py-4">
              <img
                src={item.product.images?.[0]?.url}
                alt={item.product.name}
                className="h-20 w-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="font-medium text-ink-900 dark:text-white">{item.product.name}</p>
                <p className="text-sm text-ink-500">₹{item.product.discountPrice || item.product.price}</p>
              </div>
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => updateQuantity(item.product._id, Number(e.target.value))}
                className="w-16 rounded-lg border border-ink-300 px-2 py-1 text-center dark:border-ink-700 dark:bg-ink-800"
              />
              <button
                onClick={() => removeItem(item.product._id)}
                className="text-sm text-ink-400 hover:text-red-500"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <aside className="h-fit rounded-2xl border border-ink-200 p-6 dark:border-ink-800">
          <h2 className="font-semibold text-ink-900 dark:text-white">Order Summary</h2>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-ink-500">Subtotal</span>
            <span className="font-medium">₹{subtotal.toFixed(2)}</span>
          </div>
          <Button as={Link} to="/checkout" className="mt-6 w-full">
            Checkout
          </Button>
        </aside>
      </div>
    </div>
  );
};
