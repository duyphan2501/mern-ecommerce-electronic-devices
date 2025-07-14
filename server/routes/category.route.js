import express from 'express'
import checkAuth from '../middleware/auth.middleware.js'
import { createCategory, deleteCategory, getCategoryById, getListOfCategories, updateCategory, uploadImage } from '../controller/category.controller.js'
import upload from '../middleware/cloudinary.middleware.js'
const categoryRouter = express.Router()

categoryRouter.post("/upload-image", checkAuth, upload.single('categoryImage'), uploadImage)
categoryRouter.post("/create", checkAuth, createCategory)
categoryRouter.get("/list", checkAuth, getListOfCategories)
categoryRouter.delete("/delete/:id", checkAuth, deleteCategory)
categoryRouter.get("/get/:id", checkAuth, getCategoryById)
categoryRouter.put("/update/:id", checkAuth, updateCategory)

export default categoryRouter

