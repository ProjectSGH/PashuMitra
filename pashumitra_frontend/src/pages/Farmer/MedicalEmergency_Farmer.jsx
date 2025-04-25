"use client"

import { useState } from "react"
import {
  AlertTriangle,
  Ambulance,
  ArrowRight,
  Clock,
  Heart,
  MapPin,
  Phone,
  Pill,
  Stethoscope,
  Thermometer,
  Timer,
  User,
} from "lucide-react"

export default function EmergencyHelpline() {
  const [selectedEmergency, setSelectedEmergency] = useState("")
  const [showSolutions, setShowSolutions] = useState(false)
  const [helpRequested, setHelpRequested] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const emergencyTypes = [
    { id: "injury", name: "Injury", icon: <AlertTriangle className="w-6 h-6" /> },
    { id: "illness", name: "Illness", icon: <Pill className="w-6 h-6" /> },
    { id: "pregnancy", name: "Pregnancy", icon: <Heart className="w-6 h-6" /> },
    { id: "heatstroke", name: "Heatstroke", icon: <Thermometer className="w-6 h-6" /> },
  ]

  const immediateSolutions = {
    injury: [
      "Clean the wound with clean water",
      "Apply pressure to stop bleeding",
      "Keep the animal calm and still",
      "Elevate the injured area if possible",
    ],
    illness: [
      "Keep the animal in a quiet, comfortable space",
      "Ensure access to clean water",
      "Monitor breathing and temperature",
      "Do not force feed the animal",
    ],
    pregnancy: [
      "Prepare a clean, quiet area",
      "Keep other animals away",
      "Have clean towels ready",
      "Monitor contractions and timing",
    ],
    heatstroke: [
      "Move animal to shade immediately",
      "Apply cool (not cold) water to body",
      "Offer small amounts of water to drink",
      "Use a fan to increase air circulation",
    ],
  }

  const nearbyCenters = [
    {
      name: "County Animal Hospital",
      distance: "3.2 miles",
      eta: "12 min",
      phone: "(555) 123-4567",
    },
    {
      name: "Farmland Veterinary Clinic",
      distance: "5.8 miles",
      eta: "18 min",
      phone: "(555) 234-5678",
    },
    {
      name: "Rural Animal Emergency",
      distance: "7.1 miles",
      eta: "22 min",
      phone: "(555) 345-6789",
    },
  ]

  const trackingSteps = [
    "Emergency request received",
    "Veterinarian notified",
    "Help is on the way",
    "Veterinarian arriving soon",
  ]

  const handleEmergencySelect = (emergencyId) => {
    setSelectedEmergency(emergencyId)
    setShowSolutions(true)
    window.scrollTo({ top: document.getElementById("solutions").offsetTop - 20, behavior: "smooth" })
  }

  const requestHelp = () => {
    setHelpRequested(true)
    // Simulate progress updates
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < trackingSteps.length - 1) {
          return prev + 1
        } else {
          clearInterval(interval)
          return prev
        }
      })
    }, 5000) // Update every 5 seconds
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 sticky top-0 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Ambulance className="w-8 h-8" />
            <h1 className="text-xl font-bold">Animal Emergency Helpline</h1>
          </div>
          <a href="tel:911" className="flex items-center space-x-1 bg-red-500 px-3 py-2 rounded-full">
            <Phone className="w-4 h-4" />
            <span className="font-bold">911</span>
          </a>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Emergency Selection Form */}
        <section className="mb-8">
          <div className="bg-blue-50 p-4 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-bold text-blue-800 mb-2 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Select Emergency Type
            </h2>
            <p className="text-blue-700 mb-4">Choose the type of emergency your animal is experiencing</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {emergencyTypes.map((emergency) => (
              <button
                key={emergency.id}
                onClick={() => handleEmergencySelect(emergency.id)}
                className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center space-y-2 transition-all ${
                  selectedEmergency === emergency.id
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <div className={`${selectedEmergency === emergency.id ? "text-blue-600" : "text-gray-600"}`}>
                  {emergency.icon}
                </div>
                <span
                  className={`font-medium ${selectedEmergency === emergency.id ? "text-blue-700" : "text-gray-700"}`}
                >
                  {emergency.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Immediate Solutions */}
        {showSolutions && (
          <section id="solutions" className="mb-8 scroll-mt-20">
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg shadow-sm mb-6">
              <h2 className="text-xl font-bold text-orange-800 mb-2 flex items-center">
                <Timer className="w-5 h-5 mr-2" />
                Take These Steps Immediately
              </h2>
              <p className="text-orange-700 mb-2">While waiting for professional help, follow these steps:</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
              <ul className="space-y-3">
                {immediateSolutions[selectedEmergency].map((solution, index) => (
                  <li key={index} className="flex items-start">
                    <div className="bg-orange-100 text-orange-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-gray-700">{solution}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Request Help Button */}
        {showSolutions && !helpRequested && (
          <section className="mb-8">
            <button
              onClick={requestHelp}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg flex items-center justify-center space-x-2 transition-all"
            >
              <Ambulance className="w-6 h-6" />
              <span className="text-lg">Request Emergency Veterinary Help</span>
            </button>
          </section>
        )}

        {/* Live Tracker */}
        {helpRequested && (
          <section className="mb-8">
            <div className="bg-blue-50 p-4 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-bold text-blue-800 mb-2 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Live Status Tracker
              </h2>
              <p className="text-blue-700 mb-2">We're coordinating emergency help for your animal</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
              <div className="space-y-6">
                {trackingSteps.map((step, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className={`relative flex items-center justify-center ${index <= currentStep ? "text-green-500" : "text-gray-300"}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                          index <= currentStep ? "border-green-500 bg-green-50" : "border-gray-300"
                        }`}
                      >
                        {index < currentStep ? (
                          "✓"
                        ) : index === currentStep ? (
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        ) : (
                          index + 1
                        )}
                      </div>
                      {index < trackingSteps.length - 1 && (
                        <div
                          className={`absolute top-8 h-10 w-0.5 ${
                            index < currentStep ? "bg-green-500" : "bg-gray-200"
                          }`}
                        ></div>
                      )}
                    </div>
                    <div className="ml-4">
                      <p className={`font-medium ${index <= currentStep ? "text-green-700" : "text-gray-500"}`}>
                        {step}
                      </p>
                      {index === currentStep && <p className="text-sm text-green-600 animate-pulse">In progress...</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Nearby Centers */}
        {helpRequested && (
          <section className="mb-8">
            <div className="bg-blue-50 p-4 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-bold text-blue-800 mb-2 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Nearby Animal Care Centers
              </h2>
              <p className="text-blue-700 mb-2">These centers are closest to your location</p>
            </div>

            <div className="space-y-4">
              {nearbyCenters.map((center, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-800">{center.name}</h3>
                      <div className="flex items-center text-gray-600 text-sm mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{center.distance}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-green-600 font-medium">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>ETA: {center.eta}</span>
                      </div>
                      <a
                        href={`tel:${center.phone}`}
                        className="inline-flex items-center text-blue-600 mt-2 text-sm font-medium"
                      >
                        <Phone className="w-3 h-3 mr-1" />
                        {center.phone}
                      </a>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between">
                    <button className="text-blue-600 text-sm font-medium flex items-center">
                      View details
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </button>
                    <button className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center">
                      <Stethoscope className="w-3 h-3 mr-1" />
                      Request this center
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact Form */}
        {helpRequested && (
          <section className="mb-8">
            <div className="bg-blue-50 p-4 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-bold text-blue-800 mb-2 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Your Contact Information
              </h2>
              <p className="text-blue-700 mb-2">Help the veterinarian reach you quickly</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Farm Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your farm address"
                  />
                </div>
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any additional information that might help the veterinarian"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
                >
                  Update Information
                </button>
              </form>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p className="mb-2">Animal Emergency Helpline - Available 24/7</p>
          <div className="flex justify-center space-x-4">
            <a href="tel:18005551234" className="flex items-center text-blue-600">
              <Phone className="w-4 h-4 mr-1" />
              1-800-555-1234
            </a>
            <span className="text-gray-400">|</span>
            <a href="#" className="text-blue-600">
              Privacy Policy
            </a>
            <span className="text-gray-400">|</span>
            <a href="#" className="text-blue-600">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
