import { useEffect, useState } from 'react';
import { api } from '../../services/api.js';
import { Spinner } from '../../components/ui/Spinner.jsx';

export const AdminCustomers = () => {
  const [customers, setCustomers] = useState(null);

  useEffect(() => {
    api.get('/dashboard/customers').then((res) => setCustomers(res.data.data));
  }, []);

  if (!customers) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-ink-900 dark:text-white">Customers</h1>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-ink-200 text-ink-400 dark:border-ink-800">
            <th className="py-2">Name</th>
            <th className="py-2">Email</th>
            <th className="py-2">Phone</th>
            <th className="py-2">Joined</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c._id} className="border-b border-ink-100 dark:border-ink-900">
              <td className="py-2">{c.name}</td>
              <td className="py-2">{c.email}</td>
              <td className="py-2">{c.phone || '—'}</td>
              <td className="py-2">{new Date(c.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
