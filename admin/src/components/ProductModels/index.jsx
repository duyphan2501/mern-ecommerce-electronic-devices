import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import TextInput from "../BasicInfoProduct/TextInput";
import Pricing from "../Pricing";
import StockTracking from "../StockTracking";
import TiptapEditor from "../TiptapEditor";
import DocumentUpload from "../DocumentUpload";

const ProductModels = ({
  product,
  setProduct,
  handleChangeValue,
  defaultModel,
}) => {
  const [models, setModels] = useState(product?.models || []);

  useEffect(() => {
    setModels(product?.models || []);
  }, [product.models]);

  const updateModels = (newModels) => {
    setModels(newModels);
    setProduct((prev) => ({ ...prev, models: newModels }));
    console.log(newModels);
  };

  const handleAddModel = () => {
    console.log(models);
    updateModels([...models, defaultModel]);
  };

  const handleRemoveModel = (index) => {
    const newModels = models.filter((_, i) => i !== index);
    updateModels(newModels);
  };

  return (
    <div>
      <h2 className="font-bold text-xl">Products Models</h2>
      {models.map((model, index) => (
        <div className="my-5" key={index}>
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
              <TextInput
                placeholder="Model Name"
                value={model.modelName}
                onChange={(val) => handleChangeValue("modelName", index, val)}
              />
            </div>
            <div className="mb-5">
              <Pricing
                product={product}
                handleChangeValue={handleChangeValue}
                index={index}
              />
            </div>
            <div className="mb-5">
              <StockTracking
                product={product}
                handleChangeValue={handleChangeValue}
                index={index}
              />
            </div>
            <div className="mb-5">
              <p className="font-semibold mb-1">Specifications</p>
              <TiptapEditor
                content={model.specifications}
                handleChangeValue={(val) =>
                  handleChangeValue("specifications", index, val)
                }
              />
            </div>
            <div className="">
              <p className="font-semibold mb-1">Technical Documents</p>
              <DocumentUpload
                field={"documents"}
                modelIndex={index}
                handleChangeValue={handleChangeValue}
                productDocuments={model.documents}
              />
            </div>
            <div className="flex justify-center mt-5">
              <div className="h-[3px] bg-gray-300 w-50"></div>
            </div>
          </div>
        </div>
      ))}
      <Button
        variant="outlined"
        className="!border-2 !normal-case"
        onClick={handleAddModel}
      >
        + Add Model
      </Button>
    </div>
  );
};

export default ProductModels;
