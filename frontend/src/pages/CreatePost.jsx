import MainLayout from "../layouts/MainLayout";
import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
    thumbnail: null,
  });
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
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

      if (formData.thumbnail) {
        postData.append("thumbnail", formData.thumbnail);
      }

      console.log([...postData.entries()]);
      const response = await api.post("/posts/create", postData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data);

      setFormData({
        title: "",
        content: "",
        category: "",
        tags: "",
        thumbnail: null,
      });

      alert("Post created successfully!");

      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);
  return (
    <MainLayout>
      <h1 className="text-3xl font-bold p-8">Create Post</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 space-y-6"
      >
        <div>
          <label className="block font-medium mb-2">Title</label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter post title"
            className="w-full border rounded-md p-3"
          />
        </div>
        <div>
          <label className="block font-medium mb-2">Content</label>

          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="8"
            placeholder="Write your blog here..."
            className="w-full border rounded-md p-3"
          ></textarea>
        </div>
        <div>
          <label className="block font-medium mb-2">Category</label>

          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Technology"
            className="w-full border rounded-md p-3"
          />
        </div>
        <div>
          <label className="block font-medium mb-2">Tags</label>

          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="react,nodejs,javascript"
            className="w-full border rounded-md p-3"
          />
        </div>
        <div>
          <label className="block font-medium mb-2">Thumbnail</label>

          <input
            type="file"
            name="thumbnail"
            onChange={handleChange}
            accept="image/*"
            className="w-full border rounded-md p-3"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Publishing..." : "Publish Post"}
        </button>
      </form>
    </MainLayout>
  );
};

export default CreatePost;
