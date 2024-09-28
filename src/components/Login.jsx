import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import BASE_URL from '../services/helper'

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation(); // To get the current pathname
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const guestUser = {
    email: "guest@gmail.com",
    password: "Test@123",
  };

  useEffect(() => {
    // Check if the current path is the guest route
    if (location.pathname === "/guest") {
      setEmail(guestUser.email);
      setPassword(guestUser.password);
    } else {
      // Clear email and password when navigating to login or other routes
      setEmail("");
      setPassword("");
    }
  }, [location.pathname]); // Depend on pathname to trigger the effect on route change

  const onSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      console.log(email)
      const res = await axios.post(`${BASE_URL}/api/auth/login`, {
        email,
        password,
      });
      console.log(res);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">
          Login
        </h2>
        <form className="space-y-6" onSubmit={onSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900"
            >
              Your email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="abc@gmail.com"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900"
            >
              Your password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="remember"
              className="ml-2 block text-sm text-gray-900"
            >
              Remember me
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
          >
            Submit
          </button>
        </form>

        {error && <div className="mt-4 text-red-600 text-center">{error}</div>}

        <div className="mt-6 text-center">
          <span className="text-gray-600">Don't have an account? </span>
          <Link to="/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
