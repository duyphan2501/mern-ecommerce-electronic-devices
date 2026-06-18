const ProductSkeleton = () => {
  return (
    <div className="h-full rounded-md border-1 border-gray-200 p-2 shadow animate-pulse">
      <div className="aspect-[4/3] min-h-[150px] max-h-[220px] rounded-md bg-gray-100" />
      <div className="mt-3 h-4 rounded bg-gray-100" />
      <div className="mt-2 h-4 w-3/4 rounded bg-gray-100" />
      <div className="mt-4 h-6 w-1/2 rounded bg-gray-100" />
      <div className="mt-4 h-10 rounded bg-gray-100" />
    </div>
  );
};

export default ProductSkeleton;
