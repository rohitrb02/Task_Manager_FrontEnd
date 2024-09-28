import React from "react";
import { Route, Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const isAuthenticated = !!localStorage.getItem("token"); // Check if user is authenticated

  return isAuthenticated ? <Outlet /> : <Navigate to="login" />;
};

export default PrivateRoute;
