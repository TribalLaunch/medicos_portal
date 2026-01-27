import Customer from "../../../models/Customer.js";

/**
 * GET /api/customers/me
 * Returns the current authenticated customer's Customer model document.
 * Intended for checkout/profile flows (addresses, customer_number, etc).
 */
export async function getMyCustomerFn({ user }) {
  if (!user?.id) {
    return { status: 401, body: { error: "Not authenticated." } };
  }

  // If you want to restrict to clinic only, uncomment:
  // if (user.role && user.role !== "clinic") {
  //   return { status: 403, body: { error: "Forbidden." } };
  // }

  const customer = await Customer.findById(user.customerId).lean();
  if (!customer) return { status: 404, body: { error: "Customer not found." } };

  // Optional: remove sensitive fields if they exist on your model
  // delete customer.passwordHash;
  // delete customer.resetPasswordTokenHash;
  // delete customer.resetPasswordTokenExpiresAt;

  return { status: 200, body: customer };
}
