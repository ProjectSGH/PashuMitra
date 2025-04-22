import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignupForm from "./pages/Signup";
import LoginForm from "./pages/Login";
import FarmerDashboard from "./pages/Farmer/Dashboard_Farmer";
import FarmerLayout from "./pages/Farmer/FarmerLayout"; // ⬅️ new layout

const ProtectedRoute = ({ role, children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const allowedRoles = ["Farmer", "Doctor", "Medical"]; // List of valid roles
  
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
          path="/farmer"
          element={
            <ProtectedRoute role="farmer">
              <FarmerLayout />
            </ProtectedRoute>
          }
        >
          {/* Set the "dashboard" as the index route */}
          <Route index element={<FarmerDashboard />} />{" "}
          {/* This will be the default for /farmer */}
          <Route path="dashboard" element={<FarmerDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
