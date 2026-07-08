import asyncHandler from '../utils/asyncHandler.js';
import Like from "../models/like.model.js"
import Post from '../models/post.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

const likePost = asyncHandler(async(req,res)=>{
    const { postId } = req.params
    const postExists = await Post.findById(postId)
    if(!postExists){
        throw new ApiError(400,"Post Not found")
    }
    const existingLike = await Like.findOne({
        owner:req.user._id,
        post:postId
    })
    if(existingLike){
        await existingLike.deleteOne()

        return res.status(200).json(
            new ApiResponse(
                200,
                {},
                "Like Removed"
            )
        )
    }
    await Like.create({
        owner:req.user._id,
        post:postId
    })

    return res.status(201,).json(
        new ApiResponse(
            201,
            {},
            "Post Liked"
        )
    )
})

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
        likes => likes.post
    )
        return res.status(200).json(

        new ApiResponse(
            200,
            posts,
            "Liked posts fetched"
        )

    )

})
export default{
    likePost,
    getLikedPosts
}