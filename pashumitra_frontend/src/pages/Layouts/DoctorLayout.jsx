import { Outlet } from "react-router-dom";
import PageTransitionLoader from "./PageTransitionLoader";
import Navbar from "../../components/Doctor/Doctor_Navbar";
import Footer from "../../components/Doctor/Doctor_Footer";

const DoctorLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-6">
        <PageTransitionLoader>
          <Outlet />
        </PageTransitionLoader>
      </main>
      <Footer />
    </div>
  );
};
export default DoctorLayout;
