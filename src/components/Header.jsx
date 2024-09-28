import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo or Brand Name */}
        <div>
          <Link to="/" className="text-2xl font-bold hover:text-gray-200">Task Manager</Link>
        </div>

        {/* Navigation Links */}
        <nav className="space-x-4">
          {token ? (
            <>
            <Link to="/" className="hover:text-gray-200">Home</Link>

              <Link to="/dashboard" className="hover:text-gray-200">Dashboard</Link>
              <button
                onClick={handleLogout}
                className="hover:text-gray-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
            <Link to="/login" className="hover:text-gray-200">Login</Link>
            <Link to="/guest" className="hover:text-gray-200">Guest</Link>

            </>
            
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
