import MainLayout from "../layouts/MainLayout";
import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

import {
  FileText,
  Image,
  Tag,
  Folder,
  PenSquare,
  UploadCloud,
} from "lucide-react";

const CreatePost = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
    thumbnail: null,
  });

  const handleChange = (e) => {
  const { name, value, files } = e.target;

  if (files) {
    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));
 

    if (name === "thumbnail") {
      setPreview(URL.createObjectURL(files[0]));
    }

    return;
  }

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Title is required");
      return;
    }

    if (!formData.content.trim()) {
      alert("Content is required");
      return;
    }

    if (!formData.category.trim()) {
      alert("Category is required");
      return;
    }

    if (!formData.thumbnail) {
      alert("Thumbnail is required");
      return;
    }

    try {
      setLoading(true);

      const postData = new FormData();

      postData.append("title", formData.title);
      postData.append("content", formData.content);
      postData.append("category", formData.category);

      formData.tags.split(",").forEach((tag) => {
        postData.append("tags", tag.trim());
      });

      postData.append("thumbnail", formData.thumbnail);

      await api.post("/posts/create", postData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Post created successfully! 🚀");
      navigate("/");

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Hero */}

        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-10 text-white shadow-xl mb-10">

          <div className="flex items-center gap-6">

            <div className="bg-white/20 p-5 rounded-2xl">

              <PenSquare size={42} />

            </div>

            <div>

              <h1 className="text-5xl font-bold">
                Create New Post
              </h1>

              <p className="mt-3 text-blue-100 text-lg">
                Share your ideas, tutorials and experiences with the community.
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
              placeholder="Enter an attractive title..."
              className="w-full border-2 border-gray-200 rounded-xl p-4 focus:outline-none focus:border-blue-500 transition"
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
              placeholder="Technology"
              className="w-full border-2 border-gray-200 rounded-xl p-4 focus:outline-none focus:border-blue-500 transition"
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
              placeholder="react,nodejs,mongodb"
              className="w-full border-2 border-gray-200 rounded-xl p-4 focus:outline-none focus:border-blue-500 transition"
            />

          </div>

          {/* Thumbnail */}

          <div>

            <label className="flex items-center gap-2 font-semibold mb-4">

              <Image size={20} />

              Thumbnail

            </label>

            <label className="border-2 border-dashed border-blue-300 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition">

              <UploadCloud
                size={60}
                className="text-blue-500"
              />
              {formData.thumbnail && (
              <p className="mt-4 text-green-600 font-semibold">
                  ✅ {formData.thumbnail.name}
              </p>
          )}

              <p className="mt-5 font-semibold text-lg">

                Click to Upload Thumbnail

              </p>

              <p className="text-gray-500 mt-2">

                JPG • PNG • WEBP

              </p>

             <div>

  <label className="flex items-center gap-2 font-semibold mb-3">

    Thumbnail

  </label>

  <label className="border-2 border-dashed border-blue-300 rounded-2xl p-6 flex flex-col items-center cursor-pointer hover:bg-blue-50 transition">

    {preview ? (

      <img
        src={preview}
        alt="Preview"
        className="w-full h-56 object-cover rounded-xl shadow-md"
      />

    ) : (

      <>
        <p className="text-5xl">🖼️</p>

        <p className="mt-4 text-gray-500">
          Click to upload thumbnail
        </p>
      </>

    )}

    <input
      type="file"
      name="thumbnail"
      accept="image/*"
      onChange={handleChange}
      className="hidden"
    />

  </label>

</div>

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
              placeholder="Start writing your amazing blog here..."
              className="w-full border-2 border-gray-200 rounded-2xl p-5 focus:outline-none focus:border-blue-500 transition resize-none leading-8"
            />

          </div>

          {/* Preview */}

          {formData.thumbnail && (

            <div>

              <h3 className="font-semibold text-lg mb-4">

                Thumbnail Preview

              </h3>

              <img
                src={URL.createObjectURL(formData.thumbnail)}
                alt="Preview"
                className="w-full h-80 object-cover rounded-2xl shadow-lg"
              />

            </div>

          )}

          {/* Tips */}

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">

            <h3 className="font-bold text-blue-700 mb-3">

              💡 Writing Tips

            </h3>

            <ul className="space-y-2 text-gray-600">

              <li>• Keep your title short and attractive.</li>

              <li>• Use paragraphs for better readability.</li>

              <li>• Add relevant tags to improve discoverability.</li>

              <li>• Upload a high-quality thumbnail.</li>

            </ul>

          </div>

          {/* Publish Button */}

          <div className="flex justify-end pt-4">

            <button
              type="submit"
              disabled={loading}
              className="px-10 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-lg shadow-lg hover:scale-105 hover:shadow-2xl transition-all disabled:opacity-60 disabled:hover:scale-100"
            >

              {loading ? (

                <div className="flex items-center gap-3">

                  <svg
                    className="animate-spin h-6 w-6"
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

                  Publishing...

                </div>

              ) : (

                "🚀 Publish Post"

              )}

            </button>

          </div>

        </form>

      </div>

    </MainLayout>
  );
};

export default CreatePost;