import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { NAV_LINKS, isClerkConfigured } from '../../utils/constants.js';
import { clsx } from 'clsx';

const IconButton = ({ children, ...props }) => (
  <button
    className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink-700 transition-all duration-150 hover:scale-110 hover:bg-ink-100 active:scale-90 dark:text-ink-200 dark:hover:bg-ink-800"
    {...props}
  >
    {children}
  </button>
);

const Badge = ({ count }) =>
  count > 0 ? (
    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-semibold text-white">
      {count > 9 ? '9+' : count}
    </span>
  ) : null;

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { itemCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="glass sticky top-0 z-50 border-b border-ink-200/70 dark:border-ink-700/70">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800 lg:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <MenuIcon />
          </button>
          <Link to="/" className="font-display text-xl font-semibold tracking-tight">
            LUXE<span className="text-brand-500">STYLE</span>
          </Link>
        </div>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                clsx(
                  'text-sm font-medium text-ink-600 transition hover:text-ink-950 dark:text-ink-300 dark:hover:text-white',
                  isActive && 'text-ink-950 dark:text-white'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <IconButton aria-label="Search" title="Search (Phase 2)">
            <SearchIcon />
          </IconButton>
          <IconButton onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </IconButton>
          <Link to="/wishlist" className="relative">
            <IconButton aria-label="Wishlist">
              <HeartIcon />
              <Badge count={wishlistItems.length} />
            </IconButton>
          </Link>
          <Link to="/cart" className="relative">
            <IconButton aria-label="Cart">
              <BagIcon />
              <Badge count={itemCount} />
            </IconButton>
          </Link>

          {isClerkConfigured ? (
            <>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="ml-2 rounded-full bg-ink-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-ink-700 dark:bg-white dark:text-ink-900">
                    Sign in
                  </button>
                </SignInButton>
              </SignedOut>
            </>
          ) : (
            <Link
              to="/profile"
              className="ml-2 rounded-full bg-ink-200 px-4 py-2 text-sm font-medium text-ink-500 dark:bg-ink-800 dark:text-ink-400"
              title="Configure Clerk to enable sign in"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>

      {menuOpen && (
        <nav className="flex flex-col gap-1 border-t border-ink-200 px-4 py-3 lg:hidden dark:border-ink-700">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800"
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
};

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}
function SunIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="4" />
      <path
        d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path
        d="M12 21s-7.5-4.8-10-9.4C.4 8 2 4.5 5.6 4a5.4 5.4 0 016.4 3 5.4 5.4 0 016.4-3c3.6.5 5.2 4 3.6 7.6C19.5 16.2 12 21 12 21z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function BagIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 8h12l-1 12H7L6 8z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 8V6a3 3 0 016 0v2" strokeLinecap="round" />
    </svg>
  );
}
