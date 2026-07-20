import MainLayout from "../layouts/MainLayout";
import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

import {
  FileText,
  Image,
  Tag,
  Folder,
  PenSquare,
  UploadCloud,
  Save,
  X,
} from "lucide-react";

const EditPost = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);

  const [currentThumbnail, setCurrentThumbnail] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
    thumbnail: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/posts/${id}`);

        const post = response.data.data;

        setCurrentThumbnail(post.thumbnail);

        setFormData({
          title: post.title,
          content: post.content,
          category: post.category,
          tags: post.tags.join(", "),
          thumbnail: null,
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.put(`/posts/${id}`, {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim()),
      });

      toast.success("Post updated successfully! ✨");

      navigate(`/post/${id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Hero */}

        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-3xl p-10 text-white shadow-xl mb-10">

          <div className="flex items-center gap-6">

            <div className="bg-white/20 p-5 rounded-2xl">

              <PenSquare size={42} />

            </div>

            <div>

              <h1 className="text-5xl font-bold">
                Edit Your Post
              </h1>

              <p className="mt-3 text-orange-100 text-lg">
                Keep your article fresh and up-to-date.
              </p>

            </div>

          </div>

        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl p-10 space-y-8"
        >

          {/* Title */}

          <div>

            <label className="flex items-center gap-2 font-semibold mb-3">

              <FileText size={20} />

              Post Title

            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 rounded-xl p-4 focus:outline-none focus:border-orange-500 transition"
            />

          </div>

          {/* Category */}

          <div>

            <label className="flex items-center gap-2 font-semibold mb-3">

              <Folder size={20} />

              Category

            </label>

            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 rounded-xl p-4 focus:outline-none focus:border-orange-500 transition"
            />

          </div>

          {/* Tags */}

          <div>

            <label className="flex items-center gap-2 font-semibold mb-3">

              <Tag size={20} />

              Tags

            </label>

            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 rounded-xl p-4 focus:outline-none focus:border-orange-500 transition"
            />

          </div>

          {/* Current Thumbnail */}

          <div>

            <label className="flex items-center gap-2 font-semibold mb-4">

              <Image size={20} />

              Current Thumbnail

            </label>

            <img
              src={
                formData.thumbnail
                  ? URL.createObjectURL(formData.thumbnail)
                  : currentThumbnail
              }
              alt="Thumbnail"
              className="w-full h-72 object-cover rounded-2xl shadow-md"
            />

          </div>

          {/* Upload New Thumbnail */}

          <div>

            <label className="flex items-center gap-2 font-semibold mb-4">

              <UploadCloud size={20} />

              Change Thumbnail

            </label>

            <label className="border-2 border-dashed border-orange-300 rounded-2xl p-10 flex flex-col items-center cursor-pointer hover:bg-orange-50 transition">

              <UploadCloud
                size={55}
                className="text-orange-500"
              />

              <p className="mt-4 font-semibold">
                Click to choose another image
              </p>

              <input
                type="file"
                name="thumbnail"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />

            </label>

          </div>

                      {/* Content */}

          <div>

            <label className="flex items-center gap-2 font-semibold mb-3">

              <PenSquare size={20} />

              Blog Content

            </label>

            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={14}
              placeholder="Update your blog..."
              className="w-full border-2 border-gray-200 rounded-2xl p-5 focus:outline-none focus:border-orange-500 transition resize-none leading-8"
            />

          </div>

          {/* Tips */}

          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">

            <h3 className="font-bold text-orange-700 mb-3">

              ✨ Editing Tips

            </h3>

            <ul className="space-y-2 text-gray-600">

              <li>• Make your title more engaging.</li>

              <li>• Keep paragraphs short for better readability.</li>

              <li>• Update tags if your article topic changes.</li>

              <li>• Change the thumbnail only if necessary.</li>

            </ul>

          </div>

          {/* Buttons */}

          <div className="flex justify-end gap-4 pt-4">

            <button
              type="button"
              onClick={() => navigate(`/post/${id}`)}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-gray-300 font-semibold hover:bg-gray-100 transition"
            >
              <X size={20} />
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-10 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all disabled:opacity-60 disabled:hover:scale-100"
            >

              {loading ? (

                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="white"
                      strokeWidth="4"
                      opacity="0.25"
                    />

                    <path
                      fill="white"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />

                  </svg>

                  Saving...

                </>

              ) : (

                <>
                  <Save size={20} />
                  Save Changes
                </>

              )}

            </button>

          </div>

        </form>

      </div>

    </MainLayout>
  );
};

export default EditPost;