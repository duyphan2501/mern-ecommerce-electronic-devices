import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import MyContext from "../Context/MyContext";
import ProductZoom from "./ProductZoom";
import ProductDetailContent from "./ProductDetailContent";
import { IoClose } from "react-icons/io5";
import { useContext, useEffect, useState } from "react";
import { getSelectedModelImages } from "../utils/productImages";

export default function ViewMoreDialog() {
  const { isOpenModal, closeModal, selectedProduct } = useContext(MyContext);
  const [selectedModelIndex, setSelectedModelIndex] = useState(
    selectedProduct?.selectedModelIndex || 0,
  );
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    setSelectedModelIndex(selectedProduct?.selectedModelIndex || 0);
  }, [selectedProduct]);

  if (!isOpenModal || !selectedProduct) {
    return null;
  }

  const selectedImages = getSelectedModelImages(
    selectedProduct,
    selectedModelIndex,
  );

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
              <ProductZoom imageAddress={selectedImages} />
            </div>
            <section>
              <ProductDetailContent
                product={selectedProduct}
                onSelectedModelChange={setSelectedModelIndex}
              />
            </section>
          </section>
        </DialogContent>
      </Dialog>
    </>
  );
}
