// =============================================================
// src/components/products/ProductCard.tsx (public grid card)
// =============================================================
import type { Product } from '../../lib/validators/product';
import { resolveProductImage, DEFAULT_PRODUCT_IMG } from '../../lib/images';
import { Link } from 'react-router-dom';

export default function ProductCard({ p }: { p: Product }) {
  const imgSrc = resolveProductImage(p);
  const price = Number(p.priceMSRP);

  return (
    <Link to={`/products/${encodeURIComponent(p.sku)}`}
      className="block rounded-2xl border bg-white shadow-sm overflow-hidden hover:shadow-md transition">
      <img
        src={imgSrc || DEFAULT_PRODUCT_IMG}
        alt={p.name}
        className="h-40 w-full object-cover"
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = DEFAULT_PRODUCT_IMG; }}
      />
      <div className="p-3">
        <div className="font-medium">{p.name}</div>
        <div className="text-xs text-gray-500">{p.sku}</div>
        <div className="mt-1 font-semibold">${price.toFixed(2)}</div>
      </div>
    </Link>
  );
}