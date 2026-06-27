const toModelIdString = (modelId) => modelId?.toString();

const toPositiveQuantity = (quantity) => {
  const parsed = Number(quantity);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

const cartHashToItems = (cartHash = {}) =>
  Object.entries(cartHash).flatMap(([field, quantity]) => {
    const match = field.match(/^product:(.+)$/);
    if (!match) return [];

    const normalizedQty = toPositiveQuantity(quantity);
    if (normalizedQty <= 0) return [];

    return [{ modelId: match[1], quantity: normalizedQty }];
  });

const mergeResultPairsToItems = (mergeResultPairs = []) => {
  const items = [];

  for (let i = 0; i < mergeResultPairs.length; i += 2) {
    const modelId = toModelIdString(mergeResultPairs[i]);
    const quantity = toPositiveQuantity(mergeResultPairs[i + 1]);

    if (modelId && quantity > 0) items.push({ modelId, quantity });
  }

  return items;
};

const buildReplaceCartMongoOp = (userId, items) => ({
  updateOne: {
    filter: { userId },
    update: { $set: { userId, items } },
    upsert: true,
  },
});

const buildSetCartItemMongoUpdate = (userId, modelId, quantity) => {
  const normalizedModelId = toModelIdString(modelId);
  const normalizedQty = toPositiveQuantity(quantity);

  const removeExistingItemStage = {
    $set: {
      userId,
      items: {
        $filter: {
          input: { $ifNull: ["$items", []] },
          as: "item",
          cond: {
            $ne: [{ $toString: "$$item.modelId" }, normalizedModelId],
          },
        },
      },
    },
  };

  if (normalizedQty <= 0) {
    return {
      filter: { userId },
      update: [removeExistingItemStage],
      options: { upsert: false },
    };
  }

  return {
    filter: { userId },
    update: [
      removeExistingItemStage,
      {
        $set: {
          items: {
            $concatArrays: [
              "$items",
              [{ modelId: normalizedModelId, quantity: normalizedQty }],
            ],
          },
        },
      },
    ],
    options: { upsert: true },
  };
};

export {
  buildReplaceCartMongoOp,
  buildSetCartItemMongoUpdate,
  cartHashToItems,
  mergeResultPairsToItems,
};
