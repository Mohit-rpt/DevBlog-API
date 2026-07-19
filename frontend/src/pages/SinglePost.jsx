import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Bookmark,
  SquarePen,
  Trash2,
  ArrowLeft,
} from "lucide-react";

const SinglePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likesCount, setLikesCount] = useState(0);
const [likedByUser, setLikedByUser] = useState(false);

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

  useEffect(() => {
    fetchPost();
    fetchLikes();
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
            alert("Post deleted successfully");
            navigate("/");
        }
    } catch (error) {

        console.log("DELETE ERROR:");
        console.log(error);
        console.log(error.response);
        console.log(error.message);
        

        alert("Failed to delete post.");

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

      </div>
   <div className="mt-12 border-t pt-8 flex justify-center">

  <div className="grid grid-cols-3 gap-4 w-fit">

    <button
  onClick={handleLike}
  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition ${
    likedByUser
      ? "bg-red-500 text-white"
      : "bg-pink-100 hover:bg-pink-200"
  }`}
>
  <Heart
    size={20}
    fill={likedByUser ? "currentColor" : "none"}
  />

  {likesCount} Like
</button>

    <button className="w-40 flex items-center justify-center gap-2 ...">
      <MessageCircle size={20} />
      Comment
    </button>

    <button className="w-40 flex items-center justify-center gap-2 ...">
      <Bookmark size={20} />
      Bookmark
    </button>

  </div>

</div>
    </MainLayout>
  );
};

export default SinglePost;