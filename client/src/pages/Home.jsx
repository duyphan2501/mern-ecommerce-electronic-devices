import LazyComponentWrapper from "../components/LazyComponentWrapper";
import useCategoryStore from "../store/categoryStore";
import useProductStore from "../store/productStore";

const Home = () => {
  const { getProductByCategoryId, getNewProducts } = useProductStore();
  const categoryList = useCategoryStore((s) => s.categoryList);

  return (
    <div>
      <section className="py-5 mb-4">
        <LazyComponentWrapper
          importFunc={() => import("../components/HomeSlider")}
        />
        <LazyComponentWrapper
          importFunc={() => import("../components/HomeCardSlider")}
        />
      </section>
      <main className="bg-white">
        <div className="pt-5 flex items-center justify-center">
          <h2 className="font-black font-sans uppercase text-2xl border-b-3">
            Sản phẩm
          </h2>
        </div>
        {/*  */}
        <section>
          <div className="bg-white">
            <div className="container md:py-5 py-3 px-4 md:px-0">
              <div className="md:flex justify-between items-center">
                <h2 className="text-2xl font-bold font-sans">
                  Sản phẩm phổ biến
                </h2>
                <div className="text-right md:mt-0 mt-2">
                  <LazyComponentWrapper
                    importFunc={() => import("../components/BrowseButton")}
                    link={"/products"}
                  />
                </div>
              </div>
            </div>
            <div className="pb-5">
              <LazyComponentWrapper
                importFunc={() => import("../components/ProductSlider")}
                fetchProducts={getNewProducts}
              />
              a
            </div>
          </div>
        </section>
        <section>
          <div className="bg-white ">
            <div className="container md:py-5 py-3 px-4 md:px-0">
              <div className="md:flex justify-between items-center">
                <h2 className="text-2xl font-bold font-sans">
                  San phẩm mới nhất
                </h2>
                <div className="text-right md:mt-0 mt-2">
                  <LazyComponentWrapper
                    importFunc={() => import("../components/BrowseButton")}
                  />
                </div>
              </div>
            </div>
            <div className="">
              <LazyComponentWrapper
                importFunc={() => import("../components/ProductSlider")}
                fetchProducts={getNewProducts}
              />
            </div>
          </div>
        </section>
        {/* service */}
        <div className="py-5 mt-5 flex items-center justify-center">
          <h2 className="font-black font-sans uppercase text-2xl border-b-3">
            dịch vụ
          </h2>
        </div>
        <section>
          <LazyComponentWrapper
            importFunc={() => import("../components/ServiceSlider")}
          />
          <div className="text-center mt-5">
            <LazyComponentWrapper
              importFunc={() => import("../components/BrowseButton")}
            />
          </div>
        </section>
        {/*  */}
        <section>
          <div className="my-12">
            <LazyComponentWrapper
              importFunc={() => import("../components/AdsSlider")}
            />
          </div>
        </section>
        {/* Section: Brand Grid */}
        <section className="bg-white py-5">
          {categoryList.length > 0 &&
            categoryList.map((cate) => (
              <div className="bg-white ">
                <div className="container md:py-5 py-3 px-4 md:px-0">
                  <div className="md:flex justify-between items-center">
                    <h2 className="text-2xl font-bold font-sans">
                      {cate.name}
                    </h2>
                    <div className="text-right md:mt-0 mt-2">
                      <LazyComponentWrapper
                        importFunc={() => import("../components/BrowseButton")}
                        link={`/products/_${cate.slug}`}
                      />
                    </div>
                  </div>
                </div>
                <div className="">
                  <LazyComponentWrapper
                    importFunc={() => import("../components/ProductSlider")}
                    fetchProducts={() => getProductByCategoryId(cate._id)}
                  />
                </div>
              </div>
            ))}
        </section>
        {/* blog */}
        <section>
          <div className="py-5 flex items-center justify-center">
            <h2 className="font-black font-sans uppercase text-2xl border-b-3">
              tin tức
            </h2>
          </div>
          <div className="container pb-10">
            <LazyComponentWrapper
              importFunc={() => import("../components/BlogGrid")}
            />
          </div>
        </section>
      </main>
      <section>
        <div className="py-10">
          <div className="mb-10 flex items-center justify-center">
            <h2 className="font-black font-sans uppercase text-2xl border-b-3">
              Giá trị cốt lõi
            </h2>
          </div>
          <LazyComponentWrapper
            importFunc={() => import("../components/ScoreValue")}
          />
        </div>
      </section>
    </div>
  );
};

export default Home;
