import ProductCard from "./ProductCard";

const ProductGridView = ({ products, isLoading = true }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading...</p>
      </div>
    );
  }
  if (!products || products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Không có sản phẩm nào.</p>
      </div>
    );
  }
  return (
    <div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-3">
        {products &&
          products.map((product) => {
            return (
              <div className="min-w-0" key={product._id}>
                <ProductCard product={product} />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ProductGridView;
