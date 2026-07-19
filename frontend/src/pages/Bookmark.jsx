import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

const Bookmarks = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchBookmarks = async () => {
    try {
      const response = await api.get("/bookmarks/bookmarkedPosts");

      setPosts(response.data.data.posts);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto p-8">

        <h1 className="text-4xl font-bold mb-8">
          🔖 My Bookmarks
        </h1>

        {loading ? (

          <p>Loading...</p>

        ) : posts.length === 0 ? (

          <div className="text-center py-20">

            <h2 className="text-3xl font-bold">
              No Bookmarks Yet 📭
            </h2>

            <p className="text-gray-500 mt-3">
              Save posts to read them later.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

            {posts.map((post) => (

              <div
                key={post._id}
                onClick={() => navigate(`/post/${post._id}`)}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer overflow-hidden"
              >

                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full h-52 object-cover"
                />

                <div className="p-5">

                  <h2 className="text-xl font-bold line-clamp-2">
                    {post.title}
                  </h2>

                  <p className="text-gray-500 mt-2 line-clamp-3">
                    {post.content}
                  </p>

                  <div className="mt-4 flex items-center gap-3">

                    <img
                      src={post.author.avatar}
                      alt={post.author.fullname}
                      className="w-10 h-10 rounded-full"
                    />

                    <div>

                      <p className="font-semibold">
                        {post.author.fullname}
                      </p>

                      <p className="text-sm text-gray-500">
                        @{post.author.username}
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>
    </MainLayout>
  );
};

export default Bookmarks;