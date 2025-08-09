// src/routes/orders/orders.controller.js
import { listOrdersFn } from "./functions/list_orders.js";
import { getOrderFn } from "./functions/get_order.js";
import { createOrderFn } from "./functions/create_order.js";

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
    res.json(await createOrderFn(req.body));
  } catch (e) {
    next(e);
  }
}
