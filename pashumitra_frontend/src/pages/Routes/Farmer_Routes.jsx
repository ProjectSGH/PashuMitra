import { Route } from "react-router-dom";
import ProtectedRoute from "../../pages/Routes/ProtectedRoutes";
import FarmerLayout from "../../pages/Layouts/FarmerLayout";
import FarmerHome from "../../pages/Farmer/Home_Farmer";
import MedicineSearch from "../../pages/Farmer/MedicineSearch_Farmer";
const FarmerRoutes = (
  <Route element={<ProtectedRoute role="Farmer" />}>
    <Route path="/farmer" element={<FarmerLayout />}>
      <Route index element={<FarmerHome />} />
      <Route path="home" element={<FarmerHome />} />
      <Route path="medicine-search" element={<MedicineSearch />} />
    </Route>
  </Route>
);

export default FarmerRoutes;
