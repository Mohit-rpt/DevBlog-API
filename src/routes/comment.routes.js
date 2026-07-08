import express from "express";
import verifyJWT from "../middlewares/verifyJWT.middleware.js";
import commentController from "../controller/comment.controller.js";

const router = express.Router();

const {
    addComment,
    getComment,
    updateComment,
    deleteComment
}   =  commentController;


router.post("/add/:postId", verifyJWT, addComment)
router.get("/get/:postId", getComment)
router.put("/update/:commentId", verifyJWT, updateComment)
router.delete("/delete/:commentId", verifyJWT, deleteComment)

export default router;