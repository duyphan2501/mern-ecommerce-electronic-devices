import { IconButton } from "@mui/material";
import { RiMenu2Fill } from "react-icons/ri";
import Badge from "@mui/material/Badge";
import { BiLogOut, BiSolidBellRing } from "react-icons/bi";
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import { useState } from "react";
import { IoSettingsSharp } from "react-icons/io5";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <header className="pl-62 py-5 bg-white border-b-2 border-gray-200 ">
      <div className="px-10 flex justify-between items-center">
        <IconButton>
          <RiMenu2Fill className="text-black" />
        </IconButton>
        <div className="flex items-center gap-5">
          <div className="size-10 rounded shadow flex justify-center items-center hover:text-blue-500 cursor-pointer active:translate-y-[1px]">
            <Badge badgeContent={4} color="primary" variant="dot">
              <BiSolidBellRing size={20} />
            </Badge>
          </div>
          <div className="size-10 rounded shadow flex justify-center items-center hover:text-blue-500 cursor-pointer active:translate-y-[1px]">
              <IoSettingsSharp size={20} className="animate-spin"/>
          </div>
          {/*  */}
            <div className="size-10 flex justify-center items-center cursor-pointer active:translate-y-[1px]"
              onClick={handleClick}
              size="small"
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar sx={{ width: 40, height: 40 }}>
                <img src="https://isomorphic-furyroad.vercel.app/avatar.webp" alt="" className="size-full object-cover" />
              </Avatar>
            </div>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&::before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleClose}>
              <Avatar /> Profile
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Avatar /> My account
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <BiLogOut/>
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </div>
      </div>
    </header>
  );
};

export default Header;
