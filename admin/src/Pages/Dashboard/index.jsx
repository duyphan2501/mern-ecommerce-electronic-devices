import DashboardCardSlider from "../../components/DashboardSlider";
import OrderTable from "../../components/OrderTable";

const Dashboard = () => {
  return (
    <div className="p-5">
      <DashboardCardSlider />
      <section className="mt-5">
        <OrderTable />
      </section>
    </div>
  );
};

export default Dashboard;
