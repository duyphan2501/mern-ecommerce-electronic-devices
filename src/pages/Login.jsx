import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className="flex justify-center items-center py-15 ">
      <div className="bg-white rounded shadow p-5">
        <h1 className="text-center font-black !font-sans text-transparent bg-gradient-to-r from-sky-500 to-indigo-500 text-xl mb-3 bg-clip-text uppercase">
          Đăng nhập tài khoản
        </h1>
        <div className="flex flex-col loginForm">
          <FormControl sx={{ m: 1, width: "40ch" }}>
            <TextField
              id="outlined-basic"
              label="Username"
              variant="outlined"
            />
          </FormControl>
          <FormControl sx={{ m: 1, width: "40ch" }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword
                        ? "hide the password"
                        : "display the password"
                    }
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                  >
                    {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
            <Link to={"/forgot-password"}>
              <p className="my-3 font-semibold font-sans link hover:underline">
                Quên mật khẩu?
              </p>
            </Link>
            <Button className="!py-2 !bg-blue-500 !text-white !font-bold !font-sans">
              Đăng Nhập
            </Button>
            <div className="flex items-center gap-1 justify-center my-3">
              <p className=" text-gray-400">Chưa có tài khoản?</p>
              <span className="link hover:underline">Đăng ký</span>
            </div>
            <Button className="!py-2 !bg-gray-100 gap-2 !items-center !font-sans !font-semibold !text-black">
              <FcGoogle size={20} /> Đăng nhập với Google
            </Button>
          </FormControl>
        </div>
      </div>
    </div>
  );
};

export default Login;
