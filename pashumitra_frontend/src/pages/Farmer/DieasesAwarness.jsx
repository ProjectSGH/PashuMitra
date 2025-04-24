import HeroSection from "../../components/Farmer/DieaseAwarness_Farmer/HeroSection_Farmer"
import DiseaseList from "../../components/Farmer/DieaseAwarness_Farmer/DieaseList_Farmer"
import SymptomsList from "../../components/Farmer/DieaseAwarness_Farmer/Symptoms_Farmer"
import PreventionTips from "../../components/Farmer/DieaseAwarness_Farmer/PreventionTips_Farmer"
import CTASection from "../../components/Farmer/DieaseAwarness_Farmer/CTASection_Farmer"

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <div className="container mx-auto px-4 py-8">
        <DiseaseList />
        <SymptomsList />
        <PreventionTips />
        <CTASection />
      </div>
    </main>
  )
}
