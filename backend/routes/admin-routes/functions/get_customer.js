import Customer from "../../../models/Customer.js";

export async function getCustomerFn(params) {
  const { id } = params || {};
  if (!id) return { status: 400, body: { error: "id is required" } };
  const customer = await Customer.findById(id).lean();
  if (!customer) return { status: 404, body: { error: "Customer not found" } };
  return { status: 200, body: customer };
}
