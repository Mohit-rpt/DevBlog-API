import jwt from "jsonwebtoken";
import User from "../models/users.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
    
   console.log("===== VERIFY JWT =====");
    console.log("Cookies:", req.cookies);
    console.log("Cookie Header:", req.headers.cookie);

    const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(401, "Unauthorized, no token provided");
    }

   let decodedToken;

try {

    decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET
    );

} catch (error) {

    throw new ApiError(
        401,
        "Access token expired or invalid"
    );

}

    const user = await User.findById(decodedToken._id)
        .select("-password -refreshToken");

    if (!user) {
        throw new ApiError(401, "Unauthorized, invalid token");
    }

    req.user = user;

    next();
});

export default verifyJWT;