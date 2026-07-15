import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try{
   
      const response = await api.post("/auth/logout");
      console.log(response.data);
      logout()
      alert("Logout Successful!");
      navigate("/")
    }catch (error){
      console.error(error);
      console.log(error.response);
      console.log(error.response?.data);
    console.log(error.response?.status);
    }
  }
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <Link to="/" className="text-2xl font-bold">
        DevBlog
      </Link>
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <div className="flex gap-6">
          <Link to="/" className="hover:text-gray-200 transition">
            Home
          </Link>

          {user ? (
            <>
              <Link
                to="/create-post"
                className="hover:text-gray-200 transition"
              >
                Create Post
              </Link>

              <button
                onClick={handleLogout}
                className="hover:text-gray-200 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-200 transition">
                Login
              </Link>

              <Link to="/register" className="hover:text-gray-200 transition">
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
