import { IconButton } from "@mui/material";
import { RiMenu2Fill } from "react-icons/ri";
import Badge from "@mui/material/Badge";
import { BiSolidBellRing } from "react-icons/bi";
const Header = () => {
  return (
    <header className="pl-60 py-3 border-b-2 border-gray-200 ">
      <div className="px-5 flex justify-between items-center">
        <IconButton>
          <RiMenu2Fill className="text-black" />
        </IconButton>
        <div className="flex gap-2">
          <IconButton>
            <Badge badgeContent={4} color="primary" variant="dot">
              <BiSolidBellRing  className="text-black" />
            </Badge>
          </IconButton>
        </div>
      </div>
    </header>
  );
};

export default Header;
