import { Outlet } from "react-router-dom";
import FarmerNavbar from "../../components/Farmer/Navbar_Farmer";
// import FarmerDashboard from "../Home";
const FarmerLayout = () => {
  return (
    <>
      {/* <FarmerNavbar /> */}
      <Outlet />

    </>
  );
};

export default FarmerLayout;
