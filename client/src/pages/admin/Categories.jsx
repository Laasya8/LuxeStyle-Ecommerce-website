import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../services/api.js';
import { Button } from '../../components/ui/Button.jsx';
import { Spinner } from '../../components/ui/Spinner.jsx';

const EMPTY_FORM = { name: '', description: '', imageUrl: '' };

export const AdminCategories = () => {
  const [categories, setCategories] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => api.get('/categories').then((res) => setCategories(res.data.data));

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setForm({
      name: category.name,
      description: category.description || '',
      imageUrl: category.image?.url || '',
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    await api.delete(`/categories/${id}`);
    toast.success('Category deleted');
    load();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      description: form.description,
      image: form.imageUrl ? { url: form.imageUrl, publicId: form.imageUrl } : undefined,
    };
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, payload);
        toast.success('Category updated');
      } else {
        await api.post('/categories', payload);
        toast.success('Category created');
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
      <h1 className="mb-6 text-2xl font-semibold text-ink-900 dark:text-white">Manage Categories</h1>

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
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
          className="rounded-lg border border-ink-300 px-3 py-2 text-sm dark:border-ink-700 dark:bg-ink-800"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className="rounded-lg border border-ink-300 px-3 py-2 text-sm sm:col-span-2 dark:border-ink-700 dark:bg-ink-800"
        />
        <div className="flex gap-2 sm:col-span-2">
          <Button type="submit" loading={saving} size="sm">
            {editingId ? 'Update Category' : 'Add Category'}
          </Button>
          {editingId && (
            <Button type="button" variant="outline" size="sm" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      {!categories ? (
        <Spinner />
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink-200 text-ink-400 dark:border-ink-800">
              <th className="py-2">Name</th>
              <th className="py-2">Status</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c._id} className="border-b border-ink-100 dark:border-ink-900">
                <td className="py-2">{c.name}</td>
                <td className="py-2">{c.isActive ? 'Active' : 'Inactive'}</td>
                <td className="py-2 text-right">
                  <button onClick={() => handleEdit(c)} className="mr-3 text-brand-600 hover:underline">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(c._id)} className="text-red-500 hover:underline">
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
