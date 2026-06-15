import toast from "react-hot-toast";
import { create } from "zustand";

const getErrorMessage = (error) =>
  error.response?.data?.message || error.message || "Something went wrong";

const normalizeSlide = (slide) => ({
  ...slide,
  id: slide._id,
});

const uploadImage = async (axiosPrivate, file) => {
  if (!file) return "";

  const formData = new FormData();
  formData.append("slideImage", file);
  const response = await axiosPrivate.post(
    "/api/slides/admin/upload-image",
    formData,
  );
  return response.data.uploadedImage.url;
};

const useSlideStore = create((set) => ({
  slides: [],
  selectedSlide: null,
  isLoading: false,
  isSaving: false,

  fetchSlides: async (axiosPrivate) => {
    set({ isLoading: true });
    try {
      const response = await axiosPrivate.get("/api/slides/admin");
      const slides = response.data.slides.map(normalizeSlide);
      set({ slides });
      return slides;
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSlideById: async (axiosPrivate, id) => {
    set({ isLoading: true, selectedSlide: null });
    try {
      const response = await axiosPrivate.get(`/api/slides/admin/${id}`);
      const slide = normalizeSlide(response.data.slide);
      set({ selectedSlide: slide });
      return slide;
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  saveSlide: async (
    axiosPrivate,
    slide,
    { imageFile, mobileImageFile } = {},
  ) => {
    set({ isSaving: true });
    try {
      const [uploadedImage, uploadedMobileImage] = await Promise.all([
        uploadImage(axiosPrivate, imageFile),
        uploadImage(axiosPrivate, mobileImageFile),
      ]);

      const payload = {
        ...slide,
        image: uploadedImage || slide.image,
        mobileImage: uploadedMobileImage || slide.mobileImage,
      };
      delete payload.id;
      delete payload._id;
      delete payload.createdAt;
      delete payload.updatedAt;
      delete payload.__v;

      const response = slide.id
        ? await axiosPrivate.put(`/api/slides/admin/${slide.id}`, payload)
        : await axiosPrivate.post("/api/slides/admin", payload);

      const savedSlide = normalizeSlide(response.data.slide);
      set((state) => ({
        slides: slide.id
          ? state.slides.map((item) =>
              item.id === savedSlide.id ? savedSlide : item,
            )
          : [...state.slides, savedSlide],
        selectedSlide: savedSlide,
      }));
      toast.success(response.data.message);
      return savedSlide;
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    } finally {
      set({ isSaving: false });
    }
  },

  duplicateSlide: async (axiosPrivate, id) => {
    try {
      const response = await axiosPrivate.post(
        `/api/slides/admin/${id}/duplicate`,
      );
      const slide = normalizeSlide(response.data.slide);
      set((state) => ({ slides: [...state.slides, slide] }));
      toast.success(response.data.message);
      return slide;
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  },

  deleteSlide: async (axiosPrivate, id) => {
    try {
      const response = await axiosPrivate.delete(`/api/slides/admin/${id}`);
      set((state) => ({
        slides: state.slides.filter((slide) => slide.id !== id),
      }));
      toast.success(response.data.message);
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  },
}));

export default useSlideStore;
