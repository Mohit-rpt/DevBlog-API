import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/users.model.js';
import ApiError from '../utils/ApiError.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import ApiResponse from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async (req, res) => {
    let { fullname, email, username, password } = req.body;

    // Trim input
    fullname = fullname?.trim();
    email = email?.trim().toLowerCase();
    username = username?.trim().toLowerCase();
    password = password?.trim();

    // Validate required fields
    if ([fullname, email, username, password].some(field => !field)) {
        throw new ApiError(400, "All fields are required");
    }

    // Check existing user
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "Username or email already exists");
    }

    // Avatar
    const avatarPath = req.files?.avatar?.[0]?.path;

    if (!avatarPath) {
        throw new ApiError(400, "Avatar image is required");
    }

    // Cover Image
    const coverImagePath =
        req.files?.coverImage?.[0]?.path || "";

    // Upload Images
    const avatarUpload =
        await uploadOnCloudinary(avatarPath);

    if (!avatarUpload?.secure_url) {
        throw new ApiError(
            500,
            "Failed to upload avatar"
        );
    }

    let coverImageURL = "";

    if (coverImagePath) {
        const coverUpload =
            await uploadOnCloudinary(
                coverImagePath
            );

        coverImageURL =
            coverUpload?.secure_url || "";
    }

    // Create User
    const user = await User.create({
        fullname,
        email,
        username,
        password,
        avatar: avatarUpload.secure_url,
        coverImage: coverImageURL
    });

    // Fetch Created User
    const createdUser = await User.findById(user._id)
        .select("-password -refreshToken")
        .lean();

    return res.status(201).json(
        new ApiResponse(
            201,
            createdUser,
            "User created successfully"
        )
    );
});
const generateAccessTokenAndRefreshToken = async (user) => {
    try {
        const currentUser = await User.findById(user._id);

        if (!currentUser) {
            throw new ApiError(404, "User not found");
        }

        const accessToken = currentUser.generateAccessToken();
        const refreshToken = currentUser.generateRefreshToken();

        currentUser.refreshToken = refreshToken;

        await currentUser.save({
            validateBeforeSave: false
        });

        return {
            accessToken,
            refreshToken
        };

    } catch (error) {
        throw new ApiError(
            500,
            error.message || "Failed to generate tokens"
        );
    }
};

const loginUser = asyncHandler(async (req, res) => {
    let { email, username, password } = req.body;

    // Trim input
    email = email?.trim().toLowerCase();
    username = username?.trim().toLowerCase();
    password = password?.trim();

    // Validation
    if (!email && !username) {
        throw new ApiError(
            400,
            "Email or username is required"
        );
    }

    if (!password) {
        throw new ApiError(
            400,
            "Password is required"
        );
    }

    // Find user
    const user = await User.findOne({
        $or: [
            { email },
            { username }
        ]
    });

    if (!user) {
        throw new ApiError(
            401,
            "Invalid email/username or password"
        );
    }

    // Verify password
    const isPasswordMatch =
        await user.isPasswordMatch(password);

    if (!isPasswordMatch) {
        throw new ApiError(
            401,
            "Invalid email/username or password"
        );
    }

    // Generate tokens
    const { accessToken, refreshToken } =
        await generateAccessTokenAndRefreshToken(user);

    const loggedInUser = await User.findById(user._id)
        .select("-password -refreshToken")
        .lean();

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    };

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
        );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(
            401,
            "Refresh token is required"
        );
    }

    try {
        // Verify Token
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        // Find User
        const user = await User.findById(decodedToken._id);

        if (!user) {
            throw new ApiError(
                404,
                "User not found"
            );
        }

        // Validate Stored Refresh Token
        if (user.refreshToken !== incomingRefreshToken) {
            throw new ApiError(
                401,
                "Invalid refresh token"
            );
        }

        // Generate New Tokens
        const {
            accessToken,
            refreshToken
        } = await generateAccessTokenAndRefreshToken(user);

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken,
                        refreshToken
                    },
                    "Access token refreshed successfully"
                )
            );

    } catch (error) {
        throw new ApiError(
            401,
            "Invalid or expired refresh token"
        );
    }
});
const updatePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    // Validate input
    if (!oldPassword?.trim() || !newPassword?.trim()) {
        throw new ApiError(
            400,
            "Old password and new password are required"
        );
    }

    // Find user
    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    // Verify old password
    const isPasswordMatch = await user.isPasswordMatch(oldPassword);

    if (!isPasswordMatch) {
        throw new ApiError(
            401,
            "Invalid old password"
        );
    }

    // Prevent same password
    if (oldPassword === newPassword) {
        throw new ApiError(
            400,
            "New password must be different from the old password"
        );
    }

    // Update password
    user.password = newPassword.trim();

    await user.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Password updated successfully"
        )
    );
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(
            200,
            req.user,
            "Current user fetched successfully"
        )
    );
});

const updateUserProfile = asyncHandler(async (req, res) => {
    let { fullname, username } = req.body;

    fullname = fullname?.trim();
    username = username?.trim().toLowerCase();

    if (!fullname && !username) {
        throw new ApiError(
            400,
            "At least one field (fullname or username) is required"
        );
    }

    // Check username availability
    if (username) {
        const existingUser = await User.findOne({
            username,
            _id: { $ne: req.user._id }
        });

        if (existingUser) {
            throw new ApiError(
                409,
                "Username already exists"
            );
        }
    }

    const updateData = {};

    if (fullname) {
        updateData.fullname = fullname;
    }

    if (username) {
        updateData.username = username;
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: updateData
        },
        {
            new: true,
            runValidators: true
        }
    )
        .select("-password -refreshToken")
        .lean();

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedUser,
            "Profile updated successfully"
        )
    );
});

const avatarUpdate = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    // Validate avatar
    if (!avatarLocalPath) {
        throw new ApiError(
            400,
            "Avatar image is required"
        );
    }

    // Upload to Cloudinary
    const uploadedAvatar =
        await uploadOnCloudinary(avatarLocalPath);

    if (!uploadedAvatar?.secure_url) {
        throw new ApiError(
            500,
            "Failed to upload avatar image"
        );
    }

    // Update user
    const updatedUser =
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    avatar: uploadedAvatar.secure_url
                }
            },
            {
                new: true,
                runValidators: true
            }
        )
            .select("-password -refreshToken")
            .lean();

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedUser,
            "Avatar updated successfully"
        )
    );
});

const coverImageUpdate = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path;

    // Validate cover image
    if (!coverImageLocalPath) {
        throw new ApiError(
            400,
            "Cover image is required"
        );
    }

    // Upload to Cloudinary
    const uploadedCoverImage =
        await uploadOnCloudinary(coverImageLocalPath);

    if (!uploadedCoverImage?.secure_url) {
        throw new ApiError(
            500,
            "Failed to upload cover image"
        );
    }

    // Update user
    const updatedUser =
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    coverImage:
                        uploadedCoverImage.secure_url
                }
            },
            {
                new: true,
                runValidators: true
            }
        )
            .select("-password -refreshToken")
            .lean();

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedUser,
            "Cover image updated successfully"
        )
    );
});

const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        }
    );

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                null,
                "Logged out successfully"
            )
        );
});

export {
    registerUser,
    loginUser,
    refreshAccessToken, 
    updatePassword,
    getCurrentUser,
    updateUserProfile,
    avatarUpdate,
    coverImageUpdate,
    logoutUser
}