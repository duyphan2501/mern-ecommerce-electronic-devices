import { useState } from "react";
import {
  Button,
} from "@mui/material";
import TextInput from "../BasicInfoProduct/TextInput";
import Pricing from "../Pricing";
import StockTracking from "../StockTracking";
import TiptapEditor from "../TiptapEditor";
import DocumentUpload from "../DocumentUpload";

const defaultModel = {
  model_code: "",
  price: "",
  stock: "",
  document: "",
  specification: "",
};

const ProductModels = () => {
  const [models, setModels] = useState([defaultModel]);

  const handleChange = (index, field, value) => {
    const newModels = [...models];
    newModels[index][field] = value;
    setModels(newModels);
  };

  const handleAddModel = () => {
    setModels([...models, defaultModel]);
  };

  const handleRemoveModel = (index) => {
    const newModels = models.filter((_, i) => i !== index);
    setModels(newModels);
  };

  return (
    <div>
      <h2 className="font-bold text-xl">Products Models</h2>
      {models.map((model, index) => (
        <div className="my-5">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-xl mb-3">Model {index + 1}</h4>
            <Button
              className="!bg-red-400 !text-white !normal-case !rounded-lg"
              onClick={() => handleRemoveModel(index)}
            >
              Delete
            </Button>
          </div>
          <div className="flex flex-col ">
            <div className="">
              <p className="mb-1 font-semibold">Model Name</p>
              <TextInput />
            </div>
            <div className="mb-5">
              <Pricing />
            </div>
            <div className="mb-5">
              <StockTracking />
            </div>
            <div className="mb-5">
              <p className="font-semibold mb-1">Specifications</p>
              <TiptapEditor />
            </div>
            <div className="">
              <p className="font-semibold mb-1">Technical Documents</p>
              <DocumentUpload />
            </div>
            <div className="flex justify-center mt-5">
              <div className="h-[3px] bg-gray-300 w-50"></div>
            </div>
          </div>
        </div>
      ))}
      <Button variant="outlined" className="!border-2 !normal-case" onClick={handleAddModel}>
        + Add Model
      </Button>
    </div>
  );
};

export default ProductModels;
