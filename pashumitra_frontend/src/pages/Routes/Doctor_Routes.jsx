import { Route } from "react-router-dom";
import ProtectedRoute from "../../pages/Routes/ProtectedRoutes";
import DoctorLayout from "../../pages/Layouts/DoctorLayout";
import HomeDoctor from "../../pages/Doctor/Home_Doctor";

const DoctorRoutes = (
  <Route element={<ProtectedRoute role="Doctor" />}>
    <Route path="/doctor" element={<DoctorLayout />}>
      <Route index element={<HomeDoctor />} />
      <Route path="home" element={<HomeDoctor />}/>
    </Route>
  </Route>
);

export default DoctorRoutes;
