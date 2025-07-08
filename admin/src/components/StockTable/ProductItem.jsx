
const ProductItem = ({name, image, brand}) => {
  return (
    <div className="flex items-center gap-2">
        <div className="size-[50px] border border-gray-200 rounded-lg overflow-hidden">
            <img src={image} alt={name} className="size-full object-contain"/>
        </div>
        <div className="">
            <p className="font-bold text-[17px] line-clamp-1">{name}</p>
            <p className="text-gray-400">{brand}</p>
        </div>
    </div>
  )
}

export default ProductItem