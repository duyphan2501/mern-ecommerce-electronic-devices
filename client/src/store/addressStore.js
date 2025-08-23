import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_BACKEND_URL;

axios.defaults.withCredentials = true;

const useAddressStore = create((set) => {
  const createAddress = async (addressData, axiosPrivate) => {
    set({ isLoadingAddress: true });
    try {
      const res = await axiosPrivate.post(
        `${API_URL}/api/address/create`,
        addressData
      );
      toast.success(res.data.message || "Address added successfully");
      set((state) => ({
        addresses: [...state.addresses, res.data.savedAddress],
      }));

      return res.data.success;
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error(error.response?.data?.message || "Failed to add address");
    } finally {
      set({
        isLoadingAddress: false,
      });
    }
  };

  const getAllAddresses = async (axiosPrivate) => {
    try {
      const res = await axiosPrivate.get(`${API_URL}/api/address/all`);
      set({ addresses: res.data.addresses });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch addresses");
    }
  };

  const updateAddress = async (addressData, axiosPrivate) => {
    set({ isLoadingAddress: true });
    try {
      const res = await axiosPrivate.put(
        `${API_URL}/api/address/update`,
        addressData
      );
      set((state) => ({
        addresses: state.addresses.map((address) =>
          address._id === addressData.id ? res.data.updatedAddress : address
        ),
      }));
      toast.success(res.data.message || "Address updated successfully");
      return res.data.success;
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error(error.response?.data?.message || "Failed to update address");
    } finally {
      set({
        isLoadingAddress: false,
      });
    }
  };

  const deleteAddress = async (id, axiosPrivate) => {
    set({ isLoadingAddress: true });
    try {
      const res = await axiosPrivate.delete(
        `${API_URL}/api/address/delete/${id}`
      );
      set((state) => ({
        addresses: state.addresses.filter((address) => address._id !== id),
      }));
      toast.success(res.data.message || "Address deleted successfully");
      return res.data.success;
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error(error.response?.data?.message || "Failed to delete address");
    } finally {
      set({
        isLoadingAddress: false,
      });
    }
  };

  return {
    isLoadingAddress: false,
    addresses: [],
    createAddress,
    getAllAddresses,
    updateAddress,
    deleteAddress,
  };
});

export default useAddressStore;
