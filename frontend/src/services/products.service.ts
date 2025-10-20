// =============================================================
// src/services/products.service.ts
// =============================================================
import { getList, getItem, postJSON, patchJSON, del } from '../lib/fetcher'
import type { Product, ProductImage } from '../lib/validators/product'


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
// If your backend resolves :id param by either ObjectId OR SKU, this works.
// If it’s specifically SKU-only, this still works; just pass the sku.
export function getProductBySku(sku: string) {
  return getItem<Product>(`/products/${encodeURIComponent(sku)}`)
}

/** Request a single presigned upload URL */
export function getUploadUrl(input: { sku: string; fileName: string; contentType: string }) {
  // returns { uploadUrl, publicUrl, key }
  return postJSON<{ uploadUrl: string; publicUrl: string; key: string }>(
    `/admin/products/upload-url`,
    input
  )
}

/** Optional: delete one image */
export function deleteProductImage(body: { productId: string; key: string; deleteFromS3?: boolean }) {
  return postJSON(`/admin/products/image`, body)
}