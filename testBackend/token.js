import jwt from "jsonwebtoken"

const generateToken = (data) => {
    return jwt.sign(data, "secret", { expiresIn: "1d" })
}

const verifyJWT = (req, res, next) => {
    try {
        console.log("The fetch request data is: ")
        console.log(req.body)
        const {accessToken} = req.cookie || req.body.cookie
        
        if (!accessToken) res.status(401).send("Token not found in the req");
        console.log(accessToken)

        const verify = jwt.verify(accessToken, "secret")
        req.tokenData = verify
        next()
    } catch (error) {
        res
            .status(401)
    }
}

export {
    generateToken,
    verifyJWT
}