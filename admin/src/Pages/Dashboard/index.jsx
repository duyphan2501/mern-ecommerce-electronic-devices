import { Button } from "@mui/material";
import DashboardCardSlider from "../../components/DashboardSlider";
import SalesChart from "../../components/SalesChart";
import OrderTable from "../../components/OrderTable";
import ViewAllButton from "../../components/ViewAllButton";

const Dashboard = () => {
  return (
    <div className="p-5">
      <DashboardCardSlider />
      <div className="flex gap-5 mt-5">
        <div className="w-2/3 bg-white border border-gray-200 rounded-md p-5 shadow">
          <SalesChart />
        </div>
        <div className="w-1/3 bg-white border border-gray-200 rounded-md p-5 shadow">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-xl">Top Products</h3>
            <div className="">
              <ViewAllButton link={"/"} />
            </div>
          </div>
        </div>
      </div>
      <section className="mt-5 bg-white border border-gray-200 p-5 rounded-md">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-xl">Recent Orders</h3>
          <div className="">
            <ViewAllButton link={"/"} />
          </div>
        </div>
        <OrderTable />
      </section>
    </div>
  );
};

export default Dashboard;
