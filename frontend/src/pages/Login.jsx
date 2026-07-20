import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import AuthContext from "../context/AuthContext";
import toast from "react-hot-toast";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  BookOpen,
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      login(response.data.data.user);

      toast.success("Login Successful 🚀");

      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gray-100">

      {/* LEFT */}

      <div className="hidden lg:flex bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white p-16 flex-col justify-center">

        <div className="flex items-center gap-4">

          <BookOpen size={55} />

          <h1 className="text-5xl font-extrabold">
            DevBlog
          </h1>

        </div>

        <h2 className="text-4xl font-bold mt-12">
          Welcome Back 👋
        </h2>

        <p className="mt-6 text-xl leading-9 text-blue-100">

          Continue your blogging journey.

          <br />

          Read inspiring articles.

          <br />

          Share your knowledge.

          <br />

          Connect with developers worldwide.

        </p>

      </div>

      {/* RIGHT */}

      <div className="flex justify-center items-center p-8">

        <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">

          <h1 className="text-4xl font-bold text-center">
            Login
          </h1>

          <p className="text-center text-gray-500 mt-2 mb-8">
            Login to continue to DevBlog
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* EMAIL */}

            <div>

              <label className="font-semibold">
                Email
              </label>

              <div className="relative mt-2">

                <Mail
                  size={20}
                  className="absolute left-4 top-4 text-gray-400"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full border-2 border-gray-200 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500 transition"
                />

              </div>

            </div>
                        {/* PASSWORD */}

            <div>

              <label className="font-semibold">
                Password
              </label>

              <div className="relative mt-2">

                <Lock
                  size={20}
                  className="absolute left-4 top-4 text-gray-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full border-2 border-gray-200 rounded-xl py-4 pl-12 pr-14 focus:outline-none focus:border-blue-500 transition"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-gray-500 hover:text-blue-600"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>

              </div>

            </div>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-xl hover:scale-[1.02] transition disabled:opacity-60 disabled:hover:scale-100"
              active:scale-95
            >

              {loading ? (

                <div className="flex items-center gap-3">

                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="white"
                      strokeWidth="4"
                      opacity="0.25"
                    />

                    <path
                      fill="white"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />

                  </svg>

                  Logging in...

                </div>

              ) : (

                <>
                  Login to DevBlog
                  <ArrowRight size={20} />
                </>

              )}

            </button>

            {/* REGISTER LINK */}

            <p className="text-center text-gray-500 pt-4">

              Don't have an account?{" "}

              <Link
                to="/register"
                className="text-blue-600 font-semibold hover:underline"
              >
                Register
              </Link>

            </p>

          </form>

        </div>

      </div>

    </div>
  );
};

export default Login;