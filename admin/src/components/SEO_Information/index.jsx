import TextInput from "../BasicInfoProduct/TextInput";

const SEO_Information = ({ product, handleChange }) => {
  return (
    <div>
      <h3 className="font-bold text-xl">SEO Information</h3>
      <div className="flex flex-col gap-5 mt-5">
        <div className="">
          <p className="font-semibold mb-1">Page Title</p>
          <TextInput
            placeholder="Page Title"
            value={product?.pageTitle || ""}
            onChange={(val) => handleChange("pageTitle", val)}
          />
        </div>
        <div className="">
          <p className="font-semibold mb-1">Meta Keywords</p>
          <TextInput
            placeholder="Meta Keywords"
            value={product?.metaKeywords || ""}
            onChange={(val) => handleChange("metaKeywords", val)}
          />
        </div>
        <div className="">
          <p className="font-semibold mb-1">Meta Description</p>
          <TextInput
            placeholder="Meta Description"
            value={product?.metaDescription || ""}
            onChange={(val) => handleChange("metaDescription", val)}
          />
        </div>
        <div className="">
          <p className="font-semibold mb-1">Product URL</p>
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
