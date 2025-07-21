import DashboardCardSlider from "../../components/DashboardSlider";
import SalesChart from "../../components/SalesChart";
import OrderTable from "../../components/OrderTable";
import ViewAllButton from "../../components/ViewAllButton";
import TopProducts from "../../components/TopProducts";
import DateToDatePicker from "../../components/DateToDatePicker";
import StockTable from "../../components/StockTable";
import { Paper } from "@mui/material";

const Dashboard = () => {
  return (
    <div className="p-5">
      <section>
        <DashboardCardSlider />
      </section>
      <section className="lg:flex gap-5 mt-5">
        <div className="lg:w-2/3">
          <Paper sx={{ padding: "20px" }} elevation={2}>
            <SalesChart />
          </Paper>
        </div>
        <div className="lg:w-1/3 mt-5 lg:mt-0">
          <Paper sx={{ padding: "20px" }} elevation={2}>
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-xl">Top Products</h3>
              <div className="">
                <ViewAllButton link={"/"} />
              </div>
            </div>

            <div className="my-3">
              <DateToDatePicker />
            </div>
            <TopProducts />
          </Paper>
        </div>
      </section>
      <section className="mt-5">
        <Paper sx={{ padding: "20px" }} elevation={2}>
          <StockTable />
        </Paper>
      </section>
      <section className="mt-5 ">
        <Paper elevation={2} sx={{ padding: "20px" }}>
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold text-xl">Recent Orders</h3>
            <div className="">
              <ViewAllButton link={"/"} />
            </div>
          </div>
          <OrderTable />
        </Paper>
      </section>
    </div>
  );
};

export default Dashboard;
