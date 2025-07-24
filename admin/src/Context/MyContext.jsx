import { createContext, useState } from "react";

const MyContext = createContext();

export const MyContextProvider = ({ children }) => {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const handleClickSidebar = () => {
    setIsOpenSidebar(!isOpenSidebar);
  };

  const [isLogin, setIsLogin] = useState(true)

  const [indexImageView, setIndexImageView] = useState(-1);
 

  const values = { isOpenSidebar, handleClickSidebar, isLogin, setIsLogin, indexImageView, setIndexImageView  };
  return <MyContext.Provider value={values}>{children}</MyContext.Provider>;
};

export default MyContext;
