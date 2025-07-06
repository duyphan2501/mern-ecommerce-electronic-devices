import BrandCard from "./BrandCard";

const brands = Array.from({ length: 9 }, (_, i) => ({
  image: "https://powertech.vn/thumbs/540x540x2/upload/product/2-1179.png",
  logo: "https://cdn.enfsolar.com/z/s/logos/461606539b3250b2.png?v=1",
  content: "Deye",
  link: "/sanpham/brand/deye"
}));

const BrandGrid = () => {
  return (
    <div>
      <div className="grid xl:grid-cols-5 lg:grid-cols-4 gap-3 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
        {brands.map((brand, index) => (
          <BrandCard key={index} {...brand} />
        ))}
      </div>
    </div>
  );
};

export default BrandGrid;
