import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const createProduct = async (product) => {
    try {
      // Upload hình ảnh
      const imageFormData = new FormData();
      product.images.forEach((img) => {
        imageFormData.append("productImages", img);
      });

      const imageRes = await axios.post(
        `${BACKEND_URL}/api/product/upload-images`,
        imageFormData,
        {
          withCredentials: true, // Gửi cookie kèm theo
        }
      );
      let uploadedImages = [];
      if (imageRes) {
        uploadedImages = imageRes.data?.uploadedImages;
        notify("success", imageRes.data?.message);
      } else notify("error", imageRes.data?.message);

      // Upload tài liệu
      const newModels = [...product.models];

      for (let i = 0; i < newModels.length; i++) {
        const docFormData = new FormData();
        newModels[i].documents.forEach((doc) => {
          docFormData.append("documents", doc);
        });
        
        const docRes = await axios.post(
          `${BACKEND_URL}/api/product/upload-documents`,
          docFormData,
          {
            withCredentials: true, // Gửi cookie kèm theo
          }
        );
        if (docRes) {
          newModels[i].documents = docRes.data?.uploadedDocuments;
          notify("success", docRes.data?.message);
        } else notify("error", docRes.data?.message);
      }

      const payload = {
        ...product,
        images: uploadedImages,
        models: newModels,
      };
      const res = await axios.post(
        `${BACKEND_URL}/api/product/create`,
        payload,
        {
          withCredentials: true,
        }
      );

      // 4. Xử lý kết quả
      if (res.data?.success) {
        notify("success", res.data.message || "Tạo sản phẩm thành công!");
      } else {
        notify("error", res.data.message || "Tạo sản phẩm thất bại!");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Đã có lỗi xảy ra.";
      notify("error", errorMessage);
      console.error("Chi tiết lỗi:", error);
    }
}
export {createProduct}