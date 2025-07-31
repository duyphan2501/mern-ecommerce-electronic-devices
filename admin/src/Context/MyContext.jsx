import { createContext, useState } from "react";
import toast from "react-hot-toast";

const MyContext = createContext();

export const MyContextProvider = ({ children }) => {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const handleClickSidebar = () => {
    setIsOpenSidebar(!isOpenSidebar);
  };

  const [isLogin, setIsLogin] = useState(false);
  const [indexImageView, setIndexImageView] = useState(-1);
  const [hasModels, setHasModels] = useState(true);
  const [isOpenQuesBox, setIsOpenQuesBox] = useState(false);
  const notify = (status, message) => {
    if (status === "success") toast.success(message);
    else if (status === "error") toast.error(message);
  };
  const values = {
    isOpenSidebar,
    handleClickSidebar,
    isLogin,
    setIsLogin,
    indexImageView,
    setIndexImageView,
    hasModels,
    setHasModels,
    isOpenQuesBox,
    setIsOpenQuesBox,
    notify,
  };
  return <MyContext.Provider value={values}>{children}</MyContext.Provider>;
};

export default MyContext;
