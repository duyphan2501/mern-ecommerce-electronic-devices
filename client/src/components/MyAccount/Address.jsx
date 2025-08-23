import { useEffect } from "react";
import useAddressStore from "../../store/addressStore";
import AddressList from "../AddressList";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const Address = () => {
  const addresses = useAddressStore((state) => state.addresses);
  const getAllAddresses = useAddressStore((state) => state.getAllAddresses);
  const axiosPrivate = useAxiosPrivate();
  
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        await getAllAddresses(axiosPrivate);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    }
    fetchAddresses();
  }, []);

  return (
    <div className="bg-white rounded-md border border-gray-200 shadow p-5">
      <AddressList title={"Địa chỉ giao hàng"} address={addresses}/>
    </div>
  );
};

export default Address;
