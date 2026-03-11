import {
  sendForgotPasswordEmail,
  sendVerificationEmail,
} from "../mail/emails.js";
import UserModel from "../model/user.model.js";
import bcryptjs from "bcryptjs";
import {
  generateAccessTokenAndSetCookie,
  generateRefreshTokenAndSetCookie,
  verifyRefreshToken,
} from "../helper/jwt_service.js";
import crypto from "crypto";
import cloudinary from "../config/cloudinary.config.js";
import fs from "fs";
import extractPublicId from "../helper/extractPuclicId.js";
import { sanitizeUser } from "../helper/filterFieldOject.js";
import { mergeCart } from "../service/cart.service.js";
import { handlePostLogin, verifyToken } from "../helper/auth.helper.js";

const sendVerificationEmailAgain = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        message: "Email is missing",
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user)
      res.status(404).json({
        message: "User does not exist",
        success: false,
      });

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    await sendVerificationEmail(email, verificationToken);

    user.verificationToken = verificationToken;
    user.verificationTokenExpireAt = Date.now() + 1000 * 60 * 60 * 24;
    await user.save();

    res.status(200).json({
      message: "Sent OTP successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
    });
  }
};

const register = async (req, res) => {
  try {
    // get text field
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({
        message: "Please fill in all information",
        success: false,
      });
    }
    // check if user exists
    const existedUser = await UserModel.findOne({ email });
    if (existedUser) {
      return res.status(400).json({
        message: "Email has been already used",
        success: false,
      });
    }
    // hash password
    const salt = await bcryptjs.genSalt();
    const hashPassword = await bcryptjs.hash(password, salt);

    // generate verified account token
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    //send verified email
    await sendVerificationEmail(email, verificationToken);

    // create new object to db
    const verificationTokenExpireAt = Date.now() + 1000 * 60 * 60 * 24;
    const newUser = await UserModel.create({
      name,
      email,
      password: hashPassword,
      verificationToken,
      verificationTokenExpireAt,
    });

    return res.status(201).json({
      success: true,
      user: sanitizeUser(newUser),
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
    });
  }
};

const login = async (req, res) => {
  try {
    // get text field
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({
        message: "Please fill in all information",
        success: false,
      });
    // check user exist
    const user = await UserModel.findOne({
      email,
      status: "active",
    });
    if (!user)
      return res.status(404).json({
        message: "User does not exist",
        success: false,
      });
    if (user.changePwdNeeded)
      return res.status(400).json({
        message: "Please login by Google and change password first!",
        success: false,
      });

    // compare password
    const isCorrectPassword = await bcryptjs.compare(password, user.password);
    if (!isCorrectPassword)
      return res.status(401).json({
        message: "Password is not correct",
        success: false,
      });

    if (!user.isVerified)
      return res.status(401).json({
        user: sanitizeUser(user),
        message: "User is not verified",
        success: false,
      });

    const accessToken = await handlePostLogin(req, res, user);

    return res.status(200).json({
      user: sanitizeUser(user),
      message: "Login successfully",
      accessToken,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!code || !email)
      return res.status(400).json({
        message: "Please provide verification token and email",
        success: false,
      });

    // find user
    const user = await UserModel.findOne({
      email: email,
      isVerified: false,
      status: "active",
    });

    if (!user)
      return res.status(404).json({
        message: "User does not exist",
        success: false,
      });

    // check expiration
    const isExpired =
      !user.verificationTokenExpireAt ||
      Date.now() > user.verificationTokenExpireAt;
    if (isExpired)
      return res.status(401).json({
        message: "OTP code is expired",
        success: false,
      });

    // check token is correct?
    const isCorretToken = user.verificationToken === code;
    if (!isCorretToken)
      return res.status(401).json({
        message: "OTP code is not correct",
        success: false,
      });

    // set user is verified and cancle token
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpireAt = undefined;
    await user.save();

    return res.status(200).json({
      user: sanitizeUser(user),
      message: "Verify account succesfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
    });
  }
};

const logout = async (req, res) => {
  try {
    const userId = req.user.userId;
    // clear cookie
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };
    res.clearCookie("accessToken", options);
    res.clearCookie("refreshToken", options);

    // update db
    await UserModel.findByIdAndUpdate(userId, {
      refreshToken: undefined,
      refreshTokenExpireAt: undefined,
    });

    return res.status(200).json({
      message: "Logout successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({
        message: "Please provide email",
        success: false,
      });

    // get user
    const user = await UserModel.findOne({ email, status: "active" });
    if (!user)
      return res.status(404).json({
        message: "User does not exist",
        success: false,
      });

    // generate reset password token to to identify user need to be reset password
    const resetPasswordToken = crypto.randomBytes(20).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetPasswordToken)
      .digest("hex");
    const tokenExpire = Date.now() + 1000 * 60 * 15;
    // save in db
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpireAt = tokenExpire;
    await user.save();

    // send email reset password
    const resetPasswordUrl =
      process.env.FRONTEND_URL + "/reset-password/" + resetPasswordToken;
    await sendForgotPasswordEmail(email, resetPasswordUrl);

    return res.status(200).json({
      message: "Reset password email is sent to " + email,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = req.params.token;
    if (!resetPasswordToken)
      return res.status(400).json({
        message: "Reset token is missing",
        success: false,
      });
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetPasswordToken)
      .digest("hex");

    const { password, confirmPassword } = req.body;
    if (!password || !confirmPassword)
      return res.status(400).json({
        message: "Please fill in password and confirm password",
        success: false,
      });

    if (password !== confirmPassword)
      return res.status(400).json({
        message: "Password and confirm password do not match",
        success: false,
      });

    // get user
    const user = await UserModel.findOne({
      status: "active",
      resetPasswordToken: hashedToken,
      resetPasswordExpireAt: { $gt: Date.now() },
    });

    if (!user)
      return res.status(404).json({
        message: "Invalid or expired reset token",
        success: false,
      });

    // hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // save in db
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpireAt = undefined;
    user.refreshToken = undefined;
    user.refreshTokenExpireAt = undefined;
    await user.save();

    return res.status(200).json({
      user: sanitizeUser(user),
      message: "Reset password successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
    });
  }
};

const avatarFolder = "avatars";

const uploadAvatarImage = async (req, res) => {
  try {
    const image = req.file;
    const userId = req.user.userId;

    if (!image) {
      return res.status(400).json({
        message: "No image file uploaded",
        success: false,
      });
    }
    // remove old image avatar in cloudinary
    const user = await UserModel.findById(userId);

    if (!user)
      return res.status(404).json({
        message: "User not found",
        success: false,
      });

    if (user.avatar) {
      const publicId = extractPublicId(user.avatar, avatarFolder);
      await cloudinary.uploader.destroy(publicId);
    }

    // upload new image to cloudinary
    const options = {
      folder: avatarFolder,
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    const result = await cloudinary.uploader.upload(image.path, options, () => {
      // remove image in uploads folder
      fs.unlink(`uploads/${image.filename}`, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    });
    // update in db if upload successfully
    if (result) {
      await UserModel.findByIdAndUpdate(userId, {
        avatar: result.secure_url,
      });
      return res.status(200).json({
        message: "Upload successful",
        success: true,
        url: result.secure_url,
        public_id: result.public_id,
      });
    } else {
      return res.status(500).json({
        message: "Upload failed",
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res
        .status(401)
        .json({ message: "No refresh token provided", success: false });

    // Verify refresh token
    const payload = await verifyRefreshToken(refreshToken);
    const userId = payload.userId;

    // Kiểm tra token còn hạn trong DB
    const user = await UserModel.findOne({
      _id: userId,
      refreshToken,
      refreshTokenExpireAt: { $gt: new Date() },
    });

    if (!user) {
      return res.status(403).json({
        message: "Refresh token is invalid or expired",
        success: false,
      });
    }

    // generate new token
    const accessToken = await generateAccessTokenAndSetCookie(res, {
      userId: user._id,
      email: user.email,
    });
    const newRefreshToken = await generateRefreshTokenAndSetCookie(res, {
      userId: user._id,
      email: user.email,
    });

    // save token in db
    user.refreshToken = newRefreshToken;
    const expireDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    user.refreshTokenExpireAt = expireDate;
    await user.save();

    return res.status(200).json({
      accessToken,
      refreshToken: newRefreshToken,
      user: sanitizeUser(user),
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
    });
  }
};

const updateUserDetails = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      res.status(401).json({
        message: "You have to login",
        success: false,
      });
    }

    const { name, email, phone } = req.body;

    if (!name || !email || !phone)
      return res.status(400).json({
        message: "Please fill in all information",
        success: false,
      });

    const user = await UserModel.findById(userId);

    if (!user) {
      res.status(404).json({
        message: "User does not exist",
        success: false,
      });
    }

    var verificationToken;

    if (email !== user.email) {
      // generate verified account token
      verificationToken = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();

      //send verified email
      await sendVerificationEmail(email, verificationToken);

      // create new object to db
      const verificationTokenExpireAt = Date.now() + 1000 * 60 * 60 * 24;
      user.verificationToken = verificationToken;
      user.verificationTokenExpireAt = verificationTokenExpireAt;
    }

    if (name !== user.name) user.name = name;
    if (phone !== user.phone) user.phone = phone;

    await user.save();
    return res.status(200).json({
      user: sanitizeUser(user),
      message: "Update user detail successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!userId)
      return res.status(401).json({
        message: "You have to login",
        success: false,
      });

    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword)
      return res.status(400).json({
        message: "Please enter all password",
        success: false,
      });

    if (newPassword !== confirmPassword)
      return res.status(400).json({
        message: "New password and confirm password do not match",
        success: false,
      });

    const user = await UserModel.findById(userId);

    if (!user)
      return res.status(404).json({
        message: "User does not exist",
        success: false,
      });

    const isCorrectPassword = await bcryptjs.compare(
      currentPassword,
      user.password,
    );

    if (!isCorrectPassword)
      res.status(403).json({
        message: "Current password is not correct",
        success: false,
      });

    const salt = await bcryptjs.genSalt();
    const hashedNewPassword = await bcryptjs.hash(newPassword, salt);

    user.password = hashedNewPassword;
    await user.save();

    return res.status(200).json({
      message: "Changed password successfully",
      success: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
    });
  }
};

const googleLogin = async (req, res, next) => {
  try {
    const { token } = req.body;
    const payload = await verifyToken(token);

    const user = {
      email: payload.email,
      name: payload.name,
      password: "g",
      resetPwdNeeded: true,
    };

    let foundUser = await UserModel.findOne({
      email: user.email,
      status: "active",
    });

    if (!foundUser) {
      foundUser = await UserModel.create(user);
    }

    const accessToken = await handlePostLogin(req, res, foundUser);

    return res.status(200).json({
      message: "Đăng nhập thành công!",
      success: true,
      user: sanitizeUser(foundUser),
      accessToken,
    });
  } catch (error) {
    console.error("Google login error:", error);
    next(error);
  }
};

export {
  register,
  login,
  verifyEmail,
  logout,
  forgotPassword,
  resetPassword,
  uploadAvatarImage,
  refreshToken,
  sendVerificationEmailAgain,
  updateUserDetails,
  changePassword,
  googleLogin,
};
