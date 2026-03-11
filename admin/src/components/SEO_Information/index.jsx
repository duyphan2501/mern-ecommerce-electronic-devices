import TextInput from "../BasicInfoProduct/TextInput";
import { FaPen } from "react-icons/fa6";
import slugify from "../../utils/Slugify";

const SEO_Information = ({ product, handleChange }) => {
  return (
    <div>
      <h3 className="font-bold text-xl">SEO Information</h3>
      <div className="flex flex-col gap-5 mt-5">
        <div className="">
          <p className="font-semibold mb-1 flex items-center gap-2">
            Page Title{" "}
            <button
              className="hover:bg-gray-300 p-1 cursor-pointer active:bg-gray-200 rounded-full"
              onClick={() =>
                handleChange("pageTitle", product.productName)
              }
            >
              <FaPen size={15} />
            </button>
          </p>
          <TextInput
            placeholder="Page Title"
            value={product?.pageTitle || ""}
            onChange={(val) => handleChange("pageTitle", val)}
          />
        </div>
        <div className="">
          <p className="font-semibold mb-1 flex items-center gap-2">
            Meta Keywords{" "}
            <button
              className="hover:bg-gray-300 p-1 cursor-pointer active:bg-gray-200 rounded-full"
              onClick={() =>
                handleChange("metaKeywords", product.productName)
              }
            >
              <FaPen size={15} />
            </button>
          </p>
          <TextInput
            placeholder="Meta Keywords"
            value={product?.metaKeywords || ""}
            onChange={(val) => handleChange("metaKeywords", val)}
          />
        </div>
        <div className="">
          <p className="font-semibold mb-1 flex items-center gap-2">
            Meta Description{" "}
            <button
              className="hover:bg-gray-300 p-1 cursor-pointer active:bg-gray-200 rounded-full"
              onClick={() =>
                handleChange("metaDescription", product.productName)
              }
            >
              <FaPen size={15} />
            </button>
          </p>
          <TextInput
            placeholder="Meta Description"
            value={product?.metaDescription || ""}
            onChange={(val) => handleChange("metaDescription", val)}
          />
        </div>
        <div className="">
          <p className="font-semibold mb-1 flex items-center gap-2">
            Product URL{" "}
            <button
              className="hover:bg-gray-300 p-1 cursor-pointer active:bg-gray-200 rounded-full"
              onClick={() =>
                handleChange("productUrl", slugify(product.productName))
              }
            >
              <FaPen size={15} />
            </button>
          </p>
          <TextInput
            placeholder="Product URL"
            value={product?.productUrl || ""}
            onChange={(val) => handleChange("productUrl", val)}
          />
        </div>
      </div>
    </div>
  );
};

export default SEO_Information;
