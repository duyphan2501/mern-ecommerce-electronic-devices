import express from 'express'
import { forgotPassword, login, logout, register, verifyEmail, resetPassword } from '../controller/auth.controller.js'
import checkAuth from '../middleware/auth.middleware.js'
const authRouter = express.Router()

authRouter.post("/register", register)
authRouter.post("/login", login)
authRouter.put("/verify-email", verifyEmail)
authRouter.get("/logout", checkAuth, logout)
authRouter.post("/forgot-password", forgotPassword)
authRouter.put("/reset-password/:token", resetPassword)
authRouter.get("/", checkAuth, (req, res) => {
    res.send({
        message: "Welcome to home page"
    })
})

export default authRouter