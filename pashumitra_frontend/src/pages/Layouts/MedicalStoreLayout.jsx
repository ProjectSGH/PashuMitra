import { Outlet } from "react-router-dom";
import Navbar from "../../components/Medical/Medical_Header";
import Footer from "../../components/Medical/Medical_footer";
import PageTransitionLoader from "./PageTransitionLoader";

const MedicalStoreLayout = () => {
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
export default MedicalStoreLayout;
