import { useContext, useState } from "react";
import ImageItem from "./ImageItem";
import MyContext from "../../Context/MyContext";
import ImageView from "./ImageView";

const ProductImage = ({ product, handleChangeValue }) => {
  const [imageSrcArray, setImageSrcArray] = useState(
    product?.images.length > 0 ? product?.images : [null]
  );

  // const updateProductImage = (imagesArr) => {
  //   setImageSrcArray(imagesArr);
  //   const updatedImages = [...imagesArr];
  //   updatedImages.splice(updatedImages.length - 1, 1);
  //   handleChangeValue("images", updatedImages);
  // };

  // const handleImageChange = (index, newImageSrc) => {
  //   const updatedImages = [...imageSrcArray];
  //   updatedImages[index] = newImageSrc;
  //   updateProductImage(updatedImages);
  //   return updatedImages;
  // };

  const deleteImageSrc = (index) => {
    const updatedImageSrcs = [...imageSrcArray];
    const updatedImageFile = [...product.images]
    updatedImageSrcs.splice(index, 1);
    updatedImageFile.splice(index, 1);
    setImageSrcArray(updatedImageSrcs);
    handleChangeValue("images", updatedImageFile)
  };

  const addImageHolder = (imageArr) => {
    const updatedImages = [...imageArr];
    updatedImages.push(null);
    setImageSrcArray(updatedImages);
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
            onChangeImageFile={handleChangeValue}
            onChangeImageBase64={setImageSrcArray}
            addImageHolder={addImageHolder}
            deleteImage={deleteImageSrc}
            imageSrcArray={imageSrcArray}
            product={product}
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
