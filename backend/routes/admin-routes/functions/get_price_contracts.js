import PriceContract from "../../../models/PriceContract.js";
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

export async function getPriceContractsFn(query) {
  const {
    customerId,
    sku,
    page = 1,
    pageSize = 50,
    sort = "sku",
  } = query || {};
  if (!customerId)
    return { status: 400, body: { error: "customerId is required" } };

  const pageNum = clamp(parseInt(page, 10) || 1, 1, 1e6);
  const sizeNum = clamp(parseInt(pageSize, 10) || 50, 1, 200);

  const filter = { customerId };
  if (sku) filter.sku = sku;

  const [data, total] = await Promise.all([
    PriceContract.find(filter)
      .sort(sort)
      .skip((pageNum - 1) * sizeNum)
      .limit(sizeNum)
      .lean(),
    PriceContract.countDocuments(filter),
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

  // res.json({
  //   status: 200,
  //   body: {
  //     data,
  //     total,
  //     page: pageNum,
  //     pageSize: sizeNum,
  //     hasMore: pageNum * sizeNum < total,
  //   },
  // });
}
