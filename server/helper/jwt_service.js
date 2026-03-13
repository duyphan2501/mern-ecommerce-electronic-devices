import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "../config/constants.js";
import { cookieOptions } from "./auth.helper.js";
dotenv.config({ quiet: true });

const generateAccessTokenAndSetCookie = async (res, payload) => {
  const token = await new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: ACCESS_TOKEN_COOKIE.expiresIn },
      (err, token) => {
        if (err) reject(err);
        else resolve(token);
      },
    );
  });

  res.cookie("accessToken", token, {
    ...cookieOptions,
    maxAge: ACCESS_TOKEN_COOKIE.maxAge,
  });

  return token;
};

const generateRefreshTokenAndSetCookie = async (res, payload) => {
  const token = await new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET_KEY,
      { expiresIn: REFRESH_TOKEN_COOKIE.expiresIn },
      (err, token) => {
        if (err) reject(err);
        else resolve(token);
      },
    );
  });

  res.cookie("refreshToken", token, {
    ...cookieOptions,
    maxAge: REFRESH_TOKEN_COOKIE.maxAge,
  });

  return token;
};

const verifyRefreshToken = async (refreshToken) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY,
      (err, payload) => {
        if (err) return reject(err);
        return resolve(payload);
      },
    );
  });
};

const verifyAccessToken = async (accessToken) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET_KEY,
      (err, payload) => {
        if (err) return reject(err);
        return resolve(payload);
      },
    );
  });
};

export {
  generateAccessTokenAndSetCookie,
  generateRefreshTokenAndSetCookie,
  verifyRefreshToken,
  verifyAccessToken,
};
