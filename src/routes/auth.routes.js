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
    coverImageUpdate
} from "../controller/auth.controller.js";

const router = express.Router();

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


export default router;