import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import {
  Heart,
  MessageCircle,
  Bookmark,
  SquarePen,
  Trash2,
  ArrowLeft,
  Send,
} from "lucide-react";

const SinglePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likesCount, setLikesCount] = useState(0);
const [likedByUser, setLikedByUser] = useState(false);
const [comments, setComments] = useState([]);
const [commentText, setCommentText] = useState("");
const [totalComments, setTotalComments] = useState(0);
const [bookmarked, setBookmarked] = useState(false);

  const fetchPost = async () => {
    try {
      const response = await api.get(`/posts/${id}`);
      setPost(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const fetchLikes = async () => {
  try {
    const response = await api.get(`/likes/like/${id}`);

    setLikesCount(response.data.data.likesCount);
    setLikedByUser(response.data.data.likedByUser);

  } catch (error) {
    console.error(error);
  }
};
const fetchComments = async () => {
  try {

    const response = await api.get(`/comments/get/${id}`);

    setComments(response.data.data.comments);
    setTotalComments(response.data.data.totalComments);

  } catch (error) {

    console.error(error);

  }
};
const fetchBookmarks = async () => {
  try {
    const response = await api.get("/bookmarks/bookmarkedPosts");

    const bookmarkedPosts = response.data.data.posts;

    const isBookmarked = bookmarkedPosts.some(
      (post) => post._id === id
    );

    setBookmarked(isBookmarked);

  } catch (error) {
    console.error(error);
  }
};

  useEffect(() => {
    fetchPost();
    fetchLikes();
    fetchComments();
    fetchBookmarks();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto p-6">
          <h2 className="text-center text-xl font-semibold">Loading...</h2>
        </div>
      </MainLayout>
    );
  }

  if (!post) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto p-6">
          <h2 className="text-center text-xl font-semibold text-red-500">
            Post not found
          </h2>
        </div>
      </MainLayout>
    );
  }

 const handleDelete = async () => {

    const confirmDelete = window.confirm(
        "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await api.delete(`/posts/${id}`);

        console.log(response.data);
        if(response.data.success){
            toast.success("Post deleted successfully 🗑️");
            navigate("/");
        }
    } catch (error) {

        console.log("DELETE ERROR:");
        console.log(error);
        console.log(error.response);
        console.log(error.message);
        

        toast.error("Failed to delete post");

    }

};
const handleLike = async () => {
  try {

    await api.post(`/likes/like/${id}`);

    fetchLikes();

  } catch (error) {

    console.error(error);

  }
};
const handleBookmark = async () => {
  try {

    await api.post(`/bookmarks/toggle/${id}`);

    fetchBookmarks();

  } catch (error) {

    console.error(error);

  }
};

const handleComment = async () => {

    if (!commentText.trim()) {
        return;
    }

    try {

        await api.post(`/comments/add/${id}`, {
            content: commentText,
        });

        setCommentText("");

        fetchComments();

    } catch (error) {

        console.error(error);

    }

};
const handleDeleteComment = async (commentId) => {

    const confirmDelete = window.confirm(
        "Delete this comment?"
    );

    if (!confirmDelete) return;

    try {

        await api.delete(`/comments/delete/${commentId}`);

        fetchComments();

    } catch (error) {

        console.error(error);

        toast.error("Failed to delete post");

    }

};

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-6 py-10">
          <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-5 py-2 rounded-lg transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>
        {/* Thumbnail */}
        <img
          src={post.thumbnail}
          alt={post.title}
          className="w-full h-[450px] object-cover rounded-xl shadow-md"
        />

        <div className="mt-8">
        <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
          {post.category}
        </span>
      </div>

        {/* Title */}
        <h1 className="text-5xl font-bold mt-8 leading-tight">
          {post.title}
        </h1>

        {/* Author */}
        <div className="flex items-center justify-between mt-8 border-b pb-6">

          <div className="flex items-center gap-4">

            <img
              src={post.author.avatar}
              alt={post.author.fullname}
              className="w-14 h-14 rounded-full object-cover"
            />

            <div>
              <p className="font-semibold text-lg">
                {post.author.fullname}
              </p>

              <p className="text-gray-500 text-sm">
                @{post.author.username}
              </p>

              <p className="text-gray-500 text-sm">
                {post.author.email}
              </p>
            </div>
           
          </div>

          <p className="text-gray-500">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        <div className="flex gap-3 mt-4">

            <Link
              to={`/edit-post/${post._id}`}
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg transition"
            >
              <SquarePen size={18} />
              Edit
            </Link>

            <button
              onClick={handleDelete}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition"
            >
              <Trash2 size={18} />
              Delete
            </button>

          </div>

        </div>

       {/* Content */}
<div className="mt-10 bg-white rounded-2xl shadow-md p-8 text-lg leading-9 whitespace-pre-wrap text-gray-800">
    {post.content}
</div>

{/* Action Buttons */}
<div className="mt-10 border-t pt-8 flex justify-center">

    <div className="flex flex-wrap gap-4">

        <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl transition ${
                likedByUser
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-red-100 text-red-600 hover:bg-red-200"
            }`}
        >
            <Heart
                size={20}
                fill={likedByUser ? "currentColor" : "none"}
            />

            <span>{likesCount}</span>
        </button>

        <button
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
        >
            <MessageCircle size={20} />

            <span>{totalComments}</span>
        </button>

       <button
    onClick={handleBookmark}
    className={`flex items-center gap-2 px-5 py-3 rounded-xl transition ${
        bookmarked
            ? "bg-yellow-500 text-white hover:bg-yellow-600"
            : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
    }`}
>
    <Bookmark
        size={20}
        fill={bookmarked ? "currentColor" : "none"}
    />

    <span>
        {bookmarked ? "Saved" : "Bookmark"}
    </span>

</button>

    </div>

</div>

{/* Comment Box */}

<div className="mt-14">

    <h2 className="text-3xl font-bold mb-6">
        Comments ({totalComments})
    </h2>

    <div className="bg-white rounded-2xl shadow-md p-6">

        <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write your thoughts..."
            className="w-full border-2 border-gray-200 rounded-xl p-4 resize-none focus:border-blue-500 focus:outline-none transition"
            rows={4}
        />

       <button
        onClick={handleComment}
        className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-lg"
    >
        <Send size={18} />
        Post Comment
    </button>

    </div>

</div>

{/* All Comments */}

<div className="mt-10 space-y-6">

    {comments.map((comment) => (

        <div
            key={comment._id}
            className="bg-white rounded-2xl shadow-md p-6"
        >

           <div className="flex items-start justify-between">


    <img
        src={comment.owner.avatar}
        alt={comment.owner.fullname}
        className="w-12 h-12 rounded-full object-cover"
    />

    <div>

        <h3 className="font-semibold">
            {comment.owner.fullname}
        </h3>

        <p className="text-gray-500 text-sm">
            @{comment.owner.username}
        </p>

        <p className="text-xs text-gray-400 mt-1">
            {new Date(comment.createdAt).toLocaleDateString()}
        </p>

    </div>

</div>

{user?._id === comment.owner._id && (
    <button
        onClick={() => handleDeleteComment(comment._id)}
        className="text-red-500 hover:text-red-700 transition"
    >
        🗑 Delete
    </button>
)}
            <p className="mt-5 text-gray-700 leading-8 text-[17px]">
                {comment.content}
            </p>

        </div>

    ))}

    </div>
    </div>
    </MainLayout>
  );
};

export default SinglePost;