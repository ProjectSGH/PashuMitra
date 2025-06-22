import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ role }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    console.log("User not logged in. Redirecting to login.");
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    console.log(`Access denied. User role is ${user.role}, required: ${role}`);
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
