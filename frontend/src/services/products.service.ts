// =============================================================
// src/services/products.service.ts
// =============================================================
import { getList, getItem, postJSON, patchJSON, del } from '../lib/fetcher'
import type { Product } from '../lib/validators/product'


export function listProducts(params: Record<string, any>) {
return getList<Product>('/products', params)
}
export function getProduct(sku: string) {
return getItem<Product>(`/products/${sku}`)
}


// ADMIN
export function adminListProducts(params: Record<string, any>) {
return getList<Product>('/admin/products', params)
}
export function createProduct(payload: Partial<Product>) {
return postJSON<{ data: Product }>(`/admin/products`, payload)
}
export function updateProduct(id: string, payload: Partial<Product>) {
return patchJSON<{ data: Product }>(`/admin/products/${id}`, payload)
}
export function deleteProduct(id: string) {
return del(`/admin/products/${id}`)
}
export function getUploadUrls(count: number) {
return postJSON<{ urls: string[] }>(`/admin/products/upload-urls`, { count })
}