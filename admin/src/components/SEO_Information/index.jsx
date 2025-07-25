import TextInput from "../BasicInfoProduct/TextInput";

const SEO_Information = () => {
  return (
    <div className="">
      <h3 className="font-bold text-xl">SEO Information</h3>
      <div className="flex flex-col md:gap-5 mt-5">
        <div className="md:flex items-center gap-5">
          <div className="flex-1">
            <p className="font-semibold mb-1">Page Title</p>
            <TextInput placeholder={"Page Title"} />
          </div>
          <div className="flex-1 mt-5 md:mt-0">
            <p className="font-semibold mb-1">Meta Keywords</p>
            <TextInput placeholder={"Meta Keywords"} />
          </div>
        </div>
        <div className="md:flex items-center gap-5">
          <div className="flex-1 mt-5 md:mt-0">
            <p className="font-semibold mb-1">Meta Description</p>
            <TextInput placeholder={"Meta Description"} />
          </div>
          <div className="flex-1 mt-5 md:mt-0">
            <p className="font-semibold mb-1">Product URL</p>
            <TextInput placeholder={"Product URL"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEO_Information;
