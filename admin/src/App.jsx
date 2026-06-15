import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import ListProduct from "./Pages/Products/ListProduct";
import CreateProduct from "./Pages/Products/CreateProduct";
import EditProduct from "./Pages/Products/EditProduct";
import { Toaster } from "react-hot-toast";
import PersistentLogin from "./components/PersistentLogin";
import Layout from "./components/Layout";
import ListCategory from "./Pages/Category/ListCategory";
import Orders from "./Pages/Orders";
import Inventory from "./Pages/Inventory";
import ListSlides from "./Pages/Slides/ListSlides";
import SlideForm from "./Pages/Slides/SlideForm";
import ListServices from "./Pages/Services/ListServices";
import ServiceForm from "./Pages/Services/ServiceForm";
function App() {
  return (
    <>
      <BrowserRouter>
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route element={<PersistentLogin />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />}></Route>
              <Route path="/products/list" element={<ListProduct />}></Route>
              <Route path="/inventory" element={<Inventory />}></Route>
              <Route path="/categories" element={<ListCategory />}></Route>
              <Route path="/orders" element={<Orders />}></Route>
              <Route
                path="/home-slides/all"
                element={<ListSlides />}
              ></Route>
              <Route
                path="/home-slides/add"
                element={<SlideForm />}
              ></Route>
              <Route
                path="/home-slides/edit/:id"
                element={<SlideForm />}
              ></Route>
              <Route path="/services" element={<ListServices />}></Route>
              <Route path="/services/add" element={<ServiceForm />}></Route>
              <Route
                path="/services/edit/:id"
                element={<ServiceForm />}
              ></Route>
              <Route
                path="/products/create"
                element={<CreateProduct />}
              ></Route>
              <Route
                path="/products/edit/:id"
                element={<EditProduct />}
              ></Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
