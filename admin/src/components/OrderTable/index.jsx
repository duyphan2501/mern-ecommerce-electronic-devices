import { Fragment, useState } from "react";
import OrderItemExpand from "./OrderItemExpand";
import OrderItem from "./OrderItem";

const orders = [
  {
    id: "DH001",
    date: "2025-07-04",
    customer: "Nguyễn Văn A",
    address: "Hoà Phú 1, Định Thuỷ, Mỏ Cày Nam, Bến Tre",
    status: "pending",
    total: 2000000,
    phone: "012312323",
    payment: "Cash on Delivery",
    products: [
      {
        image:
          "https://powertech.vn/thumbs/540x540x2/upload/product/capture-4067.png",
        name: "Inverter Dye Hydrid 3kw",
        quantity: 2,
        price: 1000000,
        rating: 4.5,
        discount: 10,
      },
      {
        image:
          "https://powertech.vn/thumbs/540x540x2/upload/product/capture-4067.png",
        name: "Inverter Dye Hydrid 3kw",
        quantity: 2,
        price: 1000000,
        rating: 4.5,
        discount: 10,
      },
    ],
  },
  {
    id: "DH001",
    date: "2025-07-04",
    customer: "Nguyễn Văn A",
    address: "Hoà Phú 1, Định Thuỷ, Mỏ Cày Nam, Bến Tre",
    status: "pending",
    total: 2000000,
    phone: "012312323",
    payment: "Cash on Delivery",
    products: [
      {
        image:
          "https://powertech.vn/thumbs/540x540x2/upload/product/capture-4067.png",
        name: "Inverter Dye Hydrid 3kw",
        quantity: 2,
        price: 1000000,
        rating: 4.5,
        discount: 10,
      },
      {
        image:
          "https://powertech.vn/thumbs/540x540x2/upload/product/capture-4067.png",
        name: "Inverter Dye Hydrid 3kw",
        quantity: 2,
        price: 1000000,
        rating: 4.5,
        discount: 10,
      },
    ],
  },
  {
    id: "DH001",
    date: "2025-07-04",
    customer: "Nguyễn Văn A",
    address: "Hoà Phú 1, Định Thuỷ, Mỏ Cày Nam, Bến Tre",
    status: "pending",
    total: 2000000,
    phone: "012312323",
    payment: "Cash on Delivery",
    products: [
      {
        image:
          "https://powertech.vn/thumbs/540x540x2/upload/product/capture-4067.png",
        name: "Inverter Dye Hydrid 3kw",
        quantity: 2,
        price: 1000000,
        rating: 4.5,
        discount: 10,
      },
      {
        image:
          "https://powertech.vn/thumbs/540x540x2/upload/product/capture-4067.png",
        name: "Inverter Dye Hydrid 3kw",
        quantity: 2,
        price: 1000000,
        rating: 4.5,
        discount: 10,
      },
    ],
  },
];

const OrderTable = () => {
  const [isViewDetail, setIsViewDetal] = useState(false);

  return (
    <div className=" overflow-x-auto rounded-md border border-gray-200 z-0">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 whitespace-nowrap">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="pl-4 py-4 text-center"></th>
            <th className="px-4 py-4">OrderId</th>
            <th className="px-4 py-4">CreateAt</th>
            <th className="px-4 py-4">Customer</th>
            <th className="px-4 py-4">Address</th>
            <th className="px-4 py-4">Phone</th>
            <th className="px-4 py-4">Total</th>
            <th className="px-4 py-4">Payment</th>
            <th className="px-4 py-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <Fragment key={order.id + index}>
              <OrderItem
                order={order}
                openViewDetail={() =>
                  setIsViewDetal((prev) => (prev === index ? null : index))
                }
                isViewDetail={isViewDetail === index}
              />

              {isViewDetail === index && (
                <OrderItemExpand products={order.products} />
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
      
    </div>

  );
};

export default OrderTable;
