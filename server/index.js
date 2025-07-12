import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import router from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", router);
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on Port", PORT);
  });
});
