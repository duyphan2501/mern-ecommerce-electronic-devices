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
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";
import { FiLoader } from "react-icons/fi";
import PasswordStrength from "../components/PasswordStrength";
import GoogleButton from "../components/GoogleButton";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [passwordScore, setPasswordScore] = useState(0);

  const { register, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const navigator = useNavigate();
  const location = useLocation();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    try {
      if (passwordScore < 5) {
        toast.error("Password is not strong enough");
        return;
      }
      await register(email, password, userName);
      toast.success(useAuthStore.getState().message);
      navigator("/verify-email", { state: { from: location.state?.from } });
    } catch (error) {
      toast.error(useAuthStore.getState().message);
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center py-10 sm:py-15 px-4 overflow-x-hidden">
      <div className="bg-white rounded shadow p-4 sm:p-5 w-full max-w-[440px]">
        <h1 className="text-center font-black !font-sans text-transparent bg-gradient-to-r from-sky-500 to-indigo-500 text-xl mb-3 bg-clip-text uppercase">
          Đăng ký tài khoản
        </h1>
        <form className="flex flex-col loginForm" onSubmit={handleSubmit}>
          <FormControl sx={{ my: 1, mx: 0, width: "100%" }}>
            <TextField
              id="outlined-basic"
              label="Họ và Tên"
              variant="outlined"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </FormControl>
          <FormControl sx={{ my: 1, mx: 0, width: "100%" }}>
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
          <FormControl sx={{ my: 1, mx: 0, width: "100%" }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Mật Khẩu
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            <div className="mt-3">
              <PasswordStrength
                password={password}
                setPasswordScore={setPasswordScore}
              />
            </div>
          </FormControl>

          <FormControl sx={{ my: 1, mx: 0, width: "100%" }} variant="outlined">
            <Button
              className={`!h-10 !bg-blue-500 !text-white !font-bold mb-5`}
              type="submit"
            >
              {isLoading ? <FiLoader className="animate-spin" /> : "Đăng Ký"}
            </Button>
            <div className="flex items-center gap-1 justify-center my-3">
              <p className=" text-gray-400">Đã có tài khoản?</p>
              <Link
                to={"/login"}
                state={{ from: location.state?.from }}
                className="link hover:underline"
              >
                Đăng nhập
              </Link>
            </div>
            <div className="flex justify-center items-center">
              <GoogleButton />
            </div>
          </FormControl>
        </form>
      </div>
    </div>
  );
};

export default Register;
