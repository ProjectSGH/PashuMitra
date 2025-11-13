import { useEffect, useState } from "react";
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
import ContactUs from "./pages/ContactUs";
import DoctorSignup from "./pages/Doctor/Signup_Doctor";
import MedicalSignup from "./pages/MedicalStore/medical_signup";
import doctorRoutes from "./pages/Routes/Doctor_Routes";
import FarmerRoutes from "./pages/Routes/Farmer_Routes";
import MedicalStoreRoutes from "./pages/Routes/MedicalStore_Routes";
import LoadingScreen from "./pages/Layouts/Loader"; 
import ForgotPassword from "./pages/FotgotPassword";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 500); // 3.5 sec
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <>
      <Toaster position="bottom-right" />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/signup" element={<RoleSelector />} />
          <Route path="/signup/farmer" element={<FarmerSignup />} />
          <Route path="/signup/doctor" element={<DoctorSignup />} />
          <Route path="/signup/store" element={<MedicalSignup />} />

          {doctorRoutes}
          {FarmerRoutes}
          {MedicalStoreRoutes}
        </Routes>
      </Router>
    </>
  );
}

export default App;
