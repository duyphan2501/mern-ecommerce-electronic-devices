import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";
import { FiLoader } from "react-icons/fi";
import MyContext from "../Context/MyContext";
import GoogleButton from "../components/GoogleButton";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, forgotPassword } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const { persist, setPersist } = useContext(MyContext);
  const navigator = useNavigate();
  const location = useLocation();

  // Lấy trang trước đó từ state, mặc định về "/"
  const from = location.state?.from?.pathname || "/";

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
      await login(email, password);
      toast.success(useAuthStore.getState().message);
      navigator(from, { replace: true }); 
    } catch (error) {
      const { isVerified } = useAuthStore.getState();
      if (isVerified === false) {
        navigator("/verify-email");
      } else {
        toast.error(useAuthStore.getState().message);
      }
    }
  };

  const handleForgotPassword = async () => {
    if (isLoading) return;
    try {
      await forgotPassword(email);
      toast.success(useAuthStore.getState().message);
    } catch (error) {
      toast.error(useAuthStore.getState().message);
      console.error(error);
    }
  };

  const handleTogglePersist = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

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
            <div className="flex justify-between items-center my-3 w-full">
              <FormControlLabel
                control={<Checkbox checked={persist} />}
                label="Remember me"
                onChange={handleTogglePersist}
              />
              <p
                className=" font-semibold font-sans link text-sm hover:underline"
                onClick={handleForgotPassword}
              >
                Quên mật khẩu?
              </p>
            </div>

            <Button
              className={`!h-10 !bg-blue-500 !text-white !font-bold`}
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
            <div className="flex justify-center items-center">
              <GoogleButton />
            </div>
          </FormControl>
        </form>
      </div>
    </div>
  );
};

export default Login;
