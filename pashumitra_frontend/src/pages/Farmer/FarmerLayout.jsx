import { Outlet } from "react-router-dom";
import FarmerNavbar from "../../components/Farmer/Navbar_Farmer";
import FarmerDashboard from "./Dashboard_Farmer";
const FarmerLayout = () => {
  return (
    <>
      <FarmerNavbar />
      <Outlet />

    </>
  );
};

export default FarmerLayout;
