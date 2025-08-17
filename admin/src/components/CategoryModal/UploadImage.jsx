import { IconButton } from "@mui/material";
import { useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { RiDeleteBinLine } from "react-icons/ri";

const UploadImage = ({onChangeImage, image}) => {
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState(image || null);

  const processFile = (file) => {
    onChangeImage(file)
    const reader = new FileReader();
    reader.onloadend = () => {
      const previewBase64 = reader.result;
      setImagePreview(previewBase64);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const handleClear = () => {
    setImagePreview("");
    onChangeImage(null)
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  return (
    <div className="">
      <div
        className={`mt-3 border-2 rounded-lg ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        } cursor-pointer transition-all`}
      >
        <label
          htmlFor={"category-image"}
          className="flex justify-center items-center gap-2 cursor-pointer h-17 w-full"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <IoCloudUploadOutline size={24} />
          <span>Drop or select image here</span>
        </label>
        <input
          type="file"
          className="hidden w-full"
          id="category-image"
          onChange={handleChange}
        />
      </div>

      {/* image preview */}
      {imagePreview && (
        <div className="flex justify-center h-30 bg-gray-100 mt-3 relative group">
          <img src={imagePreview} className="h-full object-contain" />
          <IconButton
            className="!absolute !-top-1 !-right-1 !bg-gray-200 group-hover:!bg-gray-400 hover:!bg-red-700"
            onClick={handleClear}
          >
            <RiDeleteBinLine className="text-white" size={17} />
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default UploadImage;
