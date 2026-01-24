import ProductModel from "../model/product.model.js";
import ModelsModel from "../model/productModel.model.js";

async function formatCartItemInfo(items) {
  if (!items || items.length === 0) return [];

  const formattedItems = await Promise.all(
    items.map(async (item) => {
      const model = await ModelsModel.findById(item.modelId).lean();
      if (!model) return null;

      const product = await ProductModel.findById(model.productId).lean();

      return {
        modelId: item.modelId,
        quantity: item.quantity,
        modelName: model.modelName,
        price: model.salePrice,
        discount: model.discount,
        productId: product?._id,
        productName: product?.productName,
        images: product?.images,
        slug: product?.productUrl,
      };
    })
  );

  // Lọc null (trường hợp model bị xoá)
  return formattedItems.filter(Boolean);
}

export { formatCartItemInfo };
