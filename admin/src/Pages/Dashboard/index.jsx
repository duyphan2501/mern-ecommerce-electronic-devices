import { Alert, Paper, Skeleton } from "@mui/material";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import DashboardCardSlider from "../../components/DashboardSlider";
import SalesChart from "../../components/SalesChart";
import ViewAllButton from "../../components/ViewAllButton";
import TopProducts from "../../components/TopProducts";
import DateToDatePicker from "../../components/DateToDatePicker";
import {
  LowStockTable,
  RecentOrdersTable,
} from "../../components/DashboardTables";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useDashboardStore from "../../store/dashboardStore";
import useAuthStore from "../../store/authStore";

const GRANULARITY_PARAMS = {
  Daily: "daily",
  Monthly: "monthly",
  Annually: "annual",
};

const Dashboard = () => {
  const axiosPrivate = useAxiosPrivate();
  const { dashboard, error, getDashboard, isLoading } = useDashboardStore();
  const user = useAuthStore(s => s.user)
  const [range, setRange] = useState({
    fromDate: dayjs().subtract(29, "day"),
    toDate: dayjs(),
  });
  const [chartGranularity, setChartGranularity] = useState("Daily");
  const handleRangeChange = useCallback((nextRange) => setRange(nextRange), []);

  useEffect(() => {
    if (!user) return;
    const controller = new AbortController();

    getDashboard(
      axiosPrivate,
      {
        startDate: range.fromDate.format("YYYY-MM-DD"),
        endDate: range.toDate.format("YYYY-MM-DD"),
        granularity: GRANULARITY_PARAMS[chartGranularity],
      },
      controller.signal,
    );

    return () => controller.abort();
  }, [axiosPrivate, chartGranularity, getDashboard, range, user]);

  const showInitialLoading = isLoading && !dashboard.sales.length;

  return (
    <div className="p-5">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">
            Live sales, orders, and inventory overview.
          </p>
        </div>
        <DateToDatePicker
          fromDate={range.fromDate}
          toDate={range.toDate}
          onChange={handleRangeChange}
        />
      </div>

      {error && (
        <Alert severity="error" className="!mb-5">
          {error}
        </Alert>
      )}

      <section>
        {showInitialLoading ? (
          <div className="grid gap-5 md:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <Skeleton key={item} variant="rounded" height={140} />
            ))}
          </div>
        ) : (
          <DashboardCardSlider summary={dashboard.summary} />
        )}
      </section>

      <section className="mt-5 gap-5 lg:flex">
        <div className="lg:w-2/3">
          <Paper sx={{ padding: "20px" }} elevation={2}>
            <SalesChart
              data={dashboard.sales}
              granularity={chartGranularity}
              onGranularityChange={setChartGranularity}
            />
          </Paper>
        </div>
        <div className="mt-5 lg:mt-0 lg:w-1/3">
          <Paper sx={{ padding: "20px" }} elevation={2}>
            <h3 className="text-xl font-bold">Top Products</h3>
            <TopProducts products={dashboard.topProducts} />
          </Paper>
        </div>
      </section>

      <section className="mt-5">
        <Paper sx={{ padding: "20px" }} elevation={2}>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">Low Stock</h3>
              <p className="text-sm text-gray-500">
                Models at or below minimum quantity
              </p>
            </div>
            <ViewAllButton link="/inventory" />
          </div>
          <LowStockTable items={dashboard.lowStock} />
        </Paper>
      </section>

      <section className="mt-5">
        <Paper elevation={2} sx={{ padding: "20px" }}>
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-xl font-bold">Recent Orders</h3>
            <ViewAllButton link="/orders" />
          </div>
          <RecentOrdersTable orders={dashboard.recentOrders} />
        </Paper>
      </section>
    </div>
  );
};

export default Dashboard;
