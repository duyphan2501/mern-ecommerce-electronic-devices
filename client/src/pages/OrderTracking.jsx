import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BiCreditCard, BiLoader, BiMapPin, BiPackage } from "react-icons/bi";
import {
  FaBoxOpen,
  FaCircleCheck,
  FaClock,
  FaTruck,
  FaXmark,
} from "react-icons/fa6";
import formatMoney from "../utils/MoneyFormat";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useOrderStore from "../store/orderStore";
import { formatDateTime } from "../utils/DateFormat";

const ORDER_STEPS = [
  { value: "pending", label: "Chờ xác nhận" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "packing", label: "Đang đóng gói" },
  { value: "shipping", label: "Đang giao" },
  { value: "delivered", label: "Đã giao" },
];

const STATUS_META = {
  pending: {
    label: "Chờ xác nhận",
    description: "Đơn hàng đã được tạo và đang chờ cửa hàng xác nhận.",
    icon: <FaClock className="h-6 w-6 text-orange-600" />,
    cardClass: "border-orange-300 bg-orange-50 text-orange-800",
  },
  confirmed: {
    label: "Đã xác nhận",
    description: "Cửa hàng đã xác nhận đơn và đang chuẩn bị xử lý.",
    icon: <BiPackage className="h-6 w-6 text-purple-600" />,
    cardClass: "border-purple-300 bg-purple-50 text-purple-800",
  },
  packing: {
    label: "Đang đóng gói",
    description: "Sản phẩm đang được đóng gói trước khi bàn giao vận chuyển.",
    icon: <FaBoxOpen className="h-6 w-6 text-indigo-600" />,
    cardClass: "border-indigo-300 bg-indigo-50 text-indigo-800",
  },
  shipping: {
    label: "Đang giao",
    description: "Đơn hàng đang trên đường giao đến bạn.",
    icon: <FaTruck className="h-6 w-6 text-blue-600" />,
    cardClass: "border-blue-300 bg-blue-50 text-blue-800",
  },
  delivered: {
    label: "Đã giao",
    description: "Đơn hàng đã được giao thành công.",
    icon: <FaCircleCheck className="h-6 w-6 text-green-600" />,
    cardClass: "border-green-300 bg-green-50 text-green-800",
  },
  cancelled: {
    label: "Đã hủy",
    description: "Đơn hàng đã bị hủy và không tiếp tục giao.",
    icon: <FaXmark className="h-6 w-6 text-red-600" />,
    cardClass: "border-red-300 bg-red-50 text-red-800",
  },
};

const PAYMENT_PROVIDER_LABEL = {
  cod: "Thanh toán khi nhận hàng",
  payos: "Thanh toán qua PayOS",
};

const PAYMENT_STATUS_LABEL = {
  pending: "Chưa thanh toán",
  paid: "Đã thanh toán",
  cancelled: "Đã hủy",
  failed: "Thanh toán thất bại",
};

const getStatusMeta = (status) =>
  STATUS_META[status] || {
    label: status || "Không rõ",
    description: "Trạng thái đơn hàng đang được cập nhật.",
    icon: <FaClock className="h-6 w-6 text-gray-500" />,
    cardClass: "border-gray-300 bg-gray-50 text-gray-800",
  };

const OrderTracking = () => {
  const { orderId } = useParams();
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getOrderById } = useOrderStore();
  const axiosPrivate = useAxiosPrivate();

  const fetchOrder = useCallback(async () => {
    try {
      if (!orderId) return;
      setLoading(true);
      const result = await getOrderById(axiosPrivate, orderId);
      setCurrentOrder(result || null);
    } catch (err) {
      console.error("Error fetching order:", err);
      setCurrentOrder(null);
    } finally {
      setLoading(false);
    }
  }, [axiosPrivate, getOrderById, orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const statusMeta = getStatusMeta(currentOrder?.status);
  const currentStepIndex = useMemo(
    () => ORDER_STEPS.findIndex((step) => step.value === currentOrder?.status),
    [currentOrder?.status],
  );
  const createdAt = currentOrder?.createdAt
    ? formatDateTime(currentOrder.createdAt)
    : "";
  const [createdDate, createdTime] = createdAt.split(" ");
  const shippingInfo = currentOrder?.shippingInfo || {};
  const payment = currentOrder?.payment || {};
  const itemsTotal =
    currentOrder?.items?.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
      0,
    ) || 0;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <BiLoader className="h-8 w-8 animate-spin text-gray-600" />
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="rounded-md border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
          <BiPackage className="mx-auto mb-3 h-12 w-12 text-gray-400" />
          <p className="text-lg font-bold text-gray-800">
            Không tìm thấy đơn hàng
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Mã đơn không tồn tại hoặc bạn không có quyền xem đơn này.
          </p>
          <Link
            to="/my-account/orders"
            className="mt-5 inline-flex rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            Quay lại đơn hàng
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Theo dõi đơn hàng
            </p>
            <h1 className="text-2xl font-bold text-gray-900">
              {currentOrder.orderId}
            </h1>
          </div>
          <Link
            to="/my-account/orders"
            className="w-fit rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 transition hover:border-blue-500 hover:text-blue-600"
          >
            Quay lại danh sách
          </Link>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase text-gray-500">
              Ngày đặt hàng
            </p>
            <p className="mt-2 text-lg font-bold text-gray-900">
              {createdDate || "Đang cập nhật"}
            </p>
            <p className="text-sm text-gray-500">
              {createdTime ? `Lúc ${createdTime}` : ""}
            </p>
          </div>

          <div className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase text-gray-500">
              Trạng thái hiện tại
            </p>
            <div className="mt-2 flex items-center gap-3">
              {statusMeta.icon}
              <p className="text-lg font-bold text-gray-900">
                {statusMeta.label}
              </p>
            </div>
          </div>

          <div className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase text-gray-500">
              Tổng tiền
            </p>
            <p className="mt-2 text-lg font-bold text-gray-900">
              {formatMoney(currentOrder.totalPrice)}
            </p>
            <p className="text-sm text-gray-500">
              {PAYMENT_PROVIDER_LABEL[payment.provider] || "Đang cập nhật"}
            </p>
          </div>
        </div>

        <section className="mb-6 rounded-md border border-gray-200 bg-white p-5 shadow-sm">
          <div
            className={`mb-6 rounded-md border-l-4 p-4 ${statusMeta.cardClass}`}
          >
            <div className="flex items-start gap-3">
              {statusMeta.icon}
              <div>
                <h2 className="text-lg font-bold">{statusMeta.label}</h2>
                <p className="mt-1 text-sm">{statusMeta.description}</p>
              </div>
            </div>
          </div>

          {currentOrder.status !== "cancelled" ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
              {ORDER_STEPS.map((step, index) => {
                const isDone = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                return (
                  <div key={step.value} className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${
                        isDone
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-gray-300 bg-white text-gray-400"
                      }`}
                    >
                      {isDone ? <FaCircleCheck className="h-4 w-4" /> : index + 1}
                    </div>
                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          isCurrent ? "text-blue-700" : "text-gray-700"
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              Đơn hàng đã hủy nên không còn tiến trình giao hàng.
            </p>
          )}
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <section className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-gray-900">Sản phẩm</h2>
            <div className="divide-y divide-gray-100 rounded-md border border-gray-100">
              {currentOrder.items?.map((product, index) => (
                <div
                  key={`${product.modelId}-${index}`}
                  className="flex gap-4 p-4"
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-gray-100">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <BiPackage className="m-auto mt-6 h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-gray-900">{product.name}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      Số lượng: {product.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {formatMoney(product.price)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatMoney(product.price * product.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-2 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tạm tính</span>
                <span>{formatMoney(itemsTotal)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Tổng cộng</span>
                <span>{formatMoney(currentOrder.totalPrice)}</span>
              </div>
            </div>
          </section>

          <div className="space-y-6">
            <section className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <BiMapPin className="h-5 w-5 text-gray-600" />
                <h2 className="font-bold text-gray-900">Địa chỉ giao hàng</h2>
              </div>
              <div className="space-y-2 text-sm text-gray-700">
                <p className="font-semibold">
                  {shippingInfo.receiver || "Đang cập nhật"}
                </p>
                <p>{shippingInfo.phone || "Đang cập nhật"}</p>
                <p>
                  {[shippingInfo.addressDetail, shippingInfo.ward, shippingInfo.province]
                    .filter(Boolean)
                    .join(", ") || "Đang cập nhật"}
                </p>
              </div>
            </section>

            <section className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <BiCreditCard className="h-5 w-5 text-gray-600" />
                <h2 className="font-bold text-gray-900">
                  Phương thức thanh toán
                </h2>
              </div>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between gap-4">
                  <span>Phương thức</span>
                  <span className="font-semibold">
                    {PAYMENT_PROVIDER_LABEL[payment.provider] || "Đang cập nhật"}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Trạng thái</span>
                  <span className="font-semibold">
                    {PAYMENT_STATUS_LABEL[payment.status] || "Đang cập nhật"}
                  </span>
                </div>
              </div>
            </section>

            {currentOrder.shipment?.trackingCode && (
              <section className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <FaTruck className="h-5 w-5 text-gray-600" />
                  <h2 className="font-bold text-gray-900">
                    Thông tin vận chuyển
                  </h2>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    Mã vận đơn:{" "}
                    <span className="font-semibold">
                      {currentOrder.shipment.trackingCode}
                    </span>
                  </p>
                  {currentOrder.shipment.carrier && (
                    <p>Đơn vị: {currentOrder.shipment.carrier}</p>
                  )}
                  {currentOrder.shipment.trackingUrl && (
                    <a
                      href={currentOrder.shipment.trackingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex font-semibold text-blue-600 hover:underline"
                    >
                      Xem vận chuyển
                    </a>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
