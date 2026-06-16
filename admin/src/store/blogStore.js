import toast from "react-hot-toast";
import { create } from "zustand";

const getErrorMessage = (error) =>
  error.response?.data?.message || error.message || "Something went wrong";

const normalizeBlog = (blog) => ({
  ...blog,
  id: blog._id,
});

const uploadImage = async (axiosPrivate, file) => {
  if (!file) return "";

  const formData = new FormData();
  formData.append("blogImage", file);
  const response = await axiosPrivate.post(
    "/api/blogs/admin/upload-image",
    formData,
  );
  return response.data.uploadedImage.url;
};

const useBlogStore = create((set) => ({
  blogs: [],
  selectedBlog: null,
  isLoading: false,
  isSaving: false,

  fetchBlogs: async (axiosPrivate) => {
    set({ isLoading: true });
    try {
      const response = await axiosPrivate.get("/api/blogs/admin");
      const blogs = response.data.blogs.map(normalizeBlog);
      set({ blogs });
      return blogs;
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchBlogById: async (axiosPrivate, id) => {
    set({ isLoading: true, selectedBlog: null });
    try {
      const response = await axiosPrivate.get(`/api/blogs/admin/${id}`);
      const blog = normalizeBlog(response.data.blog);
      set({ selectedBlog: blog });
      return blog;
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  saveBlog: async (axiosPrivate, blog, imageFile) => {
    set({ isSaving: true });
    try {
      const uploadedImage = await uploadImage(axiosPrivate, imageFile);
      const payload = {
        ...blog,
        coverImage: uploadedImage || blog.coverImage,
      };
      delete payload.id;
      delete payload._id;
      delete payload.createdAt;
      delete payload.updatedAt;
      delete payload.__v;

      const response = blog.id
        ? await axiosPrivate.put(`/api/blogs/admin/${blog.id}`, payload)
        : await axiosPrivate.post("/api/blogs/admin", payload);

      const savedBlog = normalizeBlog(response.data.blog);
      set((state) => ({
        blogs: blog.id
          ? state.blogs.map((item) =>
              item.id === savedBlog.id ? savedBlog : item,
            )
          : [savedBlog, ...state.blogs],
        selectedBlog: savedBlog,
      }));
      toast.success(response.data.message);
      return savedBlog;
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    } finally {
      set({ isSaving: false });
    }
  },

  deleteBlog: async (axiosPrivate, id) => {
    try {
      const response = await axiosPrivate.delete(`/api/blogs/admin/${id}`);
      set((state) => ({
        blogs: state.blogs.filter((blog) => blog.id !== id),
      }));
      toast.success(response.data.message);
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  },
}));

export default useBlogStore;
