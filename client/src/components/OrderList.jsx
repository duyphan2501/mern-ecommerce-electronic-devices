import { useState } from "react";
import { BiLoader, BiRefresh } from "react-icons/bi";
import {
  FaBoxOpen,
  FaCircleCheck,
  FaClock,
  FaTruck,
  FaXmark,
} from "react-icons/fa6";
import { FiPackage } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import useOrderStore from "../store/orderStore";
import { formatDateTime } from "../utils/DateFormat";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import ConfirmModal from "./ConfirmModal";
import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";
import formatMoney from "../utils/MoneyFormat";

const STATUS_META = {
  pending: {
    label: "Chờ xác nhận",
    icon: <FaClock className="h-5 w-5 text-orange-600" />,
    className: "bg-orange-50 text-orange-700 ring-orange-200",
  },
  confirmed: {
    label: "Đã xác nhận",
    icon: <FiPackage className="h-5 w-5 text-purple-600" />,
    className: "bg-purple-50 text-purple-700 ring-purple-200",
  },
  packing: {
    label: "Đang đóng gói",
    icon: <FaBoxOpen className="h-5 w-5 text-indigo-600" />,
    className: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  },
  shipping: {
    label: "Đang giao",
    icon: <FaTruck className="h-5 w-5 text-blue-600" />,
    className: "bg-blue-50 text-blue-700 ring-blue-200",
  },
  delivered: {
    label: "Đã giao",
    icon: <FaCircleCheck className="h-5 w-5 text-green-600" />,
    className: "bg-green-50 text-green-700 ring-green-200",
  },
  cancelled: {
    label: "Đã hủy",
    icon: <FaXmark className="h-5 w-5 text-red-600" />,
    className: "bg-red-50 text-red-700 ring-red-200",
  },
};

const getStatusMeta = (status) =>
  STATUS_META[status] || {
    label: status || "Không rõ",
    icon: <FaClock className="h-5 w-5 text-gray-500" />,
    className: "bg-gray-50 text-gray-700 ring-gray-200",
  };

const OrderList = ({ orders = [] }) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();
  const { isLoading, setOrderStatus, setOrders, cancelOrder, reOrder } =
    useOrderStore();
  const axiosPrivate = useAxiosPrivate();

  const openConfirmModal = (event, order, type) => {
    event.stopPropagation();
    setSelectedOrder({ ...order, type });
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSelectedOrder(null);
  };

  const confirmCancelOrder = async () => {
    if (!selectedOrder || isLoading) return;
    await cancelOrder(axiosPrivate, selectedOrder._id);
    closeCancelModal();
  };

  const handleReOrder = async (orderId) => {
    if (!orderId || isLoading) return;

    const result = await reOrder(axiosPrivate, orderId);
    if (result?.success) {
      const user = useAuthStore.getState().user;
      await useCartStore.getState().loadCart(user?._id);
      navigate("/cart");
    }
  };

  const handleDeleteOrder = async () => {
    if (!selectedOrder || isLoading) return;
    const deletedOrder = await setOrderStatus(
      axiosPrivate,
      selectedOrder._id,
      "deleted",
    );
    if (deletedOrder) {
      setOrders(orders.filter((order) => order._id !== deletedOrder._id));
    }
    closeCancelModal();
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="flex min-h-80 items-center justify-center rounded-md bg-gray-50">
        <BiLoader className="h-8 w-8 animate-spin text-gray-600" />
      </div>
    );
  }

  return (
    <div>
      {showCancelModal && selectedOrder && (
        <ConfirmModal
          title={
            selectedOrder.type === "cancel"
              ? "Xác nhận hủy đơn"
              : "Xác nhận xóa đơn"
          }
          order={selectedOrder}
          confirmMessage={
            selectedOrder.type === "cancel"
              ? "Bạn có chắc chắn muốn hủy đơn hàng này không?"
              : "Bạn có chắc chắn muốn xóa đơn hàng này không?"
          }
          onConfirm={
            selectedOrder.type === "cancel"
              ? confirmCancelOrder
              : handleDeleteOrder
          }
          onCancel={closeCancelModal}
        />
      )}

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
            <FiPackage className="mx-auto mb-4 h-14 w-14 text-gray-400" />
            <p className="text-lg font-semibold text-gray-700">
              Không có đơn hàng nào
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Thử đổi trạng thái hoặc khoảng ngày để xem thêm đơn hàng.
            </p>
          </div>
        ) : (
          orders.map((order) => {
            const status = getStatusMeta(order.status);

            return (
              <article
                key={order._id}
                className="rounded-md border border-gray-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-center gap-3">
                        {status.icon}
                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-bold text-gray-900">
                            {order.orderId}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Ngày đặt: {formatDateTime(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`w-fit rounded-full px-3 py-1 text-xs font-bold ring-1 ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </div>

                    <div className="divide-y divide-gray-100 rounded-md border border-gray-100">
                      {order.items?.map((product, index) => (
                        <div
                          key={`${product.modelId}-${index}`}
                          className="flex items-center gap-3 p-3"
                        >
                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-gray-100">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <FiPackage className="m-auto mt-4 h-6 w-6 text-gray-400" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p
                              className="truncate text-sm font-semibold text-gray-800"
                              title={product.name}
                            >
                              {product.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Số lượng: {product.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 lg:w-56 lg:items-end">
                    <div className="lg:text-right">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Tổng tiền
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatMoney(order.totalPrice)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 lg:justify-end">
                      {order.status === "cancelled" ? (
                        <>
                          <button
                            type="button"
                            onClick={(event) =>
                              openConfirmModal(event, order, "delete")
                            }
                            className="rounded-md bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={isLoading}
                          >
                            Xóa
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReOrder(order._id)}
                            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={isLoading}
                          >
                            <BiRefresh className="h-4 w-4" />
                            Đặt lại
                          </button>
                        </>
                      ) : (
                        <>
                          {order.status === "pending" && (
                            <button
                              type="button"
                              onClick={(event) =>
                                openConfirmModal(event, order, "cancel")
                              }
                              className="rounded-md bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                              disabled={isLoading}
                            >
                              Hủy đơn
                            </button>
                          )}
                          {order.status === "delivered" && (
                            <button
                              type="button"
                              onClick={() => handleReOrder(order._id)}
                              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                              disabled={isLoading}
                            >
                              <BiRefresh className="h-4 w-4" />
                              Đặt lại
                            </button>
                          )}
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => navigate(`/order/${order.orderId}`)}
                        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-600"
                      >
                        Chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};

export default OrderList;
