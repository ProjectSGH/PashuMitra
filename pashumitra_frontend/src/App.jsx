import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignupForm from './pages/Signup';
import LoginForm from './pages/Login';
import FarmerDashboard from './pages/Farmer/Dashboard_Farmer';
import './App.css';
// Simulated current user
const currentUser = {
  name: "Dhruv",
  role: "farmer", // change this manually to "medical" or "doctor" to test
};

const ProtectedRoute = ({ role, children }) => {
  if (currentUser.role !== role) {
    return <Navigate to="/" />;
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

        {/* Farmer Dashboard */}
        <Route path="/farmer/*" element={
          <ProtectedRoute role="farmer">
              <Routes>
                <Route path="dashboard" element={<FarmerDashboard />} />
              </Routes>
          </ProtectedRoute>
        } />

        {/* Medical Store Dashboard */}
        <Route path="/medical/*" element={
          <ProtectedRoute role="medical">
              <Routes>
                {/* <Route path="dashboard" element={<MedicalDashboard />} /> */}
              </Routes>
          </ProtectedRoute>
        } />

        {/* Doctor Dashboard */}
        <Route path="/doctor/*" element={
          <ProtectedRoute role="doctor">
              <Routes>
                {/* <Route path="dashboard" element={<DoctorDashboard />} /> */}
              </Routes>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
