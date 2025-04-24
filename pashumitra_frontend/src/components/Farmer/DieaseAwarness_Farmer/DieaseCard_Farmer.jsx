import { WormIcon as Virus, Thermometer, HeartPulse, AlertTriangle } from "lucide-react"

export default function DiseaseCard({ disease }) {
  const icons = {
    virus: Virus,
    thermometer: Thermometer,
    heartPulse: HeartPulse,
    alertTriangle: AlertTriangle,
  }

  const Icon = icons[disease.icon]

  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${disease.iconBg}`}>
        <Icon className={`h-6 w-6 ${disease.iconColor}`} />
      </div>
      <h3 className="text-xl font-bold mb-2">{disease.name}</h3>
      <p className="text-gray-600 mb-4">{disease.description}</p>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
        Learn More
      </button>
    </div>
  )
}
