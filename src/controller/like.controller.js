import asyncHandler from '../utils/asyncHandler.js';
import Like from "../models/like.model.js"
import Post from '../models/post.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

import mongoose from "mongoose";

const likePost = asyncHandler(async (req, res) => {
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

    // Check existing like
    const existingLike = await Like.findOne({
        owner: req.user._id,
        post: postId
    });

    // Toggle Like
    if (existingLike) {
        await existingLike.deleteOne();

        return res.status(200).json(
            new ApiResponse(
                200,
                null,
                "Post unliked successfully"
            )
        );
    }

    await Like.create({
        owner: req.user._id,
        post: postId
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            null,
            "Post liked successfully"
        )
    );
});

const getLikedPosts = asyncHandler(async(req,res)=>{
    const likes = await Like.find({
        owner:req.user._id
    })
    .populate({
        path:"post",
        populate:{
            path:"author",
            select:"fullname email"
        }
    })
    const posts = likes.map(
        like => like.post
    )
        return res.status(200).json(

        new ApiResponse(
            200,
            posts,
            "Liked posts fetched"
        )

    )

})
const getPostLikes = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        throw new ApiError(400, "Invalid post id");
    }

    const likesCount = await Like.countDocuments({
        post: postId
    });

    const likedByUser = await Like.findOne({
        owner: req.user._id,
        post: postId
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                likesCount,
                likedByUser: !!likedByUser
            },
            "Likes fetched successfully"
        )
    );
});
export default{
    likePost,
    getLikedPosts,
    getPostLikes
}