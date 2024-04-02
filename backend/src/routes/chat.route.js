import { Router } from "express"
import {verifyJWT} from "../middlewares/auth.middleware.js"
const router = Router()
router.use(verifyJWT)

//importing controllers 
import { getChats } from "../controllers/chat.controller.js"

router.route("/getChats").get(getChats)

export default router