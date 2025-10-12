// =============================================================
// src/lib/validators/product.ts
// =============================================================
import { z } from 'zod';

export const ImageSchema = z.object({
  key: z.string(),
  url: z.string().optional(), // presigned upload URL (not used for display)
  alt: z.string().optional(),
});

export const ProductSchema = z.object({
  _id: z.string(),
  sku: z.string(),
  name: z.string(),
  description: z.string().optional(),
  active: z.boolean().optional(),
  priceMSRP: z.union([z.number(), z.string()]),
  images: z.array(ImageSchema).default([]),
  primaryImageIndex: z.number().default(0),
  sizing: z.array(z.string()).optional(),
  uom: z.string().optional(),
  createdAt: z.string().optional(),
});

export type Product = z.infer<typeof ProductSchema>;
