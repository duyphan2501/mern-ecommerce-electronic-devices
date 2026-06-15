import { Paper, Typography } from "@mui/material";
import { DashboardCardProduct } from "../../components/DashboardCard";
import InventoryIcon from "@mui/icons-material/Inventory";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import HandshakeIcon from "@mui/icons-material/Handshake";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import { useEffect, useState } from "react";
import useOrderStore from "../../store/orderStore";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import OrderTable from "../../components/OrderTable";
import OrderDetailModal from "../../components/OrderDetailModal";
import AdminPageHeader from "../../components/AdminPageHeader";

const Orders = () => {
  const orders = useOrderStore((s) => s.orders);
  const orderDetail = useOrderStore((s) => s.orderDetail);
  const pagination = useOrderStore((s) => s.pagination);
  const statusCounts = useOrderStore((s) => s.statusCounts);
  const { getOrders, getOrderById, setOrderDetail, isLoading } =
    useOrderStore();
  const axiosPrivate = useAxiosPrivate();
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
    page: 0,
    limit: 10,
  });

  useEffect(() => {
    getOrders(axiosPrivate, filters);
  }, [axiosPrivate, filters, getOrders]);

  const handleOpenOrder = async (id) => {
    const detail = await getOrderById(axiosPrivate, id);
    if (detail) setIsDetailOpen(true);
  };

  const handleCloseOrder = () => {
    setIsDetailOpen(false);
    setOrderDetail(null);
  };

  const updateFilters = (nextFilters) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      ...nextFilters,
    }));
  };

  const countStatus = (status) => statusCounts[status] || 0;

  if (isLoading && !orders.length) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Paper sx={{ padding: "20px" }} elevation={2} className="!m-5 !rounded-xl">
      <OrderDetailModal
        open={isDetailOpen}
        order={orderDetail}
        onClose={handleCloseOrder}
      />

      <AdminPageHeader
        title="Orders"
        description="Track fulfillment progress, payments, and customer orders."
      />

      <div className="mt-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
          Overview
        </h2>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-6">
        <DashboardCardProduct
          BackgroundColor="#F57E40"
          icon={InventoryIcon}
          CardHeader="Cancelled Orders"
          CardDesc={`${countStatus("cancelled")} Orders`}
        />
        <DashboardCardProduct
          BackgroundColor="#1A2C4E"
          icon={HourglassBottomIcon}
          CardHeader="Pending Orders"
          CardDesc={`${countStatus("pending")} Orders`}
        />
        <DashboardCardProduct
          BackgroundColor="#F7B600"
          icon={HandshakeIcon}
          CardHeader="Confirmed Orders"
          CardDesc={`${countStatus("confirmed")} Orders`}
        />
        <DashboardCardProduct
          BackgroundColor="#7C3AED"
          icon={Inventory2Icon}
          CardHeader="Packing Orders"
          CardDesc={`${countStatus("packing")} Orders`}
        />
        <DashboardCardProduct
          BackgroundColor="#689801"
          icon={LocalShippingIcon}
          CardHeader="Shipping Orders"
          CardDesc={`${countStatus("shipping")} Orders`}
        />
        <DashboardCardProduct
          BackgroundColor="#B01D2A"
          icon={CheckCircleIcon}
          CardHeader="Delivered Orders"
          CardDesc={`${countStatus("delivered")} Orders`}
        />
      </div>

      <section className="mt-5">
        <OrderTable
          orders={orders}
          onOpenOrder={handleOpenOrder}
          pagination={pagination}
          searchValue={filters.search}
          onSearchChange={(search) => updateFilters({ search, page: 0 })}
          filterStatus={filters.status}
          onFilterStatusChange={(status) => updateFilters({ status, page: 0 })}
          onPageChange={(page) => updateFilters({ page })}
          onRowsPerPageChange={(limit) => updateFilters({ limit, page: 0 })}
        />
      </section>
    </Paper>
  );
};

export default Orders;
