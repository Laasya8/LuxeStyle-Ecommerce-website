import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../services/api.js';
import { Spinner } from '../../components/ui/Spinner.jsx';

export const AdminInventory = () => {
  const [products, setProducts] = useState(null);

  const load = () =>
    api.get('/products', { params: { limit: 100 } }).then((res) => setProducts(res.data.data.products));

  useEffect(() => {
    load();
  }, []);

  const updateStock = async (id, stock) => {
    try {
      await api.put(`/products/${id}`, { stock: Number(stock) });
      toast.success('Stock updated');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!products) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-ink-900 dark:text-white">Inventory</h1>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-ink-200 text-ink-400 dark:border-ink-800">
            <th className="py-2">Product</th>
            <th className="py-2">SKU</th>
            <th className="py-2">Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-b border-ink-100 dark:border-ink-900">
              <td className="py-2">{p.name}</td>
              <td className="py-2">{p.sku}</td>
              <td className="py-2">
                <input
                  type="number"
                  min={0}
                  defaultValue={p.stock}
                  onBlur={(e) => {
                    if (Number(e.target.value) !== p.stock) updateStock(p._id, e.target.value);
                  }}
                  className={`w-20 rounded-lg border px-2 py-1 text-sm dark:bg-ink-800 ${
                    p.stock <= 5 ? 'border-red-400 text-red-600' : 'border-ink-300 dark:border-ink-700'
                  }`}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
