import mongoose from "mongoose"
import {DB_NAME} from "../constants.js"

const connectDB = async () => {
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("Database connected successfully")
    } catch (error){
        console.log("Failed to connect the database ERROR: ", error.message)
    }
}

export {connectDB}