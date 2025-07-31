import express from 'express'
import { forgotPassword, login, logout, register, verifyEmail, resetPassword, uploadAvatarImage, refreshToken } from '../controller/user.controller.js'
import checkAuth from '../middleware/auth.middleware.js'
import {uploadImg} from '../middleware/cloudinary.middleware.js'
import multer from 'multer'
const userRouter = express.Router()
const upload = multer()

userRouter.post("/register", register)
userRouter.post("/login", upload.none(), login)
userRouter.put("/verify-email", verifyEmail)
userRouter.get("/logout", checkAuth, logout)
userRouter.post("/forgot-password", forgotPassword)
userRouter.post("/avatar/upload", checkAuth, uploadImg.single('avatar'), uploadAvatarImage)
userRouter.put("/reset-password/:token", resetPassword)
userRouter.put("/refresh-token", refreshToken)
userRouter.get("/check-auth", checkAuth, (req, res) => {
    res.status(200).json({
        message: "Check auth successfully",
        success: true
    })
})

export default userRouter