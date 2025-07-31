import { Route } from "react-router-dom";
import ProtectedRoute from "../../pages/Routes/ProtectedRoutes";
import MedicalLayout from "../../pages/Layouts/MedicalStoreLayout";
import MedicalHome from "../MedicalStore/dashboard";

const MedicalStoreRoutes = (
  // <Route element={<ProtectedRoute role="MedicalStore" />}>
    <Route path="/Medical" element={<MedicalLayout />}>
      <Route index element={<MedicalHome />} />
      <Route path="home" element={<MedicalHome />} />
    </Route>
  // </Route>
);

export default MedicalStoreRoutes;