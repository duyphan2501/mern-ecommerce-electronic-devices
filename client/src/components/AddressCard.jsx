import { Button, FormControlLabel, Radio } from "@mui/material";
import { FaPen } from "react-icons/fa6";

const AddressCard = ({ address, selected, onSelect }) => {
  return (
    <div className="border border-gray-200 rounded-md p-5 flex bg-sky-50">
      <FormControlLabel
        control={
          <Radio
            checked={selected}
            onChange={onSelect}
            value={address.id}
            name="address"
          />
        }
        className="self-start"
      />
      <div className="flex flex-col flex-1">
        <span className="bg-gray-100 text-sm p-1 rounded-md w-fit">
          {address.type}
        </span>
        <p className=" font-bold text-lg">{address.name}</p>
        <div className="italic mb-3">
          {`${address.address}, ${address.village}, ${address.district}, ${address.province}`}
        </div>
        <div className="">SĐT: {address.phone}</div>
      </div>
      <Button className="!self-start">
        <FaPen />
      </Button>
    </div>
  );
};

export default AddressCard;
