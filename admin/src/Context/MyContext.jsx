import { createContext, useState } from "react";

const MyContext = createContext()

export const MyContextProvider = ({children}) => {
    const [isOpenSidebar, setIsOpenSidebar] = useState(false)
   const handleClickSidebar = () => {
    setIsOpenSidebar(!isOpenSidebar)
   }

    const values = {isOpenSidebar, handleClickSidebar}
  return (
    <MyContext.Provider value={values}>{children}</MyContext.Provider>
  )
}

export default MyContext