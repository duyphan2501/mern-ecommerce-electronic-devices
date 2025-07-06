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
    <div className="relative overflow-x-auto shadow rounded-md">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 whitespace-nowrap">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="pl-6 py-4 text-center"></th>
            <th className="px-6 py-4">OrderId</th>
            <th className="px-6 py-4">CreateAt</th>
            <th className="px-6 py-4">Customer</th>
            <th className="px-6 py-4">Address</th>
            <th className="px-6 py-4">Phone</th>
            <th className="px-6 py-4">Subtotal</th>
            <th className="px-6 py-4">Payment</th>
            <th className="px-6 py-4">Status</th>
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
      <nav
        className="flex items-center flex-column flex-wrap md:flex-row justify-between p-5"
        aria-label="Table navigation"
      >
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
          Showing{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            1-10
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            1000
          </span>
        </span>
        <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8 ">
          <li>
            <a
              href="#"
              className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Previous
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              1
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              2
            </a>
          </li>
          <li>
            <a
              href="#"
              aria-current="page"
              className="flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
            >
              3
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              4
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              5
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Next
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default OrderTable;
