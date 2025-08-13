import { Button } from "@mui/material";
import useProductStore from "../../store/productStore";
import { useContext } from "react";
import MyContext from "../../Context/MyContext";

const CreateFooter = ({ onSubmit }) => {
  const { isLoading, cancelSaveProduct } = useProductStore();
  const { fiLoader } = useContext(MyContext);
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-end items-center gap-5">
      <Button
        className="!bg-red-400 !text-white !rounded-lg !min-w-25 h-9 !normal-case !font-semibold hover:!bg-black"
        onClick={cancelSaveProduct}
      >
        Cancel
      </Button>
      <Button
        className="!bg-blue-500 !text-white !rounded-lg !min-w-25 h-9 !normal-case !font-semibold hover:!bg-black"
        onClick={onSubmit}
      >
        {isLoading ? fiLoader : "Save"}
      </Button>
    </div>
  );
};

export default CreateFooter;
