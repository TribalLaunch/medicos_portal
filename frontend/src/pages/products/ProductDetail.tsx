// =============================================================
// src/pages/products/ProductDetail.tsx (public detail)
// =============================================================
import { useQuery } from '@tanstack/react-query'
import { getProduct } from '../../services/products.service'
import { useParams, Link } from 'react-router-dom'
const ASSETS = import.meta.env.VITE_ASSETS_PUBLIC_BASE as string | undefined


export default function ProductDetail(){
const { id } = useParams()
const { data, isLoading, error } = useQuery({ queryKey:['product',id], queryFn: ()=> getProduct(id!) })
if (isLoading) return <div className="card">Loading…</div>
if (error) return <div className="card text-red-600">{(error as Error).message}</div>
if (!data) return <div className="card">Not found</div>
const imgSrc = data.imageKey && ASSETS ? `${ASSETS}/${data.imageKey}` : undefined
return (
<div className="grid gap-6 md:grid-cols-2">
<div className="rounded-2xl border bg-white overflow-hidden">
{imgSrc ? <img src={imgSrc} alt={data.name} className="w-full h-full object-cover"/> : <div className="h-80 grid place-items-center text-gray-400">No image</div>}
</div>
<div className="space-y-3">
<div className="text-sm text-gray-500">SKU {data.sku}</div>
<h1 className="text-2xl font-semibold">{data.name}</h1>
<div className="text-3xl font-bold">${data.price.toFixed(2)}</div>
{data.description && <p className="text-gray-600">{data.description}</p>}
<div className="pt-2">
<Link to="/checkout" className="btn-primary">Checkout</Link>
</div>
</div>
</div>
)
}