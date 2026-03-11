import { FaFacebookMessenger } from "react-icons/fa";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Suspense, lazy, useContext, useEffect } from "react";
import { Toaster } from "react-hot-toast";

// Components thường dùng chung (load ngay từ đầu)
import Header from "./components/Header";
import TopStrip from "./components/TopStrip";
import Footer from "./components/Footer";
import ViewMoreDialog from "./components/ViewMoreDialog";
import CartDrawer from "./components/CartDrawer";
import PersistentLogin from "./components/PersistentLogin";
import MyContext from "./Context/MyContext";
import useAuthStore from "./store/authStore";
import useCartStore from "./store/cartStore";
import AddressForm from "./components/AddressForm";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
import useAddressStore from "./store/addressStore";
import OrderSuccess from "./pages/OrderSuccess";
import OrderTracking from "./pages/OrderTracking";
import useCategoryStore from "./store/categoryStore";

// Lazy load cho các page
const Home = lazy(() => import("./pages/Home"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Login = lazy(() => import("./pages/Login"));
const ChangePassword = lazy(() => import("./pages/ChangePassword"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const MyAccount = lazy(() => import("./pages/MyAccount"));
const Register = lazy(() => import("./pages/Register"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));

function App() {
  const { isOpenModal, isOpenAddrFrm } = useContext(MyContext);
  const user = useAuthStore((state) => state.user);
  const loadCart = useCartStore((state) => state.loadCart);

  const getCart = async () => {
    try {
      await loadCart(user?._id);
    } catch (error) {
      console.error("Failed to load cart:", error);
    }
  };

  useEffect(() => {
    getCart();
  }, [user, loadCart]);

  const getAllAddresses = useAddressStore((state) => state.getAllAddresses);
  const getListCategories = useCategoryStore(
    (state) => state.getListOfCategories,
  );
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    if (!user) return;
    const fetchAddresses = async () => {
      try {
        await getAllAddresses(axiosPrivate);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };
    fetchAddresses();
  }, [user]);

  useEffect(() => {
    const fetchListCategories = async () => {
     await getListCategories();
    };
    fetchListCategories();
  }, []);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="fixed bottom-5 right-3 z-20 hidden lg:block">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center shadow-md animate-bounce cursor-pointer ">
            <FaFacebookMessenger size={27} className="text-white" />
          </div>
        </div>
      </div>

      <BrowserRouter>
        <TopStrip />
        <Header />
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-screen">
              <p>Loading...</p>
            </div>
          }
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/reset-password/:token" element={<ChangePassword />} />

            <Route element={<PersistentLogin />}>
              <Route path="/" element={<Home />} />
              <Route path="/products/:slug" element={<ProductPage />} />
              <Route path="/products" element={<ProductPage />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/my-account/:tab" element={<MyAccount />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/order/:orderId" element={<OrderTracking />} />
            </Route>
          </Routes>
        </Suspense>

        <CartDrawer />
        {isOpenModal && <ViewMoreDialog />}
        {isOpenAddrFrm && <AddressForm />}
      </BrowserRouter>
      <Footer />
    </>
  );
}

export default App;
