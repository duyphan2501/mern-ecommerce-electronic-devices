import { Box, Button, Tab, Tabs } from "@mui/material";
import { Fragment, useState } from "react";
import { IoSearch } from "react-icons/io5";
import OrderItemExpand from "../OrderItemExpand";
import OrderItem from "../OrderItem";

const orders = [
  {
    id: "DH001",
    date: "2025-07-04",
    customer: "Nguyễn Văn A",
    address: "Hoà Phú 1, Định Thuỷ, Mỏ Cày Nam, Bến Tre",
    status: "pending",
    total: 2000000,
    phone: "012312323",
    payment: "Chưa thanh toán",
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
    payment: "Chưa thanh toán",
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

const Order = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const [isViewDetail, setIsViewDetal] = useState(false);

  return (
    <div className="bg-white rounded-md border border-gray-200 shadow p-5">
      <div className="flex justify-between items-center pb-3 mb-3 border-b border-gray-200">
        <h4 className="text-lg font-bold">Đơn hàng của tôi</h4>
        <p>Có {orders.length} đơn hàng</p>
      </div>
      <div className="flex justify-center items-center">
        <Box>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="basic tabs example"
          >
            <Tab
              label="Tất cả đơn"
              {...a11yProps(0)}
              className="!normal-case"
            />
            <Tab
              label="Chờ thanh toán"
              {...a11yProps(1)}
              className="!normal-case"
            />
            <Tab
              label="Đang xử lí"
              {...a11yProps(2)}
              className="!normal-case"
            />
            <Tab
              label="Đang vận chuyển"
              {...a11yProps(3)}
              className="!normal-case"
            />
            <Tab label="Đã giao" {...a11yProps(4)} className="!normal-case" />
            <Tab label="Đã huỷ" {...a11yProps(5)} className="!normal-case" />
          </Tabs>
        </Box>
      </div>
      <div className="my-3">
        <div className="border-[1px] border-gray-300 rounded-lg w-full flex items-center px-3 overflow-hidden">
          <IoSearch size={25} className="text-gray-400" />
          <input
            type="text"
            name=""
            id=""
            className="ms-2 search-input w-full border-r-[1px] border-r-gray-300 text-gray-500"
            placeholder="Tìm kiếm đơn hàng"
          />
          <Button
            variant="text"
            className="h-full !mr-[-13px] !ml-[-1px] !px-5 text-nowrap !rounded-[0]"
          >
            Tìm kiếm
          </Button>
        </div>

        <div className="mt-4">
          {orders.length === 0 ? (
            <div className="flex flex-col gap-1 justify-center items-center h-full">
              <div className="size-40 ">
                <img
                  src="https://frontend.tikicdn.com/_desktop-next/static/img/account/empty-order.png"
                  alt=""
                  className="size-full object-contain"
                />
              </div>
              <p>Chưa có đơn hàng</p>
            </div>
          ) : (
            <div className="overflow-x-auto scroll-x">
              <table className="w-full whitespace-nowrap border border-gray-200">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="pl-6 py-4 text-center"></th>
                    <th className="px-6 py-4">Mã đơn hàng</th>
                    <th className="px-6 py-4">Ngày tạo</th>
                    <th className="px-6 py-4">Khách hàng</th>
                    <th className="px-6 py-4">Địa chỉ</th>
                    <th className="px-6 py-4">Sđt</th>
                    <th className="px-6 py-4">Tổng tiền</th>
                    <th className="px-6 py-4">Thanh toán</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <Fragment key={order.id}>
                      <OrderItem
                        order={order}
                        openViewDetail={() =>
                          setIsViewDetal((prev) =>
                            prev === index ? null : index
                          )
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
