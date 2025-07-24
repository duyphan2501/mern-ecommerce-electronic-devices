import { useContext, useState } from "react";
import ImageItem from "./ImageItem";
import MyContext from "../../Context/MyContext";
import ImageView from "./ImageView";

const ProductImage = () => {
  const [imageSrcArray, setImageSrcArray] = useState([null]);

  const handleImageChange = (index, newImageSrc) => {
    const updatedImages = [...imageSrcArray];
    updatedImages[index] = newImageSrc;
    setImageSrcArray(updatedImages);
    return updatedImages;
  };

  const deleteImageSrc = (index) => {
    const updatedImages = [...imageSrcArray];
    updatedImages.splice(index, 1);
    setImageSrcArray(updatedImages);
    // If the last image is deleted, add a new empty holder
    if (updatedImages.length === 0 || updatedImages[updatedImages.length - 1]) {
      updatedImages.push(null);
    }
    console.log("Delete Image Sources:", updatedImages);
  };

  const addImageHolder = (imageArr) => {
    const updatedImages = [...imageArr];
    updatedImages.push(null);
    setImageSrcArray(updatedImages);
    console.log("Add Image Sources:", updatedImages);
  };

  const indexImageView = useContext(MyContext).indexImageView;

  return (
    <div className="flex flex-col gap-3 ">
      <h3 className="text-xl font-bold">Product Image</h3>
      <p className="text-gray-500">
        Choose a product photo or simply drag and drop up to 5 photos here.
      </p>

      <div className="flex items-center gap-4">
        {imageSrcArray.map((imageSrc, index) => (
          <ImageItem
            key={index}
            index={index}
            imageSrc={imageSrc}
            handleChange={handleImageChange}
            addImageHolder={addImageHolder}
            deleteImage={deleteImageSrc}
          />
        ))}
      </div>
      {indexImageView >= 0 && <ImageView imageSrc={imageSrcArray} />}
    </div>
  );
};

export default ProductImage;
