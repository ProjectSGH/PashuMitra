import { CheckCircle } from "lucide-react"

export default function PreventionTips() {
  const tips = [
    {
      id: 1,
      tip: "Regular vaccinations according to recommended schedules",
      description: "Follow veterinarian-recommended vaccination protocols for your specific livestock.",
    },
    {
      id: 2,
      tip: "Proper sanitation of animal housing and equipment",
      description: "Clean and disinfect barns, stalls, and equipment regularly to prevent disease spread.",
    },
    {
      id: 3,
      tip: "Isolate sick animals immediately",
      description: "Separate sick animals from the herd to prevent disease transmission to healthy animals.",
    },
    {
      id: 4,
      tip: "Clean feeding equipment thoroughly",
      description: "Regularly clean and sanitize all feeding and watering equipment to prevent contamination.",
    },
    {
      id: 5,
      tip: "Implement biosecurity measures",
      description: "Control farm access, use footbaths, and follow proper protocols when introducing new animals.",
    },
  ]

  return (
    <section className="py-12 bg-gray-50 rounded-xl p-6 my-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Prevention Tips</h2>

      <div className="space-y-6">
        {tips.map((tip) => (
          <div key={tip.id} className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div className="ml-4">
              <h3 className="font-bold text-lg">{tip.tip}</h3>
              <p className="text-gray-600">{tip.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
