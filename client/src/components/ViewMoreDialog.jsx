import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import MyContext from "../Context/MyContext";
import ProductZoom from "./ProductZoom";
import ProductDetailContent from "./ProductDetailContent";
import { IoClose } from "react-icons/io5";
import { useContext } from "react";

export default function ViewMoreDialog() {
  const { isOpenModal, closeModal, selectedProduct } = useContext(MyContext);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  if (!isOpenModal || !selectedProduct) {
    return null;
  }

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={isOpenModal}
        onClose={closeModal}
        aria-labelledby="responsive-dialog-title"
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
              <ProductZoom imageAddress={selectedProduct?.images} />
            </div>
            <section>
              <ProductDetailContent product={selectedProduct} />
            </section>
          </section>
        </DialogContent>
      </Dialog>
    </>
  );
}
