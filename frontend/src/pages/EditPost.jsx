import MainLayout from "../layouts/MainLayout";
import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";


const EditPost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
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
useEffect(() => {

    const fetchPost = async () => {

        try {

            const response = await api.get(
                `/posts/${id}`
            );

            const post = response.data.data;
            console.log(post.tags);
            setFormData({
                title: post.title,
                content: post.content,
                category: post.category,
                tags: post.tags.join(", "),
                thumbnail: null
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

        const response = await api.put(
            `/posts/${id}`,
            {
                title: formData.title,
                content: formData.content,
                category: formData.category,
                tags: formData.tags
                    .split(",")
                    .map(tag => tag.trim())
            }
        );

        console.log(response.data);

        alert("Post updated successfully!");

        navigate(`/post/${id}`);

    } catch (error) {

        console.error(error);

    }
};
  useEffect(() => {
    console.log(formData);
  }, [formData]);
  return (
    <MainLayout>
      <h1 className="text-3xl font-bold p-8">Edit Post</h1>
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
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
        >
            Update Post
        </button>
      </form>
    </MainLayout>
  );
};

export default EditPost;
