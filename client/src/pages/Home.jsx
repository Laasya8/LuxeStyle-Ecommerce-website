import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { Button } from '../components/ui/Button.jsx';
import { ProductCard } from '../components/product/ProductCard.jsx';
import { ProductCardSkeleton } from '../components/ui/Skeleton.jsx';
import Ferrofluid from '../components/effects/Ferrofluid.jsx';

const SECTIONS = [
  { title: 'Trending Now', params: { trending: true, limit: 4 } },
  { title: 'New Arrivals', params: { sort: 'newest', limit: 4 } },
];

const ProductSection = ({ title, params }) => {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    api
      .get('/products', { params })
      .then((res) => setProducts(res.data.data.products))
      .catch(() => setProducts([]));
  }, []);

  return (
    <section className="container-page py-16">
      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="text-2xl font-semibold text-ink-900 dark:text-white">{title}</h2>
        <Link to="/products" className="text-xs text-ink-400 hover:text-ink-700 dark:hover:text-ink-200">
          View all
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {products === null
          ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : products.length === 0
          ? <p className="col-span-full text-sm text-ink-500">Nothing here yet.</p>
          : products.map((p) => <ProductCard key={p._id} product={p} />)}
      </div>
    </section>
  );
};

export const Home = () => (
  <div>
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-ink-950 text-white">
      <div className="absolute inset-0">
        <Ferrofluid
          colors={['#ffffff', '#ffffff', '#ffffff']}
          speed={0.5}
          scale={1.6}
          turbulence={1}
          fluidity={0.1}
          rimWidth={0.2}
          sharpness={2.5}
          shimmer={1.5}
          glow={2}
          flowDirection="down"
          opacity={1}
          mouseInteraction
          mouseStrength={1}
          mouseRadius={0.35}
        />
      </div>
      <div className="container-page relative z-10 flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-24 text-center animate-fade-in">
        <div className="flex flex-col items-center gap-6 rounded-3xl border border-white/25 bg-white/10 px-8 py-12 shadow-2xl ring-1 ring-white/10 backdrop-blur-2xl backdrop-saturate-150 sm:px-16">
          <span className="rounded-full border border-white/20 px-4 py-1 text-xs uppercase tracking-[0.2em] text-white/70">
            The 2026 Collection
          </span>
          <h1 className="font-display max-w-2xl text-5xl font-semibold leading-tight sm:text-6xl">
            Wear the moment.
          </h1>
          <p className="max-w-md text-white/70">
            Premium fashion & lifestyle, curated for the modern wardrobe — free of noise, full of intent.
          </p>
          <div className="mt-2 flex gap-3">
            <Button as={Link} to="/products" size="lg">
              Shop the collection
            </Button>
            <Button as={Link} to="/products?sort=newest" variant="outline" size="lg" className="border-white/30 text-white hover:border-white">
              New arrivals
            </Button>
          </div>
        </div>
      </div>
    </section>

    {SECTIONS.map((section) => (
      <ProductSection key={section.title} title={section.title} params={section.params} />
    ))}

    <section className="container-page py-16">
      <div className="rounded-3xl bg-brand-50 p-10 text-center dark:bg-brand-900/20">
        <h2 className="text-2xl font-semibold text-ink-900 dark:text-white">Cash on Delivery, always.</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-500 dark:text-ink-400">
          Shop confidently — pay when your order arrives at your door.
        </p>
      </div>
    </section>
  </div>
);
