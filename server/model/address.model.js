import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    addressTpye: {
        type: String,
        enum: ["home", "office"],
        default: "home"
    },
    receiver: {
        type: String,
        require: [true,"Provide receiver"]
    },
    phone: {
        type: String,
        require: [true,"Provide phone number"]
    },
    province: {
        type: String,
        require: [true,"Provide province"]
    },
    district: {
        type: String,
        require: [true,"Provide district"]
    },
    ward: {
        type: String,
        require: [true,"Provide ward"]
    },
    addressDetail: {
        type: String,
        require: [true,"Provide address detail"]
    },
})