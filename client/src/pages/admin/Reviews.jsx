import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../services/api.js';
import { Spinner } from '../../components/ui/Spinner.jsx';

export const AdminReviews = () => {
  const [reviews, setReviews] = useState(null);

  const load = () => api.get('/reviews/admin/all').then((res) => setReviews(res.data.data));

  useEffect(() => {
    load();
  }, []);

  const toggleApproved = async (review) => {
    await api.put(`/reviews/${review._id}`, { approved: !review.approved });
    toast.success(review.approved ? 'Review hidden' : 'Review approved');
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this review?')) return;
    await api.delete(`/reviews/${id}`);
    toast.success('Review deleted');
    load();
  };

  if (!reviews) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-ink-900 dark:text-white">Reviews</h1>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-ink-200 text-ink-400 dark:border-ink-800">
            <th className="py-2">Product</th>
            <th className="py-2">Customer</th>
            <th className="py-2">Rating</th>
            <th className="py-2">Comment</th>
            <th className="py-2">Status</th>
            <th className="py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((r) => (
            <tr key={r._id} className="border-b border-ink-100 dark:border-ink-900">
              <td className="py-2">{r.product?.name}</td>
              <td className="py-2">{r.user?.name}</td>
              <td className="py-2">{r.rating}★</td>
              <td className="max-w-xs truncate py-2">{r.comment}</td>
              <td className="py-2">{r.approved ? 'Approved' : 'Hidden'}</td>
              <td className="py-2 text-right">
                <button onClick={() => toggleApproved(r)} className="mr-3 text-brand-600 hover:underline">
                  {r.approved ? 'Hide' : 'Approve'}
                </button>
                <button onClick={() => handleDelete(r._id)} className="text-red-500 hover:underline">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
