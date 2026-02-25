import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const NavLinkHeader = () => {
  return (
    <ul className=" flex items-center xl:gap-x-3 lg:gap-x-2 gap-x-1">
      <li>
        <Link className="" to={"/"}>
          <Button className="link !py-3">Trang chủ</Button>
        </Link>
      </li>
      <li>
        <Link className="" to={"/gioi-thieu"}>
          <Button className="link !py-3">Giới thiệu</Button>
        </Link>
      </li>
      <li className="relative">
        <Link className="" to={"/product"}>
          <Button className="link !py-3">Sản phẩm</Button>
        </Link>
        <ul className="submenu absolute top-[100%] left-0 bg-white shadow-sm z-10">
          <li>
            <Link className="" to={"/product/linh-kien"}>
              <Button className="link">Linh kiện</Button>
            </Link>
          </li>
          <li>
            <Link className="" to={"/product/thiet-bi-dien"}>
              <Button className="link">Thiết bị điện</Button>
            </Link>
          </li>
          <li>
            <Link className="" to={"/product/mo-đun"}>
              <Button className="link">Mô-đun</Button>
            </Link>
          </li>
          <li>
            <Link className="" to={"/product/chi-tiet-may"}>
              <Button className="link">Chi tiết máy</Button>
            </Link>
          </li>
        </ul>
      </li>
      <li>
        <Link className="" to={"/dich-vu"}>
          <Button className="link !py-3">Dịch vụ</Button>
        </Link>
      </li>
      <li>
        <Link className="" to={"/tin-tuc"}>
          <Button className="link !py-3">Tin tức</Button>
        </Link>
      </li>
      <li>
        <Link className="" to={"/lien-he"}>
          <Button className="link !py-3">Liên hệ</Button>
        </Link>
      </li>
    </ul>
  );
};

export default NavLinkHeader;
