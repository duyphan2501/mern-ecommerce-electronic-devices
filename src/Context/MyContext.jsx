import { createContext, useState } from "react";
import toast from "react-hot-toast";

const MyContext = createContext();

export const MyContextProvider = ({ children }) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const openModal = () => {setIsOpenModal(true)};
  const closeModal = () => {setIsOpenModal(false)};

  const [isOpenCart, setIsOpenCart] = useState(false)
  const openCart = () => setIsOpenCart(true)
  const closeCart = () => setIsOpenCart(false)

  const notify = (status, message) => {
    if (status === "success")
      toast.success(message)
    else if(status === "error")
      toast.error(message)
  }

  const values = {isOpenModal, openModal, closeModal, notify, isOpenCart, openCart, closeCart }
  return (
    <MyContext.Provider value={values}>
      {children}
    </MyContext.Provider>
  );
};

export default MyContext
