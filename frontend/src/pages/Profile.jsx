import { useContext, useEffect, useRef, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import PostCard from "../components/PostCard";
import api from "../services/api";
import toast from "react-hot-toast";
import { FileText, Bookmark, User } from "lucide-react";
import AuthContext from "../context/AuthContext";

const Profile = () => {
    const { login } = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);
    const [editForm, setEditForm] = useState({
        fullname: "",
        username: ""
    });
    const avatarInputRef = useRef(null);
    const coverInputRef = useRef(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const [userRes, postsRes, bookmarksRes] = await Promise.all([
                    api.get("/auth/getCurrentUser"),
                    api.get("/posts/my-posts"),
                    api.get("/bookmarks/bookmarkedPosts")
                ]);

                setUser(userRes.data.data);
                setPosts(postsRes.data.data);
                setBookmarks(bookmarksRes.data.data.posts);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    useEffect(() => {
        if (!user) {
            return;
        }

        setEditForm({
            fullname: user.fullname || "",
            username: user.username || ""
        });
    }, [user]);

    const openEditModal = () => {
        setEditForm({
            fullname: user?.fullname || "",
            username: user?.username || ""
        });
        setIsEditOpen(true);
    };

    const closeEditModal = () => {
        if (saving) {
            return;
        }

        setIsEditOpen(false);
    };

    const handleProfileUpdate = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);

            const payload = {
                fullname: editForm.fullname.trim(),
                username: editForm.username.trim().toLowerCase()
            };

            const response = await api.patch("/auth/updateProfile", payload);
            const updatedUser = response.data.data;

            setUser((currentUser) => ({
                ...currentUser,
                ...updatedUser
            }));
            login({
                ...user,
                ...updatedUser
            });
            setIsEditOpen(false);
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error(error);
            toast.error(
                error?.response?.data?.message || "Failed to update profile"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarPick = () => {
        avatarInputRef.current?.click();
    };

    const handleCoverPick = () => {
        coverInputRef.current?.click();
    };

    const uploadProfileImage = async (file, endpoint, setUploading, successMessage) => {
        if (!file) {
            return;
        }

        const imageForm = new FormData();
        const fieldName = endpoint.includes("avatar") ? "avatar" : "coverImage";

        imageForm.append(fieldName, file);

        try {
            setUploading(true);

            const response = await api.patch(endpoint, imageForm, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            const updatedUser = response.data.data;

            setUser((currentUser) => ({
                ...currentUser,
                ...updatedUser
            }));
            login({
                ...user,
                ...updatedUser
            });

            toast.success(successMessage);
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="h-[70vh] flex items-center justify-center">
                    <h1 className="text-3xl font-bold animate-pulse">
                        Loading Profile...
                    </h1>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="bg-white rounded-3xl overflow-hidden shadow-xl mb-10">
                    <div className="relative h-56 group">
                        {user?.coverImage ? (
                            <img
                                src={user.coverImage}
                                alt="Cover"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700" />
                        )}

                        <button
                            type="button"
                            onClick={handleCoverPick}
                            className="absolute top-4 right-4 rounded-full bg-black/50 px-4 py-2 text-sm font-semibold text-white opacity-0 transition group-hover:opacity-100"
                        >
                            {uploadingCover ? "Uploading..." : "Change Cover"}
                        </button>

                        <input
                            ref={coverInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) => {
                                const file = event.target.files?.[0];
                                event.target.value = "";
                                uploadProfileImage(
                                    file,
                                    "/auth/coverImageUpdate",
                                    setUploadingCover,
                                    "Cover image updated successfully"
                                );
                            }}
                        />
                    </div>

                    <div className="relative px-8 pb-8">
                        <div className="absolute -top-16 left-1/2 -translate-x-1/2 md:left-10 md:translate-x-0 group/avatar">
                            <img
                                src={user?.avatar}
                                alt="Avatar"
                                className="w-32 h-32 rounded-full border-[6px] border-white object-cover shadow-2xl bg-white"
                            />

                            <button
                                type="button"
                                onClick={handleAvatarPick}
                                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-sm font-semibold text-white opacity-0 transition group-hover/avatar:opacity-100"
                            >
                                {uploadingAvatar ? "Uploading..." : "Change"}
                            </button>

                            <input
                                ref={avatarInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(event) => {
                                    const file = event.target.files?.[0];
                                    event.target.value = "";
                                    uploadProfileImage(
                                        file,
                                        "/auth/avatarUpdate",
                                        setUploadingAvatar,
                                        "Avatar updated successfully"
                                    );
                                }}
                            />
                        </div>

                        <div className="pt-20 md:pt-6 md:pl-40 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="text-center md:text-left">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {user?.fullname || user?.username}
                                </h1>
                                <p className="text-gray-500 mt-2">@{user?.username}</p>
                                <p className="text-gray-400 text-sm mt-1">{user?.email}</p>

                                <div className="flex justify-center md:justify-start gap-2 mt-4 flex-wrap">
                                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                                        Developer
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm">
                                        Blogger
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={openEditModal}
                                className="mt-6 md:mt-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-xl transition"
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    <div className="bg-blue-50 rounded-2xl p-6 flex items-center gap-5 shadow-sm hover:shadow-lg transition">
                        <div className="bg-blue-600 text-white p-4 rounded-xl">
                            <FileText size={30} />
                        </div>

                        <div>
                            <p className="text-gray-500">Posts</p>
                            <h2 className="text-3xl font-bold">{posts.length}</h2>
                        </div>
                    </div>

                    <div className="bg-green-50 rounded-2xl p-6 flex items-center gap-5 shadow-sm hover:shadow-lg transition">
                        <div className="bg-green-600 text-white p-4 rounded-xl">
                            <Bookmark size={30} />
                        </div>

                        <div>
                            <p className="text-gray-500">Bookmarks</p>
                            <h2 className="text-3xl font-bold">{bookmarks.length}</h2>
                        </div>
                    </div>

                    <div className="bg-purple-50 rounded-2xl p-6 flex items-center gap-5 shadow-sm hover:shadow-lg transition">
                        <div className="bg-purple-600 text-white p-4 rounded-xl">
                            <User size={30} />
                        </div>

                        <div>
                            <p className="text-gray-500">Account</p>
                            <h2 className="text-2xl font-bold text-purple-600">
                                DevBlog Member
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="mt-14">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900">
                                Recent Posts
                            </h2>
                            <p className="text-gray-500 mt-2">
                                Explore all blogs you've published recently.
                            </p>
                        </div>
                    </div>

                    {posts.length === 0 ? (
                        <div className="bg-white rounded-3xl shadow-md py-20 text-center">
                            <h2 className="text-3xl font-bold">No Posts Yet</h2>
                            <p className="text-gray-500 mt-3">
                                Start writing your first blog.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {posts.map((post) => (
                                <PostCard key={post._id} post={post} />
                            ))}
                        </div>
                    )}
                </div>

                {isEditOpen ? (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <div
                            className="absolute inset-0 bg-black/50"
                            onClick={closeEditModal}
                        />

                        <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        Edit Profile
                                    </h3>
                                    <p className="text-gray-500 text-sm mt-1">
                                        Update your name and username.
                                    </p>
                                </div>

                                <button
                                    onClick={closeEditModal}
                                    className="text-gray-400 hover:text-gray-700 text-2xl leading-none"
                                >
                                    x
                                </button>
                            </div>

                            <form onSubmit={handleProfileUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.fullname}
                                        onChange={(event) =>
                                            setEditForm((current) => ({
                                                ...current,
                                                fullname: event.target.value
                                            }))
                                        }
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        placeholder="Your full name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.username}
                                        onChange={(event) =>
                                            setEditForm((current) => ({
                                                ...current,
                                                username: event.target.value
                                            }))
                                        }
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        placeholder="username"
                                    />
                                </div>

                                <div className="flex items-center gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={closeEditModal}
                                        className="flex-1 rounded-xl border border-gray-200 px-4 py-3 font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-medium text-white hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        {saving ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                ) : null}
            </div>
        </MainLayout>
    );
};

export default Profile;