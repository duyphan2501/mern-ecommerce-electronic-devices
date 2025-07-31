import { useContext } from "react";
import DocumentUpload from "../DocumentUpload";
import TiptapEditor from "../TiptapEditor";
import MyContext from "../../Context/MyContext";
import TextInput from "./TextInput";

const BasicInfo = ({ product, handleChangeModel, handleChangeProduct }) => {
  const { hasModels } = useContext(MyContext);
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
        {!hasModels && (
          <>
            <div className="">
              <p className="font-semibold mb-1">Specifications</p>
              <TiptapEditor
                content={product?.models?.[0]?.specifications}
                handleChangeValue={(val) => handleChangeModel("specifications", 0, val)}
              />
            </div>
            <div className="">
              <p className="font-semibold mb-1">Technical Documents</p>
              <DocumentUpload
                field={"documents"}
                handleChangeValue={handleChangeModel}
                productDocuments={product?.models?.[0].documents}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BasicInfo;
