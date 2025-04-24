import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import SignupForm from "./pages/Signup";
import LoginForm from "./pages/Login";
import FarmerHome from "./pages/Farmer/FarmerHome";
import Profile from "./pages/userprofile";
import Home from "./pages/Home";
import FarmerLayout from "./pages/Farmer/FarmerLayout"; 
import FarmerMedicineBank from "./pages/Farmer/FarmerMedicineBank"
//Medical Store
import MedicalLayout from "./pages/MedicalStoreOwner/MedicalLayout"; // ⬅️ new layout
import HomeMedical from "./pages/MedicalStoreOwner/Home_Medical";
import Transport from "./pages/MedicalStoreOwner/transportRequests";
import RequestMedicines from "./pages/MedicalStoreOwner/requestMedicines";
import InventoryManagement from "./pages/MedicalStoreOwner/InventoryManagement_Madical";


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
    <>
      <Toaster position="bottom-right" />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />

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
            <Route path="home" element={<HomeMedical />} />
            <Route path="profile" element={<Profile />} />{" "}
            <Route path="transport" element={<Transport />} />
            <Route path="request-medicines" element={<RequestMedicines />} />
            <Route path="inventorymanagement" element={<InventoryManagement />} />
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
            <Route index element={<FarmerHome />} />
            <Route path="home" element={<FarmerHome />} />
            <Route path="profile" element={<Profile />} />{" "}
            <Route path="medicinebank" element={<FarmerMedicineBank />} />{" "}
            {/* ✅ This profile inherits FarmerLayout */}
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
