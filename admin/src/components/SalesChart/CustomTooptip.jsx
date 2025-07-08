import { LuArrowUpRight, LuArrowDownRight, LuMinus } from "react-icons/lu";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const revenueItem = payload.find((item) => item.dataKey === "Revenue");
    const expenseItem = payload.find((item) => item.dataKey === "Expense");

    const revenue = revenueItem?.value || 0;
    const expense = expenseItem?.value || 0;
    const profit = revenue - expense;

    // Xác định trạng thái lãi/lỗ
    const profitLabel =
      profit > 0
        ? { text: "Profit", color: "text-green-600", Icon: LuArrowUpRight }
        : profit < 0
        ? { text: "Loss", color: "text-red-600", Icon: LuArrowDownRight }
        : { text: "Break Even", color: "text-gray-500", Icon: LuMinus };

    return (
      <div className="bg-white rounded-md shadow border border-gray-200 pb-2">
        <p className="bg-gray-100 px-2 py-1 rounded-t-md text-center">
          <strong>{label}</strong>
        </p>

        {payload
          .filter((item) => item.dataKey !== "Revenue_line")
          .map((item, index) => (
            <p
              key={index}
              style={{ color: item.color }}
              className="px-2 flex items-center gap-2 text-sm"
            >
              <div
                className="size-2"
                style={{ backgroundColor: item.color }}
              ></div>
              {item.name}: {item.value.toLocaleString()}
            </p>
          ))}

        <p className={`px-2 flex items-center gap-1 text-sm ${profitLabel.color}`}>
          <profitLabel.Icon size={16} />
          {profitLabel.text}: {profit.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
