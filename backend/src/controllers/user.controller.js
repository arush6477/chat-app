import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { User } from "../models/user.model.js"
import { uploadCloudinary } from "../utils/cloudinary.js"

/*
    # user model
        fullName 
        email
        username
        password 
        avatar
    
    # Functionalities
    1 - Register (done)
    2 - Login (done)
    3 - logout
    4 - directAccess (if the user has accessToken then try 
        for direct access to chats rather than logging in)   
    5 - avatarUpdate
    6 - changePassword
    
*/

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, "Something went Wrong while generating refresh and access token");
    }
}

//password and email check function
const isPasswordValid = (password) => {
    if (password.length < 8) return "password should be atleast 8 char long";
    if (password.length > 12) return "password should not be more than 12 char";
    if (password.search(/[a-z]/) < 0) return "password should contain a char";
    if (password.search(/[0-9]/) < 0) return "password chould contain a numeric";
    // if(password.search(/[A-Z]/)) return "password should contain atleast one capital char";
    // const specialChar = /[#@!]/;
    // if(!specialChar.test(password)) return "password should contain  ! or @ or #"; 
    return true
}

const isEmailValid = (email) => {
    return true
    //will do later
}


const cookieOptions = {
    // httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    secure: true
}

const registerUser = asyncHandler(async (req, res) => {
    try {
        console.log("The body of the req", req.body)
        console.log("The file of the req", req.file)
        console.log("You have reached the function")

        const { fullName, email, username, password } = req.body
        
        if (!fullName || !email || !username || !password) throw new ApiError(400, "Some value is missing from the request");

        const validPassword = isPasswordValid(password)
        if(validPassword !== true) throw new ApiError(400, validPassword);

        const existingUser = await User.findOne({
            $or: [ 
                {username: username }, 
                { email: email }
            ] 
        })
        if (existingUser) throw new ApiError(400,"User with same username or email already exists");

        let createDatabase
        if (!req.file) {
            createDatabase = await User.create({
                fullName: fullName,
                email: email,
                username: username,
                avatar: "none",
                password: password,
                avatar_public_id: "none",
                refreshToken:"none"
            })
        }
        else{
            const avatarLocalPath = req.file.path
            const avatarUpload = await uploadCloudinary(avatarLocalPath)
            createDatabase = await User.create({
                fullName: fullName,
                email: email,
                username: username,
                avatar: avatarUpload.url,
                password: password,
                avatar_public_id: avatarUpload.public_id,
                refreshToken: "none"
            })
        }

        if (!createDatabase) throw new ApiError(500, "Failed to create the entry in the database");

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(createDatabase?._id)
        if (!accessToken || !refreshToken) throw new ApiError(500, "Failed to generate access or refresh token");

        await User.findByIdAndUpdate(createDatabase._id,{
          $set:{
            refreshToken:refreshToken
          }
        })

        console.log(accessToken) 
        console.log(createDatabase)
       createDatabase.refreshToken = refreshToken

       console.log(createDatabase)
        return res
        .cookie("refreshToken", refreshToken, cookieOptions)
        .cookie("accessToken", accessToken, cookieOptions)
        .status(200)
        .json(new ApiResponse(200, {Data:createDatabase,accessToken:accessToken}, "User registered successfully"))
    } catch (error) {
        throw new ApiError(400, error.message)
    }
})

const loginUser = asyncHandler(async (req, res) => {
    try {
        const { username, password } = req.body

        if (!username && !password) throw new ApiError(400, "username or password is missing");

        const userExist = await User.findOne({
            username: username
        })

        if (!userExist) throw new ApiError(400, "User does not exist");

        const passwordCorrect = userExist.ispasswordCorrect(password)
        if (!passwordCorrect) throw new ApiError(400, "Invalid credentials");

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(userExist._id)
        if (!accessToken && !refreshToken) throw new ApiError(500, "something went wrong while generating the access or refresh token");

        userExist.accessToken = accessToken
        return res
            .status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json(new ApiResponse(200, userExist, "User logged in successfully"))
    } catch (error) {
        throw new ApiError(400, error.message)
    }
})

const directAccess = asyncHandler(async (req,res) => {
    return res
    .status(200)
    .json(
        new ApiResponse(200 , {
            message: "accessGranted"
        },
        "you can directly access the chatpage"
    ))
})

const logOutUser = asyncHandler(async (req, res) => {

})

const updateAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file.path
    if (!avatarLocalPath) throw new ApiError(400, "Avatar local path not found");

    const updateCloudinary = await uploadCloudinary(avatarLocalPath)
    if (!uploadCloudinary) throw new ApiError(500, "Failed to upload the image on cloudinary");

    const updateDatabase = await User.findByIdAndUpdate(req.user?._id, {
        $update: {
            avatar: updateCloudinary.url,
            avatar_public_id: updateCloudinary.public_id
        }
    })

    if (!updateDatabase) throw new ApiError(500, "Failed to update the database");

    return res
        .status(200)
        .json(new ApiResponse(200, updateDatabase.select("avatar"), "Avatar updated successfully"))
})

const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword } = req.params
    if (!oldPassword) throw new ApiError(400, "Bad Request old password not found in the req");

    const updateDatabase = await findByIdAndUpdate(req.user?._id, {
        $update: {
            password: password
        }
    })
    if (!updateDatabase) throw new ApiError("Failed to update the password in the database");

    return res
        .status(200)
        .json(ApiResponse(200, {}, "password changed successfully"))
})

const updateUsername = asyncHandler(async (req, res) => {
    const { username } = req.params
    if (!username) throw new ApiError(400, "username missing from the request");

    const usernameInUse = await User.findOne({ username: username })
    if (usernameInUse) throw new ApiError("username already in use");

    const updateDatabase = await User.findByIdAndUpdate(req.user?._id, {
        $update: {
            username: username
        }
    })
    if (!updateDatabase) throw new ApiError(500, "Failed to update the database");

    return res
        .status(200)
        .json(new ApiResponse(200, updateDatabase, "Username updated successfully"))
})

export {
    registerUser,
    loginUser,
    logOutUser,
    directAccess,
    updateAvatar
}