import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignupForm from "./pages/Signup";
import LoginForm from "./pages/Login";
import FarmerDashboard from "./pages/Farmer/Dashboard_Farmer";
import Profile from "./pages/userprofile";
import HomeMedical from "./pages/MedicalStoreOwner/Home_Medical";
import FarmerLayout from "./pages/Farmer/FarmerLayout"; // ⬅️ new layout
import MedicalLayout from "./pages/MedicalStoreOwner/MedicalLayout"; // ⬅️ new layout

const ProtectedRoute = ({ role, children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const allowedRoles = ["Farmer", "Doctor", "MedicalStore"]; // List of valid roles

  // Check if the user is not logged in or does not have one of the allowed roles
  if (!user || !allowedRoles.includes(user.role)) {
    console.log("Redirecting to login because of invalid role");
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />

        {/* Farmer Routes */}
        <Route
          path="/medicalstore"
          element={
            <ProtectedRoute role="MedicalStore">
              <MedicalLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomeMedical />} />
          <Route path="dashboard" element={<HomeMedical />} />
          <Route path="profile" element={<Profile />} />{" "}
          {/* ✅ This profile inherits MedicalLayout */}
        </Route>

        <Route
          path="/farmer"
          element={
            <ProtectedRoute role="Farmer">
              <FarmerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<FarmerDashboard />} />
          <Route path="dashboard" element={<FarmerDashboard />} />
          <Route path="profile" element={<Profile />} />{" "}
          {/* ✅ This profile inherits FarmerLayout */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
