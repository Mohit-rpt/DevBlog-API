import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UploadCloud,
  Image,
  ArrowRight,
  BookOpen,
} from "lucide-react";

const Register = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    avatar: null,
    coverImage: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const registerData = new FormData();

      registerData.append("fullname", formData.fullname);
      registerData.append("username", formData.username);
      registerData.append("email", formData.email);
      registerData.append("password", formData.password);

      if (formData.avatar) {
        registerData.append("avatar", formData.avatar);
      }

      if (formData.coverImage) {
        registerData.append("coverImage", formData.coverImage);
      }

      await api.post("/auth/register", registerData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Account created successfully 🎉");

      navigate("/login");

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
          "Registration Failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gray-100">

      {/* LEFT */}

      <div className="hidden lg:flex bg-gradient-to-br from-purple-600 via-pink-600 to-rose-500 text-white p-16 flex-col justify-center">

        <div className="flex items-center gap-4">

          <BookOpen size={55} />

          <h1 className="text-5xl font-extrabold">
            DevBlog
          </h1>

        </div>

        <h2 className="text-4xl font-bold mt-12">
          Join Our Community 🚀
        </h2>

        <p className="mt-6 text-xl leading-9 text-pink-100">

          Create amazing blogs.

          <br />

          Inspire thousands of developers.

          <br />

          Learn, Share & Grow together.

        </p>

      </div>

      {/* RIGHT */}

      <div className="flex justify-center items-center p-8">

        <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-xl">

          <h1 className="text-4xl font-bold text-center">
            Create Account
          </h1>

          <p className="text-center text-gray-500 mt-2 mb-8">
            Start your DevBlog journey today.
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* FULL NAME */}

            <div>

              <label className="font-semibold">
                Full Name
              </label>

              <div className="relative mt-2">

                <User
                  size={20}
                  className="absolute left-4 top-4 text-gray-400"
                />

                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full border-2 border-gray-200 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-pink-500"
                />

              </div>

            </div>

            {/* USERNAME */}

            <div>

              <label className="font-semibold">
                Username
              </label>

              <div className="relative mt-2">

                <User
                  size={20}
                  className="absolute left-4 top-4 text-gray-400"
                />

                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="@username"
                  className="w-full border-2 border-gray-200 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-pink-500"
                />

              </div>

            </div>

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
                  placeholder="example@gmail.com"
                  className="w-full border-2 border-gray-200 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-pink-500"
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
                  placeholder="Create a strong password"
                  className="w-full border-2 border-gray-200 rounded-xl py-4 pl-12 pr-14 focus:outline-none focus:border-pink-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-gray-500 hover:text-pink-600"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>

              </div>

            </div>

            {/* Avatar */}

            <div>

              <label className="flex items-center gap-2 font-semibold mb-3">

                <UploadCloud size={20} />

                Avatar

              </label>

              <label className="border-2 border-dashed border-pink-300 rounded-2xl p-6 flex flex-col items-center cursor-pointer hover:bg-pink-50 transition">

                <UploadCloud
                  size={45}
                  className="text-pink-500"
                />

                <p className="mt-3 font-medium">

                  {formData.avatar
                    ? formData.avatar.name
                    : "Click to upload avatar"}

                </p>

                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />

              </label>

            </div>

            {/* Cover Image */}

            <div>

              <label className="flex items-center gap-2 font-semibold mb-3">

                <Image size={20} />

                Cover Image

              </label>

              <label className="border-2 border-dashed border-pink-300 rounded-2xl p-6 flex flex-col items-center cursor-pointer hover:bg-pink-50 transition">

                <Image
                  size={45}
                  className="text-pink-500"
                />

                <p className="mt-3 font-medium">

                  {formData.coverImage
                    ? formData.coverImage.name
                    : "Click to upload cover image"}

                </p>

                <input
                  type="file"
                  name="coverImage"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />

              </label>

            </div>

            {/* Register Button */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60 disabled:hover:scale-100"
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

                  Creating Account...

                </div>

              ) : (

                <>
                  Create Account
                  <ArrowRight size={20} />
                </>

              )}

            </button>

            {/* Login Link */}

            <p className="text-center text-gray-500 pt-2">

              Already have an account?{" "}

              <Link
                to="/login"
                className="text-pink-600 font-semibold hover:underline"
              >
                Login
              </Link>

            </p>

          </form>

        </div>

      </div>

    </div>
  );
};

export default Register;