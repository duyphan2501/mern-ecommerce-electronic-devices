import { createContext, useState } from "react";

const MyContext = createContext();

export const MyContextProvider = ({ children }) => {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const handleClickSidebar = () => {
    setIsOpenSidebar(!isOpenSidebar);
  };

  const [isLogin, setIsLogin] = useState(true)
  const [indexImageView, setIndexImageView] = useState(-1);
  const [hasModels, setHasModels] = useState(true);
  const [isOpenQuesBox, setIsOpenQuesBox] = useState(false);

  const values = { isOpenSidebar, handleClickSidebar, isLogin, setIsLogin, indexImageView, setIndexImageView, hasModels, setHasModels, isOpenQuesBox, setIsOpenQuesBox };
  return <MyContext.Provider value={values}>{children}</MyContext.Provider>;
};

export default MyContext;
