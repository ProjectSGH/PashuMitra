import Hero from "../../components/Farmer/Home/Hero_Farmer"
import Features from "../../components/Farmer/Home/Features_Farmer"
import Roles from "../../components/Roles"
import Footer from "../../components/Footer"

const FarmerDashboard = () => {
  return (
    <div className="w-full bg-gray-50">
      <Hero />
      <Features />
      <Roles />
      <Footer />
    </div>
  )
}

export default FarmerDashboard
