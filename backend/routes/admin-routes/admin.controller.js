// src/routes/admin/admin.controller.js
import { upsertProductFn } from "./functions/upsert_product.js";
import { listOrdersAdminFn } from "./functions/list_orders_admin.js";
import { updateOrderStatusFn } from "./functions/update_order_status.js";
import { getUploadUrlFn } from "./functions/get_upload_url.js";
import { deleteImageFn } from "./functions/delete_image.js";
import { createSalesUserFn } from "./functions/createSalesUser.js";
import {
  assignSalesToCustomerFn,
  unassignSalesFromCustomerFn,
} from "./functions/assignSalesToCustomer.js";

export async function upsertProduct(req, res, next) {
  try {
    res.json(await upsertProductFn(req.body));
  } catch (e) {
    next(e);
  }
}

export async function listOrdersAdmin(_req, res, next) {
  try {
    res.json(await listOrdersAdminFn());
  } catch (e) {
    next(e);
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    res.json(await updateOrderStatusFn(req.params.id, req.body.status));
  } catch (e) {
    next(e);
  }
}

export async function getProductUploadUrl(req, res, next) {
  try {
    const { fileName, contentType } = req.body;
    res.json(await getUploadUrlFn({ fileName, contentType }));
  } catch (e) {
    next(e);
  }
}

export async function deleteProductImage(req, res, next) {
  try {
    const { key } = req.body;
    const result = await deleteImageFn({ key });
    res.json(result);
  } catch (e) {
    next(e);
  }
}

export async function createSalesUser(req, res, next) {
  try {
    const { email, sendEmail } = req.body;
    res.json(await createSalesUserFn({ email, sendEmail }));
  } catch (e) {
    next(e);
  }
}

export async function assignSalesToCustomer(req, res, next) {
  try {
    const { customerId, salesUserId } = req.body;
    res.json(await assignSalesToCustomerFn({ customerId, salesUserId }));
  } catch (e) {
    next(e);
  }
}

export async function unassignSalesFromCustomer(req, res, next) {
  try {
    const { customerId } = req.body;
    res.json(await unassignSalesFromCustomerFn({ customerId }));
  } catch (e) {
    next(e);
  }
}
