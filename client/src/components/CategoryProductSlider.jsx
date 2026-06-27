import { useCallback } from "react";
import LazyComponentWrapper from "../components/LazyComponentWrapper";
import useProductStore from "../store/productStore";

const CategoryProductSlider = ({ cateId }) => {
  const getProductByCategoryId = useProductStore(
    (s) => s.getProductByCategoryId,
  );

  const fetchProducts = useCallback(async () => {
    return getProductByCategoryId(cateId);
  }, [getProductByCategoryId, cateId]);

  return (
    <LazyComponentWrapper
      importFunc={() => import("../components/ProductSlider")}
      fetchProducts={fetchProducts}
    />
  );
};

export default CategoryProductSlider;   