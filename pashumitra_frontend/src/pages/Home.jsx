import Navbar from "../components/Common/Navbar"
import Hero from "../components/Common/Hero"
import Features from "../components/Common/Features"
import Roles from "../components/Roles"
import Footer from "../components/Footer"

const FarmerDashboard = () => {
  return (
    <div className="w-full bg-gray-50">
      <Navbar />
      <Hero />
      <Features />
      <Roles />
      <Footer />
    </div>
  )
}

export default FarmerDashboard
