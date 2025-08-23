import { Button, FormControlLabel, Radio } from "@mui/material";
import { FaPen, FaTrash } from "react-icons/fa6";

const AddressCard = ({
  address,
  selected,
  onSelect,
  onUpdate,
  onDelete,
  isCheckout = false,
}) => {
  return (
    <div className="border border-gray-200 rounded-md p-5 flex bg-sky-50">
      {isCheckout && <FormControlLabel
        control={
          <Radio
            checked={selected}
            onChange={onSelect}
            value={address._id}
            name="address"
          />
        }
        className="self-start"
      />}

      <div className="flex flex-col flex-1">
        <div className="flex gap-2">
          {address.isDefault && (
            <span className="bg-gray-100 text-sm p-1 rounded-md w-fit">
              Mặc định
            </span>
          )}
        <span className="bg-gray-100 text-sm p-1 rounded-md w-fit">
          {address.addressType === "home" ? "Nhà riêng" : "Công ty"}
        </span>
        </div>
        <p className=" font-bold text-lg">{address.receiver}</p>
        <div className="italic mb-3">
          {`${address.addressDetail}, ${address.ward}, ${address.province}`}
        </div>
        <div className="">SĐT: {address.phone}</div>
      </div>
      <div className="flex flex-col justify-between">
        <Button className="" onClick={onUpdate}>
          <FaPen />
        </Button>
        <Button className="hover:!text-red-500" onClick={onDelete}> 
          <FaTrash />
        </Button>
      </div>
    </div>
  );
};

export default AddressCard;
