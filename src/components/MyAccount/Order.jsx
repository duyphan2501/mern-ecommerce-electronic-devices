import { Box, Button, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { IoSearch } from "react-icons/io5";

const orders = [];

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

  return (
    <div className="bg-white rounded-md border border-gray-200 shadow p-5">
      <h4 className="text-lg font-bold">Đơn hàng của tôi</h4>
      <div className="tab flex justify-center items-center">
        <Box sx={{ width: "100%" }}>
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
        <div className="border-[1px] border-gray-300 rounded-lg  w-full flex items-center px-3 overflow-hidden">
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

        <div className="min-h-[200px] mt-2">
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
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
