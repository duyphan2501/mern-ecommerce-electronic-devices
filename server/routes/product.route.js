import express from 'express'
import checkAuth from '../middleware/auth.middleware.js'
import { uploadDoc, uploadImg} from '../middleware/cloudinary.middleware.js'
import { archiveProduct, createProduct, fetchProducts, getAdminProductById, getAdminProducts, getAllProducts, getNewProducts, getProductByCategoryId, getProductBySlug, getProductsByCategoryIds, searchProducts, updateProduct, uploadDocument, uploadImages } from '../controller/product.controller.js'

const productRouter = express.Router()

productRouter.post("/upload-images", checkAuth, uploadImg.array('productImages', 10), uploadImages);
productRouter.post("/upload-documents", checkAuth, uploadDoc.array('documents', 10), uploadDocument);
productRouter.get("/admin", checkAuth, getAdminProducts);
productRouter.get("/admin/:id", checkAuth, getAdminProductById);
productRouter.post("/create", checkAuth, createProduct);
productRouter.post("/update/:id", checkAuth, updateProduct);
productRouter.post("/archive/:id", checkAuth, archiveProduct);
productRouter.get("/new", getNewProducts);
productRouter.get("/fetch", fetchProducts);
productRouter.get("/all", getAllProducts);
productRouter.get("/get/:slug", getProductBySlug);
productRouter.get("/category/:categoryId", getProductByCategoryId);
productRouter.get("/search", searchProducts);
productRouter.get("/categoryIds", getProductsByCategoryIds);
    
export default productRouter;
