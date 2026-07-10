import asyncHandler from '../utils/asyncHandler.js';
import Bookmark from '../models/bookmark.model.js';
import Post from '../models/post.model.js';

import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

import mongoose from "mongoose";

const toggleBookmark = asyncHandler(async (req, res) => {
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

    // Check existing bookmark
    const existingBookmark = await Bookmark.findOne({
        owner: req.user._id,
        post: postId
    });

    // Toggle bookmark
    if (existingBookmark) {
        await existingBookmark.deleteOne();

        return res.status(200).json(
            new ApiResponse(
                200,
                null,
                "Bookmark removed successfully"
            )
        );
    }

    await Bookmark.create({
        owner: req.user._id,
        post: postId
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            null,
            "Post bookmarked successfully"
        )
    );
});

const getBookmarkedPosts = asyncHandler(async (req, res) => {
    const bookmarks = await Bookmark.find({
        owner: req.user._id
    })
        .sort({ createdAt: -1 })
        .populate({
            path: "post",
            populate: {
                path: "author",
                select: "fullname username email avatar"
            }
        })
        .lean();

    const posts = bookmarks
        .map(bookmark => bookmark.post)
        .filter(post => post);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                totalBookmarkedPosts: posts.length,
                posts
            },
            "Bookmarked posts fetched successfully"
        )
    );
});

export default {
    toggleBookmark,
    getBookmarkedPosts
}