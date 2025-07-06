import { useEffect, useState } from "react";
import OtpBox from "../components/OtpBox";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [otp, setOtp] = useState("");
  const navigator = useNavigate()

  const handleSubmit = () => {
    navigator("/change-password")
  };

  return (
    <div className="flex justify-center items-center py-15 ">
      <div className="bg-white rounded shadow p-5">
        <h1 className="text-center font-black !font-sans text-transparent bg-gradient-to-r from-sky-500 to-indigo-500 text-xl mb-3 bg-clip-text uppercase">
          Xác minh tài khoản
        </h1>
        <div className="text-sm text-center">
          Đã gửi OTP đến{" "}
          <span className="text-highlight font-semibold">
            duyneon09@gmail.com
          </span>
        </div>
        <div className="my-3">
          <OtpBox length={6} onChangeOtp={setOtp} onSubmit={handleSubmit} />
        </div>
        <Button className="!w-full !bg-blue-500 !text-white !font-sans !font-bold">Xác nhận OTP</Button>
      </div>
    </div>
  );
};

export default ForgotPassword;
