import MainLayout from "../layouts/MainLayout.jsx";
import api from "../services/api.js";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("/posts/all");

        setPosts(response.data.data.posts);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

 return (
  <MainLayout>
    <div className="max-w-6xl mx-auto px-8 py-8">

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl px-10 py-8 mb-10 shadow-md">

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

          {/* Left */}
          <div className="flex items-center gap-6 flex-1">

            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              {user?.username?.charAt(0).toUpperCase()}
            </div>

            <div>

              <p className="text-3xl font-semibold">
                Hi,
              </p>

              <h1 className="text-5xl font-extrabold text-blue-600 uppercase">
                {user?.username}
              </h1>

              <p className="text-gray-600 mt-3 max-w-lg">
                Welcome back to{" "}
                <span className="font-semibold text-blue-600">
                  DevBlog
                </span>
                . Share your ideas, read inspiring blogs and connect with fellow developers.
              </p>

              <div className="flex gap-4 mt-6">

                <button
                  onClick={() => navigate("/create-post")}
                  className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition"
                >
                  ✍️ Create Post
                </button>

                <button
                  onClick={() =>
                    window.scrollTo({
                      top: 700,
                      behavior: "smooth",
                    })
                  }
                  className="border-2 border-blue-600 text-blue-600 px-5 py-3 rounded-xl hover:bg-blue-600 hover:text-white transition"
                >
                  📚 Explore Posts
                </button>

              </div>

            </div>

          </div>

          {/* Right */}
          <div className="hidden lg:flex">

            <div className="w-36 h-36 rounded-full bg-blue-100 flex items-center justify-center shadow-xl">

              <span className="text-6xl animate-bounce">
                🚀
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* Stats */}
      <div className="flex gap-6 mb-10">

        <div className="bg-white rounded-2xl shadow-md px-8 py-5">

          <p className="text-gray-500 text-sm">
            Total Posts
          </p>

          <h2 className="text-3xl font-bold">
            {posts.length}
          </h2>

        </div>

        <div className="bg-white rounded-2xl shadow-md px-8 py-5">

          <p className="text-gray-500 text-sm">
            Status
          </p>

          <h2 className="text-3xl font-bold text-blue-600">
            Active
          </h2>

        </div>

      </div>

      {/* Latest Posts */}
      <div className="flex justify-between items-center mb-8">

        <div>

          <h2 className="text-4xl font-bold">
            Latest Posts
          </h2>

          <p className="text-gray-500 mt-2">
            Discover the most recent blogs from our community.
          </p>

        </div>

        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 shadow-lg transition">
          View All Posts →
        </button>

      </div>

      {loading ? (

        <p className="text-center text-lg">
          Loading...
        </p>

      ) : posts.length === 0 ? (

        <div className="text-center py-20">

          <h2 className="text-3xl font-bold">
            No Posts Yet 📭
          </h2>

          <p className="text-gray-500 mt-3">
            Be the first one to publish a blog.
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

          {posts.map((post) => (

            <PostCard
              key={post._id}
              post={post}
            />

          ))}

        </div>

      )}

    </div>
  </MainLayout>
);
}
export default Home;
