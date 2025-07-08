import { Rating, Stack } from "@mui/material"

const TopProductItem = ({product}) => {
  return (
    <div className="py-3 flex justify-between items-center">
        <div className="flex-1">
            <div className="flex gap-2  ">
                <div className="size-[50px] rounded-md bg-gray-300 overflow-hidden border border-gray-200">
                    <img src={product.image} alt={product.name} className="size-full object-contain"/>
                </div>
                <div className="flex flex-col">
                    <p className=" font-bold line-clamp-1">{product.name}</p>
                    <p className="text-gray-500">Sold: {product.sold}</p>
                </div>
            </div>
        </div>
        <div className="flex flex-col items-end">
            <Stack spacing={1}>
              <Rating
                size="small"
                name="half-rating"
                defaultValue={product.rating}
                precision={0.5}
                readOnly
              />
            </Stack>
            <p className="text-gray-500 text-center">{product.reviews} reviews</p>
        </div>
    </div>
  )
}

export default TopProductItem