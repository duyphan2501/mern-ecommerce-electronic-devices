import { useContext, useEffect, useState } from "react";
import MyContext from "../Context/MyContext";
import { IoClose } from "react-icons/io5";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";

const AddressForm = () => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");

  const [receiverName, setReceiverName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [addressType, setAddressType] = useState("home");
  const [isDefault, setIsDefault] = useState(false);

  const { isOpenAddrFrm, closeAddrFrm } = useContext(MyContext);

  useEffect(() => {
    axios
      .get("https://provinces.open-api.vn/api/?depth=1")
      .then((res) => {
        setProvinces(res.data);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy tỉnh/thành: ", err);
      });
  }, []);

  const handleProvinceChange = async (e) => {
    const selectedName = e.target.value;
    setProvince(selectedName);
    setDistrict("");
    setWard("");

    const selected = provinces.find((item) => item.name === selectedName);
    if (selected) {
      const res = await axios.get(
        `https://provinces.open-api.vn/api/p/${selected.code}?depth=2`
      );
      setDistricts(res.data.districts);
    }
  };

  const handleDistrictChange = async (e) => {
    const selectedName = e.target.value;
    setDistrict(selectedName);
    setWard("");
    const selected = districts.find((item) => item.name === selectedName);

    if (selected) {
      const res = await axios.get(
        `https://provinces.open-api.vn/api/d/${selected.code}?depth=2`
      );
      setWards(res.data.wards);
    }
  };

  const handleWardChange = (e) => {
    setWard(e.target.value);
  };

  useEffect(() => {
    document.body.style.overflow = isOpenAddrFrm ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpenAddrFrm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullAddress = {
      receiverName,
      phone,
      province,
      district,
      ward,
      street,
      addressType,
      isDefault,
    };
    console.log("Dữ liệu địa chỉ:", fullAddress);
    // TODO: Gửi dữ liệu lên server tại đây

    closeAddrFrm(); // đóng form sau khi lưu
  };

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center z-50 ${
        isOpenAddrFrm ? "block" : "hidden"
      }`}
    >
      <div className="absolute inset-0 bg-gray-700 opacity-30"></div>
      <div className="bg-white rounded-md p-5 z-50 border-b shadow-md">
        <div className="flex justify-between items-center border-b-2 pb-2 border-gray-300">
          <h4 className="font-semibold text-lg">Địa Chỉ Giao Hàng</h4>
          <div
            className="size-8 rounded-full p-1 cursor-pointer hover:bg-gray-200 flex justify-center items-center"
            onClick={closeAddrFrm}
          >
            <IoClose size={25} />
          </div>
        </div>
        <form className="space-y-3 w-full mt-4" onSubmit={handleSubmit}>
          {/* Người nhận */}
          <div className="grid grid-cols-3 gap-2">
            <p>Tên người nhận:</p>
            <TextField
              variant="outlined"
              className="col-span-2"
              size="small"
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
            />
          </div>

          {/* SĐT */}
          <div className="grid grid-cols-3 gap-2">
            <p>Số điện thoại:</p>
            <TextField
              variant="outlined"
              className="col-span-2"
              size="small"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Tỉnh */}
          <div className="grid grid-cols-3 gap-2">
            <p>Tỉnh:</p>
            <FormControl size="small" fullWidth className="col-span-2">
              <Select value={province} onChange={handleProvinceChange}>
                {provinces.map((item) => (
                  <MenuItem key={item.code} value={item.name}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* Huyện */}
          <div className="grid grid-cols-3 gap-2">
            <p>Huyện:</p>
            <FormControl size="small" fullWidth className="col-span-2">
              <Select value={district} onChange={handleDistrictChange}>
                {districts.map((item) => (
                  <MenuItem key={item.code} value={item.name}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* Xã */}
          <div className="grid grid-cols-3 gap-2">
            <p>Xã:</p>
            <FormControl size="small" fullWidth className="col-span-2">
              <Select value={ward} onChange={handleWardChange}>
                {wards.map((item) => (
                  <MenuItem key={item.code} value={item.name}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* Địa chỉ cụ thể */}
          <div className="grid grid-cols-3 gap-2">
            <p>Số nhà / Tên đường:</p>
            <TextField
              variant="outlined"
              className="col-span-2"
              size="small"
              multiline
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
          </div>

          {/* Loại địa chỉ */}
          <div className="grid grid-cols-3 gap-2 items-center">
            <p>Loại địa chỉ:</p>
            <RadioGroup
              row
              value={addressType}
              onChange={(e) => setAddressType(e.target.value)}
              className="col-span-2"
            >
              <FormControlLabel
                value="home"
                control={<Radio />}
                label="Nhà riêng"
              />
              <FormControlLabel
                value="work"
                control={<Radio />}
                label="Nơi làm việc"
              />
            </RadioGroup>
          </div>

          {/* Mặc định & Submit */}
          <div className="flex justify-between items-center mt-2">
            <FormControlLabel
              control={
                <Checkbox
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                />
              }
              label="Đặt làm mặc định"
            />
            <Button
              type="submit"
              className="!bg-blue-500 !text-white !font-semibold hover:!bg-blue-700"
            >
              Lưu
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressForm;
