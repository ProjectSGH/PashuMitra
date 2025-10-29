import { Route } from "react-router-dom";
import ProtectedRoute from "../../pages/Routes/ProtectedRoutes";
import FarmerLayout from "../../pages/Layouts/FarmerLayout";
import FarmerHome from "../../pages/Farmer/Home_Farmer";
import MedicineSearch from "../../pages/Farmer/MedicineSearch_Farmer";
import NearByStore from "../../pages/Farmer/NearByStore_Farmer";
import ConsultDoctor from "../Farmer/ConsultToDoctor_Farmer";
import Awareness from "../Farmer/Awareness_Farmer";
import CommunityMedicineBank from "../Farmer/ComunityMedicineBank_Farmer";
import UserProfile from "../Farmer/UserProfile_Farmer";
import Contact from "../ContactUsForm";
import ConsultationHistory from "../Farmer/ConsultationHistory_Farmer";
import FarmerNotificationsPage from "../Farmer/Notification_Farmer";

const FarmerRoutes = (
  <Route element={<ProtectedRoute role="Farmer" />}>
    <Route path="/farmer" element={<FarmerLayout />}>
      <Route index element={<FarmerHome />} />
      <Route path="home" element={<FarmerHome />} />
      <Route path="medicine-search" element={<MedicineSearch />} />
      <Route path="nearbystore" element={<NearByStore />} />
      <Route path="doctor-consult" element={<ConsultDoctor />} />
      <Route path="awareness" element={<Awareness />} />
      <Route path="community-bank" element={<CommunityMedicineBank />} />
      <Route path="my-consultations" element={<ConsultationHistory />} />
      <Route path="contact" element={<Contact />} />
      <Route path="profile" element={<UserProfile />} />
      <Route path="notifications" element={<FarmerNotificationsPage />} />
    </Route>
  </Route>
);

export default FarmerRoutes;
