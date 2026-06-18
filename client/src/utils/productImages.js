export const getModelImages = (model) =>
  Array.isArray(model?.images) ? model.images.filter(Boolean) : [];

export const getSelectedModel = (product, selectedModelIndex = 0) =>
  product?.modelsId?.[selectedModelIndex] || product?.modelsId?.[0] || null;

export const getSelectedModelImages = (product, selectedModelIndex = 0) =>
  getModelImages(getSelectedModel(product, selectedModelIndex));

export const getProductPreviewImage = (product, selectedModelIndex = 0) =>
  getSelectedModelImages(product, selectedModelIndex)[0] || "";
