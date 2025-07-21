import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./Pages/Dashboard";
import { useContext } from "react";
import MyContext from "./Context/MyContext";
import Login from "./Pages/Login";
import ListProduct from "./Pages/Products/ListProduct";
import CreateProduct from "./Pages/Products/CreateProduct";

function App() {
  const { isOpenSidebar, isLogin } = useContext(MyContext);
  return (
    <>
      <BrowserRouter>
        {!isLogin ? (
          <Login />
        ) : (
          <div className="flex h-full">
            <div
              className={`transition-all ${
                isOpenSidebar ? "w-[18%] min-w-[270px]" : "w-[6%]"
              } min-w-[80px] `}
            >
              <Sidebar />
            </div>
            <main
              className={`${
                isOpenSidebar ? "w-[82%] " : "w-[94%]"
              } relative z-0`}
            >
              <Header />
              <Routes>
                <Route path="/" element={<Dashboard />}></Route>
                <Route path="/products/list" element={<ListProduct />}></Route>
                <Route path="/products/create" element={<CreateProduct />}></Route>
              </Routes>
            </main>
          </div>
        )}
      </BrowserRouter>
    </>
  );
}

export default App;
