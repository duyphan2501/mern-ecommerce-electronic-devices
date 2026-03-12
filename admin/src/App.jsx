import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import ListProduct from "./Pages/Products/ListProduct";
import CreateProduct from "./Pages/Products/CreateProduct";
import { Toaster } from "react-hot-toast";
import PersistentLogin from "./components/PersistentLogin";
import Layout from "./components/Layout";
import ListCategory from "./Pages/Category/ListCategory";
import Orders from "./Pages/Orders";
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
              <Route path="/categories" element={<ListCategory />}></Route>
              <Route path="/orders" element={<Orders />}></Route>
              <Route
                path="/products/create"
                element={<CreateProduct />}
              ></Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
