import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import {
  buildReplaceCartMongoOp,
  buildSetCartItemMongoUpdate,
  cartHashToItems,
  mergeResultPairsToItems,
} from "../service/cart-merge.helper.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const serverRoot = resolve(__dirname, "..");

test("cartHashToItems converts Redis product fields into persisted cart items", () => {
  assert.deepEqual(
    cartHashToItems({
      "product:model-1": "2",
      ignored: "5",
      "product:model-2": "0",
      "product:model-3": 4,
    }),
    [
      { modelId: "model-1", quantity: 2 },
      { modelId: "model-3", quantity: 4 },
    ],
  );
});

test("mergeResultPairsToItems converts Lua result pairs into positive cart items", () => {
  assert.deepEqual(
    mergeResultPairsToItems(["model-1", "3", "model-2", 0, null, 4]),
    [{ modelId: "model-1", quantity: 3 }],
  );
});

test("buildReplaceCartMongoOp replaces the whole cart document atomically", () => {
  const userId = "user-1";
  const items = [{ modelId: "model-1", quantity: 2 }];

  assert.deepEqual(buildReplaceCartMongoOp(userId, items), {
    updateOne: {
      filter: { userId },
      update: { $set: { userId, items } },
      upsert: true,
    },
  });
});

test("buildSetCartItemMongoUpdate removes old ObjectId-like matches before appending", () => {
  const update = buildSetCartItemMongoUpdate(
    "user-1",
    "64f1c0ffee00000000000001",
    "3",
  );

  assert.equal(update.filter.userId, "user-1");
  assert.equal(update.options.upsert, true);
  assert.deepEqual(update.update[0].$set.items.$filter.cond, {
    $ne: [
      { $toString: "$$item.modelId" },
      "64f1c0ffee00000000000001",
    ],
  });
  assert.deepEqual(update.update[1].$set.items.$concatArrays[1], [
    { modelId: "64f1c0ffee00000000000001", quantity: 3 },
  ]);
});

test("buildSetCartItemMongoUpdate does not upsert empty carts for removals", () => {
  const update = buildSetCartItemMongoUpdate("user-1", "model-1", 0);

  assert.equal(update.options.upsert, false);
  assert.equal(update.update.length, 1);
});

test("mergeCart passes absolute expiry timestamps into cart-wide Lua", async () => {
  const source = await readFile(
    resolve(serverRoot, "service", "cart.service.js"),
    "utf8",
  );

  assert.match(source, /getCartExpireAt\("USER"\)/);
  assert.match(source, /getReserveExpireAt\(\)/);
  assert.match(source, /keys: \[guestKey, userKey, "reservation:zset"\]/);
  assert.doesNotMatch(source, /CART_TTL_REDIS\.USER\.toString\(\)/);
  assert.doesNotMatch(source, /CART_TTL_REDIS\.RESERVATION\.toString\(\)/);
});

test("MERGE_CART_LUA handles the whole guest cart and reserves stale lines", async () => {
  const source = await readFile(
    resolve(serverRoot, "scripts", "cart.lua.js"),
    "utf8",
  );

  assert.match(source, /redis\.call\("HGETALL", guestCartKey\)/);
  assert.match(source, /for i = 1, #guestCart, 2 do/);
  assert.match(source, /math\.min\(guestQty, available\)/);
  assert.match(source, /redis\.call\("DEL", guestCartKey\)/);
});
