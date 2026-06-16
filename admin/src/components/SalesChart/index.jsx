import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import MySelect from "../MySelect";
import CustomTooltip from "./CustomTooptip";

const chartOptions = ["Daily", "Monthly", "Annually"];

const SalesChart = ({ data = [], granularity = "Daily", onGranularityChange }) => {
  const processedData = data.map((item) => ({
    ...item,
    Revenue: item.revenue,
    Expense: item.expense,
    Revenue_line: item.revenue,
  }));

  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold">Sales Report</h2>
        <div>
          <MySelect
            selectItems={chartOptions}
            value={granularity}
            onChange={onGranularityChange}
          />
        </div>
      </div>

      {processedData.length === 0 ? (
        <div className="flex h-[500px] items-center justify-center text-gray-500">
          No sales data in this period.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={500}>
          <ComposedChart
            data={processedData}
            margin={{ top: 20, right: 20, bottom: 20, left: 10 }}
          >
            <CartesianGrid
              strokeDasharray="10 10"
              vertical={false}
              stroke="#e0e0e0"
            />
            <XAxis dataKey="date" axisLine={false} tickLine={false} />
            <YAxis
              tickFormatter={(value) => `${value.toLocaleString()} VND`}
              tickLine={false}
              axisLine={false}
              width={120}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="Revenue"
              stackId="a"
              barSize={20}
              radius={[0, 0, 5, 5]}
              fill="#413ea0"
            />
            <Bar
              dataKey="Expense"
              stackId="a"
              fill="#8884d8"
              radius={[5, 5, 0, 0]}
            />
            <Line
              type="monotone"
              dataKey="Revenue_line"
              stroke="#ff7300"
              dot={false}
              strokeWidth={3}
              legendType="none"
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </>
  );
};

export default SalesChart;
