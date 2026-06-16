import { Paper } from "@mui/material";
import {
  MdKeyboardDoubleArrowDown,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import formatMoney from "../../utils/MoneyFormat";

const DashboardCard = ({
  icon,
  label,
  number,
  price,
  chartIcon,
  gapLastmonth = 0,
}) => {
  const trend =
    gapLastmonth < 0
      ? {
          color: "text-red-600",
          icon: <MdKeyboardDoubleArrowDown />,
        }
      : {
          color: "text-green-600",
          icon: <MdKeyboardDoubleArrowUp />,
        };

  return (
    <Paper sx={{ width: "100%", my: "1px" }} elevation={2}>
      <div className="p-5">
        <div className="flex items-center justify-between border-b border-dashed border-gray-300 pb-4">
          <div className="flex items-center gap-2">
            {icon}
            <div className="flex flex-col">
              <p className="font-light">{label}</p>
              <p className="text-lg font-bold text-black">
                {number !== undefined
                  ? number.toLocaleString()
                  : formatMoney(price || 0)}
              </p>
            </div>
          </div>
          {chartIcon}
        </div>
        <div className="flex items-center gap-2 pt-2 text-sm">
          <span className={`${trend.color} flex items-center`}>
            {trend.icon}
            {gapLastmonth > 0 ? "+" : ""}
            {gapLastmonth}%
          </span>
          <p className="font-light text-gray-500">vs previous period</p>
        </div>
      </div>
    </Paper>
  );
};

export default DashboardCard;
