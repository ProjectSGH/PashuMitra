import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import SignupForm from "./pages/Signup";
import LoginForm from "./pages/Login";
import Home from "./pages/Home";

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
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />

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
