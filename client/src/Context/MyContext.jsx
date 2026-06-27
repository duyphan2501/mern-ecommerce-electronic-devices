import { createContext, useState, useMemo, useCallback } from "react";
import { FiLoader } from "react-icons/fi";

const MyContext = createContext();

export const MyContextProvider = ({ children }) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenCart, setIsOpenCart] = useState(false);
  const [isOpenAddrFrm, setIsOpenAddrFrm] = useState(false);
  const [updateAddr, setUpdateAddr] = useState(null);
  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem("persist")) || false,
  );
  const [selectedProduct, setSelectedProduct] = useState({});

  const openModal = useCallback(() => {
    setIsOpenModal(true);
  }, []);
  const closeModal = useCallback(() => {
    setIsOpenModal(false);
  }, []);

  const openCart = useCallback(() => setIsOpenCart(true), []);
  const closeCart = useCallback(() => setIsOpenCart(false), []);

  const openAddrFrm = useCallback(() => setIsOpenAddrFrm(true), []);
  const closeAddrFrm = useCallback(() => setIsOpenAddrFrm(false), []);

  const fiLoader = <FiLoader size={20} className="animate-spin" />;

  const values = useMemo(
    () => ({
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
    }),
    [
      isOpenModal,
      isOpenCart,
      isOpenAddrFrm,
      persist,
      selectedProduct,
      updateAddr,
      openModal,
      closeModal,
      openCart,
      closeCart,
      openAddrFrm,
      closeAddrFrm,
    ],
  );

  return <MyContext.Provider value={values}>{children}</MyContext.Provider>;
};


export default MyContext;