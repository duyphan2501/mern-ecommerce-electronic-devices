import express from 'express'
import checkAuth from '../middleware/auth.middleware.js'
import { uploadDoc, uploadImg} from '../middleware/cloudinary.middleware.js'
import { createProduct, getAllProducts, uploadDocument, uploadImages } from '../controller/product.controller.js'

const productRouter = express.Router()

productRouter.post("/upload-images", checkAuth, uploadImg.array('productImages', 10), uploadImages);
productRouter.post("/upload-documents", checkAuth, uploadDoc.array('documents', 10), uploadDocument);
productRouter.post("/create", checkAuth, createProduct);
productRouter.get("/list", checkAuth, getAllProducts);
    
export default productRouter;