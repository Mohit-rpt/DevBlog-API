import MainLayout from "../layouts/MainLayout";

const CreatePost = () => {
    return (
        <MainLayout>
            <h1 className="text-3xl font-bold p-8">
                Create Post
            </h1>
            <form className="bg-white shadow-md rounded-lg p-6 space-y-6">
                <div>
                    <label className="block font-medium mb-2">
                        Title
                    </label>

                    <input
                        type="text"
                        name="title"
                        placeholder="Enter post title"
                        className="w-full border rounded-md p-3"
                    />
                </div>
                <div>
                    <label className="block font-medium mb-2">
                        Content
                    </label>

                    <textarea
                        name="content"
                        rows="8"
                        placeholder="Write your blog here..."
                        className="w-full border rounded-md p-3"
                    ></textarea>
                </div>
                <div>
                    <label className="block font-medium mb-2">
                        Category
                    </label>

                    <input
                        type="text"
                        name="category"
                        placeholder="Technology"
                        className="w-full border rounded-md p-3"
                    />
                </div>
                <div>
                    <label className="block font-medium mb-2">
                        Tags
                    </label>

                    <input
                        type="text"
                        name="tags"
                        placeholder="react,nodejs,javascript"
                        className="w-full border rounded-md p-3"
                    />
                </div>
                <div>
                    <label className="block font-medium mb-2">
                        Thumbnail
                    </label>

                    <input
                        type="file"
                        name="thumbnail"
                        accept="image/*"
                        className="w-full border rounded-md p-3"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
                >
                    Publish Post
                </button>
            </form>
        </MainLayout>
    );
};

export default CreatePost;