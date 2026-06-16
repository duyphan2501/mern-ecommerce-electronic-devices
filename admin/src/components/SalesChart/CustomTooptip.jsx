import formatMoney from "../../utils/MoneyFormat";
import { LuArrowDownRight, LuArrowUpRight, LuMinus } from "react-icons/lu";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const revenue = payload.find((item) => item.dataKey === "Revenue")?.value || 0;
  const expense = payload.find((item) => item.dataKey === "Expense")?.value || 0;
  const profit = revenue - expense;
  const profitLabel =
    profit > 0
      ? { text: "Profit", color: "text-green-600", Icon: LuArrowUpRight }
      : profit < 0
        ? { text: "Loss", color: "text-red-600", Icon: LuArrowDownRight }
        : { text: "Break Even", color: "text-gray-500", Icon: LuMinus };

  return (
    <div className="rounded-md border border-gray-200 bg-white pb-2 shadow">
      <p className="rounded-t-md bg-gray-100 px-3 py-1 text-center">
        <strong>{label}</strong>
      </p>

      {payload
        .filter((item) => item.dataKey !== "Revenue_line")
        .map((item) => (
          <p
            key={item.dataKey}
            style={{ color: item.color }}
            className="flex items-center gap-2 px-3 text-sm"
          >
            <span
              className="size-2"
              style={{ backgroundColor: item.color }}
            />
            {item.name}:{" "}
            {formatMoney(item.value)}
          </p>
        ))}
      <p className={`flex items-center gap-1 px-3 text-sm ${profitLabel.color}`}>
        <profitLabel.Icon size={16} />
        {profitLabel.text}: {formatMoney(profit)}
      </p>
    </div>
  );
};

export default CustomTooltip;
