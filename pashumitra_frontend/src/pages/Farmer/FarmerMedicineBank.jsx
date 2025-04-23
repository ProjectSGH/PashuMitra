"use client"

import { useState } from "react"
import Header from "../../components/Farmer/MedicineBank_Farmer/Header"
import InfoBanner from "../../components/Farmer/MedicineBank_Farmer/InfoBanner"
import SearchBar from "../../components/Farmer/MedicineBank_Farmer/SearchBar"
import TabNavigation from "../../components/Farmer/MedicineBank_Farmer/TabNavigation"
import MedicineGrid from "../../components/Farmer/MedicineBank_Farmer/MedicineGrid"
import RequestList from "../../components/Farmer/MedicineBank_Farmer/RequestList"
import medicines from "../../components/Farmer/MedicineBank_Farmer/Medicine"
import requests from "../../components/Farmer/MedicineBank_Farmer/request"

const App = () => {
  const [activeTab, setActiveTab] = useState("available")

  return (
    <div className="max-w-max p-5 mx-auto my-4 bg-white shadow-lg rounded-lg overflow-hidden">
      <Header />
      <div className="p-4">
        <InfoBanner />
        <SearchBar />
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "available" ? <MedicineGrid medicines={medicines} /> : <RequestList requests={requests} />}
      </div>
    </div>
  )
}

export default App
