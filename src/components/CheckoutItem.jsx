import { FaX } from "react-icons/fa6"
import formatMoney from "../utils/MoneyFormat";

const CheckoutItem = ({product}) => {
  return (
    <div className="flex justify-between items-center py-2">
        <div className="flex-2/3 flex gap-2">
            <p className="line-clamp-1" title={product.name}>{product.name}</p>
            <span className="flex gap-1 items-center"><FaX size={10}/>{product.quantity}</span>
        </div>
        <div className="">
            {formatMoney((product.price - product.price*product.discount/100) * product.quantity)}
        </div>
    </div>
  )
}

export default CheckoutItem