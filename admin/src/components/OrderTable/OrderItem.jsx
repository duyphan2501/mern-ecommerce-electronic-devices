import {
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
} from "@mui/material";
import { IoIosArrowDown } from "react-icons/io";
import formatDate from "../../utils/DateFormat";
import formatMoney from "../../utils/MoneyFormat";
import { useState } from "react";

const statusArr = ["pending", "delivery", "completed"];

const OrderItem = ({ order, openViewDetail, isViewDetail }) => {
  const [status, setStatus] = useState(statusArr[0]);
  const handleChange = (event) => {
    setStatus(event.target.value);
  };
  return (
    <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
      <td className="pl-6 py-4">
        <IconButton className="!bg-gray-100" onClick={openViewDetail}>
          <IoIosArrowDown
            className={`transition-transform duration-300 ${
              isViewDetail ? "rotate-180" : "rotate-0"
            }`}
            size={20}
          />
        </IconButton>
      </td>
      <td className="px-6 py-4">{order.id}</td>
      <td className="px-6 py-4">{formatDate(order.date)}</td>
      <td className="px-6 py-4">{order.customer}</td>
      <td className="px-6 py-4 !min-w-[280px] !text-wrap">{order.address}</td>
      <td className="px-6 py-4">{order.phone}</td>
      <td className="px-6 py-4">{formatMoney(order.total)}</td>
      <td className="px-6 py-4">{order.payment}</td>
      <td className="px-6 py-4">
        <FormControl fullWidth>
          <Select
            id="demo-simple-select"
            value={status}
            size="small"
            onChange={handleChange}
            sx={{ fontFamily: "Outfit, sans-serif" }}
          >
            {statusArr.map((stat, index) => (
              <MenuItem
                key={index}
                value={stat}
                sx={{ fontFamily: "Outfit, sans-serif" }}
              >
                {stat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </td>
    </tr>
  );
};

export default OrderItem;
