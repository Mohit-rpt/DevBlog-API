import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const SinglePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchPost();
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

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Thumbnail */}
        <img
          src={post.thumbnail}
          alt={post.title}
          className="w-full h-[450px] object-cover rounded-xl shadow-md"
        />

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
            <Link
                to={`/edit-post/${post._id}`}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
                Edit Post
            </Link>
          <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
              Delete Post
          </button>

          </div>

          <p className="text-gray-500">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>

        </div>

        {/* Content */}
        <div className="mt-10 text-lg leading-9 whitespace-pre-wrap text-gray-800">
          {post.content}
        </div>

      </div>
    </MainLayout>
  );
};

export default SinglePost;