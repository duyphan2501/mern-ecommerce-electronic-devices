import { Button } from "@mui/material";
import { IoCartOutline } from "react-icons/io5";

const AddToCartBtn = () => {
  return (
    <Button className=" !w-full !rounded-lg !border-2 !font-sans !font-semibold border-[#6f7f9763] hover:!bg-black hover:!text-white transition">
      <div className="flex gap-2 items-center pointer-events-none" >
        <IoCartOutline size={20} />
        <span>Thêm vào giỏ hàng</span>
      </div>
    </Button>
  );
};

export default AddToCartBtn;
