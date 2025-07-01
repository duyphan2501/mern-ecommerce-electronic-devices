import { FaFacebookMessenger, FaArrowUp } from "react-icons/fa";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import TopStrip from "./components/TopStrip";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import ProductPage from "./pages/ProductPage";
import ProductDetail from "./pages/ProductDetail";
import ViewMoreDialog from "./components/ViewMoreDialog";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ChangePassword from "./pages/ChangePassword";
import { Toaster } from "react-hot-toast";
import CartDrawer from "./components/CartDrawer";
import Cart from "./pages/Cart";

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="fixed bottom-1/4 right-3 z-20 hidden lg:block">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center shadow-md animate-bounce cursor-pointer ">
            <FaFacebookMessenger size={27} className="text-white" />
          </div>
        </div>
      </div>

      <BrowserRouter>
        <TopStrip />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/san-pham" element={<ProductPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/san-pham/chi-tiet" element={<ProductDetail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
        <CartDrawer />
        <ViewMoreDialog />
      </BrowserRouter>
      <Footer />
    </>
  );
}

export default App;
