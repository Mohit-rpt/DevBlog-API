import express from "express";
import verifyJWT from "../middlewares/verifyJWT.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

import {
    registerUser,
    loginUser,
    refreshAccessToken,
    updatePassword,
    getCurrentUser,
    updateUserProfile,
    avatarUpdate,
    coverImageUpdate,
    logoutUser
} from "../controller/auth.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with avatar and optional cover image.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - fullname
 *               - username
 *               - email
 *               - password
 *               - avatar
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: Mohit Rajput
 *               username:
 *                 type: string
 *                 example: mohit
 *               email:
 *                 type: string
 *                 example: mohit@gmail.com
 *               password:
 *                 type: string
 *                 example: Mohit@123
 *               avatar:
 *                 type: string
 *                 format: binary
 *               coverImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: User already exists
 */
router.post(
    "/register",
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

router.post("/login", loginUser)

router.post("/refreshAccessToken", refreshAccessToken)

router.patch("/updatePassword", verifyJWT, updatePassword)
router.get("/getCurrentUser", verifyJWT, getCurrentUser)
router.patch("/updateProfile", verifyJWT, updateUserProfile)
router.patch(
    "/avatarUpdate",
    verifyJWT,
    upload.single("avatar"),
    avatarUpdate
)
router.patch(
    "/coverImageUpdate",
    verifyJWT,
    upload.single("coverImage"),
    coverImageUpdate
)
router.post("/logout", verifyJWT, logoutUser);


export default router;