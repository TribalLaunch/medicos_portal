import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: process.env.AWS_REGION });

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

/**
 * Keys are structured: images/products/<sku>/<rand>-<sanitized-filename>
 */
export function makeProductKey({ sku, fileName }) {
  const safe = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const rand = Math.random().toString(36).slice(2, 10);
  return `images/products/${sku}/${rand}-${safe}`;
}

export async function getPresignedUploadUrl({ key, contentType }) {
  if (!ALLOWED_TYPES.has(contentType)) {
    const allowed = Array.from(ALLOWED_TYPES).join(", ");
    throw new Error(`Unsupported content type. Allowed: ${allowed}`);
  }
  const cmd = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    ContentType: contentType,
    // No ACL — bucket is private, CloudFront OAC reads objects
  });
  const uploadUrl = await getSignedUrl(s3, cmd, { expiresIn: 60 * 5 });
  const publicUrl = `${process.env.AWS_PUBLIC_BASE}/${encodeURIComponent(key)}`;
  return { uploadUrl, publicUrl, key };
}

export async function deleteObject(key) {
  const cmd = new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
  });
  await s3.send(cmd);
  return { ok: true };
}
