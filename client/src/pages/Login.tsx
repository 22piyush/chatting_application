import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { loginUser, getUser } from "../store/slices/authSlice";
import AuthImagePattern from "../components/AuthImagePattern";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { isLoggingIn} = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await dispatch(loginUser(formData));
    await dispatch(getUser());
  };

  return (
    <div className="min-h-screen flex">
      
      {/* LEFT SIDE - FORM */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 bg-gray-950 text-white px-6">
        
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm space-y-5"
        >
          <h2 className="text-3xl font-bold text-center mb-6">
            Welcome Back 👋
          </h2>

          <div>
            <label className="text-sm text-gray-400">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-md bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-md bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-blue-600 py-3 rounded-md hover:bg-blue-700 transition"
          >
            {isLoggingIn ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>

      {/* RIGHT SIDE - ANIMATION */}
      <AuthImagePattern
        title="Welcome Back!"
        subtitle="Login to continue your journey with us 🚀"
      />
    </div>
  );
}

export default Login;