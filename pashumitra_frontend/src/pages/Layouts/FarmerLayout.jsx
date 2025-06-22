import Navbar from "../../components/Farmer/Farmer_Header";
import Footer from "../../components/Farmer/Farmer_Footer";
import { Outlet } from "react-router-dom";

const FarmerLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
export default FarmerLayout;
