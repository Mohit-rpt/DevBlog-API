import dotenv from "dotenv"
dotenv.config()

import mongoose from "mongoose"
import  { DB_NAME } from "../constants/index.js"



const connectDB = async () => {
    try {
        console.log(`Connecting to: ${process.env.MONGODB_URI}/${DB_NAME}`)

        const connection  = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        console.log(`MongoDB connected: ${connection.connection.host}`)
    } catch (error) {
        console.error("Error connecting to MongoDB:", error)
        process.exit(1)
    }
}

export default connectDB;