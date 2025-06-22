import { Route } from "react-router-dom";
import ProtectedRoute from "../../pages/Routes/ProtectedRoutes";
import DoctorLayout from "../../pages/Layouts/DoctorLayout";
import HomeDoctor from "../../pages/Doctor/Home_Doctor";
import Consultations from "../../pages/Doctor/Consultations"; // fixed path
import PatientHistory from "../Doctor/Patient_History";

const DoctorRoutes = (
  <Route element={<ProtectedRoute role="Doctor" />}>
    <Route path="/doctor" element={<DoctorLayout />}>
      <Route index element={<HomeDoctor />} />
      <Route path="home" element={<HomeDoctor />} />
      <Route path="consultations" element={<Consultations />} />
      <Route path="Patient_History" element={<PatientHistory />} />
    </Route>
  </Route>
);

export default DoctorRoutes;
