import toast from "react-hot-toast";
import { create } from "zustand";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const usePaymentStore = create(set => {
    const createPayment = async(axiosPrivate, cartItems, address) => {
        set({isPaymentLoading: true})
        try {
            console.log(cartItems)
            const res = await axiosPrivate.post(`${API_URL}/api/payment/create`, {cartItems, address})
            const checkoutUrl = res.data.url
            window.location.href = checkoutUrl
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        } finally {
            set({isPaymentLoading: false})
        }
    }

    return {
        isPaymentLoading: false,
        createPayment,
    }

}) 

export default usePaymentStore