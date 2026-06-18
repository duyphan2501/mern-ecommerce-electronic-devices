import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import TextInput from "../BasicInfoProduct/TextInput";
import Pricing from "../Pricing";
import TiptapEditor from "../TiptapEditor";
import DocumentUpload from "../DocumentUpload";
import ProductImage from "../ProductImage";

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
  };

  const handleAddModel = () => {
    updateModels([...models, { ...defaultModel, documents: [] }]);
  };

  const handleRemoveModel = (index) => {
    const newModels = models.filter((_, i) => i !== index);
    updateModels(newModels);
  };

  return (
    <div>
      <h2 className="font-bold text-xl">Product Models</h2>
      {models.map((model, index) => (
        <div className="my-5 border border-gray-200 rounded-lg p-4" key={model._id || index}>
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-xl mb-3">Model {index + 1}</h4>
            <Button
              className="!bg-red-400 !text-white !normal-case !rounded-lg"
              onClick={() => handleRemoveModel(index)}
              disabled={models.length === 1}
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
              <ProductImage
                images={model.images || []}
                handleChangeValue={(images) =>
                  handleChangeValue("images", index, images)
                }
                title={`Model ${index + 1} Images`}
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
