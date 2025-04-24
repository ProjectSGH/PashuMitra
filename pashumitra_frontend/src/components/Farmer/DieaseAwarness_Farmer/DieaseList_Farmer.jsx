import DiseaseCard from "./DieaseCard_Farmer"

export default function DiseaseList() {
  const diseases = [
    {
      id: 1,
      name: "Foot-and-Mouth Disease",
      description: "A highly contagious viral disease affecting cloven-hoofed animals like cattle, sheep, and pigs.",
      icon: "virus",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      id: 2,
      name: "Mastitis",
      description: "An inflammation of the mammary gland and udder tissue, commonly affecting dairy cattle.",
      icon: "thermometer",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      id: 3,
      name: "Anthrax",
      description: "A serious infectious disease caused by bacteria that can affect both animals and humans.",
      icon: "alertTriangle",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      id: 4,
      name: "Brucellosis",
      description: "A bacterial infection that affects various livestock and can be transmitted to humans.",
      icon: "heartPulse",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ]

  return (
    <section className="py-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Common Animal Diseases</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {diseases.map((disease) => (
          <DiseaseCard key={disease.id} disease={disease} />
        ))}
      </div>
    </section>
  )
}
