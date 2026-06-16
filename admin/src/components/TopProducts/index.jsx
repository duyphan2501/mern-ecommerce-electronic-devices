import TopProductItem from "./TopProductItem";

const TopProducts = ({ products = [] }) => {
  if (!products.length) {
    return (
      <div className="py-12 text-center text-gray-500">
        No delivered products yet.
      </div>
    );
  }

  return (
    <div>
      {products.map((product) => (
        <TopProductItem key={product.modelId} product={product} />
      ))}
    </div>
  );
};

export default TopProducts;
