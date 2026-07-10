import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api.js';
import { ProductCard } from '../components/product/ProductCard.jsx';
import { ProductCardSkeleton } from '../components/ui/Skeleton.jsx';
import { Button } from '../components/ui/Button.jsx';

const SORT_LABELS = {
  newest: 'Newest',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
  popular: 'Best Selling',
  rating: 'Top Rated',
};

export const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const sort = searchParams.get('sort') || 'newest';
  const category = searchParams.get('category') || '';
  const brand = searchParams.get('brand') || '';
  const page = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data.data)).catch(() => {});
    api.get('/brands').then((res) => setBrands(res.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 12, sort };
    if (category) params.category = category;
    if (brand) params.brand = brand;

    api
      .get('/products', { params })
      .then((res) => {
        setProducts(res.data.data.products);
        setPagination(res.data.data.pagination);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [sort, category, brand, page]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  };

  return (
    <div className="container-page py-10">
      <h1 className="mb-6 text-2xl font-semibold text-ink-900 dark:text-white">Shop</h1>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="space-y-6">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-ink-900 dark:text-white">Category</h3>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => updateParam('category', '')}
                className={`text-left text-sm ${!category ? 'font-semibold text-brand-600' : 'text-ink-500'}`}
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c._id}
                  onClick={() => updateParam('category', c._id)}
                  className={`text-left text-sm ${category === c._id ? 'font-semibold text-brand-600' : 'text-ink-500'}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-ink-900 dark:text-white">Brand</h3>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => updateParam('brand', '')}
                className={`text-left text-sm ${!brand ? 'font-semibold text-brand-600' : 'text-ink-500'}`}
              >
                All
              </button>
              {brands.map((b) => (
                <button
                  key={b._id}
                  onClick={() => updateParam('brand', b._id)}
                  className={`text-left text-sm ${brand === b._id ? 'font-semibold text-brand-600' : 'text-ink-500'}`}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-4 flex justify-end">
            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="rounded-lg border border-ink-300 bg-white px-3 py-1.5 text-sm dark:border-ink-700 dark:bg-ink-800"
            >
              {Object.entries(SORT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <p className="py-20 text-center text-sm text-ink-500">No products found.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>

              {pagination.pages > 1 && (
                <div className="mt-10 flex justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => updateParam('page', String(page - 1))}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-2 text-sm text-ink-500">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= pagination.pages}
                    onClick={() => updateParam('page', String(page + 1))}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
