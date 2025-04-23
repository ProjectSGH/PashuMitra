import React from 'react'
import HeroSection from "../../components/MedicalStore/Home/HeroSection"
import StatsCards from "../../components/MedicalStore/Home/StatsCards"
import StoreServices from "../../components/MedicalStore/StoreServices"

const Home_Medical = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow">
        <HeroSection />
        <div className="container mx-auto px-4 py-8">
          <StatsCards />
          <StoreServices />
        </div>
      </main>
      
    </div>
  )
}

export default Home_Medical
