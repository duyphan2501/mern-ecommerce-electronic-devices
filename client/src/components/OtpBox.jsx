import { useEffect, useRef, useState } from "react";

const OtpBox = ({ length, onChangeOtp, onSubmit }) => {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputsOtp = useRef([]);

  useEffect(() => {
    inputsOtp.current = inputsOtp.current.slice(0, length);
  }, [length]);
  useEffect(() => {
    if (otp.every((digit) => digit !== "")) {
      onSubmit(); // Gọi khi đã điền đủ OTP
    }
  }, [otp]);

  const handleChange = (e, index) => {
    // handle input
    const value = e.target.value;
    if (isNaN(value)) {
      inputsOtp.current[index].value = "";
      return;
    }
    // asign value to new otp[]
    const newOtp = [...otp];

    // handle copy
    let currentInputIndex = index;
    for (
      let i = 0;
      i < value.length && currentInputIndex < length;
      i++, currentInputIndex++
    ) {
      inputsOtp.current[currentInputIndex].value = value[i];
      newOtp[currentInputIndex] = value[i];
    }

    // focus next input
    let nextIndex =
      currentInputIndex < length ? currentInputIndex : currentInputIndex - 1;
    inputsOtp.current[nextIndex]?.focus();

    // update otp
    setOtp(newOtp);
    onChangeOtp(otp.join(""));
  };

  const handleKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      index !== 0 &&
      inputsOtp.current[index].value === ""
    ) {
      inputsOtp.current[index - 1].focus();
    }
  };

  return (
    <div className="flex justify-center items-center gap-1">
      {otp.map((data, index) => {
        return (
          <input
            type="text"
            maxLength={length}
            className="rounded size-[45px] text-center border-2 text-black font-black"
            key={index}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => (inputsOtp.current[index] = el)}
          />
        );
      })}
    </div>
  );
};

export default OtpBox;
