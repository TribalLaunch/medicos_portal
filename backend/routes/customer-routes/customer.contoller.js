import { getMyCustomerFn } from "./functions/get_my_customer.js";

export async function getMyCustomer(req, res, next) {
  try {
    const { status, body } = await getMyCustomerFn({ user: req.user });
    return res.status(status).json(body);
  } catch (err) {
    return next(err);
  }
}
