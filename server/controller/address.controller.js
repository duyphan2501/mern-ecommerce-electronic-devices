import AddressModel from "../model/address.model.js";
import { setAddressDefault } from "../service/address.service.js";
import mongoose from "mongoose";

const createAddress = async (req, res) => {
  try {
    const {
      receiver,
      phone,
      province,
      ward,
      addressDetail,
      addressType,
      isDefault,
    } = req.body;

    let userId = req.body?.userId || req.user?.userId;
    if (!userId) {
      return res
        .status(400)
        .json({ message: "User ID is missing.", success: false });
    }
    userId = new mongoose.Types.ObjectId(`${userId}`);

    // Validate required fields
    if (!receiver || !phone || !province || !ward || !addressDetail) {
      return res.status(400).json({
        message: "Vui lòng điền đầy đủ thông tin địa chỉ.",
        success: false,
      });
    }

    if (!["home", "office"].includes(addressType)) {
      return res
        .status(400)
        .json({ message: "Loại địa chỉ không hợp lệ.", success: false });
    }

    // Create new address object
    const newAddress = {
      receiver,
      phone,
      province,
      ward,
      addressType,
      addressDetail,
      isDefault,
      userId,
    };

    // Save the new address to the database
    const savedAddress = await AddressModel.create(newAddress);

    if (!savedAddress) {
      return res
        .status(500)
        .json({ message: "Không thể lưu địa chỉ mới.", success: false });
    }

    return res.status(201).json({
      message: "Thêm địa chỉ thành công.",
      savedAddress,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false });
  }
};

const getAllAddresses = async (req, res) => {
  try {
    const userId = req.params?.userId || req.user?.userId;
    if (!userId) {
      return res
        .status(400)
        .json({ message: "User ID is missing.", success: false });
    }

    const addresses = await AddressModel.find({ userId });
    return res.status(200).json({ addresses, success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "ID địa chỉ không được để trống.",
        success: false,
      });
    }

    const deletedAddress = await AddressModel.findByIdAndDelete(id);

    if (!deletedAddress) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy địa chỉ để xóa.", success: false });
    }

    return res.status(200).json({
      message: "Xóa địa chỉ thành công.",
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false });
  }
};

const setAddressAsDefault = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "ID địa chỉ không được để trống.",
        success: false,
      });
    }

    const updatedAddress = await setAddressDefault(id);

    if (!updatedAddress) {
      return res.status(404).json({
        message: "Không tìm thấy địa chỉ để cập nhật.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Cập nhật địa chỉ mặc định thành công.",
      updatedAddress,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false });
  }
};

const updateAddress = async (req, res) => {
  try {
    const {
      id,
      receiver,
      phone,
      province,
      ward,
      addressDetail,
      addressType,
      isDefault,
    } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "ID địa chỉ không được để trống.",
        success: false,
      });
    }

    if (isDefault) {
      await setAddressDefault(id);
    }

    const updatedAddress = await AddressModel.findByIdAndUpdate(
      id,
      {
        receiver,
        phone,
        province,
        ward,
        addressDetail,
        addressType,
        isDefault,
      },
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({
        message: "Không tìm thấy địa chỉ để cập nhật.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Cập nhật địa chỉ thành công.",
      updatedAddress,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false });
  }
};

export {
  createAddress,
  getAllAddresses,
  deleteAddress,
  setAddressAsDefault,
  updateAddress,
};
