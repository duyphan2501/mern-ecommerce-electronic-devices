import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Provide name"],
    },
    email: {
      type: String,
      require: [true, "Provide email"],
    },
    password: {
      type: String,
      require: [true, "Provide password"],
    },
    avatar: String,
    phone: Number,
    verificationToken: String,
    verificationTokenExpireAt: Date,
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    addressId: {
      type: mongoose.Schema.ObjectId,
      ref: "address",
    },
    cartId: {
      type: mongoose.Schema.ObjectId,
      ref: "productCart",
    },
    resetPasswordToken: String,
    resetPasswordExpireAt: Date,
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    refreshToken: String,
    refreshTokenExpireAt: Date
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("user", userSchema);

export default UserModel;
