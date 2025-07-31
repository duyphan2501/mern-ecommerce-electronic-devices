import cloudinary from "../config/cloudinary.config.js";
import fs from "fs";

async function uploadFiles(files, options) {
  try {
    const uploadPromises = files.map(async (file) => {
      return cloudinary.uploader.upload(file.path, options)
        .then(result => {
          // Xóa file sau khi upload thành công
          fs.unlink(file.path, (err) => {
            if (err) console.error("Error deleting file:", err);
          });

          return result.secure_url;
        });
    });

    const uploadedFiles = await Promise.all(uploadPromises);
    return uploadedFiles;

  } catch (error) {
    throw error;
  }
}


export default uploadFiles;
