import express from 'express'
import { forgotPassword, login, logout, register, verifyEmail, resetPassword, uploadAvatarImage, refreshToken } from '../controller/user.controller.js'
import checkAuth from '../middleware/auth.middleware.js'
import upload from '../middleware/cloudinary.middleware.js'
const userRouter = express.Router()

userRouter.post("/register", register)
userRouter.post("/login", login)
userRouter.put("/verify-email", verifyEmail)
userRouter.get("/logout", checkAuth, logout)
userRouter.post("/forgot-password", forgotPassword)
userRouter.post("/avatar/upload", checkAuth, upload.single('avatar'), uploadAvatarImage)
userRouter.put("/reset-password/:token", resetPassword)
userRouter.put("/refresh-token", refreshToken)
userRouter.get("/", checkAuth, (req, res) => {
    res.send({
        message: "Welcome to home page"
    })
})

export default userRouter