import { Box, Button, Tab, Tabs } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { BiLoader } from "react-icons/bi";
import { IoSearch } from "react-icons/io5";
import OrderList from "../OrderList";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useOrderStore from "../../store/orderStore";

const ORDER_STATUSES = [
  { label: "Tất cả", value: "all" },
  { label: "Chờ xác nhận", value: "pending" },
  { label: "Đã xác nhận", value: "confirmed" },
  { label: "Đang đóng gói", value: "packing" },
  { label: "Đang giao", value: "shipping" },
  { label: "Đã giao", value: "delivered" },
  { label: "Đã hủy", value: "cancelled" },
];

const Order = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchOrderId, setSearchOrderId] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    startDate: "",
    endDate: "",
  });
  const [isSearchMode, setIsSearchMode] = useState(false);

  const { getOrders, getOrderById, setOrders, isLoading } = useOrderStore();
  const orders = useOrderStore((state) => state.orders);
  const pagination = useOrderStore((state) => state.orderPagination);
  const axiosPrivate = useAxiosPrivate();

  const hasInvalidDateRange = useMemo(
    () =>
      filters.startDate &&
      filters.endDate &&
      new Date(filters.startDate) > new Date(filters.endDate),
    [filters.endDate, filters.startDate],
  );

  useEffect(() => {
    if (hasInvalidDateRange) return;
    setIsSearchMode(false);
    getOrders(axiosPrivate, filters);
  }, [axiosPrivate, filters, getOrders, hasInvalidDateRange]);

  const handleSearchOrder = async () => {
    const keyword = searchOrderId.trim();
    if (!keyword) {
      setIsSearchMode(false);
      await getOrders(axiosPrivate, filters);
      return;
    }

    const order = await getOrderById(axiosPrivate, keyword);
    setOrders(order ? [order] : []);
    setIsSearchMode(true);
  };

  const handleStatusChange = (event, newValue) => {
    const status = ORDER_STATUSES[newValue]?.value || "all";
    setActiveTab(newValue);
    setFilters((current) => ({ ...current, status }));
  };

  const handleDateChange = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value }));
  };

  const handleResetFilters = () => {
    setActiveTab(0);
    setSearchOrderId("");
    setIsSearchMode(false);
    setFilters({ status: "all", startDate: "", endDate: "" });
  };

  const handleLoadMore = () => {
    if (!pagination?.nextCursor || isLoading || isSearchMode) return;
    getOrders(axiosPrivate, filters, {
      append: true,
      cursor: pagination.nextCursor,
      limit: pagination.limit,
    });
  };

  const orderCount = isSearchMode ? orders.length : pagination?.total || 0;

  return (
    <div className="bg-white rounded-md border border-gray-200 shadow p-4 sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-4 mb-4 border-b border-gray-200">
        <div>
          <h4 className="text-lg font-bold text-gray-900">Đơn hàng của tôi</h4>
          <p className="text-sm text-gray-500">
            Theo dõi trạng thái, tìm kiếm và lọc đơn theo ngày đặt.
          </p>
        </div>
        <p className="text-sm font-semibold text-gray-700">
          {orderCount} đơn hàng
        </p>
      </div>

      <div className="space-y-4">
        <Box className="border-b border-gray-100">
          <Tabs
            value={activeTab}
            onChange={handleStatusChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Lọc đơn hàng theo trạng thái"
          >
            {ORDER_STATUSES.map((status) => (
              <Tab
                key={status.value}
                label={status.label}
                className="!normal-case !font-semibold"
              />
            ))}
          </Tabs>
        </Box>

        <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1fr_auto_auto_auto]">
          <div className="flex min-h-11 items-center overflow-hidden rounded-md border border-gray-300 bg-white px-3 focus-within:border-blue-500">
            <IoSearch size={22} className="text-gray-400" />
            <input
              type="text"
              value={searchOrderId}
              onChange={(event) => setSearchOrderId(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleSearchOrder();
              }}
              className="ms-2 h-11 w-full border-0 text-sm text-gray-700 outline-none"
              placeholder="Nhập mã đơn hàng"
            />
            <Button
              variant="text"
              className="!min-w-fit !px-4 !font-semibold !normal-case"
              onClick={handleSearchOrder}
            >
              Tìm
            </Button>
          </div>

          <label className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-600">
            Từ
            <input
              type="date"
              value={filters.startDate}
              onChange={(event) =>
                handleDateChange("startDate", event.target.value)
              }
              className="text-gray-800 outline-none"
            />
          </label>

          <label className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-600">
            Đến
            <input
              type="date"
              value={filters.endDate}
              onChange={(event) =>
                handleDateChange("endDate", event.target.value)
              }
              className="text-gray-800 outline-none"
            />
          </label>

          <Button
            variant="outlined"
            className="!rounded-md !font-semibold !normal-case"
            onClick={handleResetFilters}
          >
            Xóa lọc
          </Button>
        </div>

        {hasInvalidDateRange && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            Ngày bắt đầu không được lớn hơn ngày kết thúc.
          </p>
        )}

        <OrderList orders={orders} />

        {!isSearchMode && pagination?.hasMore && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-md border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-800 transition hover:border-blue-500 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading && <BiLoader className="h-4 w-4 animate-spin" />}
              Xem thêm đơn hàng
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
