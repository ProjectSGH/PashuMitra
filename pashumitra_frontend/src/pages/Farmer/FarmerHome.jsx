import WelcomeSection from "../../components/Farmer/Home/WelcomeSection_Farmer"
import FarmerServices from "../../components/Farmer/Home/Service_Farmer"
import Footer from "../../components/Footer"

export default function Home() {
  return (
    <div className="h-auto flex flex-col bg-gray-50">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-6">
          <WelcomeSection />
          <FarmerServices />
        </div>
      </main>
    </div>
  )
}
