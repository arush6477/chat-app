import {connectDB} from "./db/index.js"
import dotenv from "dotenv"
import { app } from "./app.js"

dotenv.config({
    path : "./.env"
})

connectDB()
.then(() => {
    const port = process.env.PORT
    app.listen(port, ()=> {
        console.log(`Server is running at the port ${port}`)
    })
}).catch((error) => {
    console.log("index.js ERROR: " , error.message)
})