import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { useContext, useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import MyContext from "../Context/MyContext";
import { useNavigate } from "react-router-dom";
import PasswordStrength from "../components/PasswordStrength";

const ChangePassword = () => {
  const navigator = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);
  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };
  const handleMouseUpConfirmPassword = (event) => {
    event.preventDefault();
  };

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { notify } = useContext(MyContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      notify("error", "Mật khẩu không khớp!");
    } else {
      notify("success", "Đổi mật khẩu thành công!");
      navigator("/login");
    }
  };
  return (
    <div className="flex justify-center items-center py-15 ">
      <div className="bg-white rounded shadow p-5">
        <h1 className="text-center font-black !font-sans text-transparent bg-gradient-to-r from-sky-500 to-indigo-500 text-xl mb-3 bg-clip-text uppercase">
         Đặt lại mật khẩu
        </h1>
        <form
          className="flex flex-col loginForm"
          onSubmit={(e) => handleSubmit(e)}
        >
            <input
            type="text"
            name="username"
            autoComplete="username"
            className="hidden"
        />
          <FormControl sx={{ m: 1, width: "40ch" }}>
            <InputLabel htmlFor="newPassword">Password</InputLabel>
            <OutlinedInput
              id="newPassword"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              name="password"
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
          <FormControl sx={{ m: 1, width: "40ch" }} variant="outlined">
            <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
            <OutlinedInput
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={confirmPassword}
              autoComplete="confirm-password"

              onChange={(e) => setConfirmPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword
                        ? "hide the confirmpassword"
                        : "display the confirmpassword"
                    }
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={handleMouseDownConfirmPassword}
                    onMouseUp={handleMouseUpConfirmPassword}
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
              label="Confirm Password"
            />
            <div className="mt-4">
              <PasswordStrength password={password}/>
              <Button
                className="!py-2 !bg-blue-500 !text-white !font-bold !font-sans !w-full !mt-4"
                type="submit"
              >
                Đổi mật khẩu
              </Button>
            </div>
          </FormControl>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
