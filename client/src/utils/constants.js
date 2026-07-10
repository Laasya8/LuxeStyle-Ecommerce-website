export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';

export const isClerkConfigured = Boolean(
  CLERK_PUBLISHABLE_KEY && !CLERK_PUBLISHABLE_KEY.includes('REPLACE_WITH_YOUR_KEY')
);

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/products' },
  { label: 'New Arrivals', to: '/products?sort=latest' },
  { label: 'Best Sellers', to: '/products?sort=bestselling' },
];

export const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export const ORDER_STATUS_STYLES = {
  pending: 'bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-300',
  processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  shipped: 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300',
  delivered: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};
