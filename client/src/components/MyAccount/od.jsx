import React from "react";

const OrderCard = ({ order }) => {
  return (
    <div className="border rounded-2xl p-4 shadow mb-4">
      {/* Thông tin chung */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-lg">Đơn hàng #{order.id}</h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            order.status === "completed"
              ? "bg-green-100 text-green-700"
              : order.status === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {order.status === "completed"
            ? "Hoàn thành"
            : order.status === "pending"
            ? "Đang xử lý"
            : "Đã hủy"}
        </span>
      </div>

      {/* Danh sách món */}
      <ul className="divide-y">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between py-2">
            <span>
              {item.name} x {item.qty}
            </span>
            <span>{(item.price * item.qty).toLocaleString()} đ</span>
          </li>
        ))}
      </ul>

      {/* Tổng tiền */}
      <div className="flex justify-between mt-3 font-semibold text-base">
        <span>Tổng cộng:</span>
        <span>{order.total.toLocaleString()} đ</span>
      </div>

      {/* Thông tin khác */}
      <div className="mt-2 text-sm text-gray-500">
        <p>Ngày đặt: {new Date(order.createdAt).toLocaleString()}</p>
        <p>Phương thức: {order.paymentMethod}</p>
      </div>
    </div>
  );
};

export default OrderCard;
