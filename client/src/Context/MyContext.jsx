import { createContext, useState } from "react";
import { FiLoader } from "react-icons/fi";

const MyContext = createContext();

export const MyContextProvider = ({ children }) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const openModal = () => {
    setIsOpenModal(true);
  };
  const closeModal = () => {
    setIsOpenModal(false);
  };

  const [isOpenCart, setIsOpenCart] = useState(false);
  const openCart = () => setIsOpenCart(true);
  const closeCart = () => setIsOpenCart(false);

  const [isOpenAddrFrm, setIsOpenAddrFrm] = useState(false);
  const openAddrFrm = () => setIsOpenAddrFrm(true);
  const closeAddrFrm = () => setIsOpenAddrFrm(false);
  const [updateAddr, setUpdateAddr] = useState(null)

  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem("persist")) || false
  );
  const [selectedProduct, setSelectedProduct] = useState({});
  const fiLoader = <FiLoader size={20} className="animate-spin" />;

  const values = {
    isOpenModal,
    openModal,
    closeModal,
    isOpenCart,
    openCart,
    closeCart,
    isOpenAddrFrm,
    openAddrFrm,
    closeAddrFrm,
    persist,
    setPersist,
    selectedProduct,
    setSelectedProduct,
    fiLoader,
    updateAddr,
    setUpdateAddr,
  };


  return <MyContext.Provider value={values}>{children}</MyContext.Provider>;
};

export default MyContext;
