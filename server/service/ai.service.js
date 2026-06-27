import OpenAI from "openai";
import mongoose from "mongoose";
import ProductModel from "../model/product.model.js";

const MAX_MESSAGE_LENGTH = 1000;
const MAX_HISTORY_ITEMS = 8;
const MAX_CATALOG_ITEMS = 40;
const MAX_RECOMMENDATIONS = 5;

const createHttpError = (statusCode, message) =>
  Object.assign(new Error(message), { statusCode });

const stripHtml = (value = "") =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const normalizeText = (value = "") =>
  value
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const unique = (items) => [...new Set(items.filter(Boolean))];

const sanitizeHistory = (history = []) => {
  if (!Array.isArray(history)) return [];

  return history
    .slice(-MAX_HISTORY_ITEMS)
    .map((item) => ({
      role: item?.role === "assistant" ? "assistant" : "user",
      content: String(item?.content || "").slice(0, MAX_MESSAGE_LENGTH),
    }))
    .filter((item) => item.content.trim());
};

const extractKeywords = (message) => {
  const ignoredWords = new Set([
    "toi",
    "can",
    "muon",
    "tim",
    "cho",
    "mot",
    "san",
    "pham",
    "hang",
    "gia",
    "voi",
    "the",
    "nao",
    "hay",
    "goi",
    "y",
    "minh",
    "i",
    "need",
    "want",
    "for",
    "with",
    "and",
    "the",
    "a",
    "an",
  ]);

  return unique(
    normalizeText(message)
      .split(/[^a-z0-9]+/)
      .filter((word) => word.length > 2 && !ignoredWords.has(word)),
  ).slice(0, 12);
};

const getDiscountPrice = (model) => {
  const price = Number(model?.salePrice || 0);
  const discount = Number(model?.discount || 0);
  return Math.max(price - price * (discount / 100), 0);
};

const compactProduct = (product) => {
  const models = (product.modelsId || []).slice(0, 4);
  const firstModel = models[0];

  return {
    productId: product._id.toString(),
    productName: product.productName,
    productUrl: product.productUrl,
    brand: product.brandId?.name || "",
    categories: (product.categoryIds || []).map((category) => category.name),
    description: stripHtml(product.description).slice(0, 260),
    image: firstModel?.images?.[0] || "",
    models: models.map((model) => ({
      modelId: model._id.toString(),
      modelName: model.modelName || "Default",
      salePrice: Number(model.salePrice || 0),
      discount: Number(model.discount || 0),
      finalPrice: getDiscountPrice(model),
      stockQuantity: Number(model.stockQuantity || 0),
      specifications: stripHtml(model.specifications).slice(0, 260),
    })),
  };
};

const getActiveProducts = () =>
  ProductModel.find({ status: "active" })
    .sort({ updatedAt: -1 })
    .limit(120)
    .populate("brandId", "name slug")
    .populate("categoryIds", "name slug parentId")
    .populate(
      "modelsId",
      "modelName salePrice discount stockQuantity images specifications",
    )
    .lean();

const scoreProduct = (product, keywords) => {
  if (keywords.length === 0) return 0;

  const searchable = normalizeText(
    [
      product.productName,
      product.description,
      product.brandId?.name,
      ...(product.categoryIds || []).map((category) => category.name),
      ...(product.modelsId || []).flatMap((model) => [
        model.modelName,
        stripHtml(model.specifications),
      ]),
    ].join(" "),
  );

  return keywords.reduce(
    (score, keyword) => score + (searchable.includes(keyword) ? 1 : 0),
    0,
  );
};

const buildShortlist = (products, keywords) => {
  const scoredProducts = products
    .map((product) => ({ product, score: scoreProduct(product, keywords) }))
    .sort((a, b) => b.score - a.score);

  const matchingProducts = scoredProducts.filter((item) => item.score > 0);
  const source = matchingProducts.length > 0 ? matchingProducts : scoredProducts;

  return source
    .slice(0, MAX_CATALOG_ITEMS)
    .map((item) => compactProduct(item.product));
};

const parseAiJson = (content) => {
  if (!content) return null;

  try {
    return JSON.parse(content);
  } catch {
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
};

const createOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY) return null;
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
};

const callOpenAI = async ({ message, history, catalog }) => {
  const client = createOpenAIClient();
  if (!client) return null;

  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    response_format: { type: "json_object" },
    temperature: 0.3,
    messages: [
      {
        role: "system",
        content:
          "You are a Vietnamese ecommerce product assistant. Recommend only products and models from the provided catalog. Return strict JSON with keys: reply, recommendations, filters. reply must be concise Vietnamese. recommendations is an array of objects with productId, modelId, reason. filters has keywords array, minPrice, maxPrice.",
      },
      ...history,
      {
        role: "user",
        content: JSON.stringify({
          customerRequest: message,
          catalog,
        }),
      },
    ],
  });

  return parseAiJson(completion.choices?.[0]?.message?.content);
};

const fallbackResponse = (message, products, keywords) => {
  const shortlist = buildShortlist(products, keywords).slice(0, MAX_RECOMMENDATIONS);

  return {
    reply:
      shortlist.length > 0
        ? "Mình đã tìm vài sản phẩm phù hợp nhất với nhu cầu của bạn. Bạn có thể xem nhanh các gợi ý bên dưới nhé."
        : "Mình chưa tìm thấy sản phẩm thật sự phù hợp. Bạn thử mô tả thêm nhu cầu, công suất, thương hiệu hoặc ngân sách nhé.",
    products: shortlist,
    filters: {
      keywords,
      minPrice: null,
      maxPrice: null,
    },
  };
};

const rehydrateProducts = async (recommendations = []) => {
  const ids = unique(
    recommendations
      .map((item) => item?.productId)
      .filter((id) => mongoose.Types.ObjectId.isValid(id)),
  );

  if (ids.length === 0) return [];

  const products = await ProductModel.find({
    _id: { $in: ids },
    status: "active",
  })
    .populate("brandId", "name slug")
    .populate("categoryIds", "name slug parentId")
    .populate("modelsId")
    .lean();

  const reasonByProductId = new Map(
    recommendations.map((item) => [item.productId, item.reason || ""]),
  );
  const orderByProductId = new Map(ids.map((id, index) => [id, index]));

  return products
    .sort(
      (a, b) =>
        orderByProductId.get(a._id.toString()) -
        orderByProductId.get(b._id.toString()),
    )
    .slice(0, MAX_RECOMMENDATIONS)
    .map((product) => ({
      ...product,
      aiReason: reasonByProductId.get(product._id.toString()) || "",
    }));
};

const recommendProducts = async ({ message, history }) => {
  const cleanMessage = String(message || "").trim();

  if (!cleanMessage) {
    throw createHttpError(400, "Message is required");
  }

  if (cleanMessage.length > MAX_MESSAGE_LENGTH) {
    throw createHttpError(400, "Message is too long");
  }

  const cleanHistory = sanitizeHistory(history);
  const keywords = extractKeywords(cleanMessage);
  const products = await getActiveProducts();

  if (products.length === 0) {
    return {
      reply: "Hiện chưa có sản phẩm đang hoạt động để gợi ý.",
      products: [],
      filters: { keywords, minPrice: null, maxPrice: null },
    };
  }

  const catalog = buildShortlist(products, keywords);

  try {
    const aiResult = await callOpenAI({
      message: cleanMessage,
      history: cleanHistory,
      catalog,
    });

    const recommendations = Array.isArray(aiResult?.recommendations)
      ? aiResult.recommendations
      : [];
    const recommendedProducts = await rehydrateProducts(recommendations);

    if (recommendedProducts.length > 0) {
      return {
        reply:
          aiResult?.reply ||
          "Mình đã chọn vài sản phẩm phù hợp nhất với nhu cầu của bạn.",
        products: recommendedProducts,
        filters: {
          keywords: Array.isArray(aiResult?.filters?.keywords)
            ? aiResult.filters.keywords
            : keywords,
          minPrice: aiResult?.filters?.minPrice ?? null,
          maxPrice: aiResult?.filters?.maxPrice ?? null,
        },
      };
    }
  } catch (error) {
    console.error("AI recommendation failed:", error.message);
  }

  return fallbackResponse(cleanMessage, products, keywords);
};

export { recommendProducts };
