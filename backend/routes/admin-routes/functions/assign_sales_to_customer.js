// src/routes/admin/functions/assignSalesToCustomer.js
import Customer from "../../../models/Customer.js";
import User from "../../../models/User.js";

export async function assignSalesToCustomerFn({ customerId, salesUserId }) {
  const sales = await User.findById(salesUserId);
  if (!sales || sales.role !== "sales") throw new Error("Sales user not found");
  const cust = await Customer.findByIdAndUpdate(
    customerId,
    { $set: { salesRepId: sales._id } },
    { new: true }
  ).lean();
  if (!cust) throw new Error("Customer not found");
  return cust;
}

export async function unassignSalesFromCustomerFn({ customerId }) {
  const cust = await Customer.findByIdAndUpdate(
    customerId,
    { $unset: { salesRepId: 1 } },
    { new: true }
  ).lean();
  if (!cust) throw new Error("Customer not found");
  return cust;
}
