import {
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { RiMenu2Fill } from "react-icons/ri";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { IoClose } from "react-icons/io5";

export default function CategoryDrawer({ isOpenDrawer, setOpenDrawer }) {
  const toggleDrawer = (newOpen) => () => {
    setOpenDrawer(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div className="">
      <Button
        onClick={toggleDrawer(true)}
        className="!text-[#505050] font-medium w-full !block"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center ">
            <RiMenu2Fill className="mr-2" size={20} />
            Danh mục sản phẩm
          </div>
          <div>
            <MdOutlineArrowDropDown className="" size={20} />
          </div>
        </div>
      </Button>
      <Drawer open={isOpenDrawer} onClose={toggleDrawer(false)}>
        <h3 className="flex items-center justify-between p-3 font-semibold text-content">
          Danh mục sản phẩm
          <div className="hover:bg-gray-200 p-1 rounded-full cursor-pointer transition">
            <IoClose onClick={toggleDrawer(false)} size={25} />
          </div>
        </h3>
        <Divider />
        {DrawerList}
      </Drawer>
    </div>
  );
}
