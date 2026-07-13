import MainLayout from "../layouts/MainLayout.jsx";
import api from "../services/api.js";
import { useEffect, useState } from "react";

const Home = () => {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

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

            <div className="max-w-5xl mx-auto p-8">

                <h1 className="text-3xl font-bold mb-6">
                    Latest Posts
                </h1>

                {loading ? (

                    <p>Loading...</p>

                ) : (

                    posts.map(post => (

                        <div
                            key={post._id}
                            className="border rounded-lg p-5 mb-5 shadow"
                        >
                            <h2 className="text-2xl font-semibold">
                                {post.title}
                            </h2>

                            <p className="mt-2">
                                {post.content}
                            </p>

                            <p className="mt-4 text-sm text-gray-500">
                                By {post.author.fullname}
                            </p>

                        </div>

                    ))

                )}

            </div>

        </MainLayout>
    );
};

export default Home;