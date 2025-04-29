import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AboutPage from "./pages/About";
import SignupForm from "./pages/Signup";
import LoginForm from "./pages/Login";
import FarmerHome from "./pages/Farmer/FarmerHome";
import Profile from "./pages/userprofile";
import Home from "./pages/Home";
import FarmerLayout from "./pages/Farmer/FarmerLayout";
import FarmerMedicineBank from "./pages/Farmer/FarmerMedicineBank";
import MedicineTransportSystem from "./pages/Farmer/MedicineTransportSystem_Farmer";
import DieasesAwarness from "./pages/Farmer/DieasesAwarness";
import MedicalEmergency from "./pages/Farmer/MedicalEmergency_Farmer";
import ExpertChatApp from "./pages/Farmer/ExpertChat_Farmer";
// Medical Store
import MedicalLayout from "./pages/MedicalStoreOwner/MedicalLayout";
import HomeMedical from "./pages/MedicalStoreOwner/Home_Medical";
import Transport from "./pages/MedicalStoreOwner/transportRequests";
import RequestMedicines from "./pages/MedicalStoreOwner/requestMedicines";
import InventoryManagement from "./pages/MedicalStoreOwner/InventoryManagement_Madical";

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

          {/* Farmer Protected Routes */}
          <Route element={<ProtectedRoute role="Farmer" />}>
            <Route path="/farmer" element={<FarmerLayout />}>
              <Route index element={<FarmerHome />} />
              <Route path="home" element={<FarmerHome />} />
              <Route path="profile" element={<Profile />} />
              <Route path="medicinebank" element={<FarmerMedicineBank />} />
              <Route path="dieasesawarness" element={<DieasesAwarness />} />
              <Route path="transport" element={<MedicineTransportSystem />} />
              <Route path="emergency" element={<MedicalEmergency />} />
              <Route path="chat" element={<ExpertChatApp />} />
              <Route path="about" element={<AboutPage />} />
            </Route>
          </Route>

          {/* Medical Store Protected Routes */}
          <Route element={<ProtectedRoute role="MedicalStore" />}>
            <Route path="/medicalstore" element={<MedicalLayout />}>
              <Route index element={<HomeMedical />} />
              <Route path="home" element={<HomeMedical />} />
              <Route path="profile" element={<Profile />} />
              <Route path="transport" element={<Transport />} />
              <Route path="request-medicines" element={<RequestMedicines />} />
              <Route path="inventorymanagement" element={<InventoryManagement />} />
              <Route path="about" element={<AboutPage />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
