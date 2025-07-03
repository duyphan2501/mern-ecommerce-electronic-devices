import AddressForm from "./AddressForm";
import AddressCard from "./AddressCard";
import { Button } from "@mui/material";
import { FaPlus } from "react-icons/fa";
import { useContext, useState } from "react";
import MyContext from "../Context/MyContext";

const AddressList = ({ title, address }) => {
  const { isOpenAddrFrm, openAddrFrm } = useContext(MyContext);
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = (id) => {
    setSelectedId(id);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-bold">{title}</h4>
        <Button
          className="!gap-1 !bg-white !border-1 !font-semibold  !border-blue-500 !rounded-md"
          onClick={openAddrFrm}
        >
          <FaPlus />
          Thêm địa chỉ mới
        </Button>
      </div>
      <div className="mt-5 space-y-5">
        {address.map((addr) => (
          <AddressCard
            key={addr.id}
            address={addr}
            selected={selectedId === addr.id}
            onSelect={() => handleSelect(addr.id)}
          />
        ))}
        {isOpenAddrFrm && <AddressForm />}
      </div>
    </div>
  );
};

export default AddressList;
