import cloudinary from "../config/cloudinary.config.js";
import fs from "fs";

async function uploadFiles(files, options) {
  try {
    let uploadedFiles = [];

    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, options);

      if (result) {
        uploadedFiles.push(result.secure_url);
      } else {
        throw new Error("Upload failed");
      }

      fs.unlink(file.path, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }

    return uploadedFiles;
  } catch (error) {
    throw error;
  }
}

export default uploadFiles;
