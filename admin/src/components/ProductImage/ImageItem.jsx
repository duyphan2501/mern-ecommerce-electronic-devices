import { useContext, useState } from "react";
import { IoMdEye } from "react-icons/io";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { PiImagesThin } from "react-icons/pi";
import MyContext from "../../Context/MyContext";
const ImageItem = ({
  index,
  imageSrc,
  handleChange,
  addImageHolder,
  deleteImage,
}) => {
  const { setIndexImageView } = useContext(MyContext);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const newArr = handleChange(index, reader.result);
      addImageHolder(newArr);
    };
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  return (
    <>
      {!imageSrc ? (
        <div className="">
          <label
            htmlFor="productImage"
            className="cursor-pointer size-33 p-2 border-2 border-dashed border-gray-300 rounded-lg text-center h-full flex flex-col justify-center items-center z-10"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}

          >
            <PiImagesThin size={50} />
            <p className="text-gray-500 text-[13px]">
              {isDragging
                ? "Drop your image here"
                : "Drag and drop or click to upload an image"}
            </p>
          </label>
          <input
            type="file"
            className="hidden"
            id="productImage"
            onChange={handleImageChange}
          />
        </div>
      ) : (
        <div>
          <div className="border border-gray-200 rounded-lg text-center size-33 p-2 relative overflow-hidden group">
            <img src={imageSrc} alt="" className="size-full object-cover" />
            <div className="absolute inset-0 bg-black opacity-60 invisible group-hover:visible "></div>
            <div className="absolute inset-0 z-10 flex justify-center items-center gap-3 invisible group-hover:visible ">
              <IoMdEye
                size={25}
                className="text-white cursor-pointer hover:text-gray-200"
                onClick={() => setIndexImageView(index)}
              />
              <RiDeleteBin5Fill
                size={20}
                className="text-white cursor-pointer hover:text-gray-200"
                onClick={() => deleteImage(index)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageItem;
