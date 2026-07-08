import express from "express";
import verifyJWT from "../middlewares/verifyJWT.middleware.js";
import likeController from "../controller/like.controller.js";

const router = express.Router();

const {likePost,
    getLikedPosts} = likeController;

router.post("/like/:postId", verifyJWT, likePost);
router.get("/likedPosts", verifyJWT, getLikedPosts);

export default router;
