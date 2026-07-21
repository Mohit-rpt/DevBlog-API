import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import AuthContext from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      logout();
      closeMobileMenu();
      toast.success("Logged out successfully 👋");
      navigate("/");
    } catch (error) {
      console.error(error);
      logout();
      closeMobileMenu();
      navigate("/login");
      toast.error(error.response?.data?.message || "Logout Failed");
    }
  };

  const navLinks = (
    <>
      <Link
        to="/"
        onClick={closeMobileMenu}
        className="rounded-xl px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-blue-50 hover:text-blue-600 sm:text-base"
      >
        Home
      </Link>

      {user && (
        <Link
          to="/create-post"
          onClick={closeMobileMenu}
          className="rounded-xl px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-blue-50 hover:text-blue-600 sm:text-base"
        >
          Create Post
        </Link>
      )}

      <Link
        to="/bookmarks"
        onClick={closeMobileMenu}
        className="rounded-xl px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-blue-50 hover:text-blue-600 sm:text-base"
      >
        Bookmarks
      </Link>

      <Link
        to="/my-posts"
        onClick={closeMobileMenu}
        className="rounded-xl px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-blue-50 hover:text-blue-600 sm:text-base"
      >
        My Posts
      </Link>

      <Link
        to="/profile"
        onClick={closeMobileMenu}
        className="rounded-xl px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-blue-50 hover:text-blue-600 sm:text-base"
      >
        Profile
      </Link>
    </>
  );

  const authActions = user ? (
    <button
      onClick={handleLogout}
      className="rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 sm:text-base"
    >
      Logout
    </button>
  ) : (
    <>
      <Link
        to="/login"
        onClick={closeMobileMenu}
        className="rounded-full px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-blue-600 sm:text-base"
      >
        Login
      </Link>

      <Link
        to="/register"
        onClick={closeMobileMenu}
        className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 sm:text-base"
      >
        Register
      </Link>
    </>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="flex shrink-0 items-center gap-2"
        >
          <div className="flex items-baseline gap-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
            <span className="text-blue-600">Dev</span>
            <span className="text-gray-900">Blog</span>
          </div>
          <span className="text-2xl">🚀</span>
        </Link>

        <div className="hidden items-center gap-2 lg:flex xl:gap-4">
          {navLinks}
        </div>

        <div className="hidden items-center gap-3 lg:flex">{authActions}</div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((current) => !current)}
          className="inline-flex items-center justify-center rounded-full border border-gray-200 p-2 text-gray-700 transition hover:bg-gray-50 lg:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileMenuOpen ? (
        <div className="border-t border-gray-100 bg-white lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-2">{navLinks}</div>

            <div className="flex flex-col gap-3 border-t border-gray-100 pt-4">
              {authActions}
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;
