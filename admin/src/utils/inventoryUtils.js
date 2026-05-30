export const statusMap = {
  in_stock: { label: "In stock", color: "success" },
  low_stock: { label: "Low stock", color: "warning" },
  out_of_stock: { label: "Out of stock", color: "error" },
};

export const movementTypeLabel = {
  import: "Import",
  order_export: "Order export",
  manual_export: "Manual export",
};

export function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

export function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function getGroupStatus(models) {
  if (models.some((model) => model.status === "out_of_stock")) {
    return "out_of_stock";
  }
  if (models.some((model) => model.status === "low_stock")) {
    return "low_stock";
  }
  return "in_stock";
}

export function groupInventoryItems(items) {
  const groups = new Map();

  items.forEach((item) => {
    const productId = item.productId || item.productName;
    const group = groups.get(productId) || {
      productId,
      productName: item.productName,
      productUrl: item.productUrl,
      image: item.image,
      brand: item.brand,
      models: [],
      totalStock: 0,
      totalStockValue: 0,
      modelCount: 0,
      status: "in_stock",
    };

    group.models.push(item);
    group.totalStock += Number(item.stockQuantity || 0);
    group.totalStockValue += Number(item.stockValue || 0);
    group.modelCount = group.models.length;
    group.status = getGroupStatus(group.models);
    groups.set(productId, group);
  });

  return Array.from(groups.values());
}
