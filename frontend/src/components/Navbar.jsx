import { Link } from "react-router-dom";

const Navbar = () => {
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
          <Link to="/login" className="hover:text-gray-200 transition">
            Login
          </Link>
          <Link to="/register" className="hover:text-gray-200 transition">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
