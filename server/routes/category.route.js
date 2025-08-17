import express from 'express'
import checkAuth from '../middleware/auth.middleware.js'
import { createCategory, deleteCategory, getAllCategories, getCategoryById, getListOfCategories, updateCategory, uploadImage } from '../controller/category.controller.js'
import {uploadImg, uploadDoc} from '../middleware/cloudinary.middleware.js'
const categoryRouter = express.Router()

categoryRouter.post("/upload-image", checkAuth, uploadImg.single('categoryImage'), uploadImage)
categoryRouter.post("/create", checkAuth, createCategory)
categoryRouter.get("/list", getListOfCategories)
categoryRouter.delete("/delete/:id", checkAuth, deleteCategory)
categoryRouter.get("/get/:id", checkAuth, getCategoryById)
categoryRouter.put("/update/:id", checkAuth, updateCategory)
categoryRouter.get("/all", getAllCategories)

export default categoryRouter

