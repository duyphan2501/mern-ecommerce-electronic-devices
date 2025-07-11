import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

async function connectDB() {
    try {
        const mongoURI = process.env.MONGODB_URI
        if (!mongoURI) throw new Error("Mongodb uri does not exist in .env file")
        await mongoose.connect(mongoURI)
        console.log("connect to db successfully")
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

export default connectDB