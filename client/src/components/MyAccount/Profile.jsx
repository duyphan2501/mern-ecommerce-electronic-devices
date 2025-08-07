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

// Bạn có thể import thêm PasswordStrength nếu có
// import PasswordStrength from "./PasswordStrength";

const Profile = () => {
  const [isChangePass, setIsChangePass] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev);

  const handleMouseDownPassword = (event) => event.preventDefault();
  const handleMouseDownConfirmPassword = (event) => event.preventDefault();

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
          <TextField label="Họ tên" size="small" />
          <TextField label="Email" size="small" />
          <TextField label="SĐT" size="small" />
        </div>
        <Button className="!bg-blue-500 !text-white !font-semibold hover:!bg-blue-600 !mt-5 !w-full">
          Cập nhật thông tin
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
          <TextField label="Mật khẩu hiện tại" size="small" className="w-full"/>
            <div className="col-span-1"></div>
            <FormControl size="small" variant="outlined">
              <InputLabel htmlFor="new-password">Mật khẩu mới</InputLabel>
              <OutlinedInput
                id="new-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Mật khẩu mới"
              />
            </FormControl>

            <FormControl size="small" variant="outlined">
              <InputLabel htmlFor="confirm-password">
                Nhập lại mật khẩu
              </InputLabel>
              <OutlinedInput
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? (
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

          {/* Optional: Strength + Submit */}
          {/* <div className="mt-4">
            <PasswordStrength password={password} />
          </div> */}

          <Button className="!py-2 !bg-blue-500 !text-white !font-semibold !w-full !mt-5">
            Đổi mật khẩu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
