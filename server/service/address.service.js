import AddressModel from "../model/address.model.js";

const setAddressDefault = async (id) => {
  // Set all addresses to not default
  await AddressModel.updateMany({id}, { isDefault: false });

  // Set the specified address as default
  const updatedAddress = await AddressModel.findByIdAndUpdate(
    id,
    { isDefault: true },
    { new: true }
  );

  if (!updatedAddress) {
    throw new Error("Không tìm thấy địa chỉ để cập nhật.");
  }

  return updatedAddress
};

export { setAddressDefault };
