import { createContext, useState } from "react";
import toast from "react-hot-toast";
import { FiLoader } from "react-icons/fi";

const MyContext = createContext();

export const MyContextProvider = ({ children }) => {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const handleClickSidebar = () => {
    setIsOpenSidebar(!isOpenSidebar);
  };

  const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist")) || false)
  const [indexImageView, setIndexImageView] = useState(-1);
  const [hasModels, setHasModels] = useState(true);
  const [isOpenQuesBox, setIsOpenQuesBox] = useState(false);
  const notify = (status, message) => {
    if (status === "success") toast.success(message);
    else if (status === "error") toast.error(message);
  };
  const fiLoader = <FiLoader size={20} className="animate-spin"/>
  const values = {
    isOpenSidebar,
    handleClickSidebar,
    indexImageView,
    setIndexImageView,
    hasModels,
    setHasModels,
    isOpenQuesBox,
    setIsOpenQuesBox,
    notify,
    persist, 
    setPersist,
    fiLoader,
  };
  return <MyContext.Provider value={values}>{children}</MyContext.Provider>;
};

export default MyContext;
