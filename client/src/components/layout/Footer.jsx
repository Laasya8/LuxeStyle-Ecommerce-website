import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '../ui/Button.jsx';

const FOOTER_LINKS = {
  Shop: [
    { label: 'New Arrivals', to: '/products?sort=latest' },
    { label: 'Best Sellers', to: '/products?sort=bestselling' },
    { label: 'All Products', to: '/products' },
  ],
  Support: [
    { label: 'My Orders', to: '/orders' },
    { label: 'Track Order', to: '/orders' },
    { label: 'Profile', to: '/profile' },
  ],
  Company: [
    { label: 'About', to: '/' },
    { label: 'Contact', to: '/' },
  ],
};

export const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Subscribed! Watch your inbox for LuxeStyle drops.');
    setEmail('');
  };

  return (
    <footer className="mt-24 border-t border-ink-200 bg-ink-50 dark:border-ink-800 dark:bg-ink-900">
      <div className="container-page py-14">
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <p className="font-display text-xl font-semibold">
              LUXE<span className="text-brand-500">STYLE</span>
            </p>
            <p className="mt-3 max-w-sm text-sm text-ink-500 dark:text-ink-400">
              Premium fashion & lifestyle, curated for the modern wardrobe.
            </p>
            <form onSubmit={handleSubscribe} className="mt-5 flex max-w-sm gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full rounded-full border border-ink-300 bg-white px-4 py-2 text-sm outline-none focus:border-ink-900 dark:border-ink-700 dark:bg-ink-800 dark:focus:border-white"
              />
              <Button type="submit" size="sm">
                Join
              </Button>
            </form>
          </div>

          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-sm font-semibold text-ink-900 dark:text-white">{heading}</h3>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-ink-500 transition hover:text-ink-900 dark:text-ink-400 dark:hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-ink-200 pt-6 text-xs text-ink-400 sm:flex-row dark:border-ink-800">
          <p>© {new Date().getFullYear()} LuxeStyle. All rights reserved.</p>
          <p>Cash on Delivery available across all orders.</p>
        </div>
      </div>
    </footer>
  );
};
