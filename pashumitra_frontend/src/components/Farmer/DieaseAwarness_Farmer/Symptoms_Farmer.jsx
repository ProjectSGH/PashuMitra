import { AlertCircle, Droplet, Skull, Thermometer, Activity, EyeOff } from "lucide-react"

export default function SymptomsList() {
  const symptoms = [
    {
      id: 1,
      name: "Fever",
      animals: ["Cattle", "Sheep", "Goats"],
      icon: Thermometer,
      color: "bg-red-100 text-red-600",
    },
    {
      id: 2,
      name: "Bleeding",
      animals: ["Pigs", "Cattle"],
      icon: Droplet,
      color: "bg-red-100 text-red-600",
    },
    {
      id: 3,
      name: "Lethargy",
      animals: ["All livestock"],
      icon: Activity,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      id: 4,
      name: "Sudden Death",
      animals: ["Cattle", "Sheep"],
      icon: Skull,
      color: "bg-gray-100 text-gray-600",
    },
    {
      id: 5,
      name: "Inflammation",
      animals: ["Cattle", "Goats"],
      icon: AlertCircle,
      color: "bg-orange-100 text-orange-600",
    },
    {
      id: 6,
      name: "Blindness",
      animals: ["Sheep", "Cattle"],
      icon: EyeOff,
      color: "bg-purple-100 text-purple-600",
    },
  ]

  return (
    <section className="py-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Common Symptoms</h2>

      {/* Mobile scrollable view */}
      <div className="md:hidden overflow-x-auto pb-4">
        <div className="flex space-x-4" style={{ minWidth: "max-content" }}>
          {symptoms.map((symptom) => (
            <div key={symptom.id} className="flex-shrink-0 w-64 bg-white p-4 rounded-lg shadow-md">
              <div className={`w-10 h-10 rounded-full ${symptom.color} flex items-center justify-center mb-3`}>
                <symptom.icon className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg mb-1">{symptom.name}</h3>
              <p className="text-sm text-gray-600">Affects: {symptom.animals.join(", ")}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop grid view */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
        {symptoms.map((symptom) => (
          <div key={symptom.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className={`w-12 h-12 rounded-full ${symptom.color} flex items-center justify-center mb-4`}>
              <symptom.icon className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-xl mb-2">{symptom.name}</h3>
            <p className="text-gray-600">Affects: {symptom.animals.join(", ")}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
