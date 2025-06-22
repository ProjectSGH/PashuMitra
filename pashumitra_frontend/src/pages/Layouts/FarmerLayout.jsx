import { outlet } from "react-router-dom";
import Navbar from "../../components/Common/Navbar";
import Footer from "../../components/Common/Footer";

const FarmerLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-6">
        {outlet}
      </main>
      <Footer />
    </div>
  );
}
export default FarmerLayout;