import type { Product } from './validators/product';

const CDN_BASE = (import.meta.env.VITE_ASSETS_PUBLIC_BASE as string | undefined)?.replace(/\/$/,'');
const S3_BASE  = (import.meta.env.VITE_S3_PUBLIC_BASE as string | undefined)?.replace(/\/$/,'');
const FORCE_KEY_RENDER = (import.meta.env.VITE_FORCE_KEY_RENDER as string | undefined) === 'true';

export const DEFAULT_PRODUCT_IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
    <rect width="100%" height="100%" fill="#f1f5f9"/>
    <g fill="#94a3b8">
      <circle cx="200" cy="120" r="60"/>
      <rect x="80" y="210" width="240" height="40" rx="8"/>
    </g>
  </svg>`);

function buildFromKey(key?: string): string | undefined {
  if (!key) return undefined;
  if (CDN_BASE) return `${CDN_BASE}/${key}`;
  if (S3_BASE)  return `${S3_BASE}/${key}`;
  return undefined;
}

function normalizePublicUrl(raw: string | undefined, key?: string): string | undefined {
  if (FORCE_KEY_RENDER) return buildFromKey(key);

  if (!raw) return buildFromKey(key);

  // decode %2F → '/', but guard against malformed strings
  let decoded = raw;
  try { decoded = decodeURIComponent(raw); } catch { /* ignore */ }

  // If it's an unusable PUT presign, rebuild from key
  if (/[?&]X-Amz-Signature=/.test(decoded) && /x-id=PutObject/i.test(decoded)) {
    return buildFromKey(key);
  }

  // Already has scheme?
  if (/^https?:\/\//i.test(decoded)) return decoded;

  // Protocol-relative?
  if (/^\/\//.test(decoded)) return `https:${decoded}`;

  // Bare host/path (e.g., d3vh...cloudfront.net/images/...):
  // ensure no leading scheme and prepend https://
  const hostPath = decoded.replace(/^https?:\/\//i,'').replace(/^\/\//,'').replace(/^\/+/, '');
  return `https://${hostPath}`;
}

export function resolveProductImage(p: Product, idx?: number): string | undefined {
  const i = Number.isInteger(idx) ? (idx as number)
          : (Number.isInteger(p.primaryImageIndex) ? p.primaryImageIndex : 0);
  const img = p.images?.[i];
  if (!img) return undefined;
  return normalizePublicUrl(img.url, img.key);
}





// import type { Product } from './validators/product';

// /** Optional envs (only used if we need to rebuild a URL from a key) */
// const CDN_BASE = (import.meta.env.VITE_ASSETS_PUBLIC_BASE as string | undefined)?.replace(/\/$/,'');
// const S3_BASE  = (import.meta.env.VITE_S3_PUBLIC_BASE as string | undefined)?.replace(/\/$/,'');

// /** Inline SVG placeholder */
// export const DEFAULT_PRODUCT_IMG =
//   'data:image/svg+xml;utf8,' +
//   encodeURIComponent(`
//   <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
//     <rect width="100%" height="100%" fill="#f1f5f9"/>
//     <g fill="#94a3b8">
//       <circle cx="200" cy="120" r="60"/>
//       <rect x="80" y="210" width="240" height="40" rx="8"/>
//     </g>
//   </svg>`);

// /** Normalize a possibly-encoded/bare URL; rebuild from key if needed. */
// function normalizePublicUrl(url: string | undefined, key?: string): string | undefined {
//   if (!url && key) {
//     if (CDN_BASE) return `${CDN_BASE}/${key}`;
//     if (S3_BASE)  return `${S3_BASE}/${key}`;
//     return undefined;
//   }
//   if (!url) return undefined;

//   // Try to decode %2F → '/'
//   let decoded = url;
//   try { decoded = decodeURIComponent(url); } catch { /* ignore */ }

//   // If it already has http/https, keep it
//   if (/^https?:\/\//i.test(decoded)) return decoded;

//   // If it's protocol-relative //domain/path
//   if (/^\/\//.test(decoded)) return `https:${decoded}`;

//   // If it looks like a PUT presign (unusable for <img/>), rebuild from key
//   if (/[?&]X-Amz-Signature=/.test(decoded) && /x-id=PutObject/i.test(decoded)) {
//     if (key) {
//       if (CDN_BASE) return `${CDN_BASE}/${key}`;
//       if (S3_BASE)  return `${S3_BASE}/${key}`;
//     }
//     return undefined;
//   }

//   // Bare domain/path without scheme: add https://
//   const hostPath = decoded.replace(/^https?:\/\//i,'').replace(/^\/\//,'');
//   return `https://${hostPath}`;
// }

// /** Decide which URL to use for display (with index override) */
// export function resolveProductImage(p: Product, idx?: number): string | undefined {
//   const i = Number.isInteger(idx) ? (idx as number)
//           : (Number.isInteger(p.primaryImageIndex) ? p.primaryImageIndex : 0);
//   const img = p.images?.[i];
//   if (!img) return undefined;
//   return normalizePublicUrl(img.url, img.key);
// }
