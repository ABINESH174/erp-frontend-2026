// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>; //Show loader until user is fetched

  if (!user) return <Navigate to="/login-page" />; //If not logged in → redirect

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />; //If role is not allowed
  }

  return children; //Render the page if authenticated
};

export default ProtectedRoute;
