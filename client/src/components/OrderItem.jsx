import { IconButton } from "@mui/material";
import { IoIosArrowDown } from "react-icons/io";
import {formatDate} from "../utils/DateFormat";
import formatMoney from "../utils/MoneyFormat";

const OrderItem = ({ order, openViewDetail, isViewDetail }) => {
  return (
    <tr className="">
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
      <td className="px-6 py-4 min-w-[320px] text-wrap">{order.address}</td>
      <td className="px-6 py-4">{order.phone}</td>
      <td className="px-6 py-4">{formatMoney(order.total)}</td>
      <td className="px-6 py-4">{order.payment}</td>
    </tr>
  );
};

export default OrderItem;
