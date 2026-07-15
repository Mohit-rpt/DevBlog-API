import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useContext } from "react"
import AuthContext from "../context/AuthContext"

const Login = () => {

    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {

        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));

    };

    const handleSubmit = async (e) => {
      e.preventDefault()

      try{
            // Backend ko login request bhej rahe hain
        const response = await api.post(
            "/auth/login",
            {
                email: formData.email,
                password: formData.password
            }
        );
         // Backend ka response console me dekhne ke liye
         login(response.data.data.user);

        alert("Login Successful!");

        // Home page pr redirect
        navigate("/");

      }catch (error){

        console.error(error);

        alert(
            error.response?.data?.message || "Login Failed"
        );
      }
     
  }

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">

                <h1 className="text-3xl font-bold text-center mb-6">

                    Login

                </h1>

                <form onSubmit = {handleSubmit}
                      className="space-y-4">

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2"
                    />

                    <button
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                    >
                        Login
                    </button>

                </form>

            </div>

        </div>

    );

};

export default Login;