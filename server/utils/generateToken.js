import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const generateAccessTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: "15m",
  });
  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });
  return token
};  

const generateRefreshTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET_KEY, {
    expiresIn: "7d",
  });
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7* 24 * 60 * 60 * 1000,
  });
  return token
};

export { generateAccessTokenAndSetCookie, generateRefreshTokenAndSetCookie };
