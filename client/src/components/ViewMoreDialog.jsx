import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import MyContext from "../Context/MyContext";
import ProductZoom from "./ProductZoom";
import ProductDetailContent from "./ProductDetailContent";
import { IoClose } from "react-icons/io5";
import { useContext } from "react";

const product = {
  imageAddress: [
    "https://powertech.vn/thumbs/540x540x2/upload/product/capture-4067.png",
    "https://powertech.vn/thumbs/540x540x2/upload/product/thiet-ke-chua-co-ten-3496.png",
  ],
  name: "Inverter Dye Hydrid 3kw",
  price: 1000000,
  discount: 20,
  isNew: true,
  rating: 4.5,
  description:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  brand: "Deye",
};

export default function ViewMoreDialog() {
  const { isOpenModal, closeModal } = useContext(MyContext);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={isOpenModal}
        onClose={closeModal}
        aria-labelledby="responsive-dialog-title"
        transitionDuration={0}
      >
        <DialogContent className="">
          <div className="flex justify-end items-center">
            <div
              className="hover:bg-gray-200 rounded-full cursor-pointer transition p-2 w-fit self-end"
              onClick={closeModal}
            >
              <IoClose size={25} />
            </div>
          </div>
          <section className="lg:flex gap-5 pb-5">
            <div className="">
              <ProductZoom imageAddress={product.imageAddress} />
            </div>
            <section>
              <ProductDetailContent product={product} />
            </section>
          </section>
        </DialogContent>
      </Dialog>
    </>
  );
}
