import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import useOrderStore from "../store/orderStore";
import { FaCheckCircle, FaTruck } from "react-icons/fa";
import { BiCreditCard, BiLoader, BiMapPin, BiPackage } from "react-icons/bi";
import { CgLock } from "react-icons/cg";
import formatMoney from "../utils/MoneyFormat";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { formatDateTime } from "../utils/DateFormat";

const OrderTracking = () => {
  const { orderId } = useParams();
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getOrderById } = useOrderStore();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      if (!orderId) return;
      const result = await getOrderById(axiosPrivate, orderId);
      setCurrentOrder(result);
    } catch (err) {
      console.error("Error fetching order:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <FaCheckCircle className="w-6 h-6 text-green-600" />;
      case "shipping":
        return <FaTruck className="w-6 h-6 text-blue-600" />;
      case "confirmed":
        return <BiPackage className="w-6 h-6 text-purple-600" />;
      default:
        return <CgLock className="w-6 h-6 text-orange-600" />;
    }
  };

  const getStatusColorClass = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-50 border-green-500";
      case "shipping":
        return "bg-blue-50 border-blue-500";
      case "confirmed":
        return "bg-purple-50 border-purple-500";
      default:
        return "bg-orange-50 border-orange-500";
    }
  };

  const statusLabelMap = {
    pending: "Đang chờ xác nhận",
    confirmed: "Đã xác nhận",
    shipping: "Đang giao hàng",
    delivered: "Đã giao hàng",
  };

  const paymentLabelMap = {
    cod: "Thanh toán khi nhận hàng",
    payos: "Thanh toán qua PayOS",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <BiLoader className="w-8 h-8 animate-spin text-gray-600" />
      </div>
    );
  }
  if (!currentOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Không tìm thấy đơn hàng.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        {/* Thông tin đơn hàng */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <CgLock className="w-5 h-5 text-gray-600" />
              <h3 className="font-bold text-sm uppercase">Ngày đặt hàng</h3>
            </div>
            <p className="text-lg font-semibold">Ngày: {formatDateTime(currentOrder.createdAt).split(" ")[0]}</p>
            <p className="text-sm text-gray-600">Lúc: {formatDateTime(currentOrder.createdAt).split(" ")[1]}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <FaTruck className="w-5 h-5 text-gray-600" />
              <h3 className="font-bold text-sm uppercase">
                {currentOrder.deliveryDate ? "Đã giao" : "Dự kiến giao hàng"}
              </h3>
            </div>
            <p className="text-lg font-semibold">
              {currentOrder.deliveryDate ||
                currentOrder.estimatedDelivery ||
                "Đang cập nhật"}
            </p>
            <p className="text-sm text-gray-600">Giao hàng tiêu chuẩn</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <BiPackage className="w-5 h-5 text-gray-600" />
              <h3 className="font-bold text-sm uppercase">Tổng tiền</h3>
            </div>
            <p className="text-lg font-bold">
              {formatMoney(currentOrder.totalPrice)}
            </p>
            <p className="text-sm text-gray-600">
              {paymentLabelMap[currentOrder.payment.provider]}
            </p>
          </div>
        </div>

        {/* Trạng thái đơn hàng */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="font-bold text-xl mb-6 uppercase">
            Trạng thái đơn hàng
          </h3>

          <div
            className={`flex items-center gap-4 p-5 rounded-lg border-l-4 ${getStatusColorClass(
              currentOrder.status,
            )}`}
          >
            {getStatusIcon(currentOrder.status)}
            <div className="flex-1">
              <p className="font-bold text-lg">{statusLabelMap[currentOrder.status]}</p>
              <p className="text-sm text-gray-600 mt-1">
                {currentOrder.status === "pending" &&
                  "Đơn hàng đã được đặt thành công và đang chờ xác nhận"}
                {currentOrder.status === "confirmed" &&
                  "Đơn hàng đã được xác nhận và đang chuẩn bị"}
                {currentOrder.status === "shipping" &&
                  "Đơn hàng đang trên đường giao đến bạn"}
                {currentOrder.status === "delivered" &&
                  "Đơn hàng đã được giao thành công"}
              </p>
            </div>
          </div>
        </div>

        {/* Sản phẩm */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="font-bold text-xl mb-4 uppercase">Sản phẩm</h3>
          <div className="space-y-4">
            {currentOrder.items.map((product, idx) => (
              <div
                key={idx}
                className="flex gap-4 pb-4 border-b last:border-b-0"
              >
                <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center shrink-0">
                  {product.image ? (
                    <img
                      src={`${product.image}`}
                      alt={product.name}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <span className="text-3xl">👟</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-lg mb-1">{product.name}</p>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Số lượng: {product.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">
                    {formatMoney(product.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t-2 border-gray-200">
            <div className="flex justify-between items-center">
              <p className="font-bold text-lg">TỔNG CỘNG:</p>
              <p className="font-bold text-2xl">
                {formatMoney(currentOrder.totalPrice)}
              </p>
            </div>
          </div>
        </div>

        {/* Thông tin giao hàng */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <BiMapPin className="w-5 h-5 text-gray-600" />
              <h3 className="font-bold uppercase">Địa chỉ giao hàng</h3>
            </div>
            <div className="space-y-2 text-gray-700">
              <p className="font-semibold">
                {currentOrder.shippingInfo.receiver}
              </p>
              <p>{currentOrder.shippingInfo.phone}</p>
              <p>
                {currentOrder.shippingInfo.addressDetail},{" "}
                {currentOrder.shippingInfo.ward},{" "}
                {currentOrder.shippingInfo.province}{" "}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <BiCreditCard className="w-5 h-5 text-gray-600" />
              <h3 className="font-bold uppercase">Phương thức thanh toán</h3>
            </div>
            <p className="text-gray-700">{paymentLabelMap[currentOrder.payment.provider]}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
