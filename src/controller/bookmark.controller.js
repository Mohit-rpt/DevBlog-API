import asyncHandler from '../utils/asyncHandler.js';
import Bookmark from '../models/bookmark.model.js';
import Post from '../models/post.model.js';

import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

const toggleBookmark = asyncHandler(async(req,res)=>{
    const {postId} = req.params
    const postExists = await Post.findById(postId)

    if(!postExists){
        throw new ApiError(404,"Post not Found")
    }

    const existingBookmark =  await Bookmark.findOne(
        {
            owner:req.user._id,
            post:postId
        }
    )

    if(existingBookmark){
        await existingBookmark.deleteOne()

        return res.status(200).json(
            new ApiResponse(
                200,
                {},
                "Bookmark removed"
            )
        )
    }
    await Bookmark.create({
        owner:req.user._id,
        post:postId
    })

    return res.status(201).json(
        new ApiResponse(
            201,
            {},
            "Post Bookmarked"
        )
    )
})

const getBookmarkedPosts = asyncHandler(async(req,res)=>{
    const bookmarks = await Bookmark.find({
        owner:req.user._id
    })
    .populate({
        path:"post",
        populate:{
            path:"author",
            select:"fullname email"
        }
    })
    const posts = bookmarks.map(
        bookmark => bookmark.post
    )

    return res.status(200).json(
        new ApiResponse(
            200,
            posts,
            "Bookmarked posts fetched"
        )
    )
})

export default {
    toggleBookmark,
    getBookmarkedPosts
}