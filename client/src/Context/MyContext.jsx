import { createContext, useState } from "react";

const MyContext = createContext();

export const MyContextProvider = ({ children }) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const openModal = () => {setIsOpenModal(true)};
  const closeModal = () => {setIsOpenModal(false)};

  const [isOpenCart, setIsOpenCart] = useState(false)
  const openCart = () => setIsOpenCart(true)
  const closeCart = () => setIsOpenCart(false)

  const [isOpenAddrFrm, setIsOpenAddrFrm] = useState(false)
  const openAddrFrm = () => setIsOpenAddrFrm(true)
  const closeAddrFrm = () => setIsOpenAddrFrm(false)

  const [persist, setPersist] = useState(JSON.parse(localStorage.getItem('persist')) || false)
  const [selectedProduct, setSelectedProduct] = useState({})

  const values = {isOpenModal, openModal, closeModal, isOpenCart, openCart, closeCart, isOpenAddrFrm, openAddrFrm, closeAddrFrm, persist, setPersist, selectedProduct, setSelectedProduct }
  
  return (
    <MyContext.Provider value={values}>
      {children}
    </MyContext.Provider>
  );
};

export default MyContext
