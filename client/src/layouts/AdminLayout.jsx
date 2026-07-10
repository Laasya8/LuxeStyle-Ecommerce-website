import { NavLink, Outlet, Link } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { clsx } from 'clsx';

const ADMIN_LINKS = [
  { label: 'Dashboard', to: '/admin' },
  { label: 'Products', to: '/admin/products' },
  { label: 'Categories', to: '/admin/categories' },
  { label: 'Brands', to: '/admin/brands' },
  { label: 'Orders', to: '/admin/orders' },
  { label: 'Customers', to: '/admin/customers' },
  { label: 'Reviews', to: '/admin/reviews' },
  { label: 'Inventory', to: '/admin/inventory' },
  { label: 'Reports', to: '/admin/reports' },
];

export const AdminLayout = () => (
  <div className="flex min-h-screen bg-ink-50 dark:bg-ink-900">
    <aside className="hidden w-60 shrink-0 border-r border-ink-200 bg-white p-4 lg:block dark:border-ink-800 dark:bg-ink-950">
      <Link to="/" className="font-display block px-2 text-lg font-semibold">
        LUXE<span className="text-brand-500">STYLE</span>
        <span className="ml-1 text-xs font-sans font-normal text-ink-400">Admin</span>
      </Link>
      <nav className="mt-8 flex flex-col gap-1">
        {ADMIN_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/admin'}
            className={({ isActive }) =>
              clsx(
                'rounded-lg px-3 py-2 text-sm font-medium text-ink-600 transition hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800',
                isActive && 'bg-ink-900 text-white hover:bg-ink-900 dark:bg-white dark:text-ink-900'
              )
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
    <div className="flex-1">
      <header className="flex h-16 items-center justify-between border-b border-ink-200 bg-white px-6 dark:border-ink-800 dark:bg-ink-950">
        <p className="text-sm font-medium text-ink-500 dark:text-ink-400">Admin Panel</p>
        <UserButton afterSignOutUrl="/" />
      </header>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  </div>
);
