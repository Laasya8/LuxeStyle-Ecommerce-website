import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../services/api.js';
import { Button } from '../../components/ui/Button.jsx';
import { Spinner } from '../../components/ui/Spinner.jsx';

const EMPTY_FORM = {
  name: '',
  description: '',
  category: '',
  brand: '',
  price: '',
  discountPrice: '',
  stock: '',
  sku: '',
  sizes: '',
  colors: '',
  imageUrl: '',
};

export const AdminProducts = () => {
  const [products, setProducts] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () =>
    api.get('/products', { params: { limit: 100 } }).then((res) => setProducts(res.data.data.products));

  useEffect(() => {
    load();
    api.get('/categories').then((res) => setCategories(res.data.data));
    api.get('/brands').then((res) => setBrands(res.data.data));
  }, []);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      category: product.category?._id || '',
      brand: product.brand?._id || '',
      price: product.price,
      discountPrice: product.discountPrice || '',
      stock: product.stock,
      sku: product.sku,
      sizes: (product.sizes || []).join(', '),
      colors: (product.colors || []).join(', '),
      imageUrl: product.images?.[0]?.url || '',
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    toast.success('Product deleted');
    load();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      description: form.description,
      category: form.category,
      brand: form.brand,
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
      stock: Number(form.stock),
      sku: form.sku,
      sizes: form.sizes ? form.sizes.split(',').map((s) => s.trim()).filter(Boolean) : [],
      colors: form.colors ? form.colors.split(',').map((c) => c.trim()).filter(Boolean) : [],
      images: form.imageUrl ? [{ url: form.imageUrl, publicId: form.imageUrl }] : undefined,
    };
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        toast.success('Product updated');
      } else {
        await api.post('/products', payload);
        toast.success('Product created');
      }
      resetForm();
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-ink-900 dark:text-white">Manage Products</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 grid gap-3 rounded-2xl border border-ink-200 bg-white p-5 sm:grid-cols-2 dark:border-ink-800 dark:bg-ink-950"
      >
        <input
          required
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="rounded-lg border border-ink-300 px-3 py-2 text-sm dark:border-ink-700 dark:bg-ink-800"
        />
        <input
          required
          placeholder="SKU"
          value={form.sku}
          onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
          className="rounded-lg border border-ink-300 px-3 py-2 text-sm dark:border-ink-700 dark:bg-ink-800"
        />
        <select
          required
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          className="rounded-lg border border-ink-300 px-3 py-2 text-sm dark:border-ink-700 dark:bg-ink-800"
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          required
          value={form.brand}
          onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
          className="rounded-lg border border-ink-300 px-3 py-2 text-sm dark:border-ink-700 dark:bg-ink-800"
        >
          <option value="">Select brand</option>
          {brands.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>
        <input
          required
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
          className="rounded-lg border border-ink-300 px-3 py-2 text-sm dark:border-ink-700 dark:bg-ink-800"
        />
        <input
          type="number"
          placeholder="Discount price (optional)"
          value={form.discountPrice}
          onChange={(e) => setForm((f) => ({ ...f, discountPrice: e.target.value }))}
          className="rounded-lg border border-ink-300 px-3 py-2 text-sm dark:border-ink-700 dark:bg-ink-800"
        />
        <input
          required
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
          className="rounded-lg border border-ink-300 px-3 py-2 text-sm dark:border-ink-700 dark:bg-ink-800"
        />
        <input
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
          className="rounded-lg border border-ink-300 px-3 py-2 text-sm dark:border-ink-700 dark:bg-ink-800"
        />
        <input
          placeholder="Sizes (comma separated)"
          value={form.sizes}
          onChange={(e) => setForm((f) => ({ ...f, sizes: e.target.value }))}
          className="rounded-lg border border-ink-300 px-3 py-2 text-sm dark:border-ink-700 dark:bg-ink-800"
        />
        <input
          placeholder="Colors (comma separated)"
          value={form.colors}
          onChange={(e) => setForm((f) => ({ ...f, colors: e.target.value }))}
          className="rounded-lg border border-ink-300 px-3 py-2 text-sm dark:border-ink-700 dark:bg-ink-800"
        />
        <textarea
          required
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className="rounded-lg border border-ink-300 px-3 py-2 text-sm sm:col-span-2 dark:border-ink-700 dark:bg-ink-800"
        />
        <div className="flex gap-2 sm:col-span-2">
          <Button type="submit" loading={saving} size="sm">
            {editingId ? 'Update Product' : 'Add Product'}
          </Button>
          {editingId && (
            <Button type="button" variant="outline" size="sm" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      {!products ? (
        <Spinner />
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink-200 text-ink-400 dark:border-ink-800">
              <th className="py-2">Name</th>
              <th className="py-2">SKU</th>
              <th className="py-2">Price</th>
              <th className="py-2">Stock</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b border-ink-100 dark:border-ink-900">
                <td className="py-2">{p.name}</td>
                <td className="py-2">{p.sku}</td>
                <td className="py-2">₹{p.price}</td>
                <td className="py-2">{p.stock}</td>
                <td className="py-2 text-right">
                  <button onClick={() => handleEdit(p)} className="mr-3 text-brand-600 hover:underline">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
