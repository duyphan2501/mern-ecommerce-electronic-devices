import toast from "react-hot-toast";
import { create } from "zustand";

const getErrorMessage = (error) =>
  error.response?.data?.message || error.message || "Something went wrong";

const normalizeService = (service) => ({
  ...service,
  id: service._id,
});

const uploadImage = async (axiosPrivate, file) => {
  if (!file) return "";

  const formData = new FormData();
  formData.append("serviceImage", file);
  const response = await axiosPrivate.post(
    "/api/services/admin/upload-image",
    formData,
  );
  return response.data.uploadedImage.url;
};

const useServiceStore = create((set) => ({
  services: [],
  selectedService: null,
  isLoading: false,
  isSaving: false,

  fetchServices: async (axiosPrivate) => {
    set({ isLoading: true });
    try {
      const response = await axiosPrivate.get("/api/services/admin");
      const services = response.data.services.map(normalizeService);
      set({ services });
      return services;
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchServiceById: async (axiosPrivate, id) => {
    set({ isLoading: true, selectedService: null });
    try {
      const response = await axiosPrivate.get(`/api/services/admin/${id}`);
      const service = normalizeService(response.data.service);
      set({ selectedService: service });
      return service;
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  saveService: async (axiosPrivate, service, imageFile) => {
    set({ isSaving: true });
    try {
      const uploadedImage = await uploadImage(axiosPrivate, imageFile);
      const payload = {
        ...service,
        image: uploadedImage || service.image,
      };
      delete payload.id;
      delete payload._id;
      delete payload.createdAt;
      delete payload.updatedAt;
      delete payload.__v;

      const response = service.id
        ? await axiosPrivate.put(`/api/services/admin/${service.id}`, payload)
        : await axiosPrivate.post("/api/services/admin", payload);

      const savedService = normalizeService(response.data.service);
      set((state) => ({
        services: service.id
          ? state.services.map((item) =>
              item.id === savedService.id ? savedService : item,
            )
          : [...state.services, savedService],
        selectedService: savedService,
      }));
      toast.success(response.data.message);
      return savedService;
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    } finally {
      set({ isSaving: false });
    }
  },

  deleteService: async (axiosPrivate, id) => {
    try {
      const response = await axiosPrivate.delete(`/api/services/admin/${id}`);
      set((state) => ({
        services: state.services.filter((service) => service.id !== id),
      }));
      toast.success(response.data.message);
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  },
}));

export default useServiceStore;
