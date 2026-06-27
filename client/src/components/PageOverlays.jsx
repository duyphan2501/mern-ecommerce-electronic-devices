import { useContext } from "react";
import MyContext from "../Context/MyContext";
import CartDrawer from "./CartDrawer";
import ViewMoreDialog from "./ViewMoreDialog";
import AddressForm from "./AddressForm";
import AiChatWidget from "./AiChatWidget";

const PageOverlays = () => {
  const { isOpenModal, isOpenAddrFrm } = useContext(MyContext);
  return (
    <>
      <CartDrawer />
      {isOpenModal && <ViewMoreDialog />}
      {isOpenAddrFrm && <AddressForm />}
      <AiChatWidget />
    </>
  );
};

export default PageOverlays;
