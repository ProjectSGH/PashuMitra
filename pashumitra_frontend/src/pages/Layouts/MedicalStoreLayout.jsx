import { Outlet } from "react-router-dom";
import Navbar from "../../components/MedicalStore/Medical_Header";
import Footer from "../../components/MedicalStore/Medical_footer";
import PageTransitionLoader from "./PageTransitionLoader";

const MedicalStoreLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <PageTransitionLoader>
          <Outlet />
        </PageTransitionLoader>
      </main>
      <Footer />
    </div>
  );
};
export default MedicalStoreLayout;
