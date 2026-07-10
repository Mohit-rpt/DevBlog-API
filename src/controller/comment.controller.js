import asyncHandler from '../utils/asyncHandler.js';
import Comment from '../models/comment.model.js';
import Post from '../models/post.model.js';

import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import mongoose from "mongoose";

const addComment = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const content = req.body.content?.trim();

    // Validate Post ID
    if (!mongoose.Types.ObjectId.isValid(postId)) {
        throw new ApiError(400, "Invalid post ID");
    }

    // Validate Content
    if (!content) {
        throw new ApiError(400, "Comment content is required");
    }

    // Check if post exists
    const post = await Post.findById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    // Create comment
    const comment = await Comment.create({
        content,
        owner: req.user._id,
        post: postId
    });

    // Populate owner details
    const createdComment = await Comment.findById(comment._id)
        .populate("owner", "fullname username email avatar")
        .lean();

    return res.status(201).json(
        new ApiResponse(
            201,
            createdComment,
            "Comment added successfully"
        )
    );
});

const getComment = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    // Validate Post ID
    if (!mongoose.Types.ObjectId.isValid(postId)) {
        throw new ApiError(400, "Invalid post ID");
    }

    // Check if post exists
    const post = await Post.findById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    // Fetch comments
    const comments = await Comment.find({ post: postId })
        .populate("owner", "fullname username email avatar")
        .sort({ createdAt: -1 })
        .lean();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                totalComments: comments.length,
                comments
            },
            "Comments fetched successfully"
        )
    );
});

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const content = req.body.content?.trim();

    // Validate Comment ID
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    // Validate Content
    if (!content) {
        throw new ApiError(400, "Comment content is required");
    }

    // Find Comment
    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    // Authorization
    if (!comment.owner.equals(req.user._id)) {
        throw new ApiError(
            403,
            "You are not authorized to update this comment"
        );
    }

    // Update
    comment.content = content;
    await comment.save();

    const updatedComment = await Comment.findById(comment._id)
        .populate("owner", "fullname username email avatar")
        .lean();

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedComment,
            "Comment updated successfully"
        )
    );
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    // Validate Comment ID
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    // Find Comment
    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    // Authorization
    if (!comment.owner.equals(req.user._id)) {
        throw new ApiError(
            403,
            "You are not authorized to delete this comment"
        );
    }

    // Delete Comment
    await comment.deleteOne();

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Comment deleted successfully"
        )
    );
});

export default {
    addComment,
    getComment,
    updateComment,
    deleteComment
}