import ProductGridView from "../components/ProductGridView";
import Sidebar from "../components/Sidebar";

const ProductPage = () => {
  return (
    <main className="bg-white">
      <section className="lg:flex container gap-4 py-5">
        <div className="lg:w-1/5 bg-white lg:sticky top-35 self-start mb-5">
          <Sidebar/>
        </div>
        <div className="lg:w-4/5 ">
          <ProductGridView />
        </div>
      </section>
    </main>
  );
};

export default ProductPage;
