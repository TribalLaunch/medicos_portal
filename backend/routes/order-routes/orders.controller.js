// src/routes/orders/orders.controller.js
import { listOrdersFn } from "./functions/list_orders.js";
import { getOrderFn } from "./functions/get_order.js";
import { createOrderFn } from "./functions/create_order.js";
import { createFulfillmentFn } from "./functions/create_fulfillment.js";
import { listFulfillmentsFn } from "./functions/list_fulfillment.js";
import { getFulfillmentFn } from "./functions/get_fulfillment.js";

export async function listOrders(req, res, next) {
  try {
    res.json(await listOrdersFn(req.user));
  } catch (e) {
    next(e);
  }
}

export async function getOrder(req, res, next) {
  try {
    const o = await getOrderFn(req.params.id, req.user);
    if (!o) return res.status(404).json({ message: "Not found" });
    res.json(o);
  } catch (e) {
    next(e);
  }
}

export async function createOrder(req, res, next) {
  try {
    createOrderFn(req, res, next);
  } catch (e) {
    next(e);
  }
}

export async function createFulfillment(req, res, next) {
  try {
    createFulfillmentFn(req, res, next);
  } catch (e) {
    next(e);
  }
}

export async function listFulfillments(req, res, next) {
  try {
    listFulfillmentsFn(req, res, next);
  } catch (e) {
    next(e);
  }
}

export async function getFulfillment(req, res, next) {
  try {
    getFulfillmentFn(req, res, next);
  } catch (e) {
    next(e);
  }
}
