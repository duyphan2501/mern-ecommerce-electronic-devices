import TiptapEditor from "../TiptapEditor";
import TextInput from "./TextInput";

const BasicInfo = ({ product, handleChangeProduct }) => {
  return (
    <div>
      <h3 className="font-bold text-xl">Basic Information</h3>
      <div className="flex flex-col gap-5 mt-5">
        <div className="">
          <p className="font-semibold mb-1">Product Name</p>
          <TextInput placeholder="Product Name"
              value={product?.productName || ""}
              onChange={(val) => handleChangeProduct("productName", val)}/>
        </div>
        <div className="">
          <p className="font-semibold mb-2">Description</p>
          <TiptapEditor
            content={product?.description}
            handleChangeValue={(val) => handleChangeProduct("description", val)}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;
