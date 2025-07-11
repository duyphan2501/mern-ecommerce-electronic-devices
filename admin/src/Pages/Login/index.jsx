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
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
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
    <div className="">
      <div className="fixed inset-0 w-screen h-screen opacity-5 z-0">
        <img
          src="https://ecommerce-admin-view.netlify.app/patern.webp"
          alt=""
          className="size-full pointer-events-none select-none"
        />
      </div>
      <div className="flex  justify-center items-center h-screen">
        <div className="flex flex-col justify-center items-center gap-4 z-10 p-5 h-full shadow">
          <div className="h-[40px]">
            <img src="logo.jpg" alt="" className="h-full object-cover" />
          </div>
          <div className="font-bold text-4xl text-center text-black">
            <p className="">Welcome Back!</p>
            <p>Sign in with your credentials.</p>
          </div>

          <FormControl sx={{ width: "40ch" }}>
            <TextField label="Email"></TextField>
          </FormControl>
          <div className="">
            <FormControl sx={{ width: "40ch" }} variant="outlined">
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
            </FormControl>

            <div className="flex justify-between items-center mt-3">
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="Remember me"
              />
              <Link to={"/forgot-password"}>
                <p className="link hover:underline">Forgot Password?</p>
              </Link>
            </div>
          <Button
            className="!py-2 !bg-blue-500 !text-white !text-lg !font-bold !w-full !mt-3"
            sx={{ fontFamily: "Outfit" }}
          >
            Sign In
          </Button>
          </div>

          <div className="flex items-center gap-1 justify-center mt-3">
            <p className=" text-gray-400">Don't have an account??</p>
            <span className="link hover:underline">Sign Up</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-[0.5px] bg-gray-400 w-20"></div>
            <p>Or, Continue with Google</p>
            <div className="h-[0.5px] bg-gray-400 w-20"></div>
          </div>
          <Button className="!normal-case !text-gray-600 gap-1 !py-1 !border !px-5 !text-[17px]">
            Signin with Google <FcGoogle />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
