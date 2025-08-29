import AddressCard from "./AddressCard";
import { Button } from "@mui/material";
import { FaPlus } from "react-icons/fa";
import { useContext, useState } from "react";
import MyContext from "../Context/MyContext";
import useAddressStore from "../store/addressStore";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const AddressList = ({ title, address, isCheckout=false }) => {
  const { setUpdateAddr, openAddrFrm } = useContext(MyContext);
  const [selectedId, setSelectedId] = useState(null);
  const { deleteAddress } = useAddressStore.getState();
  const axiosPrivate = useAxiosPrivate();

  const handleSelect = (id) => {
    setSelectedId(id);
  };

  const handleCreate = () => {
    setUpdateAddr(null);
    openAddrFrm();
  }

  const handleDelete = (addressId) => {
    deleteAddress(addressId, axiosPrivate);
    if (selectedId === addressId) {
      setSelectedId(null);
    }
  }

  const handleUpdate = (address) => {
    setUpdateAddr(address);
    openAddrFrm();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-bold">{title}</h4>
        <Button
          className="!gap-1 !bg-white !border-1 !font-semibold  !border-blue-500 !rounded-md"
          onClick={handleCreate}
        >
          <FaPlus />
          Thêm địa chỉ mới
        </Button>
      </div>
      <div className="mt-5 space-y-5">
        {address.map((addr) => (
          <AddressCard
            key={addr._id}
            address={addr}
            selected={selectedId === addr._id || (!selectedId && addr.isDefault)}
            onSelect={() => handleSelect(addr._id)}
            onUpdate={() => handleUpdate(addr)}
            onDelete={() => handleDelete(addr._id)}
            isCheckout={isCheckout}
          />
        ))}
      </div>
    </div>
  );
};

export default AddressList;
