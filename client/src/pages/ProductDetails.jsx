import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useCurrentUser } from '../hooks/useCurrentUser.js';
import { Button } from '../components/ui/Button.jsx';
import { Spinner } from '../components/ui/Spinner.jsx';

const Stars = ({ value }) => (
  <span className="text-brand-500">
    {'★'.repeat(Math.round(value))}
    <span className="text-ink-300 dark:text-ink-600">{'★'.repeat(5 - Math.round(value))}</span>
  </span>
);

export const ProductDetails = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { user, isSignedIn } = useCurrentUser();

  const loadProduct = () => {
    setLoading(true);
    api
      .get(`/products/${slug}`)
      .then((res) => setProduct(res.data.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProduct();
    setActiveImage(0);
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-page flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl font-semibold text-ink-900 dark:text-white">Product not found</h1>
        <Button as={Link} to="/products">
          Back to shop
        </Button>
      </div>
    );
  }

  const price = product.discountPrice || product.price;
  const wishlisted = isWishlisted(product._id);

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success('Added to cart');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/reviews/product/${product._id}`, reviewForm);
      toast.success('Review submitted');
      setReviewForm({ rating: 5, comment: '' });
      loadProduct();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-page py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="aspect-[3/4] w-full overflow-hidden rounded-2xl bg-ink-100 dark:bg-ink-800">
            <img
              src={product.images?.[activeImage]?.url}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          {product.images?.length > 1 && (
            <div className="mt-3 flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={img.publicId || i}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-14 overflow-hidden rounded-lg border-2 ${
                    i === activeImage ? 'border-brand-500' : 'border-transparent'
                  }`}
                >
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.brand?.name && (
            <p className="text-sm text-ink-500">{product.brand.name}</p>
          )}
          <h1 className="mt-1 text-2xl font-semibold text-ink-900 dark:text-white">{product.name}</h1>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <Stars value={product.ratings?.average || 0} />
            <span className="text-ink-500">({product.ratings?.count || 0} reviews)</span>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-semibold text-ink-900 dark:text-white">₹{price}</span>
            {product.discountPrice && (
              <>
                <span className="text-ink-400 line-through">₹{product.price}</span>
                <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                  -{product.discountPercent}%
                </span>
              </>
            )}
          </div>

          <p className="mt-4 text-sm text-ink-600 dark:text-ink-300">{product.description}</p>

          {product.sizes?.length > 0 && (
            <div className="mt-4">
              <p className="mb-1 text-sm font-medium text-ink-900 dark:text-white">Sizes</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <span
                    key={s}
                    className="rounded-lg border border-ink-300 px-3 py-1 text-sm dark:border-ink-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          <p className="mt-4 text-sm">
            {product.inStock ? (
              <span className="text-green-600">In stock ({product.stock} left)</span>
            ) : (
              <span className="text-red-500">Out of stock</span>
            )}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <input
              type="number"
              min={1}
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="w-16 rounded-lg border border-ink-300 px-2 py-2 text-center dark:border-ink-700 dark:bg-ink-800"
            />
            <Button disabled={!product.inStock} onClick={handleAddToCart} className="flex-1">
              Add to Cart
            </Button>
            <Button variant="outline" onClick={() => toggleWishlist(product)}>
              {wishlisted ? '♥ Saved' : '♡ Save'}
            </Button>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="mb-4 text-xl font-semibold text-ink-900 dark:text-white">Reviews</h2>

        {isSignedIn && user && (
          <form onSubmit={handleSubmitReview} className="mb-8 max-w-lg space-y-3">
            <select
              value={reviewForm.rating}
              onChange={(e) => setReviewForm((f) => ({ ...f, rating: Number(e.target.value) }))}
              className="rounded-lg border border-ink-300 px-3 py-2 text-sm dark:border-ink-700 dark:bg-ink-800"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} star{r > 1 && 's'}
                </option>
              ))}
            </select>
            <textarea
              required
              placeholder="Share your thoughts..."
              value={reviewForm.comment}
              onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
              className="w-full rounded-lg border border-ink-300 px-3 py-2 text-sm dark:border-ink-700 dark:bg-ink-800"
              rows={3}
            />
            <Button type="submit" loading={submitting} size="sm">
              Submit Review
            </Button>
          </form>
        )}

        {product.reviews?.length ? (
          <ul className="space-y-4">
            {product.reviews.map((r) => (
              <li key={r._id} className="rounded-2xl border border-ink-200 p-4 dark:border-ink-800">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-ink-900 dark:text-white">{r.user?.name}</span>
                  <Stars value={r.rating} />
                </div>
                <p className="mt-2 text-sm text-ink-600 dark:text-ink-300">{r.comment}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-ink-500">No reviews yet.</p>
        )}
      </section>
    </div>
  );
};
