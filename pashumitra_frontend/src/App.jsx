import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import FarmerSignup from "./pages/Farmer/Signup_Farmer";
import RoleSelector from "./pages/RoleSelector";
import LoginForm from "./pages/Login";
import About from "./pages/About";
import Home from "./pages/Home";
import DoctorSignup from "./pages/Doctor/Signup_Doctor";
import MedicalSignup from "./pages/MedicalStore/medical_signup";

// Modular Routes
import doctorRoutes from "./pages/Routes/Doctor_Routes";
import FarmerRoutes from "./pages/Routes/Farmer_Routes";
import MedicalStoreRoutes from "./pages/Routes/MedicalStore_Routes";

function App() {
  return (
    <>
      <Toaster position="bottom-right" />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          
          {/* Authentication Routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<RoleSelector />} />
          <Route path="/signup/farmer" element={<FarmerSignup />} />
          <Route path="/signup/doctor" element={<DoctorSignup />} />
          <Route path="/signup/store" element={<MedicalSignup />} />
          

          {/* Role-based Routes */}
          {doctorRoutes}
          {FarmerRoutes}
          {MedicalStoreRoutes}

          {/* Fallback Route */}

        </Routes>
      </Router>
    </>
  );
}

export default App;
