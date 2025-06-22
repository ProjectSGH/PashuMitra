import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import SignupForm from "./pages/Signup";
import LoginForm from "./pages/Login";
import Home from "./pages/Home";
import Doctor_Home from "./pages/Doctor/Home_Doctor";
import DoctorLayout from "./pages/Layouts/DoctorLayout";

// Role-based Route Protection
const ProtectedRoute = ({ role }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    console.log("User not logged in. Redirecting to login.");
    return <Navigate to="/login" />;
  }

  if (user.role !== role) {
    console.log(`Access denied for role: ${user.role}. Required: ${role}`);
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

function App() {
  return (
    <>
      <Toaster position="bottom-right" />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />

          {/* Protected Doctor Routes */}
          <Route element={<ProtectedRoute role="Doctor" />}>
            <Route path="/doctor" element={<DoctorLayout />}>
              <Route path="home" element={<Doctor_Home />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
