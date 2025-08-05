// src/components/ProtectedRoute.js
import { Navigate } from "react-router-dom";
import { AuthService } from "../Api/AuthService";

const ProtectedRoute = ({ children, allowedRoles }) => {
  // const { user, loading } = useAuth();
  const user = AuthService.getCurrentUser();

 // if (loading) return <p>Loading...</p>; //Show loader until user is fetched

  if (!user) return <Navigate to="/login-page" />; //If not logged in → redirect

  if (allowedRoles && !allowedRoles.includes(user.userRole)) {
    return <Navigate to="/login-page" />; //If role is not allowed
  }

  return children; //Render the page if authenticated
};

export default ProtectedRoute;
