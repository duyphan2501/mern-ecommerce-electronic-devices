import ProductZoom from "../components/ProductZoom";
import ProductDetailContent from "../components/ProductDetailContent";
import ProductDetailInfo from "../components/ProductDetailInfo";
import LazyComponentWrapper from "../components/LazyComponentWrapper";

const product = {
  imageAddress: [
    "https://powertech.vn/thumbs/540x540x2/upload/product/capture-4067.png",
    "https://powertech.vn/thumbs/540x540x2/upload/product/thiet-ke-chua-co-ten-3496.png",
  ],
  name: "Inverter Dye Hydrid 3kw",
  price: 1000000,
  discount: 20,
  isNew: true,
  rating: 4.5,
  description:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  brand: "Deye",
};

const ProductDetail = () => {
  return (
    <div className="bg-white">
      <div className="container">
        <section className="lg:flex gap-5 py-5">
          <div className="">
            <ProductZoom imageAddress={product.imageAddress} />
          </div>
          <section>
            <ProductDetailContent product={product} />
          </section>
        </section>
        <section className="">
          <ProductDetailInfo product={product} />
        </section>
        <h2 className="text-2xl font-bold font-sans mt-2">Sản phẩm tương tự</h2>
      </div>
      <div className="pt-5 pb-10">
        <LazyComponentWrapper
          importFunc={() => import("../components/ProductSlider")}
        />
      </div>
    </div>
  );
};

export default ProductDetail;
