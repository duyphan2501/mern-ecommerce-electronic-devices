import { useState } from "react";
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import PasswordStrength from "../PasswordStrength";
import useAuthStore from "../../store/authStore";
import toast from "react-hot-toast";
import useUserStore from "../../store/userStore";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Profile = () => {
  const [isChangePass, setIsChangePass] = useState(false);
  const { user, logout } = useAuthStore();
  const { updateUserDetails, isLoading, changePassword } = useUserStore();
  const navigator = useNavigate();

  const axiosPrivate = useAxiosPrivate();
  const [passData, setPassData] = useState({
    current: "",
    new: "",
    confirm: "",
    showCurrent: false,
    showNew: false,
    showConfirm: false,
  });

  const [userDetails, setUserDetails] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [passwordScore, setPasswordScore] = useState(0);

  const toggleShow = (field) =>
    setPassData((prev) => ({ ...prev, [field]: !prev[field] }));

  const handleChangeUserDetails = (e, field) => {
    const value = e.target.value;
    setUserDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleChange = (field, value) =>
    setPassData((prev) => ({ ...prev, [field]: value }));

  const handleMouseDown = (event) => event.preventDefault();

  const handleUpdateUser = async () => {
    if (isLoading.details) return;
    try {
      await updateUserDetails(axiosPrivate, userDetails);
      toast.success(useUserStore.getState().message);
      if (userDetails.email !== user.email) {
        await logout();
        navigator("/verify-email");
      }
    } catch (error) {
      console.error(error);
      toast.error(useUserStore.getState().message);
    }
  };

  const handleChangePassword = async () => {
    if (isLoading.changePwd) return;
    if (passwordScore < 5) {
      toast.error("Password is not strong enough");
      return;
    }
    try {
      const passDatatoSend = {
        currentPassword: passData.current,
        newPassword: passData.new,
        confirmPassword: passData.confirm,
      };
      await changePassword(axiosPrivate, passDatatoSend);
      toast.success(useUserStore.getState().message);
      await logout();
      navigator("/login");
    } catch (error) {
      console.error(error);
      toast.error(useUserStore.getState().message);
    }
  };

  return (
    <div>
      {/* Thông tin tài khoản */}
      <div className="bg-white rounded-md border border-gray-200 shadow p-5">
        <div className="flex justify-between items-center pb-3 mb-5 border-b border-gray-200">
          <h4 className="text-lg font-bold">Thông tin tài khoản</h4>
          <Button
            className="!font-semibold !font-sans"
            onClick={() => setIsChangePass(!isChangePass)}
          >
            {isChangePass ? "Hủy" : "Đổi mật khẩu"}
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <TextField
            placeholder="Họ tên"
            size="small"
            value={userDetails.name}
            onChange={(e) => handleChangeUserDetails(e, "name")}
          />
          <TextField
            placeholder="Email"
            size="small"
            value={userDetails.email}
            onChange={(e) => handleChangeUserDetails(e, "email")}
          />
          <TextField
            placeholder="Số điện thoại"
            size="small"
            value={userDetails.phone}
            onChange={(e) => handleChangeUserDetails(e, "phone")}
          />
        </div>
        <Button
          className="!bg-blue-500 !text-white !font-semibold hover:!bg-blue-600 !mt-5 !w-full"
          onClick={handleUpdateUser}
        >
          {isLoading.details ? (
            <AiOutlineLoading3Quarters className="animate-spin" size={20} />
          ) : (
            "Cập nhật thông tin"
          )}
        </Button>
      </div>

      {/* Form đổi mật khẩu */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isChangePass ? "max-h-[500px] mt-5 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white rounded-md border border-gray-200 shadow p-5">
          <div className="pb-3 mb-5 border-b border-gray-200">
            <h4 className="text-lg font-bold">Đổi mật khẩu</h4>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <FormControl size="small" variant="outlined">
              <InputLabel>Mật khẩu hiện tại</InputLabel>
              <OutlinedInput
                type={passData.showCurrent ? "text" : "password"}
                value={passData.current}
                onChange={(e) => handleChange("current", e.target.value)}
                autoComplete="current-password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => toggleShow("showCurrent")}
                      onMouseDown={handleMouseDown}
                      edge="end"
                    >
                      {passData.showCurrent ? (
                        <MdVisibilityOff />
                      ) : (
                        <MdVisibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
                label="Mật khẩu hiện tại"
              />
            </FormControl>
            <div></div>

            <FormControl size="small" variant="outlined">
              <InputLabel>Mật khẩu mới</InputLabel>
              <OutlinedInput
                type={passData.showNew ? "text" : "password"}
                value={passData.new}
                onChange={(e) => handleChange("new", e.target.value)}
                autoComplete="new-password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => toggleShow("showNew")}
                      onMouseDown={handleMouseDown}
                      edge="end"
                    >
                      {passData.showNew ? (
                        <MdVisibilityOff />
                      ) : (
                        <MdVisibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
                label="Mật khẩu mới"
              />
            </FormControl>

            <FormControl size="small" variant="outlined">
              <InputLabel>Nhập lại mật khẩu</InputLabel>
              <OutlinedInput
                type={passData.showConfirm ? "text" : "password"}
                value={passData.confirm}
                onChange={(e) => handleChange("confirm", e.target.value)}
                autoComplete="new-password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => toggleShow("showConfirm")}
                      onMouseDown={handleMouseDown}
                      edge="end"
                    >
                      {passData.showConfirm ? (
                        <MdVisibilityOff />
                      ) : (
                        <MdVisibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
                label="Nhập lại mật khẩu"
              />
            </FormControl>
          </div>

          <div className="mt-4">
            <PasswordStrength
              password={passData.new}
              setPasswordScore={setPasswordScore}
            />
          </div>

          <Button
            className="!py-2 !bg-blue-500 !text-white !font-semibold !w-full !mt-5"
            onClick={handleChangePassword}
          >
            {isLoading.changePwd ? (
              <AiOutlineLoading3Quarters className="animate-spin" size={18} />
            ) : (
              "Đổi mật khẩu"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
