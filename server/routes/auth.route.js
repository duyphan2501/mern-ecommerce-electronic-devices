import express from 'express'
import { login, logout, register, verifyEmail } from '../controller/auth.controller.js'
import checkAuth from '../middleware/auth.middleware.js'
const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.put("/verify-email", verifyEmail)
router.get("/logout", checkAuth, logout)
router.get("/", checkAuth, (req, res) => {
    res.send({
        message: "Welcome to home page"
    })
})

export default router