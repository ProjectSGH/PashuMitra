import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import FarmerSignup from "./pages/Farmer/Signup_Farmer";
import RoleSelector from "./pages/RoleSelector";
import LoginForm from "./pages/Login";
import Home from "./pages/Home";

// Modular Routes
import doctorRoutes from "./pages/Routes/Doctor_Routes";
import FarmerRoutes from "./pages/Routes/Farmer_Routes";

function App() {
  return (
    <>
      <Toaster position="bottom-right" />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<RoleSelector />} />
          <Route path="/signup/farmer" element={<FarmerSignup />} />

          {/* Role-based Routes */}
          {doctorRoutes}
          {FarmerRoutes}

        </Routes>
      </Router>
    </>
  );
}

export default App;
