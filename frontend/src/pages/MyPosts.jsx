import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";
import PostCard from "../components/PostCard";
import toast from "react-hot-toast";


const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchMyPosts = async () => {

        try {

            const response = await api.get("/posts/my-posts");

            setPosts(response.data.data);

        } catch (error) {

            console.error(error);

            toast.error("Failed to fetch your posts");

        } finally {

            setLoading(false);

        }

    };

    fetchMyPosts();

}, []);

return (

<MainLayout>

<div className="max-w-6xl mx-auto px-8 py-10">

<h1 className="text-5xl font-bold">
My Posts
</h1>

<p className="text-gray-500 mt-2">
Manage all your published blogs.
</p>
{loading && (

<h2 className="mt-16 text-center text-xl">

Loading...

</h2>

)}

{!loading && posts.length === 0 && (

<div className="text-center mt-20">

<h2 className="text-3xl font-bold">
No Posts Yet 📭
</h2>

<p className="text-gray-500 mt-4">
Start sharing your first blog.
</p>

</div>

)}

{posts.length > 0 && (

<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-10">

{posts.map((post)=>(

<PostCard
key={post._id}
post={post}
/>

))}

</div>

)}
</div>

</MainLayout>

)
};

export default MyPosts;