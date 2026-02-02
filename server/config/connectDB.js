import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

async function connectDB() {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) throw new Error("Mongodb uri does not exist in .env file");

    await mongoose.connect(mongoURI)
    console.log("Connect to DB successfully");

    mongoose.connection.on("error", (err) => {
      console.error("Mongoose connection error:", err);
    });
    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ Mongoose disconnected!");
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("Mongoose connection closed due to app termination");
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ DB Connection Error:", error);
    process.exit(1);
  }
}

export default connectDB;
