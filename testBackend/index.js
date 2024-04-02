import express, { urlencoded } from "express"
import cors from "cors"
import { upload } from "./multer.mid.js"
import { generateToken, verifyJWT } from "./token.js"
const app = express()


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin:"http://localhost:3000", credentials:true,
}))

const cookieOptions = {
    // httpOnly:true,
    maxAge: 24 * 60 * 60 * 1000,
    secure:true
}

app.post("/api/v1/user/register",upload.single("avatar"), (req,res)=>{
    console.log(req.body)
    console.log(req?.file)
    const {username , password , email , fullName } = req.body
    const token = generateToken({username,password,email,fullName})
    res.cookie("Token",token , cookieOptions)
    res.status(200).json({message:"successfully received the request",pyaraToken:token})
})

app.post("/api/v1/chat/fetch", verifyJWT, (req,res) => {
    console.log("you have reached the fucntion");
    res.status(200).json({message : "direct aaja bc",data:req.tokenData})
})

app.post("/api/v1/user/login", (req,res) => {
    console.log(req.body)
    res.status(200).send("Sbb kaam krr rha ha bc")
})

app.listen(8080, ()=> {
    console.log(`App is running at http://127.0.0.1:8080`)
})