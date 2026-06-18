import ProductSkeleton from "./Loading/ProductSkeleton";
import ProductCard from "./ProductCard";

const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-3 justify-center w-full">
    {Array.from({ length: count }).map((_, index) => (
      <div
        className="min-w-[220px] max-w-[300px] mx-auto w-full"
        key={`product-grid-skeleton-${index}`}
      >
        <ProductSkeleton />
      </div>
    ))}
  </div>
);

const ProductGridEmpty = ({ message }) => (
  <div className="flex min-h-64 items-center justify-center rounded-md border border-dashed border-gray-200 bg-gray-50 px-4 text-center text-sm text-gray-500">
    {message}
  </div>
);

const ProductGridView = ({
  products = [],
  isLoading = true,
  emptyMessage = "Chua co san pham nao.",
}) => {
  if (isLoading) {
    return <ProductGridSkeleton />;
  }

  if (!products.length) {
    return <ProductGridEmpty message={emptyMessage} />;
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-3 justify-center w-full">
      {products.map((product) => (
        <div
          className="min-w-[220px] max-w-[300px] mx-auto w-full"
          key={product._id}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductGridView;
