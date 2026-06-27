import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { IconButton, Tooltip } from "@mui/material";
import {
  IoChatbubbleEllipsesOutline,
  IoClose,
  IoSend,
  IoSparkles,
} from "react-icons/io5";
import toast from "react-hot-toast";
import useAiStore from "../store/aiStore";
import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";
import formatMoney from "../utils/MoneyFormat";
import { getProductPreviewImage } from "../utils/productImages";

const getModels = (product) => product?.modelsId || product?.models || [];

const getProductImage = (product) =>
  getProductPreviewImage(product) || product?.image || "";

const getModelId = (model) => model?._id || model?.modelId;

const getFinalPrice = (model) => {
  const salePrice = Number(model?.salePrice || 0);
  const discount = Number(model?.discount || 0);
  return salePrice - salePrice * (discount / 100);
};

const RecommendationItem = ({ product }) => {
  const models = getModels(product);
  const selectedModel = models[0];
  const { addToCart, isLoading } = useCartStore();
  const user = useAuthStore((state) => state.user);
  const image = getProductImage(product);
  const finalPrice = getFinalPrice(selectedModel);
  const modelId = getModelId(selectedModel);

  const handleAddToCart = async () => {
    if (!modelId) {
      toast.error("Sản phẩm chưa có model để thêm vào giỏ hàng");
      return;
    }

    await addToCart({
      userId: user?._id,
      modelId,
      quantity: 1,
    });
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
      <div className="flex gap-3">
        <Link
          to={`/product/${product.productUrl}`}
          className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-md bg-gray-100"
        >
          {image ? (
            <img
              src={image}
              alt={product.productName}
              className="h-full w-full object-contain"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
              No image
            </div>
          )}
        </Link>

        <div className="min-w-0 flex-1">
          <Link
            to={`/product/${product.productUrl}`}
            className="line-clamp-2 text-sm font-semibold text-gray-800 hover:text-[#0d68f3]"
          >
            {product.productName}
            {selectedModel?.modelName ? ` - ${selectedModel.modelName}` : ""}
          </Link>
          <p className="mt-1 text-sm font-bold text-highlight">
            {formatMoney(finalPrice)}
          </p>
          {product.aiReason && (
            <p className="mt-1 line-clamp-2 text-xs text-gray-500">
              {product.aiReason}
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        className="mt-3 w-full rounded-md border border-[#0d68f3] px-3 py-2 text-sm font-semibold text-[#0d68f3] transition hover:bg-[#0d68f3] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        onClick={handleAddToCart}
        disabled={isLoading}
      >
        Thêm vào giỏ hàng
      </button>
    </div>
  );
};

const initialMessages = [
  {
    role: "assistant",
    content:
      "Xin chào! Bạn mô tả nhu cầu, ngân sách hoặc thương hiệu mong muốn, mình sẽ gợi ý sản phẩm phù hợp.",
  },
];

const AiChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const { getRecommendations, isLoading, error, clearError } = useAiStore();
  const inputRef = useRef(null);

  const history = useMemo(
    () =>
      messages
        .filter(
          (message) =>
            message.role === "user" || message.role === "assistant",
        )
        .slice(-8)
        .map(({ role, content }) => ({ role, content })),
    [messages],
  );

  const openWidget = () => {
    setIsOpen(true);
    clearError();
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const message = input.trim();

    if (!message || isLoading) return;

    setInput("");
    const nextMessages = [...messages, { role: "user", content: message }];
    setMessages(nextMessages);

    try {
      const result = await getRecommendations({
        message,
        history: history.slice(-6),
      });

      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content:
            result.reply ||
            "Mình đã tìm một vài sản phẩm phù hợp cho bạn.",
        },
      ]);
      setRecommendedProducts(result.products || []);
    } catch (submitError) {
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: submitError.message,
        },
      ]);
    }
  };

  return (
    <div className="fixed bottom-5 right-3 z-[100]">
      {isOpen && (
        <div className="flex h-[min(620px,calc(100vh-2.5rem))] w-[calc(100vw-1.5rem)] max-w-[390px] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-[#0d68f3] px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <IoSparkles size={20} />
              <div>
                <h3 className="font-semibold leading-tight">Trợ lý AI</h3>
                <p className="text-xs text-blue-100">Gợi ý sản phẩm phù hợp</p>
              </div>
            </div>
            <IconButton
              size="small"
              onClick={() => setIsOpen(false)}
              className="!text-white"
              aria-label="Đóng trợ lý AI"
            >
              <IoClose />
            </IconButton>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-[#0d68f3] text-white"
                      : "bg-white text-gray-700 shadow-sm"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="w-fit rounded-2xl bg-white px-3 py-2 text-sm text-gray-500 shadow-sm">
                Đang tìm sản phẩm phù hợp...
              </div>
            )}

            {error && !isLoading && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {recommendedProducts.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Sản phẩm gợi ý
                </p>
                {recommendedProducts.map((product) => (
                  <RecommendationItem
                    key={product._id || product.productId}
                    product={product}
                  />
                ))}
              </div>
            )}
          </div>

          <form
            className="flex items-center gap-2 border-t border-gray-200 bg-white p-3"
            onSubmit={handleSubmit}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ví dụ: inverter cho gia đình 5kW..."
              className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#0d68f3]"
              maxLength={1000}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0d68f3] text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              aria-label="Gửi tin nhắn"
            >
              <IoSend size={18} />
            </button>
          </form>
        </div>
      )}

      {!isOpen && (
        <Tooltip title="Trợ lý AI" placement="left" arrow>
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0d68f3] text-white shadow-md transition hover:scale-105 hover:bg-blue-700"
            onClick={openWidget}
            aria-label="Mở trợ lý AI"
          >
            <IoChatbubbleEllipsesOutline size={27} />
          </button>
        </Tooltip>
      )}
    </div>
  );
};

export default AiChatWidget;
