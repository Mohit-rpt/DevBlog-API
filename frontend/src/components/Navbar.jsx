import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = async () => {
  try {
    const response = await api.post("/auth/logout");

    console.log(response.data);

    logout();

    toast.success("Logged out successfully 👋");

    navigate("/");
  } catch (error) {
    console.error(error);

    toast.error(
      error.response?.data?.message || "Logout Failed"
    );
  }
};
 return (
  <nav className="bg-white shadow-md sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">

      {/* Logo */}
      <Link
        to="/"
        className="text-4xl font-extrabold tracking-tight"
      >
        <span className="text-blue-600">Dev</span>
        <span className="text-gray-900">Blog</span>
        <span className="ml-2">🚀</span>
      </Link>

      {/* Navigation */}
      <div className="flex items-center gap-10">

        <Link
          to="/"
          className="text-lg font-medium hover:text-blue-600 transition"
        >
          Home
        </Link>

        {user && (
          <Link
            to="/create-post"
            className="text-lg font-medium hover:text-blue-600 transition"
          >
            Create Post
          </Link>
          
        )}
                <Link
            to="/bookmarks"
            className="font-medium hover:text-blue-600 transition"
        >
            Bookmarks
        </Link>

      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">

        {user ? (
          <>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl font-semibold transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="font-medium hover:text-blue-600"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
            >
              Register
            </Link>
          </>
        )}

      </div>

    </div>
  </nav>
);
};
export default Navbar;
