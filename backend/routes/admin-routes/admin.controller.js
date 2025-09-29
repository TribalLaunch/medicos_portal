// src/routes/admin/admin.controller.js
import { upsertProductFn } from "./functions/upsert_product.js";
import { listOrdersAdminFn } from "./functions/list_orders_admin.js";
import { updateOrderStatusFn } from "./functions/update_order_status.js";
import { getUploadUrlFn } from "./functions/get_upload_url.js";
import { createSalesUserFn } from "./functions/create_sales_user.js";
import {
  assignSalesToCustomerFn,
  unassignSalesFromCustomerFn,
} from "./functions/assign_sales_to_customer.js";
import { addProductImageFn } from "./functions/add_product_image.js";
import { removeProductImageFn } from "./functions/remove_product_image.js";
import { listCustomersFn } from "./functions/list_customers.js";
import { upsertPriceContractFn } from "./functions/upsert_price_contract.js";
import { getPriceContractsFn } from "./functions/get_price_contracts.js";

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
    const { sku, fileName, contentType } = req.body;
    res.json(await getUploadUrlFn({ sku, fileName, contentType }));
  } catch (e) {
    next(e);
  }
}

export async function createSalesUser(req, res, next) {
  try {
    const { email, sendEmail, name } = req.body;
    res.json(await createSalesUserFn({ email, sendEmail, name }));
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

export async function addProductImage(req, res, next) {
  try {
    const { sku, image, makePrimary } = req.body; // image = { key, url, alt }
    res.json(await addProductImageFn({ sku, image, makePrimary }));
  } catch (e) {
    next(e);
  }
}

export async function removeProductImage(req, res, next) {
  try {
    const { sku, key } = req.body;
    res.json(await removeProductImageFn({ sku, key }));
  } catch (e) {
    next(e);
  }
}

export async function listCustomers(req, res, next) {
  try {
    res.json(await listCustomersFn(req, res));
  } catch (e) {
    next(e);
  }
}

export async function upsertPriceContract(req, res, next) {
  try {
    res.json(await upsertPriceContractFn(req, res));
  } catch (e) {
    next(e);
  }
}

export async function getPriceContracts(req, res, next) {
  try {
    res.json(await getPriceContractsFn(req.query));
  } catch (e) {
    next(e);
  }
}
