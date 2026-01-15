import { Paper, Typography } from "@mui/material";
import { DashboardCardProduct } from "../../components/DashboardCard";
import InventoryIcon from "@mui/icons-material/Inventory";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import HandshakeIcon from "@mui/icons-material/Handshake";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useEffect, useState } from "react";
import ConfirmDialog from "../../components/ConfirmDialog";
import { toast } from "react-hot-toast";
import useOrderStore from "../../store/orderStore";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import OrderTable from "../../components/OrderTable";

const Orders = () => {
  //Khai bao state
  const orders = useOrderStore((s) => s.orders);
  const { getOrders, isLoading } = useOrderStore();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    getOrders(axiosPrivate);
  }, []);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState([]);

  const handleConfirmDelete = async () => {
    try {
      const res = await axiosPrivate.delete("/api/order/delete", {
        data: { _ids: selectedItem },
      });

      if (res.data?.success) {
        toast.success(res.data.message);
        await getOrders();
        setSelectedItem([]);
      }
    } catch (error) {
      console.log(error);
      const message = error.response?.data?.message;
      toast.error(message || "Xóa đơn hàng thất bại!");
    }
  };
  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }
  return (
    <Paper sx={{ padding: "20px" }} elevation={2} className="!m-5 !rounded-xl">
      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleConfirmDelete}
        content={`Bạn có muốn xóa ${selectedItem.length} đơn hàng này?`}
        action={"Xóa"}
      />
      {/* <Navbar active="orders" /> */}

      <div className="mt-3">
        <h4 className="font-bold">OVERVIEW</h4>
      </div>

      <div className="mt-3 grid md:grid-cols-5 gap-3">
        <DashboardCardProduct
          BackgroundColor="#F57E40"
          icon={InventoryIcon}
          CardHeader="Canncelled Orders"
          CardDesc={`${orders.filter((ord) => ord.status === "cancelled").length} Orders`}
        />
        <DashboardCardProduct
          BackgroundColor="#1A2C4E"
          icon={HourglassBottomIcon}
          CardHeader="Pending Orders"
          CardDesc={`${
            orders.filter((ord) => ord.status === "pending").length
          } Orders`}
        />
        <DashboardCardProduct
          BackgroundColor="#F7B600"
          icon={HandshakeIcon}
          CardHeader="Confirmed Orders"
          CardDesc={`${
            orders.filter((ord) => ord.status === "confirmed").length
          } Orders`}
        />
        <DashboardCardProduct
          BackgroundColor="#689801"
          icon={LocalShippingIcon}
          CardHeader="Shipping Orders"
          CardDesc={`${
            orders.filter((ord) => ord.status === "shipping").length
          } Orders`}
        />
        <DashboardCardProduct
          BackgroundColor="#B01D2A"
          icon={CheckCircleIcon}
          CardHeader="Delivered Orders"
          CardDesc={`${
            orders.filter((ord) => ord.status === "delivered").length
          } Orders`}
        />
      </div>
      <section className="mt-5">
        <OrderTable orders={orders} />
      </section>
    </Paper>
  );
};

export default Orders;
