import mongoose from "mongoose";
import { userInfo } from "os";

const addressSchema = new mongoose.Schema({
  receiver: {
    type: String,
    require: [true, "Provide receiver"],
  },
  phone: {
    type: String,
    require: [true, "Provide phone number"],
  },
  province: {
    type: String,
    require: [true, "Provide province"],
  },
  ward: {
    type: String,
    require: [true, "Provide ward"],
  },
  addressDetail: {
    type: String,
    require: [true, "Provide address detail"],
  },
    addressType: {
    type: String,
    enum: ["home", "office"],
    default: "home",
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "users",
    require: [true, "Provide userId"],
  },
});

const AddressModel = new mongoose.model("addresses", addressSchema);
export default AddressModel;
