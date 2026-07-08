import asyncHandler from '../utils/asyncHandler.js';
import Comment from '../models/comment.model.js';
import Post from '../models/post.model.js';

import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';


const addComment = asyncHandler(async(req,res)=>{
        const {content} = req.body
        const {postId} = req.params

        if(!content){
            throw new ApiError(400,"Comment content required")
        }

        const postExists = await Post.findById(postId)

        if(!postExists){
            throw new ApiError(400,"Post didnot exists")
        }

        const comment = await Comment.create({
            content,
            owner: req.user._id,
            post: postId
        })

        return res.status(200).json(
            new ApiResponse(
                200,
                comment,
                "Comment Added Successfully"
            )
        )
})

const getComment = asyncHandler(async(req,res) =>{
    const  {postId} = req.params

    const comment = await Comment.find({
        post:postId
    })
    .populate("owner","fullname email")
    .sort({createdAt:-1})

    return res.status(200).json(
        new ApiResponse(
            200,
            comment,
            "comment fetched successfully"
        )
    )

})

const updateComment = asyncHandler(async(req,res)=>{

    const {content} = req.body
    const {commentId} = req.params

    const comment = await Comment.findById(commentId)

    if(!comment){
        throw new ApiError(400,"comment not Found")
    }
    if(comment.owner.toString() !== req.user._id.toString()){
        throw new ApiError(
            403,
            "Unauthorized"
        )
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            content
        },
        {
            new:true,
            runValidator:true
        }
    )
    return res.status(200).json(
        new ApiResponse(
            200,
            updatedComment,
            "Comment Updated Successfully"
        )
    )
})

const deleteComment = asyncHandler(async(req,res)=>{
    const {commentId} = req.params

   const comment = await Comment.findById(commentId)

   if(!comment){
    throw new ApiError(400," comment not found")
   }
   if(comment.owner.toString !== req.user._id.toString()){
    throw new ApiError(400,"Unauthorized")
   }
    await Comment.deleteOne()

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Comment Deleted Successfully"
        )
    )
})

export default {
    addComment,
    getComment,
    updateComment,
    deleteComment
}