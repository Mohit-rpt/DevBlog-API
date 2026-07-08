import jwt from 'jsonwebtoken';
import User from '../models/users.model.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

const verifyJWT = asyncHandler(async(req,res,next) => {
    const token = req.cookies?.accessToken

    if(!token){
        throw new ApiError(401, "Unauthorized, no token provided")
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodedToken._id).select("-password -refreshToken")
        if(!user){
            throw new ApiError(401, "Unauthorized, invalid token")
        }
        req.user = user
        next()
    
})

export default verifyJWT