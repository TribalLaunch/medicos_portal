// functions/admin_routes/listCustomers.js
import Customer from "../../../models/Customer.js";

export async function listCustomersFn(req, res) {
  try {
    const { page = 1, limit = 25, q = "", sort = "-createdAt" } = req.query;

    const filter = q
      ? {
          $or: [
            { name: { $regex: q, $options: "i" } },
            { email: { $regex: q, $options: "i" } },
            { company: { $regex: q, $options: "i" } },
            { phone: { $regex: q, $options: "i" } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      Customer.find(filter)
        .sort(sort)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .lean(),
      Customer.countDocuments(filter),
    ]);

    res.json({
      items,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    console.error("List customers error:", err);
    res.status(500).json({ message: "Failed to list customers" });
  }
}
