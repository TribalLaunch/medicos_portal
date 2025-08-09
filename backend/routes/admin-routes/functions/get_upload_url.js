import { getPresignedUploadUrl, makeProductKey } from "../../../services/s3.js";

export async function getUploadUrlFn({ sku, fileName, contentType }) {
  if (!sku) throw new Error("sku is required");
  if (!fileName) throw new Error("fileName is required");
  if (!contentType) throw new Error("contentType is required");
  const key = makeProductKey({ sku, fileName });
  return getPresignedUploadUrl({ key, contentType });
}
