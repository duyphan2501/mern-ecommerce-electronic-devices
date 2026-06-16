import formatMoney from "../../utils/MoneyFormat";

const TopProductItem = ({ product }) => (
  <div className="flex items-center justify-between border-b border-gray-100 py-3 last:border-0">
    <div className="min-w-0 flex-1">
      <div className="flex gap-2">
        <div className="size-[50px] shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              className="size-full object-contain"
            />
          )}
        </div>
        <div className="min-w-0">
          <p className="line-clamp-1 font-bold">{product.name}</p>
          <p className="text-gray-500">Sold: {product.sold}</p>
        </div>
      </div>
    </div>
    <div className="ml-3 flex flex-col items-end text-sm">
      <p className="font-semibold text-gray-800">
        {formatMoney(product.revenue)}
      </p>
      <p className="text-gray-500">revenue</p>
    </div>
  </div>
);

export default TopProductItem;
