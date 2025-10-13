// =============================================================
// src/pages/products/ProductDetail.tsx (public detail)
// =============================================================
import { useQuery } from '@tanstack/react-query'
import { getProduct } from '../../services/products.service'
import { useParams, Link } from 'react-router-dom'
const ASSETS = import.meta.env.VITE_ASSETS_PUBLIC_BASE as string | undefined

// ...imports unchanged
export default function ProductDetail(){
  const { id } = useParams()
  const { data, isLoading, error } = useQuery({
    queryKey:['product',id],
    queryFn: ()=> getProduct(id!),
    enabled: !!id,
  })
  if (isLoading) return <div className="card">Loading…</div>
  if (error) return <div className="card text-red-600">{(error as Error).message}</div>
  if (!data) return <div className="card">Not found</div>

 const idx = Number.isInteger(data.primaryImageIndex) ? data.primaryImageIndex : 0;
const key = data.images?.[idx]?.key;
const imgSrc = key && ASSETS ? `${ASSETS}/${key}` : undefined;
const price = Number(data.priceMSRP);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* ... */}
      <div className="space-y-3">
        <div className="text-sm text-gray-500">SKU {data.sku}</div>
        <h1 className="text-2xl font-semibold">{data.name}</h1>
        <div className="text-3xl font-bold">${price.toFixed(2)}</div>
        {/* ... */}
      </div>
    </div>
  )
}