import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../services/api.js';
import { Button } from '../../components/ui/Button.jsx';
import { Spinner } from '../../components/ui/Spinner.jsx';

const EMPTY_FORM = { name: '', description: '', logoUrl: '' };

export const AdminBrands = () => {
  const [brands, setBrands] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => api.get('/brands').then((res) => setBrands(res.data.data));

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const handleEdit = (brand) => {
    setEditingId(brand._id);
    setForm({
      name: brand.name,
      description: brand.description || '',
      logoUrl: brand.logo?.url || '',
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this brand?')) return;
    await api.delete(`/brands/${id}`);
    toast.success('Brand deleted');
    load();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      description: form.description,
      logo: form.logoUrl ? { url: form.logoUrl, publicId: form.logoUrl } : undefined,
    };
    try {
      if (editingId) {
        await api.put(`/brands/${editingId}`, payload);
        toast.success('Brand updated');
      } else {
        await api.post('/brands', payload);
        toast.success('Brand created');
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
      <h1 className="mb-6 text-2xl font-semibold text-ink-900 dark:text-white">Manage Brands</h1>

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
          placeholder="Logo URL"
          value={form.logoUrl}
          onChange={(e) => setForm((f) => ({ ...f, logoUrl: e.target.value }))}
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
            {editingId ? 'Update Brand' : 'Add Brand'}
          </Button>
          {editingId && (
            <Button type="button" variant="outline" size="sm" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      {!brands ? (
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
            {brands.map((b) => (
              <tr key={b._id} className="border-b border-ink-100 dark:border-ink-900">
                <td className="py-2">{b.name}</td>
                <td className="py-2">{b.isActive ? 'Active' : 'Inactive'}</td>
                <td className="py-2 text-right">
                  <button onClick={() => handleEdit(b)} className="mr-3 text-brand-600 hover:underline">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(b._id)} className="text-red-500 hover:underline">
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
