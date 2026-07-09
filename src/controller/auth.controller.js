import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/users.model.js';
import ApiError from '../utils/ApiError.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import ApiResponse from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async(req,res)=>{
    const {fullname, email, username, password} = req.body;

    if([fullname, email, username, username, password]
        .some(field => !field || String(field).trim() === "")
    ){
        throw new ApiError(400, "All fields are required");
    }
     const existedUser = await User.findOne({
        $or: [
            {username: username?.toLowerCase()},
            {email}
        ]
      })

 if(existedUser){
        throw new ApiError(409, "Username or email already exists");
      }
const avatarLocalPath = req.files?.avatar?.[0]?.path;
let coverImagePath = "";

if(
    req.files && 
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
){
    coverImagePath = req.files.coverImage[0].path;
}
const avatarUpload = await uploadOnCloudinary(avatarLocalPath);

if(!avatarUpload?.url){
    throw new ApiError(500, "Failed to upload avatar image");
}
const coverImageUpload = await uploadOnCloudinary(coverImagePath);

if(coverImagePath && !coverImageUpload?.url){
    throw new ApiError(500, "Failed to upload cover image");
}

const user = await User.create({
    fullname,
    avatar: avatarUpload.url,
    coverImage: coverImageUpload?.url || "",
    email,
    username: username.toLowerCase(),
    password
})

const createdUser = await User.findById(user._id).select("-password -refreshToken");

return res.status(201).json(
    new ApiResponse(
        201,
        createdUser,
        "User Created Successfully",

    )
)
});
const generateAccessTokenAndRefreshToken = async(user) =>{
    try{
        const currentUser = await User.findById(user._id)
        const accessToken = currentUser.generateAccessToken();
        const refreshToken =  currentUser.generateRefreshToken();

        currentUser.refreshToken = refreshToken;
        await currentUser.save({validateBeforeSave : false})
        return {accessToken, refreshToken}
    }catch(error){
        throw new ApiError(500, "Failed to generate tokens")
    }
}

const loginUser = asyncHandler(async(req,res) =>{
    const {email, username,password} = req.body;
    if(!email && !username){
        throw new ApiError(400, "Email or username is required")
    }
    const user = await User.findOne({
        $or: [{email},{username}]
    })
    if(!user){
        throw new ApiError(401, "User not found")
    }
    const isPasswordMatch = await user.isPasswordMatch(password)
    if(!isPasswordMatch){
        throw new ApiError(401,"Invalid password")
    }

    const {accessToken, refreshToken} = await generateAccessTokenAndRefreshToken(user)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,
                accessToken,
                refreshToken
            },
            "Login successful"
        )
    )
})

const refreshAccessToken = asyncHandler(async(req, res) =>{
   const incomingRefreshToken =  req.cookies.refreshToken || req.body.refreshToken

   if(!incomingRefreshToken){
     throw new ApiError(401, "Unauthorized, refresh token is required")
   }

   try{
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    const user = await User.findById(decodedToken?._id)

    if(!user || user.refreshToken !== incomingRefreshToken){
        throw new ApiError(401, "Unauthorized, invalid refresh token")
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    const {accessToken, refreshToken} = await generateAccessTokenAndRefreshToken(user)

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(
        200,
        {accessToken, refreshToken},
        "Access token refreshed successfully"
    ))

   }catch(error){
    throw new ApiError(401, "Unauthorized, invalid refresh token")
   }
})
const updatePassword = asyncHandler(async(req,res)=>{
    const {oldPassword, newPassword} = req.body

    const user = await User.findById(req.user._id)
    const isPasswordMatch = await user.isPasswordMatch(oldPassword)

     if(!isPasswordMatch){
        throw new ApiError(400, "Invalid old password")
     }

     user.password = newPassword
     await user.save({validateBeforeSave : false})

     return res.status(200).json(
            new ApiResponse(
        200,
        {},"Password updated successfully"
     )
     )

})

const getCurrentUser = asyncHandler(async(req,res)=>{
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            req.user,
            "Current user retrieved successfully"
        )
    )
})

const updateUserProfile = asyncHandler(async (req, res) => {
    const { fullname, username } = req.body;

    if (!fullname && !username) {
        throw new ApiError(
            400,
            "At least one field (fullname or username) is required"
        );
    }

    const updateData = {};

    if (fullname) updateData.fullname = fullname;
    if (username) updateData.username = username.toLowerCase();

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: updateData
        },
        { new: true }
    ).select("-password -refreshToken");

    return res.status(200).json(
        new ApiResponse(
            200,
            user,
            "User profile updated successfully"
        )
    );
});

const avatarUpdate = asyncHandler(async(req,res)=>{
    const avatarLocalPath = req.file?.path

    if(!avatarLocalPath){
         throw new ApiError(400, "Avatar image is required")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar?.url){
        throw new ApiError(500, "Failed to upload avatar image")
    }

  const user =   await User.findByIdAndUpdate(req.user._id,
    {
        $set:{
            avatar: avatar.url
        }
    },
    {new: true}
  ).select("-password")

    return res.status(200).json(
    new ApiResponse(
        200,
        user,
        "Avatar updated successfully"
    )
  )
})

const coverImageUpdate  = asyncHandler(async(req,res) =>{
    const coverImageLocalPath = req.file?.path

    if(!coverImageLocalPath){
         throw new ApiError(400, "Cover image is required")
    }
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!coverImage?.url){
        throw new ApiError(500, "Failed to upload cover image")
    }

  const user =   await User.findByIdAndUpdate(req.user._id,
    {
        $set:{
            coverImage: coverImage.url
        }
    },
    {new: true}
  ).select("-password")

    return res.status(200).json(
    new ApiResponse(
        200,
        user,
        "Cover image updated successfully"
    )
  )

})

export {
    registerUser,
    loginUser,
    refreshAccessToken, 
    updatePassword,
    getCurrentUser,
    updateUserProfile,
    avatarUpdate,
    coverImageUpdate
}