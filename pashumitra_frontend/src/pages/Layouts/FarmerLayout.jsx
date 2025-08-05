import { Outlet } from "react-router-dom";
import Navbar from "../../components/Farmer/Farmer_Header";
import Footer from "../../components/Farmer/Farmer_Footer";
import PageTransitionLoader from "./PageTransitionLoader";

const FarmerLayout = () => {
  return (
    <div className="flex flex-col min-h-screen w-screen">
      <Navbar />
      <main className="flex-grow w-screen mx-auto ">
        <PageTransitionLoader>
          <Outlet />
        </PageTransitionLoader>
      </main>
      <Footer />
    </div>
  );
};
export default FarmerLayout;
