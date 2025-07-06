import { useState } from "react";
import Slider from "@mui/material/Slider";
import CollapseButton from "./CollapseButton";

const categories = [
  "Điện mặt trời",
  "Thiết bị điện",
  "Thiết bị điện tử",
  "Thiết bị gia dụng",
  "Phụ kiện điện tử",
  "Đèn chiếu sáng",
];

const brandNames = [
  "Deye",
  "Solis",
  "Growatt",
  "Victron Energy",
  "SMA",
  "Huawei",
  "Sungrow",
  "Fronius",
];

const Sidebar = () => {
  const [openCategory, setOpenCategory] = useState(true);
  const [openBrandName, setOpenBrandName] = useState(true);

  const [value, setValue] = useState([10000, 5000000]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="">
      <div className="sidebar flex lg:flex-col justify-center lg:gap-2 gap-5 lg:sticky ">
        <CollapseButton
          array={categories}
          title={"danh mục"}
          open={openCategory}
          setOpen={setOpenCategory}
        />
        <CollapseButton
          array={brandNames}
          title={"Thương hiệu"}
          open={openBrandName}
          setOpen={setOpenBrandName}
        />
      </div>
      <div className="">
        <h4 className="font-semibold font-sans text-[17px] text-gray-800">
          Khoảng giá
        </h4>
        <div className="px-3">
          <Slider
            value={value}
            onChange={handleChange}
            min={10000}
            max={5000000}
            step={10000}
            className=""
          />
          <div className="flex font-sans">
            <div className="text-sm">
              Từ
              <span className="text-black font-semibold">
                {" "}
                {value[0].toLocaleString("vi-VN")}đ
              </span>
            </div>
            <div className="text-sm ml-auto">
              Đến
              <span className="text-black font-semibold">
                {" "}
                {value[1].toLocaleString("vi-VN")}đ
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );  
};

export default Sidebar;
