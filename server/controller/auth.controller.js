import {
  sendForgotPasswordEMail,
  sendVerificationEmail,
} from "../mailtrap/emails.js";
import UserModel from "../model/user.model.js";
import bcryptjs from "bcryptjs";
import {
  generateAccessTokenAndSetCookie,
  generateRefreshTokenAndSetCookie,
} from "../utils/generateToken.js";
import crypto from 'crypto'

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
        message: "User has been already used",
        success: false,
      });
    }
    // hash password
    const salt = await bcryptjs.genSalt();
    const hashPassword = await bcryptjs.hash(password, salt);

    // generate verified account token
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    //send verified email
    await sendVerificationEmail(email, verificationToken);

    // create new object to db
    const verificationTokenExpireAt = Date.now() + 1000 * 60 * 60 * 24; //ms
    const newUser = await UserModel.create({
      name,
      email,
      password: hashPassword,
      verificationToken,
      verificationTokenExpireAt,
    });

    return res.status(200).json({
      success: true,
      user: {
        ...newUser._doc,
        message: "register successfully",
        password: undefined,
      },
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
    const user = await UserModel.findOne({ email });
    if (!user)
      return res.status(404).json({
        message: "User does not exist",
        success: false,
      });

    if (!user.isVerified)
      return res.status(401).json({
        message: "User is not verified",
        success: false,
      });

    // compare password
    const isCorrectPassword = await bcryptjs.compare(password, user.password);
    if (!isCorrectPassword)
      return res.status(401).json({
        message: "Password is not correct",
        success: false,
      });

    // generate token and set cookie
    const accessToken = generateAccessTokenAndSetCookie(res, user._id);
    const refreshToken = generateRefreshTokenAndSetCookie(res, user._id);

    // save token in db
    user.refreshToken = refreshToken;
    const expireDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    user.refreshTokenExpireAt = expireDate;
    await user.save();

    return res.status(200).json({
      user: {
        ...user._doc,
        message: "Login successfully",
        password: undefined,
      },
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
      return res.status(500).json({
        message: "Please provide verification token and email",
        success: false,
      });

    // find user
    const user = await UserModel.findOne({
      email: email,
      verificationToken: code,
    });
    if (!user)
      return res.status(404).json({
        message: "User does not exist or wrong OTP",
        success: false,
      });

    // check token is correct?
    const isCorretToken = user.verificationToken === code;
    if (!isCorretToken)
      return res.status(401).json({
        message: "token is not correct",
        success: false,
      });

    // set user is verified and cancle token
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpireAt = undefined;
    await user.save();

    return res.status(200).json({
      user: {
        ...user._doc,
        message: "verify account succesfully",
        password: undefined,
      },
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
    const user = await UserModel.findOne({ email });
    if (!user)
      return res.status(404).json({
        message: "User does not exist",
        success: false,
      });

    // generate reset password token to to identify user need to be reset password
    const resetPasswordToken = crypto.randomBytes(20).toString("hex");
    const tokenExpire = Date.now() + 1000 * 60 * 15;
    // save in db
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpireAt = tokenExpire;
    await user.save();

    // send email reset password
    const resetPasswordUrl =
      process.env.FRONTEND_URL + "/reset-password/" + resetPasswordToken;
    await sendForgotPasswordEMail(email, resetPasswordUrl);

    return res.status(200).json({
      message: "Reset email is sent to " + email,
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
    const { password, confirmPassword } = req.body;

    // get user
    const user = await UserModel.findOne({
      resetPasswordToken,
      resetPasswordExpireAt: { $gt: Date.now() },
    });
    if (!user)
      return res.status(404).json({
        message: "reset token is not correct",
        success: false,
      });

    // check password and confirm password
    if (password !== confirmPassword)
      return res.status(400).json({
        message: "password and confirm password is not match",
        success: false,
      });
    // hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    // save in db
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpireAt = undefined;
    user.save();

    return res.status(200).json({
      user: { ...user._doc, password: undefined },
      message: "reset password succesfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
    });
  }
};

export { register, login, verifyEmail, logout, forgotPassword, resetPassword };
