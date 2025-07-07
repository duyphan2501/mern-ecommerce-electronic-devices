import React, { PureComponent } from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import MySelect from "../MySelect";
import CustomTooltip from "./CustomTooptip";

const data = [
  { name: "Jan", Revenue: 590, Expense: 809, amt: 1400 },
  { name: "Feb", Revenue: 868, Expense: 967, amt: 1506 },
  { name: "Mar", Revenue: 1397, Expense: 1098, amt: 989 },
  { name: "Apr", Revenue: 1480, Expense: 1280, amt: 1228 },
  { name: "May", Revenue: 1520, Expense: 1188, amt: 1100 },
  { name: "Jun", Revenue: 1400, Expense: 1880, amt: 1700 },
  { name: "Jul", Revenue: 1350, Expense: 750, amt: 1600 },
  { name: "Aug", Revenue: 1450, Expense: 1450, amt: 1750 },
  { name: "Sep", Revenue: 1500, Expense: 1500, amt: 1680 },
  { name: "Oct", Revenue: 1580, Expense: 860, amt: 1720 },
  { name: "Nov", Revenue: 1620, Expense: 900, amt: 1800 },
  { name: "Dec", Revenue: 1700, Expense: 950, amt: 1900 },
];

const processedData = data.map((item) => ({
  ...item,
  Revenue_line: item.Revenue,
}));

const chartOptions = ["Monthly", "Weekly", "Annually"];

export default class Example extends PureComponent {
  render() {
    return (
      <>
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-bold text-2xl">Sales Report</h2>
          <div className="">
            <MySelect selectItems={chartOptions} />
          </div>
        </div>
        <ResponsiveContainer width="100%" height={500}>
          <ComposedChart
            data={processedData}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => `${value.toLocaleString()} VNĐ`} />
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
              legendType="none" // (tuỳ chọn) ẩn trong chú thích
            />
          </ComposedChart>
        </ResponsiveContainer>
      </>
    );
  }
}
