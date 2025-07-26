import { useContext } from "react";
import MyContext from "../../Context/MyContext";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { FaX } from "react-icons/fa6";
const TypeProductQuesBox = () => {
  const { setHasModels, setIsOpenQuesBox } = useContext(MyContext);
    const handleClick = (value) => {
    setHasModels(value);
    setIsOpenQuesBox(false);
    }
  return (
    <div>
      <div className="fixed inset-0 bg-black opacity-40 z-100"></div>
      <div className="fixed inset-0 flex items-center justify-center z-200">
        <div className="">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              New Product Has Models?
            </h2>
            <div className="flex items-center gap-5">
              <Button
                onClick={() => handleClick(false)}
                component={Link}
                to="/products/create"
                className=" !bg-gray-300 !text-gray-800 hover:!bg-gray-400 flex-1"
              >
                No
              </Button>
              <Button
                onClick={() => handleClick(true)}
                component={Link}
                to="/products/create"
                className=" !bg-blue-500 !text-white hover:!bg-blue-600 flex-1"
              >
                Yes
              </Button>
            </div>
          </div>
          {/* <button className="flex justify-center items-center absolute -top-2 -right-2 p-2 rounded-full bg-gray-300 cursor-pointer hover:bg-gray-400 transition" onClick={() => handleClick(false)}>
            <FaX size={13} className=""/>
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default TypeProductQuesBox;
