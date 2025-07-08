import TopProductItem from "./TopProductItem";

const products = [
  {
    image:
      "https://powertech.vn/thumbs/540x540x2/upload/product/capture-4067.png",
    name: "Inverter Deye 3kw 1 pha",
    sold: 1020,
    rating: 5,
    reviews: 12,
  },
  {
    image:
      "https://powertech.vn/thumbs/540x540x2/upload/product/capture-4067.png",
    name: "Inverter Deye 3kw 1 pha",
    sold: 1020,
    rating: 5,
    reviews: 12,
  },
  {
    image:
      "https://powertech.vn/thumbs/540x540x2/upload/product/capture-4067.png",
    name: "Inverter Deye 3kw 1 pha",
    sold: 1020,
    rating: 5,
    reviews: 12,
  },
  {
    image:
      "https://powertech.vn/thumbs/540x540x2/upload/product/capture-4067.png",
    name: "Inverter Deye 3kw 1 pha",
    sold: 1020,
    rating: 5,
    reviews: 12,
  },
];

const TopProducts = () => {
  return <div>
    {products.map((product,index) => <TopProductItem key={index} product={product}/>)}
  </div>;
};

export default TopProducts;
