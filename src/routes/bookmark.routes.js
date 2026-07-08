import express from "express";
import verifyJWT from "../middlewares/verifyJWT.middleware.js";
import bookmarkController from "../controller/bookmark.controller.js";

const router = express.Router();


const {   toggleBookmark,
    getBookmarkedPosts
} = bookmarkController;

router.post("/toggle/:postId", verifyJWT, toggleBookmark);
router.get("/bookmarkedPosts", verifyJWT, getBookmarkedPosts);

export default router;