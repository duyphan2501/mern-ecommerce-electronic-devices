import express from 'express'
import checkAuth from '../middleware/auth.middleware.js'
import { uploadDoc, uploadImg} from '../middleware/cloudinary.middleware.js'
import { createProduct, fetchProducts, getAllProducts, getNewProducts, getProductByCategoryId, getProductBySlug, searchProducts, uploadDocument, uploadImages } from '../controller/product.controller.js'

const productRouter = express.Router()

productRouter.post("/upload-images", checkAuth, uploadImg.array('productImages', 10), uploadImages);
productRouter.post("/upload-documents", checkAuth, uploadDoc.array('documents', 10), uploadDocument);
productRouter.post("/create", createProduct);
productRouter.get("/new", getNewProducts);
productRouter.get("/fetch", fetchProducts);
productRouter.get("/all", getAllProducts);
productRouter.get("/get/:slug", getProductBySlug);
productRouter.get("/category/:categoryId", getProductByCategoryId);
productRouter.get("/search", searchProducts);
    
export default productRouter;