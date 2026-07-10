import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext.jsx';
import { Button } from '../components/ui/Button.jsx';
import { ProductCard } from '../components/product/ProductCard.jsx';

export const Wishlist = () => {
  const { items } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="container-page flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl font-semibold text-ink-900 dark:text-white">Your wishlist is empty</h1>
        <p className="text-sm text-ink-500 dark:text-ink-400">
          Save products you love by tapping the heart icon.
        </p>
        <Button as={Link} to="/products">
          Explore products
        </Button>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <h1 className="mb-6 text-2xl font-semibold text-ink-900 dark:text-white">Wishlist</h1>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};
