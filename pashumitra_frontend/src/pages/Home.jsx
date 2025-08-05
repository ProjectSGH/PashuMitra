import Navbar from "../components/Common/Navbar"
import Hero from "../components/Common/Hero"
import HowItWorks from "../components/Common/HowItWorks"
import Features from "../components/Common/Features"
import ProcessFlow from "../components/Common/Processflow"
import WhyToChoose from "../components/Common/WhyToChoose"
import Roles from "../components/Roles"
import Footer from "../components/Footer"
import ProjectInfo from "../components/Common/ProjectInfo"

const FarmerDashboard = () => {
  return (
    <div className="w-full bg-gray-50">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <ProcessFlow />
      <WhyToChoose />
      <ProjectInfo />
      <Roles />
      <Footer />
    </div>
  )
}

export default FarmerDashboard
