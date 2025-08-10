// src/routes/sales/functions/listMyCustomers.js
import Customer from "../../../models/Customer.js";

export function listMyCustomersFn(userId) {
  return Customer.find({ salesRepId: userId }).sort({ name: 1 }).lean();
}
