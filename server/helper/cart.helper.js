import ProductModel from "../model/product.model.js";
import ModelsModel from "../model/productModel.model.js";

async function formatCartItemInfo(items) {
  if (!items || items.length === 0) return [];

  const modelIds = items.map(i => i.modelId);
  
  const models = await ModelsModel.find({ _id: { $in: modelIds } }).lean();
  
  const productIds = [...new Set(models.map(m => m.productId))];
  const products = await ProductModel.find({ _id: { $in: productIds } }).lean();

  const productMap = new Map(products.map(p => [p._id.toString(), p]));
  const modelMap = new Map(models.map(m => [m._id.toString(), m]));

  return items.map(item => {
    const model = modelMap.get(item.modelId.toString());
    if (!model) return null;
    
    const product = productMap.get(model.productId.toString());

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
  }).filter(Boolean);
}


export { formatCartItemInfo };
