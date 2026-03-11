import { Button } from "@mui/material"

const BrowseButton = ({link="/products"}) => {
  return (
    <Button component="a" href={link} className="!bg-white !border-2 !border-gray-700 !text-gray-700 transition-all duration-300 !font-bold !font-sans !text-sm !px-4 !py-2 !rounded-3xl hover:!text-white hover:!bg-black hover:!border-black">
        Xem tất cả
    </Button>
  ) 
}

export default BrowseButton