import express from "express";
import verifyJWT from "../middlewares/verifyJWT.middleware.js";
import postController from "../controller/post.controller.js";

const router = express.Router();

const { createPost,
    getAllPosts,
    getSinglePost,
    updatePost,
    deletePost } = postController;


router.post("/create",verifyJWT, createPost);
router.get("/all", getAllPosts);
router.get("/:id", getSinglePost);
router.put("/:id", verifyJWT, updatePost);
router.delete("/:id",verifyJWT, deletePost);

export default router;