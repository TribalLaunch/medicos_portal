// =============================================================
// src/lib/validators/product.ts
// =============================================================
import { z } from 'zod';

export const ImageSchema = z.object({
  key: z.string(),          // S3 object key
  url: z.string(),          // public URL to display (from backend)
  alt: z.string().optional()
});

export const ProductSchema = z.object({
  _id: z.string(),
  sku: z.string(),
  name: z.string(),
  description: z.string().optional(),
  manufacturer: z.string().optional(),
  category: z.string().optional(),
  sub_category: z.string(),
  active: z.boolean().optional(),
  requiresPrescription: z.boolean().optional(),
  priceMSRP: z.union([z.number(), z.string()]),
  contractPrice: z.union([z.number(), z.string()]).optional(),
  images: z.array(ImageSchema).default([]),
  primaryImageIndex: z.number().default(0),
  sizing: z.array(z.string()).optional(),
  sizing_description: z.string(),
  uom: z.string().optional(),
  createdAt: z.string().optional(),
});

export type Product = z.infer<typeof ProductSchema>;
export type ProductImage = z.infer<typeof ImageSchema>;


// import { z } from 'zod';

// export const ImageSchema = z.object({
//   key: z.string(),
//   url: z.string().optional(), // presigned upload URL (not used for display)
//   alt: z.string().optional(),
// });

// export const ProductSchema = z.object({
//   _id: z.string(),
//   sku: z.string(),
//   name: z.string(),
//   description: z.string().optional(),
//   active: z.boolean().optional(),
//   priceMSRP: z.union([z.number(), z.string()]),
//   images: z.array(ImageSchema).default([]),
//   primaryImageIndex: z.number().default(0),
//   sizing: z.array(z.string()).optional(),
//   uom: z.string().optional(),
//   createdAt: z.string().optional(),
// });

// export type Product = z.infer<typeof ProductSchema>;
