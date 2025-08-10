// src/routes/sales/sales.controller.js
import { listMyCustomersFn } from "./functions/list_my_customers.js";
import { listMyOrdersFn } from "./functions/list_my_orders.js";

export async function listMyCustomers(req, res, next) {
  try {
    res.json(await listMyCustomersFn(req.user.id));
  } catch (e) {
    next(e);
  }
}

export async function listMyOrders(req, res, next) {
  try {
    res.json(await listMyOrdersFn(req.user.id));
  } catch (e) {
    next(e);
  }
}
