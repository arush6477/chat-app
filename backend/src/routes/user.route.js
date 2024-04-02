import { Router } from "express"
import {registerUser , loginUser, directAccess} from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
const router = Router();

router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/login").post(registerUser);
router.route("/direct").post(verifyJWT, directAccess)

export default router