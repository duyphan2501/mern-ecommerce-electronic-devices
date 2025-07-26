import { useContext } from "react";
import DocumentUpload from "../DocumentUpload";
import TiptapEditor from "../TiptapEditor";
import MyContext from "../../Context/MyContext";

const BasicInfo = () => {
  const {hasModels} = useContext(MyContext)
  return (
    <div>
      <h3 className="font-bold text-xl">Basic Information</h3>
      <div className="flex flex-col gap-5 mt-5">
        <div className="">
          <p className="font-semibold">Product Name</p>
          <div className="">
            <input
              type="text"
              className="border-none bg-gray-100 rounded-lg w-full p-3 mt-1 focus:outline-blue-500"
              placeholder="Enter product name"
            />
          </div>
        </div>
        <div className="">
          <p className="font-semibold mb-2">Description</p>
          <TiptapEditor />
        </div>
        {!hasModels && <>
        <div className="">
          <p className="font-semibold mb-1">Specifications</p>
          <TiptapEditor />
        </div>
        <div className="">
          <p className="font-semibold mb-1">Technical Documents</p>
          <DocumentUpload />
        </div>
        </>}
      </div>
    </div>
  );
};

export default BasicInfo;
