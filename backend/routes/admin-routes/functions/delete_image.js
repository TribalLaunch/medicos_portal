import { deleteObject } from "../../../services/s3.js";

export async function deleteImageFn({ key }) {
  if (!key) throw new Error("key is required");
  return deleteObject(key);
}
