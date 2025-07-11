import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";

dotenv.config();
const app = express();

app.get("/", (req, res) => {
  res.json({
    message: "is at home page",
  });
});

const PORT = process.env.PORT || 8080;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("server is listen to port " + PORT);
  });
});
