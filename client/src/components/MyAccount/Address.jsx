import useAddressStore from "../../store/addressStore";
import AddressList from "../AddressList";

const Address = () => {
  const addresses = useAddressStore((state) => state.addresses);

  return (
    <div className="bg-white rounded-md border border-gray-200 shadow p-5">
      <AddressList title={"Địa chỉ giao hàng"} address={addresses}/>
    </div>
  );
};

export default Address;
