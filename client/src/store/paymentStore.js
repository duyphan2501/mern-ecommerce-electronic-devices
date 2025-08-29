import toast from "react-hot-toast";
import { create } from "zustand";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const usePaymentStore = create(set => {
    const createPayment = async(axiosPrivate, cartItems) => {
        set({isPaymentLoading: true})
        try {
            const res = await axiosPrivate.post(`${API_URL}/api/payment/create`, cartItems)
            const checkoutUrl = res.data.url
            window.location.href = checkoutUrl
        } catch (error) {
            console.log(error)
            toast.error()
        } finally {
            set({isPaymentLoading: true})
        }
    }

    return {
        isPaymentLoading: false,
        createPayment,
    }

}) 

export default usePaymentStore