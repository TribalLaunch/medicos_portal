// =============================================================
// src/pages/products/ProductDetail.tsx (public detail)
// =============================================================
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';

import { getProductBySku } from '../../services/products.service';
import type { Product } from '../../lib/validators/product';
import { resolveProductImage, DEFAULT_PRODUCT_IMG } from '../../lib/images';
import { useAuthStore } from '../../app/store';
import { useCartStore } from "../../store/cart.store";

export default function ProductDetail() {
  const { sku } = useParams();
  const { user } = useAuthStore();

  const { data, isLoading, error } = useQuery<Product>({
    queryKey: ['product', sku],
    queryFn: () => getProductBySku(sku!),
    enabled: !!sku,
  });

  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Build a safe list of display URLs that always work with our resolver
  const displayImages = useMemo(() => {
    if (!data || !data.images?.length) return [];
    return data.images.map((_, i) => resolveProductImage(data, i) || DEFAULT_PRODUCT_IMG);
  }, [data]);

  // Pick a safe starting index: activeIndex -> primaryImageIndex -> 0
  const primaryIndex = useMemo(() => {
    if (!data) return 0;
    const p = Number.isInteger(data.primaryImageIndex) ? data.primaryImageIndex : 0;
    return Math.max(0, Math.min(p, (data.images?.length ?? 1) - 1));
  }, [data]);

  const safeIndex = useMemo(() => {
    if (!data || !data.images?.length) return 0;
    const i = Number.isInteger(activeIndex) ? activeIndex : 0;
    if (i >= 0 && i < data.images.length) return i;
    return primaryIndex;
  }, [activeIndex, data, primaryIndex]);

  if (isLoading) return <div className="card">Loading…</div>;
  if (error) return <div className="card text-red-600">{(error as Error).message}</div>;
  if (!data) return <div className="card">Not found</div>;

  const msrp = Number(data.priceMSRP);
  const contractPrice =
    data.contractPrice !== undefined ? Number(data.contractPrice) : undefined;

  const mainSrc = displayImages[safeIndex] || DEFAULT_PRODUCT_IMG;

  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>("");

  const primaryImg =
    (data.images?.length ? resolveProductImage(data, data.primaryImageIndex) : undefined) ||
    DEFAULT_PRODUCT_IMG;

  // choose the cart price: contract if present and user logged in, else MSRP
  const cartPrice = user && contractPrice !== undefined ? contractPrice : Number(data.priceMSRP);


  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Images */}
      <div className="space-y-3">
        <div className="rounded-2xl border bg-white overflow-hidden min-h-[20rem] grid place-items-center">
          <img
            src={mainSrc}
            alt={data.images?.[safeIndex]?.alt || data.name}
            className="w-full h-full object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = DEFAULT_PRODUCT_IMG; }}
          />
        </div>

        {/* Thumbnails */}
        {displayImages.length > 0 && (
          <div className="flex gap-2 overflow-x-auto">
            {displayImages.map((src, i) => (
              <button
                type="button"
                key={(data.images?.[i]?.key ?? 'img') + i}
                onClick={() => setActiveIndex(i)}
                className={`h-16 w-16 overflow-hidden rounded-xl border ${
                  i === safeIndex ? 'border-sky-400' : 'border-gray-200'
                }`}
                title={data.images?.[i]?.alt || `Image ${i + 1}`}
              >
                <img
                  src={src}
                  alt={data.images?.[i]?.alt || `Image ${i + 1}`}
                  className="h-full w-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = DEFAULT_PRODUCT_IMG; }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="space-y-4">
        <div className="text-sm text-gray-500">SKU {data.sku}</div>
        <h1 className="text-2xl font-semibold">{data.name}</h1>

        <div className="space-y-1">
          <div className="text-3xl font-bold">${msrp.toFixed(2)}</div>

          {user && contractPrice !== undefined && (
            <div className="text-sm">
              <span className="badge mr-2">Contract</span>
              <span className="font-semibold">${contractPrice.toFixed(2)}</span>
              {msrp > 0 && (
                <span className="text-gray-500 ml-2">
                  ({(100 - (contractPrice / msrp) * 100).toFixed(0)}% off MSRP)
                </span>
              )}
            </div>
          )}

          <div className="card space-y-3">
  {data.sizing?.length ? (
    <div>
      <div className="text-sm font-medium mb-1">Size</div>
      <select
        className="input w-full"
        value={selectedSize}
        onChange={(e) => setSelectedSize(e.target.value)}
      >
        <option value="">Select size</option>
        {data.sizing.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>
  ) : null}

  <div className="flex gap-2 items-end">
    <div className="flex-1">
      <div className="text-sm font-medium mb-1">Quantity</div>
      <input
        className="input w-full"
        type="number"
        min={1}
        value={qty}
        onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
      />
    </div>

    <button
      className="btn-primary"
      onClick={() => {
        if (data.sizing?.length && !selectedSize) {
          alert("Please select a size.");
          return;
        }
        addItem({
          sku: data.sku,
          name: data.name,
          price: cartPrice,
          qty,
          size: selectedSize || undefined,
          imageUrl: primaryImg,
          requiresPrescription: data.requiresPrescription,
        });
      }}
      type="button"
    >
      Add to cart
    </button>
  </div>
</div>

        </div>
        

        {data.manufacturer && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Manufacturer:</span> {data.manufacturer}
          </div>
        )}

        {data.category && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Category:</span> {data.category}
          </div>
        )}

        {data.requiresPrescription && (
          <div className="text-sm text-red-700">
            ⚠️ This item requires a prescription.
          </div>
        )}

        {data.sizing && data.sizing.length > 0 && (
          <div>
            <div className="text-sm font-medium mb-1">Available sizes</div>
            <div className="flex flex-wrap gap-2">
              {data.sizing.map((s) => (
                <span key={s} className="badge">{s}</span>
              ))}
            </div>
          </div>
        )}

        {data.description && <p className="text-gray-700">{data.description}</p>}

        <div className="pt-2 flex gap-2">
          <Link to="/checkout" className="btn-primary">Checkout</Link>
          <Link to="/products" className="btn-outline">Back to products</Link>
        </div>
      </div>
    </div>
  );
}
