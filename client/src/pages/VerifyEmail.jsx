import { useEffect, useState } from "react";
import OtpBox from "../components/OtpBox";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";
import { FiLoader } from "react-icons/fi";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const navigator = useNavigate();
  const { user, verifyEmail, isLoading, sendVerificationEmail } =
    useAuthStore();

  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const handleVerify = async () => {
    try {
      await verifyEmail(user?.email, otp);
      toast.success(useAuthStore.getState().message);
      navigator("/login");
    } catch (error) {
      toast.error(useAuthStore.getState().message);
      console.log(error);
    }
  };

  const handleSendVerificationEmail = async () => {
    try {
      setIsSendingEmail(true);
      await sendVerificationEmail(user?.email);
      setIsSendingEmail(false);
      toast.success(useAuthStore.getState().message);
    } catch (error) {
      setIsSendingEmail(false);
      toast.error(useAuthStore.getState().message);
      console.log(error);
    }
  };

  useEffect(() => {
    if (!user?.email) navigator("/login");
  }, []);

  return (
    <div className="flex justify-center items-center py-15 ">
      <div className="bg-white rounded shadow overflow-hidden">
        <div className=" p-5">
          <h1 className="text-center font-black !font-sans text-transparent bg-gradient-to-r from-sky-500 to-indigo-500 text-xl mb-3 bg-clip-text uppercase">
            Xác minh tài khoản
          </h1>
          <div className="text-sm text-center">
            Đã gửi OTP đến{" "}
            <span className="text-highlight font-semibold">{user?.email}</span>
          </div>
          <div className="my-4">
            <OtpBox length={6} onChangeOtp={setOtp} onSubmit={handleVerify} />
          </div>
          <Button
            className="!w-full !bg-blue-500 !text-white !font-sans !font-bold !h-10"
            onClick={handleVerify}
          >
            {isLoading ? (
              <FiLoader className=" animate-spin" size={20} />
            ) : (
              "Xác nhận OTP"
            )}
          </Button>
        </div>
        <div className="bg-gray-500 py-2 flex items-center justify-center">
          <button
            className="hover:underline text-sm cursor-pointer text-gray-300"
            onClick={handleSendVerificationEmail}
          >
            {isSendingEmail ? (
              <FiLoader className="text-white animate-spin" size={20} />
            ) : (
              "Gửi lại mã"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
