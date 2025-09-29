import Customer from "../../../models/Customer.js";
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

export async function listCustomersFn({ query }) {
  const {
    q, // text search across name/email/customer_number (adjust to your schema)
    page = 1,
    pageSize = 25,
    sort = "-createdAt",
  } = query || {};

  const pageNum = clamp(parseInt(page, 10) || 1, 1, 1e6);
  const sizeNum = clamp(parseInt(pageSize, 10) || 25, 1, 100);

  const filter = {};
  if (q && q.trim()) {
    // If you have a text index on customer fields:
    filter.$or = [
      { customer_name: { $regex: q.trim(), $options: "i" } },
      { primary_email: { $regex: q.trim(), $options: "i" } },
      { customer_number: { $regex: q.trim(), $options: "i" } },
    ];
  }

  const projection = {}; // select what you need in list view

  const [data, total] = await Promise.all([
    Customer.find(filter)
      .select(projection)
      .sort(sort)
      .skip((pageNum - 1) * sizeNum)
      .limit(sizeNum)
      .lean(),
    Customer.countDocuments(filter),
  ]);

  return {
    status: 200,
    body: {
      data,
      total,
      page: pageNum,
      pageSize: sizeNum,
      hasMore: pageNum * sizeNum < total,
    },
  };
}

// // functions/admin_routes/listCustomers.js
// import Customer from "../../../models/Customer.js";

// export async function listCustomersFn(req, res) {
//   try {
//     const { page = 1, limit = 25, q = "", sort = "-createdAt" } = req.query;

//     const filter = q
//       ? {
//           $or: [
//             { name: { $regex: q, $options: "i" } },
//             { email: { $regex: q, $options: "i" } },
//             { company: { $regex: q, $options: "i" } },
//             { phone: { $regex: q, $options: "i" } },
//           ],
//         }
//       : {};

//     const [items, total] = await Promise.all([
//       Customer.find(filter)
//         .sort(sort)
//         .skip((Number(page) - 1) * Number(limit))
//         .limit(Number(limit))
//         .lean(),
//       Customer.countDocuments(filter),
//     ]);

//     res.json({
//       items,
//       pagination: {
//         page: Number(page),
//         limit: Number(limit),
//         total,
//         pages: Math.ceil(total / Number(limit)),
//       },
//     });
//   } catch (err) {
//     console.error("List customers error:", err);
//     res.status(500).json({ message: "Failed to list customers" });
//   }
// }
