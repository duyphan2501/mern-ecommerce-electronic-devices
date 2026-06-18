import { useEffect, useState } from "react";
import ImageItem from "./ImageItem";
import ImageView from "./ImageView";

const ProductImage = ({
  images = [],
  handleChangeValue,
  title = "Product Image",
}) => {
  const buildImageSources = (imageList = []) => {
    const sources = imageList
      .filter(Boolean)
      .map((image) =>
        image instanceof File ? URL.createObjectURL(image) : image,
      );

    return [...sources, null];
  };

  const withImageHolder = (imageList = []) => {
    const sources = imageList.filter(Boolean);
    return [...sources, null];
  };

  const [imageSrcArray, setImageSrcArray] = useState(() =>
    buildImageSources(images),
  );
  const [indexImageView, setIndexImageView] = useState(-1);

  useEffect(() => {
    setImageSrcArray(buildImageSources(images));
  }, [images]);

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
    const updatedImageFile = [...images]
    updatedImageFile.splice(index, 1);
    setImageSrcArray(buildImageSources(updatedImageFile));
    handleChangeValue(updatedImageFile)
  };

  return (
    <div className="flex flex-col gap-3 ">
      <h3 className="text-xl font-bold">{title}</h3>
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
            onChangeImageBase64={(nextImages) =>
              setImageSrcArray(withImageHolder(nextImages))
            }
            deleteImage={deleteImageSrc}
            onViewImage={setIndexImageView}
            imageSrcArray={imageSrcArray}
            images={images}
          />
        ))}
      </div>
      {indexImageView >= 0 && (
        <ImageView
          imageSrc={imageSrcArray}
          indexImageView={indexImageView}
          onClose={() => setIndexImageView(-1)}
        />
      )}
      <p className="text-gray-500 text-sm">
        Image formats: .jpg, .jpeg, .png, preferred size: 1:1, image size is
        restricted to a maximum of 500kb.
      </p>
    </div>
  );
};

export default ProductImage;
