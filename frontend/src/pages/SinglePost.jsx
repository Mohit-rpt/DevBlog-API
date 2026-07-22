import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Bookmark,
  Heart,
  MessageCircle,
  Send,
  SquarePen,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import AuthContext from "../context/AuthContext";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingPost, setDeletingPost] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);

  const fetchPost = async () => {
    try {
      const response = await api.get(`/posts/${id}`);
      setPost(response.data.data);
    } catch (error) {
      console.error(error);
      setPost(null);
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
      setBookmarked(bookmarkedPosts.some((item) => item._id === id));
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

  const handleDelete = async () => {
    try {
      setDeletingPost(true);

      const response = await api.delete(`/posts/${id}`);

      if (response.data?.success) {
        toast.success("Post deleted successfully 🗑️");
        navigate("/");
        return;
      }

      toast.error(response.data?.message || "Failed to delete post");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete post");
    } finally {
      setDeletingPost(false);
      setShowDeleteModal(false);
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
    try {
      setDeletingCommentId(commentId);
      await api.delete(`/comments/delete/${commentId}`);
      fetchComments();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete comment");
    } finally {
      setDeletingCommentId(null);
    }
  };

  const isPostOwner =
    user?._id && post?.author?._id && user._id === post.author._id;

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

        <h1 className="text-5xl font-bold mt-8 leading-tight">{post.title}</h1>

        <div className="flex items-start justify-between mt-8 border-b pb-6 gap-6">
          <div className="flex items-center gap-4">
            <img
              src={post.author.avatar}
              alt={post.author.fullname}
              className="w-14 h-14 rounded-full object-cover"
            />

            <div>
              <p className="font-semibold text-lg">{post.author.fullname}</p>
              <p className="text-gray-500 text-sm">@{post.author.username}</p>
              <p className="text-gray-500 text-sm">{post.author.email}</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>

            {isPostOwner ? (
              <div className="flex gap-3 mt-4 justify-end">
                <Link
                  to={`/edit-post/${post._id}`}
                  className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg transition"
                >
                  <SquarePen size={18} />
                  Edit
                </Link>

                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-10 bg-white rounded-2xl shadow-md p-8 text-lg leading-9 whitespace-pre-wrap text-gray-800">
          {post.content}
        </div>

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
              <Heart size={20} fill={likedByUser ? "currentColor" : "none"} />
              <span>{likesCount}</span>
            </button>

            <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-200 transition">
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
              <Bookmark size={20} fill={bookmarked ? "currentColor" : "none"} />
              <span>{bookmarked ? "Saved" : "Bookmark"}</span>
            </button>
          </div>
        </div>

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

        <div className="mt-10 space-y-6">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="bg-white rounded-2xl shadow-md p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <img
                    src={comment.owner.avatar}
                    alt={comment.owner.fullname}
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  <div>
                    <h3 className="font-semibold">{comment.owner.fullname}</h3>
                    <p className="text-gray-500 text-sm">
                      @{comment.owner.username}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {user?._id === comment.owner._id ? (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    disabled={deletingCommentId === comment._id}
                    className="text-red-500 hover:text-red-700 transition text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingCommentId === comment._id
                      ? "Deleting..."
                      : "🗑 Delete"}
                  </button>
                ) : null}
              </div>

              <p className="mt-5 text-gray-700 leading-8 text-[17px]">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      </div>

      {showDeleteModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !deletingPost && setShowDeleteModal(false)}
          />

          <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
              <Trash2 size={28} />
            </div>

            <h3 className="text-center text-2xl font-bold text-gray-900">
              Delete this post?
            </h3>

            <p className="mt-3 text-center text-gray-500">
              This action cannot be undone. The post will be removed
              permanently.
            </p>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={deletingPost}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deletingPost}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingPost ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </MainLayout>
  );
};

export default SinglePost;
