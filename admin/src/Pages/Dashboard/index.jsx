import DashboardCardSlider from "../../components/DashboardSlider";
import SalesChart from "../../components/SalesChart";
import OrderTable from "../../components/OrderTable";
import ViewAllButton from "../../components/ViewAllButton";
import TopProducts from "../../components/TopProducts";
import DateToDatePicker from "../../components/DateToDatePicker";

const Dashboard = () => {
  return (
    <div className="p-5">
      <DashboardCardSlider />
      <div className="lg:flex gap-5 mt-5">
        <div className="lg:w-2/3 bg-white border border-gray-200 rounded-md p-5 shadow">
          <SalesChart />
        </div>
        <div className="lg:w-1/3 bg-white border border-gray-200 rounded-md p-5 shadow mt-5 lg:mt-0">
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
