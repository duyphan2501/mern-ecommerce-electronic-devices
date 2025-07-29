import { useContext, useState } from "react";
import ImageItem from "./ImageItem";
import MyContext from "../../Context/MyContext";
import ImageView from "./ImageView";

const ProductImage = ({ product, handleChangeValue }) => {
  const [imageSrcArray, setImageSrcArray] = useState(
    product?.images.length > 0 ? product?.images : [null]
  );

  const updateProductImage = (imagesArr) => {
    setImageSrcArray(imagesArr);
    const updatedImages = [...imagesArr];
    updatedImages.splice(updatedImages.length - 1, 1);
    handleChangeValue("images", updatedImages);
  };

  const handleImageChange = (index, newImageSrc) => {
    const updatedImages = [...imageSrcArray];
    updatedImages[index] = newImageSrc;
    updateProductImage(updatedImages);
    return updatedImages;
  };

  const deleteImageSrc = (index) => {
    const updatedImages = [...imageSrcArray];
    updatedImages.splice(index, 1);
    updateProductImage(updatedImages);
    // If the last image is deleted, add a new empty holder
    if (updatedImages.length === 0 || updatedImages[updatedImages.length - 1]) {
      updatedImages.push(null);
    }
    console.log("Delete Image Sources:", updatedImages);
  };

  const addImageHolder = (imageArr) => {
    const updatedImages = [...imageArr];
    updatedImages.push(null);
    updateProductImage(updatedImages);
  };

  const indexImageView = useContext(MyContext).indexImageView;

  return (
    <div className="flex flex-col gap-3 ">
      <h3 className="text-xl font-bold">Product Image</h3>
      <p className="text-gray-500">
        Choose a product photo or simply drag and drop up here.
      </p>

      <div className="flex items-center gap-4 flex-wrap">
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
      <p className="text-gray-500 text-sm">
        Image formats: .jpg, .jpeg, .png, preferred size: 1:1, image size is
        restricted to a maximum of 500kb.
      </p>
    </div>
  );
};

export default ProductImage;
