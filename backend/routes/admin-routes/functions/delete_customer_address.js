import Customer from "../../../models/Customer.js";

export async function deleteCustomerAddressFn(params) {
  const { id, addrId } = params || {};
  if (!id || !addrId)
    return { status: 400, body: { error: "id and addrId are required" } };

  const updated = await Customer.findByIdAndUpdate(
    id,
    { $pull: { addresses: { _id: addrId } } },
    { new: true }
  ).lean();

  if (!updated)
    return { status: 404, body: { error: "Customer or address not found" } };
  return { status: 200, body: updated };
}
