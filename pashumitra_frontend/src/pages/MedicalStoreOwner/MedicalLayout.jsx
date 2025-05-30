import { Outlet } from "react-router-dom";
import MedicalNavbar from "../../components/MedicalStore/Navbar";

import Footer from "../../components/MedicalStore/Footer"
const MedicalLayout = () => {
  return (
    <>
      <MedicalNavbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default MedicalLayout;
