import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignupForm from './pages/Signup';
import LoginForm from './pages/Login';

import FarmerLayout from './components/Layout/FarmerLayout';
import MedicalStoreLayout from './components/Layout/MedicalLayout';
import DoctorLayout from './components/Layout/DoctorLayout';

import FarmerDashboard from './pages/Farmer/Dashboard_Farmer';
import MedicalDashboard from './pages/MedicalStoreOwner/Dashboard_Medical';
import DoctorDashboard from './pages/Doctor/Dashboard_Doctor';
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
            <FarmerLayout>
              <Routes>
                <Route path="dashboard" element={<FarmerDashboard />} />
              </Routes>
            </FarmerLayout>
          </ProtectedRoute>
        } />

        {/* Medical Store Dashboard */}
        <Route path="/medical/*" element={
          <ProtectedRoute role="medical">
            <MedicalStoreLayout>
              <Routes>
                <Route path="dashboard" element={<MedicalDashboard />} />
              </Routes>
            </MedicalStoreLayout>
          </ProtectedRoute>
        } />

        {/* Doctor Dashboard */}
        <Route path="/doctor/*" element={
          <ProtectedRoute role="doctor">
            <DoctorLayout>
              <Routes>
                <Route path="dashboard" element={<DoctorDashboard />} />
              </Routes>
            </DoctorLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
