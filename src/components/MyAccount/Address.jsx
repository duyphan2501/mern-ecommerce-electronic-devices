import AddressList from "../AddressList";

const addresses = [
  {
    id: 0,
    type: "Nhà riêng",
    name: "Duy Phan",
    address: "Hoà Phú 1",
    village: "Định Thuỷ",
    district: "Mỏ Cày Nam",
    province: "Bến Tre",
    phone: "0197463712",
  },
  {
    id: 1,
    type: "Nhà riêng",
    name: "Duy Phan",
    address: "Hoà Phú 1",
    village: "Định Thuỷ",
    district: "Mỏ Cày Nam",
    province: "Bến Tre",
    phone: "0197463712",
  },
];
const Address = () => {
  return (
    <div className="bg-white rounded-md border border-gray-200 shadow p-5">
      <AddressList title={"Địa chỉ giao hàng"} address={addresses}/>
    </div>
  );
};

export default Address;
