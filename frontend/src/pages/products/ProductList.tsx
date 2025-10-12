// =============================================================
// src/pages/products/ProductsList.tsx (public catalog)
// =============================================================
import { useQuery } from '@tanstack/react-query';
import { listProducts } from '../../services/products.service';
import ProductCard from '../../components/products/ProductCard';
import { useEffect, useState } from 'react';
import type { ListResponse } from '../../lib/fetcher';
import type { Product } from '../../lib/validators/product';

export default function ProductsList() {
  const [q, setQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState(q);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);

  // debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  const { data, isLoading, error } = useQuery<ListResponse<Product>>({
    queryKey: ['products', { q: debouncedQ, page, pageSize }],
    queryFn: () => listProducts({ q: debouncedQ, page, pageSize }),
    // v5 replacement for keepPreviousData
    placeholderData: (prev) => prev,
  });

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Products</h2>
        <input
          className="input max-w-xs"
          placeholder="Search by name or SKU"
          value={q}
          onChange={(e) => {
            setPage(1);
            setQ(e.target.value);
          }}
        />
      </div>

      <div>
        {isLoading && <div className="card">Loading…</div>}
        {error && <div className="card text-red-600">{(error as Error).message}</div>}

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {data?.data?.map((p) => <ProductCard key={p._id} p={p} />)}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          className="btn-outline"
          disabled={(data?.page ?? 1) <= 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>
        <span className="text-sm text-gray-600">Page {data?.page ?? page}</span>
        <button
          className="btn-outline"
          disabled={!data?.hasMore}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </section>
  );
}
