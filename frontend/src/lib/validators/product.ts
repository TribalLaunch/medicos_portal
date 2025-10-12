// =============================================================
// src/lib/validators/product.ts
// =============================================================
import { z } from 'zod'
export const ProductSchema = z.object({
_id: z.string(),
name: z.string(),
sku: z.string(),
price: z.number(),
description: z.string().optional(),
imageKey: z.string().optional(), // S3 key
inStock: z.boolean().optional(),
createdAt: z.string().optional(),
updatedAt: z.string().optional(),
})
export type Product = z.infer<typeof ProductSchema>