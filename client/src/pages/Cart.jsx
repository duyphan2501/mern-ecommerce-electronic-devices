import { Button, Checkbox } from "@mui/material";
import CartPageItem from "../components/CartPageItem";
import formatMoney from "../utils/MoneyFormat";
import { Link } from "react-router-dom";
import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";

const Cart = () => {
  const cart = useCartStore((state) => state.cart);
  const user = useAuthStore((state) => state.user);
  const { isLoading, updateCartItem, removeCartItem } = useCartStore();

  const totalCost = calculateTotalCost(cart?.items || []);

  const handleUpdateQuantity = async (modelId, newQuantity) => {
    try {
      if (isLoading) return;
      await updateCartItem(user?._id, modelId, newQuantity);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveItem = (modelId) => {
    removeCartItem(user?._id, modelId);
  };

  const handleSelectedItem = (modelId) => {
    if (selectedItems.includes(modelId)) {
      setSelectedItems(selectedItems.filter((id) => id !== modelId));
    } else {
      setSelectedItems([...selectedItems, modelId]);
    }
  };

  return (
    <div className=" py-10">
      <div className="container">
        <div className="lg:flex gap-10 mt-2">
          <div className="lg:w-3/4 mb-5 lg:mb-0 bg-white rounded-md shadow border-[1px] border-gray-300 p-5">
            <div className="pb-4 space-y-1 lg:flex justify-between items-center">
              <h3 className="text-xl font-bold font-sans uppercase">
                Giỏ hàng của bạn
              </h3>
              <p className="">
                Có{" "}
                <span className="text-highlight font-bold ">
                  {cart?.items?.length}
                </span>{" "}
                sản phẩm trong giỏ hàng
              </p>
            </div>
            <div className="rounded-md bg-gray-300 p-2 flex font-bold items-center">
              <div className="w-4/9 flex items-center">Sản phẩm</div>
              <div className="flex flex-1 justify-between">
                <div className="flex-1">Đơn giá</div>
                <div className="flex-1">Số lượng</div>
                <div className="flex-1">Thành tiền</div>
                <div className="w-10">Xoá</div>
              </div>
            </div>
            {cart.items && cart.items.length === 0 ? (
              <div className="flex justify-center items-center h-fit my-5">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">
                    Giỏ hàng của bạn trống
                  </h3>
                  <p className="text-gray-600">
                    Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm.
                  </p>
                </div>
              </div>
            ) : (
              cart?.items.map((item) => {
                return (
                  <div className="" key={item.modelId}>
                    <CartPageItem
                      item={item}
                      onUpdate={handleUpdateQuantity}
                      onDelete={handleRemoveItem}
                    />
                  </div>
                );
              })
            )}
          </div>
          <div className="lg:w-1/4 ">
            <div className="sticky top-37 bg-white p-5 rounded-md shadow border-[1px] border-gray-300">
              <h4 className="text-center font-bold text-lg border-b-2 pb-2 mb-2 border-gray-200">
                Cart Summary
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="">Tổng cộng: </div>
                  <div className="font-bold">{formatMoney(totalCost)}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="">Vận chuyển: </div>
                  <div className="italic">Free</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="">Thuế: </div>
                  <div className="italic">Included</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-bold">Thành tiền: </div>
                  <div className="font-bold">{formatMoney(totalCost)}</div>
                </div>
                <Button
                  component={Link}
                  to={"/checkout"}
                  className="!w-full !bg-blue-500 !text-white hover:!bg-black !font-bold !font-sans"
                >
                  Checkout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function calculateTotalCost(items) {
  if (!items) return 0;
  let sum = 0;
  items.forEach((item) => {
    sum += item.quantity * (item.price - (item.price * item.discount) / 100);
  });
  return sum;
}

export default Cart;
