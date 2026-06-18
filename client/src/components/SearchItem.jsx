import formatMoney from "../utils/MoneyFormat";
import { getProductPreviewImage } from "../utils/productImages";

const SearchItem = ({product}) => {
  if (!product) return null;  
  const price = product.modelsId[0]?.salePrice || 0;
  const discount = product.modelsId[0]?.discount || 0;
  const finalPrice = price - (price * discount) / 100;
  const image = getProductPreviewImage(product);

  return (
    <a href={`/product/${product.productUrl}`} className="block">
    <div className="p-2 hover:bg-gray-100 cursor-pointer">
      <div className="flex items-center">
        <img src={image} alt={product.productName} className="w-12 h-12 object-cover rounded-md" />
        <div className="ml-3">
          <h4 className="text-sm font-medium">{product.productName}</h4>
          <p className="text-sm text-gray-500">{formatMoney(finalPrice)}</p>
        </div>
      </div>
    </div>
    </a>
  )
}

export default SearchItem
