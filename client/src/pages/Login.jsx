import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";
import { FiLoader } from "react-icons/fi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const navigator = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success(useAuthStore.getState().message);
      navigator("/");
    } catch (error) {
      // Nếu tài khoản chưa xác thực thì chuyển sang trang xác thực
      const { isVerified } = useAuthStore.getState();
      if (isVerified === false) {
        navigator("/verify-email");
      } else {
        toast.error(useAuthStore.getState().message);
      }
      console.log(error);
    }
  };

  useEffect(() => {}, []);

  return (
    <div className="flex justify-center items-center py-15 ">
      <div className="bg-white rounded shadow p-5">
        <h1 className="text-center font-black !font-sans text-transparent bg-gradient-to-r from-sky-500 to-indigo-500 text-xl mb-3 bg-clip-text uppercase">
          Đăng nhập tài khoản
        </h1>
        <form className="flex flex-col loginForm" onSubmit={handleSubmit}>
          <FormControl sx={{ m: 1, width: "40ch" }}>
            <TextField
              id="outlined-basic"
              label="Email"
              variant="outlined"
              value={email}
              type="email"
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl sx={{ m: 1, width: "40ch" }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Mật Khẩu
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
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
              label="Mật Khẩu"
            />
            <Link>
              <p className="my-3 font-semibold font-sans link hover:underline">
                Quên mật khẩu?
              </p>
            </Link>
            <Button
              className={`!py-2 !bg-blue-500 !text-white !font-bold`}
              type="submit"
            >
              {isLoading ? (
                <FiLoader size={20} className="animate-spin" />
              ) : (
                "Đăng Nhập"
              )}
            </Button>
            <div className="flex items-center gap-1 justify-center my-3">
              <p className=" text-gray-400">Chưa có tài khoản?</p>
              <Link to={"/register"} className="link hover:underline">
                Đăng ký
              </Link>
            </div>
            <Button className="!py-2 !bg-gray-100 gap-2 !items-center !font-sans !font-semibold !text-black">
              <FcGoogle size={20} /> Đăng nhập với Google
            </Button>
          </FormControl>
        </form>
      </div>
    </div>
  );
};

export default Login;
