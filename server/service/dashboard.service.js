import orderModel from "../model/order.model.js";
import ModelsModel from "../model/productModel.model.js";
import GoodsReceiptModel from "../model/goodsReceipt.model.js";

const ACTIVE_ORDER_FILTER = { status: { $nin: ["draft", "deleted"] } };
const GRANULARITY_FORMATS = {
  daily: "%Y-%m-%d",
  monthly: "%Y-%m",
  annual: "%Y",
};

const parseDateRange = (startDate, endDate) => {
  const end = endDate ? new Date(endDate) : new Date();
  const start = startDate
    ? new Date(startDate)
    : new Date(end.getTime() - 29 * 24 * 60 * 60 * 1000);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    const error = new Error("Invalid dashboard date range");
    error.statusCode = 400;
    throw error;
  }

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  if (start > end) {
    const error = new Error("Start date must be before end date");
    error.statusCode = 400;
    throw error;
  }

  const periodLength = end.getTime() - start.getTime() + 1;
  const previousEnd = new Date(start.getTime() - 1);
  const previousStart = new Date(previousEnd.getTime() - periodLength + 1);
  return { start, end, previousStart, previousEnd };
};

const percentageChange = (current, previous) => {
  if (previous === 0) return current === 0 ? 0 : 100;
  return Number((((current - previous) / previous) * 100).toFixed(1));
};

const getPeriodSummary = async (start, end) => {
  const [summary] = await orderModel.aggregate([
    {
      $match: {
        ...ACTIVE_ORDER_FILTER,
        createdAt: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: null,
        orders: { $sum: 1 },
        customers: { $addToSet: "$userId" },
        revenue: {
          $sum: {
            $cond: [{ $eq: ["$status", "delivered"] }, "$totalPrice", 0],
          },
        },
        itemsSold: {
          $sum: {
            $cond: [
              { $eq: ["$status", "delivered"] },
              {
                $reduce: {
                  input: "$items",
                  initialValue: 0,
                  in: { $add: ["$$value", "$$this.quantity"] },
                },
              },
              0,
            ],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        orders: 1,
        revenue: 1,
        itemsSold: 1,
        customers: { $size: "$customers" },
      },
    },
  ]);
  return summary || { revenue: 0, orders: 0, customers: 0, itemsSold: 0 };
};

const getDateFormat = (granularity) =>
  GRANULARITY_FORMATS[granularity] || GRANULARITY_FORMATS.daily;

const getRevenueSeries = (start, end, granularity) =>
  orderModel.aggregate([
    {
      $match: {
        ...ACTIVE_ORDER_FILTER,
        createdAt: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: getDateFormat(granularity),
            date: "$createdAt",
          },
        },
        orders: { $sum: 1 },
        revenue: {
          $sum: {
            $cond: [{ $eq: ["$status", "delivered"] }, "$totalPrice", 0],
          },
        },
      },
    },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, date: "$_id", orders: 1, revenue: 1 } },
  ]);

const getExpenseSeries = (start, end, granularity) =>
  GoodsReceiptModel.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: getDateFormat(granularity),
            date: "$createdAt",
          },
        },
        expense: { $sum: "$totalCost" },
      },
    },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, date: "$_id", expense: 1 } },
  ]);

const mergeSalesSeries = (revenueSeries, expenseSeries) => {
  const seriesMap = new Map();

  revenueSeries.forEach((item) => {
    seriesMap.set(item.date, {
      date: item.date,
      orders: item.orders || 0,
      revenue: item.revenue || 0,
      expense: 0,
    });
  });

  expenseSeries.forEach((item) => {
    const current = seriesMap.get(item.date) || {
      date: item.date,
      orders: 0,
      revenue: 0,
      expense: 0,
    };
    current.expense = item.expense || 0;
    seriesMap.set(item.date, current);
  });

  return [...seriesMap.values()]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((item) => ({
      ...item,
      profit: item.revenue - item.expense,
    }));
};

const getTopProducts = (start, end) =>
  orderModel.aggregate([
    {
      $match: {
        status: "delivered",
        createdAt: { $gte: start, $lte: end },
      },
    },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.modelId",
        name: { $first: "$items.name" },
        image: { $first: "$items.image" },
        sold: { $sum: "$items.quantity" },
        revenue: {
          $sum: { $multiply: ["$items.price", "$items.quantity"] },
        },
      },
    },
    { $sort: { sold: -1, revenue: -1 } },
    { $limit: 5 },
    {
      $project: {
        _id: 0,
        modelId: "$_id",
        name: 1,
        image: 1,
        sold: 1,
        revenue: 1,
      },
    },
  ]);

const getLowStockItems = () =>
  ModelsModel.aggregate([
    { $match: { $expr: { $lte: ["$stockQuantity", "$minimumQuantity"] } } },
    { $sort: { stockQuantity: 1 } },
    { $limit: 8 },
    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $project: {
        _id: 0,
        modelId: { $toString: "$_id" },
        productId: { $toString: "$productId" },
        name: {
          $cond: [
            { $gt: [{ $strLenCP: { $ifNull: ["$modelName", ""] } }, 0] },
            { $concat: ["$product.productName", " - ", "$modelName"] },
            "$product.productName",
          ],
        },
        image: { $arrayElemAt: ["$product.images", 0] },
        stockQuantity: 1,
        minimumQuantity: 1,
        expectedQuantity: 1,
        salePrice: 1,
      },
    },
  ]);

const getDashboardService = async ({
  startDate,
  endDate,
  granularity = "daily",
}) => {
  const { start, end, previousStart, previousEnd } = parseDateRange(
    startDate,
    endDate,
  );
  const [
    current,
    previous,
    revenueSeries,
    expenseSeries,
    topProducts,
    lowStock,
    recentOrders,
  ] =
    await Promise.all([
      getPeriodSummary(start, end),
      getPeriodSummary(previousStart, previousEnd),
      getRevenueSeries(start, end, granularity),
      getExpenseSeries(start, end, granularity),
      getTopProducts(start, end),
      getLowStockItems(),
      orderModel
        .find(ACTIVE_ORDER_FILTER)
        .sort({ createdAt: -1 })
        .limit(6)
        .select("orderId shippingInfo totalPrice payment status createdAt")
        .lean(),
    ]);

  return {
    range: { start, end },
    summary: {
      revenue: {
        value: current.revenue,
        change: percentageChange(current.revenue, previous.revenue),
      },
      orders: {
        value: current.orders,
        change: percentageChange(current.orders, previous.orders),
      },
      customers: {
        value: current.customers,
        change: percentageChange(current.customers, previous.customers),
      },
      itemsSold: {
        value: current.itemsSold,
        change: percentageChange(current.itemsSold, previous.itemsSold),
      },
    },
    sales: mergeSalesSeries(revenueSeries, expenseSeries),
    topProducts,
    lowStock,
    recentOrders,
  };
};

export { getDashboardService };
