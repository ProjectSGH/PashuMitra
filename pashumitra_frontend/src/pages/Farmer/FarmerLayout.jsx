import { Outlet } from "react-router-dom";
import FarmerNavbar from "../../components/Farmer/Navbar_Farmer";
import Footer from "../../components/Footer";
const FarmerLayout = () => {
  return (
    <>
      <FarmerNavbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default FarmerLayout;
