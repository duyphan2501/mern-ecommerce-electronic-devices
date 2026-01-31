import React, { useState, useEffect } from "react";
import { BiLoader, BiRefresh } from "react-icons/bi";
import { FaClock, FaTruck, FaX } from "react-icons/fa6";
import { FiAlertCircle, FiPackage } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import useOrderStore from "../store/orderStore";
import { formatDateTime } from "../utils/DateFormat";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import ConfirmModal from "./ConfirmModal";
import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";

const OrderList = ({ orders }) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();
  const { isLoading, setOrderStatus, setOrders, cancelOrder, reOrder } =
    useOrderStore();
  const axiosPrivate = useAxiosPrivate();

  const openConfirmModal = (e, order, type) => {
    e.stopPropagation();
    order.type = type;
    setSelectedOrder(order);
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

  const getStatusColor = (status) => {
    switch (status) {
      case "shipping":
        return "bg-blue-100 text-blue-800";
      case "confirmed":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-orange-100 text-orange-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "shipping":
        return <FaTruck className="w-5 h-5 text-blue-600" />;
      case "confirmed":
        return <FiPackage className="w-5 h-5 text-purple-600" />;
      default:
        return <FaClock className="w-5 h-5 text-orange-600" />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-100 bg-gray-50 flex items-center justify-center">
        <BiLoader className="w-8 h-8 animate-spin text-gray-600" />
      </div>
    );
  }

  return (
    <div className="">
      {/* Cancel Confirmation Modal */}
      {showCancelModal && selectedOrder && (
        <ConfirmModal
          title={
            selectedOrder.type === "cancel"
              ? "Xác nhận huỷ đơn"
              : "Xác nhận xoá đơn"
          }
          order={selectedOrder}
          confirmMessage={
            selectedOrder.type === "cancel"
              ? "Bạn có chắc chắn muốn hủy đơn hàng này không?"
              : "Bạn có chắc chắn muốn xoá đơn hàng này không?"
          }
          onConfirm={
            selectedOrder.type === "cancel"
              ? confirmCancelOrder
              : handleDeleteOrder
          }
          onCancel={closeCancelModal}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Orders List */}
        <div className="space-y-4">
          {orders && orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <FiPackage className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-xl font-semibold text-gray-600">
                Không có đơn hàng nào
              </p>
            </div>
          ) : (
            orders &&
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:border-gray-100 transition-all border-2 border-transparent "
              >
                <div className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(order.status)}
                          <h3 className="font-bold text-xl">{order.orderId}</h3>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold w-fit ${getStatusColor(
                            order.status,
                          )}`}
                        >
                          {order.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-FaX-4 gap-y-1 text-sm text-gray-600 mb-3">
                        <p>
                          Ngày đặt:{" "}
                          <span className="font-semibold">
                            {formatDateTime(order.createdAt)}
                          </span>
                        </p>
                      </div>
                      <div className="space-y-1">
                        {order.items.map((product, idx) => (
                          <p
                            key={idx}
                            className="text-sm text-gray-700 line-clamp-1"
                            title={product.name}
                          >
                            • {product.name}{" "}
                            <span className="text-gray-500">
                              (<FaX />
                              {product.quantity})
                            </span>
                          </p>
                        ))}
                      </div>
                    </div>
                    <div className="text-left md:text-right flex-col md:flex justify-between md:justify-start items-center md:items-end gap-2">
                      <div>
                        <p className="text-sm text-gray-600 uppercase">
                          Tổng tiền
                        </p>
                        <p className="font-bold text-2xl">
                          {formatCurrency(order.totalPrice)}
                        </p>
                      </div>
                      {order.status === "cancelled" ? (
                        <div className="flex gap-2 md:mt-0 mt-3 justify-end">
                          <button
                            onClick={(e) =>
                              openConfirmModal(e, order, "delete")
                            }
                            className="bg-red-600 cursor-pointer text-white px-4 py-2 rounded font-bold hover:bg-red-700 transition-colors text-sm whitespace-nowrap flex justify-center items-center gap-2 uppercase"
                          >
                            <FaX />
                            Xoá
                          </button>
                          <button
                            onClick={() => handleReOrder(order._id)}
                            className="bg-blue-500 text-white px-4 py-2 rounded font-bold hover:bg-black transition-colors text-sm whitespace-nowrap flex items-center gap-2 cursor-pointer uppercase"
                          >
                            <BiRefresh className="w-4 h-4" />
                            {isLoading ? "Đang xử lý..." : "Đặt lại"}
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2 md:mt-0 mt-3 justify-end">
                          {/* Nút Hủy đơn - chỉ hiện khi status = pending */}
                          {order.status === "pending" && (
                            <button
                              onClick={(e) =>
                                openConfirmModal(e, order, "cancel")
                              }
                              className="bg-red-600 text-white px-4 py-2 rounded font-bold hover:bg-red-700 transition-colors text-sm whitespace-nowrap flex items-center gap-2 cursor-pointer"
                            >
                              <FaX className="w-4 h-4" />
                              HỦY ĐƠN
                            </button>
                          )}

                          {/* Nút Theo dõi */}
                          <button
                            onClick={() => navigate(`/order/${order.orderId}`)}
                            className="bg-black cursor-pointer text-white px-4 py-2 rounded font-bold hover:bg-blue-500 transition-colors text-sm whitespace-nowrap"
                          >
                            THEO DÕI
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderList;
