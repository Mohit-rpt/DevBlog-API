import asyncHandler from '../utils/asyncHandler.js';
import Post from '../models/post.model.js';
import ApiError from '../utils/ApiError.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import ApiResponse from '../utils/ApiResponse.js';
import mongoose from "mongoose";


const createPost = asyncHandler(async (req, res) => {
    
    const title = req.body.title?.trim();
    const content = req.body.content?.trim();
    const category = req.body.category?.trim();
    const tags = req.body.tags;

   if (
    !title ||
    !content
) {
    throw new ApiError(
        400,
        "Title and content are required"
    )
}

    const thumbnailPath = req.files?.thumbnail?.[0]?.path;
    const contentImageFiles = req.files?.contentImages || [];

    let thumbnailURL = "";

    if (thumbnailPath) {
        const uploadedThumbnail = await uploadOnCloudinary(thumbnailPath);

        if (!uploadedThumbnail) {
            throw new ApiError(500, "Thumbnail upload failed");
        }

       thumbnailURL = uploadedThumbnail?.secure_url || "";
    }

    let imageURLs = [];

    if (contentImageFiles.length > 0) {
       const uploadedImages = await Promise.allSettled(
                contentImageFiles.map(file =>
                     uploadOnCloudinary(file.path)
             )
            );

       imageURLs = uploadedImages
    .filter(result => result.status === "fulfilled" && result.value)
    .map(result => result.value.secure_url);
 }
   const post = await Post.create({
    title,
    content,
    author: req.user._id,
    thumbnail: thumbnailURL,
    contentImages: imageURLs,
    category,
   tags: Array.isArray(tags)
    ? tags
    : tags
        ? tags.split(",").map(tag => tag.trim())
        : []
});

    const createdPost = await Post.findById(post._id)
    .populate("author", "fullname username email avatar");

    return res.status(201).json(
        new ApiResponse(
            201,
            createdPost,
            "Post created successfully"
        )
    );
});

const getAllPosts = asyncHandler(async (req, res) => {
    let {
        page = 1,
        limit = 10,
        search = "",
        category = "",
        tag = "",
        sort = "newest"
    } = req.query;

    // Pagination
    const pageNumber = Math.max(parseInt(page) || 1, 1);
    const limitNumber = Math.min(Math.max(parseInt(limit) || 10, 1), 50);
    const skip = (pageNumber - 1) * limitNumber;

    // Remove extra spaces
    search = search.trim();
    category = category.trim();
    tag = tag.trim();

    // Build filter
    const filter = {};

    if (search) {
        filter.$or = [
            {
                title: {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                content: {
                    $regex: search,
                    $options: "i"
                }
            }
        ];
    }

    if (category) {
        filter.category = category;
    }

    if (tag) {
        filter.tags = tag;
    }

    // Sorting
    const sortOption =
        sort === "oldest"
            ? { createdAt: 1 }
            : { createdAt: -1 };

    // Execute queries together
    const [posts, totalPosts] = await Promise.all([
        Post.find(filter)
            .populate("author", "fullname username email avatar")
            .sort(sortOption)
            .skip(skip)
            .limit(limitNumber)
            .lean(),

        Post.countDocuments(filter)
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                posts,
                pagination: {
                    currentPage: pageNumber,
                    postsPerPage: limitNumber,
                    totalPosts,
                    totalPages: Math.ceil(totalPosts / limitNumber),
                    hasNextPage: skip + posts.length < totalPosts,
                    hasPreviousPage: pageNumber > 1
                }
            },
            "Posts fetched successfully"
        )
    );
});
const getSinglePost = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const post = await Post.findById(id)
        .populate("author", "fullname username email avatar")
        .lean();

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            post,
            "Post fetched successfully"
        )
    );
});


const updatePost = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, content, category, tags } = req.body;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid post ID");
    }

    // Find post
    const post = await Post.findById(id);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    // Authorization
    if (!post.author.equals(req.user._id)) {
        throw new ApiError(403, "You are not authorized to update this post");
    }

    // Update only provided fields
    if (title !== undefined) {
        post.title = title.trim();
    }

    if (content !== undefined) {
        post.content = content.trim();
    }

    if (category !== undefined) {
        post.category = category.trim();
    }

    if (tags !== undefined) {
        post.tags = tags;
    }

    await post.save();

    const updatedPost = await Post.findById(post._id)
        .populate("author", "fullname username email avatar")
        .lean();

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedPost,
            "Post updated successfully"
        )
    );
});

const deletePost = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid post ID");
    }

    // Find Post
    const post = await Post.findById(id);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    // Authorization
    if (!post.author.equals(req.user._id)) {
        throw new ApiError(
            403,
            "You are not authorized to delete this post"
        );
    }

    await post.deleteOne();

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Post deleted successfully"
        )
    );
});  
export default {
   createPost,
    getAllPosts,
    getSinglePost,
    updatePost,
    deletePost 
}
