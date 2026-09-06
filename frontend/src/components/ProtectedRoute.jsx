import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useSelector((store) => store.user);

  // If user is not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If admin access is required but user is not an admin
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;