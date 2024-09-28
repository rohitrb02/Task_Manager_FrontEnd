import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google'; // Import GoogleLogin from the new package
import BASE_URL from '../services/helper'


const Register = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      setErrorMessage("Passwords do not match"); // Set error message
      return;
    }
    setErrorMessage(''); // Clear error message if passwords match
    try {
      console.log(data);
      await axios.post(`${BASE_URL}/api/auth/register`, data);
      navigate("/login"); // Redirect to login after successful registration
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      console.log(credentialResponse);
      const token = credentialResponse.credential;
      await axios.post('http://localhost:5000/api/auth/google', { token });
      navigate('/'); // Navigate to the homepage after Google sign-in
    } catch (error) {
      console.error('Google Sign-in error:', error);
    }
  };

  const handleGoogleError = () => {
    console.error('Google Sign-in failed');
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Register</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="text"
                {...register('firstName')}
                className="block w-full px-4 py-2 text-sm text-gray-900 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="First Name"
                required
              />
            </div>
            <div className="relative">
              <input
                type="text"
                {...register('lastName')}
                className="block w-full px-4 py-2 text-sm text-gray-900 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Last Name"
                required
              />
            </div>
          </div>

          <div className="relative">
            <input
              type="email"
              {...register('email')}
              className="block w-full px-4 py-2 text-sm text-gray-900 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Email address"
              required
            />
          </div>

          <div className="relative">
            <input
              type="password"
              {...register('password')}
              className="block w-full px-4 py-2 text-sm text-gray-900 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Password"
              required
            />
          </div>

          <div className="relative">
            <input
              type="password"
              {...register('confirmPassword')}
              className="block w-full px-4 py-2 text-sm text-gray-900 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Confirm Password"
              required
            />
          </div>

          {errorMessage && (
            <div className="text-red-600 text-sm mb-2">{errorMessage}</div> // Display error message
          )}

          <button
            type="submit"
            className="w-full px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
          >
            Submit
          </button>
        </form>

        {/* Google Sign-up Button */}
        <div className="mt-4">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </div>

        {/* Link to Login */}
        <div className="mt-6 text-center">
          <span className="text-gray-600">Already have an account? </span>
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
