import { Route } from "react-router-dom";
// import ProtectedRoute from "../../pages/Routes/ProtectedRoutes";
import MedicalLayout from "../../pages/Layouts/MedicalStoreLayout";
import MedicalHome from "../MedicalStore/dashboard";
import InventoryManagement from "../MedicalStore/inventory-management";
import MedicineRequests from "../MedicalStore/medicine-requests";
import TransferManagement from "../MedicalStore/transfer-management";
import TransportManagement from "../MedicalStore/transport-management";
import CommunityMedicineBank from "../MedicalStore/community-medicine-bank";
import StoreProfileSettings from "../MedicalStore/store-profile-settings";

const MedicalStoreRoutes = (
  // <Route element={<ProtectedRoute role="MedicalStore" />}>
    <Route path="/Medical" element={<MedicalLayout />}>
      <Route index element={<MedicalHome />} />
      <Route path="home" element={<MedicalHome />} />
      <Route path="inventory" element={<InventoryManagement />} />
      <Route path="Requests" element={<MedicineRequests />} />
      <Route path="Transfer" element={<TransferManagement />} />
      <Route path="Transport" element={<TransportManagement />} />
      <Route path="community-bank" element={<CommunityMedicineBank />} />
      <Route path="Profile" element={<StoreProfileSettings />} />
    </Route>
  // </Route>
);

export default MedicalStoreRoutes;