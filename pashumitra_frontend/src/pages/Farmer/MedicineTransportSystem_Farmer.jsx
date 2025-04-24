"use client"

import { useState } from "react"
import Header from "../../components/Farmer/Trasnport_Farmer/TransportHeader_Farmer"
import MedicineForm from "../../components/Farmer/Trasnport_Farmer/MedicineForm_Farmer"
import StoreSuggestionCard from "../../components/Farmer/Trasnport_Farmer/StoreSuggestionCard_Farmer"
import TransportStatus from "../../components/Farmer/Trasnport_Farmer/TransportStatus_Farmer"

export default function MedicineTransportSystem() {
  const [medicineName, setMedicineName] = useState("")
  const [selectedNearbyStore, setSelectedNearbyStore] = useState(null)
  const [selectedAlternateStore, setSelectedAlternateStore] = useState(null)
  const [transportRequested, setTransportRequested] = useState(false)
  const [showStatus, setShowStatus] = useState(false)

  const handleRequestTransport = () => {
    if (medicineName && selectedNearbyStore && selectedAlternateStore) {
      setTransportRequested(true)
      setShowStatus(true)
    }
  }

  const resetForm = () => {
    setMedicineName("")
    setSelectedNearbyStore(null)
    setSelectedAlternateStore(null)
    setTransportRequested(false)
    setShowStatus(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Header />

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div>
          <MedicineForm
            medicineName={medicineName}
            setMedicineName={setMedicineName}
            selectedNearbyStore={selectedNearbyStore}
            setSelectedNearbyStore={setSelectedNearbyStore}
            selectedAlternateStore={selectedAlternateStore}
            setSelectedAlternateStore={setSelectedAlternateStore}
            onRequestTransport={handleRequestTransport}
            transportRequested={transportRequested}
          />
        </div>

        <div className="flex flex-col gap-6">
          {selectedAlternateStore && <StoreSuggestionCard store={selectedAlternateStore} medicineName={medicineName} />}

          {showStatus && (
            <TransportStatus
              transportRequested={transportRequested}
              medicineName={medicineName}
              fromStore={selectedAlternateStore?.name || ""}
              toStore={selectedNearbyStore?.name || ""}
              estimatedTime={selectedAlternateStore?.estimatedDeliveryTime || 0}
              onReset={resetForm}
            />
          )}
        </div>
      </div>
    </div>
  )
}
