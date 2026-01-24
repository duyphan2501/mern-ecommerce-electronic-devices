import { FaX } from "react-icons/fa6";
import formatMoney from "../utils/MoneyFormat";

const CheckoutItem = ({ item }) => {
  const name =
    item.productName + (item.modelName ? ` - ${item.modelName}` : "");
  return (
    <div className="flex justify-between items-center py-2 gap-7">
      <div className="flex-1 flex justify-between gap-2">
        <p className="" title={name}>
          {name}
        </p>
        <span className="flex items-center italic">
          <FaX size={10} />
          {item.quantity}
        </span>
      </div>
      <div className=" font-semibold">
        {formatMoney(
          (item.price - (item.price * item.discount) / 100)
        )}
      </div>
    </div>
  );
};

export default CheckoutItem;
