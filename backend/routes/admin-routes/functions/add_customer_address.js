import Customer from "../../../models/Customer.js";
import mongoose from "mongoose";

export async function addCustomerAddressFn(params, body) {
  const { id } = params || {};
  if (!id) return { status: 400, body: { error: "id is required" } };

  const {
    label,
    line1,
    line2,
    city,
    state,
    zip,
    country = "US",
    isDefault = false,
  } = body || {};
  if (!label || !line1 || !city || !state || !zip) {
    return {
      status: 400,
      body: { error: "label, line1, city, state, zip are required" },
    };
  }

  const addr = {
    _id: new mongoose.Types.ObjectId(),
    label,
    line1,
    line2,
    city,
    state,
    zip,
    country,
    isDefault: !!isDefault,
  };

  const updated = await Customer.findByIdAndUpdate(
    id,
    { $push: { addresses: addr } },
    { new: true }
  ).lean();

  if (!updated) return { status: 404, body: { error: "Customer not found" } };
  return { status: 200, body: updated };
}
