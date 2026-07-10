import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext.jsx';

const TILT_MAX_DEG = 8;

export const ProductCard = ({ product }) => {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product._id);
  const price = product.discountPrice || product.price;

  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -TILT_MAX_DEG, y: px * TILT_MAX_DEG });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      className="group relative"
      style={{ perspective: '800px' }}
    >
      <Link
        to={`/products/${product.slug}`}
        className="block transition-transform duration-150 ease-out will-change-transform"
        style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-ink-100 shadow-sm transition-shadow duration-300 group-hover:shadow-xl dark:bg-ink-800">
          <img
            src={product.images?.[0]?.url}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
          {product.discountPrice && (
            <span className="absolute left-2 top-2 rounded-full bg-brand-500 px-2 py-0.5 text-[11px] font-semibold text-white">
              -{product.discountPercent}%
            </span>
          )}
        </div>
        <p className="mt-2 truncate text-sm font-medium text-ink-900 dark:text-white">{product.name}</p>
        <div className="mt-0.5 flex items-center gap-2">
          <span className="text-sm font-semibold text-ink-900 dark:text-white">₹{price}</span>
          {product.discountPrice && (
            <span className="text-xs text-ink-400 line-through">₹{product.price}</span>
          )}
        </div>
      </Link>
      <button
        onClick={() => toggleWishlist(product)}
        aria-label="Toggle wishlist"
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink-700 shadow-sm transition hover:scale-105 dark:bg-ink-900/90 dark:text-white"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={wishlisted ? '#a67c3d' : 'none'}
          stroke={wishlisted ? '#a67c3d' : 'currentColor'}
          strokeWidth="1.8"
        >
          <path
            d="M12 21s-7.5-4.8-10-9.4C.4 8 2 4.5 5.6 4a5.4 5.4 0 016.4 3 5.4 5.4 0 016.4-3c3.6.5 5.2 4 3.6 7.6C19.5 16.2 12 21 12 21z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};
