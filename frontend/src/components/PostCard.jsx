import { useNavigate } from "react-router-dom";

const PostCard = ({ post }) => {

    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/post/${post._id}`)}
        className="
                    group
                    bg-white
                    rounded-2xl
                    overflow-hidden
                    shadow-md
                    hover:shadow-2xl
                    hover:-translate-y-2
                    transition-all
                    duration-300
                    cursor-pointer
                    border
                    "
        >

          <img
            src={
                post.thumbnail ||
                "https://placehold.co/600x400?text=DevBlog"
            }
            alt={post.title}
           className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
        />

            <div className="p-5">

                <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {post.category}
                </span>

                <h2 className="text-2xl font-bold mt-4 group-hover:text-blue-600 transition">
                    {post.title}
                </h2>

              <p className="text-gray-600 mt-3 leading-7">
                {post.content.length > 150
                    ? post.content.slice(0, 150) + "..."
                    : post.content}
            </p>

                <div className="flex justify-between items-center mt-5">

                    <p className="text-sm text-gray-500">
                        By {post.author.fullname}
                    </p>

                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                       Read More →
                    </button>

                </div>

            </div>

        </div>
    );
};

export default PostCard;