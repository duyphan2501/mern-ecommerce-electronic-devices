import { PiKeyReturnLight } from "react-icons/pi";
import { IoWalletOutline } from "react-icons/io5";
import { BiSupport } from "react-icons/bi";
import { AiOutlineCheckSquare } from "react-icons/ai";

const ScoreValue = () => {
  return (
    <div className="">
      <ul className="md:flex w-[80%] mx-auto gap-10 space-y-5 md:space-y-0">
        <li className="flex flex-col items-center justify-center gap-2 group">
          <div>
            <PiKeyReturnLight size={50} className="group-hover:text-[#0d68f3] transition group-hover:translate-y-[-10px] duration-300"/>
          </div>
          <p className="text-center font-bold text-gray-600 text-lg">Miễn phí đổi trả</p>
          <p className="text-center">Lorem ipsum dolor sit amet consectetur!</p>
        </li>
        <li className="flex flex-col items-center justify-center gap-2 group">
          <div>
            <IoWalletOutline  size={50} className="group-hover:text-[#0d68f3] transition group-hover:translate-y-[-10px] duration-300"/>
          </div>
          <p className="text-center font-bold text-gray-600 text-lg">Đa dạng thanh toán</p>
          <p className="text-center">Lorem ipsum dolor sit amet consectetur!</p>
        </li>
        <li className="flex flex-col items-center justify-center gap-2 group">
          <div>
            <AiOutlineCheckSquare  size={50} className="group-hover:text-[#0d68f3] transition group-hover:translate-y-[-10px] duration-300"/>
          </div>
          <p className="text-center font-bold text-gray-600 text-lg">Chất lượng hàng đầu</p>
          <p className="text-center">Lorem ipsum dolor sit amet consectetur!</p>
        </li>
        <li className="flex flex-col items-center justify-center gap-2 group">
          <div>
            <BiSupport  size={50} className="group-hover:text-[#0d68f3] transition group-hover:translate-y-[-10px] duration-300"/>
          </div>
          <p className="text-center font-bold text-gray-600 text-lg">Hỗ trợ 24/7</p>
          <p className="text-center">Lorem ipsum dolor sit amet consectetur!</p>
        </li>
        
      </ul>
    </div>
  );    
};

export default ScoreValue;
