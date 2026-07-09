import asyncHandler from '../utils/asyncHandler.js';
import Post from '../models/post.model.js';
import ApiError from '../utils/ApiError.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import ApiResponse from '../utils/ApiResponse.js';

const createPost = asyncHandler(async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        throw new ApiError(400, "Title and content are required");
    }

    const thumbnailPath = req.files?.thumbnail?.[0]?.path;
    const contentImageFiles = req.files?.contentImages || [];

    let thumbnailURL = "";

    if (thumbnailPath) {
        const uploadedThumbnail = await uploadOnCloudinary(thumbnailPath);

        if (!uploadedThumbnail) {
            throw new ApiError(500, "Thumbnail upload failed");
        }

        thumbnailURL = uploadedThumbnail.url;
    }

    let imageURLs = [];

    if (contentImageFiles.length > 0) {
        const uploadedImages = await Promise.all(
            contentImageFiles.map(file =>
                uploadOnCloudinary(file.path)
            )
        );

        imageURLs = uploadedImages.map(image => image.url);
    }

    const post = await Post.create({
        title,
        content,
        author: req.user._id,
        thumbnail: thumbnailURL,
        contentImages: imageURLs
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            post,
            "Post created successfully"
        )
    );
});

const getAllPosts = asyncHandler(async(req,res)=>{

    const {
        page = 1,
        limit = 10,
        search = "",
        category = "",
        tag = "",
        sort = "newest"
    } = req.query

    const pageNumber =Math.max(1,Number(page))

    const limitNumber = Math.max(1,Number(limit))

    const skip = (pageNumber - 1) *limitNumber

    const filter = {}

    if(search){
        filter.$or = [
            {
                title:{
                    $regex:search,
                    $options:"i"
                }
            },
            {
                content:{
                    $regex:search,
                    $options:"i"
                }
            }
        ]
    }

    if(category){
        filter.category = category
    }

    if(tag){
        filter.tags = tag
    }

    const sortOption =sort === "oldest"?{createdAt:1}:{createdAt:-1}
    
    const posts = await Post.find(filter)
                            .populate(
                                "author",
                                "fullname email"
                            )
                            .sort(sortOption)
                            .skip(skip)
                            .limit(limitNumber)



    const totalPosts = await Post.countDocuments(filter)

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                posts,
                currentPage:
                pageNumber,
                postsPerPage:
                limitNumber,
                totalPosts,
                totalPages: Math.ceil(totalPosts/limitNumber),
                hasNextPage: pageNumber*limitNumber < totalPosts,
                hasPreviousPage: pageNumber > 1
            },
            "Posts fetched successfully"
        )
    )

})
const getSinglePost = asyncHandler(async(req, res) =>{
    const post = await Post.findById(req.params.id).populate("author","username email")

    if(!post){
        throw new ApiError(404,"Post not found")
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            post,
            "Post fetched Successfully"
        )
    )
})

const updatePost = asyncHandler(async (req, res) => {

    const post = await Post.findById(req.params.id);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    if (post.author.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized");
    }

    const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedPost,
            "Post updated successfully"
        )
    );
});
const deletePost = asyncHandler(async (req, res) => {

    const post = await Post.findById(req.params.id);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    if (post.author.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized");
    }

    await post.deleteOne();

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
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
